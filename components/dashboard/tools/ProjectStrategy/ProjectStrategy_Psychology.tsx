import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Flame, AlertTriangle, Rocket, ArrowRight, Brain, Check, 
    Layout, Mail, MessageSquare, FileText, MousePointer2, 
    Sparkles, Zap, ShieldAlert, XCircle, PlayCircle, 
    Target, Users, X, Globe 
} from 'lucide-react';
import { api } from '../../../../services/api';
import { LandingPage } from '../../../../types';

interface ProjectStrategy_PsychologyProps {
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
    benefitsItems?: Array<{ title: string; desc: string }>;
}

export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ psychology, benefitsItems }) => {
    const { id: projectId } = useParams() as { id: string };
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [linkedLanding, setLinkedLanding] = useState<LandingPage | null>(null);

    useEffect(() => {
        const checkLanding = async () => {
            if (!projectId) return;
            try {
                const pages = await api.getPages();
                const found = pages.find(p => String(p.projectId) === String(projectId));
                setLinkedLanding(found || null);
            } catch (e) {
                console.error("Error checking landing", e);
            }
        };
        checkLanding();
    }, [projectId]);

    return (
        <div id="psd-psychology-section" className="space-y-16">
            
            {/* --- ENCABEZADO ESTRATÉGICO DE CLASE MUNDIAL --- */}
            <div id="psd-psychology-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                    <Flame className="w-5 h-5 fill-current" /> ¿Cómo persuadimos tus clientes?
                </div>
                
                <h3 id="psd-psychology-title" className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 leading-tight tracking-tight max-w-4xl">
                    Dolores vs Beneficios de tu cliente
                </h3>

                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-orange-500/30 pl-8 py-2">
                        Comprar no es un acto racional, es un acto emocional que luego se justifica con lógica. Por eso, nuestra estrategia no vende características técnicas, vende la solución al dolor que no deja dormir a tu cliente.
                    </p>
                    <div className="hidden md:block w-px h-24 bg-rose-500/30"></div>
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
                                <PlayCircle className="w-10 h-10 text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* --- SISTEMA DE ESPEJO: DOLOR VS SOLUCIÓN --- */}
            <div id="psd-mirror-container" className="max-w-[70em] mx-auto">
                <div className="space-y-10">
                    
                    {/* Headers del espejo (Grid para mantener alineación) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 px-8 py-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                                <AlertTriangle className="w-6 h-6 text-rose-500" />
                                <span className="text-rose-400 font-black uppercase tracking-[0.2em] text-sm">Dolores de tu Cliente</span>
                            </div>
                            {linkedLanding && (
                                <a 
                                    href={`/admin/lp/${linkedLanding.subdomain.split('.')[0]}#dolores`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-lg shadow-[#FF5A1F]/20 transition-all text-xs font-black uppercase tracking-widest"
                                >
                                    <Globe className="w-3.5 h-3.5" /> Ver en mi Landing Page <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 px-8 py-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                                <Rocket className="w-6 h-6 text-emerald-500" />
                                <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-sm">Beneficios del Producto Digital</span>
                            </div>
                            {linkedLanding && (
                                <a 
                                    href={`/admin/lp/${linkedLanding.subdomain.split('.')[0]}#beneficios`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-lg shadow-[#FF5A1F]/20 transition-all text-xs font-black uppercase tracking-widest"
                                >
                                    <Globe className="w-3.5 h-3.5" /> Ver en mi Landing Page <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Mapeo del espejo por filas relativas */}
                    {psychology.pains.map((pain, i) => {
                        const benefit = (benefitsItems && benefitsItems[i]) ? benefitsItems[i] : null;
                        
                        return (
                            <div key={i} className="relative grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 group/row">
                                {/* Flecha Conectora Central (Solo Desktop) */}
                                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gray-900 border border-gray-800 items-center justify-center text-gray-500 group-hover/row:text-orange-500 group-hover/row:border-orange-500/50 group-hover/row:scale-110 transition-all duration-500 shadow-2xl">
                                    <ArrowRight className="w-6 h-6" />
                                </div>

                                {/* Bloqueo (Dolor) */}
                                <div className="relative group/mirror">
                                    <div className="bg-gray-900/40 border border-gray-800 group-hover/mirror:border-rose-500/30 p-8 rounded-[2rem] transition-all duration-500 h-full flex items-center shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 opacity-20 group-hover/mirror:opacity-100 transition-opacity"></div>
                                        <p className="text-gray-300 text-[1.4rem] leading-[1.8] font-normal">
                                            "{pain}"
                                        </p>
                                    </div>
                                </div>

                                {/* Argumento (Cura) */}
                                <div className="relative group/solution">
                                    <div className="bg-gray-900/40 border border-gray-800 group-hover/solution:border-emerald-500/30 p-8 rounded-[2rem] transition-all duration-500 h-full flex items-center shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 opacity-20 group-hover/solution:opacity-100 transition-opacity"></div>
                                        <div className="absolute -left-14 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 rounded-lg hidden md:block opacity-0 group-hover/solution:opacity-100 transition-opacity">
                                            <Check className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-emerald-50 text-[1.4rem] leading-[1.8] font-bold">
                                                {benefit ? benefit.title : (psychology.solutions[i] || "Transformación estratégica")}
                                            </p>
                                            {benefit?.desc && (
                                                <p className="text-emerald-200/70 text-[1.4rem] leading-[1.8] font-light italic">
                                                    {benefit.desc}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
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
                                <PlayCircle className="w-5 h-5 text-emerald-500" /> Tutorial: Psicología de Ventas
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Tutorial Psicología" 
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