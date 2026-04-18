import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Flame, AlertTriangle, Rocket, ArrowRight, Brain, Check, 
    Layout, Mail, MessageSquare, FileText, MousePointer2, 
    Sparkles, Zap, ShieldAlert, XCircle, 
    Target, Users, Globe, Play, TrendingUp, UserCheck
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

            {/* --- SECCIÓN QUEMADA: ESTA CLASE ES PARA TI SI... --- */}
            <div className="max-w-[75em] mx-auto px-6 text-center mt-32 space-y-16">
                <h2 className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight tracking-tight">Esta clase es para ti si...</h2>
                
                <div className="flex flex-col gap-16 text-left">
                    {/* Perfil 1 */}
                    <div className="relative p-12 md:p-20 rounded-[4rem] border border-white/10 bg-gradient-to-br from-[#1a0b2e] via-[#12061d] to-[#0f041d] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] hover:shadow-purple-500/10 transition-all duration-700 hover:-translate-y-2 group overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
                           <Sparkles size={300} />
                        </div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
                            <div className="space-y-10 flex-1">
                                <div className="flex flex-col gap-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-widest w-fit">
                                        <Users className="w-3.5 h-3.5" /> Avatar: Laura — La Emprendedora
                                    </div>
                                    <div className="w-28 h-28 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                                        <Sparkles className="w-10 h-10 text-purple-400" />
                                    </div>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">Si buscas crear tu propio negocio y reinventarte profesionalmente</h3>
                            </div>
                            
                            <div className="lg:w-[45%] space-y-8 lg:pl-16 lg:border-l border-white/10">
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Sientes que es el momento de dejar de trabajar para otros y construir algo propio.</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Buscas una habilidad rentable que puedas iniciar desde cero sin complicaciones.</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Deseas libertad de tiempo para disfrutar con tu familia mientras generas ingresos altos.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Perfil 2 */}
                    <div className="relative p-12 md:p-20 rounded-[4rem] border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#090e1a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] hover:shadow-blue-500/10 transition-all duration-700 hover:-translate-y-2 group overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
                           <TrendingUp size={300} />
                        </div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
                            <div className="space-y-10 flex-1">
                                <div className="flex flex-col gap-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-widest w-fit">
                                        <Users className="w-3.5 h-3.5" /> Avatar: Mónica — La Profesional
                                    </div>
                                    <div className="w-28 h-28 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                                        <TrendingUp className="w-10 h-10 text-blue-400" />
                                    </div>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">Si ya estás en el sector belleza y quieres dominar la técnica más top</h3>
                            </div>
                            
                            <div className="lg:w-[45%] space-y-8 lg:pl-16 lg:border-l border-white/10">
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Quieres diferenciarte de la competencia ofreciendo resultados ultra-naturales.</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Buscas aumentar el ticket promedio de tus servicios con procedimientos de alto valor.</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Necesitas perfeccionar tu técnica para ganar la confianza total de tus clientes.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Perfil 3 */}
                    <div className="relative p-12 md:p-20 rounded-[4rem] border border-white/10 bg-gradient-to-br from-[#061a14] via-[#04120e] to-[#030d0a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] hover:shadow-emerald-500/10 transition-all duration-700 hover:-translate-y-2 group overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
                           <UserCheck size={300} />
                        </div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
                            <div className="space-y-10 flex-1">
                                <div className="flex flex-col gap-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-widest w-fit">
                                        <Users className="w-3.5 h-3.5" /> Avatar: Ana — La Mamá Reinventora
                                    </div>
                                    <div className="w-28 h-28 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                                        <UserCheck className="w-10 h-10 text-emerald-400" />
                                    </div>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">Si te da miedo fallar por falta de experiencia pero buscas respaldo</h3>
                            </div>
                            
                            <div className="lg:w-[45%] space-y-8 lg:pl-16 lg:border-l border-white/10">
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 shadow-[0_0_20px_rgba(5,150,105,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Te preocupa no tener 'talento' artístico, pero buscas un método paso a paso probado.</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 shadow-[0_0_20px_rgba(5,150,105,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Tienes miedo a realizar una inversión y no recuperar el dinero rápidamente.</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="mt-3 shrink-0">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 shadow-[0_0_20px_rgba(5,150,105,0.8)]"></div>
                                    </div>
                                    <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">Buscas una certificación que realmente te abra puertas en el mercado profesional.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};