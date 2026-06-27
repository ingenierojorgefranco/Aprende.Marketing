import React from 'react';
import { Heart } from 'lucide-react';

interface JFFooterProps {
  lang: 'es' | 'en';
}

export const JFFooter: React.FC<JFFooterProps> = ({ lang }) => {
  return (
    <footer className="bg-[#0B0B0B] border-t border-white/5 py-12 relative z-10 text-xs font-light text-gray-500">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left copyright and logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-6 bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20 rounded flex items-center justify-center font-bold text-[10px]">
            JF
          </div>
          <span>
            &copy; {new Date().getFullYear()} Jorge Franco. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </span>
        </div>

        {/* Right side policies */}
        <div className="flex items-center gap-6 font-semibold text-gray-400">
          <a href="#" className="hover:text-white transition-colors">
            {lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
          </a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">
            {lang === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'}
          </a>
        </div>
      </div>
    </footer>
  );
};
