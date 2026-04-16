import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Flame, AlertTriangle, Rocket, ArrowRight, Brain, Check, 
    Layout, Mail, MessageSquare, FileText, MousePointer2, 
    Sparkles, Zap, ShieldAlert, XCircle, 
    Target, Users, Globe, Play 
} from 'lucide-react';
import { api } from '../../../../services/api';
import { LandingPage } from '../../../../types';

interface ProjectStrategy_PsychologyProps {
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
    benefitsItems?: Array<{ title: string; desc?: string; description?: string }>;
}

export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ psychology, benefitsItems = [] }) => {
    const { id: projectId } = useParams() as { id: string };
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
        <div id="psd-psychology-section" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
            
            {/* Div agrupador para encabezado y video (seccion_encabezado) */}
            <div className="seccion_encabezado space-y-12">
                {/* --- HEADER SECCIÓN --- */}
                <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                    {/* Degradado superior sutil */}
                    <div className="absolute inset-x-0 -top-24 h-[600px] bg-orange-600/10 blur-[140px] -z-10 rounded-full" />
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                        <Flame className="w-4 h-4 fill-current" /> ¿Cómo persuadimos tus clientes?
                    </div>
                    
                    <div className="space-y-4 px-4">
                        <h3 id="psd-psychology-title" className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 tracking-tight leading-none">
                            Dolores vs Beneficios de tu cliente
                        </h3>
                        <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                            Comprar no es un acto racional, es un acto emocional que luego se justifica con lógica. Por eso, nuestra estrategia no vende características técnicas, vende la solución al dolor que no deja dormir a tu cliente.
                        </p>
                    </div>
                </div>

                {/* --- VIDEO EXPLICATIVO --- */}
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
                        const benefitDescription = benefit?.description || benefit?.desc;
                        
                        // Lógica de extracción de datos del nuevo objeto de solución
                        const solutionObj = psychology.solutions[i];
                        const solutionTitle = typeof solutionObj === 'object' ? solutionObj.title : solutionObj;
                        const solutionDesc = typeof solutionObj === 'object' ? solutionObj.description : null;

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
                                                {benefit ? benefit.title : (solutionTitle || "Transformación estratégica")}
                                            </p>
                                            {(benefitDescription || solutionDesc) && (
                                                <p className="text-emerald-200/70 text-[1.4rem] leading-[1.8] font-light italic">
                                                    {benefitDescription || solutionDesc}
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
        </div>
    );
};