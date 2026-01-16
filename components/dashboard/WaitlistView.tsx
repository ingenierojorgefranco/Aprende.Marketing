
import React from 'react';
import { 
  CheckCircle, MessageCircle, Sparkles, 
  Target, Briefcase, Zap, Mail, Users, 
  ArrowRight, ShieldCheck, Star,
  // Add missing icons
  Brain, Layout
} from 'lucide-react';

export const WaitlistView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER: FELICITACIONES */}
      <div className="relative overflow-hidden rounded-[3rem] bg-[#0B0B0B] border border-white/5 shadow-2xl p-10 md:p-16 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-[#FF5A1F] via-orange-400 to-[#FF5A1F] opacity-50"></div>
          
          <div className="relative z-10 space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-bounce">
                  <CheckCircle className="w-10 h-10" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase italic">
                  ¡Felicidades por registrarte!
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                  Estás a punto de acceder a la herramienta definitiva para automatizar tus ventas en Hotmart utilizando Inteligencia Artificial.
              </p>
              
              <div className="pt-8">
                  <p className="text-sm text-white font-black uppercase tracking-[0.3em] mb-8">Próximo paso obligatorio:</p>
                  
                  <a 
                    href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#20bd5a] text-white px-10 py-6 rounded-[2rem] font-black text-xl md:text-2xl shadow-[0_20px_50px_rgba(37,211,102,0.3)] transition-all transform hover:scale-[1.03] active:scale-95"
                  >
                      <div className="absolute -inset-1 bg-[#25D366] rounded-[2.2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
                      <MessageCircle className="w-8 h-8 fill-current" />
                      <span className="relative">Unirme al Grupo "Viajero Digital"</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </a>
                  
                  <p className="mt-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
                      * El acceso a la plataforma se habilitará exclusivamente a través de este grupo.
                  </p>
              </div>
          </div>
      </div>

      {/* BENEFICIOS DEL SISTEMA */}
      <div className="space-y-8">
          <h2 className="text-center text-2xl font-black text-white uppercase tracking-[0.2em] opacity-40">Lo que obtendrás al iniciar</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Brain, title: 'IA Estratégica', desc: 'Analiza tu nicho y avatar para definir el ADN de tu negocio.', color: 'text-purple-400' },
                { icon: Layout, title: 'Embudos Listos', desc: 'Crea Landing Pages y páginas de gracias en 45 segundos.', color: 'text-blue-400' },
                { icon: Mail, title: 'Email Nutrición', desc: 'Secuencias de 7 y 30 días redactadas para cerrar ventas.', color: 'text-yellow-400' },
                { icon: MessageCircle, title: 'Scripts WhatsApp', desc: 'Guiones probados para convertir chats en transacciones.', color: 'text-emerald-400' },
                { icon: Target, title: 'Artículos SEO', desc: 'Contenido optimizado para atraer tráfico gratis desde Google.', color: 'text-rose-400' },
                { icon: Zap, title: 'Automatización', desc: 'Sincroniza tus prospectos y vende en piloto automático.', color: 'text-orange-400' }
              ].map((b, i) => (
                <div key={i} className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center text-center hover:border-white/10 transition-all group">
                    <div className={`p-4 bg-white/5 rounded-2xl mb-6 group-hover:scale-110 transition-transform ${b.color}`}>
                        <b.icon className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black text-white mb-2">{b.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
          </div>
      </div>

      {/* PRUEBA SOCIAL / TESTIMONIOS ESTILO CHAT */}
      <div className="bg-[#111] p-10 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Users className="w-40 h-40 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/3 text-center md:text-left space-y-4">
                  <h3 className="text-3xl font-black text-white leading-tight">Resultados de nuestra comunidad</h3>
                  <div className="flex justify-center md:justify-start gap-1 text-yellow-500">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-gray-500 font-medium italic">"Ya somos más de 500 viajeros digitales utilizando la IA para escalar sus comisiones."</p>
              </div>

              <div className="md:w-2/3 space-y-4">
                  {[
                    { name: 'Sofia R.', text: '¡Increíble! Generé mi primera landing de uñas en 1 minuto. El copy es brutal.', delay: '0s' },
                    { name: 'Marcos G.', text: 'Por fin entiendo cómo funciona un embudo real. WhatsApp es la clave.', delay: '0.2s' },
                    { name: 'Ana M.', text: 'La academia incluida me ayudó a elegir mi primer producto ganador.', delay: '0.4s' }
                  ].map((chat, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 fade-in`} style={{ animationDelay: chat.delay }}>
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-lg border ${i % 2 === 0 ? 'bg-[#202c33] border-white/5 rounded-tl-none' : 'bg-[#005c4b] border-green-900/30 rounded-tr-none'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#FF5A1F] mb-1">{chat.name}</p>
                            <p className="text-white text-sm font-medium">{chat.text}</p>
                        </div>
                    </div>
                  ))}
              </div>
          </div>
      </div>

      {/* CTA FINAL */}
      <div className="text-center pt-10">
          <h2 className="text-3xl font-black text-white mb-10">¿Listo para el lanzamiento?</h2>
          <a 
            href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white text-black px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
              <Users className="w-5 h-5" /> Acceder al Grupo de WhatsApp
          </a>
          <p className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sistema Seguro y Validado
          </p>
      </div>

    </div>
  );
};
