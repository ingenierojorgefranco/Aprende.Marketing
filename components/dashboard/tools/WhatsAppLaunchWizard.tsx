
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Smartphone, Briefcase, ChevronRight, ArrowLeft, 
    Zap, Loader2, Sparkles, Wand2, Copy, 
    CheckCircle2, Clock, Info, Save, X, Trash2, Edit3, MessageCircle
} from 'lucide-react';
import { api } from '../../../services/api';
import { Project, User, WhatsAppLaunch, WhatsAppLaunchMessage } from '../../../types';

export const WhatsAppLaunchWizard: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlProjectId = searchParams.get('projectId');
    
    const [step, setStep] = useState(0); // 0: Select Project, 1: Edit
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeLaunch, setActiveLaunch] = useState<WhatsAppLaunch | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [activeMsgIdx, setActiveMsgIdx] = useState(0);
    const [saveIndicator, setSaveIndicator] = useState(false);

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            try {
                const data = await api.getProjects();
                setProjects(data);
                if (urlProjectId) {
                    const proj = data.find(p => p.id === urlProjectId);
                    if (proj) handleProjectSelect(proj);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, [urlProjectId]);

    const handleProjectSelect = async (project: Project) => {
        setSelectedProject(project);
        setLoading(true);
        try {
            // 1. Crear o recuperar el registro único
            await api.createWhatsAppLaunch(project.id, `Lanzamiento: ${project.name}`);
            
            // 2. Obtener los datos completos
            const launchData = await api.getWhatsAppLaunchByProject(project.id);
            setActiveLaunch(launchData);
            setStep(1);
        } catch (e) {
            console.error(e);
            alert("Error al inicializar el lanzamiento.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMessage = async (index: number, field: string, value: any) => {
        if (!activeLaunch) return;
        
        const newMessages = [...activeLaunch.messages];
        (newMessages[index] as any)[field] = value;
        
        const updatedLaunch = { ...activeLaunch, messages: newMessages };
        setActiveLaunch(updatedLaunch);
        
        setSaveIndicator(true);
        try {
            // Actualización asíncrona de la tabla única mediante su columna JSON
            await api.updateWhatsAppLaunch(activeLaunch.id, { messages: newMessages });
            setTimeout(() => setSaveIndicator(false), 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleGenerate = async () => {
        if (!activeLaunch) return;
        setGenerating(true);
        try {
            // Lógica de simulación de IA (Gemini sería invocado aquí con el contexto del proyecto)
            await new Promise(r => setTimeout(r, 2000));
            
            const msg = activeLaunch.messages[activeMsgIdx];
            const pName = selectedProject?.productName || "nuestro programa";
            
            let content = `*${msg.name}* (Momento: ${msg.momentText})\n\n¡Hola! 🎉 Soy el encargado de tu formación. Solo paso para confirmarte que ya tenemos fecha oficial para nuestra clase maestra de *${pName}*. Será el próximo domingo. ¿Ya lo anotaste en tu calendario?`;
            
            if (msg.id === 'wl7') {
                content = `🔴 *ESTAMOS EN VIVO*\n\nNo esperes más, entra ahora por este link exclusivo para el grupo: [LINK_CLASE]. ¡Te espero dentro! 🚀`;
            } else if (msg.id === 'wl8') {
                content = `¡Increíble la clase de hoy! 🎉\n\nComo les prometí, las inscripciones para *${pName}* están abiertas con una *Beca del 75%* de descuento. Solo para las primeras personas que tomen acción ahora mismo.`;
            }

            await handleUpdateMessage(activeMsgIdx, 'content', content);
            await handleUpdateMessage(activeMsgIdx, 'isGenerated', true);
        } catch (e) {
            alert("Error de generación con IA");
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!activeLaunch) return;
        navigator.clipboard.writeText(activeLaunch.messages[activeMsgIdx].content);
        alert("Copiado para WhatsApp");
    };

    if (loading && step === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-emerald-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">Cargando lanzamientos...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto bg-gray-900 rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden min-h-[600px] flex flex-col relative animate-in fade-in duration-500">
            {generating && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <div className="bg-[#0B0B0B] border border-white/10 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95">
                        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                        <p className="text-white font-black uppercase tracking-[0.3em] text-center text-sm">IA redactando tu mensaje...</p>
                    </div>
                </div>
            )}

            <div className="bg-emerald-500/10 p-8 text-center border-b border-emerald-500/10 shrink-0 relative">
                {step > 0 && (
                    <button 
                        onClick={() => { setStep(0); setSelectedProject(null); setActiveLaunch(null); }}
                        className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Cambiar Proyecto
                    </button>
                )}
                
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                    <Smartphone className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Gestor de Lanzamientos de WhatsApp</h2>
                {selectedProject && <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] mt-2">Proyecto: {selectedProject.name}</p>}
            </div>

            <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                {step === 0 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto py-10">
                        {projects.map((project) => (
                            <div 
                                key={project.id}
                                onClick={() => handleProjectSelect(project)}
                                className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left group flex flex-col shadow-2xl cursor-pointer relative overflow-hidden h-full"
                            >
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors shadow-inner">
                                        <Briefcase className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black text-2xl group-hover:text-emerald-500 transition-colors truncate">{project.name}</h4>
                                        <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-lg leading-relaxed font-medium mb-10 line-clamp-2">{project.shortDescription || "Sin descripción estratégica."}</p>
                                <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3">
                                    Gestionar Lanzamiento <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {step === 1 && activeLaunch && (
                    <div className="grid lg:grid-cols-12 gap-10 h-full">
                        {/* LISTA DE MOMENTOS */}
                        <div className="lg:col-span-4 bg-gray-900 p-6 rounded-[2.5rem] border border-gray-800 flex flex-col shadow-xl max-h-[700px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                {activeLaunch.messages.map((msg, idx) => (
                                    <div 
                                        key={msg.id}
                                        onClick={() => setActiveMsgIdx(idx)}
                                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${activeMsgIdx === idx ? 'bg-emerald-900/10 border-emerald-500/40' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${activeMsgIdx === idx ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{msg.momentText}</p>
                                            <h5 className={`font-bold truncate ${activeMsgIdx === idx ? 'text-white' : 'text-gray-400'}`}>{msg.name}</h5>
                                        </div>
                                        {msg.isGenerated && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* EDITOR DE MENSAJE */}
                        <div className="lg:col-span-8 bg-[#0B0B0B] border border-gray-800 rounded-[3rem] p-8 md:p-10 flex flex-col shadow-2xl relative">
                            {saveIndicator && (
                                <div className="absolute top-6 right-10 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Autoguardado
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white">{activeLaunch.messages[activeMsgIdx]?.name}</h3>
                                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">{activeLaunch.messages[activeMsgIdx]?.momentText}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleGenerate}
                                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                                    >
                                        <Wand2 className="w-4 h-4" /> {activeLaunch.messages[activeMsgIdx]?.isGenerated ? 'Regenerar con IA' : 'Generar con IA'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl mb-8 flex gap-4">
                                <Info className="w-6 h-6 text-emerald-400 shrink-0" />
                                <div>
                                    <span className="text-emerald-400 font-bold block mb-1 uppercase text-[10px] tracking-widest">Objetivo Estratégico</span>
                                    <p className="text-gray-400 text-sm leading-relaxed">{activeLaunch.messages[activeMsgIdx]?.objective}</p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Contenido del Mensaje (WhatsApp Format)</label>
                                <textarea 
                                    value={activeLaunch.messages[activeMsgIdx]?.content}
                                    onChange={(e) => handleUpdateMessage(activeMsgIdx, 'content', e.target.value)}
                                    className="flex-1 w-full bg-black border border-white/10 rounded-2xl p-6 text-gray-200 font-sans text-lg focus:border-emerald-500/50 outline-none transition-all resize-none custom-scrollbar"
                                    placeholder="Escribe o genera el mensaje persuasivo aquí..."
                                />
                                <div className="flex justify-between items-center mt-6">
                                    <p className="text-[10px] text-gray-600 italic">* Usa asteriscos para *negrita* y emojis para mayor impacto.</p>
                                    <button 
                                        onClick={handleCopy}
                                        disabled={!activeLaunch.messages[activeMsgIdx]?.content}
                                        className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-30"
                                    >
                                        <Copy className="w-4 h-4" /> Copiar para WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
