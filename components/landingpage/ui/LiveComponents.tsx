import React, { useEffect, useState } from 'react';
import { GeneratedPageContent, DestinationType } from '../../../types';
import { api } from '../../../services/api';
import { CheckCircle, Star, MessageCircle, ArrowRight, Lock, ShieldCheck, Facebook, Instagram, Twitter, Mail, Anchor, Sparkles, Menu, X, DollarSign, FileText, Briefcase, Award, Users, Loader2, PlayCircle, Globe } from 'lucide-react';
import { getIcon, renderRichText } from '../utils';
import { useNavigate, useLocation } from 'react-router-dom';

// Importamos el Footer unificado
export { Footer } from './Footer';

// --- Hero Media Component (Detección Inteligente) ---
export const HeroMedia = ({ url, poster, ds, className = "" }: { url?: string, poster?: string, ds: any, className?: string }) => {
    const isVideo = url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.match(/\.(mp4|webm|ogg)$/i));

    if (!isVideo) {
        return (
            <img 
                src={poster || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
                alt="Visual" 
                className={`w-full h-full object-cover ${className}`} 
            />
        );
    }

    // YouTube Detection
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0`;
        return (
            <iframe 
                src={embedUrl} 
                className={`w-full h-full ${className}`} 
                title="YouTube Video" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
            />
        );
    }

    // Vimeo Detection
    if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        return (
            <iframe 
                src={embedUrl} 
                className={`w-full h-full ${className}`} 
                title="Vimeo Video" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen 
            />
        );
    }

    // Direct MP4 Detection
    return (
        <video 
            src={url} 
            controls 
            controlsList="nodownload" 
            className={`w-full h-full object-cover bg-black ${className}`}
            poster={poster}
        >
            Tu navegador no soporta el elemento de video.
        </video>
    );
};

// --- Urgency Bar (Sticky) ---
export const UrgencyBar = ({ content, ds }: { content: GeneratedPageContent, ds: any }) => {
    const capture = content.capture || {};
    
    return (
        <div className="fixed top-0 left-0 w-full z-[100] bg-[#FFFF00] py-2 px-4 flex items-center justify-center shadow-2xl">
            <span className="text-black font-['Verdana',_sans-serif] text-[1em] leading-[1rem] tracking-[0] font-bold uppercase text-center">
                {capture.timerLabel || "HOY ÚLTIMO DÍA DE INSCRIPCIONES A LA CLASE GRATUITA"}
            </span>
        </div>
    );
};

// --- Navbar ---
export const Navbar = ({ 
    content, 
    ds, 
    isMobilePreview, 
    pageId, 
    basePath, 
    hasBlogArticles, 
    isThankYouPage = false,
    hasUrgencyBar = false,
    forcePrimaryLinks = false
}: { 
    content: GeneratedPageContent, 
    ds: any, 
    isMobilePreview: boolean, 
    pageId?: string, 
    basePath?: string, 
    hasBlogArticles: boolean,
    isThankYouPage?: boolean,
    hasUrgencyBar?: boolean,
    forcePrimaryLinks?: boolean
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

    // Navbar Logic
    const currentTextColor = isScrolled ? ds.nav.stickyText : ds.nav.transparentText;
    const currentBg = isScrolled ? `${ds.nav.stickyBg} ${ds.nav.stickyBorder} border-b` : `${ds.nav.transparentBg} border-b border-white/5`;

    // Menú establecido como valor establecido (Fijo)
    const navLinks = [
        { label: 'Descubre', href: '#introduccion' },
        { label: 'Beneficios', href: '#beneficios' },
        { label: 'Testimonios', href: '#testimonios' },
        { label: 'Experto', href: '#instructor' }
    ];

    if (hasBlogArticles) {
        const blogUrl = basePath !== undefined ? (basePath === '' ? '/blog' : `${basePath}/blog`) : '#';
        navLinks.push({ label: 'Blog', href: blogUrl });
    }

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('preview-viewport');
            const scrollY = container ? container.scrollTop : window.scrollY;
            setIsScrolled(scrollY > 20);
        };
        const container = document.getElementById('preview-viewport');
        if (container) container.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);
        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Helper: Check if we are on the landing page root
    const isOnLandingRoot = () => {
        const path = location.pathname.endsWith('/') && location.pathname.length > 1 
            ? location.pathname.slice(0, -1) 
            : location.pathname;
        const base = basePath ? (basePath.endsWith('/') ? basePath.slice(0, -1) : basePath) : '';
        if (!base) return path === '/' || path === '';
        return path === base;
    };

    // Helper: Resolve Link URL
    const resolveLink = (href: string) => {
        if (href.startsWith('#')) {
            if (isOnLandingRoot()) return href;
            // If on subpage, prepend base path to go to root + anchor
            const root = basePath || '';
            return `${root === '/' ? '' : root}/${href.replace(/^#/, '#')}`; 
        }
        return href;
    };

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            // Only prevent default and scroll if we are ALREADY on the root page
            if (isOnLandingRoot()) {
                e.preventDefault();
                const targetId = href.substring(1);
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setIsMenuOpen(false);
            }
            // If not on root, let browser handle navigation to the absolute path returned by resolveLink
        }
    };

    const renderBrandName = (text: string) => {
         const htmlContent = text.replace(
           /<b>(.*?)<\/b>/g, 
           `<span class="font-extrabold opacity-90">$1</span>`
         );
         return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    return (
      <>
      <nav 
        id="barra-navegacion"
        className={`w-full z-50 transition-all duration-300 ${currentBg} ${isScrolled ? 'fixed top-0 left-0' : 'absolute top-0 left-0'} ${hasUrgencyBar ? 'pt-[3em]' : ''}`}
      >
          <div className={`w-full max-w-[75em] mx-auto px-6 py-4 flex ${isThankYouPage ? 'justify-center' : 'justify-between'} items-center relative gap-4`}>
            <a href={basePath || '/'} id="nav-brand-container" className={`flex items-center gap-2 md:gap-3 font-bold tracking-tight transition-colors duration-300 ${currentTextColor} ${isThankYouPage ? 'flex-none' : 'flex-1 min-w-0 mr-2'} hover:opacity-80`}>
              <div id="nav-logo-icon" className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0 ${ds.nav.logoBg} ${ds.nav.logoText}`}>
                 {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5" />) : (
                    content.logoSvg ? <div className="w-5 h-5 md:w-6 md:h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-4 h-4 md:w-5 md:h-5" /> 
                 )}
              </div>
              <span id="nav-brand-text" className="truncate text-sm sm:text-lg leading-tight">
                {renderBrandName(content.brandName || "Brand")}
              </span>
            </a>
            
            {!isThankYouPage && (
                <>
                    <div id="nav-links-desktop" className={`${isMobilePreview ? 'hidden' : 'hidden md:flex'} gap-8 text-[1.05rem] leading-[1.25rem] font-medium transition-colors duration-300 ${forcePrimaryLinks ? 'text-primary' : currentTextColor} opacity-90 flex-shrink-0`}>
                    {navLinks.map((link, i) => (
                        <a 
                            key={i} 
                            id={`nav-link-${i}`} 
                            href={resolveLink(link.href)} 
                            onClick={(e) => handleSmoothScroll(e, link.href)}
                            className={`hover:opacity-100 transition hover:${ds.nav.linkHover}`}
                        >
                            {link.label}
                        </a>
                    ))}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                        id="nav-cta-btn" 
                        onClick={() => setShowModal(true)}
                        className={`${isMobilePreview ? 'hidden' : 'hidden md:block'} px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition shadow-sm hover:scale-105 hover:shadow-lg ${ds.nav.ctaButton}`}
                        >
                        {content.navCta || "Regístrate"}
                        </button>

                        <button 
                            id="nav-mobile-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`${isMobilePreview ? 'flex' : 'md:hidden flex'} items-center justify-center p-2 rounded-lg transition-colors ${currentTextColor} hover:bg-black/5`}
                        >
                            {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                        </button>
                    </div>
                </>
            )}
          </div>

          {!isThankYouPage && isMenuOpen && (
              <div id="nav-mobile-menu" className={`${isMobilePreview ? 'flex' : 'md:hidden flex'} absolute top-full left-0 w-full ${ds.nav.mobileMenuBg} ${ds.nav.mobileMenuBorder} border-b shadow-xl p-6 flex-col gap-4 animate-in slide-in-from-top-2 z-40`}>
                  {navLinks.map((link, i) => (
                      <a 
                        key={i} 
                        id={`mobile-nav-link-${i}`} 
                        href={resolveLink(link.href)} 
                        onClick={(e) => handleSmoothScroll(e, link.href)}
                        className={`text-lg font-medium py-3 border-b border-gray-100/10 last:border-0 hover:pl-2 transition-all ${ds.nav.mobileMenuText}`}
                      >
                        {link.label}
                      </a>
                  ))}
                  <div className="pt-4 mt-2 border-t border-gray-100/10 w-full">
                     <button id="mobile-nav-cta" onClick={() => { setShowModal(true); setIsMenuOpen(false); }} className={`w-full py-3 rounded-xl font-bold text-center ${ds.nav.ctaButton}`}>
                        {content.navCta || "Regístrate"}
                     </button>
                  </div>
              </div>
          )}
      </nav>
      {!isThankYouPage && showModal && <RegistrationModal content={content} ds={ds} onClose={() => setShowModal(false)} pageId={pageId} basePath={basePath} />}
      </>
    );
};

// --- Lead Capture Form ---
const LeadCaptureForm = ({ btnClass, btnText, ds, pageId, basePath }: { btnClass: string, btnText: string, ds: any, pageId?: string, basePath?: string }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async () => {
        if (!pageId) {
            alert("Modo Vista Previa: No se puede enviar datos sin un ID de página activo.");
            return;
        }
        if (!name || !email) {
            alert("Por favor completa todos los campos.");
            return;
        }

        setSubmitting(true);
        try {
            await api.submitLead({ pageId, name, email });
            // Redirect to Thank You Page (Updated to /gracias)
            // Use provided basePath for absolute-like redirect from any subpath (like blog posts)
            let redirectBase = basePath;
            
            if (!redirectBase) {
                const currentPath = location.pathname;
                redirectBase = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
            } else {
                // Ensure redirectBase doesn't end with slash
                if (redirectBase.endsWith('/')) redirectBase = redirectBase.slice(0, -1);
            }
            
            navigate(`${redirectBase}/gracias`);
        } catch (error) {
            console.error("Error submitting lead:", error);
            alert("Hubo un error al registrar tus datos. Intenta nuevamente.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div id="lead-capture-form" className="space-y-4 relative z-10">
            <div className="relative">
                <div className={`absolute top-3.5 left-3 w-5 h-5 ${ds.cta.inputIconColor}`}><Users className="w-5 h-5" /></div>
                <input 
                    id="input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu Nombre Completo" 
                    className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition text-base ${ds.cta.inputBg} ${ds.cta.inputBorder} border ${ds.cta.inputText} ${ds.cta.inputPlaceholder} ${ds.cta.inputRing} focus:ring-2`} 
                />
            </div>
            <div className="relative">
                <div className={`absolute top-3.5 left-3 w-5 h-5 ${ds.cta.inputIconColor}`}><Mail className="w-5 h-5" /></div>
                <input 
                    id="input-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu Correo Principal" 
                    className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition text-base ${ds.cta.inputBg} ${ds.cta.inputBorder} border ${ds.cta.inputText} ${ds.cta.inputPlaceholder} ${ds.cta.inputRing} focus:ring-2`} 
                />
            </div>
            <button 
                id="form-submit-btn" 
                onClick={handleSubmit}
                disabled={submitting}
                className={`w-full py-4 rounded-lg font-bold text-lg transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${btnClass} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : btnText}
            </button>
        </div>
    );
};

// --- Registration Modal ---
export const RegistrationModal = ({ content, ds, onClose, pageId, basePath }: { content: GeneratedPageContent, ds: any, onClose: () => void, pageId?: string, basePath?: string }) => {
    return (
        <div 
            id="registration-modal" 
            onClick={() => onClose()}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`relative p-8 rounded-2xl border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 ${ds.cta.containerBg} ${ds.cta.containerBorder}`}
            >
                <button onClick={onClose} className={`absolute top-4 right-4 transition ${ds.cta.cardTextColor} hover:opacity-70`}><X className="w-6 h-6" /></button>
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${ds.badges.spotsBg} ${ds.badges.spotsText} text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border ${ds.badges.spotsBorder}`}>
                    {content.hero.spotsLeft || "¡Cupos Limitados!"}
                </div>
                <div className="text-center mb-6">
                    <h3 id="modal-title" className={`text-2xl font-bold mb-2 ${ds.cta.cardTitleColor}`}>Reserva tu Cupo</h3>
                    <p id="modal-desc" className={`text-sm ${ds.cta.cardTextColor}`}>Completa el formulario para acceder ahora.</p>
                </div>
                <LeadCaptureForm btnClass={ds.buttons.primary} btnText={content.hero.ctaText} ds={ds} pageId={pageId} basePath={basePath} />
                <div className={`mt-4 flex items-center justify-center gap-2 text-xs ${ds.cta.cardTextColor}`}>
                    <Lock className="w-3 h-3" /> Datos seguros y encriptados.
                </div>
            </div>
        </div>
    );
};

// --- Smart CTA ---
export const SmartCTA = ({ content, ds, isMobilePreview, fullWidth = false, centered = false, pageId, basePath }: { content: GeneratedPageContent, ds: any, isMobilePreview: boolean, fullWidth?: boolean, centered?: boolean, pageId?: string, basePath?: string }) => {
    const dest = content.destination;
    const capture = content.capture || {};
    
    const handleClick = () => {
        if (dest.type === 'whatsapp') {
            const msg = encodeURIComponent(dest.whatsappMessage || 'Hola');
            window.open(`https://wa.me/${dest.whatsappPhone}?text=${msg}`, '_blank');
        } else if (dest.type === 'external_url') {
            window.open(dest.url, '_blank');
        }
    };

    // Determine titles and descriptions based on destination type with custom overrides
    let cardTitle = capture.cardTitle || "Reserva tu lugar GRATIS";
    let cardDesc = capture.cardDesc || "Accede al método exclusivo.";
    let helpText = capture.helpText || "";
    
    if (!capture.cardTitle) {
        if (dest.type === 'whatsapp') {
            cardTitle = "Únete al Grupo VIP";
        } else if (dest.type === 'external_url') {
            cardTitle = "Acceso Inmediato";
        }
    }

    if (!capture.cardDesc) {
        if (dest.type === 'whatsapp') {
            cardDesc = "Recibe atención personalizada al instante.";
        } else if (dest.type === 'external_url') {
            cardDesc = "No esperes más para comenzar.";
        }
    }

    if (!capture.helpText) {
        if (dest.type === 'whatsapp') {
            helpText = "Haz clic para chatear con nosotros";
        } else if (dest.type === 'external_url') {
            helpText = "Haz clic para ver la oferta completa";
        }
    }

    const guaranteeText = capture.guaranteeText || (dest.type === 'form' ? "Tus datos están 100% seguros. No hacemos spam." : "Garantía de satisfacción oficial.");

    return (
      <div className={`${centered ? 'mx-auto max-w-md' : 'w-full'}`}>
        <div id="smart-cta-container" className={`rounded-3xl shadow-2xl border relative ${ds.cta.containerBg} ${ds.cta.containerBorder} ${isMobilePreview ? 'p-6' : 'p-6 md:p-10'}`}>
            
            {/* Badge de Cupos Estilo Robusto y Animado (Pulse) */}
            <div id="smart-cta-badge" className={`absolute -top-5 right-6 text-sm md:text-base font-black px-8 py-2.5 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.3)] z-20 border-2 animate-pulse transition-transform hover:scale-105 ${ds.badges.spotsBg} ${ds.badges.spotsText} ${ds.badges.spotsBorder}`}>
                {content.hero.spotsLeft || "¡Cupos Limitados!"}
            </div>

            {/* Header */}
            <h3 id="smart-cta-title" className={`font-black mb-2 text-center leading-tight ${ds.cta.cardTitleColor} ${isMobilePreview ? 'text-2xl' : 'text-2xl md:text-3xl'}`}>
                {cardTitle}
            </h3>
            <p id="smart-cta-desc" className={`text-center mb-8 text-[1.2rem] leading-[1.6rem] text-black`}>
                {cardDesc}
            </p>

            {/* Body Content */}
            {dest.type === 'form' ? (
                <LeadCaptureForm btnClass={ds.buttons.primary} btnText={content.hero.ctaText} ds={ds} pageId={pageId} basePath={basePath} />
            ) : (
                <div className="space-y-4">
                    {/* Motivational visual cue for non-form */}
                    <div className={`text-center text-sm font-medium ${ds.cta.cardTextColor} opacity-80 flex flex-col items-center gap-2 mb-4`}>
                        <span className="animate-bounce text-xl">👇</span>
                        <span>{helpText}</span>
                    </div>
                    
                    <button 
                      id="smart-cta-btn"
                      onClick={handleClick}
                      className={`w-full py-5 rounded-2xl font-black text-xl transition transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 ${ds.buttons.primary}`}
                    >
                        {dest.type === 'whatsapp' && <MessageCircle className="w-6 h-6" />}
                        {content.hero.ctaText}
                        {dest.type === 'external_url' && <ArrowRight className="w-6 h-6" />}
                    </button>
                </div>
            )}

            {/* Footer / Guarantee */}
            <div className={`mt-8 flex items-center justify-center gap-2 text-xs text-center font-medium ${ds.cta.cardTextColor}`}>
                {dest.type === 'form' ? <Lock className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" /> : <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />}
                {guaranteeText}
            </div>
        </div>

        {/* Social Proof */}
        <div className="mt-8 flex items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex -space-x-4">
                {[1,2,3].map(i => <img key={i} src={`https://randomuser.me/api/portraits/thumb/women/${i+20}.jpg`} alt="User" className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-xl" />)}
            </div>
            <div className="text-left">
                <div id="smart-cta-social-proof" className="flex items-center gap-2 font-black text-2xl text-white">
                        <CheckCircle className={`w-6 h-6 ${ds.decorations.checkColor} fill-current`} /> {content.hero.socialProofCount || "2,458+"}
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none mt-1">{capture.socialProofLabel || "Alumnos registrados"}</p>
            </div>
        </div>
      </div>
    );
};

// --- Feature Card ---
export const FeatureCard: React.FC<{ item: any, idx: number, ds: any, content: GeneratedPageContent }> = ({ item, idx, ds, content }) => {
    // Dynamic icon colors override if needed, otherwise use DS defaults
    const IconComponent = getIcon(item.icon, idx === 0 ? <DollarSign className="w-10 h-10" /> : idx === 1 ? <FileText className="w-10 h-10" /> : idx === 2 ? <Briefcase className="w-10 h-10" /> : <Award className="w-10 h-10" />);

    // Map item.color string to Tailwind class safely
    const colorMap: Record<string, string> = {
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        green: 'text-green-600',
        orange: 'text-orange-600',
        red: 'text-red-600',
        teal: 'text-teal-600',
        yellow: 'text-yellow-500',
        indigo: 'text-indigo-600',
        pink: 'text-pink-600'
    };

    const iconColorClass = (item.color && colorMap[item.color]) ? colorMap[item.color] : ds.features.iconColor;

    return (
        <div id={`feature-card-${idx}`} className={`p-10 rounded-[2.5rem] bg-gradient-to-b from-white to-gray-50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center ${ds.features.cardBorder} ${ds.features.cardShadow} border`}>
            <div id={`feature-icon-${idx}`} className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 p-4 ${ds.features.iconContainer}`}>
                <div className={`w-full h-full ${iconColorClass}`}>{IconComponent}</div>
            </div>
            <h3 id={`feature-title-${idx}`} className={`text-2xl font-black mb-4 ${ds.features.titleColor}`}>{item.title}</h3>
            {renderRichText(item.description || item.desc || "", `text-lg leading-relaxed font-medium ${ds.features.descColor}`)}
        </div>
    );
};