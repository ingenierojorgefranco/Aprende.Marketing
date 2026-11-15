import React, { useState, useEffect } from 'react';
import { GeneratedPageContent, ThankYouPageConfig } from '../../types';
import { getDesignSystem } from './designSystem';
import { getIcon } from './utils';
import {
  Check, Play, GraduationCap,
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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  const activeDs = ds || getDesignSystem(content.palette);
  const projTyConfig: Partial<ThankYouPageConfig> = (project?.multimedia_json as any)?.thankYouPage || {};
  const pageTyConfig: Partial<ThankYouPageConfig> = content.thankYouPage || {};
  
  // El Proyecto Maestro / Proyecto actúa como FUENTE ÚNICA DE VERDAD (Single Source of Truth) para todo el contenido global
  // La página de captura hereda dinámicamente cualquier cambio realizado por el administrador en el proyecto maestro
  const tyConfig: ThankYouPageConfig = {
    ...pageTyConfig,
    ...projTyConfig,
  };

  // Prevalencia estricta de cualquier campo configurado en el proyecto maestro sobre la copia estática de la página
  const globalMasterKeys: (keyof ThankYouPageConfig)[] = [
    'videoUrl', 'videoTitle', 'videoSubtitle', 'videoNoticeText', 'videoPosterUrl', 'videoBadge', 'videoDuration',
    'whatsappGuideTitle', 'whatsappGuideImageUrl', 'whatsappGuideBullets', 'whatsappBadge', 'whatsappTitle', 'whatsappSubtitle', 'whatsappButtonText',
    'upsellTitle', 'upsellSubtitle', 'upsellProductName', 'upsellBullets', 'upsellButtonText',
    'upsellImageUrl', 'upsellInstructorName', 'upsellInstructorTitle',
    'stepsTitle', 'stepsSubtitle', 'footerTagline'
  ];

  globalMasterKeys.forEach((k) => {
    const pVal = projTyConfig[k];
    if (pVal !== undefined && pVal !== null) {
      if (typeof pVal === 'string' && pVal.trim() !== '') {
        (tyConfig as any)[k] = pVal.trim();
      } else if (Array.isArray(pVal) && pVal.length > 0) {
        (tyConfig as any)[k] = pVal;
      }
    }
  });

  // Lead Magnets (PDFs / Guías) extraídos directamente del Proyecto Maestro / Proyecto
  const masterLeadMagnets = project?.multimedia_json?.leadMagnets || [];
  const activeLeadMagnet = masterLeadMagnets.length > 0 ? masterLeadMagnets[0] : null;

  if (activeLeadMagnet?.name && (!projTyConfig.whatsappGuideTitle || projTyConfig.whatsappGuideTitle.trim() === '')) {
    tyConfig.whatsappGuideTitle = activeLeadMagnet.name;
  }
  if (activeLeadMagnet?.imageUrl && (!projTyConfig.whatsappGuideImageUrl || projTyConfig.whatsappGuideImageUrl.trim() === '')) {
    tyConfig.whatsappGuideImageUrl = activeLeadMagnet.imageUrl;
  }

  const paletteAccents = getPaletteAccents(content.palette);

  // Brand Name & Visuals
  const brandName = tyConfig.headerLogoText || content.brandName || project?.name || "ResinPro Studio Latino";

  // WhatsApp Link Resolution (Configurado en Hotlinks / Project Wizard - Imagen 4)
  const isValidWhatsappUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    const cleanUrl = url.trim();
    const lowerUrl = cleanUrl.toLowerCase();
    if (cleanUrl === '' || cleanUrl === '#') return false;
    // Evitar URLs que correspondan al panel de control o edición del proyecto
    if (lowerUrl.includes('aprende.marketing/dashboard') || lowerUrl.includes('projects/edit') || lowerUrl.includes('aprende.marketing/admin')) {
      return false;
    }
    // Evitar enlaces que no pertenezcan a WhatsApp (como Canva, Google Drive, descargas, etc.)
    if (
      lowerUrl.includes('canva.com') ||
      lowerUrl.includes('canva.link') ||
      lowerUrl.includes('drive.google') ||
      lowerUrl.includes('dropbox') ||
      lowerUrl.includes('pdf')
    ) {
      return false;
    }
    // Para ser un enlace de WhatsApp válido, debe ser una URL de WhatsApp (ej: chat.whatsapp.com, wa.me, api.whatsapp.com, wa.link, whatsapp.com)
    return lowerUrl.includes('whatsapp') || lowerUrl.includes('wa.me') || lowerUrl.includes('wa.link');
  };

  const rawWhatsapp = 
    (project?.whatsappGroupUrl && isValidWhatsappUrl(project.whatsappGroupUrl))
      ? project.whatsappGroupUrl.trim()
      : (project?.whatsapp_group_url && isValidWhatsappUrl(project.whatsapp_group_url))
        ? project.whatsapp_group_url.trim()
        : ((project?.multimedia_json as any)?.whatsappGroupUrl && isValidWhatsappUrl((project.multimedia_json as any).whatsappGroupUrl))
          ? (project.multimedia_json as any).whatsappGroupUrl.trim()
          : (tyConfig.ctaLink && isValidWhatsappUrl(tyConfig.ctaLink))
            ? tyConfig.ctaLink.trim()
            : null;

  const hasWhatsAppGroup = Boolean(rawWhatsapp);
  const whatsappLink = hasWhatsAppGroup 
    ? (rawWhatsapp!.startsWith('http://') || rawWhatsapp!.startsWith('https://') ? rawWhatsapp! : `https://${rawWhatsapp}`)
    : "#";

  // Upsell Button Resolution (Configurado vía selector de Hotlinks / Afiliados - Ref. Imagen 1, 2, 3)
  // Regla del usuario: El botón debe cargar el primer hotlink que vendría a ser el de precio full (Ref. Imagen 1, 2, 3)
  const projectAffiliateLinks = project?.affiliateLinks || (project as any)?.affiliate_links || [];
  const assignedAffiliateLinks = projectAffiliateLinks.filter(
    (l: any) => l && typeof l.url === 'string' && l.url.trim() !== '' && l.url.trim() !== '#'
  );

  // Identificar el primer hotlink (Hotlink_Precio_Full)
  const fullPriceHotlink = assignedAffiliateLinks.find(
    (l: any) => l.label && (l.label.toLowerCase().includes('full') || l.label.toLowerCase().includes('principal'))
  ) || assignedAffiliateLinks[0];

  let rawUpsell: string | null = null;
  if ((project as any)?.selectedHotlinkUrl && (project as any).selectedHotlinkUrl.trim() !== '' && (project as any).selectedHotlinkUrl.trim() !== '#') {
    rawUpsell = (project as any).selectedHotlinkUrl.trim();
  } else if (fullPriceHotlink?.url && fullPriceHotlink.url.trim() !== '' && fullPriceHotlink.url.trim() !== '#') {
    // Carga directa del primer hotlink (Precio Full)
    rawUpsell = fullPriceHotlink.url.trim();
  } else if (tyConfig.upsellButtonUrl && tyConfig.upsellButtonUrl.trim() !== '' && tyConfig.upsellButtonUrl.trim() !== '#' && !tyConfig.upsellButtonUrl.includes('pay.hotmart.com/...')) {
    rawUpsell = tyConfig.upsellButtonUrl.trim();
  } else if ((project?.multimedia_json as any)?.thankYouPage?.upsellButtonUrl && (project.multimedia_json as any).thankYouPage.upsellButtonUrl.trim() !== '' && (project.multimedia_json as any).thankYouPage.upsellButtonUrl.trim() !== '#') {
    rawUpsell = (project.multimedia_json as any).thankYouPage.upsellButtonUrl.trim();
  } else if (assignedAffiliateLinks.length > 0) {
    rawUpsell = assignedAffiliateLinks[0].url.trim();
  }

  const hasUpsellUrl = Boolean(rawUpsell && rawUpsell !== '#' && (rawUpsell.startsWith('http://') || rawUpsell.startsWith('https://')));
  const upsellTargetUrl = hasUpsellUrl ? rawUpsell! : "#";

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
      className={`min-h-screen font-sans ${activeDs.hero.bgGradient || 'bg-[#1c1917]'} ${activeDs.selectionColor || 'selection:bg-emerald-500 selection:text-white'} ${content.palette === 'minimal-mono' ? 'text-gray-900' : 'text-white'} scroll-smooth relative overflow-hidden flex flex-col antialiased`}
    >
      {/* Resplandor ambiental coherente con el Hero de la página de captura */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full blur-[140px] pointer-events-none ${activeDs.blobColor} ${activeDs.blobOpacity || 'opacity-20'}`}></div>
      <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 w-[950px] h-[650px] rounded-full blur-[160px] pointer-events-none ${activeDs.blobColor} opacity-10`}></div>

      {/* 1. FRANJA SUPERIOR DEL LOGO (COHERENTE CON EL NAVBAR DE LA CAPTURA - IMAGEN 3) */}
      <header className={`w-full py-4 sm:py-5 border-b ${content.palette === 'minimal-mono' ? 'border-gray-200' : 'border-white/10'} ${activeDs.nav.transparentBg} relative z-20 backdrop-blur-md shadow-sm`}>
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
            <span className={`font-bold ${content.palette === 'minimal-mono' ? 'text-gray-900' : 'text-white'} text-base sm:text-lg tracking-tight`}>
              {brandName}
            </span>
          </a>
        </div>
      </header>

      {/* 2. HERO DE CONFIRMACIÓN (FONDO MÁS OSCURO DEL HERO DE LA CAPTURA) */}
      <section className="relative pt-8 sm:pt-10 pb-8 sm:pb-12 text-center px-4 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Icono Check Circular de Confirmación con el color de acento de la captura */}
          <div 
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full ${paletteAccents.checkBg} flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/20 ring-4 ${content.palette === 'minimal-mono' ? 'ring-black/5' : 'ring-white/10'} animate-in zoom-in-75 duration-300`}
            style={{
              marginTop: '1.5em'
            }}
          >
            <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
          </div>

          {/* Título Principal */}
          <h1 
            className={`text-3xl sm:text-4xl md:text-[2.6rem] font-black tracking-tight ${content.palette === 'minimal-mono' ? 'text-gray-900' : 'text-white'} mb-3 leading-tight mx-auto`}
            style={{
              fontSize: '2.7em',
              lineHeight: '1.1em',
              width: '18em',
              maxWidth: '100%',
              paddingBottom: '0em',
              marginBottom: 0,
              paddingTop: '0.5em'
            }}
          >
            {(() => {
              const rawHeadline = (tyConfig.headline || '').trim();
              const isLegacyHeadline =
                !rawHeadline ||
                rawHeadline === "PERFECTO, YA TIENES EL ACCESO A LA CLASE DE MICROBLADING PROFESIONAL" ||
                rawHeadline === "Perfecto, tu registro está confirmado" ||
                rawHeadline === "Perfecto, hemos enviado el acceso a la clase gratuita a tu correo electrónico" ||
                rawHeadline === "¡Registro confirmado! Tu clase gratuita está lista.";
              return isLegacyHeadline
                ? "¡Tu registro está confirmado!"
                : rawHeadline;
            })()}
          </h1>

          {/* Subtítulo */}
          <p 
            className={`text-sm sm:text-base md:text-lg ${activeDs.hero.subtitleColor || (content.palette === 'minimal-mono' ? 'text-gray-500' : 'text-cyan-100')} font-normal leading-relaxed max-w-xl mx-auto mb-2`}
            style={{
              fontSize: '1.3em',
              lineHeight: '1.5em',
              paddingTop: '0.9em',
              maxWidth: '44rem'
            }}
          >
            {(() => {
              const rawSub = (tyConfig.subheadline || '').trim();
              const subLower = rawSub.toLowerCase();
              const isLegacySub =
                !rawSub ||
                subLower.includes("sigue estos 2 pasos") ||
                subLower.includes("únete a nuestro grupo") ||
                subLower.includes("unete a nuestro grupo") ||
                subLower.includes("recibir tu material de preparación") ||
                subLower.includes("tu clase gratuita ya está disponible") ||
                subLower.includes("antes de comenzar, tenemos un regalo adicional");
              return isLegacySub
                ? "Ya puedes acceder a tu clase gratuita y descubrir cómo dar tus primeros pasos de forma profesional."
                : rawSub;
            })()}
          </p>
        </div>
      </section>

      {/* 3. CONTENIDO PRINCIPAL: CLASE GRATUITA ARRIBA + BLOQUE COMPACTO WHATSAPP DEBAJO */}
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
            <div className="text-center max-w-3xl mx-auto mb-6">
              <h2 
                className="text-2xl sm:text-3xl md:text-[1.95rem] font-black tracking-tight text-gray-950 leading-snug mb-2"
                style={{
                  fontSize: '2.4em',
                  lineHeight: '1.3em',
                  paddingBottom: '0.3em'
                }}
              >
                {tyConfig.videoTitle || "¿Cómo empezar profesionalmente con el Microblading de Cejas?"}
              </h2>
              <p 
                className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-lg mx-auto"
                style={{
                  fontSize: '1.4em',
                  lineHeight: '1.3em',
                  textAlign: 'center',
                  maxWidth: '42rem',
                  paddingTop: '0.3em'
                }}
              >
                {tyConfig.videoSubtitle || "Aprende cómo funciona la técnica del Microblading de Cejas, qué necesitas para comenzar y cuáles son los errores que debes evitar."}
              </p>
            </div>

            {/* Píldora de Recomendación ENCIMA del Video */}
            <div className="text-center mb-5 sm:mb-6">
              <div className={`rounded-full py-2 px-6 inline-flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold shadow-sm ${paletteAccents.recommendBg}`}>
                <Play className="w-4 h-4 sm:w-4 sm:h-4 shrink-0 fill-current" />
                <span>
                  {tyConfig.videoNoticeText &&
                  tyConfig.videoNoticeText.trim() !== "Te recomendamos ver la clase completa antes de continuar."
                    ? tyConfig.videoNoticeText
                    : "Haz clic para reproducir el video de la Clase Completa"}
                </span>
              </div>
            </div>

            {/* REPRODUCTOR DE VIDEO DE ALTA FIDELIDAD */}
            <div 
              onClick={!isPlaying ? handlePlayClick : undefined}
              className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl relative bg-black border border-gray-900 mb-4 select-none group cursor-pointer"
            >
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
                  {/* Captura de carga del video publicado sin textos sobre ella (Ref. Imagen 1) */}
                  <img
                    src={videoPoster}
                    alt="Captura del video"
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  />

                  {/* Botón Central de Play */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayClick();
                    }}
                    aria-label="Reproducir video"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white shadow-2xl hover:scale-110 hover:bg-black/80 transition-all duration-300 cursor-pointer z-20 group/play focus:outline-none"
                  >
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white text-white ml-1 group-hover/play:scale-105 transition-transform" />
                  </button>
                </>
              )}
            </div>

            {/* SECCIÓN INTERNA: ¿Te gustaría aprender [nicho] paso a paso? (FORMACIÓN / UPSELL) */}
            <div className="pt-8 border-t border-gray-100">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-2xl sm:text-3xl md:text-[2.1rem] font-black tracking-tight text-gray-950">
                  {(() => {
                    const rawUpsellTitle = (tyConfig.upsellTitle || '').trim();
                    const isLegacyUpsellTitle =
                      !rawUpsellTitle ||
                      rawUpsellTitle === "¿Quieres aprender el proceso completo?";
                    if (!isLegacyUpsellTitle) return rawUpsellTitle;

                    const rawNiche = (
                      project?.niche ||
                      (project as any)?.project_niche ||
                      (project as any)?.master_niche ||
                      (project?.strategy_json as any)?.meta?.niche ||
                      (content as any)?.niche ||
                      ''
                    ).trim();

                    if (rawNiche) {
                      const lowerFirst = rawNiche.charAt(0).toLowerCase() + rawNiche.slice(1);
                      return `¿Te gustaría aprender ${lowerFirst} paso a paso?`;
                    }
                    return "¿Te gustaría aprender el proceso paso a paso?";
                  })()}
                </h3>
              </div>

              {/* Descripción debajo del título dinámico de formación */}
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto mb-8 font-medium">
                  Descubre la formación completa, los módulos y todo lo que aprenderás para seguir desarrollando tus habilidades.
                </p>

                {/* Botón CTA Formación Completa con tamaño prominente */}
                <div className="max-w-md mx-auto">
                  {(() => {
                    const rawUpsellBtnText = (tyConfig.upsellButtonText || '').trim();
                    const upsellBtnLabel =
                      rawUpsellBtnText && rawUpsellBtnText.toUpperCase() !== "CONOCER LA FORMACIÓN COMPLETA"
                        ? rawUpsellBtnText
                        : "CONOCER EL CURSO COMPLETO";

                    return hasUpsellUrl ? (
                      <a
                        href={upsellTargetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full ${activeDs.buttons.primary} py-4 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-98 transition-all cursor-pointer`}
                      >
                        <GraduationCap className="w-5 h-5 shrink-0" />
                        <span>{upsellBtnLabel}</span>
                        <ExternalLink className="w-4 h-4 shrink-0 ml-0.5" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        title="Hotlink de formación no configurado aún"
                        className={`w-full ${activeDs.buttons.primary} opacity-50 py-4 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-3 shadow-md cursor-not-allowed select-none`}
                      >
                        <GraduationCap className="w-5 h-5 shrink-0" />
                        <span>{upsellBtnLabel}</span>
                        <ExternalLink className="w-4 h-4 shrink-0 ml-0.5 opacity-50" />
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>

          </div>

          {/* BLOQUE COMPACTO INFERIOR: COMUNIDAD WHATSAPP + GUÍA PRÁCTICA (DEBAJO DE LA CLASE GRATUITA) */}
          <div
            className={`rounded-2xl p-5 sm:p-7 border shadow-2xl backdrop-blur-md text-left ${
              content.palette === 'minimal-mono'
                ? 'bg-white border-gray-200 text-gray-900'
                : 'bg-black/35 border-white/15 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <Gift className={`w-5 h-5 shrink-0 ${content.palette === 'minimal-mono' ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <h2 className={`text-base sm:text-lg font-extrabold tracking-tight ${content.palette === 'minimal-mono' ? 'text-gray-900' : 'text-white'}`}>
                Un regalo adicional para ti
              </h2>
            </div>

            <p className={`text-sm sm:text-[15px] leading-relaxed mb-5 ${content.palette === 'minimal-mono' ? 'text-gray-600' : 'text-gray-200'}`}>
              Únete gratis a nuestra comunidad de WhatsApp y recibe una guía práctica para principiantes con materiales, recomendaciones y errores que debes evitar.
            </p>

            {(() => {
              const rawBtnText = (tyConfig.whatsappButtonText || '').trim();
              const btnLabel =
                rawBtnText && rawBtnText !== "UNIRME AL GRUPO Y RECIBIR LA GUÍA"
                  ? rawBtnText
                  : "UNIRME Y RECIBIR LA GUÍA GRATUITA";

              return hasWhatsAppGroup ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#063B27] hover:bg-[#084D33] border border-emerald-500/35 text-white py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-lg transition-all hover:scale-[1.01] cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{btnLabel}</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Enlace de WhatsApp no configurado aún"
                  className="w-full bg-[#063B27]/60 border border-emerald-500/20 text-white/70 py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 cursor-not-allowed select-none"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400/70 shrink-0" />
                  <span>{btnLabel}</span>
                </button>
              );
            })()}

            <p className={`mt-3 text-center text-xs font-medium ${content.palette === 'minimal-mono' ? 'text-gray-500' : 'text-gray-300/90'}`}>
              Acceso voluntario y gratuito. No necesitas unirte para ver la clase.
            </p>
          </div>

        </div>
      </main>

      {/* 4. FOOTER OSCURO ELEGANTE INTEGRADO CON LA PALETA */}
      <footer className={`w-full border-t ${content.palette === 'minimal-mono' ? 'border-gray-200 text-gray-600' : 'border-white/10 text-white'} ${activeDs.footer?.bg || 'bg-black/50'} py-10 px-6 relative z-10`}>
        <div className="max-w-[50rem] mx-auto flex flex-col items-center justify-center text-center">
          {/* Logo centrado */}
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md overflow-hidden shrink-0 ${activeDs.nav.logoBg} ${activeDs.nav.logoText}`}>
              {renderLogoIcon()}
            </div>
            <span className={`font-bold ${content.palette === 'minimal-mono' ? 'text-gray-900' : 'text-white'} text-base tracking-tight`}>
              {brandName}
            </span>
          </div>

          {/* Copyright Inferior */}
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} {brandName} . Todos los derechos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
};
