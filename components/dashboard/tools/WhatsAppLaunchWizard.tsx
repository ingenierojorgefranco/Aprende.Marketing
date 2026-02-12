import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams, useOutletContext } from 'react-router-dom';
import { 
    Smartphone, Briefcase, ChevronRight, ArrowLeft, 
    Zap, Loader2, Sparkles, Wand2, Copy, 
    CheckCircle2, Clock, Info, Save, X, Trash2, Edit3, MessageCircle,
    Lightbulb, Settings2, User as UserIcon, Smartphone as WaIcon, ChevronDown, Check, Lock
} from 'lucide-react';
import { api } from '../../../services/api';
import { Project, User, WhatsAppLaunch, WhatsAppLaunchMessage } from '../../../types';
import { generateWhatsAppMessage } from '../../../services/geminiservices/whatsappService';

// Estructura estática de los 14 momentos para visualización persuasiva local
const WHATSAPP_LAUNCH_MOMENTS = [
    { id: 'wl1', name: 'Bienvenida y Confirmación de Fecha', momentText: 'Día -7', objective: 'Confirmar lugar, dar gracias, fijar fecha/hora.', pilarType: 'Seguridad', purpose: 'Confirmar que están en el lugar correcto, dar las gracias y fijar la fecha/hora del evento en el calendario mental del usuario.' },
    { id: 'wl2', name: 'Historia de Autoridad (Storytelling)', momentText: 'Día -5', objective: 'Conectar emocionalmente con la experta.', pilarType: 'Empatía y Confianza', purpose: 'Quién es el experto, sus fracasos iniciales y cómo el método que va a enseñar cambió su vida. Humaniza la marca.' },
    { id: 'wl3', name: 'El "Qué" vs el "Cómo" (Curiosidad)', momentText: 'Día -3', objective: 'Elevar el valor percibido de la clase.', pilarType: 'Valor Percibido', purpose: 'Revelar los temas que se verán en la clase. Prometer un secreto o técnica específica que no encontrarán en YouTube.' },
    { id: 'wl4', name: 'Los 3 Errores Fatales', momentText: 'Día -1', objective: 'Entregar valor previo para generar compromiso.', pilarType: 'Conciencia del Dolor', purpose: 'Identificar qué están haciendo mal los leads hoy. Esto posiciona al experto como la única solución para dejar de perder tiempo/dinero.' },
    { id: 'wl5', name: 'Recordatorio Matutino', momentText: 'Día Clase (AM)', objective: 'Recordatorio matutino.', pilarType: 'Entusiasmo', purpose: '¡Llegó el día!. Confirmar horarios por países para evitar confusiones.' },
    { id: 'wl6', name: 'Instrucciones de Preparación (T-4h)', momentText: 'Día Clase (PM)', objective: 'Instrucciones de preparación.', pilarType: 'Compromiso', purpose: 'Pedir que preparen libreta, café y eliminen distracciones. Crea un ritual en torno a la clase.' },
    { id: 'wl7', name: '¡Estamos en Vivo! (El Link)', momentText: 'Día Clase (Link)', objective: 'Acceso directo a la transmisión.', pilarType: 'Acción Inmediata', purpose: 'Enlace directo a YouTube/Zoom/VSL. Corto, al grano y con muchos emojis de alerta.' },
    { id: 'wl8', name: 'Apertura de Carrito y Oferta Irresistible', momentText: 'Post-Clase', objective: 'Apertura de inscripciones.', pilarType: 'Lanzamiento', purpose: 'Revelar el precio especial de lanzamiento, los bonos y el enlace de Hotmart.' },
    { id: 'wl9', name: 'Bonos de Acción Rápida (Urgencia)', momentText: 'Urgencia 1', objective: 'Presión por los regalos exclusivos.', pilarType: 'Beneficio extra', purpose: 'Regalo extra solo para las primeras X personas que compren en las próximas 2 horas.' },
    { id: 'wl10', name: 'Tutorial de Pago y Soporte', momentText: 'Soporte', objective: 'Eliminar fricción técnica en el checkout.', pilarType: 'Eliminación de Fricción', purpose: 'Explicar cómo pagar (tarjeta, PayPal, efectivo) y dejar el link de contacto directo para dudas.' },
    { id: 'wl11', name: 'Prueba Social Dinámica', momentText: 'Validación', objective: 'Validación de resultados.', pilarType: 'Validación', purpose: 'Mostrar capturas de pantalla de nuevos alumnos o testimonios rápidos. "Si ellos pudieron, tú también".' },
    { id: 'wl12', name: 'Garantía y Seguridad', momentText: 'Garantía', objective: 'Seguridad y aval profesional.', pilarType: 'Riesgo Cero', purpose: 'Recordar los 7 o 15 días de garantía de Hotmart. Derriba el miedo al fraude.' },
    { id: 'wl13', name: 'Última Llamada (Faltan 4 horas)', momentText: 'Cierre', objective: 'Escasez máxima y resolución de dudas.', pilarType: 'Escasez Real', purpose: 'El contador llega a cero. Los bonos desaparecen y el precio subirá.' },
    { id: 'wl14', name: 'Inscripciones Cerradas y Bienvenida', momentText: 'Bienvenida', objective: 'Bienvenida a las nuevas alumnas.', pilarType: 'Integridad de Marca', purpose: 'Avisar que ya no se puede comprar. Da la bienvenida oficial a los nuevos alumnos (onboarding).' }
];

// Professional WhatsApp Chat Simulator Component
const ChatSimulator: React.FC<{ text: string; senderName: string; onMessageChange?: (text: string) => void }> = ({ text, senderName, onMessageChange }) => {
    const renderWhatsAppText = (raw: string) => {
        if (!raw) return null;
        const parts = raw.split(/(\*[^\*]+\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                return <span key={i} className="font-bold">{part.slice(1, -1)}</span>;
            }
            return part;
        });
    };

    return (
        <div className="bg-[#0b141a] rounded-[2rem] overflow-hidden border border-gray-800 flex flex-col h-[500px] font-sans text-sm shadow-2xl relative">
            <div className="bg-[#202c33] p-4 flex items-center gap-3 border-b border-gray-700 shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-lg shadow-lg">
                    {senderName.charAt(0)}
                </div>
                <div>
                    <p className="text-white font-bold text-base leading-tight">{senderName}</p>
                    <p className="text-xs text-emerald-400 font-medium">en línea</p>
                </div>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 bg-repeat">
                <div className="flex justify-start">
                    <div 
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onMessageChange?.(e.currentTarget.innerText)}
                        className="max-w-[90%] p-4 rounded-2xl shadow-xl text-lg whitespace-pre-wrap bg-[#005c4b] focus:bg-[#004d3f] text-[#e9edef] rounded-tl-none relative border border-emerald-800/30 outline-none transition-colors cursor-text"
                    >
                        {renderWhatsAppText(text)}
                        <span contentEditable={false} className="block text-[10px] text-right opacity-60 mt-2 font-mono">10:45 AM ✓✓</span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-[#202c33] border-t border-gray-700 flex gap-3 shrink-0">
                <div className="flex-1 bg-[#2a3942] rounded-full h-10 border border-white/5"></div>
                <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-lg">
                    <MessageCircle className="w-5 h-5 fill-current" />
                </div>
            </div>
        </div>
    );
};

interface DashboardContext {
    user: User;
}

export const WhatsAppLaunchWizard: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useOutletContext() as DashboardContext;
    const { launchId } = useParams() as { launchId?: string };
    const urlProjectId = searchParams.get('projectId');
    
    const [step, setStep] = useState(0); // 0: Select Project, 1: Edit
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeLaunch, setActiveLaunch] = useState<WhatsAppLaunch | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [activeMsgIdx, setActiveMsgIdx] = useState(0);
    const [saveIndicator, setSaveIndicator] = useState(false);
    const [isTypeLocked, setIsTypeLocked] = useState(true);

    const waTypes = [
        'Seguridad', 'Empatía y Confianza', 'Valor Percibido', 'Conciencia del Dolor',
        'Entusiasmo', 'Compromiso', 'Acción Inmediata', 'Lanzamiento',
        'Beneficio extra', 'Eliminación de Fricción', 'Validación', 'Riesgo Cero',
        'Escasez Real', 'Integridad de Marca'
    ];

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const projectsData = await api.getProjects();
                setProjects(projectsData);

                if (launchId) {
                    const allLaunches = await api.getWhatsAppLaunches();
                    const currentLaunch = allLaunches.find(l => l.id === launchId);
                    if (currentLaunch) {
                        const proj = projectsData.find(p => p.id === currentLaunch.projectId);
                        if (proj) setSelectedProject(proj);
                        setActiveLaunch(currentLaunch);
                        setStep(1);
                        setLoading(false);
                        return;
                    }
                }

                if (urlProjectId) {
                    const proj = projectsData.find(p => p.id === urlProjectId);
                    if (proj) {
                        handleProjectSelect(proj);
                        return;
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [launchId, urlProjectId]);

    const handleProjectSelect = async (project: Project) => {
        setSelectedProject(project);
        setLoading(true);
        try {
            const strategy = project.strategy_json;
            const strategyMessages = strategy?.modules?.whatsappLaunch || [];
            
            const localMessages: WhatsAppLaunchMessage[] = WHATSAPP_LAUNCH_MOMENTS.map((moment) => {
                const match = strategyMessages.find((m: any) => m.id === moment.id);
                return {
                    ...moment,
                    content: match?.messages?.[0]?.text || match?.content || '',
                    isGenerated: !!(match?.messages?.[0]?.text || match?.content)
                };
            });

            const tempLaunch: WhatsAppLaunch = {
                id: `temp-${project.id}`, 
                userId: user.id,
                projectId: project.id,
                projectName: project.name,
                name: `Lanzamiento: ${project.name}`,
                status: 'borrador',
                createdAt: new Date(),
                messages: localMessages
            };

            setActiveLaunch(tempLaunch);
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

        if (activeLaunch.id.startsWith('temp-')) return;

        setSaveIndicator(true);
        try {
            await api.updateWhatsAppLaunch(activeLaunch.id, { messages: newMessages });
            setTimeout(() => setSaveIndicator(false), 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleGenerate = async () => {
        if (!activeLaunch || !selectedProject) return;
        setGenerating(true);
        try {
            let currentLaunch = { ...activeLaunch };

            if (currentLaunch.id.startsWith('temp-')) {
                const res = await api.createWhatsAppLaunch(selectedProject.id, `Lanzamiento: ${selectedProject.name}`);
                const realLaunch = await api.getWhatsAppLaunchByProject(selectedProject.id);
                if (realLaunch) {
                    currentLaunch = realLaunch;
                    setActiveLaunch(realLaunch);
                }
            }

            // Llamada real al servicio de IA para generar el mensaje basado en Blueprints
            const { message: generatedText, strategicPurpose } = await generateWhatsAppMessage(selectedProject.id, currentLaunch.messages[activeMsgIdx].id);

            const newMessages = [...currentLaunch.messages];
            newMessages[activeMsgIdx].content = generatedText;
            newMessages[activeMsgIdx].purpose = strategicPurpose;
            newMessages[activeMsgIdx].isGenerated = true;
            
            setActiveLaunch({ ...currentLaunch, messages: newMessages });
            await api.updateWhatsAppLaunch(currentLaunch.id, { messages: newMessages });
        } catch (e) {
            console.error(e);
            alert("Error de generación con IA: " + (e as Error).message);
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
                <p className="font-black uppercase tracking-[0.2em] text-sm">Cargando tus proyectos...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto bg-gray-900 rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden min-h-[600px] flex flex-col relative animate-in fade-in duration-500">
            {generating && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <div className="bg-[#0B0B0B] border border-white/10 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95">
                        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                        <p className="text-white font-black uppercase tracking-[0.3em] text-center text-sm">IA redactando tu mensaje persuasivo...</p>
                    </div>
                </div>
            )}

            <div className="bg-emerald-500/10 p-8 text-center border-b border-emerald-500/10 shrink-0 relative">
                {step > 0 && (
                    <button 
                        onClick={() => { setStep(0); setSelectedProject(null); setActiveLaunch(null); navigate('/dashboard/whatsapp-launch'); }}
                        className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver
                    </button>
                )}
                
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                    <Smartphone className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Asistente de Lanzamiento de WhatsApp</h2>
                {selectedProject && <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] mt-2">Proyecto: {selectedProject.name}</p>}
            </div>

            <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                {step === 0 ? (
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
                                    Configurar Secuencia <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : activeLaunch && (
                    <div className="grid lg:grid-cols-12 gap-10 items-stretch">
                        <div className="lg:col-span-4 bg-gray-950 p-6 rounded-[2.5rem] border border-gray-800 flex flex-col shadow-2xl h-[700px] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-3 mb-8 shrink-0">
                                <div className="p-2.5 bg-emerald-900/30 rounded-xl text-emerald-400 border border-emerald-900/50"><WaIcon className="w-6 h-6" /></div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Momentos del Lanzamiento</h3>
                            </div>
                            <div className="space-y-3">
                                {activeLaunch.messages.map((msg, idx) => (
                                    <div 
                                        key={msg.id}
                                        onClick={() => setActiveMsgIdx(idx)}
                                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${activeMsgIdx === idx ? 'bg-emerald-900/10 border-emerald-500/40 shadow-xl shadow-emerald-900/30 translate-x-2' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${activeMsgIdx === idx ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[10px] font-black uppercase mb-1 ${activeMsgIdx === idx ? 'text-emerald-400' : 'text-gray-600'}`}>{msg.momentText}</p>
                                            <h5 className={`font-bold truncate ${activeMsgIdx === idx ? 'text-white' : 'text-gray-400'}`}>{msg.name}</h5>
                                        </div>
                                        {msg.isGenerated && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-8 flex flex-col h-full bg-[#0B0B0B] border border-gray-800 rounded-[3rem] shadow-2xl relative overflow-hidden min-h-[700px]">
                            <div className="p-10 relative flex-1 flex flex-col">
                                {saveIndicator && (
                                    <div className="absolute top-6 right-10 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Sincronizado
                                    </div>
                                )}

                                {activeLaunch.messages[activeMsgIdx].isGenerated ? (
                                    <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex justify-between items-center bg-gray-800/30 p-4 rounded-2xl border border-white/5">
                                            <button 
                                                onClick={() => handleUpdateMessage(activeMsgIdx, 'isGenerated', false)}
                                                className="text-[10px] font-black text-white uppercase tracking-widest hover:underline transition-all"
                                            >
                                                Modificar configuración estratégica
                                            </button>
                                        </div>

                                        <ChatSimulator 
                                            text={activeLaunch.messages[activeMsgIdx].content} 
                                            senderName={user.name} 
                                            onMessageChange={(newText) => handleUpdateMessage(activeMsgIdx, 'content', newText)}
                                        />

                                        <div className="flex justify-center pt-4">
                                            <button 
                                                onClick={handleCopy}
                                                className="px-12 py-5 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transform hover:scale-105 active:scale-95"
                                            >
                                                <Copy className="w-5 h-5" /> Copiar Mensaje para WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-12 animate-in fade-in duration-500 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <span className="bg-emerald-900/20 text-emerald-400 border border-emerald-900/50 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                Pilar: {activeLaunch.messages[activeMsgIdx].pilarType}
                                            </span>
                                            <span className="text-white text-lg font-black uppercase tracking-widest italic">{activeLaunch.messages[activeMsgIdx].momentText}</span>
                                        </div>

                                        <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden flex-1">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                                            
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                                    <Lightbulb className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-black text-white tracking-tight leading-none">{activeLaunch.messages[activeMsgIdx].name}</h4>
                                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-4 leading-relaxed">Nuestra inteligencia Artificial generará tu mensaje persuasivo basado en esto.</p>
                                                </div>
                                            </div>

                                            <div className="space-y-10">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-lg font-black text-white uppercase ml-1 flex items-center gap-2">
                                                            <Settings2 className="w-5 h-5 text-emerald-500" /> Pilar Estratégico (Tipo)
                                                        </label>
                                                        <button 
                                                            onClick={() => setIsTypeLocked(!isTypeLocked)}
                                                            className="text-xs font-black text-emerald-400 uppercase tracking-widest hover:underline px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 transition-all"
                                                        >
                                                            {isTypeLocked ? 'Cambiar' : 'Bloquear'}
                                                        </button>
                                                    </div>
                                                    <div className="relative">
                                                        <select 
                                                            disabled={isTypeLocked}
                                                            value={activeLaunch.messages[activeMsgIdx].pilarType}
                                                            onChange={(e) => handleUpdateMessage(activeMsgIdx, 'pilarType', e.target.value)}
                                                            className={`w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-xl outline-none transition-all shadow-inner appearance-none cursor-pointer ${isTypeLocked ? 'opacity-50 grayscale pointer-events-none' : 'border-emerald-500/50 ring-2 ring-emerald-500/10'}`}
                                                        >
                                                            {waTypes.map(t => (
                                                                <option key={t} value={t}>{t}</option>
                                                            ))}
                                                        </select>
                                                        {!isTypeLocked && (
                                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                <ChevronDown className="w-6 h-6 text-yellow-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-lg font-black text-white uppercase ml-1 flex items-center gap-2">
                                                        <Zap className="w-5 h-5 text-emerald-500" /> Propósito Estratégico del Momento
                                                    </label>
                                                    <textarea 
                                                        rows={4}
                                                        value={activeLaunch.messages[activeMsgIdx].purpose}
                                                        onChange={(e) => handleUpdateMessage(activeMsgIdx, 'purpose', e.target.value)}
                                                        className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-gray-300 text-lg font-light leading-relaxed outline-none focus:border-emerald-500/50 transition-all shadow-inner resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pb-6">
                                            <button 
                                                onClick={handleGenerate}
                                                className="w-full py-6 rounded-[2cm] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95 shadow-emerald-900/30"
                                            >
                                                <Wand2 className="w-7 h-7 fill-current" /> Generar Mensaje No {activeMsgIdx + 1} con IA
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};