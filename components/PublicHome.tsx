import React from 'react';
import { ArrowRight, Zap, Layout, MessageCircle, BarChart, Users, CheckCircle, Globe, Lock } from 'lucide-react';

interface PublicHomeProps {
  onLoginClick: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
            <span className="text-xl font-bold tracking-tight">GeneratorLanding</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition">Características</a>
            <a href="#benefits" className="hover:text-white transition">Beneficios</a>
            <a href="#stats" className="hover:text-white transition">Clientes</a>
            <a href="#blog" className="hover:text-white transition">Blog</a>
          </div>
          <button
            onClick={onLoginClick}
            className="px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition text-sm"
          >
            Acceso Clientes
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-sm text-gray-400 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Nueva Versión 2.0 con IA Avanzada
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-tight">
            Crea Landing Pages <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-purple-500">
              Generadas por IA
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Olvídate de diseñar y escribir. Nuestra plataforma construye, redacta y aloja tu embudo de ventas en segundos. CRM de WhatsApp incluido.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={onLoginClick}
              className="px-8 py-4 bg-primary hover:bg-indigo-600 rounded-full text-lg font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              Comenzar Ahora <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-full text-lg font-bold transition">
              Ver Demo
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section id="stats" className="border-y border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">15k+</h3>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Páginas Creadas</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">2.5M</h3>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Visitas Generadas</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">850k</h3>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Chats de WhatsApp</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">99.9%</h3>
              <p className="text-gray-500 text-sm uppercase tracking-wider">Uptime Garantizado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Features */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Todo lo que necesitas para vender</h2>
          <p className="text-gray-400">Una suite completa de herramientas integradas en un solo lugar.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-primary/50 transition duration-300">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Layout className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Constructor IA</h3>
            <p className="text-gray-400 leading-relaxed">
              Solo ingresa tu nicho y objetivo. Gemini genera textos persuasivos, estructura de ventas y diseño automáticamente.
            </p>
          </div>
          <div className="group bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-green-500/50 transition duration-300">
            <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">CRM WhatsApp</h3>
            <p className="text-gray-400 leading-relaxed">
              Centraliza tus chats. Usa nuestro Bot IA para responder automáticamente y cerrar ventas 24/7 sin intervención humana.
            </p>
          </div>
          <div className="group bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-purple-500/50 transition duration-300">
            <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Email Marketing</h3>
            <p className="text-gray-400 leading-relaxed">
              Sincronización nativa con GetResponse. Cada lead capturado se envía automáticamente a tus listas de correo.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section (Mock) */}
      <section id="blog" className="bg-gray-900 py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Últimos Artículos</h2>
              <p className="text-gray-400">Aprende a escalar tu negocio digital.</p>
            </div>
            <button className="text-primary hover:text-white transition font-medium flex items-center gap-2">
              Ver todo el blog <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Cómo crear una oferta irresistible", cat: "Estrategia", date: "12 Oct, 2024" },
              { title: "Automatizando WhatsApp para ventas", cat: "Tecnología", date: "08 Oct, 2024" },
              { title: "La psicología detrás de una Landing Page", cat: "Diseño", date: "01 Oct, 2024" }
            ].map((post, i) => (
              <article key={i} className="bg-black rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition cursor-pointer">
                <div className="h-48 bg-gray-800/50 flex items-center justify-center">
                  <BarChart className="w-12 h-12 text-gray-700" />
                </div>
                <div className="p-6">
                  <div className="flex gap-3 text-xs font-medium mb-3">
                    <span className="text-primary">{post.cat}</span>
                    <span className="text-gray-500">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold hover:text-primary transition">{post.title}</h3>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Quiénes Somos</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              GeneratorLanding nació con la misión de democratizar el acceso a embudos de venta de alta conversión. 
              Somos un equipo de ingenieros y marketers obsesionados con la automatización.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Globe className="w-5 h-5 text-primary" />
                <span>Bogotá, Colombia (Sede Principal)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Users className="w-5 h-5 text-primary" />
                <span>Soporte 24/7 en Español</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md bg-black p-8 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Tu Nombre" className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
              <input type="email" placeholder="Tu Correo" className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
              <textarea placeholder="Mensaje" rows={3} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-primary outline-none resize-none"></textarea>
              <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <div className="mb-8">
             <span className="text-2xl font-bold text-white tracking-tight">GeneratorLanding</span>
          </div>
          <p>&copy; 2024 GeneratorLanding. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};