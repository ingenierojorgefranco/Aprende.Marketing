

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
    // Safety check for undefined text
    if (!text || typeof text !== 'string') {
      return null;
    }
    const formattedText = text ? text.replace(/\n/g, '<br />') : '';
    return (
      <div 
          className={className} 
          dangerouslySetInnerHTML={{ __html: formattedText }} 
      />
    );
};

// Helper to render headline with specific gradient styling from <b> tags
// FIX: Force text-white class to ensure titles are visible on dark backgrounds
const renderStyledHeadline = (text: string, isMobilePreview: boolean, forceWhite: boolean = true) => {
    if (!text || typeof text !== 'string') return null; // Safe guard for undefined/null text
    
    const htmlContent = text.replace(
      /<b>(.*?)<\/b>/g, 
      '<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-600">$1</span>'
    );
    
    return (
      <h1 
        id="titulo-principal"
        className={`font-extrabold tracking-tight mb-6 leading-[1.25] max-w-4xl mx-auto ${forceWhite ? 'text-white' : ''} ${isMobilePreview ? 'text-4xl' : 'text-3xl md:text-5xl lg:text-7xl'}`}
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
                   {content.hero.ctaText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></div>
            </button>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Garantía de satisfacción 100%
            </div>
        </div>
    );
};

// --- BLOG LIST VIEW ---
const BlogListView = ({ pageId, basePath }: { pageId: string, basePath: string }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await api.getPublicBlogArticles(pageId);
                setArticles(data);
            } catch (e) {
                console.error("Error fetching articles", e);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [pageId]);

    if (loading) return <div className="p-10 text-center"><span className="animate-spin">⌛</span> Cargando artículos...</div>;

    if (articles.length === 0) return (
        <div className="py-20 text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-700">Aún no hay artículos</h2>
            <p className="text-gray-500">Vuelve pronto para ver nuevas publicaciones.</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">Blog & Recursos</h2>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                    <a key={article.id} href={`${basePath}/blog/${article.slug}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                            {article.featuredImage ? (
                                <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><FileText className="w-12 h-12"/></div>
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-700">
                                Artículo
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> {new Date(article.publishedAt).toLocaleDateString()}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition line-clamp-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{article.description}</p>
                            <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition">
                                Leer Artículo <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

// --- SINGLE ARTICLE VIEW ---
const ArticleView = ({ slug }: { slug: string }) => {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await api.getPublicArticle(slug);
                setArticle(data);
            } catch (e) {
                console.error("Error fetching article", e);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    if (loading) return <div className="p-20 text-center"><span className="animate-spin">⌛</span> Cargando artículo...</div>;
    if (!article) return <div className="p-20 text-center text-red-500">Artículo no encontrado</div>;

    return (
        <article className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden my-10 border border-gray-100">
            {article.featuredImage && (
                <div className="h-[400px] w-full relative">
                     <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-0 left-0 p-8 text-white">
                        <div className="flex items-center gap-4 text-sm mb-2 opacity-90">
                            <span className="bg-primary px-3 py-1 rounded-full font-bold">Blog</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(article.publishedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 5 min lectura</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight shadow-black drop-shadow-lg">{article.title}</h1>
                     </div>
                </div>
            )}
            
            {!article.featuredImage && (
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{article.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                         <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}

            <div 
                className="prose prose-lg max-w-none p-8 md:p-12 text-gray-800 leading-relaxed font-serif"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
            
            <div className="bg-gray-50 p-8 border-t border-gray-200 text-center">
                <p className="font-bold text-gray-900 mb-2">¿Te gustó este artículo?</p>
                <div className="flex justify-center gap-4">
                    <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"><Facebook className="w-5 h-5"/></button>
                    <button className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition"><Twitter className="w-5 h-5"/></button>
                    <button className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"><MessageCircle className="w-5 h-5"/></button>
                </div>
            </div>
        </article>
    );
};

export const LivePage: React.FC<LivePageProps> = ({ content, isMobilePreview = false, pageId, viewMode = 'home', articleSlug, basePath = '' }) => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Safe default for arrays to prevent map errors
  const navLinks = content.navLinks || [];
  const benefits = content.benefits?.items || [];
  const testimonials = content.testimonials || [];
  const faq = content.faq || [];
  const introItems = content.intro?.items || [];

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const ds = getDesignSystem(content.palette);

  // --- BLOG ROUTING RENDER ---
  if (viewMode === 'blog-list' && pageId) {
      return (
          <div className={`${ds.bg} min-h-screen font-sans`}>
               {/* Simplified Header for Blog */}
               <nav className={`${ds.navStickyBg} sticky top-0 z-50 transition-all duration-300`}>
                  <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                      <a href={basePath || '/'} className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-800">
                          <ArrowLeft className="w-5 h-5" /> Volver al Inicio
                      </a>
                  </div>
               </nav>
               <BlogListView pageId={pageId} basePath={basePath} />
          </div>
      );
  }

  if (viewMode === 'blog-post' && articleSlug) {
      return (
          <div className={`${ds.bg} min-h-screen font-sans`}>
               <nav className={`${ds.navStickyBg} sticky top-0 z-50 transition-all duration-300`}>
                  <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                      <a href={`${basePath}/blog`} className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-800">
                          <ArrowLeft className="w-5 h-5" /> Volver al Blog
                      </a>
                  </div>
               </nav>
               <ArticleView slug={articleSlug} />
          </div>
      );
  }

  // --- STANDARD LANDING PAGE RENDER ---

  const Navbar = () => (
    <nav className={`${ds.navStickyBg} sticky top-0 z-50 transition-all duration-300`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer">
                {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-6 h-6" />) : <div className={`w-8 h-8 rounded-lg ${ds.logoBg} flex items-center justify-center`}>{content.brandName?.charAt(0)}</div>}
                <span className={ds.navStickyText}>{content.brandName}</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link, i) => (
                    <a key={i} href={link.href} className={`text-sm font-medium ${ds.navStickyText} opacity-80 hover:opacity-100 hover:scale-105 transition`}>{link.label}</a>
                ))}
                
                {/* Blog Link if pageId exists */}
                {pageId && (
                    <a href={`${basePath}/blog`} className={`text-sm font-medium ${ds.navStickyText} opacity-80 hover:opacity-100 hover:scale-105 transition flex items-center gap-1`}>
                        <BookOpen className="w-4 h-4" /> Blog
                    </a>
                )}

                <button 
                  onClick={() => document.getElementById('contenedor-boton-cta')?.scrollIntoView({behavior: 'smooth'})}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm transition transform hover:scale-105 ${ds.primaryBtn}`}
                >
                    {content.navCta}
                </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4 shadow-xl">
                 {navLinks.map((link, i) => (
                    <a key={i} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium py-2">{link.label}</a>
                ))}
                {pageId && (
                     <a href={`${basePath}/blog`} className="block text-gray-800 font-medium py-2 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Blog</a>
                )}
                 <button className={`w-full py-3 rounded-lg font-bold ${ds.primaryBtn}`}>{content.navCta}</button>
            </div>
        )}
    </nav>
  );

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 ${ds.bg} text-slate-800 overflow-x-hidden`}>
      <Navbar />

      {/* Hero Section */}
      <header className={`relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden ${ds.heroGradient}`}>
         {/* Background Elements */}
         <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] ${ds.blobColor} mix-blend-screen opacity-30 animate-pulse`} />
             <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] ${ds.blobColor} mix-blend-screen opacity-20`} />
         </div>

         <div className="container mx-auto px-6 relative z-10">
            {/* Top Tagline */}
            {content.topTagline && (
                <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
                         <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse" /> {content.topTagline}
                    </span>
                </div>
            )}

            {/* Main Hero Content */}
            <div className={`text-center max-w-5xl mx-auto mb-12 animate-in zoom-in-95 duration-700 delay-100`}>
                 {renderStyledHeadline(content.hero.headline, isMobilePreview)}
                 
                 <div className={`text-lg md:text-2xl mb-10 leading-relaxed max-w-3xl mx-auto opacity-90 font-light ${ds.heroText}`}>
                      {renderRichText(content.hero.subheadline)}
                 </div>

                 {/* Structure Logic */}
                 {content.structure === 'classic-sales' && (
                     <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                          <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} />
                          {content.hero.videoDuration && (
                             <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${ds.secondaryBtn} backdrop-blur-sm transition hover:bg-white/10`}>
                                 <PlayCircle className="w-5 h-5" />
                                 <span className="font-semibold">{content.hero.videoTitle || "Ver clase"}</span>
                                 <span className="text-xs opacity-70 border-l border-white/30 pl-3 ml-1">{content.hero.videoDuration}</span>
                             </div>
                          )}
                     </div>
                 )}
            </div>

            {/* Visual Asset (Video/Image) */}
            <div className="relative max-w-5xl mx-auto mt-12 group animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r ${ds.iconGradient} opacity-30 blur-lg group-hover:opacity-50 transition duration-500`}></div>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 aspect-video bg-gray-900">
                     {content.hero.heroImage ? (
                        <img src={content.hero.heroImage} alt="Hero" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-gray-900/50 backdrop-blur text-white">
                            <PlayCircle className="w-20 h-20 opacity-80" />
                            <p className="font-medium text-lg">Video de Alta Conversión</p>
                        </div>
                     )}
                     
                     {/* Overlay Stats */}
                     <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                               <Users className="w-3 h-3 text-green-400" /> {content.hero.socialProofCount || "1,200"} viendo ahora
                          </div>
                     </div>
                </div>
            </div>

            {/* VSL Structure Extra CTA */}
            {content.structure === 'vsl-focused' && (
                <div className="mt-12 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 delay-500">
                     <SmartCTA content={content} ds={ds} fullWidth isMobilePreview={isMobilePreview} />
                </div>
            )}
         </div>
         
         {/* Wave Divider */}
         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform translate-y-1">
             <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] ${ds.introBg.replace('bg-', 'fill-')}`}>
                 <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="opacity-50"></path>
                 <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,60.25V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
             </svg>
         </div>
      </header>

      {/* Intro / Problem Agitation */}
      <section className={`${ds.introBg} text-white py-20 relative z-10`}>
           <div className="container mx-auto px-6 max-w-5xl">
               <div className="grid md:grid-cols-2 gap-12 items-center">
                   <div>
                       <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{content.intro.title}</h2>
                       <div className="text-gray-300 space-y-4 leading-relaxed text-lg">
                           {renderRichText(content.intro.description)}
                       </div>
                   </div>
                   <div className="space-y-4">
                       {introItems.map((item, i) => (
                           <div key={i} className="flex gap-4 bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition">
                               <div className={`w-10 h-10 rounded-full ${ds.iconBg} flex items-center justify-center shrink-0`}>
                                   <X className="w-5 h-5" />
                               </div>
                               <div>
                                   <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                   <p className="text-sm text-gray-400">{renderRichText(item.description)}</p>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           </div>
      </section>

      {/* Benefits Section (Cards) */}
      <section id="seccion-beneficios" className={`py-20 md:py-32 ${ds.bg} relative overflow-hidden`}>
          <div className="container mx-auto px-6 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className={`text-sm font-bold uppercase tracking-widest ${ds.accentText}`}>La Solución Definitiva</span>
                  <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-gray-900">{content.benefits.title}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  {benefits.map((benefit, i) => (
                      <div key={i} className={`group p-8 rounded-[2rem] transition duration-300 hover:-translate-y-2 ${ds.cardBg}`}>
                          <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition duration-300 ${benefit.color ? `bg-${benefit.color}-100 text-${benefit.color}-600` : ds.iconBg}`}>
                              {getIcon(benefit.icon, <CheckCircle className="w-7 h-7" />)}
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-gray-800">{benefit.title}</h3>
                          <div className="text-gray-600 leading-relaxed">
                              {renderRichText(benefit.description)}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* What You Will Learn (List) */}
      <section className="py-20 bg-white border-y border-gray-100">
          <div className="container mx-auto px-6 max-w-4xl">
              <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-12 shadow-inner border border-gray-200">
                  <div className="text-center mb-10">
                       <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                           {getIcon(content.whatYouWillLearn.icon, <BookOpen className="w-8 h-8 text-blue-600" />)}
                           {content.whatYouWillLearn.title}
                       </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                      {(content.whatYouWillLearn.items || []).map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                              <span className="text-gray-700 font-medium">{item}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Testimonials */}
      <section id="seccion-testimonios" className={`${ds.testimonialBg} py-24 text-white relative overflow-hidden`}>
           {/* Background Grid */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
           
           <div className="container mx-auto px-6 relative z-10">
               <div className="text-center mb-16">
                   <h2 className="text-3xl md:text-5xl font-bold mb-4">{content.testimonialTitle}</h2>
                   {content.testimonialSubtitle && <p className="text-gray-400 text-lg">{content.testimonialSubtitle}</p>}
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                   {testimonials.map((t, i) => (
                       <div key={i} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300">
                           <div className="flex gap-1 mb-4">
                               {[...Array(5)].map((_, starI) => (
                                   <Star key={starI} className={`w-4 h-4 ${starI < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                               ))}
                           </div>
                           <div className="text-gray-300 mb-6 italic leading-relaxed">"{renderRichText(t.text)}"</div>
                           <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold text-sm">
                                   {t.name.charAt(0)}
                               </div>
                               <div>
                                   <p className="font-bold text-white text-sm">{t.name}</p>
                                   <p className="text-xs text-gray-500">{t.location || 'Alumno Verificado'}</p>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
      </section>

      {/* Instructor / Authority */}
      <section id="seccion-instructor" className={`${ds.mentorBg} py-20 text-white relative`}>
           <div className="container mx-auto px-6 max-w-5xl">
               <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-12">
                   <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${ds.iconGradient} rounded-full blur-2xl opacity-40`}></div>
                        <div className="relative w-full h-full rounded-full border-4 border-white/20 overflow-hidden bg-gray-800">
                             <img src={content.instructor.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"} alt={content.instructor.name} className="w-full h-full object-cover" />
                        </div>
                        {content.instructor.badgeText && (
                            <div className="absolute bottom-2 right-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-300">
                                {content.instructor.badgeText}
                            </div>
                        )}
                   </div>
                   <div className="text-center md:text-left flex-1">
                       <h2 className="text-3xl font-bold mb-2">{content.instructor.name}</h2>
                       <p className={`text-sm font-bold uppercase tracking-widest mb-6 ${ds.accentText}`}>{content.instructor.badgeSubtext || "Experto del Sector"}</p>
                       <div className="text-gray-300 leading-relaxed mb-8">
                           {renderRichText(content.instructor.bio)}
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                           <div>
                               <div className="text-2xl font-bold">{content.instructor.statsStudents || "5,000+"}</div>
                               <div className="text-xs text-gray-400 uppercase">Alumnos</div>
                           </div>
                           <div>
                               <div className="text-2xl font-bold">{content.instructor.statsRating || "4.9/5"}</div>
                               <div className="text-xs text-gray-400 uppercase">Calificación</div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 ${ds.faqBg}`}>
          <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                  {faq.map((item, i) => (
                      <div key={i} className={`rounded-xl border border-gray-200 overflow-hidden ${ds.faqItemBg}`}>
                          <button 
                            onClick={() => toggleAccordion(i)}
                            className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 hover:bg-gray-50 transition"
                          >
                              {item.question}
                              {activeAccordion === i ? <Minus className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-gray-400" />}
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                                  {renderRichText(item.answer)}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className={`py-24 text-center ${ds.heroGradient} relative overflow-hidden`}>
           <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
           <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
                    ¿Listo para transformar tus resultados?
                </h2>
                <div className="flex justify-center">
                    <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} />
                </div>
                {content.hero.spotsLeft && (
                     <p className="mt-6 text-yellow-300 font-bold animate-pulse">{content.hero.spotsLeft}</p>
                )}
           </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
           <div className="container mx-auto px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-6 text-white font-bold text-xl">
                    {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5" />) : <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">{content.brandName?.charAt(0)}</div>}
                    {content.brandName}
                </div>
                
                <div className="flex justify-center gap-6 mb-8">
                     {content.footer.socials?.facebook && <a href={content.footer.socials.facebook} className="hover:text-white transition"><Facebook className="w-5 h-5"/></a>}
                     {content.footer.socials?.instagram && <a href={content.footer.socials.instagram} className="hover:text-white transition"><Instagram className="w-5 h-5"/></a>}
                     {content.footer.socials?.twitter && <a href={content.footer.socials.twitter} className="hover:text-white transition"><Twitter className="w-5 h-5"/></a>}
                </div>

                <p className="mb-4 text-sm opacity-60">{content.footer.copyright}</p>
                <div className="flex justify-center gap-4 text-xs opacity-50">
                    <a href="#" className="hover:underline">Políticas de Privacidad</a>
                    <a href="#" className="hover:underline">Términos de Servicio</a>
                    <a href="#" className="hover:underline">{content.footer.contact}</a>
                </div>
           </div>
      </footer>
    </div>
  );
};