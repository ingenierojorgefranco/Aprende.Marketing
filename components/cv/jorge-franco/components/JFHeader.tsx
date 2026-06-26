import React from 'react';
import { Moon, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JFHeaderProps {
  onScrollTo: (elementId: string) => void;
}

export const JFHeader: React.FC<JFHeaderProps> = ({ onScrollTo }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full z-50 bg-[#0B0B0B]/85 backdrop-blur-md border-b border-white/5 py-4">
      <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 bg-[#FF5A1F] rounded-lg flex items-center justify-center font-black text-white text-base shadow-md shadow-[#FF5A1F]/15">
            JF
          </div>
          <span className="text-lg font-black tracking-widest text-white uppercase group-hover:text-[#FF5A1F] transition-colors">
            JORGE FRANCO
          </span>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
          <button 
            onClick={() => onScrollTo('inicio')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Inicio
          </button>
          <button 
            onClick={() => onScrollTo('proyectos')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Proyectos
          </button>
          <button 
            onClick={() => onScrollTo('experiencia')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Experiencia
          </button>
          <button 
            onClick={() => onScrollTo('sobre-mi')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Sobre mí
          </button>
          <button 
            onClick={() => onScrollTo('contacto')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contacto
          </button>
        </div>

        {/* Right side items: Language Selector and Moon Icon */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-white hover:text-[#FF5A1F] cursor-pointer transition-colors">ES</span>
            <span>|</span>
            <span className="hover:text-[#FF5A1F] cursor-pointer transition-colors">EN</span>
          </div>
          
          <button className="text-gray-400 hover:text-white transition-colors">
            <Moon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
