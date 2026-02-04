import React, { useState } from 'react';
import { Search, AlertCircle, Sparkles, Target, ShieldCheck, Brain, Zap, Magnet, Shield, Quote, Crown, MessageSquare, X, Check, Lock, GraduationCap, Flame, AlertTriangle, Rocket, ArrowRight, Users, Clock, Coffee, Heart, PlayCircle } from 'lucide-react';

interface ProjectStrategy_AvatarDiagnosisProps {
    avatars: any[];
    benefitsItems?: Array<{ title: string; desc: string }>;
    psychology: {
        pains: string[];
        solutions: string[];
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

export const ProjectStrategy_AvatarDiagnosis: React.FC<ProjectStrategy_AvatarDiagnosisProps> = ({ avatars, psychology, benefitsItems }) => {
    const [showVideoModal, setShowVideoModal] = useState(false);

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
        <div id="psd-avatar-diagnosis-section" className="space-y-16">
            
            {/* --- CABECERA ESTILO BLUEPRINT --- */}
            <div id="psd-integrated-avatars-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-500/5">
                    <Users className="w-5 h-5" /> ¿Quién comprará mi producto digital?
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Descubriendo el ADN de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">comprador ideal</span>
                </h3>
                
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-pink-500 pl-8 py-2">
                        El 90% de los embudos fracasan porque el mensaje es demasiado genérico. Aquí tienes los 3 perfiles psicológicos exactos de las personas que realmente comprarán tu producto.
                    </p>
                    <div className="hidden md:block w-px h-24 bg-purple-500/30"></div>
                    <div 
                        onClick={() => setShowVideoModal(true)}
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group cursor-pointer"
                    >
                        <img 
                        src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-10 h-10 text-pink-400" />
                            </div>
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

            {/* MODAL DE VIDEO */}
            {showVideoModal && (
                <div 
                    onClick={() => setShowVideoModal(false)}
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
                    >
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-emerald-500" /> Tutorial: Diagnóstico de Avatar
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Tutorial Avatar" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};