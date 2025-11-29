

import React, { useEffect, useState } from 'react';
import { GeneratedPageContent, ColorPalette, StructureType } from '../types';
import { CheckCircle, Star, PlayCircle, User, MessageCircle, ArrowRight, Lock, ShieldCheck, Zap, BarChart, Facebook, Instagram, Twitter, Mail, Anchor, Sparkles, Award, Users, DollarSign, FileText, Briefcase, BookOpen, ScanFace, Palette, Feather, Plus, Minus, HelpCircle, X, Rocket, Target, Globe } from 'lucide-react';

interface LivePageProps {
  content: GeneratedPageContent;
}

// Icon Mapping
const iconMap: any = {
    DollarSign, FileText, Briefcase, Award, Sparkles, Users, Zap, BookOpen, ScanFace, Palette, Feather, Rocket, Target, Globe, MessageCircle
};

const getIcon = (name: string | undefined, defaultIcon: any) => {
    if (!name) return defaultIcon;
    const Icon = iconMap[name];
    return Icon ? <Icon className="w-full h-full" /> : defaultIcon;
};

// Advanced Design System for Palettes
const getDesignSystem = (palette: ColorPalette) => {
  switch (palette) {
    case 'modern-blue': 
      return {
        bg: 'bg-slate-50',
        heroGradient: 'bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-900',
        heroText: 'text-white',
        accentText: 'text-blue-400',
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 text-white',
        secondaryBtn: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
        cardBg: 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50',
        iconBg: 'bg-blue-100 text-blue-600',
        blobColor: 'bg-blue-500',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-blue-900/10 border-b border-gray-100',
        navStickyText: 'text-blue-900',
        logoBg: 'bg-blue-600 text-white',
        introBg: 'bg-[#0B1120]', 
        testimonialBg: 'bg-[#0f172a]', 
        mentorBg: 'bg-[#172554]', 
        iconGradient: 'from-blue-500 to-blue-700',
        stepsBg: 'bg-blue-50/50',
        stepGradient: 'from-blue-500 to-blue-700',
        faqBg: 'bg-white',
        faqItemBg: 'bg-slate-50'
      };
    case 'elegant-purple': 
      return {
        bg: 'bg-[#FDFBFF]',
        heroGradient: 'bg-[#1a0b2e]',
        heroText: 'text-white',
        accentText: 'text-purple-400',
        primaryBtn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-pink-500/30 shadow-lg text-white',
        secondaryBtn: 'bg-white text-purple-900 hover:bg-gray-100',
        cardBg: 'bg-white border border-purple-50 shadow-lg shadow-purple-100/50',
        iconBg: 'bg-purple-100 text-purple-600',
        blobColor: 'bg-purple-500',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-purple-900/10 border-b border-purple-50',
        navStickyText: 'text-purple-900',
        logoBg: 'bg-purple-600 text-white',
        introBg: 'bg-[#2e1065]', 
        testimonialBg: 'bg-[#3b0764]', 
        mentorBg: 'bg-[#4c1d95]', 
        iconGradient: 'from-fuchsia-500 to-fuchsia-700',
        stepsBg: 'bg-purple-50',
        stepGradient: 'from-purple-500 to-pink-500',
        faqBg: 'bg-purple-50/30',
        faqItemBg: 'bg-white'
      };
    case 'energetic-orange': 
      return {
        bg: 'bg-white',
        heroGradient: 'bg-gradient-to-br from-orange-500 to-red-600',
        heroText: 'text-white',
        accentText: 'text-yellow-200',
        primaryBtn: 'bg-white text-orange-600 hover:bg-gray-100 shadow-lg',
        secondaryBtn: 'bg-orange-700/50 text-white border border-orange-400/30',
        cardBg: 'bg-white border border-orange-100 shadow-xl shadow-orange-100',
        iconBg: 'bg-orange-100 text-orange-600',
        blobColor: 'bg-yellow-400',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-orange-900/10 border-b border-orange-50',
        navStickyText: 'text-orange-800',
        logoBg: 'bg-orange-500 text-white',
        introBg: 'bg-[#431407]', 
        testimonialBg: 'bg-[#7c2d12]', 
        mentorBg: 'bg-[#2c1005]',
        iconGradient: 'from-orange-500 to-red-600',
        stepsBg: 'bg-orange-50',
        stepGradient: 'from-orange-500 to-red-500',
        faqBg: 'bg-orange-50/50',
        faqItemBg: 'bg-white'
      };
    case 'nature-green': 
      return {
        bg: 'bg-stone-50',
        heroGradient: 'bg-[#1c1917]',
        heroText: 'text-stone-100',
        accentText: 'text-green-400',
        primaryBtn: 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20',
        secondaryBtn: 'border border-stone-600 text-stone-300 hover:text-white',
        cardBg: 'bg-[#fafaf9] border border-stone-200 shadow-sm',
        iconBg: 'bg-green-100 text-green-700',
        blobColor: 'bg-green-500',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-green-900/10 border-b border-stone-100',
        navStickyText: 'text-stone-800',
        logoBg: 'bg-green-600 text-white',
        introBg: 'bg-[#064e3b]', 
        testimonialBg: 'bg-[#022c22]',
        mentorBg: 'bg-[#052e16]',
        iconGradient: 'from-green-500 to-emerald-700',
        stepsBg: 'bg-stone-100',
        stepGradient: 'from-green-500 to-emerald-600',
        faqBg: 'bg-stone-100',
        faqItemBg: 'bg-white'
      };
    case 'dark-luxury': 
      return {
        bg: 'bg-[#0a0a0a]',
        heroGradient: 'bg-black',
        heroText: 'text-white',
        accentText: 'text-yellow-500',
        primaryBtn: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/20',
        secondaryBtn: 'border border-yellow-900/50 text-yellow-500 hover:bg-yellow-900/10',
        cardBg: 'bg-[#111] border border-[#222] shadow-2xl',
        iconBg: 'bg-yellow-900/20 text-yellow-500',
        blobColor: 'bg-yellow-600',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-black/20 border-b border-gray-200',
        navStickyText: 'text-black',
        logoBg: 'bg-yellow-500 text-black',
        introBg: 'bg-[#111111]',
        testimonialBg: 'bg-black',
        mentorBg: 'bg-[#1c1917]',
        iconGradient: 'from-yellow-600 to-yellow-800',
        stepsBg: 'bg-[#111]',
        stepGradient: 'from-yellow-600 to-amber-700',
        faqBg: 'bg-[#0a0a0a]',
        faqItemBg: 'bg-[#111]'
      };
    case 'ocean-teal': 
      return {
        bg: 'bg-cyan-50/30',
        heroGradient: 'bg-gradient-to-br from-cyan-900 to-teal-900',
        heroText: 'text-white',
        accentText: 'text-cyan-300',
        primaryBtn: 'bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-bold shadow-lg shadow-cyan-400/20',
        secondaryBtn: 'border border-cyan-700 text-cyan-100',
        cardBg: 'bg-white border border-cyan-100 shadow-lg shadow-cyan-100',
        iconBg: 'bg-cyan-100 text-cyan-600',
        blobColor: 'bg-cyan-400',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-cyan-900/10 border-b border-cyan-50',
        navStickyText: 'text-cyan-900',
        logoBg: 'bg-cyan-400 text-cyan-950',
        introBg: 'bg-[#0e7490]', 
        testimonialBg: 'bg-[#164e63]',
        mentorBg: 'bg-[#083344]',
        iconGradient: 'from-cyan-500 to-teal-600',
        stepsBg: 'bg-cyan-50',
        stepGradient: 'from-cyan-400 to-teal-500',
        faqBg: 'bg-cyan-50/50',
        faqItemBg: 'bg-white'
      };
    case 'crimson-red': 
      return {
        bg: 'bg-white',
        heroGradient: 'bg-[#881337]',
        heroText: 'text-white',
        accentText: 'text-rose-200',
        primaryBtn: 'bg-white text-[#881337] font-bold hover:bg-rose-50 shadow-xl',
        secondaryBtn: 'bg-rose-900 border border-rose-700 text-rose-200',
        cardBg: 'bg-white border border-rose-100 shadow-xl shadow-rose-100',
        iconBg: 'bg-rose-100 text-rose-700',
        blobColor: 'bg-rose-500',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-rose-900/10 border-b border-rose-50',
        navStickyText: 'text-rose-900',
        logoBg: 'bg-rose-600 text-white',
        introBg: 'bg-[#881337]',
        testimonialBg: 'bg-[#4c0519]',
        mentorBg: 'bg-[#9f1239]',
        iconGradient: 'from-red-600 to-rose-700',
        stepsBg: 'bg-rose-50',
        stepGradient: 'from-red-500 to-rose-600',
        faqBg: 'bg-rose-50/30',
        faqItemBg: 'bg-white'
      };
    case 'corporate-slate': 
      return {
        bg: 'bg-slate-50',
        heroGradient: 'bg-slate-800',
        heroText: 'text-white',
        accentText: 'text-slate-300',
        primaryBtn: 'bg-slate-700 hover:bg-slate-600 text-white shadow-lg',
        secondaryBtn: 'bg-transparent border border-white/20 text-white',
        cardBg: 'bg-white border border-slate-200 shadow-md',
        iconBg: 'bg-slate-100 text-slate-700',
        blobColor: 'bg-slate-400',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-slate-900/10 border-b border-slate-100',
        navStickyText: 'text-slate-800',
        logoBg: 'bg-slate-700 text-white',
        introBg: 'bg-[#334155]',
        testimonialBg: 'bg-[#020617]',
        mentorBg: 'bg-[#1e293b]',
        iconGradient: 'from-slate-600 to-slate-800',
        stepsBg: 'bg-slate-100',
        stepGradient: 'from-slate-600 to-slate-800',
        faqBg: 'bg-slate-100',
        faqItemBg: 'bg-white'
      };
    case 'gold-prestige': 
      return {
        bg: 'bg-[#fffcf5]',
        heroGradient: 'bg-gradient-to-r from-yellow-700 to-yellow-600',
        heroText: 'text-white',
        accentText: 'text-yellow-200',
        primaryBtn: 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg',
        secondaryBtn: 'bg-transparent border border-white/20 text-white',
        cardBg: 'bg-white border border-yellow-100 shadow-lg',
        iconBg: 'bg-yellow-50 text-yellow-600',
        blobColor: 'bg-yellow-500',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-yellow-900/10 border-b border-yellow-50',
        navStickyText: 'text-yellow-900',
        logoBg: 'bg-yellow-600 text-white',
        introBg: 'bg-[#422006]',
        testimonialBg: 'bg-[#1c1917]',
        mentorBg: 'bg-[#451a03]',
        iconGradient: 'from-yellow-600 to-amber-700',
        stepsBg: 'bg-yellow-50',
        stepGradient: 'from-yellow-500 to-amber-600',
        faqBg: 'bg-orange-50/20',
        faqItemBg: 'bg-white'
      };
    case 'minimal-mono': 
      return {
        bg: 'bg-white',
        heroGradient: 'bg-white',
        heroText: 'text-black',
        accentText: 'text-gray-500',
        primaryBtn: 'bg-black text-white hover:bg-gray-800 shadow-lg',
        secondaryBtn: 'border border-gray-300 text-gray-600 hover:border-black hover:text-black',
        cardBg: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
        iconBg: 'bg-gray-100 text-black',
        blobColor: 'bg-gray-300',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-black/10 border-b border-gray-100',
        navStickyText: 'text-black',
        logoBg: 'bg-black text-white',
        introBg: 'bg-black',
        testimonialBg: 'bg-black',
        mentorBg: 'bg-black',
        iconGradient: 'from-gray-700 to-black',
        stepsBg: 'bg-gray-50',
        stepGradient: 'from-gray-800 to-black',
        faqBg: 'bg-gray-50',
        faqItemBg: 'bg-white'
      };
    default: 
       return {
        bg: 'bg-slate-50',
        heroGradient: 'bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-900',
        heroText: 'text-white',
        accentText: 'text-blue-400',
        primaryBtn: 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 text-white',
        secondaryBtn: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
        cardBg: 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50',
        iconBg: 'bg-blue-100 text-blue-600',
        blobColor: 'bg-blue-500',
        navStickyBg: 'bg-white/95 backdrop-blur-md shadow-xl shadow-blue-900/10 border-b border-gray-100',
        navStickyText: 'text-blue-900',
        logoBg: 'bg-blue-600 text-white',
        introBg: 'bg-[#0B1120]',
        testimonialBg: 'bg-[#0f172a]',
        mentorBg: 'bg-[#1e293b]',
        iconGradient: 'from-blue-500 to-blue-700',
        stepsBg: 'bg-blue-50/50',
        stepGradient: 'from-blue-500 to-blue-700',
        faqBg: 'bg-white',
        faqItemBg: 'bg-slate-50'
      };
  }
};

export const LivePage: React.FC<LivePageProps> = ({ content }) => {
  const ds = getDesignSystem(content.palette);
  const structure: StructureType = content.structure || 'classic-sales'; 
  const dest = content.destination;
  const isDark = content.palette === 'dark-luxury';
  const [showModal, setShowModal] = useState(false);

  // Helper to render headline with specific gradient styling from <b> tags
  const renderStyledHeadline = (text: string) => {
    // Replace <b> content </b> with the span gradient class
    const htmlContent = text.replace(
      /<b>(.*?)<\/b>/g, 
      '<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-600">$1</span>'
    );
    
    return (
      <h1 
        id="titulo-principal"
        className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.15] max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  // Helper for rendering rich text descriptions
  const renderRichText = (text: string, className: string = "") => {
      // Replace newlines with <br>
      const formattedText = text ? text.replace(/\n/g, '<br />') : '';
      return (
        <div 
            className={className} 
            dangerouslySetInnerHTML={{ __html: formattedText }} 
        />
      );
  };

  // Reusable Form Logic (Extracted)
  const LeadCaptureForm = ({ btnClass, btnText }: { btnClass: string, btnText: string }) => (
    <div className="space-y-4 relative z-10">
        <div className="relative">
            <User className="absolute top-3.5 left-3 w-5 h-5 text-gray-300" />
            <input placeholder="Tu Nombre Completo" className="w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-lg bg-white/10 text-white focus:bg-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 outline-none transition placeholder-gray-400" />
        </div>
        <div className="relative">
            <MessageCircle className="absolute top-3.5 left-3 w-5 h-5 text-gray-300" />
            <input placeholder="Tu Correo Principal" className="w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-lg bg-white/10 text-white focus:bg-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 outline-none transition placeholder-gray-400" />
        </div>
        <button className={`w-full py-4 rounded-lg font-bold text-lg transition transform hover:scale-[1.02] active:scale-[0.98] ${btnClass}`}>
            {btnText}
        </button>
    </div>
  );

  // --- SUB-COMPONENTS ---

  // 1. Background Pattern
  const BackgroundPattern = () => {
      if (content.palette === 'minimal-mono') {
          return <div id="fondo-patron" className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-70"></div>;
      }
      return null;
  };

  // 2. Smart CTA (Button or Form)
  const SmartCTA = ({ fullWidth = false, centered = false }: { fullWidth?: boolean, centered?: boolean }) => {
      const handleClick = () => {
          if (dest.type === 'whatsapp') {
              const msg = encodeURIComponent(dest.whatsappMessage || 'Hola');
              window.open(`https://wa.me/${dest.whatsappPhone}?text=${msg}`, '_blank');
          } else if (dest.type === 'external_url') {
              window.open(dest.url, '_blank');
          }
      };

      if (dest.type === 'form') {
          return (
            <div id="contenedor-formulario-cta" className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700/50 relative ${centered ? 'mx-auto max-w-md' : 'w-full'}`}>
                
                {/* Badge de Cupos - Positioned half on border (-top-3.5) */}
                <div className="absolute -top-3.5 right-6 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20 border border-red-500/50">
                    {content.hero.spotsLeft || "¡Cupos Limitados!"}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 text-center">Reserva tu lugar GRATIS</h3>
                <p className="text-gray-400 text-center mb-6 text-sm">Accede al método exclusivo.</p>
                
                <LeadCaptureForm btnClass={ds.primaryBtn} btnText={content.hero.ctaText} />
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 text-center mb-6">
                    <Lock className="w-3 h-3 flex-shrink-0" /> Tus datos están 100% seguros. No hacemos spam.
                </div>

                {/* Social Proof Section */}
                <div className="pt-6 border-t border-gray-700/50 flex items-center justify-between">
                    <div className="flex -space-x-3">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-[#1e293b]" />
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-[#1e293b]" />
                        <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-[#1e293b]" />
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-white font-bold text-lg">
                             <CheckCircle className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {content.hero.socialProofCount || "2,458+"}
                        </div>
                        <p className="text-xs text-gray-400">Alumnos registrados</p>
                    </div>
                </div>
            </div>
          );
      }

      return (
          <div id="contenedor-boton-cta" className={`${centered ? 'text-center' : ''}`}>
              <button 
                id="boton-accion-principal"
                onClick={handleClick}
                className={`
                    group relative overflow-hidden
                    ${fullWidth ? 'w-full' : 'w-auto px-10'} 
                    py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1
                    ${ds.primaryBtn}
                `}
              >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {dest.type === 'whatsapp' && <MessageCircle className="w-5 h-5" />}
                    {content.hero.ctaText}
                    {dest.type === 'external_url' && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
              </button>
              <p className={`mt-4 text-sm opacity-70 ${content.palette === 'minimal-mono' ? 'text-gray-500' : ds.heroText}`}>
                  <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Garantía de satisfacción
                  </span>
              </p>
          </div>
      );
  };

  // 3. Feature Card
  const FeatureCard: React.FC<{ item: { title: string; description: string; icon?: string; color?: string }, idx: number }> = ({ item, idx }) => {
    
    // Dynamic Gradient based on selection or default
    let gradientClass = "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/50";
    if (item.color === 'purple') gradientClass = "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50";
    if (item.color === 'green') gradientClass = "bg-gradient-to-br from-emerald-400 to-green-600 shadow-emerald-500/50";
    if (item.color === 'orange') gradientClass = "bg-gradient-to-br from-amber-400 to-orange-600 shadow-orange-500/50";
    if (item.color === 'red') gradientClass = "bg-gradient-to-br from-red-500 to-rose-600 shadow-rose-500/50";
    if (item.color === 'teal') gradientClass = "bg-gradient-to-br from-teal-400 to-cyan-600 shadow-cyan-500/50";
    if (item.color === 'yellow') gradientClass = "bg-gradient-to-br from-yellow-400 to-amber-600 shadow-amber-500/50";

    // Default Cycle if no color specified
    if (!item.color && content.palette !== 'minimal-mono') {
        const defaults = [
            "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/50",
            "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50",
            "bg-gradient-to-br from-amber-400 to-orange-600 shadow-orange-500/50",
            "bg-gradient-to-br from-emerald-400 to-green-600 shadow-emerald-500/50"
        ];
        gradientClass = defaults[idx % defaults.length];
    }

    const iconClass = content.palette === 'minimal-mono' 
        ? "bg-gray-900 text-white shadow-xl" 
        : `${gradientClass} shadow-2xl`;

    // Dynamic Icon
    const IconComponent = getIcon(item.icon, idx === 0 ? <DollarSign className="w-10 h-10 text-white" /> : 
        idx === 1 ? <FileText className="w-10 h-10 text-white" /> : 
        idx === 2 ? <Briefcase className="w-10 h-10 text-white" /> :
        <Award className="w-10 h-10 text-white" />
    );

    return (
        <div 
            id={`tarjeta-beneficio-${idx}`}
            className={`
                p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-start
                ${ds.cardBg}
            `}
        >
            <div className={`${iconClass} w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 p-4`}>
                <div className="text-white w-full h-full">
                    {IconComponent}
                </div>
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
            {renderRichText(item.description, `leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`)}
        </div>
    );
  };

  // 4. Navbar with Modal Trigger
  const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const baseTextColorClass = content.palette === 'minimal-mono' ? 'text-black' : 'text-white';
    // Use the specific sticky text color from design system
    const stickyTextColorClass = ds.navStickyText || 'text-gray-900'; 

    const currentTextColor = isScrolled ? stickyTextColorClass : baseTextColorClass;

    // Default Links if none provided
    const navLinks = content.navLinks || [
        { label: 'Descubre', href: '#seccion-introduccion' },
        { label: 'Beneficios', href: '#seccion-beneficios' },
        { label: 'Experto', href: '#seccion-instructor' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('preview-viewport');
            const scrollY = container ? container.scrollTop : window.scrollY;
            setIsScrolled(scrollY > 20);
        };

        const container = document.getElementById('preview-viewport');
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        window.addEventListener('scroll', handleScroll);

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Helper to render Brand Name with styled gradient for <b> tags
    const renderBrandName = (text: string) => {
         const htmlContent = text.replace(
           /<b>(.*?)<\/b>/g, 
           `<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500 font-extrabold">$1</span>`
         );
         return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    return (
      <nav 
        id="barra-navegacion"
        className={`
            w-full z-50 transition-all duration-300
            ${isScrolled ? `${ds.navStickyBg} fixed top-0 left-0` : 'absolute top-0 left-0 bg-transparent border-b border-white/5 backdrop-blur-sm'}
        `}
      >
          <div className="w-full max-w-[75em] mx-auto px-6 py-4 flex justify-between items-center">
            <div id="logo-marca" className={`flex items-center gap-3 font-bold text-2xl tracking-tight transition-colors duration-300 ${currentTextColor}`}>
              {/* Logo en Círculo Destacado */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-2 border-white/20 ${ds.logoBg}`}>
                 {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-6 h-6" />) : (
                    content.logoSvg ? (
                        <div 
                          className="w-7 h-7" 
                          dangerouslySetInnerHTML={{ __html: content.logoSvg }} 
                        />
                     ) : <Anchor className="w-6 h-6 text-current" /> 
                 )}
              </div>
              
              {renderBrandName(content.brandName || "Brand")}
            </div>
            
            <div id="enlaces-navegacion" className={`hidden md:flex gap-8 text-sm font-medium transition-colors duration-300 ${currentTextColor} opacity-90`}>
              {navLinks.map((link, i) => (
                  <a key={i} href={link.href} className="hover:opacity-100 transition">{link.label}</a>
              ))}
            </div>
            
            <button 
              id="cta-navbar" 
              onClick={() => setShowModal(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition shadow-sm ${ds.primaryBtn} ${content.palette === 'minimal-mono' && !isScrolled ? '' : 'bg-white text-black hover:bg-gray-100 border-none'}`}
            >
              {content.navCta || "Regístrate Gratis"}
            </button>
          </div>
      </nav>
    );
  };

  // 5. Footer
  const Footer = () => {
    const { socials } = content.footer;
    return (
        <footer id="pie-de-pagina" className={`${isDark ? 'bg-black border-t border-gray-900' : 'bg-gray-900 text-white border-t border-gray-800'} py-16`}>
            <div className="w-full max-w-[75em] mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2">
                    <div id="footer-logo" className="flex items-center gap-2 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/10 ${ds.logoBg}`}>
                             {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5"/>) : (
                                content.logoSvg ? <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-5 h-5"/>
                             )}
                        </div>
                        <h4 className="text-2xl font-bold" dangerouslySetInnerHTML={{__html: content.brandName || "GeneratorLanding"}}></h4>
                    </div>
                    <p className="text-gray-400 max-w-xs leading-relaxed">{content.footer.copyright}</p>
                    <div id="redes-sociales" className="flex gap-4 mt-6">
                        {socials?.facebook && <a href={socials.facebook} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"><Facebook className="w-5 h-5" /></a>}
                        {socials?.instagram && <a href={socials.instagram} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"><Instagram className="w-5 h-5" /></a>}
                        {socials?.twitter && <a href={socials.twitter} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"><Twitter className="w-5 h-5" /></a>}
                    </div>
                    </div>
                    <div>
                        <h5 className="font-bold mb-4 text-lg">Enlaces</h5>
                        <ul className="space-y-3 text-gray-400">
                            {content.navLinks ? content.navLinks.map((link, i) => (
                                <li key={i}><a href={link.href} className="hover:text-white transition">{link.label}</a></li>
                            )) : (
                                <>
                                    <li><a href="#seccion-introduccion" className="hover:text-white transition">Qué es</a></li>
                                    <li><a href="#seccion-beneficios" className="hover:text-white transition">Beneficios</a></li>
                                    <li><a href="#seccion-instructor" className="hover:text-white transition">Instructor</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-4 text-lg">Contacto</h5>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-2"><Mail className="w-4 h-4"/> {content.footer.contact || 'info@empresa.com'}</li>
                            <li><a href="#" className="hover:text-white transition">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition">Términos de Uso</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
  }

  // 6. FAQ Section
  const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const questions = content.faq || [
      { question: "¿Necesito experiencia previa?", answer: "No, este curso está diseñado para principiantes y expertos." },
      { question: "¿Cómo accedo al contenido?", answer: "Inmediatamente después de tu inscripción recibirás un correo con tus credenciales." }
    ];

    return (
        <section id="seccion-faq" className={`py-24 ${ds.faqBg}`}>
            <div className="w-full max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Preguntas Frecuentes
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Resolvemos tus dudas para que tomes la mejor decisión.
                    </p>
                </div>

                <div className="space-y-4">
                    {questions.map((q, idx) => (
                        <div 
                            key={idx}
                            className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                                openIndex === idx 
                                ? `shadow-lg border-opacity-0 ${isDark ? 'bg-gray-800' : 'bg-white'}` 
                                : `border-transparent ${ds.faqItemBg} hover:bg-opacity-80`
                            }`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    {q.question}
                                </span>
                                <div className={`p-2 rounded-full ${openIndex === idx ? 'bg-gray-200 text-gray-800' : 'bg-transparent text-gray-400'}`}>
                                    {openIndex === idx ? <Minus className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
                                </div>
                            </button>
                            <div 
                                className={`
                                    transition-all duration-300 ease-in-out px-6
                                    ${openIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}
                                `}
                            >
                                {renderRichText(q.answer, `leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
  };

  // 7. Registration Modal Component
  const RegistrationModal = () => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setShowModal(false)}
            ></div>
            
            {/* Modal Card */}
            <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                <button 
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                    <X className="w-6 h-6" />
                </button>
                
                {/* Badge de Cupos */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-red-500/50">
                    {content.hero.spotsLeft || "¡Cupos Limitados!"}
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Reserva tu Cupo</h3>
                    <p className="text-gray-300 text-sm">Completa el formulario para acceder ahora.</p>
                </div>
                
                <LeadCaptureForm btnClass={ds.primaryBtn} btnText={content.navCta || "Ingresar Ahora"} />

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Lock className="w-3 h-3" /> Datos seguros y encriptados.
                </div>
            </div>
        </div>
    );
  };

  // --- CONTENT MODULES ---

  const IntroSection = () => (
    <section id="seccion-introduccion" className={`py-24 relative overflow-hidden ${ds.introBg}`}>
        <BackgroundPattern />
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Image Side */}
                <div id="contenedor-imagen-intro" className="relative">
                     <div className={`absolute top-0 left-0 w-2/3 h-2/3 -translate-x-4 -translate-y-4 rounded-3xl opacity-20 ${ds.blobColor}`}></div>
                     
                     {/* Image with Floating Card */}
                     <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            alt="Intro" 
                            className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" 
                        />
                        
                        {/* Floating Card for Beauty Niche */}
                        <div className="absolute -bottom-6 -right-6 z-20 bg-white rounded-2xl p-4 shadow-xl max-w-[200px] border border-gray-100 hidden md:block transform rotate-2 hover:rotate-0 transition-transform duration-300">
                            <div className="flex items-start gap-3">
                                <div className={`w-2 h-12 rounded-full ${content.palette === 'elegant-purple' ? 'bg-purple-500' : 'bg-pink-500'} shrink-0`}></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 leading-snug">
                                        "El arte de las uñas artificiales es la nueva mina de oro de la belleza"
                                    </p>
                                    <div className="flex gap-1 mt-2">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
                
                {/* Text Side - Always Light Text because Intro BG is Dark */}
                <div id="contenedor-texto-intro" className="relative z-10">
                    <span className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-white/10 text-white`}>
                        Descubre Más
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-black mb-8 leading-tight text-white`}>
                        {content.intro.title}
                    </h2>
                    <div className={`space-y-6 text-lg leading-relaxed text-gray-300`}>
                        {renderRichText(content.intro.description)}
                    </div>

                    {/* KEY POINTS BULLETS (Dynamic Items) */}
                    <div className="mt-10 space-y-4">
                        {(content.intro.items || [
                            { title: 'Visajismo Personalizado', description: 'Diseño único basado en la estructura ósea y muscular del cliente.' },
                            { title: 'Pigmentología Avanzada', description: 'Mezclas exactas para evitar tonos rojos o azules con el tiempo.' },
                            { title: 'Técnica Pelo a Pelo', description: 'Creación de volumen y realismo indetectable a simple vista.' }
                        ]).map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                                <div className={`p-3 rounded-lg flex-shrink-0 ${i === 0 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : i === 1 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                   {i === 0 ? <ScanFace className="w-6 h-6" /> : i === 1 ? <Palette className="w-6 h-6" /> : <Feather className="w-6 h-6" />}
                                </div>
                                <div>
                                   <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                                   {renderRichText(item.description, "text-gray-400 text-sm leading-snug")}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    </section>
  );

  const BenefitsSection = () => (
    <section id="seccion-beneficios" className={`py-24 ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {content.benefits.title}
                </h2>
                <p className={`text-lg max-w-2xl mx-auto mt-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {content.benefits.subtitle || "Recibe el arsenal completo de recursos que han llevado a nuestras alumnas a facturar desde su primer mes."}
                </p>
                <div className={`h-1.5 w-24 rounded-full mx-auto mt-6 ${ds.blobColor}`}></div>
            </div>
            
            <div id="grid-beneficios" className="grid md:grid-cols-3 gap-8">
                {(content.benefits.items || []).map((item, idx) => (
                    <FeatureCard key={idx} item={item} idx={idx} />
                ))}
            </div>
        </div>
    </section>
  );

  const StepsSection = () => (
    <section id="seccion-pasos" className={`py-24 relative ${ds.stepsBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Acceder a tu Transformación es Muy Fácil
                </h2>
                <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    En solo 3 simples pasos estarás dentro de la clase que puede cambiar tu carrera.
                </p>
            </div>

            <div className="relative grid md:grid-cols-3 gap-8">
                 {/* Connector Line (Desktop) - Behind cards */}
                 <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-200 z-0 opacity-50"></div>
                 
                 {/* Steps */}
                 {[
                    { num: 1, title: "Regístrate Ahora", text: "Completa el formulario con tu nombre y correo. Es 100% gratis y seguro." },
                    { num: 2, title: "Confirma tu Correo", text: "Revisa tu bandeja de entrada y haz clic en el enlace para asegurar tu cupo." },
                    { num: 3, title: "Acceso Instantáneo", text: "Recibirás el acceso a la clase y a tu E-book de regalo de inmediato. ¡Aprende a tu ritmo!" }
                 ].map((step, i) => (
                    <div key={i} className={`relative z-10 flex flex-col items-center text-center p-8 rounded-2xl shadow-lg border transition hover:-translate-y-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                         <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 bg-gradient-to-br ${ds.stepGradient} shadow-lg shadow-purple-500/30`}>
                             {step.num}
                         </div>
                         <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                         <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{step.text}</p>
                    </div>
                 ))}
            </div>
        </div>
    </section>
  );

  const InstructorSection = () => (
    <section id="seccion-instructor" className={`py-24 relative overflow-hidden ${ds.mentorBg}`}>
         {/* Abstract Glow behind image */}
         <div className={`absolute top-1/2 left-0 md:left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${ds.blobColor}`}></div>
         
         <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                {/* Circular Image with Glow */}
                <div className="relative group shrink-0">
                     {/* Ring Glow */}
                     <div className={`absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 ${ds.blobColor}`}></div>
                     
                     <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10">
                        <img 
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            alt="Instructor"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                     </div>
                     
                     {/* Floating Badge */}
                     <div className="absolute bottom-4 right-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-lg flex items-center gap-2">
                         <Award className="w-6 h-6 text-yellow-400" />
                         <div>
                             <p className="text-[10px] text-white uppercase font-bold tracking-wider">{content.instructor.badgeText || "Top Rated"}</p>
                             <p className="text-xs text-white/80">{content.instructor.badgeSubtext || "Mentor 2024"}</p>
                         </div>
                     </div>
                </div>

                {/* Content Side */}
                <div className="text-center md:text-left flex-1">
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2 opacity-80">Conoce a tu Mentora</h4>
                    <h2 className={`text-4xl md:text-6xl font-black mb-6 ${ds.accentText}`}>
                        {content.instructor.name}
                    </h2>
                    {renderRichText(content.instructor.bio, "text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0 font-light")}
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-bold">{content.instructor.statsStudents || "5k+ Alumnos"}</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-white font-bold">{content.instructor.statsRating || "4.9/5 Rating"}</span>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section id="seccion-testimonios" className={`py-20 border-b ${isDark ? 'border-white/5' : 'border-gray-900/10'} ${ds.testimonialBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-12">
                 <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4`}>
                    {content.testimonialTitle || "Transformaron su pasión en Éxito"}
                 </h2>
                 <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    {content.testimonialSubtitle || "Ellas ya dieron el paso. Ahora es tu turno."}
                 </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                {(content.testimonials || []).map((t, i) => (
                    <div key={i} className={`p-6 rounded-2xl flex flex-col gap-4 shadow-xl transition hover:-translate-y-1 backdrop-blur-sm bg-white/5 border border-white/10`}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-white/20">
                                <img src={`https://randomuser.me/api/portraits/thumb/women/${i+30}.jpg`} alt="User" className="w-full h-full" />
                            </div>
                            <div>
                                <p className={`font-bold text-white leading-tight`}>{t.name}</p>
                                {t.location && <p className="text-xs text-gray-400">{t.location}</p>}
                            </div>
                        </div>
                        <div>
                            {renderRichText(t.text, "text-base leading-relaxed text-gray-300 italic")}
                            <div className="flex text-yellow-400 mt-3 gap-1">
                                {[...Array(5)].map((_, starI) => (
                                    <Star 
                                        key={starI} 
                                        className="w-4 h-4" 
                                        fill={starI < t.rating ? "currentColor" : "none"} 
                                        stroke="currentColor"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );

  const FinalCTASection = () => (
    <section id="seccion-cta-final" className={`py-24 relative overflow-hidden ${ds.testimonialBg}`}>
        {/* Background decorative blobs - adjusted position for full width */}
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2 ${ds.blobColor}`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-20 translate-x-1/2 translate-y-1/2 ${ds.blobColor}`}></div>

        <div className="w-full max-w-[75em] mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                ¿Lista para cambiar tu vida?
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
                No dejes pasar esta oportunidad. El acceso a la certificación y los bonos exclusivos termina pronto.
            </p>
            
            <div className="max-w-md mx-auto">
                <SmartCTA fullWidth={true} />
            </div>
        </div>
    </section>
  );

  // --- STRUCTURE 1: CLASSIC SALES (Redesigned) ---
  if (structure === 'classic-sales') {
    return (
      <div id="layout-ventas-clasica" className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white ${ds.bg} scroll-smooth`}>
        {content.palette !== 'minimal-mono' && <Navbar />}
        <RegistrationModal />
        
        <header id="cabecera-hero" className={`relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden ${ds.heroGradient}`}>
          {/* Decorative Elements */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>
          {content.palette === 'minimal-mono' && <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>}

          <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
             {/* FULL WIDTH HEADER */}
             <div id="contenedor-titulares" className="text-center max-w-5xl mx-auto mb-16">
                 {/* Top Tagline / Banner */}
                 <div id="contenedor-tagline" className="flex justify-center mb-8">
                     <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md ${ds.heroText} shadow-lg shadow-white/5 hover:scale-105 transition-transform duration-300`}>
                          <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500"></span>
                          <span className="text-sm font-black uppercase tracking-wider">
                              {content.topTagline || "🔥 Oferta por tiempo limitado"}
                          </span>
                      </div>
                 </div>
                 
                 {/* Updated H1 Rendering with Gradient Span */}
                 {renderStyledHeadline(content.hero.headline)}

                  {renderRichText(content.hero.subheadline, `text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto leading-relaxed ${ds.heroText}`)}
             </div>

             <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* LEFT COLUMN: Benefits - Wider (7/12 = 58%) */}
                <div id="columna-lista-beneficios" className="lg:col-span-7 text-left">
                    {/* NEW IMAGE CARD */}
                    <div id="tarjeta-video-clase" className="relative w-full h-[240px] rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10 group cursor-pointer">
                        <img
                            src={content.hero.heroImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                            alt="Clase Gratuita"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                        <div className="absolute bottom-0 left-0 w-full p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-transform">
                                 <PlayCircle className="w-6 h-6 text-blue-400 fill-blue-400/20" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">{content.hero.videoTitle || "Clase Gratuita: Estrategia Exclusiva"}</p>
                                <p className="text-gray-300 text-sm">{content.hero.videoDuration || "Duración: 45 Minutos"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                 {content.whatYouWillLearn.icon ? getIcon(content.whatYouWillLearn.icon, <BookOpen className="w-5 h-5 text-yellow-400" />) : <BookOpen className="w-5 h-5 text-yellow-400" />}
                             </div>
                             {content.whatYouWillLearn.title}
                        </h3>
                        <ul className="space-y-4">
                            {content.whatYouWillLearn.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors group">
                                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform`}>
                                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-lg text-gray-200 leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* RIGHT COLUMN: CTA Form - Narrower (5/12 = 42%) */}
                <div id="columna-formulario" className="lg:col-span-5 sticky top-24">
                     <SmartCTA fullWidth={true} />
                </div>
             </div>
          </div>
        </header>

        <TestimonialsSection />
        <IntroSection />
        <BenefitsSection />
        <StepsSection />
        <FAQSection />
        <InstructorSection />
        <FinalCTASection />
        <Footer />
      </div>
    );
  }

  // --- STRUCTURE 2: WEBINAR FUNNEL ---
  if (structure === 'webinar-funnel') {
    return (
      <div id="layout-webinar" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
         {content.palette !== 'minimal-mono' && <Navbar />}
         <RegistrationModal />
         
         <header id="cabecera-webinar" className={`relative py-24 lg:py-32 ${ds.heroGradient}`}>
            <div className="w-full max-w-[75em] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold mb-6`}>
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span> EN VIVO
                    </div>
                    {renderStyledHeadline(content.hero.headline)}
                    {renderRichText(content.hero.subheadline, `text-xl opacity-90 mb-8 leading-relaxed ${ds.heroText}`)}
                    
                    <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-3 text-gray-300">
                             <User className="w-5 h-5 text-gray-400" /> 
                             <span className="text-white">Impartido por: <strong>{content.instructor.name}</strong></span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-300">
                             <Target className="w-5 h-5 text-gray-400" />
                             <span className="text-white">Para: <strong>{content.targetAudience || "Emprendedores"}</strong></span>
                         </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400" /> Lo que aprenderás:
                        </h4>
                        <ul className="grid gap-3">
                            {content.whatYouWillLearn.items.slice(0, 3).map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                    <SmartCTA fullWidth={true} />
                </div>
            </div>
         </header>

         {/* Webinar Content Order: Instructor -> Benefits -> Testimonials */}
         <InstructorSection />
         <BenefitsSection />
         <TestimonialsSection />
         <FAQSection />
         <FinalCTASection />
         <Footer />
      </div>
    );
  }

  // --- STRUCTURE 3: VSL (Video Sales Letter) ---
  if (structure === 'vsl-focused') {
    return (
        <div id="layout-vsl" className={`min-h-screen font-sans ${ds.bg}`}>
            {content.palette !== 'minimal-mono' && <Navbar />}
            <RegistrationModal />

            <div className={`py-12 ${ds.heroGradient}`}>
                <div className="w-full max-w-4xl mx-auto px-6 text-center">
                    {renderStyledHeadline(content.hero.headline)}
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto px-6 -mt-8 mb-16 relative z-10">
                <div className="aspect-video bg-black rounded-xl shadow-2xl border-4 border-gray-800 overflow-hidden relative group">
                     {/* Video Placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                         <PlayCircle className="w-20 h-20 text-white opacity-50 group-hover:opacity-100 transition duration-300 scale-95 group-hover:scale-100 cursor-pointer" />
                         <p className="absolute bottom-4 text-gray-500 text-sm">El video de ventas se cargaría aquí</p>
                     </div>
                </div>
                <div className="mt-8 text-center max-w-2xl mx-auto">
                    <SmartCTA fullWidth={false} />
                </div>
            </div>

            {/* VSL Content Order: Benefits -> Testimonials -> FAQ */}
            <div className="max-w-4xl mx-auto">
                <BenefitsSection />
                <div className="my-12 h-px bg-gray-200"></div>
                <TestimonialsSection />
                <FAQSection />
                <FinalCTASection />
            </div>
            
            <Footer />
        </div>
    );
  }

  // --- STRUCTURE 4: MINIMAL CAPTURE ---
  return (
    <div id="layout-minimalista" className={`min-h-screen font-sans flex flex-col ${ds.bg}`}>
        <div className="flex-1 flex flex-col justify-center py-12 relative overflow-hidden">
             {/* Simple Background Decor */}
             <div className={`absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-[80px] ${ds.blobColor}`}></div>
             
             <div className="w-full max-w-lg mx-auto px-6 relative z-10 text-center">
                  <div className={`w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-lg ${ds.logoBg}`}>
                      {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-8 h-8"/>) : (
                         content.logoSvg ? <div className="w-8 h-8" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-8 h-8"/>
                      )}
                  </div>
                  
                  <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${content.palette === 'minimal-mono' ? 'text-black' : ds.heroText.replace('text-white', 'text-gray-900')}`}>
                      {content.hero.headline.replace(/<\/?[^>]+(>|$)/g, "")}
                  </h1>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                      {content.hero.subheadline}
                  </p>

                  <div className="bg-white p-1 rounded-2xl shadow-xl border border-gray-100">
                      <SmartCTA fullWidth={true} />
                  </div>

                  <p className="mt-8 text-xs text-gray-400">
                      &copy; {new Date().getFullYear()} {content.brandName ? content.brandName.replace(/<\/?[^>]+(>|$)/g, "") : "Company"}.
                  </p>
             </div>
        </div>
        
        {/* Minimal content below fold for SEO/Info */}
        <div className="bg-gray-50 py-12 border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-6 opacity-70 hover:opacity-100 transition duration-500">
                 <div className="grid md:grid-cols-2 gap-8">
                     <div>
                         <h4 className="font-bold text-gray-900 mb-2">Sobre Nosotros</h4>
                         <p className="text-sm text-gray-500">{content.footer.copyright}</p>
                     </div>
                     <div>
                         <h4 className="font-bold text-gray-900 mb-2">Contacto</h4>
                         <p className="text-sm text-gray-500">{content.footer.contact}</p>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};
