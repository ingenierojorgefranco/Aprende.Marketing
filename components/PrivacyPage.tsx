import React from 'react';
import { ArrowLeft, Facebook, Instagram, Youtube, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

////////// Actualización de página de política de privacidad - 27/05/2025 02:15 //////////
export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0B0B0B] font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col">
      <nav className="fixed w-full z-50 bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            {/* ////////// Actualización: Logo AM - 27/05/2025 02:15 ////////// */}
            <div className="w-14 h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[#FF5A1F]/20 px-2">AM</div>
            {/* ////////// Fin de actualización - 27/05/2025 02:15 ////////// */}
            <span className="text-2xl font-bold tracking-tight text-white">Aprende.<span className="text-[#B0B0B0] font-normal">Marketing</span></span>
          </div>
          <button onClick={() => navigate('/')} className="text-white hover:text-[#FF5A1F] transition flex items-center gap-2 font-bold"><ArrowLeft className="w-5 h-5" /> Volver</button>
        </div>
      </nav>

      <main className="pt-40 pb-24 flex-1">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black mb-12 leading-tight">Política de <span className="text-[#FF5A1F]">Privacidad</span></h1>
          
          <div className="prose prose-lg prose-indigo max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">1. Recopilación de Datos</h2>
              <p>Recopilamos información que usted nos proporciona directamente al registrarse (nombre, correo electrónico) y datos técnicos de navegación para mejorar su experiencia mediante el uso de cookies y tecnologías similares.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">2. Uso de la Información</h2>
              <p>Utilizamos sus datos para:
                <ul className="mt-4">
                  <li>Proporcionar y mantener nuestro servicio.</li>
                  <li>Notificarle sobre cambios en nuestra plataforma.</li>
                  <li>Procesar sus pagos de forma segura.</li>
                  <li>Brindarle soporte al cliente y asistencia técnica.</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">3. Procesadores de Terceros</h2>
              <p>Para la gestión de pagos, utilizamos Stripe y Hotmart. Estas empresas tienen sus propias políticas de privacidad y nosotros no almacenamos los datos de sus tarjetas de crédito en nuestros servidores.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">4. Seguridad de los Datos</h2>
              <p>Implementamos medidas de seguridad de nivel industrial (Encriptación SSL, Firewalls) para proteger su información. Sin embargo, ningún método de transmisión por internet es 100% seguro.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">5. Sus Derechos (GDPR/LGPD)</h2>
              <p>Usted tiene derecho a acceder, rectificar o solicitar la eliminación de sus datos personales. Puede ejercer estos derechos contactando a nuestro equipo de soporte.</p>
            </section>

            <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100 italic">
              <p className="mb-0 text-sm">Esta política cumple con los estándares internacionales de protección de datos. Última revisión: 27 de mayo de 2025.</p>
            </section>
          </div>
        </div>
      </main>

      {/* ////////// Inclusión de Footer - 27/05/2025 02:15 ////////// */}
      <footer id="footer" className="bg-[#0B0B0B] border-t border-white/5 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
             <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-12 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-[#FF5A1F]/20 px-2">AM</div>
                  <span className="text-3xl font-black text-white tracking-tight">Aprende.<span className="text-[#FF5A1F]">Marketing</span></span>
                </div>
                <p className="text-[#B0B0B0] leading-relaxed text-lg font-light">
                  La plataforma definitiva para afiliados y productores que buscan escalar su facturación utilizando Inteligencia Artificial y Embudos Automatizados de alto impacto.
                </p>
                <div className="flex gap-6">
                   <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all group shadow-lg">
                      <Facebook className="w-6 h-6 text-[#B0B0B0] group-hover:text-white transition-colors" />
                   </div>
                   <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all group shadow-lg">
                      <Instagram className="w-6 h-6 text-[#B0B0B0] group-hover:text-white transition-colors" />
                   </div>
                   <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all group shadow-lg">
                      <Youtube className="w-6 h-6 text-[#B0B0B0] group-hover:text-white transition-colors" />
                   </div>
                </div>
             </div>

             <div>
                <h4 className="text-white font-black text-xl mb-10 uppercase tracking-[0.2em] opacity-60">Producto</h4>
                <ul className="space-y-6 text-xl text-[#B0B0B0]">
                  <li><button onClick={() => scrollToSection('features')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Herramientas IA</button></li>
                  <li><button onClick={() => navigate('/register')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Registrate Gratis</button></li>
                  <li><button onClick={() => scrollToSection('process')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> ¿Cómo Funciona?</button></li>
                  <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Casos de Éxito</button></li>
                </ul>
             </div>

             <div>
                <h4 className="text-white font-black text-xl mb-10 uppercase tracking-[0.2em] opacity-60">Recursos</h4>
                <ul className="space-y-6 text-xl text-[#B0B0B0]">
                  <li><button onClick={() => navigate('/blog')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Blog de Marketing</button></li>
                  <li><button onClick={() => scrollToSection('academy')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Academia VIP</button></li>
                </ul>
             </div>

             <div>
                <h4 className="text-white font-black text-xl mb-10 uppercase tracking-[0.2em] opacity-60">Soporte</h4>
                <ul className="space-y-6 text-xl text-[#B0B0B0]">
                  <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Centro de Ayuda</a></li>
                  <li><button onClick={() => navigate('/contacto')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Contactar con Ventas</button></li>
                  <li><button onClick={() => navigate('/terminos')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Términos y Condiciones</button></li>
                  <li><button onClick={() => navigate('/privacidad')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Política de Privacidad</button></li>
                </ul>
             </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[#B0B0B0]/50 text-sm text-center md:text-left font-medium">
                  &copy; {new Date().getFullYear()} Aprende.Marketing. Todos los derechos reservados. Hotmart® es una marca registrada de Launch Pad Tecnologia, S.A. No tenemos relación oficial con Hotmart®.
              </p>
              <div className="flex gap-8 text-[11px] font-black text-[#B0B0B0]/30 uppercase tracking-[0.4em]">
              </div>
          </div>
        </div>
      </footer>
      {/* ////////// Fin de actualización - 27/05/2025 02:15 ////////// */}
    </div>
  );
};
////////// Fin de actualización - 27/05/2025 02:15 //////////
