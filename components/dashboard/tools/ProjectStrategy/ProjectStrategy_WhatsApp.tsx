import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Check, Copy, Calendar, Brain, PlayCircle, Download, Image as ImageIcon, Lock, Wand2, ArrowRight, PenTool, Info, Sparkles, Lightbulb, ChevronDown, Settings2, Crown, X, Loader2, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../../services/api';
import { PlanLimits, WhatsAppLaunchMessage, WhatsAppLaunch } from '../../../../types';
import { ProjectMasterStrategy } from '../../../../services/strategySchema';
import { generateWhatsAppMessage } from '../../../../services/geminiservices/whatsappService';

const WHATSAPP_LAUNCH_MOMENTS = [
    { id: 'wl1', name: 'Bienvenida + Fecha (Día -7)', momentText: 'Día -7', objective: 'Confirmar que está en el lugar correcto y fijar la fecha del evento en su mente.', pilarType: 'Seguridad', purpose: 'Reduce la incertidumbre, genera el primer micro-compromiso y evita que el usuario se olvide del evento.' },
    { id: 'wl2', name: 'Historia / Autoridad (Día -5)', momentText: 'Día -5', objective: 'Humanizar al experto y generar conexión emocional.', pilarType: 'Empatía y Confianza', purpose: 'Aumenta la confianza, hace que el usuario crea en el guía y se posicione como autoridad.' },
    { id: 'wl3', name: 'Curiosidad (Día -3)', momentText: 'Día -3', objective: 'Generar intriga sobre lo que se enseñará en el evento.', pilarType: 'Valor Percibido', purpose: 'Aumenta el deseo de asistir, hace que el usuario espere el evento y sube el valor percibido.' },
    { id: 'wl4', name: 'Errores (Día -1)', momentText: 'Día -1', objective: 'Mostrarle al usuario que está cometiendo errores fatales.', pilarType: 'Conciencia del Dolor', purpose: 'Activa el dolor, genera necesidad urgente de solución y posiciona el evento como algo necesario.' },
    { id: 'wl5', name: 'Recordatorio (Mañana)', momentText: 'Día Clase (AM)', objective: 'Recordar el evento del día de hoy.', pilarType: 'Entusiasmo', purpose: 'Mantiene el evento presente en su mente, reduce olvidos y aumenta la tasa de asistencia.' },
    { id: 'wl6', name: 'Preparación (Horas antes)', momentText: 'Día Clase (PM)', objective: 'Preparar al usuario mentalmente para la clase.', pilarType: 'Compromiso', purpose: 'Aumenta el compromiso, mejora la atención durante la clase y hace que el usuario se lo tome en serio.' },
    { id: 'wl7', name: 'Link en Vivo', momentText: 'Día Clase (Link)', objective: 'Llevar tráfico directo al evento en vivo.', pilarType: 'Acción Inmediata', purpose: 'Acción inmediata, elimina fricción y maximiza los asistentes en tiempo real.' },
    { id: 'wl8', name: 'Oferta + Link (Post-clase)', momentText: 'Post-Clase', objective: 'Presentar la oferta de forma clara y directa.', pilarType: 'Lanzamiento', purpose: 'Captura el pico de emoción, convierte a los prospectos más calientes y genera las primeras ventas.' },
    { id: 'wl9', name: 'Bonos + Resolución de dudas', momentText: 'Urgencia 1', objective: 'Acelerar la decisión de compra y eliminar fricción técnica.', pilarType: 'Beneficio extra', purpose: 'Reduce dudas de último momento, incrementa conversiones y evita el abandono del carrito.' },
    { id: 'wl10', name: 'Prueba social', momentText: 'Validación', objective: 'Mostrar que otros ya compraron y están teniendo resultados.', pilarType: 'Validación', purpose: 'Reduce el miedo, genera validación social y activa el efecto de deseo de pertenencia.' },
    { id: 'wl11', name: 'Garantía', momentText: 'Garantía', objective: 'Eliminar el riesgo percibido por el comprador.', pilarType: 'Riesgo Cero', purpose: 'Disminuye el miedo a perder dinero, facilita el "sí" y aumenta la confianza final en la compra.' },
    { id: 'wl12', name: 'Última llamada', momentText: 'Cierre', objective: 'Forzar la decisión inmediata antes del cierre.', pilarType: 'Escasez Real', purpose: 'Activa la urgencia real, dispara ventas de último momento y evita que el usuario postergue la decisión.' },
    { id: 'wl13', name: 'Bienvenida (Solo compradores)', momentText: 'Bienvenida', objective: 'Dar inicio a la experiencia de los nuevos alumnos.', pilarType: 'Integridad de Marca', purpose: 'Refuerza la decisión de compra, genera satisfacción inmediata y reduce el arrepentimiento post-compra.' }
];

const ChatSimulator: React.FC<{ 
    messages: any[]; 
    senderName?: string;
    onSaveMessage?: (idx: number, newText: string) => void;
}> = ({ messages, senderName, onSaveMessage }) => {
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [tempText, setTempText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [tempText]);

    const handleStartEdit = (idx: number, text: string) => {
        setEditingIdx(idx);
        setTempText(text);
    };

    const renderWhatsAppText = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\*[^\*]+\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                return <span key={i} className="font-bold">{part.slice(1, -1)}</span>;
            }
            return part;
        });
    };

    return (
        <div id="psd-chat-simulator-container" className="bg-[#0b141a] rounded-xl overflow-hidden border border-gray-800 flex flex-col h-auto font-sans text-sm shadow-xl transition-all duration-500 ease-in-out">
            <div id="psd-chat-header" className="bg-[#202c33] p-3 flex items-center gap-3 border-b border-gray-700 shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-lg">
                    {senderName ? senderName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                    <p className="text-white font-bold text-lg leading-tight">{senderName || 'Estratega'}</p>
                    <p className="text-xs text-emerald-400 font-medium">en línea</p>
                </div>
            </div>
            <div id="psd-chat-body" className="p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 bg-repeat h-auto">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 fade-in duration-300`} style={{animationDelay: `${i * 150}ms`}}>
                        <div 
                            onClick={() => onSaveMessage && editingIdx === null && handleStartEdit(i, msg.text)}
                            className={`${editingIdx === i ? 'w-full' : 'max-w-[85%]'} p-2.5 rounded-lg shadow-sm text-lg whitespace-pre-wrap relative group ${msg.role === 'user' ? 'bg-[#202c33] text-white rounded-tl-none' : 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'} ${editingIdx === null && onSaveMessage ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                        >
                            {editingIdx === i ? (
                                <div className="space-y-3" onClick={e => e.stopPropagation()}>
                                    <textarea 
                                        ref={textareaRef}
                                        autoFocus
                                        value={tempText}
                                        onChange={(e) => setTempText(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm md:text-base text-white outline-none focus:ring-2 focus:ring-[#075E54]/20 resize-none overflow-hidden"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setEditingIdx(null)} className="p-2 text-gray-300 hover:bg-white/10 rounded-lg transition"><X className="w-4 h-4" /></button>
                                        <button onClick={() => { onSaveMessage?.(i, tempText); setEditingIdx(null); }} className="bg-[#075E54] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#054d44] transition">
                                            <Check className="w-4 h-4" /> Guardar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {onSaveMessage && (
                                        <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#075E54] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded whitespace-nowrap z-10">Clic para editar mensaje</div>
                                    )}
                                    {renderWhatsAppText(msg.text)}
                                    <span className="block text-[9px] text-right opacity-60 mt-1">10:0{i} AM ✓✓</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-[#202c33] border-t border-gray-700 flex gap-2 shrink-0">
                <div className="flex-1 bg-[#2a3942] rounded-lg h-8"></div>
                <div className="w-8 h-8 bg-[#00a884] rounded-full flex items-center justify-center text-white"><MessageCircle className="w-4 h-4 fill-current" /></div>
            </div>
        </div>
    );
};

interface ProjectStrategy_WhatsAppProps {
    activeWaScript: number;
    setActiveWaScript: (idx: number) => void;
    onUpgrade: () => void;
    projectId?: string;
    isSimulating?: boolean;
    planLimits?: PlanLimits;
    strategyData?: ProjectMasterStrategy | null;
}

export const ProjectStrategy_WhatsApp: React.FC<ProjectStrategy_WhatsAppProps> = ({
    activeWaScript, setActiveWaScript, onUpgrade, projectId, isSimulating = false, planLimits, strategyData: propStrategyData
}) => {
    const navigate = useNavigate();
    const { user } = useOutletContext() as any;
    
    const [whatsappLaunch, setWhatsappLaunch] = useState<any[]>([]);
    const [launchCount, setLaunchCount] = useState(0);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [launchDate, setLaunchDate] = useState<string>('');
    const [launchId, setLaunchId] = useState<string | null>(null);
    const [sentMessages, setSentMessages] = useState<Set<number>>(new Set());
    const [isTypeLocked, setIsTypeLocked] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);

    // --- CÁLCULO DE FECHA MÍNIMA (HOY + 8 DÍAS) ---
    const minDateStr = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 8);
        return d.toISOString().split('T')[0];
    })();

    // --- ESTADOS DE GENERACIÓN BAJO DEMANDA ---
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success'>('idle');
    const [loadingText, setLoadingText] = useState("");
    const loadingTexts = [
        "Analizando psicología del avatar...",
        "Redactando ganchos de apertura...",
        "Optimizando para respuesta directa...",
        "Integrando disparadores mentales...",
        "Estructurando el cierre de ventas..."
    ];

    useEffect(() => {
        let interval: any;
        if (generationStatus === 'generating') {
            let i = 0;
            setLoadingText(loadingTexts[0]);
            interval = setInterval(() => {
                i = (i + 1) % loadingTexts.length;
                setLoadingText(loadingTexts[i]);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [generationStatus]);

    const waTypes = [
        'Seguridad', 'Empatía y Confianza', 'Valor Percibido', 'Conciencia del Dolor',
        'Entusiasmo', 'Compromiso', 'Acción Inmediata', 'Lanzamiento',
        'Beneficio extra', 'Eliminación de Fricción', 'Validación', 'Riesgo Cero',
        'Escasez Real', 'Integridad de Marca'
    ];

    const loadLaunchData = async () => {
        if (!projectId) return;
        setLoadingLocal(true);
        try {
            const [waLaunchDb, allWaLaunches, fetchedStrategyData] = await Promise.all([
                api.getWhatsAppLaunchByProject(projectId),
                api.getWhatsAppLaunches(),
                propStrategyData ? Promise.resolve(propStrategyData) : api.getProjectStrategy(projectId)
            ]);

            const strategyData = propStrategyData || fetchedStrategyData;
            setLaunchCount(allWaLaunches.length);

            if (waLaunchDb) {
                setLaunchId(waLaunchDb.id);
                if (waLaunchDb.launchDate) {
                    const dateOnly = typeof waLaunchDb.launchDate === 'string' ? waLaunchDb.launchDate.split('T')[0] : waLaunchDb.launchDate.toISOString().split('T')[0];
                    setLaunchDate(dateOnly);
                }
            }

            // REGLA DE ORO: Inicialmente nada está generado si no está en la DB
            let final14 = WHATSAPP_LAUNCH_MOMENTS.map(moment => {
                // Buscamos si existe en la estrategia para sacar pilarType y purpose si la DB no tiene nada aún
                const strategyMatch = strategyData?.modules?.whatsappLaunch?.find((sm: any) => sm.id === moment.id);
                
                return { 
                    ...moment, 
                    pilarType: strategyMatch?.pilarType || moment.pilarType,
                    purpose: strategyMatch?.purpose || moment.purpose,
                    content: '', 
                    isGenerated: false 
                };
            });

            if (waLaunchDb && waLaunchDb.messages && Array.isArray(waLaunchDb.messages)) {
                const dbMessages = waLaunchDb.messages;
                final14 = final14.map(moment => {
                    const match = dbMessages.find((m: any) => m.id === moment.id);
                    // Solo marcamos como generado si el match de la DB tiene contenido y isGenerated true
                    return match ? { ...moment, ...match } : moment;
                });
            }
            
            setWhatsappLaunch(final14);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingLocal(false);
        }
    };

    useEffect(() => {
        loadLaunchData();
    }, [projectId, propStrategyData]);

    const formatLongDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T12:00:00'); 
        const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const formatted = formatter.format(date);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

    const getCalculatedDate = (baseDateStr: string, index: number) => {
        if (!baseDateStr) return '';
        const baseDate = new Date(baseDateStr + 'T12:00:00');
        const offsets = [0, 2, 4, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7];
        const offset = offsets[index] !== undefined ? offsets[index] : 7;
        const calculatedDate = new Date(baseDate);
        calculatedDate.setDate(baseDate.getDate() + offset);
        return formatLongDate(calculatedDate.toISOString().split('T')[0]);
    };

    const activeItem = whatsappLaunch[activeWaScript] || whatsappLaunch[0];
    let displayMessages: any[] = [];
    if (activeItem) {
        if (activeItem.messages && Array.isArray(activeItem.messages)) displayMessages = activeItem.messages;
        else if (activeItem.content) displayMessages = [{ role: 'agent', text: activeItem.content }];
    }

    const processedMessages = displayMessages.map((m: any) => {
        let text = m.text || '';
        if (launchDate) {
            const classDate = getCalculatedDate(launchDate, 4);
            text = text.replace('[FECHA_CLASE]', classDate);
        }
        return { ...m, text: text };
    });

    const handleUpdateMessage = async (index: number, field: string, value: any) => {
        if (!projectId || !launchId) return;
        try {
            const newMessages = [...whatsappLaunch];
            (newMessages[index] as any)[field] = value;
            await api.updateWhatsAppLaunch(launchId, { messages: newMessages });
            setWhatsappLaunch([...newMessages]);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSaveChatMessage = async (msgIdx: number, newText: string) => {
        if (!projectId || !launchId || !activeItem) return;

        let currentMessages: any[] = [];
        if (activeItem.messages && Array.isArray(activeItem.messages)) {
            currentMessages = [...activeItem.messages];
        } else if (activeItem.content) {
            currentMessages = [{ role: 'agent', text: activeItem.content }];
        }

        if (currentMessages[msgIdx]) {
            currentMessages[msgIdx] = { ...currentMessages[msgIdx], text: newText };
        }

        const updatedLaunch = [...whatsappLaunch];
        updatedLaunch[activeWaScript] = {
            ...updatedLaunch[activeWaScript],
            messages: currentMessages,
            content: currentMessages[0]?.text || ''
        };

        try {
            await api.updateWhatsAppLaunch(launchId, { messages: updatedLaunch });
            setWhatsappLaunch(updatedLaunch);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Mensaje copiado para WhatsApp");
    };

    const toggleSent = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        const newSent = new Set(sentMessages);
        if (newSent.has(idx)) newSent.delete(idx);
        else newSent.add(idx);
        setSentMessages(newSent);
    };

    const handleLaunchDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setLaunchDate(newDate);
        if (launchId) {
            try {
                await api.updateWhatsAppLaunch(launchId, { launchDate: newDate });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleGenerate = async () => {
        setShowConfirmModal(false);
        if (!projectId) return;

        setGenerationStatus('generating');
        try {
            let currentLaunchId = launchId;
            if (!currentLaunchId) {
                const res = await api.createWhatsAppLaunch(projectId, `Lanzamiento WhatsApp`);
                currentLaunchId = res.id;
                setLaunchId(res.id);
            }

            const { message: generatedText, strategicPurpose } = await generateWhatsAppMessage(projectId, activeItem.id);

            const updatedMessages = [...whatsappLaunch];
            updatedMessages[activeWaScript] = {
                ...updatedMessages[activeWaScript],
                content: generatedText,
                purpose: strategicPurpose,
                messages: [{ role: 'agent', text: generatedText }],
                isGenerated: true
            };

            await api.updateWhatsAppLaunch(currentLaunchId, { messages: updatedMessages });
            setWhatsappLaunch(updatedMessages);
            setGenerationStatus('success');
        } catch (e) {
            console.error(e);
            alert("Error de generación.");
            setGenerationStatus('idle');
        }
    };

    const isRealAdmin = planLimits?.planName === 'admin' && !isSimulating;
    const maxLaunches = planLimits?.maxWhatsAppLaunches || 1;
    const launchUsed = launchCount;
    const usagePercent = Math.min(100, (launchUsed / maxLaunches) * 100);
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    const renderPhaseHeader = (index: number) => {
        if (index === 0) return <div className="mt-6 mb-4 px-6 py-4 bg-blue-500/50 border border-white/60 rounded-lg text-sm font-black uppercase text-white tracking-widest">Fase 1: Anticipación (Calentar al prospecto)</div>;
        if (index === 4) return <div className="mt-8 mb-4 px-6 py-4 bg-blue-500/50 border border-white/60 rounded-lg text-sm font-black uppercase text-white tracking-widest">Fase 2: Día del Evento (Maximizar asistencia)</div>;
        if (index === 7) return <div className="mt-8 mb-4 px-6 py-4 bg-blue-500/50 border border-white/60 rounded-lg text-sm font-black uppercase text-white tracking-widest">Fase 3: Conversión (Aprovechar el momento caliente)</div>;
        if (index === 9) return <div className="mt-8 mb-4 px-6 py-4 bg-blue-500/50 border border-white/60 rounded-lg text-sm font-black uppercase text-white tracking-widest">Fase 4: Cierre (Forzar decisión final)</div>;
        if (index === 12) return <div className="mt-8 mb-4 px-6 py-4 bg-purple-500/50 border border-white/60 rounded-lg text-sm font-black uppercase text-white tracking-widest">Mensaje Extra (Solo compradores)</div>;
        return null;
    };

    return (
        <div id="psd-whatsapp-section" className="pt-8 relative">
            <style>{`
                @keyframes confetti-fall { 0% { transform: translateY(-100%) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }
                .confetti { position: absolute; width: 8px; height: 8px; animation: confetti-fall 3s linear forwards; top: -10px; z-index: 210; pointer-events: none; }
            `}</style>

            {/* --- OVERLAY DE CARGA --- */}
            {generationStatus === 'generating' && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="relative mb-12 flex justify-center">
                            <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center animate-pulse border border-emerald-100">
                                <Wand2 className="w-12 h-12 text-emerald-600" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-black uppercase tracking-tighter italic animate-pulse">Redactando Mensaje Estratégico</h3>
                            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{loadingText}</p>
                        </div>
                        <div className="w-full max-w-sm h-1.5 bg-gray-100 rounded-full mx-auto mt-10 overflow-hidden relative">
                            <div className="h-full bg-emerald-500 w-full origin-left animate-loading-bar"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- OVERLAY DE ÉXITO --- */}
            {generationStatus === 'success' && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300 relative">
                        {[...Array(30)].map((_, i) => (
                            <div key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, backgroundColor: ['#10B981', '#34D399', '#4C1D95', '#F59E0B'][Math.floor(Math.random() * 4)], animationDelay: `${Math.random() * 2}s` }}></div>
                        ))}
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 mx-auto mb-8 scale-110 animate-bounce">
                            <CheckCircle2 className="w-14 h-14 text-white" />
                        </div>
                        <h3 className="text-4xl font-black text-black leading-tight mb-4">¡Tu mensaje No ${activeWaScript + 1} de WhatsApp ha sido creado!</h3>
                        <p className="text-gray-500 text-lg font-medium mb-10">Tu guion persuasivo está listo para ser copiado y enviado a tu comunidad.</p>
                        <button 
                            onClick={() => setGenerationStatus('idle')}
                            className="w-full py-5 bg-[#FF5A1F] text-white font-black rounded-2xl shadow-xl hover:bg-[#D94A1E] transition-all transform hover:scale-[1.02] active:scale-95 text-lg"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <div id="psd-whatsapp-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg"><MessageCircle className="w-5 h-5" /> Resumen estratégico</div>
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">Secuencia de Lanzamiento <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"><b>Lanzamiento vía WhatsApp</b></span></h3>
                
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-green-500 pl-8 py-2">
                        El cierre por WhatsApp permite humanizar la venta y generar picos de facturación masiva. Nuestra estrategia divide el lanzamiento en 13 momentos críticos divididos en 4 fases psicológicas.
                    </p>
                    <div className="hidden md:block w-px h-24 bg-emerald-500/30"></div>
                    <div 
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                    >
                        <iframe 
                            className="w-full h-full rounded-2xl"
                            src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                            title="Video Tutorial" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            {loadingLocal ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
                <>
                    <div className="max-w-[70em] mx-auto px-4 md:px-0 mb-12">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-in slide-in-from-top-2 duration-500 cursor-pointer hover:bg-white/10 transition-all" onClick={() => dateInputRef.current?.showPicker()}>
                            <label className="block text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-3 cursor-pointer"><Calendar className="w-8 h-8" /> Fecha de Inicio del Lanzamiento</label>
                            
                            {!launchDate && (
                                <p className="text-gray-400 font-bold text-xl mb-2">Haz clic para definir la fecha de tu Lanzamiento.</p>
                            )}
                            
                            <input 
                                ref={dateInputRef} 
                                type="date" 
                                value={launchDate} 
                                onChange={handleLaunchDateChange} 
                                min={minDateStr}
                                required
                                className={`w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white font-bold ${!launchDate ? 'opacity-50' : ''}`} 
                                style={{ colorScheme: 'dark' }} 
                            />
                        </div>
                    </div>

                    <div id="psd-whatsapp-grid" className="grid lg:grid-cols-11 gap-8 relative">
                                <div className="lg:col-span-4 bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col shadow-2xl">
                                    <div className="flex items-center gap-3 mb-6 shrink-0"><div className="p-2 bg-green-900/30 rounded-lg text-green-400 border border-green-900/50"><Calendar className="w-6 h-6" /></div><h3 className="text-xl font-bold text-white">Listado de Mensajes</h3></div>
                                    
                                    {/* Barra de Progreso de Lanzamientos */}
                                    <div className="w-full mb-6">
                                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full shadow-inner">
                                            <div className="flex justify-between items-center mb-2 text-sm">
                                                <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Lanzamientos creados</span>
                                                <span className="text-white font-bold">{launchUsed} / {maxLaunches}</span>
                                            </div>
                                            <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                                <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${usagePercent}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1 flex-1 pr-2 overflow-y-auto custom-scrollbar">
                                        {whatsappLaunch.map((script: any, idx: number) => (
                                            <React.Fragment key={script.id}>
                                                {renderPhaseHeader(idx)}
                                                <div onClick={() => setActiveWaScript(idx)} className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${script.isGenerated || sentMessages.has(idx) ? 'bg-emerald-900/10 border-emerald-500/30' : (activeWaScript === idx ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800')}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${script.isGenerated || sentMessages.has(idx) ? 'bg-green-50 text-black' : (activeWaScript === idx ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400')}`}>{idx + 1}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-[10px] font-black uppercase mb-1 ${activeWaScript === idx ? 'text-emerald-400' : 'text-gray-600'}`}>Mensaje {idx + 1}</p>
                                                            <h4 className={`text-lg font-thin leading-relaxed whitespace-normal text-white`}>{script.name}</h4>
                                                        </div>
                                                    </div>
                                                    <div onClick={(e) => toggleSent(e, idx)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sentMessages.has(idx) ? 'border-green-500 bg-green-500' : 'border-gray-600'}`}>
                                                        {sentMessages.has(idx) ? (
                                                            <Check className="w-4 h-4 text-black font-black" />
                                                        ) : (
                                                            <Check className="w-4 h-4 text-gray-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-7 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/10 border border-white/5 rounded-[3rem] p-10 flex flex-col relative h-full shadow-2xl overflow-hidden min-h-[600px]">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Target className="w-40 h-40 text-blue-500" /></div>
                                    <div className={`absolute top-0 left-0 w-1 h-full ${activeItem?.isGenerated ? 'bg-emerald-500/50' : 'bg-blue-500/50'}`}></div>

                                    {activeItem && activeItem.isGenerated ? (
                                        <div className="flex flex-col h-full space-y-6 relative z-10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-2xl font-black text-white uppercase tracking-tight">
                                                    {activeItem.name}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 border border-emerald-400/30">
                                                        Mensaje {activeWaScript + 1}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl flex gap-4">
                                                <Info className="w-6 h-6 text-emerald-400 shrink-0" />
                                                <div className="text-gray-300 text-base leading-relaxed">
                                                    <span className="font-bold text-emerald-200 block mb-1">Propósito Estratégico:</span>
                                                    <div className="prose prose-invert prose-p:text-gray-300 max-w-none">
                                                        {activeItem.purpose}
                                                    </div>
                                                </div>
                                            </div>

                                            <ChatSimulator messages={processedMessages} senderName={user?.name} onSaveMessage={handleSaveChatMessage} />
                                            <div className="flex gap-4 mt-6"><button onClick={() => handleCopy(processedMessages[0]?.text || '')} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2"><Copy className="w-5 h-5" /> Copiar Mensaje</button></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-12 animate-in fade-in duration-500 flex-1 flex flex-col relative z-10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black text-white uppercase tracking-tight">
                                                    {activeItem?.name}
                                                </span>
                                                <span className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 border border-blue-400/30">
                                                    Mensaje {activeWaScript + 1}
                                                </span>
                                            </div>

                                            <div className="space-y-10">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-lg font-black text-white uppercase ml-1 flex items-center gap-2">
                                                            <Settings2 className="w-5 h-5 text-emerald-500" /> Pilar Estratégico (Tipo)
                                                        </label>
                                                        <button onClick={() => setIsTypeLocked(!isTypeLocked)} className="text-xs font-black text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                                            {isTypeLocked ? 'Desbloquear' : 'Bloquear'}
                                                        </button>
                                                    </div>
                                                    <select disabled={isTypeLocked} value={activeItem?.pilarType} onChange={(e) => handleUpdateMessage(activeWaScript, 'pilarType', e.target.value)} className={`w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-xl outline-none appearance-none ${isTypeLocked ? 'opacity-50 grayscale pointer-events-none' : 'border-emerald-500/50'}`}>
                                                        {waTypes.map(t => (<option key={t} value={t}>{t}</option>))}
                                                    </select>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <label className="text-lg font-black text-white uppercase ml-1 flex items-center gap-2">
                                                        <Calendar className="w-5 h-5 text-emerald-500" /> Fecha de Lanzamiento
                                                    </label>
                                                    <div className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-xl">
                                                        {launchDate ? getCalculatedDate(launchDate, activeWaScript) : 'Fecha por Definir'}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-lg font-black text-white uppercase ml-1 flex items-center gap-2">
                                                        <Brain className="w-5 h-5 text-emerald-500" /> Propósito Estratégico
                                                    </label>
                                                    <textarea rows={4} value={activeItem?.purpose} onChange={(e) => handleUpdateMessage(activeWaScript, 'purpose', e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-6 text-gray-300 text-lg font-light leading-relaxed outline-none resize-none" />
                                                </div>
                                                <div className="pt-4">
                                                    <button onClick={() => setShowConfirmModal(true)} className="w-full py-6 rounded-[2cm] bg-emerald-600 text-white font-black text-lg uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4">
                                                        <Wand2 className="w-7 h-7 fill-current" /> Generar con IA
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                </>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-emerald-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                        <div className="p-8 md:p-10 space-y-8 flex-1 text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg animate-pulse"><Sparkles className="w-10 h-10" /></div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Confirma la generación</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">Generar un nuevo lanzamiento de WhatsApp consumirá créditos de tu plan <span className="text-emerald-400 font-bold capitalize">{planLimits?.planName || 'Starter'}</span>.</p>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] shadow-inner text-left"><div className="flex justify-between items-center mb-3"><span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Lanzamientos en tu plan</span><span className="text-white font-bold text-sm">{launchUsed} / {isRealAdmin ? '∞' : maxLaunches}</span></div><div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden p-0.5 border border-white/5"><div className={`h-full ${progressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]`} style={{ width: `${isRealAdmin ? (launchUsed > 0 ? 100 : 0) : usagePercent}%` }}></div></div></div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0"><button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button><button onClick={handleGenerate} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Confirmar y Generar</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};