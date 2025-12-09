
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

    const baseTextColorClass = content.palette === 'minimal-mono' ? 'text-black' : 'text-white';
    const stickyTextColorClass = ds.navStickyText || 'text-gray-900'; 
    const isHeaderLight = content.palette === 'energetic-orange' || content.palette === 'gold-prestige' || content.palette === 'nature-green' || content.palette === 'minimal-mono' || content.palette === 'crimson-red' || content.palette === 'ocean-teal';
    const effectiveBaseColor = isHeaderLight ? 'text-gray-900' : baseTextColorClass;
    const currentTextColor = isScrolled ? stickyTextColorClass : effectiveBaseColor;

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
           `<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500 font-extrabold">$1</span>`
         );
         return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    return (
      <>
      <nav 
        id="barra-navegacion"
        className={`w-full z-50 transition-all duration-300 ${isScrolled ? `${ds.navStickyBg} fixed top-0 left-0` : 'absolute top-0 left-0 bg-transparent border-b border-black/5 backdrop-blur-sm'}`}
      >
          <div className="w-full max-w-[75em] mx-auto px-6 py-4 flex justify-between items-center relative gap-4">
            <a href={basePath || '/'} id="logo-marca" className={`flex items-center gap-2 md:gap-3 font-bold tracking-tight transition-colors duration-300 ${currentTextColor} flex-1 min-w-0 mr-2 hover:opacity-80`}>
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-2 border-white/20 flex-shrink-0 ${ds.logoBg}`}>
                 {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5 md:w-6 md:h-6" />) : (
                    content.logoSvg ? <div className="w-5 h-5 md:w-7 md:h-7" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-4 h-4 md:w-6 md:h-6 text-current" /> 
                 )}
              </div>
              <span className="truncate text-sm sm:text-lg md:text-2xl leading-tight">
                {renderBrandName(content.brandName || "Brand")}
              </span>
            </a>
            
            <div id="enlaces-navegacion" className={`${isMobilePreview ? 'hidden' : 'hidden md:flex'} gap-8 text-sm font-medium transition-colors duration-300 ${currentTextColor} opacity-90 flex-shrink-0`}>
              {navLinks.map((link, i) => (
                  <a key={i} href={link.href} className="hover:opacity-100 transition">{link.label}</a>
              ))}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                id="cta-navbar" 
                onClick={() => setShowModal(true)}
                className={`${isMobilePreview ? 'hidden' : 'hidden md:block'} px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition shadow-sm ${ds.primaryBtn} text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white hover:shadow-lg hover:scale-105 hover:border-transparent`}
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
                  {navLinks.map((link, i) => (
                      <a key={i} href={link.href} onClick={() => setIsMenuOpen(false)} className={`text-lg font-medium py-3 border-b border-gray-100/50 last:border-0 hover:pl-2 transition-all ${ds.navStickyText || 'text-gray-900'}`}>{link.label}</a>
                  ))}
                  <div className="pt-4 mt-2 border-t border-gray-100/20 w-full">
                     <button onClick={() => { setShowModal(true); setIsMenuOpen(false); }} className={`w-full py-3 rounded-xl font-bold text-center shadow-lg ${ds.primaryBtn} text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:shadow-lg hover:border-transparent`}>
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
export const Footer = ({ content, ds, isDark, isMobilePreview }: { content: GeneratedPageContent, ds: any, isDark: boolean, isMobilePreview: boolean }) => {
    const { socials } = content.footer;
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

// --- Lead Capture Form ---
const LeadCaptureForm = ({ btnClass, btnText }: { btnClass: string, btnText: string }) => (
    <div className="space-y-4 relative z-10">
        <div className="relative">
            <div className="absolute top-3.5 left-3 w-5 h-5 text-gray-300"><Users className="w-5 h-5" /></div>
            <input placeholder="Tu Nombre Completo" className="w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-lg bg-white/10 text-white focus:bg-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 outline-none transition placeholder-gray-400 text-base" />
        </div>
        <div className="relative">
            <div className="absolute top-3.5 left-3 w-5 h-5 text-gray-300"><Mail className="w-5 h-5" /></div>
            <input placeholder="Tu Correo Principal" className="w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-lg bg-white/10 text-white focus:bg-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 outline-none transition placeholder-gray-400 text-base" />
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
            <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><X className="w-6 h-6" /></button>
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
                      {[1,2,3].map(i => <img key={i} src={`https://randomuser.me/api/portraits/thumb/women/${i+20}.jpg`} alt="User" className="w-8 h-8 rounded-full border-2 border-[#1e293b] object-cover" />)}
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
              className={`group relative overflow-hidden ${fullWidth ? 'w-full' : 'w-auto px-10'} py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${ds.primaryBtn}`}
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {dest.type === 'whatsapp' && <MessageCircle className="w-5 h-5" />}
                  {content.hero.ctaText}
                  {dest.type === 'external_url' && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
            </button>
            <p className={`mt-4 text-sm opacity-70 ${content.palette === 'minimal-mono' ? 'text-gray-500' : ds.heroText}`}>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Garantía de satisfacción</span>
            </p>
        </div>
    );
};

// --- Feature Card ---
export const FeatureCard = ({ item, idx, ds, content, isDark }: { item: any, idx: number, ds: any, content: GeneratedPageContent, isDark: boolean }) => {
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

    const iconClass = content.palette === 'minimal-mono' ? "bg-gray-900 text-white shadow-xl" : `${gradientClass} shadow-2xl`;
    const IconComponent = getIcon(item.icon, idx === 0 ? <DollarSign className="w-10 h-10 text-white" /> : idx === 1 ? <FileText className="w-10 h-10 text-white" /> : idx === 2 ? <Briefcase className="w-10 h-10 text-white" /> : <Award className="w-10 h-10 text-white" />);

    return (
        <div id={`tarjeta-beneficio-${idx}`} className={`p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-start ${ds.cardBg}`}>
            <div className={`${iconClass} w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 p-4`}>
                <div className="text-white w-full h-full">{IconComponent}</div>
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
            {renderRichText(item.description, `leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`)}
        </div>
    );
};
