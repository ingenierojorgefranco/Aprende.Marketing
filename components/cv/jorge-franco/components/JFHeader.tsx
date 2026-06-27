import React from 'react';
import { Moon, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JFHeaderProps {
  onScrollTo: (elementId: string) => void;
  lang: 'es' | 'en';
  setLang: (lang: 'es' | 'en') => void;
}

export const JFHeader: React.FC<JFHeaderProps> = ({ onScrollTo, lang, setLang }) => {
  const navigate = useNavigate();

  const menuItems = lang === 'es' ? [
    { id: 'inicio', label: 'Inicio' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'experiencia', label: 'Experiencia' },
    { id: 'sobre-mi', label: 'Sobre mí' },
    { id: 'contacto', label: 'Contacto' }
  ] : [
    { id: 'inicio', label: 'Home' },
    { id: 'proyectos', label: 'Projects' },
    { id: 'experiencia', label: 'Experience' },
    { id: 'sobre-mi', label: 'About me' },
    { id: 'contacto', label: 'Contact' }
  ];

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
          {menuItems.map((item) => (
            item.id === 'contacto' ? (
              <a 
                key={item.id}
                href="https://calendly.com/jorgefranpuntoco/seminariosonline"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ) : (
              <button 
                key={item.id}
                onClick={() => onScrollTo(item.id)} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            )
          ))}
        </div>

        {/* Right side items: Language Selector (Without Moon Icon) */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1.5 font-bold">
            <span 
              onClick={() => setLang('es')}
              className={`cursor-pointer transition-colors ${lang === 'es' ? 'text-white font-extrabold border-b border-[#FF5A1F]' : 'hover:text-[#FF5A1F]'}`}
            >
              ES
            </span>
            <span>|</span>
            <span 
              onClick={() => setLang('en')}
              className={`cursor-pointer transition-colors ${lang === 'en' ? 'text-white font-extrabold border-b border-[#FF5A1F]' : 'hover:text-[#FF5A1F]'}`}
            >
              EN
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
