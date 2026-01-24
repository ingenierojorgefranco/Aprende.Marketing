
import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { Facebook, Instagram, Twitter, Mail, Anchor, Sparkles } from 'lucide-react';
import { getIcon } from '../../utils';
import { useLocation } from 'react-router-dom';

interface FooterModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  basePath?: string;
}

export const FooterModule: React.FC<FooterModuleProps> = ({ content, ds, isMobilePreview, basePath }) => {
  const { socials } = content.footer;
  const location = useLocation();

  const isOnLandingRoot = () => {
    const path = location.pathname.endsWith('/') && location.pathname.length > 1 
      ? location.pathname.slice(0, -1) 
      : location.pathname;
    const base = basePath ? (basePath.endsWith('/') ? basePath.slice(0, -1) : basePath) : '';
    if (!base) return path === '/' || path === '';
    return path === base;
  };

  const resolveLink = (href: string) => {
    if (href.startsWith('#')) {
      if (isOnLandingRoot()) return href;
      const root = basePath || '';
      return `${root === '/' ? '' : root}/${href.replace(/^#/, '#')}`; 
    }
    return href;
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      if (isOnLandingRoot()) {
        e.preventDefault();
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
              {(content.navLinks || []).map((link, i) => (
                <li key={i}>
                  <a href={resolveLink(link.href)} onClick={(e) => handleSmoothScroll(e, link.href)} className={`transition hover:${ds.footer.linkHover}`}>{link.label}</a>
                </li>
              ))}
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
};
