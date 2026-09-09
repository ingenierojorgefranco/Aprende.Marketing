import React, { useState } from 'react';
import { GeneratedPageContent, ThankYouPageConfig } from '../../types';
import { getDesignSystem } from './designSystem';
import { FormationMockup, GuideMockup } from './ThankYouMockups';
import { getIcon } from './utils';
import {
  Check, Mail, Play, Volume2, VolumeX,
  Settings, Maximize2, Clock, User, GraduationCap,
  ExternalLink, Gift, MessageCircle, Sparkles
} from 'lucide-react';

interface LiveThankYouPageProps {
  content: GeneratedPageContent;
  ds?: any; // Design System
  isMobilePreview?: boolean;
  pageId?: string;
  basePath?: string;
  project?: any;
}

// Helper para sincronizar bordes, badges y acentos con la paleta activa de la página de captura
const getPaletteAccents = (palette: string = 'nature-green') => {
  switch (palette) {
    case 'nature-green':
      return {
        cardBorder: 'border-2 border-emerald-500',
        badgeBg: 'bg-emerald-600',
        badgeText: 'text-white',
        checkBg: 'bg-emerald-600 text-white',
        checkText: 'text-emerald-400',
        recommendBg: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-700',
        stepBadgeBg: 'bg-emerald-100 text-emerald-700',
        stepIconBg: 'bg-emerald-50 text-emerald-600',
        stepIconCheckBg: 'bg-emerald-50 text-emerald-600',
      };
    case 'modern-blue':
      return {
        cardBorder: 'border-2 border-blue-600',
        badgeBg: 'bg-blue-600',
        badgeText: 'text-white',
        checkBg: 'bg-blue-600 text-white',
        checkText: 'text-blue-400',
        recommendBg: 'bg-blue-50/90 border-blue-200/80 text-blue-700',
        stepBadgeBg: 'bg-blue-100 text-blue-700',
        stepIconBg: 'bg-blue-50 text-blue-600',
        stepIconCheckBg: 'bg-blue-50 text-blue-600',
      };
    case 'elegant-purple':
      return {
        cardBorder: 'border-2 border-purple-600',
        badgeBg: 'bg-purple-600',
        badgeText: 'text-white',
        checkBg: 'bg-purple-600 text-white',
        checkText: 'text-purple-400',
        recommendBg: 'bg-purple-50/90 border-purple-200/80 text-purple-700',
        stepBadgeBg: 'bg-purple-100 text-purple-700',
        stepIconBg: 'bg-purple-50 text-purple-600',
        stepIconCheckBg: 'bg-purple-50 text-purple-600',
      };
    case 'energetic-orange':
      return {
        cardBorder: 'border-2 border-orange-500',
        badgeBg: 'bg-orange-600',
        badgeText: 'text-white',
        checkBg: 'bg-orange-600 text-white',
        checkText: 'text-orange-400',
        recommendBg: 'bg-orange-50/90 border-orange-200/80 text-orange-700',
        stepBadgeBg: 'bg-orange-100 text-orange-700',
        stepIconBg: 'bg-orange-50 text-orange-600',
        stepIconCheckBg: 'bg-orange-50 text-orange-600',
      };
    case 'dark-luxury':
      return {
        cardBorder: 'border-2 border-yellow-500',
        badgeBg: 'bg-yellow-500',
        badgeText: 'text-black',
        checkBg: 'bg-yellow-500 text-black',
        checkText: 'text-yellow-400',
        recommendBg: 'bg-yellow-50/90 border-yellow-200/80 text-yellow-800',
        stepBadgeBg: 'bg-yellow-100 text-yellow-800',
        stepIconBg: 'bg-yellow-50 text-yellow-600',
        stepIconCheckBg: 'bg-yellow-50 text-yellow-600',
      };
    case 'ocean-teal':
      return {
        cardBorder: 'border-2 border-teal-500',
        badgeBg: 'bg-teal-600',
        badgeText: 'text-white',
        checkBg: 'bg-teal-600 text-white',
        checkText: 'text-teal-400',
        recommendBg: 'bg-teal-50/90 border-teal-200/80 text-teal-700',
        stepBadgeBg: 'bg-teal-100 text-teal-700',
        stepIconBg: 'bg-teal-50 text-teal-600',
        stepIconCheckBg: 'bg-teal-50 text-teal-600',
      };
    case 'crimson-red':
      return {
        cardBorder: 'border-2 border-red-600',
        badgeBg: 'bg-red-700',
        badgeText: 'text-white',
        checkBg: 'bg-red-700 text-white',
        checkText: 'text-red-400',
        recommendBg: 'bg-red-50/90 border-red-200/80 text-red-700',
        stepBadgeBg: 'bg-red-100 text-red-700',
        stepIconBg: 'bg-red-50 text-red-600',
        stepIconCheckBg: 'bg-red-50 text-red-600',
      };
    case 'corporate-slate':
      return {
        cardBorder: 'border-2 border-slate-600',
        badgeBg: 'bg-slate-800',
        badgeText: 'text-white',
        checkBg: 'bg-slate-800 text-white',
        checkText: 'text-slate-300',
        recommendBg: 'bg-slate-100/90 border-slate-200/80 text-slate-700',
        stepBadgeBg: 'bg-slate-200 text-slate-800',
        stepIconBg: 'bg-slate-100 text-slate-700',
        stepIconCheckBg: 'bg-slate-100 text-slate-700',
      };
    case 'gold-prestige':
      return {
        cardBorder: 'border-2 border-amber-500',
        badgeBg: 'bg-amber-500',
        badgeText: 'text-white',
        checkBg: 'bg-amber-500 text-white',
        checkText: 'text-amber-400',
        recommendBg: 'bg-amber-50/90 border-amber-200/80 text-amber-800',
        stepBadgeBg: 'bg-amber-100 text-amber-800',
        stepIconBg: 'bg-amber-50 text-amber-600',
        stepIconCheckBg: 'bg-amber-50 text-amber-600',
      };
    case 'minimal-mono':
    default:
      return {
        cardBorder: 'border-2 border-gray-900',
        badgeBg: 'bg-black',
        badgeText: 'text-white',
        checkBg: 'bg-black text-white',
        checkText: 'text-gray-300',
        recommendBg: 'bg-gray-100 border-gray-200 text-gray-800',
        stepBadgeBg: 'bg-gray-200 text-black',
        stepIconBg: 'bg-gray-100 text-black',
        stepIconCheckBg: 'bg-gray-100 text-black',
      };
  }
};

export const LiveThankYouPage: React.FC<LiveThankYouPageProps> = ({
  content,
  ds,
  isMobilePreview = false,
  pageId,
  basePath,
  project
}) => {
  const activeDs = ds || getDesignSystem(content.palette);
  const projTyConfig: Partial<ThankYouPageConfig> = (project?.multimedia_json as any)?.thankYouPage || {};
  const pageTyConfig: Partial<ThankYouPageConfig> = content.thankYouPage || {};
  const tyConfig: ThankYouPageConfig = {
    ...projTyConfig,
    ...pageTyConfig,
  };
  (Object.keys(projTyConfig) as (keyof ThankYouPageConfig)[]).forEach((k) => {
    const val = pageTyConfig[k];
    if ((val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) && projTyConfig[k]) {
      (tyConfig as any)[k] = projTyConfig[k];
    }
  });

  // Los campos definidos explícitamente en el Proyecto (ProjectWizard - Imagen 4) tienen máxima prioridad
  if (projTyConfig.videoPosterUrl && projTyConfig.videoPosterUrl.trim() !== '') {
    tyConfig.videoPosterUrl = projTyConfig.videoPosterUrl;
  }
  if (projTyConfig.videoUrl && projTyConfig.videoUrl.trim() !== '') {
    tyConfig.videoUrl = projTyConfig.videoUrl;
  }
  if (projTyConfig.upsellImageUrl && projTyConfig.upsellImageUrl.trim() !== '') {
    tyConfig.upsellImageUrl = projTyConfig.upsellImageUrl;
  }
  if (projTyConfig.whatsappGuideImageUrl && projTyConfig.whatsappGuideImageUrl.trim() !== '') {
    tyConfig.whatsappGuideImageUrl = projTyConfig.whatsappGuideImageUrl;
  }
  if (projTyConfig.upsellInstructorName && projTyConfig.upsellInstructorName.trim() !== '') {
    tyConfig.upsellInstructorName = projTyConfig.upsellInstructorName;
  }
  if (projTyConfig.upsellInstructorTitle && projTyConfig.upsellInstructorTitle.trim() !== '') {
    tyConfig.upsellInstructorTitle = projTyConfig.upsellInstructorTitle;
  }

  const paletteAccents = getPaletteAccents(content.palette);

  // Brand Name & Visuals
  const brandName = tyConfig.headerLogoText || content.brandName || project?.name || "ResinPro Studio Latino";

  // WhatsApp Link Resolution
  const rawWhatsapp = tyConfig.ctaLink || project?.whatsappGroupUrl || project?.whatsapp_group_url || (project?.multimedia_json as any)?.whatsappGroupUrl;
  const whatsappLink = (rawWhatsapp && rawWhatsapp.trim() !== '' && rawWhatsapp !== '#') ? rawWhatsapp : "#";

  // Upsell Button Resolution
  const upsellTargetUrl = tyConfig.upsellButtonUrl || content.destination?.url || project?.paymentUrl || "#";

  // Video State & Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<string>("0:00");

  const videoUrl = tyConfig.videoUrl || (project?.multimedia_json as any)?.videoUrls?.[0] || "";
  const videoDuration = tyConfig.videoDuration || "34:28";

  // YouTube / Vimeo embed parser & thumbnail extractor
  const getEmbedVideoUrl = (url: string): string | null => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    return null;
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return ytMatch && ytMatch[1] ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : null;
  };

  const embedUrl = getEmbedVideoUrl(videoUrl);
  const autoYtThumbnail = getYouTubeThumbnail(videoUrl);

  const defaultPoster = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80";
  
  // Captura de carga del video definida en el proyecto (Imagen 4) con fallback automático al thumbnail del video o imagen de portada
  const videoPoster = (tyConfig.videoPosterUrl && tyConfig.videoPosterUrl.trim() !== '')
    ? tyConfig.videoPosterUrl
    : (autoYtThumbnail || project?.multimedia_json?.heroImages?.[0] || defaultPoster);

  // 2. Instructor desde la base de datos (strategy_json.teacher)
  const teacherFromStrategy = (project?.strategy_json as any)?.teacher || (project?.strategy_json as any)?.instructor || {};
  const instructorFromContent = (content as any)?.instructor || {};

  const instructorName = 
    tyConfig.upsellInstructorName 
    || teacherFromStrategy.name 
    || instructorFromContent.name 
    || "Ariana Zamora";

  const instructorTitle = 
    tyConfig.upsellInstructorTitle 
    || teacherFromStrategy.title 
    || teacherFromStrategy.bio 
    || instructorFromContent.title 
    || instructorFromContent.role 
    || "Especialista en recubrimientos epóxicos";

  const instructorImage = 
    teacherFromStrategy.image 
    || instructorFromContent.image 
    || instructorFromContent.avatar 
    || (project?.multimedia_json as any)?.instructorImage 
    || "";

  // 3. Imágenes que aparecen al lado izquierdo de los textos (Lead Magnet y Programa Completo - Imagen 3 y 4)
  // Deben cargar las imágenes del poster definido en el proyecto (Imagen 4) o la imagen personalizada si existe
  const upsellCustomImage = 
    (tyConfig.upsellImageUrl && tyConfig.upsellImageUrl.trim() !== '')
      ? tyConfig.upsellImageUrl
      : (videoPoster && videoPoster !== defaultPoster)
        ? videoPoster
        : (project?.multimedia_json?.heroImages?.[0] || undefined);

  const leadMagnetCustomImage = 
    (tyConfig.whatsappGuideImageUrl && tyConfig.whatsappGuideImageUrl.trim() !== '')
      ? tyConfig.whatsappGuideImageUrl
      : (project?.multimedia_json?.leadMagnets?.[0]?.imageUrl && project.multimedia_json.leadMagnets[0].imageUrl.trim() !== '')
        ? project.multimedia_json.leadMagnets[0].imageUrl
        : (videoPoster && videoPoster !== defaultPoster)
          ? videoPoster
          : undefined;

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setVideoCurrentTime("0:15");
    }
  };

  // Registrar clic en WhatsApp para analíticas
  const handleWhatsAppClick = () => {
    if (pageId) {
      try {
        fetch(`/api/public/pages/${pageId}/whatsapp-click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true
        }).catch((err) => {
          console.warn('[Analytics] Error al registrar clic de WhatsApp:', err);
        });
      } catch (e) {
        console.warn('[Analytics] Error al enviar evento de WhatsApp:', e);
      }
    }
  };

  // Helper para renderizar el logo idéntico a la barra de navegación de la página de captura
  const renderLogoIcon = () => {
    if (content.brandIcon) {
      return getIcon(content.brandIcon, <Sparkles className="w-5 h-5" />);
    }
    if (content.logoSvg) {
      return (
        <div 
          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center" 
          dangerouslySetInnerHTML={{ __html: content.logoSvg }} 
        />
      );
    }
    // Hexágono azul 3D idéntico al de las imágenes 1 y 3 de la captura
    return (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 fill-blue-500/90 drop-shadow-sm" viewBox="0 0 24 24">
        <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2zm0 2.8l6.5 3.8v6.8L12 19.2l-6.5-3.8V8.6L12 4.8z" />
        <path d="M12 7l4.5 2.6v4.8L12 17l-4.5-2.6V9.6L12 7z" fill="currentColor" fillOpacity="0.4" />
      </svg>
    );
  };

  return (
    <div 
      id="thankyou-template-root" 
      className={`min-h-screen font-sans ${activeDs.hero.bgGradient || 'bg-[#1c1917]'} ${activeDs.selectionColor || 'selection:bg-emerald-500 selection:text-white'} text-white scroll-smooth relative overflow-hidden flex flex-col antialiased`}
    >
      {/* Resplandor ambiental coherente con el Hero de la página de captura */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full blur-[140px] pointer-events-none ${activeDs.blobColor} ${activeDs.blobOpacity || 'opacity-20'}`}></div>
      <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 w-[950px] h-[650px] rounded-full blur-[160px] pointer-events-none ${activeDs.blobColor} opacity-10`}></div>

      {/* 1. FRANJA SUPERIOR DEL LOGO (COHERENTE CON EL NAVBAR DE LA CAPTURA - IMAGEN 3) */}
      <header className={`w-full py-4 sm:py-5 border-b border-white/10 ${activeDs.nav.transparentBg} relative z-20 backdrop-blur-md shadow-sm`}>
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center">
          <a 
            href={basePath || '/'} 
            className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            {/* Logo dentro del círculo con el fondo y color oficial de la captura */}
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md shrink-0 overflow-hidden ${activeDs.nav.logoBg} ${activeDs.nav.logoText}`}>
              {renderLogoIcon()}
            </div>
            {/* Nombre de la marca con tipografía de alto contraste */}
            <span className="font-bold text-white text-base sm:text-lg tracking-tight">
              {brandName}
            </span>
          </a>
        </div>
      </header>

      {/* 2. HERO DE CONFIRMACIÓN (FONDO MÁS OSCURO DEL HERO DE LA CAPTURA) */}
      <section className="relative pt-8 sm:pt-10 pb-8 sm:pb-12 text-center px-4 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Icono Check Circular de Confirmación con el color de acento de la captura */}
          <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full ${paletteAccents.checkBg} flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/20 ring-4 ring-white/10 animate-in zoom-in-75 duration-300`}>
            <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black tracking-tight text-white mb-3 leading-tight">
            {tyConfig.headline || "Perfecto, tu registro está confirmado"}
          </h1>

          {/* Subtítulo */}
          <p className={`text-sm sm:text-base md:text-lg ${activeDs.hero.subtitleColor || 'text-white/80'} font-normal leading-relaxed max-w-xl mx-auto mb-5`}>
            {tyConfig.subheadline || "Tu clase gratuita ya está disponible. También hemos enviado el acceso a tu correo para que puedas volver cuando quieras."}
          </p>

          {/* Píldora de aviso de correo con fondo sutil y borde coherente */}
          <div className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border ${activeDs.hero.badgeBg || 'bg-black/40'} ${activeDs.hero.badgeText || 'text-white/90'} ${activeDs.hero.badgeBorder || 'border-white/15'} backdrop-blur-md shadow-sm text-xs sm:text-sm font-medium`}>
            <Mail className={`w-4 h-4 ${paletteAccents.checkText} shrink-0`} />
            <span>{tyConfig.emailNotificationText || "Revisa tu bandeja de entrada (y spam) para encontrar el acceso."}</span>
          </div>
        </div>
      </section>

      {/* 3. CONTENIDO PRINCIPAL: 3 TARJETAS BLANCAS ESTRUCTURADAS */}
      <main className="flex-1 px-4 pb-16 relative z-10">
        <div className="max-w-[50rem] mx-auto space-y-9">

          {/* TARJETA 1: LA CLASE GRATUITA + OFERTA DE FORMACIÓN */}
          <div className={`bg-white rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl ${paletteAccents.cardBorder} text-gray-900 relative`}>
            
            {/* Badge Centrado: CLASE GRATUITA con color de la captura */}
            <div className="text-center mb-3">
              <span className={`inline-block ${paletteAccents.badgeBg} ${paletteAccents.badgeText} text-[10px] sm:text-[11px] font-black tracking-widest uppercase px-5 py-1.5 rounded-full shadow-sm`}>
                {tyConfig.videoBadge || "CLASE GRATUITA"}
              </span>
            </div>

            {/* Título y Subtítulo de la Masterclass */}
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-[1.95rem] font-black tracking-tight text-gray-950 leading-snug mb-2">
                {tyConfig.videoTitle || "Cómo empezar profesionalmente con resina epóxica para suelos"}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-lg mx-auto">
                {tyConfig.videoSubtitle || "Aprende cómo funciona esta técnica, qué necesitas para comenzar y cuáles son los errores que debes evitar."}
              </p>
            </div>

            {/* REPRODUCTOR DE VIDEO DE ALTA FIDELIDAD */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl relative bg-black border border-gray-900 mb-4 select-none group">
              {isPlaying && embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Clase Gratuita"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isPlaying && videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  poster={videoPoster}
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <>
                  {/* Poster / Fotograma de la clase (Captura de carga del video - Imagen 1 y 4) */}
                  <img
                    src={videoPoster}
                    alt="Masterclass"
                    className="w-full h-full object-cover brightness-[0.78] group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  
                  {/* Overlay gradiente oscuro */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none"></div>

                  {/* Watermark superior izquierdo */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-1.5">
                    <span className="text-white/90 text-[10px] sm:text-xs font-semibold tracking-wide drop-shadow-md">
                      {brandName}
                    </span>
                  </div>

                  {/* Frase de valor a la derecha */}
                  <div className="hidden sm:block absolute top-4 right-4 z-10 text-right">
                    <p className="text-white/90 text-xs md:text-sm font-serif italic drop-shadow-md">
                      {tyConfig.videoSubtitle || "Clase Especializada Paso a Paso"}
                    </p>
                  </div>

                  {/* Título inferior izquierdo sobre el video */}
                  <div className="absolute left-3 sm:left-5 bottom-12 sm:bottom-14 z-10 max-w-[70%] text-left">
                    <h3 className="text-white font-black text-xs sm:text-base md:text-lg uppercase tracking-tight leading-snug drop-shadow-lg">
                      {tyConfig.videoTitle ? tyConfig.videoTitle.toUpperCase() : (content.hero?.headline?.toUpperCase() || (project?.productName ? project.productName.toUpperCase() : "CLASE GRATUITA COMPLETA"))}
                    </h3>
                    <div className="mt-1 sm:mt-1.5 inline-block bg-[#4f46e5] text-white text-[9px] sm:text-xs font-bold px-2.5 py-0.5 rounded shadow">
                      {tyConfig.videoSubtitle || "De un proyecto a un negocio rentable"}
                    </div>
                  </div>

                  {/* Botón Central de Play con efecto Frosted Glass */}
                  <button
                    onClick={handlePlayClick}
                    aria-label="Reproducir video"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-black/60 backdrop-blur-md border border-white/35 flex items-center justify-center text-white shadow-2xl hover:scale-110 hover:bg-black/75 transition-all duration-300 cursor-pointer z-20 group/play focus:outline-none"
                  >
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-white text-white ml-1 group-hover/play:scale-105 transition-transform" />
                  </button>

                  {/* Barra de Controles Inferior del Reproductor */}
                  <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-11 bg-black/80 backdrop-blur-sm px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3 text-white text-[10px] sm:text-xs font-mono z-10 border-t border-white/10">
                    <button 
                      onClick={handlePlayClick} 
                      className="text-white hover:text-white/80 transition-colors p-1"
                    >
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
                    </button>
                    
                    <span className="text-gray-300 shrink-0 text-[10px] sm:text-xs">
                      {videoCurrentTime} / {videoDuration}
                    </span>

                    {/* Barra de Progreso Scrub sincronizada con la paleta */}
                    <div className="flex-1 mx-1 sm:mx-2 bg-gray-700/80 h-1.5 rounded-full overflow-hidden relative cursor-pointer">
                      <div className={`h-full ${paletteAccents.badgeBg} w-[18%] relative rounded-full`}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
                      <button 
                        onClick={() => setIsMuted(!isMuted)} 
                        className="hover:text-white transition-colors"
                        title={isMuted ? "Activar sonido" : "Silenciar"}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button className="hover:text-white transition-colors hidden sm:block">
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={handlePlayClick} 
                        className="hover:text-white transition-colors"
                        title="Pantalla completa"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Píldora de Recomendación debajo del Video */}
            <div className="text-center mb-8 sm:mb-10">
              <div className={`rounded-full py-1.5 px-5 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold ${paletteAccents.recommendBg}`}>
                <Clock className="w-4 h-4 shrink-0" />
                <span>{tyConfig.videoNoticeText || "Te recomendamos ver la clase completa antes de continuar."}</span>
              </div>
            </div>

            {/* SECCIÓN INTERNA: ¿Quieres aprender el proceso completo? (FORMACIÓN / UPSELL) */}
            <div className="pt-6 border-t border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 mb-1">
                  {tyConfig.upsellTitle || "¿Quieres aprender el proceso completo?"}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {tyConfig.upsellSubtitle || "Lleva tus habilidades al siguiente nivel con nuestra formación especializada."}
                </p>
              </div>

              {/* Grid 2 Columnas: Mockup 3D + Beneficios y Botón Oficial */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Columna Izquierda: Mockup 3D del Programa (Carga poster definido en Imagen 4) */}
                <div>
                  <FormationMockup 
                    title={tyConfig.upsellProductName || project?.productName || "ESPECIALISTA EN FORMACIÓN COMPLETA"}
                    subtitle="De la práctica a un negocio rentable"
                    brandName={brandName}
                    customImageUrl={upsellCustomImage}
                    posterUrl={videoPoster}
                    ds={activeDs}
                  />
                </div>

                {/* Columna Derecha: Detalles del Programa y CTA Oficial */}
                <div className="space-y-4 text-left">
                  <div>
                    <h4 className="text-lg sm:text-xl font-black leading-tight text-gray-950 mb-2">
                      {tyConfig.upsellProductName || project?.productName || "Formación Especializada Completa"}
                    </h4>

                    {/* Ficha del Instructor desde la base de datos (strategy_json.teacher - Imagen 2) */}
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 bg-gray-50/80">
                      {instructorImage ? (
                        <img 
                          src={instructorImage} 
                          alt={instructorName} 
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200 shadow-sm" 
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-600">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-xs">
                        <p className="font-bold leading-tight text-gray-900">
                          Impartido por: <span className="font-extrabold text-gray-950">{instructorName}</span>
                        </p>
                        <p className="text-[11px] leading-tight text-gray-500">
                          {instructorTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de 4 Checks de Valor con icono de la paleta */}
                  <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-gray-700">
                    {(tyConfig.upsellBullets || [
                      "Aprende el proceso paso a paso",
                      "Materiales, preparación y aplicación",
                      "Acabados profesionales y corrección de errores",
                      "Acceso a una formación estructurada"
                    ]).map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm ${paletteAccents.checkBg}`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Botón CTA Formación Completa (Hereda el estilo primario de la captura) */}
                  <a
                    href={upsellTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full ${activeDs.buttons.primary} py-3.5 sm:py-4 px-5 rounded-xl font-bold text-xs sm:text-sm md:text-base tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer mt-3`}
                  >
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{tyConfig.upsellButtonText || "CONOCER LA FORMACIÓN COMPLETA"}</span>
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>


          {/* TARJETA 2: REGALO ADICIONAL (WHATSAPP + GUÍA PRÁCTICA) */}
          <div className={`bg-white rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl ${paletteAccents.cardBorder} text-gray-900 relative`}>
            
            {/* Badge Centrado: REGALO ADICIONAL */}
            <div className="text-center mb-3">
              <span className={`inline-flex items-center gap-1.5 ${paletteAccents.badgeBg} ${paletteAccents.badgeText} text-[10px] sm:text-[11px] font-black tracking-widest uppercase px-5 py-1.5 rounded-full shadow-sm`}>
                <Gift className="w-3.5 h-3.5" />
                <span>{tyConfig.whatsappBadge || "REGALO ADICIONAL"}</span>
              </span>
            </div>

            {/* Título y Subtítulo de WhatsApp */}
            <div className="text-center max-w-xl mx-auto mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-[1.95rem] font-black tracking-tight text-gray-950 leading-snug mb-2">
                {tyConfig.whatsappTitle || "Únete a nuestro grupo de WhatsApp y recibe gratis esta guía práctica"}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                {tyConfig.whatsappSubtitle || "Conecta con nuestra comunidad, resuelve tus dudas y descarga tu guía en formato digital."}
              </p>
            </div>

            {/* Grid 2 Columnas: Mockup de la Guía + Puntos de Valor y Botón Oficial de WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Columna Izquierda: Mockup 3D de la Guía (Carga poster definido en Imagen 4) */}
              <div>
                <GuideMockup 
                  title={tyConfig.whatsappGuideTitle || tyConfig.leadMagnetName || project?.multimedia_json?.leadMagnets?.[0]?.name || "CÓMO CONVERTIR TU APRENDIZAJE EN UN NEGOCIO RENTABLE"}
                  subtitle="GUÍA PRÁCTICA PASO A PASO"
                  customImageUrl={leadMagnetCustomImage}
                  posterUrl={videoPoster}
                  ds={activeDs}
                />
              </div>

              {/* Columna Derecha: Título de la Guía, Checks y Botón */}
              <div className="space-y-4 text-left">
                <h4 className="text-base sm:text-lg md:text-xl font-bold leading-snug text-gray-950">
                  {tyConfig.whatsappGuideTitle || "Cómo convertir la aplicación de resina epóxica para suelos en un negocio rentable"}
                </h4>

                {/* Lista de 4 Checks de la Guía con color de la captura */}
                <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-gray-700">
                  {(tyConfig.whatsappGuideBullets || [
                    "Descubre cómo encontrar clientes",
                    "Aprende a estructurar tu oferta",
                    "Calcula correctamente tus costes",
                    "Conoce cómo presentar el servicio profesionalmente"
                  ]).map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm ${paletteAccents.checkBg}`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón Verde Oficial de WhatsApp */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#00B758] hover:bg-[#00A34E] text-white py-3.5 sm:py-4 px-5 rounded-xl font-bold text-xs sm:text-sm md:text-base tracking-wide uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer mt-4"
                >
                  <MessageCircle className="w-5 h-5 fill-white/20 shrink-0" />
                  <span>{tyConfig.whatsappButtonText || "UNIRME AL GRUPO Y RECIBIR LA GUÍA"}</span>
                </a>
              </div>
            </div>

          </div>


          {/* TARJETA 3: ¿QUÉ OCURRE AHORA? (3 PASOS DE ONBOARDING) */}
          <div className="bg-white rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl border border-gray-100 text-gray-900 relative">
            
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-gray-950 mb-1">
                {tyConfig.stepsTitle || "¿Qué ocurre ahora?"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {tyConfig.stepsSubtitle || "Sigue estos 3 pasos para aprovechar al máximo tu acceso:"}
              </p>
            </div>

            {/* Grid 3 Columnas de Pasos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              
              {/* PASO 1 */}
              <div className="bg-gray-50/75 border border-gray-100/90 hover:bg-gray-50 rounded-2xl p-5 text-center flex flex-col items-center transition-colors">
                <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center mb-3 ${paletteAccents.stepBadgeBg}`}>
                  1
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm ${paletteAccents.stepIconBg}`}>
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1 text-gray-900">
                  Mira la clase gratuita
                </h4>
                <p className="text-xs leading-relaxed text-gray-500">
                  Aprende los fundamentos y toma nota de las ideas clave.
                </p>
              </div>

              {/* PASO 2 */}
              <div className="bg-gray-50/75 border border-gray-100/90 hover:bg-gray-50 rounded-2xl p-5 text-center flex flex-col items-center transition-colors">
                <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center mb-3 ${paletteAccents.stepBadgeBg}`}>
                  2
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00B758] flex items-center justify-center mb-3 shadow-sm">
                  <MessageCircle className="w-5 h-5 fill-[#00B758]/20" />
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1 text-gray-900">
                  Únete al grupo y descarga la guía
                </h4>
                <p className="text-xs leading-relaxed text-gray-500">
                  Conecta con la comunidad y recibe tu material gratuito.
                </p>
              </div>

              {/* PASO 3 */}
              <div className="bg-gray-50/75 border border-gray-100/90 hover:bg-gray-50 rounded-2xl p-5 text-center flex flex-col items-center transition-colors">
                <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center mb-3 ${paletteAccents.stepBadgeBg}`}>
                  3
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm ${paletteAccents.stepIconBg}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1 text-gray-900">
                  Conoce la formación recomendada
                </h4>
                <p className="text-xs leading-relaxed text-gray-500">
                  Da el siguiente paso y lleva tu conocimiento al nivel profesional.
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* 4. FOOTER OSCURO ELEGANTE INTEGRADO CON LA PALETA */}
      <footer className={`w-full border-t border-white/10 ${activeDs.footer?.bg || 'bg-black/50'} py-12 px-6 relative z-10 text-white`}>
        <div className="max-w-[50rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-left">
            {/* Columna 1: Logo dentro del círculo, Nombre de Marca y Tagline */}
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md overflow-hidden shrink-0 ${activeDs.nav.logoBg} ${activeDs.nav.logoText}`}>
                  {renderLogoIcon()}
                </div>
                <span className="font-bold text-white text-base tracking-tight">
                  {brandName}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                {project?.tagline || "Transformando ideas en suelos que generan oportunidades."}
              </p>
            </div>

            {/* Columna 2: Enlaces */}
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-white mb-3">Enlaces</h5>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href={basePath || '/'} className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href={upsellTargetUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Formación</a></li>
                <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href={`${basePath || ''}/blog`} className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Columna 3: Legal */}
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-white mb-3">Legal</h5>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href={`${basePath || ''}/privacidad`} className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href={`${basePath || ''}/terminos`} className="hover:text-white transition-colors">Términos de Uso</a></li>
                <li><a href={`${basePath || ''}/aviso-legal`} className="hover:text-white transition-colors">Aviso Legal</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright Inferior */}
          <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} {brandName}. Todos los derechos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
};
