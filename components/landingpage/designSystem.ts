
import { ColorPalette } from '../../types';

// Definición de la interfaz del Sistema de Diseño para asegurar consistencia
interface DesignSystem {
  // Global
  bg: string;
  blobColor: string;
  blobOpacity: string;
  selectionColor: string;
  textColor: string;
  
  // Badges & Labels
  badges: {
    liveBg: string;
    liveText: string;
    liveBorder: string;
    spotsBg: string;
    spotsText: string;
    spotsBorder: string;
  };

  // Decorations (Icons, Stars, Checks, Play Buttons)
  decorations: {
    starColor: string; // Estrellas de rating
    checkColor: string; // Iconos de check
    playButtonBg: string; // Fondo circular botón play
    playButtonIcon: string; // Color triangulo play
    playButtonBorder: string; // Borde del botón play
  };

  // Navigation
  nav: {
    stickyBg: string;
    stickyText: string;
    stickyBorder: string;
    logoBg: string;
    logoText: string; // Icon color inside logo
    linkHover: string;
    mobileMenuBg: string;
    mobileMenuText: string;
    mobileMenuBorder: string;
    ctaButton: string; // Botón especifico del navbar
  };

  // Hero Section
  hero: {
    bgGradient: string;
    titleColor: string;
    subtitleColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    videoCardBg: string; // Fondo del placeholder de video
    videoCardBorder: string;
    socialProofText: string;
  };

  // Buttons
  buttons: {
    primary: string; // Clases completas (bg, text, shadow, hover)
    secondary: string;
  };

  // Intro Section
  intro: {
    sectionBg: string;
    titleColor: string;
    textColor: string;
    highlightColor: string; // Color para textos destacados o bullets
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    // Floating Card Styles
    floatingCardBg: string;
    floatingCardText: string;
    floatingCardBorder: string;
    floatingCardIcon: string;
  };

  // Feature Cards (Beneficios)
  features: {
    sectionBg: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    iconContainer: string; 
    iconColor: string; 
    titleColor: string;
    descColor: string;
  };

  // Steps Section
  steps: {
    sectionBg: string;
    titleColor: string;
    textColor: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    numberColor: string;
    iconContainer: string;
  };

  // Testimonials
  testimonials: {
    sectionBg: string;
    sectionBorder: string;
    titleColor: string;
    subtitleColor: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    nameColor: string;
    roleColor: string;
    textColor: string;
    starColor: string;
  };

  // Instructor / Mentor
  instructor: {
    sectionBg: string;
    titleColor: string;
    textColor: string;
    bioColor: string; // Color especifico para la biografía
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    statBg: string;
    statBorder: string;
    statValueColor: string;
    statLabelColor: string;
  };

  // CTA & Forms (Inputs, Boxes)
  cta: {
    sectionBg: string; // Fondo de la SECCIÓN (puede ser oscuro)
    sectionTitleColor: string; // Título sobre el fondo de sección
    sectionTextColor: string; // Texto sobre fondo de sección
    
    // Card / Form Container
    containerBg: string; // Fondo de la TARJETA/FORMULARIO (puede ser blanco)
    containerBorder: string;
    cardTitleColor: string; // Título DENTRO de la tarjeta
    cardTextColor: string; // Texto DENTRO de la tarjeta
    
    subtitleColor: string; // Texto garantía debajo del botón
    
    // Input Styles
    inputBg: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;
    inputIconColor: string; // Color del icono dentro del input
    inputRing: string;
  };

  // FAQ
  faq: {
    sectionBg: string;
    titleColor: string;
    cardBg: string;
    cardBorder: string;
    questionColor: string;
    answerColor: string;
    iconBg: string;
    iconColor: string;
  };

  // Footer
  footer: {
    bg: string;
    borderTop: string;
    titleColor: string;
    textColor: string;
    linkHover: string;
    copyrightColor: string;
    socialBg: string;
    socialIcon: string;
    socialHoverBg: string; // Hover state background
    socialHoverIcon: string; // Hover state icon
  };
}

const BASE_DS: DesignSystem = {
    // Valores por defecto (fallback)
    bg: 'bg-white',
    blobColor: 'bg-blue-500',
    blobOpacity: 'opacity-20',
    selectionColor: 'selection:bg-blue-500 selection:text-white',
    textColor: 'text-gray-900',
    badges: { liveBg: 'bg-red-500/10', liveText: 'text-red-500', liveBorder: 'border-red-500/20', spotsBg: 'bg-amber-100', spotsText: 'text-amber-800', spotsBorder: 'border-amber-200' },
    decorations: { starColor: 'text-yellow-400', checkColor: 'text-green-500', playButtonBg: 'bg-white/90', playButtonIcon: 'text-blue-600', playButtonBorder: 'border-white/20' },
    nav: { stickyBg: 'bg-white', stickyText: 'text-gray-900', stickyBorder: 'border-gray-100', logoBg: 'bg-blue-600', logoText: 'text-white', linkHover: 'text-blue-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-gray-900', mobileMenuBorder: 'border-gray-100', ctaButton: 'bg-blue-600 text-white' },
    hero: { bgGradient: 'bg-white', titleColor: 'text-gray-900', subtitleColor: 'text-gray-600', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700', badgeBorder: 'border-blue-200', videoCardBg: 'bg-gray-900', videoCardBorder: 'border-gray-200', socialProofText: 'text-gray-600' },
    buttons: { primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg', secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
    intro: { sectionBg: 'bg-white', titleColor: 'text-gray-900', textColor: 'text-gray-600', highlightColor: 'text-blue-600', badgeBg: 'bg-gray-100', badgeText: 'text-gray-800', badgeBorder: 'border-gray-200', floatingCardBg: 'bg-white', floatingCardText: 'text-gray-900', floatingCardBorder: 'border-gray-100', floatingCardIcon: 'text-blue-500' },
    features: { sectionBg: 'bg-gray-50', cardBg: 'bg-white', cardBorder: 'border-gray-100', cardShadow: 'shadow-lg', iconContainer: 'bg-blue-100', iconColor: 'text-blue-600', titleColor: 'text-gray-900', descColor: 'text-gray-600' },
    steps: { sectionBg: 'bg-white', titleColor: 'text-gray-900', textColor: 'text-gray-600', cardBg: 'bg-white', cardBorder: 'border-gray-200', cardShadow: 'shadow-md', numberColor: 'text-blue-600', iconContainer: 'bg-blue-50' },
    testimonials: { sectionBg: 'bg-gray-50', sectionBorder: 'border-gray-200', titleColor: 'text-gray-900', subtitleColor: 'text-gray-600', cardBg: 'bg-white', cardBorder: 'border-gray-100', cardShadow: 'shadow-md', nameColor: 'text-gray-900', roleColor: 'text-gray-500', textColor: 'text-gray-700', starColor: 'text-yellow-400' },
    instructor: { sectionBg: 'bg-gray-900', titleColor: 'text-white', textColor: 'text-gray-300', bioColor: 'text-gray-400', badgeBg: 'bg-white/10', badgeText: 'text-white', badgeBorder: 'border-white/20', statBg: 'bg-white/10', statBorder: 'border-white/10', statValueColor: 'text-white', statLabelColor: 'text-gray-400' },
    cta: { 
        sectionBg: 'bg-blue-600', sectionTitleColor: 'text-white', sectionTextColor: 'text-blue-100',
        containerBg: 'bg-white', containerBorder: 'border-transparent', cardTitleColor: 'text-gray-900', cardTextColor: 'text-gray-600',
        subtitleColor: 'text-gray-500', inputBg: 'bg-gray-50', inputBorder: 'border-gray-200', inputText: 'text-gray-900', inputPlaceholder: 'placeholder-gray-400', inputIconColor: 'text-gray-400', inputRing: 'focus:ring-blue-500' 
    },
    faq: { sectionBg: 'bg-white', titleColor: 'text-gray-900', cardBg: 'bg-gray-50', cardBorder: 'border-transparent', questionColor: 'text-gray-900', answerColor: 'text-gray-600', iconBg: 'bg-gray-200', iconColor: 'text-gray-600' },
    footer: { bg: 'bg-gray-900', borderTop: 'border-gray-800', titleColor: 'text-white', textColor: 'text-gray-400', linkHover: 'text-white', copyrightColor: 'text-gray-600', socialBg: 'bg-white/10', socialIcon: 'text-white', socialHoverBg: 'bg-blue-600', socialHoverIcon: 'text-white' }
};

export const getDesignSystem = (palette: ColorPalette): DesignSystem => {
  switch (palette) {
    case 'modern-blue': 
      return {
        ...BASE_DS,
        bg: 'bg-slate-50',
        blobColor: 'bg-blue-500',
        blobOpacity: 'opacity-20',
        badges: { liveBg: 'bg-red-500/10', liveText: 'text-red-500', liveBorder: 'border-red-500/20', spotsBg: 'bg-blue-100', spotsText: 'text-blue-800', spotsBorder: 'border-blue-200' },
        decorations: { starColor: 'text-yellow-400', checkColor: 'text-blue-500', playButtonBg: 'bg-white/10', playButtonIcon: 'text-white', playButtonBorder: 'border-white/20' },
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-slate-900', stickyBorder: 'border-slate-100', logoBg: 'bg-blue-600', logoText: 'text-white', linkHover: 'text-blue-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-slate-900', mobileMenuBorder: 'border-slate-100', ctaButton: 'bg-blue-600 text-white' },
        hero: { bgGradient: 'bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-900', titleColor: 'text-white', subtitleColor: 'text-blue-100', badgeBg: 'bg-blue-500/20', badgeText: 'text-blue-100', badgeBorder: 'border-blue-400/30', videoCardBg: 'bg-slate-800', videoCardBorder: 'border-slate-700', socialProofText: 'text-blue-200' },
        buttons: { primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 font-bold', secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20' },
        testimonials: { sectionBg: 'bg-[#0f172a]', sectionBorder: 'border-slate-800', titleColor: 'text-white', subtitleColor: 'text-slate-400', cardBg: 'bg-slate-800', cardBorder: 'border-slate-700', cardShadow: 'shadow-xl', nameColor: 'text-white', roleColor: 'text-blue-400', textColor: 'text-slate-300', starColor: 'text-yellow-400' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-slate-900', textColor: 'text-slate-600', highlightColor: 'text-blue-600', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', badgeBorder: 'border-blue-100', floatingCardBg: 'bg-white', floatingCardText: 'text-slate-900', floatingCardBorder: 'border-slate-100', floatingCardIcon: 'text-blue-500' },
        features: { sectionBg: 'bg-slate-50', cardBg: 'bg-white', cardBorder: 'border-slate-100', cardShadow: 'shadow-xl shadow-slate-200/50', iconContainer: 'bg-blue-100', iconColor: 'text-blue-600', titleColor: 'text-slate-900', descColor: 'text-slate-600' },
        steps: { sectionBg: 'bg-[#1e293b]', titleColor: 'text-white', textColor: 'text-slate-300', cardBg: 'bg-slate-800', cardBorder: 'border-slate-700', cardShadow: 'shadow-lg', numberColor: 'text-blue-400', iconContainer: 'bg-slate-900 border border-slate-700' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-slate-900', cardBg: 'bg-slate-50', cardBorder: 'border-slate-100', questionColor: 'text-slate-900', answerColor: 'text-slate-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
        instructor: { sectionBg: 'bg-slate-900', titleColor: 'text-white', textColor: 'text-slate-300', bioColor: 'text-slate-400', badgeBg: 'bg-blue-500/20', badgeText: 'text-blue-200', badgeBorder: 'border-blue-500/30', statBg: 'bg-slate-800', statBorder: 'border-slate-700', statValueColor: 'text-white', statLabelColor: 'text-slate-400' },
        cta: { 
            sectionBg: 'bg-blue-600', sectionTitleColor: 'text-white', sectionTextColor: 'text-blue-100',
            containerBg: 'bg-white/10 backdrop-blur-md', containerBorder: 'border-white/20', cardTitleColor: 'text-white', cardTextColor: 'text-blue-100',
            subtitleColor: 'text-blue-200', inputBg: 'bg-slate-900/50', inputBorder: 'border-slate-700', inputText: 'text-white', inputPlaceholder: 'placeholder-slate-400', inputIconColor: 'text-slate-400', inputRing: 'focus:ring-blue-400' 
        },
        footer: { bg: 'bg-slate-950', borderTop: 'border-slate-900', titleColor: 'text-white', textColor: 'text-slate-400', linkHover: 'text-white', copyrightColor: 'text-slate-600', socialBg: 'bg-slate-800', socialIcon: 'text-white', socialHoverBg: 'bg-blue-600', socialHoverIcon: 'text-white' }
      };

    case 'elegant-purple': 
      return {
        ...BASE_DS,
        bg: 'bg-[#FDFBFF]',
        blobColor: 'bg-purple-500',
        blobOpacity: 'opacity-20',
        textColor: 'text-purple-900/80',
        badges: { liveBg: 'bg-pink-500/10', liveText: 'text-pink-600', liveBorder: 'border-pink-200', spotsBg: 'bg-purple-100', spotsText: 'text-purple-800', spotsBorder: 'border-purple-200' },
        decorations: { starColor: 'text-pink-500', checkColor: 'text-purple-600', playButtonBg: 'bg-white/20', playButtonIcon: 'text-white', playButtonBorder: 'border-white/20' },
        hero: { bgGradient: 'bg-[#1a0b2e]', titleColor: 'text-white', subtitleColor: 'text-purple-200', badgeBg: 'bg-purple-500/20', badgeText: 'text-purple-200', badgeBorder: 'border-purple-500/30', videoCardBg: 'bg-purple-900/50', videoCardBorder: 'border-purple-800', socialProofText: 'text-purple-200' },
        buttons: { primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-pink-500/30 shadow-lg text-white font-bold', secondary: 'bg-white text-purple-900 hover:bg-gray-50 border border-purple-100' },
        testimonials: { sectionBg: 'bg-[#3b0764]', sectionBorder: 'border-purple-900', titleColor: 'text-white', subtitleColor: 'text-purple-200', cardBg: 'bg-[#2e1065]', cardBorder: 'border-purple-800', cardShadow: 'shadow-xl', nameColor: 'text-white', roleColor: 'text-pink-400', textColor: 'text-purple-100', starColor: 'text-pink-500' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-purple-950', textColor: 'text-gray-600', highlightColor: 'text-purple-600', badgeBg: 'bg-purple-50', badgeText: 'text-purple-700', badgeBorder: 'border-purple-100', floatingCardBg: 'bg-white', floatingCardText: 'text-purple-900', floatingCardBorder: 'border-purple-100', floatingCardIcon: 'text-pink-500' },
        features: { sectionBg: 'bg-[#faf5ff]', cardBg: 'bg-white', cardBorder: 'border-purple-50', cardShadow: 'shadow-lg shadow-purple-100/50', iconContainer: 'bg-purple-100', iconColor: 'text-purple-600', titleColor: 'text-gray-900', descColor: 'text-gray-600' },
        steps: { sectionBg: 'bg-[#2e1065]', titleColor: 'text-white', textColor: 'text-purple-200', cardBg: 'bg-[#4c1d95]', cardBorder: 'border-purple-700', cardShadow: 'shadow-xl', numberColor: 'text-pink-400', iconContainer: 'bg-[#1a0b2e]' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-purple-900', cardBg: 'bg-purple-50/50', cardBorder: 'border-purple-50', questionColor: 'text-purple-900', answerColor: 'text-gray-600', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
        instructor: { sectionBg: 'bg-[#4c1d95]', titleColor: 'text-white', textColor: 'text-purple-100', bioColor: 'text-purple-200', badgeBg: 'bg-white/10', badgeText: 'text-white', badgeBorder: 'border-white/20', statBg: 'bg-white/10', statBorder: 'border-white/10', statValueColor: 'text-white', statLabelColor: 'text-purple-200' },
        cta: { 
            sectionBg: 'bg-purple-900', sectionTitleColor: 'text-white', sectionTextColor: 'text-purple-200',
            containerBg: 'bg-white', containerBorder: 'border-purple-100', cardTitleColor: 'text-purple-900', cardTextColor: 'text-gray-600',
            subtitleColor: 'text-purple-200', inputBg: 'bg-purple-50', inputBorder: 'border-purple-100', inputText: 'text-purple-900', inputPlaceholder: 'placeholder-purple-400', inputIconColor: 'text-purple-400', inputRing: 'focus:ring-pink-500' 
        },
        footer: { bg: 'bg-[#1a0b2e]', borderTop: 'border-purple-900', titleColor: 'text-white', textColor: 'text-purple-300', linkHover: 'text-white', copyrightColor: 'text-purple-500', socialBg: 'bg-purple-900', socialIcon: 'text-white', socialHoverBg: 'bg-pink-600', socialHoverIcon: 'text-white' }
      };

    case 'dark-luxury': 
      return {
        ...BASE_DS,
        bg: 'bg-[#0a0a0a]',
        blobColor: 'bg-yellow-600',
        blobOpacity: 'opacity-10',
        textColor: 'text-gray-400',
        badges: { liveBg: 'bg-red-900/50', liveText: 'text-red-400', liveBorder: 'border-red-800', spotsBg: 'bg-yellow-900/30', spotsText: 'text-yellow-500', spotsBorder: 'border-yellow-700' },
        decorations: { starColor: 'text-yellow-600', checkColor: 'text-yellow-500', playButtonBg: 'bg-white/10', playButtonIcon: 'text-white', playButtonBorder: 'border-white/20' },
        nav: { stickyBg: 'bg-black/90 backdrop-blur', stickyText: 'text-white', stickyBorder: 'border-white/10', logoBg: 'bg-yellow-500', logoText: 'text-black', linkHover: 'text-yellow-500', mobileMenuBg: 'bg-black', mobileMenuText: 'text-white', mobileMenuBorder: 'border-white/10', ctaButton: 'bg-yellow-600 text-black font-bold' },
        hero: { bgGradient: 'bg-black', titleColor: 'text-white', subtitleColor: 'text-gray-400', badgeBg: 'bg-yellow-500/10', badgeText: 'text-yellow-500', badgeBorder: 'border-yellow-500/30', videoCardBg: 'bg-[#111]', videoCardBorder: 'border-white/10', socialProofText: 'text-gray-500' },
        buttons: { primary: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/20', secondary: 'border border-yellow-900/50 text-yellow-500 hover:bg-yellow-900/10' },
        testimonials: { sectionBg: 'bg-[#111]', sectionBorder: 'border-white/5', titleColor: 'text-white', subtitleColor: 'text-gray-500', cardBg: 'bg-[#1a1a1a]', cardBorder: 'border-white/5', cardShadow: 'shadow-none', nameColor: 'text-yellow-500', roleColor: 'text-gray-500', textColor: 'text-gray-300', starColor: 'text-yellow-600' },
        intro: { sectionBg: 'bg-black', titleColor: 'text-white', textColor: 'text-gray-400', highlightColor: 'text-yellow-500', badgeBg: 'bg-white/5', badgeText: 'text-gray-300', badgeBorder: 'border-white/10', floatingCardBg: 'bg-[#111]', floatingCardText: 'text-white', floatingCardBorder: 'border-white/10', floatingCardIcon: 'text-yellow-600' },
        features: { sectionBg: 'bg-[#111]', cardBg: 'bg-[#161616]', cardBorder: 'border-[#222]', cardShadow: 'shadow-2xl shadow-black', iconContainer: 'bg-yellow-900/20', iconColor: 'text-yellow-500', titleColor: 'text-white', descColor: 'text-gray-400' },
        steps: { sectionBg: 'bg-black', titleColor: 'text-white', textColor: 'text-gray-400', cardBg: 'bg-[#111]', cardBorder: 'border-white/10', cardShadow: 'shadow-lg', numberColor: 'text-yellow-500', iconContainer: 'bg-black border border-white/10' },
        faq: { sectionBg: 'bg-[#111]', titleColor: 'text-white', cardBg: 'bg-[#0a0a0a]', cardBorder: 'border-white/5', questionColor: 'text-white', answerColor: 'text-gray-400', iconBg: 'bg-yellow-900/20', iconColor: 'text-yellow-500' },
        instructor: { sectionBg: 'bg-black', titleColor: 'text-white', textColor: 'text-gray-400', bioColor: 'text-gray-500', badgeBg: 'bg-yellow-500/10', badgeText: 'text-yellow-500', badgeBorder: 'border-yellow-500/20', statBg: 'bg-[#111]', statBorder: 'border-white/5', statValueColor: 'text-white', statLabelColor: 'text-gray-500' },
        cta: { 
            sectionBg: 'bg-[#161616]', sectionTitleColor: 'text-white', sectionTextColor: 'text-gray-400',
            containerBg: 'bg-black', containerBorder: 'border-white/10', cardTitleColor: 'text-white', cardTextColor: 'text-gray-400',
            subtitleColor: 'text-gray-500', inputBg: 'bg-[#111]', inputBorder: 'border-white/10', inputText: 'text-white', inputPlaceholder: 'placeholder-gray-600', inputIconColor: 'text-gray-500', inputRing: 'focus:ring-yellow-500' 
        },
        footer: { bg: 'bg-black', borderTop: 'border-white/10', titleColor: 'text-white', textColor: 'text-gray-500', linkHover: 'text-yellow-500', copyrightColor: 'text-gray-700', socialBg: 'bg-[#111]', socialIcon: 'text-gray-400', socialHoverBg: 'bg-yellow-600', socialHoverIcon: 'text-black' }
      };

    case 'energetic-orange':
      return {
        ...BASE_DS,
        bg: 'bg-white',
        blobColor: 'bg-orange-200',
        blobOpacity: 'opacity-30',
        textColor: 'text-gray-700',
        badges: { liveBg: 'bg-red-100', liveText: 'text-red-600', liveBorder: 'border-red-200', spotsBg: 'bg-orange-100', spotsText: 'text-orange-800', spotsBorder: 'border-orange-200' },
        decorations: { starColor: 'text-amber-500', checkColor: 'text-orange-600', playButtonBg: 'bg-white/80', playButtonIcon: 'text-orange-600', playButtonBorder: 'border-orange-200' },
        hero: { bgGradient: 'bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]', titleColor: 'text-gray-900', subtitleColor: 'text-orange-900/80', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700', badgeBorder: 'border-orange-200', videoCardBg: 'bg-orange-50', videoCardBorder: 'border-orange-100', socialProofText: 'text-orange-800' },
        buttons: { primary: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30', secondary: 'bg-white border border-orange-200 text-orange-800 hover:bg-orange-50' },
        testimonials: { sectionBg: 'bg-[#fff7ed]', sectionBorder: 'border-orange-100', titleColor: 'text-gray-900', subtitleColor: 'text-orange-800/60', cardBg: 'bg-white', cardBorder: 'border-orange-50', cardShadow: 'shadow-md', nameColor: 'text-orange-900', roleColor: 'text-gray-500', textColor: 'text-gray-700', starColor: 'text-amber-500' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-gray-900', textColor: 'text-gray-600', highlightColor: 'text-orange-600', badgeBg: 'bg-orange-50', badgeText: 'text-orange-700', badgeBorder: 'border-orange-100', floatingCardBg: 'bg-white', floatingCardText: 'text-gray-900', floatingCardBorder: 'border-orange-100', floatingCardIcon: 'text-orange-500' },
        features: { sectionBg: 'bg-orange-50/50', cardBg: 'bg-white', cardBorder: 'border-orange-100', cardShadow: 'shadow-xl shadow-orange-900/5', iconContainer: 'bg-orange-50', iconColor: 'text-orange-600', titleColor: 'text-gray-900', descColor: 'text-gray-600' },
        steps: { sectionBg: 'bg-[#431407]', titleColor: 'text-white', textColor: 'text-orange-100', cardBg: 'bg-[#2a0a04]', cardBorder: 'border-orange-900', cardShadow: 'shadow-lg', numberColor: 'text-orange-500', iconContainer: 'bg-black/20' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-gray-900', cardBg: 'bg-orange-50/30', cardBorder: 'border-orange-100', questionColor: 'text-gray-900', answerColor: 'text-gray-600', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
        instructor: { sectionBg: 'bg-[#1c1917]', titleColor: 'text-white', textColor: 'text-stone-300', bioColor: 'text-stone-400', badgeBg: 'bg-orange-600', badgeText: 'text-white', badgeBorder: 'border-orange-500', statBg: 'bg-white/10', statBorder: 'border-white/10', statValueColor: 'text-white', statLabelColor: 'text-stone-400' },
        cta: { 
            sectionBg: 'bg-orange-500', sectionTitleColor: 'text-white', sectionTextColor: 'text-orange-100',
            containerBg: 'bg-white', containerBorder: 'border-orange-100', cardTitleColor: 'text-gray-900', cardTextColor: 'text-gray-600',
            subtitleColor: 'text-orange-100', inputBg: 'bg-gray-50', inputBorder: 'border-gray-200', inputText: 'text-gray-900', inputPlaceholder: 'placeholder-gray-400', inputIconColor: 'text-gray-400', inputRing: 'focus:ring-orange-500' 
        },
        footer: { bg: 'bg-[#1c1917]', borderTop: 'border-stone-800', titleColor: 'text-white', textColor: 'text-stone-400', linkHover: 'text-orange-500', copyrightColor: 'text-stone-600', socialBg: 'bg-stone-800', socialIcon: 'text-white', socialHoverBg: 'bg-orange-600', socialHoverIcon: 'text-white' }
      };

    case 'minimal-mono':
      return {
        ...BASE_DS,
        bg: 'bg-white',
        blobColor: 'bg-gray-300',
        blobOpacity: 'opacity-10',
        selectionColor: 'selection:bg-black selection:text-white',
        textColor: 'text-gray-600',
        badges: { liveBg: 'bg-black', liveText: 'text-white', liveBorder: 'border-black', spotsBg: 'bg-gray-100', spotsText: 'text-black', spotsBorder: 'border-gray-200' },
        decorations: { starColor: 'text-black', checkColor: 'text-black', playButtonBg: 'bg-black', playButtonIcon: 'text-white', playButtonBorder: 'border-black' },
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-black', stickyBorder: 'border-black/5', logoBg: 'bg-black', logoText: 'text-white', linkHover: 'text-black font-bold', mobileMenuBg: 'bg-white', mobileMenuText: 'text-black', mobileMenuBorder: 'border-gray-200', ctaButton: 'bg-black text-white hover:bg-gray-800' },
        hero: { bgGradient: 'bg-white', titleColor: 'text-black', subtitleColor: 'text-gray-500', badgeBg: 'bg-gray-100', badgeText: 'text-black', badgeBorder: 'border-gray-200', videoCardBg: 'bg-gray-50', videoCardBorder: 'border-gray-200', socialProofText: 'text-gray-500' },
        buttons: { primary: 'bg-black text-white hover:bg-gray-800 shadow-xl', secondary: 'border border-gray-300 text-gray-600 hover:border-black hover:text-black' },
        testimonials: { sectionBg: 'bg-gray-50', sectionBorder: 'border-gray-200', titleColor: 'text-black', subtitleColor: 'text-gray-500', cardBg: 'bg-white', cardBorder: 'border-gray-200', cardShadow: 'shadow-sm', nameColor: 'text-black', roleColor: 'text-gray-400', textColor: 'text-gray-800', starColor: 'text-black' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-black', textColor: 'text-gray-600', highlightColor: 'text-black', badgeBg: 'bg-black', badgeText: 'text-white', badgeBorder: 'border-black', floatingCardBg: 'bg-white', floatingCardText: 'text-black', floatingCardBorder: 'border-black', floatingCardIcon: 'text-black' },
        features: { sectionBg: 'bg-gray-50', cardBg: 'bg-white', cardBorder: 'border-gray-200', cardShadow: 'shadow-sm hover:shadow-md', iconContainer: 'bg-gray-100', iconColor: 'text-black', titleColor: 'text-black', descColor: 'text-gray-600' },
        steps: { sectionBg: 'bg-black', titleColor: 'text-white', textColor: 'text-gray-400', cardBg: 'bg-[#111]', cardBorder: 'border-white/10', cardShadow: 'shadow-md', numberColor: 'text-white', iconContainer: 'bg-white/10' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-black', cardBg: 'bg-gray-50', cardBorder: 'border-gray-200', questionColor: 'text-black', answerColor: 'text-gray-600', iconBg: 'bg-gray-200', iconColor: 'text-black' },
        instructor: { sectionBg: 'bg-white', titleColor: 'text-black', textColor: 'text-gray-600', bioColor: 'text-gray-500', badgeBg: 'bg-black', badgeText: 'text-white', badgeBorder: 'border-black', statBg: 'bg-gray-50', statBorder: 'border-gray-200', statValueColor: 'text-black', statLabelColor: 'text-gray-500' },
        cta: { 
            sectionBg: 'bg-gray-100', sectionTitleColor: 'text-black', sectionTextColor: 'text-gray-500',
            containerBg: 'bg-white', containerBorder: 'border-gray-200 shadow-xl', cardTitleColor: 'text-black', cardTextColor: 'text-gray-500',
            subtitleColor: 'text-gray-400', inputBg: 'bg-gray-50', inputBorder: 'border-gray-200', inputText: 'text-black', inputPlaceholder: 'placeholder-gray-400', inputIconColor: 'text-gray-400', inputRing: 'focus:ring-black' 
        },
        footer: { bg: 'bg-white', borderTop: 'border-gray-200', titleColor: 'text-black', textColor: 'text-gray-500', linkHover: 'text-black', copyrightColor: 'text-gray-400', socialBg: 'bg-gray-100', socialIcon: 'text-black', socialHoverBg: 'bg-black', socialHoverIcon: 'text-white' }
      };

    case 'nature-green':
      return {
        ...BASE_DS,
        bg: 'bg-stone-50',
        blobColor: 'bg-green-500',
        blobOpacity: 'opacity-20',
        textColor: 'text-stone-600',
        badges: { liveBg: 'bg-red-500/10', liveText: 'text-red-500', liveBorder: 'border-red-500/20', spotsBg: 'bg-green-100', spotsText: 'text-green-800', spotsBorder: 'border-green-200' },
        decorations: { starColor: 'text-green-500', checkColor: 'text-green-600', playButtonBg: 'bg-white/20', playButtonIcon: 'text-white', playButtonBorder: 'border-white/20' },
        nav: { stickyBg: 'bg-stone-50/90 backdrop-blur', stickyText: 'text-stone-800', stickyBorder: 'border-stone-200', logoBg: 'bg-green-700', logoText: 'text-white', linkHover: 'text-green-700', mobileMenuBg: 'bg-stone-50', mobileMenuText: 'text-stone-800', mobileMenuBorder: 'border-stone-200', ctaButton: 'bg-green-700 text-white' },
        hero: { bgGradient: 'bg-[#1c1917]', titleColor: 'text-stone-100', subtitleColor: 'text-stone-400', badgeBg: 'bg-green-900/50', badgeText: 'text-green-400', badgeBorder: 'border-green-800', videoCardBg: 'bg-[#292524]', videoCardBorder: 'border-stone-700', socialProofText: 'text-stone-400' },
        buttons: { primary: 'bg-green-700 hover:bg-green-600 text-white shadow-lg shadow-green-900/20', secondary: 'border border-stone-600 text-stone-300 hover:text-white' },
        testimonials: { sectionBg: 'bg-[#022c22]', sectionBorder: 'border-green-900', titleColor: 'text-white', subtitleColor: 'text-green-200', cardBg: 'bg-[#064e3b]', cardBorder: 'border-green-800', cardShadow: 'shadow-lg', nameColor: 'text-white', roleColor: 'text-green-300', textColor: 'text-green-50', starColor: 'text-green-400' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-stone-800', textColor: 'text-stone-600', highlightColor: 'text-green-700', badgeBg: 'bg-green-100', badgeText: 'text-green-800', badgeBorder: 'border-green-200', floatingCardBg: 'bg-white', floatingCardText: 'text-stone-800', floatingCardBorder: 'border-stone-200', floatingCardIcon: 'text-green-600' },
        features: { sectionBg: 'bg-stone-50', cardBg: 'bg-[#fafaf9]', cardBorder: 'border-stone-200', cardShadow: 'shadow-sm', iconContainer: 'bg-green-100', iconColor: 'text-green-700', titleColor: 'text-stone-800', descColor: 'text-stone-600' },
        steps: { sectionBg: 'bg-[#052e16]', titleColor: 'text-white', textColor: 'text-green-100', cardBg: 'bg-[#064e3b]', cardBorder: 'border-green-800', cardShadow: 'shadow-lg', numberColor: 'text-green-400', iconContainer: 'bg-black/20' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-stone-800', cardBg: 'bg-stone-100', cardBorder: 'border-stone-200', questionColor: 'text-stone-900', answerColor: 'text-stone-600', iconBg: 'bg-green-100', iconColor: 'text-green-700' },
        instructor: { sectionBg: 'bg-[#1c1917]', titleColor: 'text-white', textColor: 'text-green-100', bioColor: 'text-stone-400', badgeBg: 'bg-green-800', badgeText: 'text-white', badgeBorder: 'border-green-700', statBg: 'bg-green-900/50', statBorder: 'border-green-800', statValueColor: 'text-white', statLabelColor: 'text-green-300' },
        cta: { 
            sectionBg: 'bg-stone-200', sectionTitleColor: 'text-stone-800', sectionTextColor: 'text-stone-600',
            containerBg: 'bg-white', containerBorder: 'border-stone-200', cardTitleColor: 'text-stone-800', cardTextColor: 'text-stone-600',
            subtitleColor: 'text-stone-500', inputBg: 'bg-stone-50', inputBorder: 'border-stone-200', inputText: 'text-stone-900', inputPlaceholder: 'placeholder-stone-400', inputIconColor: 'text-stone-400', inputRing: 'focus:ring-green-600' 
        },
        footer: { bg: 'bg-[#1c1917]', borderTop: 'border-stone-800', titleColor: 'text-white', textColor: 'text-stone-400', linkHover: 'text-green-400', copyrightColor: 'text-stone-600', socialBg: 'bg-stone-800', socialIcon: 'text-stone-400', socialHoverBg: 'bg-green-700', socialHoverIcon: 'text-white' }
      };

    default:
        // Fallback a Modern Blue si no coincide
        return getDesignSystem('modern-blue');
  }
};
