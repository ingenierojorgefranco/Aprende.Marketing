
import React, { useEffect } from 'react';
import { GeneratedPageContent } from '../../../types';
import { CheckCircle, ArrowRight, MessageCircle, Download, Share2 } from 'lucide-react';
import { getDesignSystem } from '../designSystem';
import { Navbar, Footer } from '../ui/LiveComponents';

interface ThankYouTemplateProps {
    content: GeneratedPageContent;
    ds: any;
    isMobilePreview: boolean;
    pageId?: string;
    basePath?: string;
}

export const ThankYouTemplate: React.FC<ThankYouTemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath }) => {
    // Configuración por defecto si no existe thankYouPage en content
    const tyConfig = content.thankYouPage || {
        headline: "¡Felicidades! Registro Exitoso",
        subheadline: "Hemos recibido tus datos correctamente. Estás a un paso de acceder.",
        ctaText: "Unirme al Grupo VIP",
        ctaLink: content.destination.whatsappPhone 
            ? `https://wa.me/${content.destination.whatsappPhone}` 
            : "#"
    };

    // Efecto de Confetti simple (CSS)
    useEffect(() => {
        // En un entorno real usaríamos una librería como canvas-confetti, 
        // aquí simulamos con CSS si es posible o simplemente renderizamos.
    }, []);

    // Helper para manejar si content.destination.type es 'form' para mostrar iconos adecuados
    const ActionIcon = content.destination.type === 'whatsapp' ? MessageCircle : Download;

    return (
        <div className={`min-h-screen flex flex-col ${ds.bg} font-sans`}>
            {/* Import Navbar with flag for blog articles false for thank you page specific context unless needed */}
            <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={false} />

            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-20 px-6">
                
                {/* Background Decorations */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

                <div className={`relative z-10 w-full max-w-3xl text-center animate-in fade-in zoom-in-95 duration-500`}>
                    
                    {/* Success Icon */}
                    <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
                    </div>

                    {/* Headlines */}
                    <h1 className={`text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight ${ds.hero.titleColor}`}>
                        {tyConfig.headline}
                    </h1>
                    
                    <p className={`text-xl md:text-2xl opacity-90 leading-relaxed mb-12 max-w-xl mx-auto ${ds.hero.subtitleColor}`}>
                        {tyConfig.subheadline}
                    </p>

                    {/* Primary Action Button */}
                    <div className="flex flex-col items-center gap-6">
                        <a 
                            href={tyConfig.ctaLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`group relative px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform flex items-center gap-3 ${ds.buttons.primary}`}
                        >
                            <ActionIcon className="w-7 h-7" />
                            {tyConfig.ctaText}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </a>
                        
                        <p className={`text-sm opacity-60 mt-2 ${ds.hero.subtitleColor}`}>
                            Haz clic arriba para completar tu acceso.
                        </p>
                    </div>

                    {/* Social Share (Optional) */}
                    <div className="mt-20 pt-10 border-t border-gray-500/10 max-w-sm mx-auto">
                        <p className={`text-sm mb-4 font-medium ${ds.hero.subtitleColor}`}>¿Conoces a alguien a quien le interese esto?</p>
                        <div className="flex justify-center gap-4">
                            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition text-current"><Share2 className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />
        </div>
    );
};