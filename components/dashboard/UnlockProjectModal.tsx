import React from 'react';
import { 
  X, Crown, Briefcase, Layers, Video, Globe, Mail, Lock, ArrowRight, Zap 
} from 'lucide-react';
import { Project } from '../../types';

interface UnlockProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUnlockWithPro: (project: Project) => void;
  onUnlockFree?: (project: Project) => void;
  isAtLimit?: boolean;
}

export const UnlockProjectModal: React.FC<UnlockProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onUnlockWithPro,
  onUnlockFree,
  isAtLimit = true
}) => {
  if (!isOpen || !project) return null;

  // Helpers para obtener imagen, título y descripción estilizados
  const getCardImage = (p: Project) => {
    let mm: any = p.multimedia_json;
    if (typeof mm === 'string') {
      try { mm = JSON.parse(mm); } catch { mm = null; }
    }
    if (mm?.heroImages?.[0]) return mm.heroImages[0];
    if ((p as any).image) return (p as any).image;
    const lower = (p.name || '').toLowerCase();
    if (lower.includes('microblading') || lower.includes('cejas')) {
      return 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('manicurista') || lower.includes('uñas') || lower.includes('maquillaje')) {
      return 'https://images.unsplash.com/photo-1596951053942-862d31980696?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('resina') || lower.includes('pisos')) {
      return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80';
  };

  const getCardTitle = (p: Project) => {
    return p.productName || p.name || "Producto Digital";
  };

  const getCardDesc = (p: Project) => {
    return p.shortDescription || (p.description ? p.description.replace(/<[^>]*>?/gm, '') : "Aprende una habilidad de alta demanda y conviértela en un negocio rentable.");
  };

  const projectImg = getCardImage(project);
  const title = getCardTitle(project);
  const desc = getCardDesc(project);
  const category = (project as any).category || 'Construcción y Reformas';

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b0c10] border border-amber-500/30 rounded-[2.5rem] w-full max-w-[42rem] shadow-[0_0_50px_rgba(245,158,11,0.18)] overflow-visible relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[92vh]"
      >
        {/* Corona dorada flotante sobre el borde superior */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#111218] border-2 border-[#FFB800] flex items-center justify-center shadow-[0_0_30px_rgba(255,184,0,0.55)] z-20">
          <Crown className="w-7 h-7 text-[#FFB800] fill-[#FFB800]/25" />
        </div>

        {/* Botón de cerrar (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer z-20 shadow-md"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Contenido scrolleable optimizado */}
        <div className="p-6 sm:p-8 md:p-9 pt-10 sm:pt-11 overflow-y-auto custom-scrollbar flex-1 space-y-5 sm:space-y-6">
          
          {/* Encabezado y Subtítulo */}
          <div className="text-center space-y-2.5">
            <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-black text-white leading-tight tracking-tight">
              {isAtLimit ? (
                <>
                  Desbloquea este proyecto <span className="text-[#FFB800] drop-shadow-[0_0_15px_rgba(255,184,0,0.4)]">con Pro</span>
                </>
              ) : (
                <>
                  Desbloquea <span className="text-[#FFB800]">este proyecto</span>
                </>
              )}
            </h2>
            <p className="text-zinc-300 text-sm sm:text-[15px] max-w-xl mx-auto leading-relaxed">
              {isAtLimit 
                ? "Has alcanzado el límite de proyectos de tu plan actual. Actualiza a Pro para desbloquear hasta 3 proyectos simultáneos con todas las funciones de IA."
                : "Tienes un cupo disponible en tu plan actual para activar este proyecto y comenzar a comercializarlo de inmediato."}
            </p>
          </div>

          {/* Tarjeta de previsualización del proyecto seleccionado */}
          <div className="bg-[#12141c]/90 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 shadow-inner">
            <div className="w-full sm:w-48 md:w-52 h-32 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 relative shadow-md bg-zinc-900">
              <img 
                src={projectImg} 
                alt={title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="flex-1 min-w-0 text-left w-full">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{category}</span>
              </div>
              <h4 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-1">
                {title}
              </h4>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>

          {/* Sección "Con Pro desbloqueas:" */}
          <div className="space-y-3">
            <h3 className="text-white font-extrabold text-base sm:text-lg text-left tracking-tight">
              {isAtLimit ? "Con Pro desbloqueas:" : "Beneficios incluidos en tu estrategia:"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Beneficio 1 */}
              <div className="bg-[#12141c]/80 border border-white/10 hover:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-snug">Hasta 3 proyectos activos</p>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Gestiona varios negocios, productos o nichos al mismo tiempo.</p>
                </div>
              </div>

              {/* Beneficio 2 */}
              <div className="bg-[#12141c]/80 border border-white/10 hover:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-snug">30 reels con IA cada mes</p>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Genera hooks, guiones y llamadas a la acción para atraer clientes.</p>
                </div>
              </div>

              {/* Beneficio 3 */}
              <div className="bg-[#12141c]/80 border border-white/10 hover:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-snug">Páginas, embudos y dominio</p>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Publica tu sistema de captación con una estructura profesional lista para usar.</p>
                </div>
              </div>

              {/* Beneficio 4 */}
              <div className="bg-[#12141c]/80 border border-white/10 hover:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-snug">Email, WhatsApp y secuencias</p>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Activa seguimiento y ventas automáticas desde una sola plataforma.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción según cupos disponibles */}
          <div className="space-y-3 pt-2 sm:pt-3">
            {isAtLimit ? (
              /* CASO 1: YA NO PUEDE CREAR MÁS PROYECTOS -> Botón Pro Amarillo */
              <button
                type="button"
                id="unlock-project-with-pro-btn"
                onClick={() => onUnlockWithPro(project)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] transition-all cursor-pointer active:scale-[0.99] group"
              >
                <Lock className="w-5 h-5 text-black shrink-0" />
                <span>Desbloquear proyecto con Pro</span>
                <ArrowRight className="w-5 h-5 text-black shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              /* CASO 2: TIENE CRÉDITOS / CUPOS DISPONIBLES -> Botón Verde Principal */
              <button
                type="button"
                id="unlock-project-free-btn"
                onClick={() => onUnlockFree ? onUnlockFree(project) : onClose()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.55)] transition-all cursor-pointer active:scale-[0.99] group"
              >
                <Zap className="w-5 h-5 text-black shrink-0 fill-black" />
                <span>Desbloquear este proyecto</span>
                <ArrowRight className="w-5 h-5 text-black shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Botón Seguir con mi plan gratuito: cierra la modal */}
            <button
              type="button"
              id="unlock-project-close-btn"
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-[#14161f] hover:bg-[#1a1c26] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Seguir con mi plan gratuito
            </button>
          </div>

          {/* Microcopy pie de página */}
          <p className="text-center text-xs text-zinc-400 font-medium flex items-center justify-center gap-1.5 pt-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>No perderás tu proyecto actual · Activación inmediata</span>
          </p>

        </div>
      </div>
    </div>
  );
};
