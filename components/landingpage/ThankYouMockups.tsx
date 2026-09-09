import React from 'react';

interface FormationMockupProps {
  title?: string;
  subtitle?: string;
  brandName?: string;
  customImageUrl?: string;
  posterUrl?: string;
  ds?: any;
}

export const FormationMockup: React.FC<FormationMockupProps> = ({
  title = "ESPECIALISTA EN RESINA EPÓXICA PARA SUELOS",
  subtitle = "De la práctica a un negocio rentable",
  brandName = "ResinPro",
  customImageUrl,
  posterUrl,
  ds
}) => {
  const glowColor = ds?.blobColor || 'bg-gradient-to-tr from-emerald-500/20 via-indigo-500/15 to-transparent';
  const logoBg = ds?.nav?.logoBg || 'bg-emerald-500/20';
  const displayImage = posterUrl || customImageUrl;

  if (customImageUrl) {
    return (
      <div className="w-full flex items-center justify-center p-2 relative group select-none">
        <div className={`absolute -inset-1 ${glowColor} rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-500 pointer-events-none`}></div>
        <img 
          src={customImageUrl} 
          alt={title} 
          className="relative rounded-2xl max-h-72 w-auto object-contain drop-shadow-2xl shadow-2xl border border-gray-100/20 transition-transform duration-300 group-hover:scale-[1.02]" 
        />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[340px] mx-auto h-[260px] flex items-center justify-center select-none py-2">
      {/* Glow effect behind bundle */}
      <div className={`absolute inset-0 ${glowColor} rounded-full blur-2xl opacity-40 pointer-events-none`}></div>

      {/* 1. CAJA 3D (BACKGROUND LEFT) */}
      <div className="absolute left-2 bottom-4 w-36 h-48 bg-gradient-to-b from-[#111625] to-[#0A0D18] rounded-r-lg rounded-l-sm shadow-2xl border border-gray-700/60 overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
        {/* Lomo de la caja */}
        <div className="absolute top-0 left-0 bottom-0 w-3.5 bg-gradient-to-r from-gray-900 to-gray-800 border-r border-gray-700/50 flex flex-col justify-between py-2 items-center text-[7px] text-gray-400 font-mono tracking-tighter">
          <span>{brandName.substring(0, 3).toUpperCase()}</span>
          <span className="rotate-90 origin-center whitespace-nowrap text-[6px] tracking-widest text-emerald-400 font-bold">MASTER</span>
        </div>
        
        {/* Portada de la caja */}
        <div className="pl-4 pr-2 pt-3 pb-2 h-full flex flex-col justify-between text-left">
          <div>
            <div className={`w-5 h-5 rounded-full ${logoBg} border border-white/20 flex items-center justify-center mb-1.5`}>
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <h5 className="text-[10px] font-black text-white leading-tight uppercase tracking-tight line-clamp-3">
              {title}
            </h5>
            <p className="text-[7.5px] text-gray-300 mt-1 leading-tight font-medium">
              {subtitle}
            </p>
          </div>

          {/* Imagen ilustrativa en la caja */}
          <div className="w-full h-16 rounded overflow-hidden relative border border-gray-700/50 my-1 bg-black">
            <img 
              src={displayImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"} 
              alt="Floor" 
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* Footer de la caja */}
          <div className="flex items-center justify-between text-[6px] text-gray-400 uppercase tracking-wider pt-1 border-t border-gray-800 font-mono">
            <span>Técnica</span>
            <span>Negocio</span>
            <span>Soporte</span>
          </div>
        </div>
      </div>

      {/* 2. LAPTOP / MONITOR MOCKUP (CENTER) */}
      <div className="absolute left-24 bottom-3 w-44 h-32 bg-[#0B0F19] rounded-t-lg shadow-2xl border border-gray-700 overflow-hidden z-20 transform hover:scale-105 transition-transform duration-300">
        {/* Pantalla del monitor */}
        <div className="relative w-full h-28 bg-black overflow-hidden">
          <img 
            src={displayImage || "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80"} 
            alt="Interior" 
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          {/* Logo en pantalla */}
          <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
            <span className="text-[7.5px] font-bold text-white font-sans">{brandName}</span>
          </div>
        </div>
        {/* Base de la laptop */}
        <div className="w-full h-4 bg-gradient-to-b from-gray-700 to-gray-800 border-t border-gray-600 flex items-center justify-center">
          <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* 3. SMARTPHONE MOCKUP (RIGHT) */}
      <div className="absolute right-3 bottom-1 w-16 h-32 bg-black rounded-xl shadow-2xl border-2 border-gray-600/80 overflow-hidden z-30 transform rotate-2 hover:rotate-0 transition-transform duration-300">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-gray-800 rounded-full z-10"></div>
        {/* Pantalla móvil */}
        <div className="w-full h-full relative overflow-hidden">
          <img 
            src={displayImage || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"} 
            alt="Mobile App" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-2 left-1 right-1 text-center">
            <span className="text-[6.5px] font-black text-white uppercase tracking-tighter bg-emerald-600/90 px-1 py-0.5 rounded block">
              En tu móvil
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GuideMockupProps {
  title?: string;
  subtitle?: string;
  customImageUrl?: string;
  posterUrl?: string;
  ds?: any;
}

export const GuideMockup: React.FC<GuideMockupProps> = ({
  title = "CÓMO CONVERTIR LA APLICACIÓN DE RESINA EPÓXICA PARA SUELOS EN UN NEGOCIO RENTABLE",
  subtitle = "GUÍA PRÁCTICA PASO A PASO",
  customImageUrl,
  posterUrl,
  ds
}) => {
  const glowColor = ds?.blobColor || 'bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent';
  const displayImage = posterUrl || customImageUrl;

  if (customImageUrl) {
    return (
      <div className="w-full flex items-center justify-center p-2 relative group select-none">
        <div className={`absolute -inset-1 ${glowColor} rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-500 pointer-events-none`}></div>
        <img 
          src={customImageUrl} 
          alt={title} 
          className="relative rounded-2xl max-h-72 w-auto object-contain drop-shadow-2xl shadow-2xl border border-gray-100/20 transition-transform duration-300 group-hover:scale-[1.02]" 
        />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[340px] mx-auto h-[260px] flex items-center justify-center select-none py-2">
      {/* Glow effect behind bundle */}
      <div className={`absolute inset-0 ${glowColor} rounded-full blur-2xl opacity-40 pointer-events-none`}></div>

      {/* 1. EBOOK PRINCIPAL / TABLET GRANDE (IZQUIERDA) */}
      <div className="absolute left-2 bottom-3 w-44 h-56 bg-white rounded-lg shadow-2xl border-2 border-gray-300 overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-300 z-10 flex flex-col justify-between p-3.5">
        <div>
          {/* Header de la guía */}
          <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-gray-100">
            <span className="text-[7.5px] font-extrabold text-emerald-600 uppercase tracking-wider">PDF Digital</span>
            <span className="text-[6.5px] font-mono text-gray-400">Guía 2025</span>
          </div>
          <h4 className="text-[10px] font-black text-gray-900 leading-snug uppercase tracking-tight line-clamp-4">
            {title}
          </h4>
        </div>

        {/* Portada / Preview gráfico */}
        <div className="w-full h-20 rounded bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-2 flex flex-col justify-between relative overflow-hidden my-1">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-md pointer-events-none"></div>
          <div className="text-[7px] font-bold text-gray-700">Incluye:</div>
          <div className="space-y-0.5 text-[6.5px] text-gray-600 font-medium">
            <p>• Captación de Clientes</p>
            <p>• Estructura de Precios</p>
            <p>• Cotizaciones Paso a Paso</p>
          </div>
          <div className="text-right">
            <span className="text-[6px] font-black uppercase text-emerald-600 bg-emerald-100 px-1 py-0.5 rounded">100% Gratis</span>
          </div>
        </div>

        {/* Footer de la portada */}
        <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-[7px] text-gray-500 font-bold uppercase tracking-wider">
          <span>{subtitle}</span>
          <span className="text-emerald-600">Descarga VIP</span>
        </div>
      </div>

      {/* 2. TABLET MEDIANA (CENTRO-DERECHA) */}
      <div className="absolute left-28 bottom-5 w-28 h-40 bg-[#0F172A] rounded-lg shadow-xl border border-gray-700 overflow-hidden transform rotate-3 z-20 p-2 flex flex-col justify-between">
        <div>
          <span className="text-[6px] text-emerald-400 font-mono block mb-1">FORMATO DIGITAL</span>
          <p className="text-[8px] font-black text-white leading-tight uppercase line-clamp-3">
            {title}
          </p>
        </div>
        <div className="w-full h-14 bg-black/60 rounded border border-gray-800 overflow-hidden relative">
          <img 
            src={displayImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"} 
            alt="Guide" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <span className="text-[6.5px] text-center font-bold text-gray-300 block">
          Acceso Inmediato
        </span>
      </div>

      {/* 3. SMARTPHONE (DERECHA AL FRENTE) */}
      <div className="absolute right-2 bottom-2 w-14 h-28 bg-black rounded-xl shadow-2xl border-2 border-gray-700 overflow-hidden z-30 transform -rotate-1 flex flex-col justify-between p-1.5">
        <div className="w-3 h-0.5 bg-gray-700 rounded-full mx-auto"></div>
        <div className="bg-emerald-950/60 rounded p-1 text-center my-auto border border-emerald-500/30">
          <span className="text-[6px] font-black text-emerald-400 block uppercase">En tu WhatsApp</span>
          <span className="text-[5.5px] text-gray-300 block">Listo para leer</span>
        </div>
        <div className="w-2.5 h-0.5 bg-gray-800 rounded-full mx-auto"></div>
      </div>
    </div>
  );
};
