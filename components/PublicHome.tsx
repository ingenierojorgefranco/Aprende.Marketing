import React from 'react';
import { ArrowRight, Zap, Layout, MessageCircle, BarChart, Users, CheckCircle, Globe, Lock, DollarSign, Rocket, LogOut, LayoutDashboard } from 'lucide-react';
import { User } from '../types';

interface PublicHomeProps {
  user: User | null;
  onLoginClick: () => void;
  onDashboardClick?: () => void;
  onLogout?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ user, onLoginClick, onDashboardClick, onLogout }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">P</div>
            <span className="text-xl font-bold tracking-tight">PlataformaDeVenta<span className="text-gray-400 font-normal">.com</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition">Herramientas</a>
            <a href="#benefits" className="hover:text-white transition">Para Afiliados</a>
            <a href="#stats" className="hover:text-white transition">Resultados</a>
            <a href="#blog" className="hover:text-white transition">Blog</a>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                 <span className="hidden md:block text-sm text-gray-400">Hola, <span className="text-white font-bold">{user.name}</span></span>
                 {onDashboardClick && (
                   <button
                    onClick={onDashboardClick}
                    className="px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/50 font-bold hover:bg-primary/30 transition text-sm flex items-center gap-2"
                   >
                     <LayoutDashboard className="w-4 h-4" /> Panel
                   </button>
                 )}
                 {onLogout && (
                   <button
                    onClick={onLogout}
                    className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
                    title="Cerrar Sesión"
                   >
                     <LogOut className="w-5 h-5" />
                   </button>
                 )}
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition text-sm"
              >
                Acceso Usuarios
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-sm text-gray-400 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            Especializado para Productos de Hotmart ®
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-tight">
            Vende tus Infoproductos <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              En Piloto Automático
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            La plataforma "Todo en Uno" para Productores y Afiliados. Crea Embudos de Venta, VSLs y Páginas de Alta Conversión generadas por IA en segundos.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={user && onDashboardClick ? onDashboardClick : onLoginClick}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-full text-lg font-bold transition flex items-center gap-2 shadow-lg shadow-orange-900/40 text-white"
            >
              {user ? (
                 <>Ir a mi Panel <LayoutDashboard className="w-5 h-5" /></>
              ) : (
                 <>Crear mi Página Gratis <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-full text-lg font-bold transition flex items-center gap-2">
              <Rocket className="w-5 h-5 text-gray-400" /> Ver Demo en Vivo
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section id="stats" className="border-y border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">$4.2M</h3>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Ventas Generadas</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">12k+</h3>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Infoproductores</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">850k</h3>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Leads Capturados</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">Hotmart</h3>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Integración Nativa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Features */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">El Arsenal del Afiliado Moderno</h2>
          <p className="text-gray-400">Deja de pagar por 5 herramientas diferentes. Aquí tienes todo.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-orange-500/50 transition duration-300">
            <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Layout className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Constructor IA de Embudos</h3>
            <p className="text-gray-400 leading-relaxed">
              ¿No sabes de diseño? Nuestra IA genera Cartas de Venta (Sales Letters), Páginas de Captura y VSLs optimizados para tu nicho de Hotmart.
            </p>
          </div>
          <div className="group bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-green-500/50 transition duration-300">
            <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">CRM WhatsApp Automatizado</h3>
            <p className="text-gray-400 leading-relaxed">
              Cierra ventas por chat sin estar pegado al celular. Nuestro Bot IA responde dudas, rompe objeciones y envía el Hotlink de pago.
            </p>
          </div>
          <div className="group bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-purple-500/50 transition duration-300">
            <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Copywriting Persuasivo</h3>
            <p className="text-gray-400 leading-relaxed">
              ¿Bloqueo creativo? Genera guiones para anuncios, correos de seguimiento y textos de venta que tocan los dolores de tu cliente ideal.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section (Mock) */}
      <section id="blog" className="bg-gray-900 py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Academia de Ventas</h2>
              <p className="text-gray-400">Estrategias probadas para escalar en Hotmart.</p>
            </div>
            <button className="text-orange-500 hover:text-white transition font-medium flex items-center gap-2">
              Ver todos los artículos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Crashing vs Lanzamientos: ¿Qué elegir en 2024?", cat: "Estrategia", date: "12 Oct, 2024" },
              { title: "Cómo escalar tus campañas de Facebook Ads", cat: "Tráfico Pago", date: "08 Oct, 2024" },
              { title: "Estructura perfecta de un VSL que convierte", cat: "Copywriting", date: "01 Oct, 2024" }
            ].map((post, i) => (
              <article key={i} className="bg-black rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition cursor-pointer">
                <div className="h-48 bg-gray-800/50 flex items-center justify-center">
                  <BarChart className="w-12 h-12 text-gray-700" />
                </div>
                <div className="p-6">
                  <div className="flex gap-3 text-xs font-medium mb-3">
                    <span className="text-orange-500">{post.cat}</span>
                    <span className="text-gray-500">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold hover:text-orange-500 transition">{post.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / About Us */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Sobre PlataformaDeVenta</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Nacimos para simplificar la vida del productor digital. Sabemos que Hotmart es potente, pero las herramientas externas son complicadas. 
              Nosotros unimos construcción web, IA y automatización en un solo lugar.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Globe className="w-5 h-5 text-orange-500" />
                <span>Global (Optimizado para Latam y España)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Users className="w-5 h-5 text-orange-500" />
                <span>Comunidad de 12,000+ Marketers</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md bg-black p-8 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4">¿Tienes dudas?</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Tu Nombre" className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none" />
              <input type="email" placeholder="Tu Correo" className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none" />
              <textarea placeholder="¿En qué podemos ayudarte?" rows={3} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none resize-none"></textarea>
              <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition">Contactar Soporte</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <div className="mb-8 flex items-center justify-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold text-white">P</div>
             <span className="text-2xl font-bold text-white tracking-tight">PlataformaDeVenta.com</span>
          </div>
          <p>&copy; 2024 PlataformaDeVenta.com. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};