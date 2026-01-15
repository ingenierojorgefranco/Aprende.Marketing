import React, { useState } from 'react';
import { 
    Activity, Globe, Mail, FileText, MessageSquare, 
    Zap, Sparkles, ChevronRight, CheckCircle2, 
    // Added missing ArrowRight and Wand2 icons
    AlertCircle, Rocket, Brain, MousePointer2, ExternalLink, ArrowRight, Wand2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingPage, EmailSequence, Article } from '../../../../types';
import { Generator } from '../Generator';
import { api } from '../../../../services/api';

interface ProjectStrategy_EcosystemProps {
    projectId: string;
    linkedPages: LandingPage[];
    linkedSequences: EmailSequence[];
    linkedArticles: Article[];
    onNavigate: (section: string) => void;
    onRefresh: () => Promise<void>;
}

export const ProjectStrategy_Ecosystem: React.FC<ProjectStrategy_EcosystemProps> = ({
    projectId,
    linkedPages,
    linkedSequences,
    linkedArticles,
    onNavigate,
    onRefresh
}) => {
    const navigate = useNavigate();
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);

    const handlePageGenerated = async (page: LandingPage) => {
        try {
            const savedPage = await api.createPage(page);
            await onRefresh();
            setShowGeneratorModal(false);
            navigate(`/dashboard/editor/${savedPage.id}`);
        } catch (e: any) {
            alert(`Error guardando la página: ${e.message}`);
        }
    };

    const assets = [
        {
            id: 'web',
            title: 'Landing Pages',
            desc: 'Tus páginas de captura y venta directa.',
            icon: Globe,
            count: linkedPages.length,
            targetCount: 1,
            isReady: linkedPages.length > 0,
            path: `/dashboard/pages`,
            section: 'web'
        },
        {
            id: 'content',
            title: 'Artículos SEO',
            desc: 'Contenido estratégico para atraer tráfico gratis.',
            icon: FileText,
            count: linkedArticles.length,
            targetCount: 2,
            isReady: linkedArticles.length >= 2,
            path: `/dashboard/articles`,
            section: 'content'
        },
        {
            id: 'email',
            title: 'Secuencia de Email',
            desc: 'Correos de nutrición y cierre automático.',
            icon: Mail,
            count: linkedSequences.length > 0 ? (linkedSequences[0].generatedDays?.length || 0) : 0,
            targetCount: 7,
            isReady: linkedSequences.length > 0 && linkedSequences[0].generatedDays?.length === 7,
            path: `/dashboard/email`,
            section: 'email'
        },
        {
            id: 'whatsapp',
            title: 'Scripts WhatsApp',
            desc: 'Guiones persuasivos para cierre uno a uno.',
            icon: MessageSquare,
            count: 1, // Simulado por ahora
            targetCount: 1,
            isReady: true,
            path: `/dashboard/whatsapp`,
            section: 'whatsapp'
        }
    ];

    const StatusBadge = ({ isReady }: { isReady: boolean }) => (
        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg flex items-center gap-2 ${
            isReady 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/5' 
            : 'bg-gray-800 text-gray-500 border-white/5'
        }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`}></div>
            {isReady ? 'Listo' : 'Pendiente'}
        </div>
    );

    return (
        <>
            <div id="psd-ecosystem-section" className="space-y-16 animate-in fade-in duration-700">
                
                {/* HEADER DEL CENTRO DE MANDO */}
                <div id="psd-ecosystem-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-[#FF5A1F]/5">
                        <Activity className="w-5 h-5" /> Centro de Mando de Activos
                    </div>
                    <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                        Tu Maquinaria de Ventas: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-400">Estado Real</span>
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-xl leading-relaxed font-light">
                        <p className="border-l-4 border-[#FF5A1F] pl-8 py-2">
                            Desde aquí puedes supervisar el despliegue de tu ecosistema estratégico. Cada tarjeta representa un activo vital que la IA ha diseñado para tu proyecto.
                        </p>
                        <p className="border-l-4 border-gray-700 pl-8 py-2">
                            Asegúrate de completar todos los elementos para activar la máxima potencia de conversión de tu sistema. Lo que no esté listo, puedes generarlo con un clic.
                        </p>
                    </div>
                </div>

                {/* BOTÓN MAESTRO AUTOPILOT */}
                <div className="max-w-[70em] mx-auto">
                    <button 
                        onClick={() => setShowGeneratorModal(true)}
                        className="w-full group bg-gradient-to-r from-[#FF5A1F] to-orange-600 p-1 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.01] active:scale-95"
                    >
                        <div className="bg-[#0B0B0B] rounded-[2.4rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Rocket className="w-40 h-40 text-white" />
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="p-5 bg-[#FF5A1F]/20 text-[#FF5A1F] rounded-3xl border border-[#FF5A1F]/30 shadow-inner group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-500">
                                    <Zap className="w-10 h-10 fill-current" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-3xl font-black text-white leading-tight">Generar Ecosistema Completo</h4>
                                    <p className="text-gray-400 text-lg font-medium mt-1">Nuestra IA redactará automáticamente todos tus activos faltantes.</p>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-center gap-4 text-white font-black uppercase tracking-[0.2em] text-sm group-hover:translate-x-2 transition-transform duration-500">
                                Iniciar Piloto Automático <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                    </button>
                </div>

                {/* CUADRÍCULA DE ACTIVOS */}
                <div className="max-w-[85em] mx-auto bg-[#090909] rounded-[4rem] p-10 md:p-16 border border-white/5 relative overflow-hidden shadow-2xl">
                    {/* Background Decor */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 relative z-10">
                        {assets.map((asset) => (
                            <div 
                                key={asset.id}
                                className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 hover:border-[#FF5A1F]/30 transition-all duration-500 flex flex-col group shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`p-5 rounded-[2rem] bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-500 shadow-lg`}>
                                        <asset.icon className="w-10 h-10" />
                                    </div>
                                    <StatusBadge isReady={asset.isReady} />
                                </div>

                                <div className="flex-1 space-y-3">
                                    <h4 className="text-3xl font-black text-white tracking-tight">{asset.title}</h4>
                                    <p className="text-gray-400 text-lg font-medium leading-relaxed">{asset.desc}</p>
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Completitud</span>
                                        <span className="text-white font-mono font-bold text-sm">{asset.count} / {asset.targetCount}</span>
                                    </div>
                                    <div className="w-full bg-black h-2 rounded-full overflow-hidden mb-8 border border-white/5 shadow-inner">
                                        <div 
                                            className={`h-full transition-all duration-[1500ms] ease-out rounded-full ${asset.isReady ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-[#FF5A1F] shadow-[0_0_15px_rgba(255,90,31,0.5)]'}`} 
                                            style={{ width: `${Math.min(100, (asset.count / asset.targetCount) * 100)}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex gap-4">
                                        {asset.isReady ? (
                                            <button 
                                                onClick={() => onNavigate(asset.section)}
                                                className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" /> Ver Activo
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => asset.id === 'web' ? setShowGeneratorModal(true) : navigate(asset.path)}
                                                className="flex-1 py-4 bg-[#FF5A1F] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#D94A1E] transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-2"
                                            >
                                                <Wand2 className="w-4 h-4" /> Generar con IA
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => onNavigate(asset.section)}
                                            className="p-4 bg-black/40 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DISTRIBUCIÓN DE INTELIGENCIA (Bloque Transmutado) */}
                    <div className="mt-20 pt-16 border-t border-white/5 relative z-10">
                        <div className="grid md:grid-cols-12 gap-12 items-center">
                            <div className="md:col-span-8 space-y-6">
                                <h5 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Brain className="w-6 h-6 text-purple-400" /> Distribución de Inteligencia
                                </h5>
                                <p className="text-gray-400 text-lg font-light leading-relaxed">
                                    Tu ecosistema no es una colección de textos aislados. Es una red conectada donde la IA ha inyectado los dolores, miedos y deseos de tu avatar in cada punto de contacto. Al completar todos los activos, creas una experiencia de venta fluida que derriba objeciones en piloto automático.
                                </p>
                            </div>
                            <div className="md:col-span-4 flex flex-col gap-3">
                                <div className="p-6 rounded-3xl bg-[#FF5A1F]/5 border border-[#FF5A1F]/10 flex flex-col items-center text-center">
                                    <Sparkles className="w-8 h-8 text-[#FF5A1F] mb-3" />
                                    <p className="text-white font-bold text-sm uppercase tracking-widest">Sincronización Total</p>
                                    <p className="text-gray-500 text-xs mt-1">Semántica optimizada 100%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GENERATOR MODAL OVERLAY */}
            {showGeneratorModal && (
                <div 
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300"
                    onClick={() => setShowGeneratorModal(false)}
                >
                    <div 
                        className="w-full max-w-[1200px] h-[95vh] overflow-hidden rounded-[3rem] shadow-2xl relative border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Generator 
                            onPageGenerated={handlePageGenerated} 
                            embeddedProjectId={projectId} 
                            onClose={() => setShowGeneratorModal(false)}
                        />
                    </div>
                </div>
            )}

            {/* FOOTER INFORMATIVO */}
            <div className="max-w-[70em] mx-auto text-center opacity-30 pt-10 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sistema Estratégico AM v2.9 — Protocolo Mission Control Activo</p>
            </div>
        </>
    );
};