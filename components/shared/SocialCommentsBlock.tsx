import React, { useState } from 'react';
import { Facebook, ThumbsUp } from 'lucide-react';

interface SocialCommentsBlockProps {
  className?: string;
}

const socialComments = [
  {
    id: 'c1',
    name: 'Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    comment: 'Al principio dudaba porque no sé nada de programación ni de diseñar páginas web, pero seguí el paso a paso del asistente y en menos de 15 minutos ya tenía mi proyecto y mi página de captura montada. Súper intuitivo todo.',
    likes: 47,
    time: 'Hace 2 h',
    reply: {
      id: 'r1',
      name: 'Jorge Franco',
      avatar: '/assets/aistudio/image_5e33d763.png',
      text: '¡Excelente Carlos! Justamente diseñamos la plataforma para que no pierdas tiempo peleando con código o diseños complicados y te enfoques en lanzar rápido. ¡Éxitos con tu embudo!',
      likes: 84,
      time: 'Hace 1 h'
    }
  },
  {
    id: 'c2',
    name: 'Laura Martínez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    comment: 'Confieso que pensé que al darle al botón me iban a pedir tarjeta de crédito al instante, pero me registré gratis sin problema. Ya revisé la guía de implementación, elegí uno de los productos analizados de belleza y hoy capturé mis primeros 14 prospectos.',
    likes: 39,
    time: 'Hace 4 h',
    reply: {
      id: 'r2',
      name: 'Jorge Franco',
      avatar: '/assets/aistudio/image_5e33d763.png',
      text: '¡Bienvenida Laura! Nos alegra mucho que ya estés viendo tus primeros registros. Sigue el paso a paso de la etapa 2 tal como mostramos en los videos y verás cómo escala.',
      likes: 61,
      time: 'Hace 3 h'
    }
  },
  {
    id: 'c3',
    name: 'Andrés Ramírez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    comment: 'Yo había comprado dos cursos antes donde te explican pura teoría pero te dejan solo frente a la pantalla. Aquí la gran diferencia es que ya está todo en un solo lugar: el producto analizado, los guiones para redes, la página y los mensajes de seguimiento listos para copiar.',
    likes: 52,
    time: 'Hace 6 h',
    reply: {
      id: 'r3',
      name: 'Jorge Franco',
      avatar: '/assets/aistudio/image_5e33d763.png',
      text: 'Totalmente de acuerdo Andrés, la diferencia está en tener las herramientas listas para implementar desde el día uno. ¡A darle con todo!',
      likes: 73,
      time: 'Hace 5 h'
    }
  },
  {
    id: 'c4',
    name: 'Sofía Herrera',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    comment: 'Trabajo todo el día en oficina y tengo dos hijos, así que solo tengo un par de horas libres en la noche. Tener los prompts, los videos cortos y las plantillas ya estructuradas me ahorró semanas de trabajo. Muy recomendada la plataforma.',
    likes: 28,
    time: 'Hace 1 día',
    reply: {
      id: 'r4',
      name: 'Jorge Franco',
      avatar: '/assets/aistudio/image_5e33d763.png',
      text: 'Qué orgullo leer esto Sofía. Con constancia en esas horas libres y el sistema trabajando para ti se logran grandes cosas. ¡Un abrazo y seguimos avanzando!',
      likes: 45,
      time: 'Hace 22 h'
    }
  },
  {
    id: 'c5',
    name: 'Julián Torres',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    comment: 'Llevo tres semanas aplicando la estrategia orgánica con el proyecto que elegí dentro de la plataforma. Esta semana cerré mis primeras comisiones en Hotmart usando la guía de WhatsApp y la secuencia de correos. ¡Gracias por compartir este sistema!',
    likes: 64,
    time: 'Hace 2 días',
    reply: {
      id: 'r5',
      name: 'Jorge Franco',
      avatar: '/assets/aistudio/image_5e33d763.png',
      text: '¡Felicitaciones Julián! Esas primeras ventas son la confirmación de que el método funciona cuando se ejecuta paso a paso. Ahora a seguir alimentando tus canales.',
      likes: 91,
      time: 'Hace 1 día'
    }
  }
];

export const SocialCommentsBlock: React.FC<SocialCommentsBlockProps> = ({ className = 'mt-12' }) => {
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="social-comments" className={`w-full max-w-3xl mx-auto bg-white text-[#1C1E21] rounded-2xl border border-gray-200 shadow-2xl p-5 sm:p-7 text-left ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-200 pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm sm:text-base text-[#1C1E21]">34 comentarios</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
          <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
          <span>Comentarios destacados</span>
        </div>
      </div>

      <div className="space-y-6">
        {socialComments.map((item) => {
          const isCommentLiked = !!likedIds[item.id];
          const isReplyLiked = !!likedIds[item.reply.id];
          const commentLikesCount = item.likes + (isCommentLiked ? 1 : 0);
          const replyLikesCount = item.reply.likes + (isReplyLiked ? 1 : 0);

          return (
            <div key={item.id} className="space-y-3">
              {/* Comentario principal del usuario */}
              <div className="flex items-start gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-[#F0F2F5] rounded-2xl px-3.5 py-2.5">
                    <div className="font-bold text-[13px] sm:text-sm text-[#385898] hover:underline cursor-pointer">
                      {item.name}
                    </div>
                    <p className="text-[13px] sm:text-sm text-[#1C1E21] leading-snug mt-0.5 font-normal">
                      {item.comment}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 px-2 text-xs text-[#65676B]">
                    <button
                      type="button"
                      onClick={() => toggleLike(item.id)}
                      className={`font-semibold hover:underline cursor-pointer ${isCommentLiked ? 'text-[#1877F2]' : 'text-[#385898]'}`}
                    >
                      Me gusta
                    </button>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-[#65676B]">
                      <span className="w-4 h-4 rounded-full bg-[#1877F2] inline-flex items-center justify-center text-white">
                        <ThumbsUp className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <span>{commentLikesCount}</span>
                    </span>
                    <span>·</span>
                    <span>{item.time}</span>
                  </div>

                  {/* Respuesta de Jorge Franco */}
                  <div className="mt-3 pl-3 sm:pl-4 border-l-2 border-gray-200 flex items-start gap-2.5">
                    <img
                      src={item.reply.avatar}
                      alt={item.reply.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-[#F0F2F5] rounded-2xl px-3.5 py-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[13px] sm:text-sm text-[#385898]">
                            {item.reply.name}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1877F2]/10 text-[#1877F2]">
                            Autor
                          </span>
                        </div>
                        <p className="text-[13px] sm:text-sm text-[#1C1E21] leading-snug mt-0.5 font-normal">
                          {item.reply.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 px-2 text-xs text-[#65676B]">
                        <button
                          type="button"
                          onClick={() => toggleLike(item.reply.id)}
                          className={`font-semibold hover:underline cursor-pointer ${isReplyLiked ? 'text-[#1877F2]' : 'text-[#385898]'}`}
                        >
                          Me gusta
                        </button>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 text-[#65676B]">
                          <span className="w-4 h-4 rounded-full bg-[#1877F2] inline-flex items-center justify-center text-white">
                            <ThumbsUp className="w-2.5 h-2.5 fill-white" />
                          </span>
                          <span>{replyLikesCount}</span>
                        </span>
                        <span>·</span>
                        <span>{item.reply.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-3.5 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
          Plugin de comentarios sociales
        </span>
        <span>Aprende.Marketing</span>
      </div>
    </div>
  );
};
