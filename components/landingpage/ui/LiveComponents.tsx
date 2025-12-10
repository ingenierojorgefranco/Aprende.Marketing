
import React, { useEffect, useState } from 'react';
import { GeneratedPageContent, DestinationType } from '../../../types';
import { api } from '../../../services/api';
import { CheckCircle, Star, MessageCircle, ArrowRight, Lock, ShieldCheck, Facebook, Instagram, Twitter, Mail, Anchor, Sparkles, Menu, X, DollarSign, FileText, Briefcase, Award, Users } from 'lucide-react';
import { getIcon, renderRichText } from '../utils';

// --- Navbar ---
export const Navbar = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }: { content: GeneratedPageContent, ds: any, isMobilePreview: boolean, pageId?: string, basePath?: string, hasBlogArticles: boolean }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Navbar Logic
    // Use ds.nav.transparentText for initial state, and ds.nav.stickyText for scrolled state.
    const currentTextColor = isScrolled ? ds.nav.stickyText : ds.nav.transparentText;
    const currentBg = isScrolled ? `${ds.nav.stickyBg} ${ds.nav.stickyBorder} border-b` : 'bg-transparent border-b border-white/5';

    let navLinks = [...(content.navLinks || [])];
    if (!content.navLinks || content.navLinks.length === 0) {
        navLinks = [
            { label: 'Descubre', href: '#seccion-introduccion' },
            { label: 'Beneficios', href: '#seccion-beneficios' },
            { label: 'Experto', href: '#seccion-instructor' }
        ];
    }

    if (hasBlogArticles) {
        const blogUrl = basePath ? (basePath === '' ? '/blog' : `${basePath}/blog`) : '#';
        if (!navLinks.some(link => link.label.toLowerCase() === 'blog')) {
            navLinks.push({ label: 'Blog', href: blogUrl });
        }
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

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setIsMenuOpen(false);
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
        className={`w-full z-50 transition-all duration-300 ${currentBg} ${isScrolled ? 'fixed top-0 left-0' : 'absolute top-0 left-0'}`}
      >
          <div className="w-full max-w-[75em] mx-auto px-6 py-4 flex justify-between items-center relative gap-4">
            <a href={basePath || '/'} id="nav-brand-container" className={`flex items-center gap-2 md:gap-3 font-bold tracking-tight transition-colors duration-300 ${currentTextColor} flex-1 min-w-0 mr-2 hover:opacity-80`}>
              <div id="nav-logo-icon" className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0 ${ds.nav.logoBg} ${ds.nav.logoText}`}>
                 {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5" />) : (
                    content.logoSvg ? <div className="w-5 h-5 md:w-6 md:h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-4 h-4 md:w-5 md:h-5" /> 
                 )}
              </div>
              <span id="nav-brand-text" className="truncate text-sm sm:text-lg leading-tight">
                {renderBrandName(content.brandName || "Brand")}
              </span>
            </a>
            
            <div id="nav-links-desktop" className={`${isMobilePreview ? 'hidden' : 'hidden md:flex'} gap-8 text-sm font-medium transition-colors duration-300 ${currentTextColor} opacity-90 flex-shrink-0`}>
              {navLinks.map((link, i) => (
                  <a 
                    key={i} 
                    id={`nav-link-${i}`} 
                    href={link.href} 
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
          </div>

          {isMenuOpen && (
              <div id="nav-mobile-menu" className={`${isMobilePreview ? 'flex' : 'md:hidden flex'} absolute top-full left-0 w-full ${ds.nav.mobileMenuBg} ${ds.nav.mobileMenuBorder} border-b shadow-xl p-6 flex-col gap-4 animate-in slide-in-from-top-2 z-40`}>
                  {navLinks.map((link, i) => (
                      <a 
                        key={i} 
                        id={`mobile-nav-link-${i}`} 
                        href={link.href} 
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
      {showModal && <RegistrationModal content={content} ds={ds} onClose={() => setShowModal(false)} />}
      </>
    );
};

// --- Footer ---
export const Footer = ({ content, ds, isMobilePreview }: { content: GeneratedPageContent, ds: any, isMobilePreview: boolean }) => {
    const { socials } = content.footer;

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <footer id="footer-section" className={`${ds.footer.bg} ${ds.footer.borderTop} border-t py-16`}>
            <div className="w-full max-w-[75em] mx-auto px-6">
                <div className={`grid gap-12 mb-12 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-4'}`}>
                    <div className={`${isMobilePreview ? '' : 'col-span-2'}`}>
                    <div id="footer-logo-container" className="flex items-center gap-2 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${ds.nav.logoBg} ${ds.nav.logoText}`}>
                             {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5"/>) : (
                                content.logoSvg ? <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-5 h-5"/>
                             )}
                        </div>
                        <h4 id="footer-brand-name" className={`text-2xl font-bold ${ds.footer.titleColor}`} dangerouslySetInnerHTML={{__html: content.brandName || "PlataformaDeVenta.com"}}></h4>
                    </div>
                    <p id="footer-copyright-text" className={`${ds.footer.textColor} max-w-xs leading-relaxed`}>{content.footer.copyright}</p>
                    <div id="footer-socials" className="flex gap-4 mt-6">
                        {socials?.facebook && <a href={socials.facebook} id="footer-social-fb" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${ds.footer.socialBg} ${ds.footer.socialIcon} hover:${ds.footer.socialHoverBg} hover:${ds.footer.socialHoverIcon}`}><Facebook className="w-5 h-5" /></a>}
                        {socials?.instagram && <a href={socials.instagram} id="footer-social-ig" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${ds.footer.socialBg} ${ds.footer.socialIcon} hover:${ds.footer.socialHoverBg} hover:${ds.footer.socialHoverIcon}`}><Instagram className="w-5 h-5" /></a>}
                        {socials?.twitter && <a href={socials.twitter} id="footer-social-tw" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${ds.footer.socialBg} ${ds.footer.socialIcon} hover:${ds.footer.socialHoverBg} hover:${ds.footer.socialHoverIcon}`}><Twitter className="w-5 h-5" /></a>}
                    </div>
                    </div>
                    <div>
                        <h5 className={`font-bold mb-4 text-lg ${ds.footer.titleColor}`}>Enlaces</h5>
                        <ul id="footer-links-list" className={`space-y-3 ${ds.footer.textColor}`}>
                            {content.navLinks ? content.navLinks.map((link, i) => (
                                <li key={i}>
                                    <a 
                                        href={link.href} 
                                        onClick={(e) => handleSmoothScroll(e, link.href)}
                                        className={`transition hover:${ds.footer.linkHover}`}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            )) : (
                                <>
                                    <li><a href="#seccion-introduccion" onClick={(e) => handleSmoothScroll(e, "#seccion-introduccion")} className={`transition hover:${ds.footer.linkHover}`}>Qué es</a></li>
                                    <li><a href="#seccion-beneficios" onClick={(e) => handleSmoothScroll(e, "#seccion-beneficios")} className={`transition hover:${ds.footer.linkHover}`}>Beneficios</a></li>
                                    <li><a href="#seccion-instructor" onClick={(e) => handleSmoothScroll(e, "#seccion-instructor")} className={`transition hover:${ds.footer.linkHover}`}>Instructor</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div>
                        <h5 className={`font-bold mb-4 text-lg ${ds.footer.titleColor}`}>Contacto</h5>
                        <ul id="footer-contact-list" className={`space-y-3 ${ds.footer.textColor}`}>
                            <li className="flex items-center gap-2"><Mail className="w-4 h-4"/> {content.footer.contact || 'info@empresa.com'}</li>
                            <li><a href="#" className={`transition hover:${ds.footer.linkHover}`}>Política de Privacidad</a></li>
                            <li><a href="#" className={`transition hover:${ds.footer.linkHover}`}>Términos de Uso</a></li>
                        </ul>
                    </div>
                </div>
                <div id="footer-bottom-bar" className={`border-t ${ds.footer.borderTop} pt-8 text-center ${ds.footer.copyrightColor} text-sm`}>
                    &copy; {new Date().getFullYear()} Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}

// --- Lead Capture Form ---
const LeadCaptureForm = ({ btnClass, btnText, ds }: { btnClass: string, btnText: string, ds: any }) => (
    <div id="lead-capture-form" className="space-y-4 relative z-10">
        <div className="relative">
            <div className={`absolute top-3.5 left-3 w-5 h-5 ${ds.cta.inputIconColor}`}><Users className="w-5 h-5" /></div>
            <input 
                id="input-name"
                placeholder="Tu Nombre Completo" 
                className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition text-base ${ds.cta.inputBg} ${ds.cta.inputBorder} border ${ds.cta.inputText} ${ds.cta.inputPlaceholder} ${ds.cta.inputRing} focus:ring-2`} 
            />
        </div>
        <div className="relative">
            <div className={`absolute top-3.5 left-3 w-5 h-5 ${ds.cta.inputIconColor}`}><Mail className="w-5 h-5" /></div>
            <input 
                id="input-email"
                placeholder="Tu Correo Principal" 
                className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition text-base ${ds.cta.inputBg} ${ds.cta.inputBorder} border ${ds.cta.inputText} ${ds.cta.inputPlaceholder} ${ds.cta.inputRing} focus:ring-2`} 
            />
        </div>
        <button id="form-submit-btn" className={`w-full py-4 rounded-lg font-bold text-lg transition transform hover:scale-[1.02] active:scale-[0.98] ${btnClass}`}>
            {btnText}
        </button>
    </div>
);

// --- Registration Modal ---
export const RegistrationModal = ({ content, ds, onClose }: { content: GeneratedPageContent, ds: any, onClose: () => void }) => {
    return (
        <div id="registration-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative p-8 rounded-2xl border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 ${ds.cta.containerBg} ${ds.cta.containerBorder}`}>
                <button onClick={onClose} className={`absolute top-4 right-4 transition ${ds.cta.cardTextColor} hover:opacity-70`}><X className="w-6 h-6" /></button>
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${ds.badges.spotsBg} ${ds.badges.spotsText} text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border ${ds.badges.spotsBorder}`}>
                    {content.hero.spotsLeft || "¡Cupos Limitados!"}
                </div>
                <div className="text-center mb-6">
                    <h3 id="modal-title" className={`text-2xl font-bold mb-2 ${ds.cta.cardTitleColor}`}>Reserva tu Cupo</h3>
                    <p id="modal-desc" className={`text-sm ${ds.cta.cardTextColor}`}>Completa el formulario para acceder ahora.</p>
                </div>
                <LeadCaptureForm btnClass={ds.buttons.primary} btnText={content.navCta || "Ingresar Ahora"} ds={ds} />
                <div className={`mt-4 flex items-center justify-center gap-2 text-xs ${ds.cta.cardTextColor}`}>
                    <Lock className="w-3 h-3" /> Datos seguros y encriptados.
                </div>
            </div>
        </div>
    );
};

// --- Smart CTA ---
export const SmartCTA = ({ content, ds, isMobilePreview, fullWidth = false, centered = false }: { content: GeneratedPageContent, ds: any, isMobilePreview: boolean, fullWidth?: boolean, centered?: boolean }) => {
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
          <div id="smart-cta-form-container" className={`rounded-2xl shadow-2xl border relative ${ds.cta.containerBg} ${ds.cta.containerBorder} ${centered ? 'mx-auto max-w-md' : 'w-full'} ${isMobilePreview ? 'p-5' : 'p-5 md:p-8'}`}>
              <div id="smart-cta-badge" className={`absolute -top-3.5 right-4 md:right-6 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20 border ${ds.badges.spotsBg} ${ds.badges.spotsText} ${ds.badges.spotsBorder}`}>
                  {content.hero.spotsLeft || "¡Cupos Limitados!"}
              </div>
              <h3 id="smart-cta-title" className={`font-bold mb-2 text-center ${ds.cta.cardTitleColor} ${isMobilePreview ? 'text-xl' : 'text-xl md:text-2xl'}`}>Reserva tu lugar GRATIS</h3>
              <p id="smart-cta-desc" className={`text-center mb-6 text-sm ${ds.cta.cardTextColor}`}>Accede al método exclusivo.</p>
              <LeadCaptureForm btnClass={ds.buttons.primary} btnText={content.hero.ctaText} ds={ds} />
              <div className={`mt-4 flex items-center justify-center gap-2 text-xs text-center mb-6 ${ds.cta.cardTextColor}`}>
                  <Lock className="w-3 h-3 flex-shrink-0" /> Tus datos están 100% seguros. No hacemos spam.
              </div>
              <div className={`pt-6 border-t flex items-center justify-between ${ds.cta.containerBorder}`}>
                  <div className="flex -space-x-3">
                      {[1,2,3].map(i => <img key={i} src={`https://randomuser.me/api/portraits/thumb/women/${i+20}.jpg`} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />)}
                  </div>
                  <div className="text-right">
                      <div id="smart-cta-social-proof" className={`flex items-center justify-end gap-1 font-bold text-lg ${ds.cta.cardTitleColor}`}>
                           <CheckCircle className={`w-4 h-4 ${ds.decorations.checkColor}`} /> {content.hero.socialProofCount || "2,458+"}
                      </div>
                      <p className={`text-xs ${ds.cta.cardTextColor}`}>Alumnos registrados</p>
                  </div>
              </div>
          </div>
        );
    }

    return (
        <div id="smart-cta-button-container" className={`${centered ? 'text-center' : ''}`}>
            <button 
              id="smart-cta-btn"
              onClick={handleClick}
              className={`group relative overflow-hidden ${fullWidth ? 'w-full' : 'w-auto px-10'} py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${ds.buttons.primary}`}
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {dest.type === 'whatsapp' && <MessageCircle className="w-5 h-5" />}
                  {content.hero.ctaText}
                  {dest.type === 'external_url' && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
            </button>
            <p id="smart-cta-guarantee" className={`mt-4 text-sm opacity-70 ${ds.cta.subtitleColor}`}>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Garantía de satisfacción</span>
            </p>
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
        <div id={`feature-card-${idx}`} className={`p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-start ${ds.features.cardBg} ${ds.features.cardBorder} ${ds.features.cardShadow} border`}>
            <div id={`feature-icon-${idx}`} className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 p-4 ${ds.features.iconContainer}`}>
                <div className={`w-full h-full ${iconColorClass}`}>{IconComponent}</div>
            </div>
            <h3 id={`feature-title-${idx}`} className={`text-xl font-bold mb-3 ${ds.features.titleColor}`}>{item.title}</h3>
            {renderRichText(item.description, `leading-relaxed ${ds.features.descColor}`)}
        </div>
    );
};
