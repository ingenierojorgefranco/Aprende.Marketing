

import React, { useEffect, useState } from 'react';
import { GeneratedPageContent, ColorPalette, StructureType, Article } from '../types';
import { CheckCircle, Star, PlayCircle, User, MessageCircle, ArrowRight, Lock, ShieldCheck, Zap, BarChart, Facebook, Instagram, Twitter, Mail, Anchor, Sparkles, Award, Users, DollarSign, FileText, Briefcase, BookOpen, ScanFace, Palette, Feather, Plus, Minus, HelpCircle, X, Rocket, Target, Globe, Menu, Calendar, ArrowLeft, Clock } from 'lucide-react';
import { api } from '../services/api';

interface LivePageProps {
  content: GeneratedPageContent;
  isMobilePreview?: boolean;
  pageId?: string; // Para buscar artículos del blog
  viewMode?: 'home' | 'blog-list' | 'blog-post';
  articleSlug?: string;
  basePath?: string; // Para construir URLs relativas del blog
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

// Helper for rendering rich text descriptions
const renderRichText = (text: string, className: string = "") => {
    const formattedText = text ? text.replace(/\n/g, '<br />') : '';
    return (
      <div 
          className={className} 
          dangerouslySetInnerHTML={{ __html: formattedText }} 
      />
    );
};

// Helper to render headline with specific gradient styling from <b> tags
const renderStyledHeadline = (text: string, isMobilePreview: boolean) => {
    const htmlContent = text.replace(
      /<b>(.*?)<\/b>/g, 
      '<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-600">$1</span>'
    );
    
    return (
      <h1 
        id="titulo-principal"
        className={`font-extrabold text-white tracking-tight mb-6 leading-[1.25] max-w-4xl mx-auto ${isMobilePreview ? 'text-4xl' : 'text-3xl md:text-5xl lg:text-7xl'}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
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

// --- EXTRACTED SUB-COMPONENTS ---

const BackgroundPattern = ({ palette }: { palette: ColorPalette }) => {
    if (palette === 'minimal-mono') {
        return <div id="fondo-patron" className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-70"></div>;
    }
    return null;
};

const LeadCaptureForm = ({ btnClass, btnText }: { btnClass: string, btnText: string }) => (
    <div className="space-y-4 relative z-10">
        <div className="relative">
            <User className="absolute top-3.5 left-3 w-5 h-5 text-gray-300" />
            <input placeholder="Tu Nombre Completo" className="w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-lg bg-white/10 text-white focus:bg-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 outline-none transition placeholder-gray-400 text-base" />
        </div>
        <div className="relative">
            <MessageCircle className="absolute top-3.5 left-3 w-5 h-5 text-gray-300" />
            <input placeholder="Tu Correo Principal" className="w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-lg bg-white/10 text-white focus:bg-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 outline-none transition placeholder-gray-400 text-base" />
        </div>
        <button className={`w-full py-4 rounded-lg font-bold text-lg transition transform hover:scale-[1.02] active:scale-[0.98] ${btnClass}`}>
            {btnText}
        </button>
    </div>
);

const SmartCTA = ({ content, ds, fullWidth = false, centered = false, isMobilePreview }: { content: GeneratedPageContent, ds: any, fullWidth?: boolean, centered?: boolean, isMobilePreview: boolean }) => {
    const dest = content.destination;
    
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
          <div id="contenedor-formulario-cta" className={`bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 relative ${centered ? 'mx-auto max-w-md' : 'w-full'} ${isMobilePreview ? 'p-5' : 'p-5 md:p-8'}`}>
              
              <div className="absolute -top-3.5 right-4 md:right-6 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20 border border-red-500/50">
                  {content.hero.spotsLeft || "¡Cupos Limitados!"}
              </div>

              <h3 className={`font-bold text-white mb-2 text-center ${isMobilePreview ? 'text-xl' : 'text-xl md:text-2xl'}`}>Reserva tu lugar GRATIS</h3>
              <p className="text-gray-400 text-center mb-6 text-sm">Accede al método exclusivo.</p>
              
              <LeadCaptureForm btnClass={ds.primaryBtn} btnText={content.hero.ctaText} />
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white-500 text-center mb-6">
                  <Lock className="w-3 h-3 flex-shrink-0" /> Tus datos están 100% seguros. No hacemos spam.
              </div>

              <div className="pt-6 border-t border-gray-700/50 flex items-center justify-between">
                  <div className="flex -space-x-3">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-[#1e293b] object-cover" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-[#1e293b] object-cover" />
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-[#1e293b] object-cover" />
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

const FeatureCard = ({ item, idx, ds, content, isDark }: any) => {
    let gradientClass = "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/50";
    if (item.color === 'purple') gradientClass = "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50";
    if (item.color === 'green') gradientClass = "bg-gradient-to-br from-emerald-400 to-green-600 shadow-emerald-500/50";
    if (item.color === 'orange') gradientClass = "bg-gradient-to-br from-amber-400 to-orange-600 shadow-orange-500/50";
    if (item.color === 'red') gradientClass = "bg-gradient-to-br from-red-500 to-rose-600 shadow-rose-500/50";
    if (item.color === 'teal') gradientClass = "bg-gradient-to-br from-teal-400 to-cyan-600 shadow-cyan-500/50";
    if (item.color === 'yellow') gradientClass = "bg-gradient-to-br from-yellow-400 to-amber-600 shadow-amber-500/50";

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

const Navbar = ({ content, ds, isMobilePreview, setShowModal, hasBlog, basePath }: any) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const baseTextColorClass = content.palette === 'minimal-mono' ? 'text-black' : 'text-white';
    const stickyTextColorClass = ds.navStickyText || 'text-gray-900'; 
    const currentTextColor = isScrolled ? stickyTextColorClass : baseTextColorClass;

    const navLinks = content.navLinks || [
        { label: 'Descubre', href: '#seccion-introduccion' },
        { label: 'Beneficios', href: '#seccion-beneficios' },
        { label: 'Experto', href: '#seccion-instructor' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('preview-viewport');
            // If container is null (e.g. public view), use window scroll
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

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Handle internal Blog links
        if (href === '/blog') {
            e.preventDefault();
            // Redirect using window.location if necessary or relative path
            window.location.href = basePath ? `${basePath}/blog` : '/blog';
            return;
        }

        if (href.startsWith('#')) {
            e.preventDefault();
            const id = href.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
            } else {
                // If we are in blog view, we might need to go home first
                // Use basePath to construct home link
                window.location.href = basePath || '/';
            }
        } else {
             // External link
             // window.location.href = href;
        }
    };

    const renderBrandName = (text: string) => {
         const htmlContent = text.replace(
           /<b>(.*?)<\/b>/g, 
           `<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500 font-extrabold">$1</span>`
         );
         return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    // Inject Blog link if exists and not already present
    const displayedLinks = [...navLinks];
    if (hasBlog && !displayedLinks.some((l: any) => l.href === '/blog')) {
        displayedLinks.push({ label: 'Blog', href: '/blog' });
    }

    return (
      <nav 
        id="barra-navegacion"
        className={`
            w-full z-50 transition-all duration-300
            ${isScrolled ? `${ds.navStickyBg} fixed top-0 left-0` : 'absolute top-0 left-0 bg-transparent border-b border-white/5 backdrop-blur-sm'}
        `}
      >
          <div className="w-full max-w-[75em] mx-auto px-6 py-4 flex justify-between items-center relative gap-4">
            <div id="logo-marca" 
                 onClick={() => window.location.href = basePath || '/'}
                 className={`flex items-center gap-2 md:gap-3 font-bold tracking-tight transition-colors duration-300 ${currentTextColor} flex-1 min-w-0 mr-2 cursor-pointer`}>
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-2 border-white/20 flex-shrink-0 ${ds.logoBg}`}>
                 {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5 md:w-6 md:h-6" />) : (
                    content.logoSvg ? (
                        <div 
                          className="w-5 h-5 md:w-7 md:h-7" 
                          dangerouslySetInnerHTML={{ __html: content.logoSvg }} 
                        />
                     ) : <Anchor className="w-4 h-4 md:w-6 md:h-6 text-current" /> 
                 )}
              </div>
              <span className="truncate text-sm sm:text-lg md:text-2xl leading-tight">
                {renderBrandName(content.brandName || "Brand")}
              </span>
            </div>
            
            <div id="enlaces-navegacion" className={`${isMobilePreview ? 'hidden' : 'hidden md:flex'} gap-8 text-sm font-medium transition-colors duration-300 ${currentTextColor} opacity-90 flex-shrink-0`}>
              {displayedLinks.map((link: any, i: number) => (
                  <a key={i} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="hover:opacity-100 transition cursor-pointer">{link.label}</a>
              ))}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                id="cta-navbar" 
                onClick={() => setShowModal(true)}
                className={`${isMobilePreview ? 'hidden' : 'hidden md:block'} px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition shadow-sm ${ds.primaryBtn} ${content.palette === 'minimal-mono' && !isScrolled ? '' : 'bg-white text-black hover:bg-gray-100 border-none'}`}
                >
                {content.navCta || "Regístrate"}
                </button>

                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`${isMobilePreview ? 'flex' : 'md:hidden flex'} items-center justify-center p-2 rounded-lg transition-colors ${currentTextColor} hover:bg-white/10`}
                >
                    {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                </button>
            </div>
          </div>

          {isMenuOpen && (
              <div className={`${isMobilePreview ? 'flex' : 'md:hidden flex'} absolute top-full left-0 w-full ${ds.navStickyBg || 'bg-white'} border-b border-gray-100 shadow-xl p-6 flex-col gap-4 animate-in slide-in-from-top-2 z-40`}>
                  {displayedLinks.map((link: any, i: number) => (
                      <a 
                        key={i} 
                        href={link.href} 
                        onClick={(e) => scrollToSection(e, link.href)}
                        className={`text-lg font-medium py-3 border-b border-gray-100/50 last:border-0 hover:pl-2 transition-all ${ds.navStickyText || 'text-gray-900'} cursor-pointer`}
                      >
                          {link.label}
                      </a>
                  ))}
                  
                  <div className="pt-4 mt-2 border-t border-gray-100/20 w-full">
                     <button
                        onClick={() => { setShowModal(true); setIsMenuOpen(false); }}
                        className={`w-full py-3 rounded-xl font-bold text-center shadow-lg ${ds.primaryBtn}`}
                     >
                        {content.navCta || "Regístrate"}
                     </button>
                  </div>
              </div>
          )}
      </nav>
    );
};

const Footer = ({ content, ds, isDark, isMobilePreview }: any) => {
    const { socials } = content.footer;
    const navLinks = content.navLinks || [
        { label: 'Descubre', href: '#seccion-introduccion' },
        { label: 'Beneficios', href: '#seccion-beneficios' },
        { label: 'Experto', href: '#seccion-instructor' }
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!href.startsWith('#')) return;
        e.preventDefault();
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer id="pie-de-pagina" className={`${isDark ? 'bg-black border-t border-gray-900' : 'bg-gray-900 text-white border-t border-gray-800'} py-16`}>
            <div className="w-full max-w-[75em] mx-auto px-6">
                <div className={`grid gap-12 mb-12 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-4'}`}>
                    <div className={`${isMobilePreview ? '' : 'col-span-2'}`}>
                    <div id="footer-logo" className="flex items-center gap-2 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/10 ${ds.logoBg}`}>
                             {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5"/>) : (
                                content.logoSvg ? <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-5 h-5"/>
                             )}
                        </div>
                        <h4 className="text-2xl font-bold" dangerouslySetInnerHTML={{__html: content.brandName || "PlataformaDeVenta.com"}}></h4>
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
                            {navLinks.map((link: any, i: number) => (
                                <li key={i}><a href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="hover:text-white transition cursor-pointer">{link.label}</a></li>
                            ))}
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
};

const RegistrationModal = ({ showModal, setShowModal, content, ds }: any) => {
    if (!showModal) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="bg-white rounded-2xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className={`p-6 ${ds.heroGradient} text-white relative`}>
                     <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-1"><X className="w-5 h-5"/></button>
                     <h3 className="text-xl font-bold mb-1">¡Casi estás dentro!</h3>
                     <p className="text-sm opacity-90">Completa tus datos para liberar tu acceso.</p>
                </div>
                <div className="p-6">
                    <LeadCaptureForm btnClass={ds.primaryBtn} btnText={content.hero.ctaText || "Finalizar Registro"} />
                    <p className="text-xs text-center text-gray-400 mt-4">Tus datos están protegidos.</p>
                </div>
            </div>
        </div>
    );
};

const IntroSection = ({ content, ds, isMobilePreview }: any) => (
    <section id="seccion-introduccion" className={`py-16 md:py-24 ${ds.introBg || 'bg-white'}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className={`grid gap-12 items-center ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                <div className="order-2 md:order-1">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${content.palette.includes('dark') ? 'text-white' : 'text-gray-900'}`}>
                        {content.intro.title}
                    </h2>
                    {renderRichText(content.intro.description, `text-lg leading-relaxed mb-8 ${content.palette.includes('dark') ? 'text-gray-300' : 'text-gray-600'}`)}
                    
                    {content.intro.items && content.intro.items.length > 0 && (
                        <div className="space-y-4">
                            {content.intro.items.map((item: any, i: number) => (
                                <div key={i} className={`p-4 rounded-xl border ${content.palette.includes('dark') ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                    <h4 className={`font-bold mb-1 ${content.palette.includes('dark') ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                                    <p className={`text-sm ${content.palette.includes('dark') ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={`order-1 md:order-2 relative ${content.palette.includes('dark') ? 'bg-white/5' : 'bg-gray-100'} rounded-2xl min-h-[300px] flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 rounded-2xl pointer-events-none"></div>
                    {/* Placeholder for Intro Image if exists or generic icon */}
                    <BookOpen className={`w-24 h-24 opacity-20 ${content.palette.includes('dark') ? 'text-white' : 'text-gray-900'}`} />
                </div>
            </div>
        </div>
    </section>
);

const BenefitsSection = ({ content, ds, isDark, isMobilePreview }: any) => (
    <section id="seccion-beneficios" className={`py-20 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {content.benefits.title}
                </h2>
                {content.benefits.subtitle && <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{content.benefits.subtitle}</p>}
            </div>
            
            <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                {content.benefits.items.map((item: any, idx: number) => (
                    <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} isDark={isDark} />
                ))}
            </div>
        </div>
    </section>
);

const StepsSection = ({ content, ds, isDark, isMobilePreview }: any) => {
    if (!content.intro?.items || content.intro.items.length === 0) return null;
    return (
        <section className={`py-20 ${ds.stepsBg || (isDark ? 'bg-gray-900' : 'bg-blue-50/50')}`}>
            <div className="w-full max-w-[75em] mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>¿Cómo funciona?</h2>
                </div>
                <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                    {content.intro.items.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="relative">
                            <div className={`text-6xl font-black absolute -top-8 left-0 opacity-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>0{idx+1}</div>
                            <div className="relative z-10 pt-4">
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const InstructorSection = ({ content, ds, isMobilePreview }: any) => (
    <section id="seccion-instructor" className={`py-20 ${ds.mentorBg || 'bg-gray-900'} text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
        <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
            <div className={`flex flex-col md:flex-row items-center gap-12 ${isMobilePreview ? 'flex-col' : ''}`}>
                <div className="w-full md:w-1/3">
                    <div className="aspect-[3/4] rounded-2xl bg-gray-700 relative overflow-hidden shadow-2xl border border-white/10">
                         {content.instructor.imageUrl ? (
                             <img src={content.instructor.imageUrl} alt={content.instructor.name} className="w-full h-full object-cover" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                                 <User className="w-24 h-24" />
                             </div>
                         )}
                         <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
                             <div className="text-white font-bold">{content.instructor.name}</div>
                             <div className="text-gray-400 text-sm">{content.instructor.badgeText || "Instructor"}</div>
                         </div>
                    </div>
                </div>
                <div className="w-full md:w-2/3">
                    <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
                        {content.instructor.badgeSubtext || "Experto del Sector"}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Conoce a tu Mentor</h2>
                    {renderRichText(content.instructor.bio, "text-lg text-gray-300 leading-relaxed mb-8")}
                    
                    <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">{content.instructor.statsStudents || "5k+"}</div>
                            <div className="text-gray-400 text-sm">Estudiantes activos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">{content.instructor.statsRating || "4.9/5"}</div>
                            <div className="text-gray-400 text-sm">Calificación promedio</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const TestimonialsSection = ({ content, ds, isDark, isMobilePreview }: any) => (
    <section id="seccion-testimonios" className={`py-20 ${ds.testimonialBg || (isDark ? 'bg-black' : 'bg-gray-50')}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {content.testimonialTitle || "Historias de éxito"}
                </h2>
                {content.testimonialSubtitle && <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{content.testimonialSubtitle}</p>}
            </div>
            
            <div className={`grid gap-6 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {content.testimonials.map((t: any, idx: number) => (
                    <div key={idx} className={`p-6 rounded-2xl relative ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg border border-gray-100'}`}>
                        <div className="flex gap-1 text-yellow-500 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        {renderRichText(t.text, `text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`)}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                                {t.name.charAt(0)}
                            </div>
                            <div>
                                <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.name}</div>
                                {t.location && <div className="text-xs text-gray-500">{t.location}</div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FAQSection = ({ content, ds, isDark }: any) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <section id="seccion-faq" className={`py-20 ${ds.faqBg || (isDark ? 'bg-gray-900' : 'bg-white')}`}>
            <div className="w-full max-w-3xl mx-auto px-6">
                <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>Preguntas Frecuentes</h2>
                <div className="space-y-4">
                    {content.faq.map((item: any, idx: number) => (
                        <div key={idx} className={`rounded-xl overflow-hidden transition-all ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <button 
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-5 text-left font-bold"
                            >
                                <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{item.question}</span>
                                {openIndex === idx ? <Minus className="w-5 h-5 text-gray-500"/> : <Plus className="w-5 h-5 text-gray-500"/>}
                            </button>
                            {openIndex === idx && (
                                <div className={`p-5 pt-0 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {renderRichText(item.answer)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinalCTASection = ({ content, ds, isMobilePreview }: any) => (
    <section className={`py-24 relative overflow-hidden ${ds.heroGradient}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="w-full max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                {content.hero.headline.replace(/<\/?[^>]+(>|$)/g, "")}
            </h2>
            <div className="flex justify-center">
                <SmartCTA content={content} ds={ds} fullWidth={false} isMobilePreview={isMobilePreview} />
            </div>
        </div>
    </section>
);

// --- BLOG COMPONENTS ---

const BlogGridSection = ({ articles, ds, isDark, basePath }: any) => {
    return (
        <section className={`py-24 ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'} min-h-screen pt-32`}>
             <div className="w-full max-w-[75em] mx-auto px-6">
                 <div className="text-center mb-16">
                     <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Blog & Novedades</h2>
                     <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                         Descubre contenido exclusivo para complementar tu aprendizaje.
                     </p>
                 </div>

                 {articles.length === 0 ? (
                     <div className="text-center py-20 opacity-50">
                         <p>No hay artículos publicados aún.</p>
                     </div>
                 ) : (
                     <div className="grid md:grid-cols-3 gap-8">
                         {articles.map((article: Article) => (
                             <a 
                                key={article.id} 
                                href={basePath ? `${basePath}/blog/${article.slug}` : `/blog/${article.slug}`}
                                className={`group rounded-xl overflow-hidden border transition hover:-translate-y-2 shadow-lg ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 hover:shadow-xl'}`}
                             >
                                 <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                     {article.featuredImage ? (
                                         <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                                             <FileText className="w-12 h-12" />
                                         </div>
                                     )}
                                 </div>
                                 <div className="p-6">
                                     <div className="text-xs text-blue-500 font-bold mb-2 flex items-center gap-1">
                                         <Calendar className="w-3 h-3" /> {new Date(article.publishedAt).toLocaleDateString()}
                                     </div>
                                     <h3 className={`text-xl font-bold mb-3 leading-tight ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
                                         {article.title}
                                     </h3>
                                     <p className={`text-sm line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                         {article.description}
                                     </p>
                                     <div className={`mt-4 font-bold text-sm flex items-center gap-1 ${isDark ? 'text-white' : 'text-black'}`}>
                                         Leer artículo <ArrowRight className="w-4 h-4" />
                                     </div>
                                 </div>
                             </a>
                         ))}
                     </div>
                 )}
             </div>
        </section>
    );
};

const BlogPostView = ({ article, ds, isDark, basePath }: any) => {
    if (!article) return <div className="py-32 text-center text-white">Cargando artículo...</div>;

    // Handle back button action - if coming from outside, go to blog list
    const goBack = () => {
        if(basePath) {
             window.location.href = `${basePath}/blog`;
        } else {
             window.history.back();
        }
    };

    return (
        <article className={`min-h-screen pt-32 pb-24 ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
             <div className="w-full max-w-4xl mx-auto px-6">
                 <button onClick={goBack} className={`mb-8 flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                     <ArrowLeft className="w-4 h-4" /> Volver al Blog
                 </button>

                 <header className="mb-12 text-center">
                     <div className="flex items-center justify-center gap-2 text-sm text-blue-500 font-bold mb-4">
                         <Calendar className="w-4 h-4" /> {new Date(article.publishedAt).toLocaleDateString()}
                     </div>
                     <h1 className={`text-3xl md:text-5xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                         {article.title}
                     </h1>
                     <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                         {article.description}
                     </p>
                 </header>

                 {article.featuredImage && (
                     <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 aspect-video">
                         <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
                     </div>
                 )}

                 <div 
                    className={`prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''}`}
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                 />
             </div>
        </article>
    );
};


// --- MAIN COMPONENT ---

export const LivePage: React.FC<LivePageProps> = ({ content, isMobilePreview = false, pageId, viewMode = 'home', articleSlug, basePath }) => {
  const ds = getDesignSystem(content.palette);
  const structure: StructureType = content.structure || 'classic-sales'; 
  const isDark = content.palette === 'dark-luxury';
  const [showModal, setShowModal] = useState(false);
  
  // Blog State
  const [blogArticles, setBlogArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [hasBlog, setHasBlog] = useState(false);

  useEffect(() => {
      if (pageId && !isMobilePreview) {
          api.getPublicBlogArticles(pageId).then(articles => {
              if (articles.length > 0) {
                  setBlogArticles(articles);
                  setHasBlog(true);
              }
          });
      }
  }, [pageId, isMobilePreview]);

  useEffect(() => {
      if (viewMode === 'blog-post' && articleSlug) {
          api.getPublicArticle(articleSlug).then(article => {
              setCurrentArticle(article);
          });
      }
  }, [viewMode, articleSlug]);

  // Si el modo es BLOG, renderizamos layout de blog
  if (viewMode === 'blog-list') {
      return (
          <div id="layout-blog-list" className={`min-h-screen font-sans ${ds.bg}`}>
               <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} setShowModal={setShowModal} hasBlog={hasBlog} basePath={basePath} />
               <RegistrationModal showModal={showModal} setShowModal={setShowModal} content={content} ds={ds} />
               <BlogGridSection articles={blogArticles} ds={ds} isDark={isDark} basePath={basePath} />
               <Footer content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
          </div>
      );
  }

  if (viewMode === 'blog-post') {
      return (
          <div id="layout-blog-post" className={`min-h-screen font-sans ${ds.bg}`}>
               <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} setShowModal={setShowModal} hasBlog={hasBlog} basePath={basePath} />
               <RegistrationModal showModal={showModal} setShowModal={setShowModal} content={content} ds={ds} />
               <BlogPostView article={currentArticle} ds={ds} isDark={isDark} basePath={basePath} />
               <Footer content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
          </div>
      );
  }

  // --- STRUCTURE 1: CLASSIC SALES (HOME) ---
  if (structure === 'classic-sales') {
    return (
      <div id="layout-ventas-clasica" className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white ${ds.bg} scroll-smooth`}>
        {content.palette !== 'minimal-mono' && <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} setShowModal={setShowModal} hasBlog={hasBlog} basePath={basePath} />}
        <RegistrationModal showModal={showModal} setShowModal={setShowModal} content={content} ds={ds} />
        
        <header id="seccion-hero" className={`relative pb-12 overflow-hidden scroll-mt-24 ${ds.heroGradient} ${isMobilePreview ? 'pt-28' : 'pt-24 lg:pt-48 lg:pb-32'}`}>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>
          {content.palette === 'minimal-mono' && <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>}

          <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
             <div id="contenedor-titulares" className="text-center max-w-5xl mx-auto mb-10 lg:mb-16">
                 <div id="contenedor-tagline" className="flex justify-center mb-6 lg:mb-8">
                     <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md ${ds.heroText} shadow-lg shadow-white/5 hover:scale-105 transition-transform duration-300`}>
                          <span className="text-xs md:text-sm font-black uppercase tracking-wider">
                              {content.topTagline || "🔥 Oferta por tiempo limitado"}
                          </span>
                      </div>
                 </div>
                 
                 {renderStyledHeadline(content.hero.headline, isMobilePreview)}

                  {renderRichText(content.hero.subheadline, `font-light opacity-90 max-w-3xl mx-auto leading-relaxed ${ds.heroText} ${isMobilePreview ? 'text-lg' : 'text-lg md:text-2xl'}`)}
             </div>

             <div className={`grid gap-8 items-start ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-12 lg:gap-12'}`}>
                
                <div id="columna-lista-beneficios" className={`${isMobilePreview ? 'w-full order-2' : 'lg:col-span-7 text-left order-2 lg:order-1'}`}>
                    <div id="tarjeta-video-clase" className={`relative w-full aspect-video h-auto rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10 group cursor-pointer`}>
                        <img
                            src={content.hero.heroImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                            alt="Clase Gratuita"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-transform">
                                 <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-400 fill-blue-400/20" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-base md:text-lg">{content.hero.videoTitle || "Clase Gratuita: Estrategia Exclusiva"}</p>
                                <p className="text-gray-300 text-xs md:text-sm">{content.hero.videoDuration || "Duración: 45 Minutos"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                             <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                 {content.whatYouWillLearn.icon ? getIcon(content.whatYouWillLearn.icon, <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />) : <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />}
                             </div>
                             {content.whatYouWillLearn.title}
                        </h3>
                        <ul className="space-y-4">
                            {content.whatYouWillLearn.items.map((item: any, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 md:gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors group">
                                    <div className={`mt-0.5 md:mt-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform shrink-0`}>
                                        <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                                    </div>
                                    <span className="text-base md:text-lg text-gray-200 leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div id="columna-formulario" className={`${isMobilePreview ? 'w-full order-1' : 'lg:col-span-5 lg:sticky lg:top-24 order-1 lg:order-2'}`}>
                     <SmartCTA content={content} ds={ds} fullWidth={true} isMobilePreview={isMobilePreview} />
                </div>
             </div>
          </div>
        </header>

        <TestimonialsSection content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
        <IntroSection content={content} ds={ds} isMobilePreview={isMobilePreview} />
        <BenefitsSection content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
        <StepsSection content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
        <FAQSection content={content} ds={ds} isDark={isDark} />
        <InstructorSection content={content} ds={ds} isMobilePreview={isMobilePreview} />
        <FinalCTASection content={content} ds={ds} isMobilePreview={isMobilePreview} />
        <Footer content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
      </div>
    );
  }

  // --- STRUCTURE 2: WEBINAR FUNNEL ---
  if (structure === 'webinar-funnel') {
    return (
      <div id="layout-webinar" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
         {content.palette !== 'minimal-mono' && <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} setShowModal={setShowModal} hasBlog={hasBlog} basePath={basePath} />}
         <RegistrationModal showModal={showModal} setShowModal={setShowModal} content={content} ds={ds} />
         
         <header id="seccion-hero" className={`relative py-24 lg:py-32 scroll-mt-24 ${ds.heroGradient}`}>
            <div className={`w-full max-w-[75em] mx-auto px-6 grid gap-16 items-center ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
                <div className={`${isMobilePreview ? 'order-2' : 'order-2 lg:order-1'}`}>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold mb-6`}>
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span> EN VIVO
                    </div>
                    {renderStyledHeadline(content.hero.headline, isMobilePreview)}
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
                            {content.whatYouWillLearn.items.slice(0, 3).map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={`${isMobilePreview ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <SmartCTA content={content} ds={ds} fullWidth={true} isMobilePreview={isMobilePreview} />
                </div>
            </div>
         </header>

         <InstructorSection content={content} ds={ds} isMobilePreview={isMobilePreview} />
         <BenefitsSection content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
         <TestimonialsSection content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
         <FAQSection content={content} ds={ds} isDark={isDark} />
         <FinalCTASection content={content} ds={ds} isMobilePreview={isMobilePreview} />
         <Footer content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
      </div>
    );
  }

  // --- STRUCTURE 3: VSL (Video Sales Letter) ---
  if (structure === 'vsl-focused') {
    return (
        <div id="layout-vsl" className={`min-h-screen font-sans ${ds.bg}`}>
            {content.palette !== 'minimal-mono' && <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} setShowModal={setShowModal} hasBlog={hasBlog} basePath={basePath} />}
            <RegistrationModal showModal={showModal} setShowModal={setShowModal} content={content} ds={ds} />

            <div id="seccion-hero" className={`py-12 scroll-mt-24 ${ds.heroGradient}`}>
                <div className="w-full max-w-4xl mx-auto px-6 text-center">
                    {renderStyledHeadline(content.hero.headline, isMobilePreview)}
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto px-6 -mt-8 mb-16 relative z-10">
                <div className="aspect-video bg-black rounded-xl shadow-2xl border-4 border-gray-800 overflow-hidden relative group">
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                         <PlayCircle className="w-20 h-20 text-white opacity-50 group-hover:opacity-100 transition duration-300 scale-95 group-hover:scale-100 cursor-pointer" />
                         <p className="absolute bottom-4 text-gray-500 text-sm">El video de ventas se cargaría aquí</p>
                     </div>
                </div>
                <div className="mt-8 text-center max-w-2xl mx-auto">
                    <SmartCTA content={content} ds={ds} fullWidth={false} isMobilePreview={isMobilePreview} />
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <BenefitsSection content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
                <div className="my-12 h-px bg-gray-200"></div>
                <TestimonialsSection content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
                <FAQSection content={content} ds={ds} isDark={isDark} />
                <FinalCTASection content={content} ds={ds} isMobilePreview={isMobilePreview} />
            </div>
            
            <Footer content={content} ds={ds} isDark={isDark} isMobilePreview={isMobilePreview} />
        </div>
    );
  }

  // --- STRUCTURE 4: MINIMAL CAPTURE ---
  return (
    <div id="layout-minimalista" className={`min-h-screen font-sans flex flex-col ${ds.bg}`}>
        <div id="seccion-hero" className="flex-1 flex flex-col justify-center py-12 relative overflow-hidden scroll-mt-24">
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
                      <SmartCTA content={content} ds={ds} fullWidth={true} isMobilePreview={isMobilePreview} />
                  </div>

                  <p className="mt-8 text-xs text-gray-400">
                      &copy; {new Date().getFullYear()} {content.brandName ? content.brandName.replace(/<\/?[^>]+(>|$)/g, "") : "Company"}.
                  </p>
             </div>
        </div>
        
        <div className="bg-gray-50 py-12 border-t border-gray-200">
            <div className={`max-w-4xl mx-auto px-6 opacity-70 hover:opacity-100 transition duration-500`}>
                 <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                     <div>
                         <h4 className="font-bold text-gray-900 mb-2">Sobre Nosotros</h4>
                         <p className="text-sm text-gray-500">{content.footer.copyright}</p>
                     </div>
                     <div>
                         <h4 className="font-bold text-gray-900 mb-2">Contacto</h4>
                         <p className="text-sm text-gray-500">{content.footer.contact}</p>
                     </div>
                     {hasBlog && (
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Blog</h4>
                            <a href={basePath ? `${basePath}/blog` : `/blog`} className="text-sm text-blue-600 hover:underline">Ver artículos recientes</a>
                        </div>
                     )}
                 </div>
            </div>
        </div>
    </div>
  );
};