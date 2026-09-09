import React, { useState } from 'react';
import { GeneratedPageContent, ThankYouPageConfig } from '../../types';
import { FormationMockup, GuideMockup } from './ThankYouMockups';
import {
  Check, Mail, Play, Pause, Volume2, VolumeX,
  Settings, Maximize2, Clock, User, GraduationCap,
  ExternalLink, Gift, MessageCircle
} from 'lucide-react';

interface LiveThankYouPageProps {
  content: GeneratedPageContent;
  ds?: any; // Design System (optional)
  isMobilePreview?: boolean;
  pageId?: string;
  basePath?: string;
  project?: any;
}

export const LiveThankYouPage: React.FC<LiveThankYouPageProps> = ({
  content,
  isMobilePreview,
  pageId,
  basePath,
  project
}) => {
  const tyConfig: ThankYouPageConfig = content.thankYouPage || {};

  // Brand Name & Visuals
  const brandName = tyConfig.headerLogoText || content.brandName || project?.name || "ResinPro Studio Latino";
  const nicheSlogan = tyConfig.footerTagline || "Transformando ideas en suelos que generan oportunidades.";

  // WhatsApp Link Resolution
  const rawWhatsapp = tyConfig.ctaLink || project?.whatsappGroupUrl || project?.whatsapp_group_url || (project?.multimedia_json as any)?.whatsappGroupUrl;
  const whatsappLink = (rawWhatsapp && rawWhatsapp.trim() !== '' && rawWhatsapp !== '#') ? rawWhatsapp : "#";

  // Upsell Button Resolution
  const upsellTargetUrl = tyConfig.upsellButtonUrl || content.destination?.url || project?.paymentUrl || "#";

  // Video State & Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<string>("0:00");

  const videoUrl = tyConfig.videoUrl || "";
  const videoDuration = tyConfig.videoDuration || "34:28";
  const videoPoster = tyConfig.videoPosterUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80";

  // YouTube / Vimeo embed parser
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

  const embedUrl = getEmbedVideoUrl(videoUrl);

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

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0A0915] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* 1. HEADER MINIMALISTA SUPERIOR (BRAND MARK) */}
      <header className="pt-6 pb-4 px-4 flex justify-center items-center z-20">
        <a 
          href={basePath || '/'}
          className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity group cursor-pointer"
        >
          {/* Logo circular con degradado vibrante e isotipo */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <div className="w-2 h-2 rounded-full bg-white shadow-inner"></div>
          </div>
          <span className="text-white text-sm md:text-base font-bold tracking-tight">
            {brandName}
          </span>
        </a>
      </header>

      {/* 2. HERO DE CONFIRMACIÓN */}
      <section className="pt-3 pb-8 px-4 text-center relative z-10">
        {/* Glow de fondo ambiental */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Icono Check Circular Verde */}
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#00B758] flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/10 animate-in zoom-in-75 duration-300">
            <Check className="w-7 h-7 stroke-[3]" />
          </div>

          {/* Título Principal */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2.5">
            {tyConfig.headline || "Perfecto, tu registro está confirmado"}
          </h1>

          {/* Subtítulo de alivio */}
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-4 font-normal">
            {tyConfig.subheadline || "Tu clase gratuita ya está disponible. También hemos enviado el acceso a tu correo para que puedas volver cuando quieras."}
          </p>

          {/* Píldora de aviso de correo & spam */}
          <div className="inline-flex items-center gap-2 bg-[#1b152d]/90 border border-[#423167] rounded-full py-1.5 sm:py-2 px-4 sm:px-5 text-xs text-gray-200 shadow-md">
            <Mail className="w-4 h-4 text-[#00B758] shrink-0" />
            <span>{tyConfig.emailNotificationText || "Revisa tu bandeja de entrada (y spam) para encontrar el acceso."}</span>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL: 3 TARJETAS BLANCAS DE ALTA CONVERSIÓN */}
      <main className="flex-1 px-4 pb-16 relative z-10">
        <div className="max-w-3xl mx-auto space-y-7">

          {/* ========================================================
              TARJETA 1: LA CLASE GRATUITA + OFERTA DE FORMACIÓN
             ======================================================== */}
          <div className="bg-white rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl border border-emerald-500/30 ring-1 ring-emerald-500/10 text-gray-900 transition-shadow">
            
            {/* Badge Centrado: CLASE GRATUITA */}
            <div className="text-center mb-3">
              <span className="inline-block bg-[#008A4B] text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
                {tyConfig.videoBadge || "CLASE GRATUITA"}
              </span>
            </div>

            {/* Título y Subtítulo de la Masterclass */}
            <div className="text-center max-w-2xl mx-auto mb-5">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-2">
                {tyConfig.videoTitle || "Cómo empezar profesionalmente con resina epóxica para suelos"}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
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
              ) : isPlaying && videoUrl.endsWith('.mp4') ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  {/* Poster / Fotograma de la clase */}
                  <img
                    src={videoPoster}
                    alt="Masterclass"
                    className="w-full h-full object-cover brightness-[0.78] group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  
                  {/* Overlay gradiente oscuro */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none"></div>

                  {/* Watermark superior izquierdo */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-1.5">
                    <span className="text-white/90 text-[10px] sm:text-xs font-semibold tracking-wide drop-shadow-md">
                      {brandName}
                    </span>
                  </div>

                  {/* Frase poética / de valor a la derecha */}
                  <div className="hidden sm:block absolute top-4 right-4 z-10 text-right">
                    <p className="text-white/90 text-xs md:text-sm font-serif italic drop-shadow-md">
                      Suelos que inspiran oportunidades
                    </p>
                  </div>

                  {/* Título inferior izquierdo sobre el video */}
                  <div className="absolute left-3 sm:left-5 bottom-12 sm:bottom-14 z-10 max-w-[65%] text-left">
                    <h3 className="text-white font-black text-xs sm:text-base md:text-xl uppercase tracking-tight leading-snug drop-shadow-lg">
                      {tyConfig.videoTitle ? tyConfig.videoTitle.toUpperCase() : "INTRODUCCIÓN A LA RESINA EPÓXICA PARA SUELOS"}
                    </h3>
                    <div className="mt-1 sm:mt-1.5 inline-block bg-[#4F46E5]/90 backdrop-blur-sm text-white text-[9px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-md">
                      De un proyecto a un negocio rentable
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
                      className="text-white hover:text-emerald-400 transition-colors p-1"
                    >
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
                    </button>
                    
                    <span className="text-gray-300 shrink-0 text-[10px] sm:text-xs">
                      {videoCurrentTime} / {videoDuration}
                    </span>

                    {/* Barra de Progreso Scrub */}
                    <div className="flex-1 mx-1 sm:mx-2 bg-gray-700/80 h-1.5 rounded-full overflow-hidden relative cursor-pointer">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[18%] relative rounded-full">
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
              <div className="bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-xl py-2 px-4 sm:px-6 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium shadow-sm">
                <Clock className="w-4 h-4 text-[#008A4B] shrink-0" />
                <span>{tyConfig.videoNoticeText || "Te recomendamos ver la clase completa antes de continuar."}</span>
              </div>
            </div>

            {/* SECCIÓN INTERNA: ¿Quieres aprender el proceso completo? (FORMACIÓN / UPSELL) */}
            <div className="pt-6 border-t border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-1">
                  {tyConfig.upsellTitle || "¿Quieres aprender el proceso completo?"}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  {tyConfig.upsellSubtitle || "Lleva tus habilidades al siguiente nivel con nuestra formación especializada."}
                </p>
              </div>

              {/* Grid 2 Columnas: Mockup 3D + Beneficios y Botón */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Columna Izquierda: Mockup 3D del Programa */}
                <div>
                  <FormationMockup 
                    title={tyConfig.upsellProductName || "ESPECIALISTA EN RESINA EPÓXICA PARA SUELOS"}
                    subtitle="De la práctica a un negocio rentable"
                    brandName={brandName}
                    customImageUrl={tyConfig.upsellImageUrl}
                  />
                </div>

                {/* Columna Derecha: Detalles del Programa y CTA */}
                <div className="space-y-4 text-left">
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-gray-900 leading-tight mb-2">
                      {tyConfig.upsellProductName || "Especialista en Resina Epóxica para Suelos"}
                    </h4>

                    {/* Ficha del Instructor */}
                    <div className="flex items-center gap-2.5 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-gray-900 leading-tight">
                          Impartido por: {tyConfig.upsellInstructorName || "Ariana Zamora"}
                        </p>
                        <p className="text-gray-500 text-[11px] leading-tight">
                          {tyConfig.upsellInstructorTitle || "Especialista en recubrimientos epóxicos"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de 4 Checks de Valor */}
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                    {(tyConfig.upsellBullets || [
                      "Aprende el proceso paso a paso",
                      "Materiales, preparación y aplicación",
                      "Acabados profesionales y corrección de errores",
                      "Acceso a una formación estructurada"
                    ]).map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-full bg-[#00B758] flex items-center justify-center text-white shrink-0 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Botón CTA Formación Completa */}
                  <a
                    href={upsellTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#009B5A] hover:bg-[#00844c] text-white py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer mt-3"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{tyConfig.upsellButtonText || "CONOCER LA FORMACIÓN COMPLETA"}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>


          {/* ========================================================
              TARJETA 2: REGALO ADICIONAL (WHATSAPP + GUÍA PRÁCTICA)
             ======================================================== */}
          <div className="bg-white rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl border border-emerald-500/30 ring-1 ring-emerald-500/10 text-gray-900 transition-shadow">
            
            {/* Badge Centrado: REGALO ADICIONAL */}
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 bg-[#008A4B] text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
                <Gift className="w-3.5 h-3.5" />
                <span>{tyConfig.whatsappBadge || "REGALO ADICIONAL"}</span>
              </span>
            </div>

            {/* Título y Subtítulo de WhatsApp */}
            <div className="text-center max-w-xl mx-auto mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-2">
                {tyConfig.whatsappTitle || "Únete a nuestro grupo de WhatsApp y recibe gratis esta guía práctica"}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                {tyConfig.whatsappSubtitle || "Conecta con nuestra comunidad, resuelve tus dudas y descarga tu guía en formato digital."}
              </p>
            </div>

            {/* Grid 2 Columnas: Mockup de la Guía + Puntos de Valor y Botón de WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Columna Izquierda: Mockup 3D de la Guía */}
              <div>
                <GuideMockup 
                  title={tyConfig.whatsappGuideTitle || "CÓMO CONVERTIR LA APLICACIÓN DE RESINA EPÓXICA PARA SUELOS EN UN NEGOCIO RENTABLE"}
                  subtitle="GUÍA PRÁCTICA PASO A PASO"
                  customImageUrl={tyConfig.whatsappGuideImageUrl}
                />
              </div>

              {/* Columna Derecha: Título de la Guía, Checks y Botón */}
              <div className="space-y-4 text-left">
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-snug">
                  {tyConfig.whatsappGuideTitle || "Cómo convertir la aplicación de resina epóxica para suelos en un negocio rentable"}
                </h4>

                {/* Lista de 4 Checks de la Guía */}
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                  {(tyConfig.whatsappGuideBullets || [
                    "Descubre cómo encontrar clientes",
                    "Aprende a estructurar tu oferta",
                    "Calcula correctamente tus costes",
                    "Conoce cómo presentar el servicio profesionalmente"
                  ]).map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-[#00B758] flex items-center justify-center text-white shrink-0 shadow-sm">
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
                  className="w-full bg-[#00B758] hover:bg-[#009e4c] text-white py-3.5 sm:py-4 px-5 rounded-xl font-bold text-xs sm:text-sm md:text-base tracking-wide uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer mt-4"
                >
                  <MessageCircle className="w-5 h-5 fill-white/20 shrink-0" />
                  <span>{tyConfig.whatsappButtonText || "UNIRME AL GRUPO Y RECIBIR LA GUÍA"}</span>
                </a>
              </div>
            </div>

          </div>


          {/* ========================================================
              TARJETA 3: ¿QUÉ OCURRE AHORA? (3 PASOS DE ONBOARDING)
             ======================================================== */}
          <div className="bg-white rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl border border-gray-100 text-gray-900">
            
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
                {tyConfig.stepsTitle || "¿Qué ocurre ahora?"}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">
                {tyConfig.stepsSubtitle || "Sigue estos 3 pasos para aprovechar al máximo tu acceso:"}
              </p>
            </div>

            {/* Grid 3 Columnas de Pasos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              
              {/* PASO 1 */}
              <div className="bg-gray-50/75 border border-gray-100/90 rounded-2xl p-5 text-center flex flex-col items-center hover:bg-gray-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-xs flex items-center justify-center mb-3">
                  1
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-sm">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                  Mira la clase gratuita
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Aprende los fundamentos y toma nota de las ideas clave.
                </p>
              </div>

              {/* PASO 2 */}
              <div className="bg-gray-50/75 border border-gray-100/90 rounded-2xl p-5 text-center flex flex-col items-center hover:bg-gray-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-sm">
                  <MessageCircle className="w-5 h-5 fill-emerald-600/20" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                  Únete al grupo y descarga la guía
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Conecta con la comunidad y recibe tu material gratuito.
                </p>
              </div>

              {/* PASO 3 */}
              <div className="bg-gray-50/75 border border-gray-100/90 rounded-2xl p-5 text-center flex flex-col items-center hover:bg-gray-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                  Conoce la formación recomendada
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Da el siguiente paso y lleva tu conocimiento al nivel profesional.
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* 4. FOOTER PROFESIONAL INTEGRADO */}
      <footer className="bg-[#0B0A14] text-gray-400 pt-10 pb-8 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 text-left">
            {/* Columna 1: Marca & Lema */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-0.5 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <span className="text-white text-sm font-bold">{brandName}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {nicheSlogan}
              </p>
            </div>

            {/* Columna 2: Enlaces */}
            <div className="text-xs space-y-2">
              <h5 className="text-white font-semibold text-xs tracking-wider uppercase mb-2">
                Enlaces
              </h5>
              <ul className="space-y-1.5 text-gray-400">
                <li><a href={basePath || "/"} className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href={upsellTargetUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Formación</a></li>
                <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href={basePath ? `${basePath}/blog` : "/blog"} className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Columna 3: Legal */}
            <div className="text-xs space-y-2">
              <h5 className="text-white font-semibold text-xs tracking-wider uppercase mb-2">
                Legal
              </h5>
              <ul className="space-y-1.5 text-gray-400">
                <li><a href={basePath ? `${basePath}/privacidad` : "#"} className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href={basePath ? `${basePath}/terminos` : "#"} className="hover:text-white transition-colors">Términos de Uso</a></li>
                <li><a href={basePath ? `${basePath}/aviso-legal` : "#"} className="hover:text-white transition-colors">Aviso Legal</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright Inferior */}
          <div className="pt-6 border-t border-white/5 text-center text-[11px] text-gray-500">
            © {currentYear} {brandName}. Todos los derechos reservados.
          </div>

        </div>
      </footer>

    </div>
  );
};
