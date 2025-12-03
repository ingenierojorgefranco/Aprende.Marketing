import React from 'react';
import { ArrowRight, MessageCircle, DollarSign, Layout, LogOut, LayoutDashboard, Rocket } from 'lucide-react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface PublicHomeProps {
  user: User | null;
  onLogout?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">P</div>
            <span className="text-xl font-bold tracking-tight">Aprende.<span className="text-gray-400 font-normal">Marketing</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition">Herramientas</button>
            <button onClick={() => scrollToSection('benefits')} className="hover:text-white transition">Para Afiliados</button>
            <button onClick={() => scrollToSection('stats')} className="hover:text-white transition">Resultados</button>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                 <span className="hidden md:block text-sm text-gray-400">Hola, <span className="text-white font-bold">{user.name}</span></span>
                 
                   <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/50 font-bold hover:bg-primary/30 transition text-sm flex items-center gap-2"
                   >
                     <LayoutDashboard className="w-4 h-4" /> Panel
                   </button>
                 
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
                onClick={() => navigate('/login')}
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
              onClick={() => user ? navigate('/dashboard') : navigate('/login')}
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