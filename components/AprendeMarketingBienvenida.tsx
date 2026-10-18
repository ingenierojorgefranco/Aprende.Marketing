import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Sparkles, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  GraduationCap, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  Users,
  Video
} from 'lucide-react';

interface AprendeMarketingBienvenidaProps {
  // Permite sobreescribir el enlace de video de YouTube fácilmente
  customVideoUrl?: string;
  // Enlace a clases gratuitas
  freeClassesUrl?: string;
  // Permite sobreescribir enlaces de redes sociales
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappGroupUrl?: string;
}

export const AprendeMarketingBienvenida: React.FC<AprendeMarketingBienvenidaProps> = ({
  customVideoUrl = "https://www.youtube.com/embed/CNUYJ5pQWxU?rel=0&controls=1&showinfo=0",
  freeClassesUrl = "https://www.youtube.com/playlist?list=PLGFXdqHqDQ9I",
  facebookUrl = "https://www.facebook.com/jorgefranpuntoco",
  instagramUrl = "https://instagram.com/jorgefranpuntoco",
  whatsappGroupUrl = "https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1?s=cl&p=a&mlu=4&ilr=4"
}) => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState(customVideoUrl);

  // Convierte URLs estándar de YouTube (youtube.com/watch?v= o youtu.be/) a formato embed
  const getEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';
    if (rawUrl.includes('youtube.com/embed/')) return rawUrl;
    
    // Soporta formatos https://youtu.be/ID o https://www.youtube.com/watch?v=ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = rawUrl.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1&controls=1&showinfo=0`;
    }
    return rawUrl;
  };

  const finalEmbedUrl = getEmbedUrl(videoUrl);

  // Optimización de Meta Tags para cuando se comparte en WhatsApp
  useEffect(() => {
    document.title = "Bienvenido a Aprende Marketing | Tu Comunidad Privada";
    
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('og:title', '¡Bienvenido a Aprende Marketing! 🎉');
    updateMetaTag('og:description', 'Mira este video exclusivo para miembros de la comunidad, accede a las clases gratuitas y crea tu cuenta.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', window.location.href);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col relative overflow-x-hidden">
      
      {/* Luces ambientales de fondo con la paleta de Aprende Marketing */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF5A1F]/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] bg-orange-600/10 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[15%] left-[-10%] w-[500px] h-[500px] bg-[#FF5A1F]/10 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Barra superior de anuncio sutil vinculada al grupo */}
      <a
        href={whatsappGroupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-gradient-to-r from-orange-950/50 via-orange-600/20 to-orange-950/50 border-b border-orange-500/25 py-2.5 px-4 text-center z-20 block hover:bg-orange-600/30 transition-colors"
      >
        <p className="text-xs sm:text-sm font-medium text-orange-200/90 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping"></span>
          <span>Acceso Exclusivo para Miembros del Grupo de WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
        </p>
      </a>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* LOGOTIPO DE APRENDE MARKETING CENTRADO */}
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-[#FF5A1F] rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative w-16 h-12 sm:w-20 sm:h-14 bg-gradient-to-br from-[#FF5A1F] via-[#FF6D2E] to-[#E04810] rounded-2xl flex items-center justify-center font-black text-white text-2xl sm:text-3xl shadow-xl shadow-[#FF5A1F]/30 border border-white/20 transform group-hover:scale-105 transition-all duration-300">
              AM
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-1">
            <span>Aprende</span><span className="text-[#FF5A1F]">.Marketing</span>
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-400/90 mt-1">
            APRENDE | IMPLEMENTA | ESCALA
          </span>
        </div>

        {/* TEXTO ENCIMA DEL VIDEO */}
        <div className="flex flex-col items-center text-center max-w-3xl mb-8 sm:mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-4 h-4 text-[#FF5A1F] animate-pulse" />
            <span>Paso 1: Mira este video de bienvenida</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight">
            ¡Gracias por unirte a nuestro <span className="bg-gradient-to-r from-[#FF5A1F] via-orange-400 to-amber-300 bg-clip-text text-transparent">grupo privado!</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
            Nos alegra mucho tenerte aquí. Antes de comenzar a explorar la plataforma, tómate un par de minutos para ver este video explicativo donde descubrirás todo lo que tenemos preparado para ti.
          </p>
        </div>

        {/* VIDEO DE YOUTUBE GRANDE (OCUPA LA MITAD DE LA PANTALLA) */}
        <div className="w-full max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="relative group">
            {/* Resplandor decorativo exterior */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FF5A1F] via-orange-500 to-[#E04810] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            
            {/* Contenedor del video */}
            <div className="relative bg-[#0E0E12] border-2 border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/80 aspect-video flex items-center justify-center">
              {finalEmbedUrl ? (
                <iframe
                  src={finalEmbedUrl}
                  title="Video de Bienvenida - Aprende Marketing"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 text-gray-400">
                  <Video className="w-16 h-16 text-[#FF5A1F] mb-4 opacity-80" />
                  <p className="text-lg font-bold text-white">Video de Bienvenida</p>
                  <p className="text-sm">El enlace del video se cargará en este espacio.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A1F]" />
            <span>Mira el video hasta el final para aprovechar todos los beneficios</span>
          </div>
        </div>

        {/* DOS BOTONES PRINCIPALES DEBAJO DEL VIDEO */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14 sm:mb-20">
          
          {/* Botón 1: Ver Clases Gratuitas */}
          <a
            href={freeClassesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-4 sm:py-5 px-6 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-black text-base sm:text-lg uppercase tracking-wider border-2 border-white/10 hover:border-[#FF5A1F] transition-all transform hover:-translate-y-1 shadow-lg shadow-black/60 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <span>Ver Clases Gratuitas</span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </a>

          {/* Botón 2: Crear mi cuenta en Aprende Marketing */}
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:flex-1 py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-[#FF5A1F] via-[#FF6D2E] to-[#E04810] hover:brightness-110 text-white font-black text-base sm:text-lg uppercase tracking-wider transition-all transform hover:-translate-y-1 shadow-xl shadow-[#FF5A1F]/30 border border-white/20 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span>Crear mi cuenta</span>
          </button>
        </div>

        {/* SECCIÓN DE VALOR / ¿QUÉ VAS A ENCONTRAR AQUÍ? */}
        <div className="w-full max-w-4xl grid sm:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          <div className="bg-[#121218]/80 border border-white/5 rounded-2xl p-6 text-center sm:text-left flex flex-col items-center sm:items-start hover:border-orange-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Clases Prácticas</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Estrategias probadas de ventas digitales y embudos paso a paso explicados sin tecnicismos complejos.
            </p>
          </div>

          <div className="bg-[#121218]/80 border border-white/5 rounded-2xl p-6 text-center sm:text-left flex flex-col items-center sm:items-start hover:border-orange-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Herramientas con IA</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Crea Landing Pages, artículos SEO y copys persuasivos en segundos con nuestros generadores integrados.
            </p>
          </div>

          <div className="bg-[#121218]/80 border border-white/5 rounded-2xl p-6 text-center sm:text-left flex flex-col items-center sm:items-start hover:border-orange-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Comunidad Privada</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Acompañamiento en el grupo para resolver dudas, compartir resultados y acelerar tu crecimiento.
            </p>
          </div>
        </div>

        {/* SÍGUEME EN MIS REDES SOCIALES (FACEBOOK E INSTAGRAM) */}
        <div className="w-full max-w-2xl bg-gradient-to-b from-[#14141C] to-[#0D0D12] border border-white/10 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF5A1F]/10 rounded-full blur-3xl pointer-events-none"></div>

          <span className="inline-block text-xs font-black uppercase tracking-widest text-[#FF5A1F] mb-2">
            Mantente conectado
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Sígueme en mis redes sociales
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
            Publicamos contenido diario con tips de marketing digital, análisis de campañas y avisos de nuevas clases en vivo.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Botón Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-2xl bg-black/50 hover:bg-gradient-to-r hover:from-purple-900/40 hover:via-pink-900/40 hover:to-orange-900/40 border border-white/10 hover:border-pink-500/50 text-white font-bold text-sm sm:text-base transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] text-gray-400 uppercase font-semibold">Instagram</p>
                <p className="text-white font-extrabold">@jorgefranpuntoco</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-500 group-hover:text-white transition-colors" />
            </a>

            {/* Botón Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-2xl bg-black/50 hover:bg-blue-950/40 border border-white/10 hover:border-blue-500/50 text-white font-bold text-sm sm:text-base transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <p className="text-[11px] text-gray-400 uppercase font-semibold">Facebook</p>
                <p className="text-white font-extrabold">@jorgefranpuntoco</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-500 group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Enlace destacado directo al grupo oficial de WhatsApp */}
          {whatsappGroupUrl && (
            <div className="pt-6 border-t border-white/10 text-center">
              <a
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 hover:text-white font-bold text-sm sm:text-base transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <span>Entrar al Grupo Oficial de WhatsApp</span>
                <ExternalLink className="w-4 h-4 ml-auto text-emerald-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/5 py-8 px-6 text-center text-xs text-gray-500 relative z-10 bg-[#070709]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-5 bg-[#FF5A1F] rounded-md flex items-center justify-center font-bold text-white text-[10px]">AM</div>
            <span className="font-bold text-gray-400">Aprende.<span className="text-[#FF5A1F]">Marketing</span></span>
          </div>

          <p>
            &copy; {new Date().getFullYear()} Aprende.Marketing. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/terminos')} className="hover:text-gray-300 transition">Términos</button>
            <span>•</span>
            <button onClick={() => navigate('/privacidad')} className="hover:text-gray-300 transition">Privacidad</button>
            <span>•</span>
            <button onClick={() => navigate('/contacto')} className="hover:text-gray-300 transition">Contacto</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
