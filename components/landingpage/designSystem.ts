
import { ColorPalette } from '../../types';

// Definición de la interfaz del Sistema de Diseño para asegurar consistencia
interface DesignSystem {
  // Global
  bg: string;
  blobColor: string;
  selectionColor: string;

  // Navigation
  nav: {
    stickyBg: string;
    stickyText: string;
    stickyBorder: string;
    logoBg: string;
    linkHover: string;
    mobileMenuBg: string;
  };

  // Hero Section
  hero: {
    bgGradient: string; // Puede ser un color sólido o gradiente
    titleColor: string;
    subtitleColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  };

  // Buttons
  buttons: {
    primary: string; // Clases completas (bg, text, shadow, hover)
    secondary: string;
  };

  // Feature Cards (Beneficios)
  features: {
    sectionBg: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    iconContainer: string; // Estilo base del contenedor del icono
    iconColor: string; // Color por defecto si no es específico
    titleColor: string;
    descColor: string;
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
    sectionBg: string; // Para secciones finales
    containerBg: string; // Caja del formulario
    containerBorder: string;
    titleColor: string;
    textColor: string;
    // Input Styles
    inputBg: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;
    inputRing: string; // Focus ring color
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
    textColor: string; // Texto general
    copyrightColor: string;
    socialBg: string;
    socialIcon: string;
  };
}

const BASE_DS: DesignSystem = {
    // Valores por defecto (fallback)
    bg: 'bg-white',
    blobColor: 'bg-blue-500',
    selectionColor: 'selection:bg-blue-500 selection:text-white',
    nav: { stickyBg: 'bg-white', stickyText: 'text-gray-900', stickyBorder: 'border-gray-100', logoBg: 'bg-blue-600 text-white', linkHover: 'text-blue-600', mobileMenuBg: 'bg-white' },
    hero: { bgGradient: 'bg-white', titleColor: 'text-gray-900', subtitleColor: 'text-gray-600', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700', badgeBorder: 'border-blue-200' },
    buttons: { primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg', secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
    features: { sectionBg: 'bg-white', cardBg: 'bg-white', cardBorder: 'border-gray-100', cardShadow: 'shadow-lg', iconContainer: 'bg-blue-100', iconColor: 'text-blue-600', titleColor: 'text-gray-900', descColor: 'text-gray-600' },
    testimonials: { sectionBg: 'bg-gray-50', sectionBorder: 'border-gray-200', titleColor: 'text-gray-900', subtitleColor: 'text-gray-600', cardBg: 'bg-white', cardBorder: 'border-gray-100', cardShadow: 'shadow-md', nameColor: 'text-gray-900', roleColor: 'text-gray-500', textColor: 'text-gray-700', starColor: 'text-yellow-400' },
    instructor: { sectionBg: 'bg-gray-900', titleColor: 'text-white', textColor: 'text-gray-300', badgeBg: 'bg-white/10', badgeText: 'text-white', badgeBorder: 'border-white/20', statBg: 'bg-white/10', statBorder: 'border-white/10', statValueColor: 'text-white', statLabelColor: 'text-gray-400' },
    cta: { sectionBg: 'bg-blue-600', containerBg: 'bg-white', containerBorder: 'border-transparent', titleColor: 'text-gray-900', textColor: 'text-gray-600', inputBg: 'bg-gray-50', inputBorder: 'border-gray-200', inputText: 'text-gray-900', inputPlaceholder: 'placeholder-gray-400', inputRing: 'focus:ring-blue-500' },
    faq: { sectionBg: 'bg-white', titleColor: 'text-gray-900', cardBg: 'bg-gray-50', cardBorder: 'border-transparent', questionColor: 'text-gray-900', answerColor: 'text-gray-600', iconBg: 'bg-gray-200', iconColor: 'text-gray-600' },
    footer: { bg: 'bg-gray-900', borderTop: 'border-gray-800', titleColor: 'text-white', textColor: 'text-gray-400', copyrightColor: 'text-gray-600', socialBg: 'bg-white/10', socialIcon: 'text-white' }
};

export const getDesignSystem = (palette: ColorPalette): DesignSystem => {
  switch (palette) {
    case 'modern-blue': 
      return {
        ...BASE_DS,
        bg: 'bg-slate-50',
        blobColor: 'bg-blue-500',
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-slate-900', stickyBorder: 'border-slate-100', logoBg: 'bg-blue-600 text-white', linkHover: 'text-blue-600', mobileMenuBg: 'bg-white' },
        hero: { bgGradient: 'bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-900', titleColor: 'text-white', subtitleColor: 'text-blue-100', badgeBg: 'bg-blue-500/20', badgeText: 'text-blue-100', badgeBorder: 'border-blue-400/30' },
        buttons: { primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 font-bold', secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20' },
        features: { sectionBg: 'bg-slate-50', cardBg: 'bg-white', cardBorder: 'border-slate-100', cardShadow: 'shadow-xl shadow-slate-200/50', iconContainer: 'bg-blue-100 text-blue-600', iconColor: 'text-blue-600', titleColor: 'text-slate-900', descColor: 'text-slate-600' },
        testimonials: { sectionBg: 'bg-[#0f172a]', sectionBorder: 'border-slate-800', titleColor: 'text-white', subtitleColor: 'text-slate-400', cardBg: 'bg-slate-800', cardBorder: 'border-slate-700', cardShadow: 'shadow-xl', nameColor: 'text-white', roleColor: 'text-blue-400', textColor: 'text-slate-300', starColor: 'text-yellow-400' },
        instructor: { sectionBg: 'bg-[#1e293b]', titleColor: 'text-white', textColor: 'text-slate-300', badgeBg: 'bg-blue-500/20', badgeText: 'text-blue-200', badgeBorder: 'border-blue-500/30', statBg: 'bg-slate-800', statBorder: 'border-slate-700', statValueColor: 'text-white', statLabelColor: 'text-slate-400' },
        cta: { sectionBg: 'bg-blue-600', containerBg: 'bg-white/10 backdrop-blur-md', containerBorder: 'border-white/20', titleColor: 'text-white', textColor: 'text-blue-100', inputBg: 'bg-slate-900/50', inputBorder: 'border-slate-700', inputText: 'text-white', inputPlaceholder: 'placeholder-slate-400', inputRing: 'focus:ring-blue-400' },
        faq: { sectionBg: 'bg-white', titleColor: 'text-slate-900', cardBg: 'bg-slate-50', cardBorder: 'border-slate-100', questionColor: 'text-slate-900', answerColor: 'text-slate-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
        footer: { bg: 'bg-slate-900', borderTop: 'border-slate-800', titleColor: 'text-white', textColor: 'text-slate-400', copyrightColor: 'text-slate-600', socialBg: 'bg-slate-800', socialIcon: 'text-white' }
      };

    case 'elegant-purple': 
      return {
        ...BASE_DS,
        bg: 'bg-[#FDFBFF]',
        blobColor: 'bg-purple-500',
        hero: { bgGradient: 'bg-[#1a0b2e]', titleColor: 'text-white', subtitleColor: 'text-purple-200', badgeBg: 'bg-purple-500/20', badgeText: 'text-purple-200', badgeBorder: 'border-purple-500/30' },
        buttons: { primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-pink-500/30 shadow-lg text-white font-bold', secondary: 'bg-white text-purple-900 hover:bg-gray-50 border border-purple-100' },
        features: { sectionBg: 'bg-white', cardBg: 'bg-white', cardBorder: 'border-purple-50', cardShadow: 'shadow-lg shadow-purple-100/50', iconContainer: 'bg-purple-100 text-purple-600', iconColor: 'text-purple-600', titleColor: 'text-gray-900', descColor: 'text-gray-600' },
        testimonials: { sectionBg: 'bg-[#3b0764]', sectionBorder: 'border-purple-900', titleColor: 'text-white', subtitleColor: 'text-purple-200', cardBg: 'bg-[#2e1065]', cardBorder: 'border-purple-800', cardShadow: 'shadow-xl', nameColor: 'text-white', roleColor: 'text-pink-400', textColor: 'text-purple-100', starColor: 'text-pink-500' },
        instructor: { sectionBg: 'bg-[#4c1d95]', titleColor: 'text-white', textColor: 'text-purple-100', badgeBg: 'bg-white/10', badgeText: 'text-white', badgeBorder: 'border-white/20', statBg: 'bg-white/10', statBorder: 'border-white/10', statValueColor: 'text-white', statLabelColor: 'text-purple-200' },
        cta: { sectionBg: 'bg-purple-900', containerBg: 'bg-white', containerBorder: 'border-purple-100', titleColor: 'text-purple-900', textColor: 'text-gray-600', inputBg: 'bg-purple-50', inputBorder: 'border-purple-100', inputText: 'text-purple-900', inputPlaceholder: 'placeholder-purple-400', inputRing: 'focus:ring-pink-500' },
        faq: { sectionBg: 'bg-purple-50/30', titleColor: 'text-purple-900', cardBg: 'bg-white', cardBorder: 'border-purple-50', questionColor: 'text-purple-900', answerColor: 'text-gray-600', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
        footer: { bg: 'bg-[#1a0b2e]', borderTop: 'border-purple-900', titleColor: 'text-white', textColor: 'text-purple-300', copyrightColor: 'text-purple-500', socialBg: 'bg-purple-900', socialIcon: 'text-white' }
      };

    case 'dark-luxury': 
      return {
        ...BASE_DS,
        bg: 'bg-[#0a0a0a]',
        blobColor: 'bg-yellow-600',
        nav: { stickyBg: 'bg-black/90 backdrop-blur', stickyText: 'text-white', stickyBorder: 'border-white/10', logoBg: 'bg-yellow-500 text-black', linkHover: 'text-yellow-500', mobileMenuBg: 'bg-black border border-white/10' },
        hero: { bgGradient: 'bg-black', titleColor: 'text-white', subtitleColor: 'text-gray-400', badgeBg: 'bg-yellow-500/10', badgeText: 'text-yellow-500', badgeBorder: 'border-yellow-500/30' },
        buttons: { primary: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/20', secondary: 'border border-yellow-900/50 text-yellow-500 hover:bg-yellow-900/10' },
        features: { sectionBg: 'bg-[#0a0a0a]', cardBg: 'bg-[#111]', cardBorder: 'border-[#222]', cardShadow: 'shadow-2xl shadow-black', iconContainer: 'bg-yellow-900/20 text-yellow-500', iconColor: 'text-yellow-500', titleColor: 'text-white', descColor: 'text-gray-400' },
        testimonials: { sectionBg: 'bg-black', sectionBorder: 'border-white/5', titleColor: 'text-white', subtitleColor: 'text-gray-500', cardBg: 'bg-[#161616]', cardBorder: 'border-white/5', cardShadow: 'shadow-none', nameColor: 'text-yellow-500', roleColor: 'text-gray-500', textColor: 'text-gray-300', starColor: 'text-yellow-600' },
        instructor: { sectionBg: 'bg-[#111]', titleColor: 'text-white', textColor: 'text-gray-400', badgeBg: 'bg-yellow-500/10', badgeText: 'text-yellow-500', badgeBorder: 'border-yellow-500/20', statBg: 'bg-black', statBorder: 'border-white/5', statValueColor: 'text-white', statLabelColor: 'text-gray-500' },
        cta: { sectionBg: 'bg-black', containerBg: 'bg-[#111]', containerBorder: 'border-white/10', titleColor: 'text-white', textColor: 'text-gray-400', inputBg: 'bg-black', inputBorder: 'border-white/10', inputText: 'text-white', inputPlaceholder: 'placeholder-gray-600', inputRing: 'focus:ring-yellow-500' },
        faq: { sectionBg: 'bg-[#0a0a0a]', titleColor: 'text-white', cardBg: 'bg-[#111]', cardBorder: 'border-white/5', questionColor: 'text-white', answerColor: 'text-gray-400', iconBg: 'bg-yellow-900/20', iconColor: 'text-yellow-500' },
        footer: { bg: 'bg-black', borderTop: 'border-white/10', titleColor: 'text-white', textColor: 'text-gray-500', copyrightColor: 'text-gray-700', socialBg: 'bg-[#111]', socialIcon: 'text-gray-400' }
      };

    case 'energetic-orange':
      return {
        ...BASE_DS,
        bg: 'bg-white',
        blobColor: 'bg-orange-200',
        hero: { bgGradient: 'bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]', titleColor: 'text-gray-900', subtitleColor: 'text-orange-900/80', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700', badgeBorder: 'border-orange-200' },
        buttons: { primary: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30', secondary: 'bg-white border border-orange-200 text-orange-800 hover:bg-orange-50' },
        features: { sectionBg: 'bg-white', cardBg: 'bg-white', cardBorder: 'border-orange-100', cardShadow: 'shadow-xl shadow-orange-900/5', iconContainer: 'bg-orange-50 text-orange-600', iconColor: 'text-orange-600', titleColor: 'text-gray-900', descColor: 'text-gray-600' },
        testimonials: { sectionBg: 'bg-[#fff7ed]', sectionBorder: 'border-orange-100', titleColor: 'text-gray-900', subtitleColor: 'text-orange-800/60', cardBg: 'bg-white', cardBorder: 'border-orange-50', cardShadow: 'shadow-md', nameColor: 'text-orange-900', roleColor: 'text-gray-500', textColor: 'text-gray-700', starColor: 'text-amber-500' },
        instructor: { sectionBg: 'bg-[#1c1917]', titleColor: 'text-white', textColor: 'text-stone-300', badgeBg: 'bg-orange-600', badgeText: 'text-white', badgeBorder: 'border-orange-500', statBg: 'bg-white/10', statBorder: 'border-white/10', statValueColor: 'text-white', statLabelColor: 'text-stone-400' },
        cta: { sectionBg: 'bg-orange-500', containerBg: 'bg-white', containerBorder: 'border-orange-100', titleColor: 'text-gray-900', textColor: 'text-gray-600', inputBg: 'bg-gray-50', inputBorder: 'border-gray-200', inputText: 'text-gray-900', inputPlaceholder: 'placeholder-gray-400', inputRing: 'focus:ring-orange-500' },
        faq: { sectionBg: 'bg-[#fff7ed]', titleColor: 'text-gray-900', cardBg: 'bg-white', cardBorder: 'border-orange-100', questionColor: 'text-gray-900', answerColor: 'text-gray-600', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
        footer: { bg: 'bg-[#1c1917]', borderTop: 'border-stone-800', titleColor: 'text-white', textColor: 'text-stone-400', copyrightColor: 'text-stone-600', socialBg: 'bg-stone-800', socialIcon: 'text-white' }
      };

    case 'minimal-mono':
      return {
        ...BASE_DS,
        bg: 'bg-white',
        blobColor: 'bg-gray-300',
        selectionColor: 'selection:bg-black selection:text-white',
        nav: { stickyBg: 'bg-white/90 backdrop-blur', stickyText: 'text-black', stickyBorder: 'border-black/5', logoBg: 'bg-black text-white', linkHover: 'text-black font-bold', mobileMenuBg: 'bg-white border border-gray-200' },
        hero: { bgGradient: 'bg-white', titleColor: 'text-black', subtitleColor: 'text-gray-500', badgeBg: 'bg-gray-100', badgeText: 'text-black', badgeBorder: 'border-gray-200' },
        buttons: { primary: 'bg-black text-white hover:bg-gray-800 shadow-xl', secondary: 'border border-gray-300 text-gray-600 hover:border-black hover:text-black' },
        features: { sectionBg: 'bg-white', cardBg: 'bg-white', cardBorder: 'border-gray-200', cardShadow: 'shadow-sm hover:shadow-md', iconContainer: 'bg-gray-100 text-black', iconColor: 'text-black', titleColor: 'text-black', descColor: 'text-gray-600' },
        testimonials: { sectionBg: 'bg-gray-50', sectionBorder: 'border-gray-200', titleColor: 'text-black', subtitleColor: 'text-gray-500', cardBg: 'bg-white', cardBorder: 'border-gray-200', cardShadow: 'shadow-sm', nameColor: 'text-black', roleColor: 'text-gray-400', textColor: 'text-gray-800', starColor: 'text-black' },
        instructor: { sectionBg: 'bg-white', titleColor: 'text-black', textColor: 'text-gray-600', badgeBg: 'bg-black', badgeText: 'text-white', badgeBorder: 'border-black', statBg: 'bg-gray-50', statBorder: 'border-gray-200', statValueColor: 'text-black', statLabelColor: 'text-gray-500' },
        cta: { sectionBg: 'bg-white', containerBg: 'bg-white', containerBorder: 'border-gray-200 shadow-xl', titleColor: 'text-black', textColor: 'text-gray-500', inputBg: 'bg-gray-50', inputBorder: 'border-gray-200', inputText: 'text-black', inputPlaceholder: 'placeholder-gray-400', inputRing: 'focus:ring-black' },
        faq: { sectionBg: 'bg-gray-50', titleColor: 'text-black', cardBg: 'bg-white', cardBorder: 'border-gray-200', questionColor: 'text-black', answerColor: 'text-gray-600', iconBg: 'bg-gray-200', iconColor: 'text-black' },
        footer: { bg: 'bg-white', borderTop: 'border-gray-200', titleColor: 'text-black', textColor: 'text-gray-500', copyrightColor: 'text-gray-400', socialBg: 'bg-gray-100', socialIcon: 'text-black' }
      };

    case 'nature-green':
      return {
        ...BASE_DS,
        bg: 'bg-stone-50',
        blobColor: 'bg-green-500',
        hero: { bgGradient: 'bg-[#1c1917]', titleColor: 'text-stone-100', subtitleColor: 'text-stone-400', badgeBg: 'bg-green-900/50', badgeText: 'text-green-400', badgeBorder: 'border-green-800' },
        buttons: { primary: 'bg-green-700 hover:bg-green-600 text-white shadow-lg shadow-green-900/20', secondary: 'border border-stone-600 text-stone-300 hover:text-white' },
        features: { sectionBg: 'bg-stone-50', cardBg: 'bg-[#fafaf9]', cardBorder: 'border-stone-200', cardShadow: 'shadow-sm', iconContainer: 'bg-green-100 text-green-700', iconColor: 'text-green-700', titleColor: 'text-stone-800', descColor: 'text-stone-600' },
        testimonials: { sectionBg: 'bg-[#022c22]', sectionBorder: 'border-green-900', titleColor: 'text-white', subtitleColor: 'text-green-200', cardBg: 'bg-[#064e3b]', cardBorder: 'border-green-800', cardShadow: 'shadow-lg', nameColor: 'text-white', roleColor: 'text-green-300', textColor: 'text-green-50', starColor: 'text-green-400' },
        instructor: { sectionBg: 'bg-[#052e16]', titleColor: 'text-white', textColor: 'text-green-100', badgeBg: 'bg-green-800', badgeText: 'text-white', badgeBorder: 'border-green-700', statBg: 'bg-green-900/50', statBorder: 'border-green-800', statValueColor: 'text-white', statLabelColor: 'text-green-300' },
        cta: { sectionBg: 'bg-stone-100', containerBg: 'bg-white', containerBorder: 'border-stone-200', titleColor: 'text-stone-800', textColor: 'text-stone-500', inputBg: 'bg-stone-50', inputBorder: 'border-stone-200', inputText: 'text-stone-900', inputPlaceholder: 'placeholder-stone-400', inputRing: 'focus:ring-green-600' },
        faq: { sectionBg: 'bg-stone-100', titleColor: 'text-stone-800', cardBg: 'bg-white', cardBorder: 'border-stone-200', questionColor: 'text-stone-900', answerColor: 'text-stone-600', iconBg: 'bg-green-100', iconColor: 'text-green-700' },
        footer: { bg: 'bg-[#1c1917]', borderTop: 'border-stone-800', titleColor: 'text-white', textColor: 'text-stone-400', copyrightColor: 'text-stone-600', socialBg: 'bg-stone-800', socialIcon: 'text-stone-400' }
      };

    default:
        // Fallback a Modern Blue si no coincide
        return getDesignSystem('modern-blue');
  }
};
