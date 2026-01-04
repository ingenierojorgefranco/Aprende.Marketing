import React from 'react';
import { ArrowLeft, Facebook, Instagram, Youtube, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

////////// Actualización de página de términos y condiciones - 27/05/2025 02:15 //////////
export const TermsPage: React.FC = () => {
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
          <h1 className="text-4xl md:text-6xl font-black mb-12 leading-tight">Términos y <span className="text-[#FF5A1F]">Condiciones</span></h1>
          
          <div className="prose prose-lg prose-indigo max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">1. Aceptación de los Términos</h2>
              <p>Al acceder y utilizar Aprende.Marketing ("la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">2. Descripción del Servicio</h2>
              <p>Aprende.Marketing ofrece herramientas de Inteligencia Artificial para la creación de Landing Pages, estrategias de marketing y gestión de CRM para productos digitales. No garantizamos resultados económicos específicos, ya que estos dependen del uso individual y las condiciones del mercado.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">3. Contenido Generado por IA</h2>
              <p>La plataforma utiliza modelos de lenguaje para generar textos y estructuras. El usuario es el único responsable de revisar, editar y validar la veracidad y legalidad del contenido antes de su publicación. Aprende.Marketing no se hace responsable por reclamos derivados de contenido generado automáticamente.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">4. Limitación de Responsabilidad</h2>
              <p>En ningún caso Aprende.Marketing, sus directores o empleados serán responsables por daños indirectos, incidentales o especiales, incluyendo la pérdida de beneficios o datos, derivados del uso o la imposibilidad de uso de la plataforma.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">5. Propiedad Intelectual</h2>
              <p>Usted conserva los derechos sobre el contenido que publica. La infraestructura, el código fuente y las marcas de Aprende.Marketing son propiedad exclusiva de la empresa y están protegidos por leyes internacionales de derechos de autor.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B]">6. Suscripciones y Pagos</h2>
              <p>Los pagos se procesan a través de Stripe o Hotmart. Al suscribirse, usted acepta los términos de estos procesadores. Las cancelaciones pueden realizarse en cualquier momento desde el panel de usuario, entrando en vigor al final del periodo facturado actual.</p>
            </section>

            <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100 italic">
              <p className="mb-0 text-sm">Última actualización: 27 de mayo de 2025. Nos reservamos el derecho de modificar estos términos en cualquier momento notificando a través de la plataforma.</p>
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
