
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
    transparentText: string; // Color texto cuando fondo es transparente
    logoBg: string;
    logoText: string; // Icon color inside logo
    linkHover: string;
    transparentBg: string;
    mobileMenuBg: string;
    mobileMenuText: string;
    mobileMenuBorder: string;
    ctaButton: string; // Botón especifico del navbar
  };

  // Hero Section
  hero: {
    bgGradient: string;
    titleColor: string;
    highlightGradient: string; // Gradiente para texto destacado <b>
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
    // Bullet Icons
    bulletIconBg: string;
    bulletIconColor: string;
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
    nav: { stickyBg: 'bg-white', stickyText: 'text-gray-900', transparentText: 'text-white', transparentBg: 'bg-transparent', stickyBorder: 'border-gray-100', logoBg: 'bg-blue-600', logoText: 'text-white', linkHover: 'text-blue-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-gray-900', mobileMenuBorder: 'border-gray-100', ctaButton: 'bg-blue-600 text-white' },
    hero: { bgGradient: 'bg-white', titleColor: 'text-gray-900', highlightGradient: 'from-blue-600 to-cyan-500', subtitleColor: 'text-gray-600', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700', badgeBorder: 'border-blue-200', videoCardBg: 'bg-gray-900', videoCardBorder: 'border-gray-200', socialProofText: 'text-gray-600' },
    buttons: { primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg', secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
    intro: { sectionBg: 'bg-white', titleColor: 'text-gray-900', textColor: 'text-gray-600', highlightColor: 'text-blue-600', badgeBg: 'bg-gray-100', badgeText: 'text-gray-800', badgeBorder: 'border-gray-200', floatingCardBg: 'bg-white', floatingCardText: 'text-gray-900', floatingCardBorder: 'border-gray-100', floatingCardIcon: 'text-blue-500', bulletIconBg: 'bg-blue-100', bulletIconColor: 'text-blue-600' },
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
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-slate-900', transparentText: 'text-white', transparentBg: 'bg-blue-500/20', stickyBorder: 'border-slate-100', logoBg: 'bg-blue-600', logoText: 'text-white', linkHover: 'text-blue-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-slate-900', mobileMenuBorder: 'border-slate-100', ctaButton: 'bg-blue-600 text-white' },
        hero: { bgGradient: 'bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-900', titleColor: 'text-white', highlightGradient: 'from-blue-400 to-cyan-300', subtitleColor: 'text-blue-100', badgeBg: 'bg-blue-500/20', badgeText: 'text-blue-100', badgeBorder: 'border-blue-400/30', videoCardBg: 'bg-slate-800', videoCardBorder: 'border-slate-700', socialProofText: 'text-blue-200' },
        buttons: { primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 font-bold', secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20' },
        testimonials: { sectionBg: 'bg-[#0f172a]', sectionBorder: 'border-slate-800', titleColor: 'text-white', subtitleColor: 'text-slate-400', cardBg: 'bg-slate-800', cardBorder: 'border-slate-700', cardShadow: 'shadow-xl', nameColor: 'text-white', roleColor: 'text-blue-400', textColor: 'text-slate-300', starColor: 'text-yellow-400' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-slate-900', textColor: 'text-slate-600', highlightColor: 'text-blue-600', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', badgeBorder: 'border-blue-100', floatingCardBg: 'bg-white', floatingCardText: 'text-slate-900', floatingCardBorder: 'border-slate-100', floatingCardIcon: 'text-blue-500', bulletIconBg: 'bg-blue-100', bulletIconColor: 'text-blue-600' },
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
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-purple-900', transparentText: 'text-white', transparentBg: 'bg-purple-500/20', stickyBorder: 'border-purple-100', logoBg: 'bg-purple-600', logoText: 'text-white', linkHover: 'text-purple-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-purple-900', mobileMenuBorder: 'border-purple-100', ctaButton: 'bg-purple-600 text-white' },
        hero: { bgGradient: 'bg-[#1a0b2e]', titleColor: 'text-white', highlightGradient: 'from-fuchsia-400 to-pink-400', subtitleColor: 'text-purple-200', badgeBg: 'bg-purple-500/20', badgeText: 'text-purple-200', badgeBorder: 'border-purple-500/30', videoCardBg: 'bg-purple-900/50', videoCardBorder: 'border-purple-800', socialProofText: 'text-purple-200' },
        buttons: { primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-pink-500/30 shadow-lg text-white font-bold', secondary: 'bg-white text-purple-900 hover:bg-gray-50 border border-purple-100' },
        testimonials: { sectionBg: 'bg-[#3b0764]', sectionBorder: 'border-purple-900', titleColor: 'text-white', subtitleColor: 'text-purple-200', cardBg: 'bg-[#2e1065]', cardBorder: 'border-purple-800', cardShadow: 'shadow-xl', nameColor: 'text-white', roleColor: 'text-pink-400', textColor: 'text-purple-100', starColor: 'text-pink-500' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-purple-950', textColor: 'text-gray-600', highlightColor: 'text-purple-600', badgeBg: 'bg-purple-50', badgeText: 'text-purple-700', badgeBorder: 'border-purple-100', floatingCardBg: 'bg-white', floatingCardText: 'text-purple-900', floatingCardBorder: 'border-purple-100', floatingCardIcon: 'text-pink-500', bulletIconBg: 'bg-purple-100', bulletIconColor: 'text-purple-600' },
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
        nav: { stickyBg: 'bg-black/90 backdrop-blur', stickyText: 'text-white', transparentText: 'text-white', transparentBg: 'bg-yellow-500/10', stickyBorder: 'border-white/10', logoBg: 'bg-yellow-500', logoText: 'text-black', linkHover: 'text-yellow-500', mobileMenuBg: 'bg-black', mobileMenuText: 'text-white', mobileMenuBorder: 'border-white/10', ctaButton: 'bg-yellow-600 text-black font-bold' },
        hero: { bgGradient: 'bg-black', titleColor: 'text-white', highlightGradient: 'from-[#F5D061] to-[#E1B326]', subtitleColor: 'text-gray-400', badgeBg: 'bg-yellow-500/10', badgeText: 'text-yellow-500', badgeBorder: 'border-yellow-500/30', videoCardBg: 'bg-[#111]', videoCardBorder: 'border-white/10', socialProofText: 'text-gray-500' },
        buttons: { primary: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/20', secondary: 'border border-yellow-900/50 text-yellow-500 hover:bg-yellow-900/10' },
        testimonials: { sectionBg: 'bg-[#111]', sectionBorder: 'border-white/5', titleColor: 'text-white', subtitleColor: 'text-gray-500', cardBg: 'bg-[#1a1a1a]', cardBorder: 'border-white/5', cardShadow: 'shadow-none', nameColor: 'text-yellow-500', roleColor: 'text-gray-500', textColor: 'text-gray-300', starColor: 'text-yellow-600' },
        intro: { sectionBg: 'bg-black', titleColor: 'text-white', textColor: 'text-gray-400', highlightColor: 'text-yellow-500', badgeBg: 'bg-white/5', badgeText: 'text-gray-300', badgeBorder: 'border-white/10', floatingCardBg: 'bg-[#111]', floatingCardText: 'text-white', floatingCardBorder: 'border-white/10', floatingCardIcon: 'text-yellow-600', bulletIconBg: 'bg-white/5', bulletIconColor: 'text-yellow-500' },
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
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-gray-900', transparentText: 'text-gray-900', transparentBg: 'bg-orange-100/50', stickyBorder: 'border-orange-100', logoBg: 'bg-orange-600', logoText: 'text-white', linkHover: 'text-orange-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-gray-900', mobileMenuBorder: 'border-orange-100', ctaButton: 'bg-orange-600 text-white' },
        hero: { bgGradient: 'bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]', titleColor: 'text-gray-900', highlightGradient: 'from-orange-500 to-red-600', subtitleColor: 'text-orange-900/80', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700', badgeBorder: 'border-orange-200', videoCardBg: 'bg-orange-50', videoCardBorder: 'border-orange-100', socialProofText: 'text-orange-800' },
        buttons: { primary: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30', secondary: 'bg-white border border-orange-200 text-orange-800 hover:bg-orange-50' },
        testimonials: { sectionBg: 'bg-[#fff7ed]', sectionBorder: 'border-orange-100', titleColor: 'text-gray-900', subtitleColor: 'text-orange-800/60', cardBg: 'bg-white', cardBorder: 'border-orange-50', cardShadow: 'shadow-md', nameColor: 'text-orange-900', roleColor: 'text-gray-500', textColor: 'text-gray-700', starColor: 'text-amber-500' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-gray-900', textColor: 'text-gray-600', highlightColor: 'text-orange-600', badgeBg: 'bg-orange-50', badgeText: 'text-orange-700', badgeBorder: 'border-orange-100', floatingCardBg: 'bg-white', floatingCardText: 'text-gray-900', floatingCardBorder: 'border-orange-100', floatingCardIcon: 'text-orange-500', bulletIconBg: 'bg-orange-100', bulletIconColor: 'text-orange-600' },
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

    case 'ocean-teal':
      return {
        ...BASE_DS,
        bg: 'bg-cyan-50',
        blobColor: 'bg-teal-400',
        blobOpacity: 'opacity-20',
        textColor: 'text-cyan-900',
        badges: { liveBg: 'bg-teal-100', liveText: 'text-teal-700', liveBorder: 'border-teal-200', spotsBg: 'bg-cyan-100', spotsText: 'text-cyan-800', spotsBorder: 'border-cyan-200' },
        decorations: { starColor: 'text-teal-400', checkColor: 'text-teal-500', playButtonBg: 'bg-white/90', playButtonIcon: 'text-teal-600', playButtonBorder: 'border-white/20' },
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-teal-900', transparentText: 'text-white', transparentBg: 'bg-teal-500/20', stickyBorder: 'border-teal-100', logoBg: 'bg-teal-600', logoText: 'text-white', linkHover: 'text-teal-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-teal-900', mobileMenuBorder: 'border-teal-100', ctaButton: 'bg-teal-600 text-white' },
        hero: { bgGradient: 'bg-gradient-to-br from-teal-900 via-cyan-900 to-sky-900', titleColor: 'text-white', highlightGradient: 'from-teal-400 to-cyan-300', subtitleColor: 'text-cyan-100', badgeBg: 'bg-teal-500/20', badgeText: 'text-teal-100', badgeBorder: 'border-teal-400/30', videoCardBg: 'bg-teal-950', videoCardBorder: 'border-teal-800', socialProofText: 'text-cyan-200' },
        buttons: { primary: 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/30 font-bold', secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20' },
        testimonials: { sectionBg: 'bg-teal-900', sectionBorder: 'border-teal-800', titleColor: 'text-white', subtitleColor: 'text-teal-200', cardBg: 'bg-teal-950', cardBorder: 'border-teal-800', cardShadow: 'shadow-xl', nameColor: 'text-white', roleColor: 'text-teal-400', textColor: 'text-teal-100', starColor: 'text-cyan-400' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-teal-900', textColor: 'text-cyan-800', highlightColor: 'text-teal-600', badgeBg: 'bg-cyan-100', badgeText: 'text-cyan-800', badgeBorder: 'border-cyan-200', floatingCardBg: 'bg-white', floatingCardText: 'text-teal-900', floatingCardBorder: 'border-teal-100', floatingCardIcon: 'text-teal-500', bulletIconBg: 'bg-cyan-100', bulletIconColor: 'text-teal-600' },
        features: { sectionBg: 'bg-cyan-50', cardBg: 'bg-white', cardBorder: 'border-cyan-100', cardShadow: 'shadow-lg shadow-cyan-200/50', iconContainer: 'bg-teal-100', iconColor: 'text-teal-600', titleColor: 'text-teal-900', descColor: 'text-cyan-700' },
        steps: { sectionBg: 'bg-teal-950', titleColor: 'text-white', textColor: 'text-teal-200', cardBg: 'bg-teal-900', cardBorder: 'border-teal-800', cardShadow: 'shadow-lg', numberColor: 'text-cyan-400', iconContainer: 'bg-teal-950 border border-teal-800' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-teal-900', cardBg: 'bg-cyan-50', cardBorder: 'border-cyan-100', questionColor: 'text-teal-900', answerColor: 'text-cyan-700', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
        instructor: { sectionBg: 'bg-cyan-950', titleColor: 'text-white', textColor: 'text-cyan-200', bioColor: 'text-cyan-300', badgeBg: 'bg-teal-500/20', badgeText: 'text-teal-100', badgeBorder: 'border-teal-500/30', statBg: 'bg-teal-900', statBorder: 'border-teal-800', statValueColor: 'text-white', statLabelColor: 'text-teal-300' },
        cta: { 
            sectionBg: 'bg-teal-600', sectionTitleColor: 'text-white', sectionTextColor: 'text-teal-100',
            containerBg: 'bg-white', containerBorder: 'border-teal-100', cardTitleColor: 'text-teal-900', cardTextColor: 'text-cyan-700',
            subtitleColor: 'text-teal-200', inputBg: 'bg-cyan-50', inputBorder: 'border-cyan-200', inputText: 'text-teal-900', inputPlaceholder: 'placeholder-teal-400', inputIconColor: 'text-teal-500', inputRing: 'focus:ring-teal-400' 
        },
        footer: { bg: 'bg-teal-950', borderTop: 'border-teal-900', titleColor: 'text-white', textColor: 'text-teal-400', linkHover: 'text-white', copyrightColor: 'text-teal-600', socialBg: 'bg-teal-900', socialIcon: 'text-white', socialHoverBg: 'bg-teal-600', socialHoverIcon: 'text-white' }
      };

    case 'crimson-red':
      return {
        ...BASE_DS,
        bg: 'bg-rose-50',
        blobColor: 'bg-red-500',
        blobOpacity: 'opacity-15',
        textColor: 'text-rose-900',
        badges: { liveBg: 'bg-red-600', liveText: 'text-white', liveBorder: 'border-red-700', spotsBg: 'bg-rose-100', spotsText: 'text-rose-800', spotsBorder: 'border-rose-200' },
        decorations: { starColor: 'text-red-500', checkColor: 'text-rose-600', playButtonBg: 'bg-white/90', playButtonIcon: 'text-red-600', playButtonBorder: 'border-white/20' },
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-rose-950', transparentText: 'text-white', transparentBg: 'bg-red-900/50', stickyBorder: 'border-rose-100', logoBg: 'bg-red-700', logoText: 'text-white', linkHover: 'text-red-700', mobileMenuBg: 'bg-white', mobileMenuText: 'text-rose-900', mobileMenuBorder: 'border-rose-100', ctaButton: 'bg-red-700 text-white' },
        hero: { bgGradient: 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-950', titleColor: 'text-white', highlightGradient: 'from-red-500 to-rose-400', subtitleColor: 'text-rose-200', badgeBg: 'bg-red-900/50', badgeText: 'text-red-200', badgeBorder: 'border-red-800', videoCardBg: 'bg-rose-950', videoCardBorder: 'border-rose-900', socialProofText: 'text-rose-300' },
        buttons: { primary: 'bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold', secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20' },
        testimonials: { sectionBg: 'bg-[#4c0519]', sectionBorder: 'border-rose-900', titleColor: 'text-white', subtitleColor: 'text-rose-200', cardBg: 'bg-[#881337]', cardBorder: 'border-rose-800', cardShadow: 'shadow-xl', nameColor: 'text-white', roleColor: 'text-rose-300', textColor: 'text-rose-100', starColor: 'text-red-300' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-rose-950', textColor: 'text-rose-800', highlightColor: 'text-red-700', badgeBg: 'bg-rose-100', badgeText: 'text-rose-900', badgeBorder: 'border-rose-200', floatingCardBg: 'bg-white', floatingCardText: 'text-rose-900', floatingCardBorder: 'border-rose-100', floatingCardIcon: 'text-red-600', bulletIconBg: 'bg-rose-100', bulletIconColor: 'text-rose-700' },
        features: { sectionBg: 'bg-rose-50', cardBg: 'bg-white', cardBorder: 'border-rose-100', cardShadow: 'shadow-lg shadow-rose-200/50', iconContainer: 'bg-rose-100', iconColor: 'text-red-600', titleColor: 'text-rose-950', descColor: 'text-rose-700' },
        steps: { sectionBg: 'bg-rose-950', titleColor: 'text-white', textColor: 'text-rose-200', cardBg: 'bg-[#881337]', cardBorder: 'border-rose-800', cardShadow: 'shadow-lg', numberColor: 'text-white', iconContainer: 'bg-rose-900 border border-rose-800' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-rose-950', cardBg: 'bg-rose-50', cardBorder: 'border-rose-100', questionColor: 'text-rose-900', answerColor: 'text-rose-700', iconBg: 'bg-rose-200', iconColor: 'text-rose-700' },
        instructor: { sectionBg: 'bg-[#2a0a12]', titleColor: 'text-white', textColor: 'text-rose-200', bioColor: 'text-rose-300', badgeBg: 'bg-red-900/50', badgeText: 'text-red-200', badgeBorder: 'border-red-800', statBg: 'bg-rose-900/30', statBorder: 'border-rose-900', statValueColor: 'text-white', statLabelColor: 'text-rose-300' },
        cta: { 
            sectionBg: 'bg-red-700', sectionTitleColor: 'text-white', sectionTextColor: 'text-red-100',
            containerBg: 'bg-white', containerBorder: 'border-red-100', cardTitleColor: 'text-rose-900', cardTextColor: 'text-rose-700',
            subtitleColor: 'text-red-200', inputBg: 'bg-rose-50', inputBorder: 'border-rose-200', inputText: 'text-rose-900', inputPlaceholder: 'placeholder-rose-400', inputIconColor: 'text-red-400', inputRing: 'focus:ring-red-500' 
        },
        footer: { bg: 'bg-[#2a0a12]', borderTop: 'border-rose-900', titleColor: 'text-white', textColor: 'text-rose-400', linkHover: 'text-white', copyrightColor: 'text-rose-600', socialBg: 'bg-rose-900', socialIcon: 'text-white', socialHoverBg: 'bg-red-600', socialHoverIcon: 'text-white' }
      };

    case 'corporate-slate':
      return {
        ...BASE_DS,
        bg: 'bg-slate-50',
        blobColor: 'bg-slate-400',
        blobOpacity: 'opacity-10',
        textColor: 'text-slate-700',
        badges: { liveBg: 'bg-blue-900', liveText: 'text-white', liveBorder: 'border-blue-900', spotsBg: 'bg-slate-200', spotsText: 'text-slate-800', spotsBorder: 'border-slate-300' },
        decorations: { starColor: 'text-slate-600', checkColor: 'text-slate-800', playButtonBg: 'bg-white', playButtonIcon: 'text-slate-900', playButtonBorder: 'border-slate-200' },
        nav: { stickyBg: 'bg-white/95 backdrop-blur', stickyText: 'text-slate-900', transparentText: 'text-white', transparentBg: 'bg-slate-700/30', stickyBorder: 'border-slate-200', logoBg: 'bg-slate-800', logoText: 'text-white', linkHover: 'text-slate-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-slate-900', mobileMenuBorder: 'border-slate-200', ctaButton: 'bg-slate-800 text-white hover:bg-slate-700' },
        hero: { bgGradient: 'bg-gradient-to-b from-slate-900 to-slate-800', titleColor: 'text-white', highlightGradient: 'from-gray-200 to-slate-400', subtitleColor: 'text-slate-300', badgeBg: 'bg-slate-700', badgeText: 'text-slate-200', badgeBorder: 'border-slate-600', videoCardBg: 'bg-slate-800', videoCardBorder: 'border-slate-700', socialProofText: 'text-slate-400' },
        buttons: { primary: 'bg-slate-800 hover:bg-slate-700 text-white shadow-lg shadow-slate-900/20 font-bold', secondary: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100' },
        testimonials: { sectionBg: 'bg-white', sectionBorder: 'border-slate-200', titleColor: 'text-slate-900', subtitleColor: 'text-slate-600', cardBg: 'bg-slate-50', cardBorder: 'border-slate-200', cardShadow: 'shadow-md', nameColor: 'text-slate-900', roleColor: 'text-slate-500', textColor: 'text-slate-700', starColor: 'text-slate-400' },
        intro: { sectionBg: 'bg-slate-50', titleColor: 'text-slate-900', textColor: 'text-slate-600', highlightColor: 'text-slate-800', badgeBg: 'bg-white', badgeText: 'text-slate-800', badgeBorder: 'border-slate-200', floatingCardBg: 'bg-white', floatingCardText: 'text-slate-900', floatingCardBorder: 'border-slate-200', floatingCardIcon: 'text-slate-600', bulletIconBg: 'bg-white', bulletIconColor: 'text-slate-800' },
        features: { sectionBg: 'bg-white', cardBg: 'bg-slate-50', cardBorder: 'border-slate-100', cardShadow: 'shadow-lg shadow-slate-200/30', iconContainer: 'bg-slate-200', iconColor: 'text-slate-700', titleColor: 'text-slate-900', descColor: 'text-slate-600' },
        steps: { sectionBg: 'bg-slate-900', titleColor: 'text-white', textColor: 'text-slate-300', cardBg: 'bg-slate-800', cardBorder: 'border-slate-700', cardShadow: 'shadow-xl', numberColor: 'text-white', iconContainer: 'bg-slate-900 border border-slate-700' },
        faq: { sectionBg: 'bg-slate-50', titleColor: 'text-slate-900', cardBg: 'bg-white', cardBorder: 'border-slate-200', questionColor: 'text-slate-900', answerColor: 'text-slate-600', iconBg: 'bg-slate-200', iconColor: 'text-slate-700' },
        instructor: { sectionBg: 'bg-white', titleColor: 'text-slate-900', textColor: 'text-slate-600', bioColor: 'text-slate-500', badgeBg: 'bg-slate-900', badgeText: 'text-white', badgeBorder: 'border-slate-800', statBg: 'bg-slate-100', statBorder: 'border-slate-200', statValueColor: 'text-slate-900', statLabelColor: 'text-slate-500' },
        cta: { 
            sectionBg: 'bg-slate-800', sectionTitleColor: 'text-white', sectionTextColor: 'text-slate-300',
            containerBg: 'bg-white', containerBorder: 'border-slate-200', cardTitleColor: 'text-slate-900', cardTextColor: 'text-slate-600',
            subtitleColor: 'text-slate-400', inputBg: 'bg-slate-50', inputBorder: 'border-slate-200', inputText: 'text-slate-900', inputPlaceholder: 'placeholder-slate-400', inputIconColor: 'text-slate-400', inputRing: 'focus:ring-slate-500' 
        },
        footer: { bg: 'bg-slate-950', borderTop: 'border-slate-900', titleColor: 'text-white', textColor: 'text-slate-400', linkHover: 'text-white', copyrightColor: 'text-slate-600', socialBg: 'bg-slate-900', socialIcon: 'text-slate-400', socialHoverBg: 'bg-white', socialHoverIcon: 'text-slate-900' }
      };

    case 'gold-prestige':
      return {
        ...BASE_DS,
        bg: 'bg-stone-50',
        blobColor: 'bg-amber-400',
        blobOpacity: 'opacity-15',
        textColor: 'text-stone-700',
        badges: { liveBg: 'bg-amber-500', liveText: 'text-white', liveBorder: 'border-amber-600', spotsBg: 'bg-stone-200', spotsText: 'text-stone-800', spotsBorder: 'border-stone-300' },
        decorations: { starColor: 'text-amber-500', checkColor: 'text-amber-600', playButtonBg: 'bg-white/90', playButtonIcon: 'text-amber-600', playButtonBorder: 'border-white/20' },
        nav: { stickyBg: 'bg-white/95 backdrop-blur', stickyText: 'text-stone-900', transparentText: 'text-white', transparentBg: 'bg-amber-500/20', stickyBorder: 'border-stone-100', logoBg: 'bg-amber-500', logoText: 'text-white', linkHover: 'text-amber-600', mobileMenuBg: 'bg-white', mobileMenuText: 'text-stone-900', mobileMenuBorder: 'border-stone-100', ctaButton: 'bg-amber-500 text-white hover:bg-amber-600' },
        hero: { bgGradient: 'bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950', titleColor: 'text-white', highlightGradient: 'from-amber-300 to-yellow-200', subtitleColor: 'text-amber-100/80', badgeBg: 'bg-amber-500/20', badgeText: 'text-amber-200', badgeBorder: 'border-amber-500/30', videoCardBg: 'bg-stone-900', videoCardBorder: 'border-amber-900/30', socialProofText: 'text-amber-200/70' },
        buttons: { primary: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold shadow-lg shadow-amber-500/20', secondary: 'border border-amber-300 text-amber-700 hover:bg-amber-50' },
        testimonials: { sectionBg: 'bg-[#1c1917]', sectionBorder: 'border-amber-900/20', titleColor: 'text-white', subtitleColor: 'text-stone-400', cardBg: 'bg-[#292524]', cardBorder: 'border-stone-700', cardShadow: 'shadow-xl', nameColor: 'text-amber-400', roleColor: 'text-stone-500', textColor: 'text-stone-300', starColor: 'text-amber-500' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-stone-900', textColor: 'text-stone-600', highlightColor: 'text-amber-600', badgeBg: 'bg-amber-50', badgeText: 'text-amber-800', badgeBorder: 'border-amber-100', floatingCardBg: 'bg-white', floatingCardText: 'text-stone-900', floatingCardBorder: 'border-stone-100', floatingCardIcon: 'text-amber-500', bulletIconBg: 'bg-amber-100', bulletIconColor: 'text-amber-600' },
        features: { sectionBg: 'bg-stone-100', cardBg: 'bg-white', cardBorder: 'border-stone-200', cardShadow: 'shadow-xl shadow-stone-300/30', iconContainer: 'bg-amber-100', iconColor: 'text-amber-600', titleColor: 'text-stone-900', descColor: 'text-stone-600' },
        steps: { sectionBg: 'bg-stone-900', titleColor: 'text-white', textColor: 'text-stone-300', cardBg: 'bg-[#292524]', cardBorder: 'border-stone-700', cardShadow: 'shadow-xl', numberColor: 'text-amber-400', iconContainer: 'bg-stone-900 border border-stone-700' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-stone-900', cardBg: 'bg-stone-50', cardBorder: 'border-stone-100', questionColor: 'text-stone-900', answerColor: 'text-stone-600', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
        instructor: { sectionBg: 'bg-[#292524]', titleColor: 'text-white', textColor: 'text-stone-300', bioColor: 'text-stone-400', badgeBg: 'bg-amber-500', badgeText: 'text-white', badgeBorder: 'border-amber-600', statBg: 'bg-stone-800', statBorder: 'border-stone-700', statValueColor: 'text-white', statLabelColor: 'text-stone-500' },
        cta: { 
            sectionBg: 'bg-amber-500', sectionTitleColor: 'text-white', sectionTextColor: 'text-amber-50',
            containerBg: 'bg-white', containerBorder: 'border-amber-100', cardTitleColor: 'text-stone-900', cardTextColor: 'text-stone-600',
            subtitleColor: 'text-amber-100', inputBg: 'bg-stone-50', inputBorder: 'border-stone-200', inputText: 'text-stone-900', inputPlaceholder: 'placeholder-stone-400', inputIconColor: 'text-stone-400', inputRing: 'focus:ring-amber-400' 
        },
        footer: { bg: 'bg-[#1c1917]', borderTop: 'border-stone-800', titleColor: 'text-white', textColor: 'text-stone-500', linkHover: 'text-amber-400', copyrightColor: 'text-stone-600', socialBg: 'bg-stone-800', socialIcon: 'text-stone-400', socialHoverBg: 'bg-amber-500', socialHoverIcon: 'text-white' }
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
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-black', transparentText: 'text-black', transparentBg: 'bg-gray-100/50', stickyBorder: 'border-black/5', logoBg: 'bg-black', logoText: 'text-white', linkHover: 'text-black font-bold', mobileMenuBg: 'bg-white', mobileMenuText: 'text-black', mobileMenuBorder: 'border-gray-200', ctaButton: 'bg-black text-white hover:bg-gray-800' },
        hero: { bgGradient: 'bg-white', titleColor: 'text-black', highlightGradient: 'from-gray-600 to-black', subtitleColor: 'text-gray-500', badgeBg: 'bg-gray-100', badgeText: 'text-black', badgeBorder: 'border-gray-200', videoCardBg: 'bg-gray-50', videoCardBorder: 'border-gray-200', socialProofText: 'text-gray-500' },
        buttons: { primary: 'bg-black text-white hover:bg-gray-800 shadow-xl', secondary: 'border border-gray-300 text-gray-600 hover:border-black hover:text-black' },
        testimonials: { sectionBg: 'bg-gray-50', sectionBorder: 'border-gray-200', titleColor: 'text-black', subtitleColor: 'text-gray-500', cardBg: 'bg-white', cardBorder: 'border-gray-200', cardShadow: 'shadow-sm', nameColor: 'text-black', roleColor: 'text-gray-400', textColor: 'text-gray-800', starColor: 'text-black' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-black', textColor: 'text-gray-600', highlightColor: 'text-black', badgeBg: 'bg-black', badgeText: 'text-white', badgeBorder: 'border-black', floatingCardBg: 'bg-white', floatingCardText: 'text-black', floatingCardBorder: 'border-black', floatingCardIcon: 'text-black', bulletIconBg: 'bg-gray-100', bulletIconColor: 'text-black' },
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
        nav: { stickyBg: 'bg-stone-50/90 backdrop-blur', stickyText: 'text-stone-800', transparentText: 'text-stone-100', transparentBg: 'bg-green-900/50', stickyBorder: 'border-stone-200', logoBg: 'bg-green-700', logoText: 'text-white', linkHover: 'text-green-700', mobileMenuBg: 'bg-stone-50', mobileMenuText: 'text-stone-800', mobileMenuBorder: 'border-stone-200', ctaButton: 'bg-green-700 text-white' },
        hero: { bgGradient: 'bg-[#1c1917]', titleColor: 'text-stone-100', highlightGradient: 'from-green-400 to-emerald-600', subtitleColor: 'text-stone-400', badgeBg: 'bg-green-900/50', badgeText: 'text-green-400', badgeBorder: 'border-green-800', videoCardBg: 'bg-[#292524]', videoCardBorder: 'border-stone-700', socialProofText: 'text-stone-400' },
        buttons: { primary: 'bg-green-700 hover:bg-green-600 text-white shadow-lg shadow-green-900/20', secondary: 'border border-stone-600 text-stone-300 hover:text-white' },
        testimonials: { sectionBg: 'bg-[#022c22]', sectionBorder: 'border-green-900', titleColor: 'text-white', subtitleColor: 'text-green-200', cardBg: 'bg-[#064e3b]', cardBorder: 'border-green-800', cardShadow: 'shadow-lg', nameColor: 'text-white', roleColor: 'text-green-300', textColor: 'text-green-50', starColor: 'text-green-400' },
        intro: { sectionBg: 'bg-white', titleColor: 'text-stone-800', textColor: 'text-stone-600', highlightColor: 'text-green-700', badgeBg: 'bg-green-100', badgeText: 'text-green-800', badgeBorder: 'border-green-200', floatingCardBg: 'bg-white', floatingCardText: 'text-stone-800', floatingCardBorder: 'border-stone-200', floatingCardIcon: 'text-green-600', bulletIconBg: 'bg-green-100', bulletIconColor: 'text-green-700' },
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
