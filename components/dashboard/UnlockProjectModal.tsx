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
    const nameLower = (p.name || '').toLowerCase();
    if (nameLower.includes("microblading")) return "Certificación Expert Microblading";
    if (nameLower.includes("manicurista")) return "Curso de Maquillaje Profesional";
    if (nameLower.includes("pisos") || nameLower.includes("resina")) return "Master en Pisos de Resina Epóxica";
    return p.name || "Producto Digital";
  };

  const getCardDesc = (p: Project) => {
    const nameLower = (p.name || '').toLowerCase();
    if (nameLower.includes("microblading") || nameLower.includes("cejas")) {
      return "Domina la técnica de cejas y crea un servicio rentable con alta demanda.";
    }
    if (nameLower.includes("manicurista") || nameLower.includes("maquillaje")) {
      return "Aprende maquillaje, color y técnica profesional para realzar la belleza en cualquier ocasión.";
    }
    if (nameLower.includes("pisos") || nameLower.includes("resina")) {
      return "Aprende acabados profesionales en pisos de resina y conviértelo en un servicio rentable.";
    }
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
        <div className="p-5 sm:p-7 md:p-8 pt-9 sm:pt-10 overflow-y-auto custom-scrollbar flex-1 space-y-4 sm:space-y-5">
          
          {/* Encabezado y Subtítulo */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-black text-white leading-tight tracking-tight">
              Desbloquea este proyecto <span className="text-[#FFB800] drop-shadow-[0_0_15px_rgba(255,184,0,0.4)]">con Pro</span>
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              {isAtLimit 
                ? "Ya has usado tu proyecto incluido en el plan gratuito. Actualiza a Pro para activar este nuevo proyecto y seguir construyendo tu negocio digital."
                : "Tienes un cupo disponible en tu plan actual, o puedes actualizar a Pro para desbloquear hasta 3 proyectos simultáneos con todas las funciones de IA."}
            </p>
          </div>

          {/* Tarjeta de previsualización del proyecto seleccionado */}
          <div className="bg-[#12141c]/90 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 shadow-inner">
            <div className="w-full sm:w-44 md:w-48 h-28 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-amber-500/40 relative shadow-md bg-zinc-900">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="flex-1 min-w-0 text-left w-full">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold mb-1.5">
                <Briefcase className="w-3 h-3 shrink-0" />
                <span className="truncate">{category}</span>
              </div>
              <h4 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-1">
                {title}
              </h4>
              <p className="text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>

          {/* Sección "Con Pro desbloqueas:" */}
          <div className="space-y-2.5">
            <h3 className="text-white font-extrabold text-base sm:text-lg text-left tracking-tight">
              Con Pro desbloqueas:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Beneficio 1 */}
              <div className="bg-[#12141c]/80 border border-white/10 hover:border-amber-500/30 rounded-2xl p-3 sm:p-3.5 flex items-start gap-3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-xs sm:text-sm leading-tight">Hasta 3 proyectos activos</p>
                  <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 leading-snug">Gestiona varios negocios, productos o nichos al mismo tiempo.</p>
                </div>
              </div>

              {/* Beneficio 2 */}
              <div className="bg-[#12141c]/80 border border-white/10 hover:border-amber-500/30 rounded-2xl p-3 sm:p-3.5 flex items-start gap-3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-xs sm:text-sm leading-tight">30 reels con IA cada mes</p>
                  <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 leading-snug">Genera hooks, guiones y llamadas a la acción para atraer clientes.</p>
                </div>
              </div>

              {/* Beneficio 3 */}
              <div className="bg-[#12141c]/80 border border-white/10 hover:border-amber-500/30 rounded-2xl p-3 sm:p-3.5 flex items-start gap-3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-xs sm:text-sm leading-tight">Páginas, embudos y dominio propio</p>
                  <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 leading-snug">Publica tu sistema de captación con una estructura profesional lista para usar.</p>
                </div>
              </div>

              {/* Beneficio 4 */}
              <div className="bg-[#12141c]/80 border border-white/10 hover:border-amber-500/30 rounded-2xl p-3 sm:p-3.5 flex items-start gap-3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-xs sm:text-sm leading-tight">Email, WhatsApp y automatización</p>
                  <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 leading-snug">Activa seguimiento y ventas desde una sola plataforma.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Precio Plan Pro Mensual */}
          <div className="bg-gradient-to-r from-amber-950/35 via-[#14161f] to-amber-950/35 border border-amber-500/40 rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
            <div className="shrink-0">
              <span className="block text-[10px] sm:text-[11px] font-black uppercase text-amber-400 tracking-wider">
                PLAN PRO MENSUAL
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">$79</span>
                <span className="text-zinc-400 text-sm font-semibold">/mes</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-11 bg-white/10" />

            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-zinc-300 text-xs sm:text-sm leading-snug font-medium">
                Activa este proyecto ahora y mantén también tu proyecto actual · Cancela cuando quieras.
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => onUnlockWithPro(project)}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:shadow-[0_0_35px_rgba(234,179,8,0.6)] transition-all cursor-pointer active:scale-[0.99]"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
              <span>Desbloquear proyecto con Pro</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
            </button>

            {/* Si tiene cupo disponible, puede desbloquear gratis con su cupo */}
            {!isAtLimit && onUnlockFree && (
              <button
                type="button"
                onClick={() => onUnlockFree(project)}
                className="w-full py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Usar cupo disponible de mi plan actual</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#14161f] hover:bg-[#1a1c26] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Seguir con plan gratuito
            </button>
          </div>

          {/* Microcopy pie de página */}
          <p className="text-center text-[11px] sm:text-xs text-zinc-400 font-medium flex items-center justify-center gap-1.5 pt-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>No perderás tu proyecto actual · Activación inmediata</span>
          </p>

        </div>
      </div>
    </div>
  );
};
