
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Rocket, Zap, ShieldCheck, ArrowRight, Sparkles, Crown, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WelcomePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Disparar confeti al cargar la página
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const benefits = [
        {
            icon: <Rocket className="w-6 h-6 text-orange-500" />,
            title: "Proyectos Ilimitados",
            desc: "Crea y gestiona múltiples embudos de venta sin restricciones."
        },
        {
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: "IA de Alto Rendimiento",
            desc: "Generación de contenido 5x más rápida con modelos premium."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
            title: "Dominios Propios",
            desc: "Conecta tus propios dominios para una marca 100% profesional."
        },
        {
            icon: <Crown className="w-6 h-6 text-indigo-500" />,
            title: "Soporte VIP",
            desc: "Acceso prioritario a nuestro equipo de expertos en marketing."
        }
    ];

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            {/* Header de Celebración */}
            <div className="text-center mb-12 relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20">
                    <Sparkles className="w-20 h-20 text-orange-500 animate-pulse" />
                </div>
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-widest mb-6">
                    <Star className="w-4 h-4 fill-current" /> ¡Suscripción Activada!
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                    ¡Bienvenido al <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Siguiente Nivel</span>!
                </h1>
                
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                    Tu cuenta ha sido actualizada con éxito. Ahora tienes todas las herramientas necesarias para escalar tus ventas en Hotmart de forma profesional.
                </p>
            </div>

            {/* Grid de Beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-12">
                {benefits.map((b, i) => (
                    <div key={i} className="bg-gray-900/50 border border-white/5 p-8 rounded-[2rem] hover:border-orange-500/30 transition-all group">
                        <div className="mb-4 p-3 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                            {b.icon}
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">{b.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                ))}
            </div>

            {/* Guía de Inicio Rápido */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/5 rounded-[3rem] p-10 w-full max-w-4xl mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <CheckCircle className="w-40 h-40 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-orange-500" /> ¿Por dónde empezar?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">1</div>
                        <h4 className="text-white font-bold">Crea un Proyecto</h4>
                        <p className="text-gray-500 text-xs">Define tu nicho y deja que la IA cree tu estrategia.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">2</div>
                        <h4 className="text-white font-bold">Genera tu Landing</h4>
                        <p className="text-gray-500 text-xs">Usa el generador Pro para tener tu página lista en minutos.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">3</div>
                        <h4 className="text-white font-bold">Conecta tu Dominio</h4>
                        <p className="text-gray-500 text-xs">Dale el toque profesional final a tu embudo de ventas.</p>
                    </div>
                </div>
            </div>

            {/* Botón de Acción */}
            <button 
                onClick={() => navigate('/dashboard')}
                className="group relative px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-orange-500/20 hover:scale-105 active:scale-95 flex items-center gap-3"
            >
                Comenzar Ahora
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="mt-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
                Acceso inmediato a todas las funciones premium
            </p>
        </div>
    );
};
