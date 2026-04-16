import React from 'react';
import { Search, AlertCircle, Sparkles, Target, ShieldCheck, Brain, Zap, Magnet, Shield, Quote, Crown, MessageSquare, Check, Lock, GraduationCap, Flame, AlertTriangle, Rocket, ArrowRight, Users, Clock, Coffee, Heart, Play } from 'lucide-react';

interface ProjectStrategy_AvatarDiagnosisProps {
    avatars: any[];
    benefitsItems?: Array<{ title: string; desc: string }>;
    psychology: {
        pains: string[];
        solutions: any[]; // Se cambia de string[] a any[] para soportar el nuevo formato de objetos
        awarenessStages: {
            stage1_pain: string;
            stage2_solution: string;
            stage3_barrier: string;
        };
        conversionStrategy: {
            mainFocus: Array<{ label: string; description: string }>;
            tacticalNote: string;
        };
        psychographicProfile?: {
            ageRange: string;
            interests: string;
            primaryDesire: string;
            digitalBehavior: string;
            mainBarrier: string;
        };
    };
}

export const ProjectStrategy_AvatarDiagnosis: React.FC<ProjectStrategy_AvatarDiagnosisProps> = ({ avatars, psychology, benefitsItems = [] }) => {
    const getAvatarRoleBadge = (idx: number) => {
        const badges = [
            { label: "Avatar Principal — Perfil de Atracción", gradient: "from-pink-600 to-rose-600" },
            { label: "Avatar Secundario", gradient: "from-purple-600 to-indigo-600" },
            { label: "Avatar de Apoyo", gradient: "from-blue-600 to-cyan-600" }
        ];
        const badge = badges[idx] || badges[0];

        return (
            <div className={`absolute top-0 left-0 bg-gradient-to-r ${badge.gradient} text-white text-[10px] font-black px-6 py-2 rounded-br-2xl uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 z-20`}>
                <Crown className="w-3 h-3" /> {badge.label}
            </div>
        );
    };

    return (
        <div id="psd-avatar-diagnosis-section" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
            
            {/* Div agrupador para encabezado y video (seccion_encabezado) */}
            <div className="seccion_encabezado space-y-12">
                {/* --- HEADER SECCIÓN --- */}
                <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                    {/* Degradado superior sutil */}
                    <div className="absolute inset-x-0 -top-24 h-[600px] bg-pink-600/10 blur-[140px] -z-10 rounded-full" />
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]" />
                        <Users className="w-4 h-4" /> ¿Quién comprará mi producto digital?
                    </div>
                    
                    <div className="space-y-4 px-4">
                        <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
                            Descubriendo el ADN de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">comprador ideal</span>
                        </h3>
                        <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                            El 90% de los embudos fracasan porque el mensaje es demasiado genérico. Aquí tienes los 3 perfiles psicológicos exactos de las personas que realmente comprarán tu producto.
                        </p>
                    </div>
                </div>

                {/* --- VIDEO EXPLICATIVO --- */}
                <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                    <div className="inline-flex items-center gap-3 text-pink-300 font-extrabold uppercase tracking-widest text-sm bg-pink-500/5 px-8 py-4 rounded-2xl border border-pink-500/10 backdrop-blur-sm mx-auto">
                        <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                    </div>
                    
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                        
                        <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-pink-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial Avatar" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- LISTA DE AVATARES --- */}
            <div id="psd-avatars-list" className="space-y-16 max-w-[85em] mx-auto">
                {avatars.map((avatar: any, idx: number) => {
                    const isMain = idx === 0;

                    return (
                        <div key={avatar.id} className={`group relative bg-gray-900/60 backdrop-blur-md rounded-[3.5rem] border transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden hover:scale-[1.01] ${isMain ? 'border-pink-500/40' : idx === 1 ? 'border-purple-500/30' : 'border-blue-500/30'}`}>
                            
                            <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] opacity-10 pointer-events-none ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>

                            {getAvatarRoleBadge(idx)}

                            <div className="p-10 md:p-16">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-8">
                                    {/* Perfil Visual */}
                                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                                        <div className="relative mb-8">
                                            <div className={`absolute -inset-2 rounded-3xl blur-2xl opacity-40 animate-pulse ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                                            <div className="w-36 h-36 rounded-[2.5rem] bg-gray-800 border-2 border-white/10 flex items-center justify-center text-6xl shadow-2xl relative z-10 transform group-hover:rotate-3 transition-transform duration-500">
                                                {idx === 0 ? '👩‍🎨' : idx === 1 ? '👩‍💼' : '👩‍👧'}
                                            </div>
                                        </div>
                                        <h4 className="text-5xl font-black text-white leading-tight mb-4 tracking-tighter">{avatar.name}</h4>
                                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                            <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-gray-200 uppercase tracking-[0.1em]">{avatar.age}</span>
                                            <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-gray-200 uppercase tracking-[0.1em]">{avatar.archetype}</span>
                                        </div>
                                    </div>

                                    {/* Quote Section */}
                                    <div className="lg:col-span-7 flex flex-col justify-center">
                                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 relative group/quote hover:bg-white/[0.05] transition-all">
                                            <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5" />
                                            <p className="text-gray-100 italic text-2xl md:text-3xl leading-relaxed font-serif relative z-10 pl-6 border-l-4 border-amber-500/30 py-1">
                                                "{avatar.quote}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    {/* Pains & Solutions List (Now Left) */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-rose-500/[0.03] border-l-4 border-rose-500/20 p-8 rounded-r-[2.5rem] hover:bg-rose-500/[0.06] transition-colors group/card">
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-400 shadow-lg group-hover/card:scale-110 transition-transform"><AlertTriangle className="w-6 h-6" /></div>
                                                <p className="text-sm font-black text-rose-400 uppercase tracking-[0.2em]">Punto de Dolor Agudo</p>
                                            </div>
                                            <p className="text-gray-200 text-xl leading-relaxed font-medium mb-4">{avatar.pain}</p>
                                            
                                            {avatar.daily_manifestation && (
                                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mt-4 flex gap-3">
                                                    <Clock className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                                                    <p className="text-white text-xl leading-relaxed font-light">
                                                        <span className="font-bold text-rose-200 uppercase text-[10px] tracking-widest block mb-1">Manifestación Diaria</span>
                                                        "{avatar.daily_manifestation}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-emerald-500/[0.03] border-l-4 border-emerald-500/20 p-8 rounded-r-[2.5rem] hover:bg-emerald-500/[0.06] transition-colors group/card">
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 shadow-lg group-hover/card:scale-110 transition-transform"><Rocket className="w-6 h-6" /></div>
                                                <p className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em]">Transformación Deseada</p>
                                            </div>
                                            <p className="text-gray-200 text-xl leading-relaxed font-medium mb-4">{avatar.desire}</p>
                                            
                                            {avatar.emotional_reason && (
                                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mt-4 flex gap-3">
                                                    <Heart className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                                                    <p className="text-white text-xl leading-relaxed font-light">
                                                        <span className="font-bold text-rose-200 uppercase text-[10px] tracking-widest block mb-1">Para Qué Emocional</span>
                                                        "{avatar.emotional_reason}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Motivations & Strategy (Now Right) */}
                                    <div className="space-y-12">
                                        <div>
                                            <h5 className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                                <Zap className="w-5 h-5 text-yellow-500" /> Drivers de Decisión
                                            </h5>
                                            <div className="space-y-8">
                                                {Object.entries(avatar.motivations).map(([key, value]: any) => (
                                                    <div key={key} className="space-y-3">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-base text-gray-200 font-black uppercase tracking-widest">{key}</span>
                                                            <span className="text-sm font-mono text-white/40">{value}%</span>
                                                        </div>
                                                        <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                            <div 
                                                                className={`h-full rounded-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(255,255,255,0.1)] ${idx === 0 ? 'bg-gradient-to-r from-pink-600 to-rose-400' : idx === 1 ? 'bg-gradient-to-r from-purple-600 to-fuchsia-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} 
                                                                style={{width: `${value}%`}}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-[2rem] border-l-4 bg-blue-500/10 border-blue-500/20 flex gap-6 items-start hover:scale-[1.02] transition-transform">
                                            <div className="p-4 rounded-2xl bg-black/60 text-blue-400 shrink-0 shadow-2xl">
                                                <Lock className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-[0.2em] mb-2 text-blue-400">Barrera de Venta (Objeción)</p>
                                                <p className="text-white text-xl leading-relaxed font-light">{avatar.objection}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};