import React from 'react';
import { Phone, MoreVertical, Send, Smile, Star } from 'lucide-react';
import { renderRichText } from '../../utils';

interface WhatsAppTestimonialsProps {
  testimonials: Array<{
    name: string;
    location?: string;
    text: string;
    rating: number;
    image?: string;
  }>;
  title?: string;
  subtitle?: string;
  isMobilePreview: boolean;
  ds: any;
}

export const WhatsAppTestimonials: React.FC<WhatsAppTestimonialsProps> = ({ 
  testimonials, 
  title, 
  subtitle, 
  isMobilePreview,
  ds
}) => {
  if (!testimonials || testimonials.length === 0) return null;

  // Mensajes de validación genéricos (Burbuja 1)
  const expertValidations = [
    "¡Qué increíble resultado! 🎉 Ese es el poder de aplicar el método paso a paso.",
    "Exacto, la clave está en la constancia. Me alegra mucho ver tu progreso.",
    "¡Esa es la meta! El camino está trazado, solo hay que seguirlo con disciplina.",
    "¡Ver estos avances me motiva a seguir mejorando la formación para todos!"
  ];

  // Frases de cierre específicas (Burbuja 2)
  const closingPhrases = [
    "¡A seguir avanzando! 🚀",
    "¡Felicidades! 🌟 por dar este gran paso",
    "¡A por más! 💰",
    "¡Vamos con todo! 🔥"
  ];

  // Horarios personalizados por tarjeta
  const chatTimes = [
    { client: "10:45 AM", expert: "10:46 AM" },
    { client: "09:27 PM", expert: "09:28 PM" },
    { client: "11:35 AM", expert: "11:36 AM" }
  ];

  return (
    <section id="testimonios" className={`py-20 md:py-24 ${ds.testimonials.sectionBg} border-t ${ds.testimonials.sectionBorder} relative overflow-hidden`}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className={`text-2xl md:text-5xl font-black mb-4 ${ds.testimonials.titleColor}`}>
            {title || "Historias de Éxito Reales"}
          </h2>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-black ${ds.testimonials.subtitleColor}`}>
            {subtitle || "Nuestra comunidad está logrando resultados increíbles."}
          </p>
        </div>

        <div className={`grid grid-cols-1 gap-8 md:gap-12 max-w-7xl mx-auto ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {testimonials.map((t, i) => {
            const time = chatTimes[i % chatTimes.length];
            const validation = expertValidations[i % expertValidations.length];
            const closing = closingPhrases[i % closingPhrases.length];

            return (
              <div key={i} className="bg-[#E5DDD5] rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-[#0B0B0B] overflow-hidden shadow-2xl relative h-auto flex flex-col group hover:scale-[1.02] transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
                {/* WhatsApp Header */}
                <div className="bg-[#075E54] p-4 md:p-5 flex items-center justify-between text-white shrink-0">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white/20 overflow-hidden shadow-md bg-gray-200">
                      <img src={t.image || `https://randomuser.me/api/portraits/thumb/women/${i + 30}.jpg`} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-base md:text-lg leading-tight">{t.name}</h4>
                      <p className="text-[10px] md:text-xs opacity-80 font-medium">En línea</p>
                    </div>
                  </div>
                  <div className="flex gap-3 md:gap-4 opacity-70">
                    <Phone className="w-5 md:w-6 h-5 md:h-6" />
                    <MoreVertical className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                </div>

                {/* Chat Body */}
                <div className="p-4 space-y-4 md:space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-10">
                  {/* Client Message */}
                  <div className="flex justify-start animate-in slide-in-from-left-6 duration-700">
                    <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl rounded-tl-none shadow-sm max-w-[90%] relative border border-gray-100">
                      <div className="flex gap-0.5 mb-2 text-yellow-500">
                        {[...Array(5)].map((_, starI) => (
                          <Star key={starI} className={`w-3 h-3 ${starI < t.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="text-sm md:text-[0.95rem] text-[#0B0B0B] leading-relaxed font-medium">
                        {renderRichText(t.text)}
                      </div>
                      <span className="text-[8px] md:text-[9px] text-gray-400 block text-right mt-2 font-bold uppercase">{time.client}</span>
                    </div>
                  </div>

                  {/* Expert Reply - Single Bubble (Validation + Closing) */}
                  <div className="flex justify-end animate-in slide-in-from-right-6 duration-1000 delay-500">
                    <div className="bg-[#DCF8C6] p-3 md:p-4 rounded-2xl md:rounded-3xl rounded-tr-none shadow-md max-w-[85%] relative border border-green-200">
                      <p className="text-sm md:text-[0.95rem] text-[#0B0B0B] leading-relaxed font-medium">
                        {validation} {closing}
                      </p>
                      <span className="text-[8px] md:text-[9px] text-green-700 block text-right mt-2 font-bold uppercase tracking-wider">{time.expert} ✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Chat Input Bar */}
                <div className="bg-[#F0F0F0] p-4 md:p-4 flex items-center gap-2 md:gap-3 border-t border-gray-300 shrink-0">
                  <Smile className="w-5 md:w-6 h-5 md:h-6 text-gray-500" />
                  <div className="flex-1 bg-white h-9 md:h-10 rounded-full border border-gray-200 px-4 md:px-6 flex items-center text-xs text-gray-400 italic">Escribe...</div>
                  <div className="w-9 md:w-10 h-9 md:h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white shadow-lg">
                    <Send className="w-4 md:w-5 h-4 md:h-5 fill-current ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};