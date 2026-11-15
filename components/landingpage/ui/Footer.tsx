import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { Facebook, Instagram, Twitter, Anchor, Sparkles } from 'lucide-react';
import { getIcon } from '../utils';

interface FooterProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  basePath?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
    content, 
    ds
}) => {
    const { socials } = content.footer;

    return (
        <footer id="footer-section" className={`${ds.footer.bg} ${ds.footer.borderTop} border-t py-14`}>
            <div className="w-full max-w-[75em] mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-10">
                    <div id="footer-logo-container" className="flex items-center justify-center gap-2.5 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${ds.nav.logoBg} ${ds.nav.logoText}`}>
                             {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5"/>) : (
                                content.logoSvg ? <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-5 h-5"/>
                             )}
                        </div>
                        <h4 id="footer-brand-name" className={`text-2xl font-bold ${ds.footer.titleColor}`} dangerouslySetInnerHTML={{__html: content.brandName || "PlataformaDeVenta.com"}}></h4>
                    </div>
                    <p id="footer-copyright-text" className={`${ds.footer.textColor} max-w-md mx-auto leading-relaxed text-center`}>{content.footer.copyright}</p>
                    {(socials?.facebook || socials?.instagram || socials?.twitter) && (
                        <div id="footer-socials" className="flex justify-center gap-4 mt-6">
                            {socials?.facebook && <a href={socials.facebook} id="footer-social-fb" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${ds.footer.socialBg} ${ds.footer.socialIcon} hover:${ds.footer.socialHoverBg} hover:${ds.footer.socialHoverIcon}`}><Facebook className="w-5 h-5" /></a>}
                            {socials?.instagram && <a href={socials.instagram} id="footer-social-ig" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${ds.footer.socialBg} ${ds.footer.socialIcon} hover:${ds.footer.socialHoverBg} hover:${ds.footer.socialHoverIcon}`}><Instagram className="w-5 h-5" /></a>}
                            {socials?.twitter && <a href={socials.twitter} id="footer-social-tw" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${ds.footer.socialBg} ${ds.footer.socialIcon} hover:${ds.footer.socialHoverBg} hover:${ds.footer.socialHoverIcon}`}><Twitter className="w-5 h-5" /></a>}
                        </div>
                    )}
                </div>
                <div id="footer-bottom-bar" className={`border-t ${ds.footer.borderTop} pt-8 text-center ${ds.footer.copyrightColor} text-sm`}>
                    &copy; {new Date().getFullYear()} Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};