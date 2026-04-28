import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Flame, AlertTriangle, Brain, 
    Play, TrendingUp, UserCheck, CheckCircle2, Users, Sparkles,
    Target, Star, Zap, Lightbulb, Shield, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../../../services/api';
import { LandingPage } from '../../../../types';
import { ProjectMasterStrategy } from '../../../../services/strategySchema';

// Mapeo de iconos para renderizado dinámico
const IconMap: Record<string, React.ReactNode> = {
  Users: <Users />,
  Brain: <Brain />,
  Target: <Target />,
  CheckCircle2: <CheckCircle2 />,
  Sparkles: <Sparkles />,
  TrendingUp: <TrendingUp />,
  AlertTriangle: <AlertTriangle />,
  Lightbulb: <Lightbulb />,
  Zap: <Zap />,
  Star: <Star />,
  Shield: <Shield />,
  UserCheck: <UserCheck />
};

interface ProjectStrategy_PsychologyProps {
    strategy: ProjectMasterStrategy;
    benefitsItems?: Array<{ title: string; desc?: string; description?: string }>;
}

export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ strategy, benefitsItems = [] }) => {
    // Guardia de carga para evitar errores de desestructuración si la estrategia es null/undefined
    if (!strategy) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-400">Cargando análisis psicológico...</p>
                </div>
            </div>
        );
    }

    const { avatars = [], psychology = { pains: [], solutions: [], awarenessStages: { stage1_pain: '', stage2_solution: '', stage3_barrier: '' }, conversionStrategy: { mainFocus: [], tacticalNote: '' }, learningModules: [] } } = strategy;

    const learningModules = (psychology.learningModules && psychology.learningModules.length > 0) 
        ? psychology.learningModules 
        : (psychology.solutions || []).map((sol: any, idx: number) => ({
            title: typeof sol === 'object' ? sol.title : "Módulo de aprendizaje",
            description: typeof sol === 'object' ? sol.description : sol,
            icon: idx % 3 === 0 ? 'Brain' : idx % 3 === 1 ? 'Target' : 'Zap',
            color: idx < 3 ? 'text-blue-400' : idx < 6 ? 'text-emerald-400' : 'text-purple-400',
            bg: idx < 3 ? 'bg-blue-500/10' : idx < 6 ? 'bg-emerald-500/10' : 'bg-purple-500/10',
            border: idx < 3 ? 'border-blue-500/20' : idx < 6 ? 'border-emerald-500/20' : 'border-purple-500/20',
            glow: idx < 3 ? 'hover:shadow-blue-500/10' : idx < 6 ? 'hover:shadow-emerald-500/10' : 'hover:shadow-purple-500/10'
        }));

    return (
        <div id="psd-psychology-section" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
            
            <div className="seccion_encabezado space-y-12">
                <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                    <div className="absolute inset-x-0 -top-24 h-[600px] bg-orange-600/10 blur-[140px] -z-10 rounded-full" />
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                        <Flame className="w-4 h-4 fill-current" /> ¿Cómo persuadimos tus clientes?
                    </div>
                    
                    <div className="space-y-4 px-4">
                        <h3 id="psd-psychology-title" className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 tracking-tight leading-none">
                            Psicología y Estrategia de Persuasión
                        </h3>
                        <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                            Comprar no es un acto racional, es un acto emocional que luego se justifica con lógica. Por eso, nuestra estrategia no vende características técnicas, vende la solución al dolor que no deja dormir a tu cliente.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                    <div className="inline-flex items-center gap-3 text-orange-300 font-extrabold uppercase tracking-widest text-sm bg-orange-500/5 px-8 py-4 rounded-2xl border border-orange-500/10 backdrop-blur-sm mx-auto">
                        <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                    </div>
                    
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-rose-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                        
                        <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-orange-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial Psychology" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* --- SECCIÓN DINÁMICA: ESTA CLASE ES PARA TI SI... --- */}
            <div className="max-w-[75em] mx-auto px-6 text-center mt-32 space-y-16">
                <h2 className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight tracking-tight">Esta clase es para ti si...</h2>
                
                <div className="flex flex-col gap-16 text-left">
                    {avatars.map((avatar, idx) => (
                        <div key={avatar.id} className={`relative p-12 md:p-20 rounded-[4rem] border border-white/10 ${avatar.name.includes('Mónica') ? 'bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#090e1a] hover:shadow-blue-500/10' : avatar.name.includes('Ana') ? 'bg-gradient-to-br from-[#061a14] via-[#04120e] to-[#030d0a] hover:shadow-emerald-500/10' : 'bg-gradient-to-br from-[#1a0b2e] via-[#12061d] to-[#0f041d] hover:shadow-purple-500/10'} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-2 group overflow-hidden backdrop-blur-sm`}>
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
                               {avatar.name.includes('Mónica') ? <TrendingUp size={300} /> : avatar.name.includes('Ana') ? <UserCheck size={300} /> : <Sparkles size={300} />}
                            </div>
                            
                            <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
                                <div className="space-y-10 flex-1">
                                    <div className="flex flex-col gap-6">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${avatar.name.includes('Mónica') ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' : avatar.name.includes('Ana') ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200' : 'bg-purple-500/20 border-purple-500/30 text-purple-200'} border text-xs font-bold uppercase tracking-widest w-fit`}>
                                            <Users className="w-3.5 h-3.5" /> Avatar: {avatar.name}
                                        </div>
                                        <div className="w-28 h-28 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                                            {avatar.name.includes('Mónica') ? <TrendingUp className="w-10 h-10 text-blue-400" /> : avatar.name.includes('Ana') ? <UserCheck className="w-10 h-10 text-emerald-400" /> : <Sparkles className="w-10 h-10 text-purple-400" />}
                                        </div>
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                                        {idx === 0 ? "Si buscas crear tu propio negocio y reinventarte profesionalmente" : idx === 1 ? "Si ya estás en el sector belleza y quieres dominar la técnica más top" : "Si te da miedo fallar por falta de experiencia pero buscas respaldo"}
                                    </h3>
                                </div>
                                
                                <div className="lg:w-[45%] space-y-8 lg:pl-16 lg:border-l border-white/10">
                                    {(psychology.pains.some(p => typeof p !== 'string' && p.avatarId === avatar.id) 
                                        ? psychology.pains.filter(p => typeof p !== 'string' && p.avatarId === avatar.id).map(p => (typeof p === 'string' ? p : p.text))
                                        : [avatar.pain]
                                    ).map((painPoint, pIdx) => (
                                        <div key={pIdx} className="flex gap-6">
                                            <div className="mt-3 shrink-0">
                                                <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${avatar.name.includes('Mónica') ? 'from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.8)]' : avatar.name.includes('Ana') ? 'from-emerald-600 to-green-500 shadow-[0_0_20px_rgba(5,150,105,0.8)]' : 'from-purple-600 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]'}`}></div>
                                            </div>
                                            <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">{painPoint}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECCIÓN DINÁMICA: LO QUE APRENDERÁS EN NUESTRA CLASE */}
            <div className="max-w-[75em] mx-auto px-6 text-center mt-32 space-y-16">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight tracking-tight">Lo que aprenderás en nuestra clase</h2>
                    <div className={`h-1.5 w-24 rounded-full mx-auto bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]`}></div>
                </div>

                <div className="grid gap-8 md:grid-cols-3 text-left">
                    {learningModules.map((item, idx) => (
                        <div key={idx} className={`relative p-10 rounded-[3.5rem] border bg-gradient-to-br ${item.bg} ${item.border} shadow-2xl transition-all duration-700 group overflow-hidden ${item.glow} backdrop-blur-sm hover:-translate-y-2`}>
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-125 transition-all duration-700 pointer-events-none">
                                {IconMap[item.icon] && React.cloneElement(IconMap[item.icon] as any, { size: 180 })}
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                    {IconMap[item.icon] && React.cloneElement(IconMap[item.icon] as any, { size: 32, className: item.color })}
                                </div>
                                <h3 className="text-[1.6rem] font-black text-white leading-tight uppercase tracking-tight">{item.title}</h3>
                                <p className="text-gray-300 text-[1.1rem] leading-relaxed font-medium">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20">
                    <button className="px-12 py-6 rounded-[2rem] bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-2xl shadow-[0_15px_40px_rgba(168,85,247,0.4)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.6)] transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 group flex items-center gap-4 mx-auto">
                        QUIERO ACCEDER A LA CLASE GRATIS
                        <CheckCircle2 className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};