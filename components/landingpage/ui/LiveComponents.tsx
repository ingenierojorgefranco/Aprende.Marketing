
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

    // Navbar Logic: use 'nav' config from DS
    // If not scrolled, use Transparent BG + Hero Text Color (usually white or dark depending on hero)
    // If scrolled, use Sticky properties
    
    // We assume hero text color for transparent state comes from ds.hero.titleColor mostly, or explicit override if needed.
    // However, the previous logic had complex palette checks. Let's simplify using DS.
    const transparentTextColor = ds.hero.titleColor.includes('text-white') ? 'text-white' : 'text-gray-900';
    const currentTextColor = isScrolled ? ds.nav.stickyText : transparentTextColor;
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
            <a href={basePath || '/'} id="logo-marca" className={`flex items-center gap-2 md:gap-3 font-bold tracking-tight transition-colors duration-300 ${currentTextColor} flex-1 min-w-0 mr-2 hover:opacity-80`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0 ${ds.nav.logoBg}`}>
                 {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5" />) : (
                    content.logoSvg ? <div className="w-5 h-5 md:w-6 md:h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-4 h-4 md:w-5 md:h-5 text-current" /> 
                 )}
              </div>
              <span className="truncate text-sm sm:text-lg leading-tight">
                {renderBrandName(content.brandName || "Brand")}
              </span>
            </a>
            
            <div id="enlaces-navegacion" className={`${isMobilePreview ? 'hidden' : 'hidden md:flex'} gap-8 text-sm font-medium transition-colors duration-300 ${currentTextColor} opacity-90 flex-shrink-0`}>
              {navLinks.map((link, i) => (
                  <a key={i} href={link.href} className={`hover:opacity-100 transition hover:${ds.nav.linkHover}`}>{link.label}</a>
              ))}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                id="cta-navbar" 
                onClick={() => setShowModal(true)}
                className={`${isMobilePreview ? 'hidden' : 'hidden md:block'} px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition shadow-sm hover:scale-105 hover:shadow-lg ${ds.buttons.primary}`}
                >
                {content.navCta || "Regístrate"}
                </button>

                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`${isMobilePreview ? 'flex' : 'md:hidden flex'} items-center justify-center p-2 rounded-lg transition-colors ${currentTextColor} hover:bg-black/5`}
                >
                    {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                </button>
            </div>
          </div>

          {isMenuOpen && (
              <div className={`${isMobilePreview ? 'flex' : 'md:hidden flex'} absolute top-full left-0 w-full ${ds.nav.mobileMenuBg} shadow-xl p-6 flex-col gap-4 animate-in slide-in-from-top-2 z-40`}>
                  {navLinks.map((link, i) => (
                      <a key={i} href={link.href} onClick={() => setIsMenuOpen(false)} className={`text-lg font-medium py-3 border-b border-gray-100/10 last:border-0 hover:pl-2 transition-all ${ds.nav.stickyText}`}>{link.label}</a>
                  ))}
                  <div className="pt-4 mt-2 border-t border-gray-100/10 w-full">
                     <button onClick={() => { setShowModal(true); setIsMenuOpen(false); }} className={`w-full py-3 rounded-xl font-bold text-center ${ds.buttons.primary}`}>
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
    return (
        <footer id="pie-de-pagina" className={`${ds.footer.bg} ${ds.footer.borderTop} border-t py-16`}>
            <div className="w-full max-w-[75em] mx-auto px-6">
                <div className={`grid gap-12 mb-12 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-4'}`}>
                    <div className={`${isMobilePreview ? '' : 'col-span-2'}`}>
                    <div id="footer-logo" className="flex items-center gap-2 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${ds.nav.logoBg}`}>
                             {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5"/>) : (
                                content.logoSvg ? <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-5 h-5"/>
                             )}
                        </div>
                        <h4 className={`text-2xl font-bold ${ds.footer.titleColor}`} dangerouslySetInnerHTML={{__html: content.brandName || "PlataformaDeVenta.com"}}></h4>
                    </div>
                    <p className={`${ds.footer.textColor} max-w-xs leading-relaxed`}>{content.footer.copyright}</p>
                    <div id="redes-sociales" className="flex gap-4 mt-6">
                        {socials?.facebook && <a href={socials.facebook} className={`w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition ${ds.footer.socialBg} ${ds.footer.socialIcon}`}><Facebook className="w-5 h-5" /></a>}
                        {socials?.instagram && <a href={socials.instagram} className={`w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition ${ds.footer.socialBg} ${ds.footer.socialIcon}`}><Instagram className="w-5 h-5" /></a>}
                        {socials?.twitter && <a href={socials.twitter} className={`w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition ${ds.footer.socialBg} ${ds.footer.socialIcon}`}><Twitter className="w-5 h-5" /></a>}
                    </div>
                    </div>
                    <div>
                        <h5 className={`font-bold mb-4 text-lg ${ds.footer.titleColor}`}>Enlaces</h5>
                        <ul className={`space-y-3 ${ds.footer.textColor}`}>
                            {content.navLinks ? content.navLinks.map((link, i) => (
                                <li key={i}><a href={link.href} className="hover:opacity-100 hover:text-current transition">{link.label}</a></li>
                            )) : (
                                <>
                                    <li><a href="#seccion-introduccion" className="hover:opacity-100 hover:text-current transition">Qué es</a></li>
                                    <li><a href="#seccion-beneficios" className="hover:opacity-100 hover:text-current transition">Beneficios</a></li>
                                    <li><a href="#seccion-instructor" className="hover:opacity-100 hover:text-current transition">Instructor</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div>
                        <h5 className={`font-bold mb-4 text-lg ${ds.footer.titleColor}`}>Contacto</h5>
                        <ul className={`space-y-3 ${ds.footer.textColor}`}>
                            <li className="flex items-center gap-2"><Mail className="w-4 h-4"/> {content.footer.contact || 'info@empresa.com'}</li>
                            <li><a href="#" className="hover:opacity-100 hover:text-current transition">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:opacity-100 hover:text-current transition">Términos de Uso</a></li>
                        </ul>
                    </div>
                </div>
                <div className={`border-t ${ds.footer.borderTop} pt-8 text-center ${ds.footer.copyrightColor} text-sm`}>
                    &copy; {new Date().getFullYear()} Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}

// --- Lead Capture Form ---
const LeadCaptureForm = ({ btnClass, btnText, ds }: { btnClass: string, btnText: string, ds: any }) => (
    <div className="space-y-4 relative z-10">
        <div className="relative">
            <div className={`absolute top-3.5 left-3 w-5 h-5 ${ds.cta.textColor}`}><Users className="w-5 h-5" /></div>
            <input placeholder="Tu Nombre Completo" className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition text-base ${ds.cta.inputBg} ${ds.cta.inputBorder} border ${ds.cta.inputText} ${ds.cta.inputPlaceholder} ${ds.cta.inputRing} focus:ring-2`} />
        </div>
        <div className="relative">
            <div className={`absolute top-3.5 left-3 w-5 h-5 ${ds.cta.textColor}`}><Mail className="w-5 h-5" /></div>
            <input placeholder="Tu Correo Principal" className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition text-base ${ds.cta.inputBg} ${ds.cta.inputBorder} border ${ds.cta.inputText} ${ds.cta.inputPlaceholder} ${ds.cta.inputRing} focus:ring-2`} />
        </div>
        <button className={`w-full py-4 rounded-lg font-bold text-lg transition transform hover:scale-[1.02] active:scale-[0.98] ${btnClass}`}>
            {btnText}
        </button>
    </div>
);

// --- Registration Modal ---
export const RegistrationModal = ({ content, ds, onClose }: { content: GeneratedPageContent, ds: any, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative p-8 rounded-2xl border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 ${ds.cta.containerBg} ${ds.cta.containerBorder}`}>
                <button onClick={onClose} className={`absolute top-4 right-4 transition ${ds.cta.textColor} hover:opacity-70`}><X className="w-6 h-6" /></button>
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${ds.hero.badgeBg} ${ds.hero.badgeText} text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border ${ds.hero.badgeBorder}`}>
                    {content.hero.spotsLeft || "¡Cupos Limitados!"}
                </div>
                <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${ds.cta.titleColor}`}>Reserva tu Cupo</h3>
                    <p className={`text-sm ${ds.cta.textColor}`}>Completa el formulario para acceder ahora.</p>
                </div>
                <LeadCaptureForm btnClass={ds.buttons.primary} btnText={content.navCta || "Ingresar Ahora"} ds={ds} />
                <div className={`mt-4 flex items-center justify-center gap-2 text-xs ${ds.cta.textColor}`}>
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
          <div id="contenedor-formulario-cta" className={`rounded-2xl shadow-2xl border relative ${ds.cta.containerBg} ${ds.cta.containerBorder} ${centered ? 'mx-auto max-w-md' : 'w-full'} ${isMobilePreview ? 'p-5' : 'p-5 md:p-8'}`}>
              <div className={`absolute -top-3.5 right-4 md:right-6 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20 border ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                  {content.hero.spotsLeft || "¡Cupos Limitados!"}
              </div>
              <h3 className={`font-bold mb-2 text-center ${ds.cta.titleColor} ${isMobilePreview ? 'text-xl' : 'text-xl md:text-2xl'}`}>Reserva tu lugar GRATIS</h3>
              <p className={`text-center mb-6 text-sm ${ds.cta.textColor}`}>Accede al método exclusivo.</p>
              <LeadCaptureForm btnClass={ds.buttons.primary} btnText={content.hero.ctaText} ds={ds} />
              <div className={`mt-4 flex items-center justify-center gap-2 text-xs text-center mb-6 ${ds.cta.textColor}`}>
                  <Lock className="w-3 h-3 flex-shrink-0" /> Tus datos están 100% seguros. No hacemos spam.
              </div>
              <div className={`pt-6 border-t flex items-center justify-between ${ds.cta.containerBorder}`}>
                  <div className="flex -space-x-3">
                      {[1,2,3].map(i => <img key={i} src={`https://randomuser.me/api/portraits/thumb/women/${i+20}.jpg`} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />)}
                  </div>
                  <div className="text-right">
                      <div className={`flex items-center justify-end gap-1 font-bold text-lg ${ds.cta.titleColor}`}>
                           <CheckCircle className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {content.hero.socialProofCount || "2,458+"}
                      </div>
                      <p className={`text-xs ${ds.cta.textColor}`}>Alumnos registrados</p>
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
              className={`group relative overflow-hidden ${fullWidth ? 'w-full' : 'w-auto px-10'} py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${ds.buttons.primary}`}
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {dest.type === 'whatsapp' && <MessageCircle className="w-5 h-5" />}
                  {content.hero.ctaText}
                  {dest.type === 'external_url' && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
            </button>
            <p className={`mt-4 text-sm opacity-70 ${ds.hero.subtitleColor}`}>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Garantía de satisfacción</span>
            </p>
        </div>
    );
};

// --- Feature Card ---
export const FeatureCard = ({ item, idx, ds, content }: { item: any, idx: number, ds: any, content: GeneratedPageContent }) => {
    // Dynamic icon colors override if needed, otherwise use DS defaults
    const IconComponent = getIcon(item.icon, idx === 0 ? <DollarSign className="w-10 h-10" /> : idx === 1 ? <FileText className="w-10 h-10" /> : idx === 2 ? <Briefcase className="w-10 h-10" /> : <Award className="w-10 h-10" />);

    return (
        <div id={`tarjeta-beneficio-${idx}`} className={`p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-start ${ds.features.cardBg} ${ds.features.cardBorder} ${ds.features.cardShadow} border`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 p-4 ${ds.features.iconContainer}`}>
                <div className={`w-full h-full ${ds.features.iconColor}`}>{IconComponent}</div>
            </div>
            <h3 className={`text-xl font-bold mb-3 ${ds.features.titleColor}`}>{item.title}</h3>
            {renderRichText(item.description, `leading-relaxed ${ds.features.descColor}`)}
        </div>
    );
};
