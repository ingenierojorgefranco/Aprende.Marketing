import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Send, Loader2, CheckCircle, Phone, MapPin, Facebook, Instagram, Youtube, ChevronRight, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

////////// Actualización de página de contacto - 27/05/2025 02:15 //////////
export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'Ventas',
    message: ''
  });

  const scrollToSection = (id: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de envío
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0B0B0B] font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            {/* ////////// Actualización: Logo AM - 27/05/2025 02:15 ////////// */}
            <div className="w-14 h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[#FF5A1F]/20 px-2">AM</div>
            {/* ////////// Fin de actualización - 27/05/2025 02:15 ////////// */}
            <span className="text-2xl font-bold tracking-tight text-white">Aprende.<span className="text-[#B0B0B0] font-normal">Marketing</span></span>
          </div>
          <button onClick={() => navigate('/')} className="text-white hover:text-[#FF5A1F] transition flex items-center gap-2 font-bold">
            <ArrowLeft className="w-5 h-5" /> Volver al Inicio
          </button>
        </div>
      </nav>

      <main className="pt-40 pb-24 flex-1">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            
            {/* Info Column */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-black text-[#0B0B0B] leading-tight mb-6">¿Cómo podemos <span className="text-[#FF5A1F]">ayudarte?</span></h1>
                <p className="text-xl text-gray-600 leading-relaxed">Nuestro equipo de expertos está listo para resolver tus dudas sobre la plataforma, estrategias de venta o problemas técnicos.</p>
              </div>

              <div className="space-y-6 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#FF5A1F]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Escríbenos a</p>
                    <p className="text-lg font-bold">soporte@aprende.marketing</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#FF5A1F]">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">WhatsApp Soporte</p>
                    <p className="text-lg font-bold">+1 (234) 567-890</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#FF5A1F]"></div>
              
              {success ? (
                <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-black text-[#0B0B0B]">¡Mensaje Recibido!</h2>
                  <p className="text-gray-600">Hemos recibido tu consulta. Un miembro de nuestro equipo te contactará en menos de 24 horas hábiles.</p>
                  <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#0B0B0B] text-white font-bold rounded-xl hover:bg-gray-800 transition">Volver al Inicio</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tu Nombre</label>
                      <input 
                        type="text" required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#FF5A1F] transition"
                        placeholder="Ej. Juan Pérez"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tu Correo</label>
                      <input 
                        type="email" required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#FF5A1F] transition"
                        placeholder="ejemplo@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Motivo de Consulta</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#FF5A1F] transition appearance-none cursor-pointer"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    >
                      <option value="Ventas">Información de Ventas / Planes</option>
                      <option value="Soporte">Soporte Técnico</option>
                      <option value="Alianzas">Alianzas y Colaboraciones</option>
                      <option value="Facturación">Facturación y Pagos</option>
                      <option value="Otro">Otro Motivo</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Mensaje</label>
                    <textarea 
                      required rows={5}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#FF5A1F] transition resize-none"
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl rounded-2xl transition shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                    {loading ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              )}
            </div>
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
