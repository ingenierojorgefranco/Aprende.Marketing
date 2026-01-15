
import React from 'react';
import { 
    Rocket, MessageCircle, Layout, PenTool, Search, 
    Zap, Mail, Target, GraduationCap, Clock, 
    ShieldCheck, Sparkles, ChevronRight, CheckCircle2 
} from 'lucide-react';

export const LaunchPage: React.FC = () => {
    const benefits = [
        { icon: Layout, title: "Embudos IA", desc: "Crea sistemas de venta automáticos que trabajan 24/7." },
        { icon: PenTool, title: "Copywriting", desc: "Textos persuasivos que tocan los dolores reales de tu avatar." },
        { icon: Search, title: "SEO Automático", desc: "Atrae tráfico gratis desde Google sin ser experto." },
        { icon: MessageCircle, title: "WhatsApp CRM", desc: "Cierra ventas por chat con guiones psicológicos." },
        { icon: Mail, title: "Email Marketing", desc: "Secuencias de nutrición que generan confianza y ventas." },
        { icon: Target, title: "Estrategia Nicho", desc: "Análisis profundo de mercado para dominar cualquier sector." },
        { icon: GraduationCap, title: "Academia VIP", desc: "Formación paso a paso de 0 a 100 en marketing digital." },
        { icon: Sparkles, title: "Soporte 24/7", desc: "Equipo de expertos listo para ayudarte en cada paso." }
    ];

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white font-sans overflow-x-hidden selection:bg-[#FF5A1F] selection:text-white">
            <style>{`
                @keyframes pulse-orange {
                    0% { box-shadow: 0 0 0 0 rgba(255, 90, 31, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(255, 90, 31, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 90, 31, 0); }
                }
                .animate-pulse-orange {
                    animation: pulse-orange 2s infinite;
                }
                .glass-card {
                    background: rgba(22, 22, 22, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
            `}</style>

            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF5A1F]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[150px]" />
            </div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 top-0 left-0 bg-black/60 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[#FF5A1F]/20">AM</div>
                        <span className="text-xl font-bold tracking-tight">Aprende.<span className="text-[#FF5A1F]">Marketing</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Modo Lanzamiento Activo</span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-40 pb-24">
                <div className="container mx-auto px-6">
                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center space-y-10">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-black uppercase tracking-[0.3em] mb-4">
                            <Sparkles className="w-4 h-4" /> La Revolución ha comenzado
                        </div>
                        
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.05] tracking-tight">
                            Prepárate para <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">Escalar tu Éxito</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light max-w-2xl mx-auto">
                            Estamos configurando los últimos algoritmos de IA para que tu negocio digital funcione en piloto automático. Únete a la lista de espera VIP ahora.
                        </p>

                        <div className="flex flex-col items-center gap-8 pt-8">
                            <a 
                                href="https://wa.me/message/YOUR_LINK" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative px-12 py-6 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 animate-pulse-orange"
                            >
                                <MessageCircle className="w-8 h-8 fill-current" />
                                UNIRME A LA LISTA DE ESPERA
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-bold">Acceso exclusivo vía WhatsApp</p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((b, i) => (
                            <div key={i} className="glass-card p-8 rounded-[2.5rem] group hover:border-[#FF5A1F]/30 transition-all duration-500 hover:-translate-y-2">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-500 text-gray-400">
                                    <b.icon className="w-7 h-7" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{b.title}</h4>
                                <p className="text-gray-400 leading-relaxed text-sm font-medium">{b.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-40 pt-20 border-t border-white/5 flex flex-col items-center text-center gap-8 opacity-40">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 100% Automatizado</div>
                            <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> IA Gemini 1.5 Pro</div>
                            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Seguridad Bancaria</div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Aprende.Marketing — Protocolo de Lanzamiento v2.0</p>
                    </div>
                </div>
            </main>
        </div>
    );
};
