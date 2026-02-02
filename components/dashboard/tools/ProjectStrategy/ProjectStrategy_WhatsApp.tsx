import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Check, Copy, Calendar, Brain, PlayCircle, Download, Image as ImageIcon, Lock, Wand2, ArrowRight, PenTool, Info, Sparkles, Lightbulb, ChevronDown, Settings2, Crown, X, Loader2 } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../../services/api';
import { PlanLimits, WhatsAppLaunchMessage, WhatsAppLaunch } from '../../../../types';
import { ProjectMasterStrategy } from '../../../../services/strategySchema';

const WHATSAPP_LAUNCH_MOMENTS = [
    { id: 'wl1', name: 'Confirmación de Fecha', momentText: 'Día -7', objective: 'Generar expectativa y agendar al lead.', pilarType: 'Expectativa', purpose: 'Confirmar la fecha oficial de la clase y asegurar que lo agenden.' },
    { id: 'wl2', name: 'Historia de Autoridad', momentText: 'Día -5', objective: 'Crear conexión emocional con la experta.', pilarType: 'Autoridad', purpose: 'Narrar brevemente la historia de éxito del experto para generar confianza.' },
    { id: 'wl3', name: 'Temario y Promesa', momentText: 'Día -3', objective: 'Elevar el valor percibido de la clase.', pilarType: 'Valor / Curiosidad', purpose: 'Listar los 3 puntos clave que se aprenderán en la clase.' },
    { id: 'wl4', name: 'Adelanto (3 Errores)', momentText: 'Día -1', objective: 'Entregar valor previo para generar compromiso.', pilarType: 'Valor Preventivo', purpose: 'Identificar 3 errores comunes que el lead está cometiendo hoy.' },
    { id: 'wl5', name: '¡Hoy es el gran día!', momentText: 'Día Clase (AM)', objective: 'Recordatorio matutino.', pilarType: 'Urgencia Matutina', purpose: 'Anunciar que hoy es la clase y recordar los horarios.' },
    { id: 'wl6', name: 'Cuenta Regresiva (T-4h)', momentText: 'Día Clase (PM)', objective: 'Instrucciones de preparación.', pilarType: 'Preparación', purpose: 'Indicar que busquen libreta, café y un lugar tranquilo.' },
    { id: 'wl7', name: '¡Estamos en Vivo!', momentText: 'Día Clase (Link)', objective: 'Acceso directo a la transmisión.', pilarType: 'Acción Inmediata', purpose: 'Entregar el enlace directo a la transmisión.' },
    { id: 'wl8', name: 'Oferta Abierta', momentText: 'Post-Clase', objective: 'Apertura de inscripciones.', pilarType: 'Lanzamiento', purpose: 'Anunciar la apertura de inscripciones con el descuento máximo.' },
    { id: 'wl9', name: 'Bonos de Acción Rápida', momentText: 'Urgencia 1', objective: 'Presión por los regalos exclusivos.', pilarType: 'Escasez de Bonus', purpose: 'Mencionar los regalos extra para los primeros en comprar.' },
    { id: 'wl10', name: 'Tutorial de Pago', momentText: 'Soporte', objective: 'Eliminar fricción técnica en el checkout.', pilarType: 'Facilitación', purpose: 'Explicar cómo realizar la compra paso a paso.' },
    { id: 'wl11', name: 'Certificado y Garantía', momentText: 'Garantía', objective: 'Seguridad y aval profesional.', pilarType: 'Seguridad', purpose: 'Destacar la garantía de 7 días y el aval profesional.' },
    { id: 'wl12', name: 'Últimos Cupos', momentText: 'Cierre', objective: 'Escasez máxima y resolución de dudas.', pilarType: 'Escasez Final', purpose: 'Notificar que los cupos con descuento se están terminando.' },
    { id: 'wl13', name: 'Inscripciones Cerradas', momentText: 'Final', objective: 'Mantener la integridad de la oferta.', pilarType: 'Cierre de Carrito', purpose: 'Informar que el tiempo y los cupos se agotaron.' },
    { id: 'wl14', name: 'Bienvenida', momentText: 'Bienvenida', objective: 'Bienvenida a las nuevas alumnas.', pilarType: 'Onboarding', purpose: 'Dar la bienvenida oficial a la nueva comunidad de alumnos.' }
];

const ChatSimulator: React.FC<{ messages: any[]; senderName?: string }> = ({ messages, senderName }) => {
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
            <div id="psd-chat-body" className="p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 bg-repeat max-h-[400px] overflow-y-auto custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 fade-in duration-300`} style={{animationDelay: `${i * 150}ms`}}>
                        <div className={`max-w-[85%] p-2.5 rounded-lg shadow-sm text-lg whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#202c33] text-white rounded-tl-none' : 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'}`}>
                            {renderWhatsAppText(msg.text)}
                            <span className="block text-[9px] text-right opacity-60 mt-1">10:0{i} AM ✓✓</span>
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
    const [isLocked, setIsLocked] = useState(true);
    const [launchCount, setLaunchCount] = useState(0);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [launchDate, setLaunchDate] = useState<string>('');
    const [launchId, setLaunchId] = useState<string | null>(null);
    const [sentMessages, setSentMessages] = useState<Set<number>>(new Set());
    const [imageUrls, setImageUrls] = useState<Record<number, string>>({
        0: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80'
    });
    const [isTypeLocked, setIsTypeLocked] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);

    const waTypes = ['Expectativa', 'Autoridad', 'Valor / Curiosidad', 'Valor Preventivo', 'Urgencia Matutina', 'Preparación', 'Acción Inmediata', 'Lanzamiento', 'Escasez de Bonus', 'Facilitación', 'Seguridad', 'Escasez Final', 'Cierre de Carrito', 'Onboarding'];

    useEffect(() => {
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

                let final14 = WHATSAPP_LAUNCH_MOMENTS.map(moment => ({ ...moment, content: '', isGenerated: false }));
                if (waLaunchDb && waLaunchDb.messages) {
                    const dbMessages = waLaunchDb.messages;
                    final14 = final14.map(moment => {
                        const match = dbMessages.find((m: any) => m.id === moment.id);
                        return match ? { ...moment, ...match } : moment;
                    });
                    const hasGeneratedRest = dbMessages.some((m: any) => m.id !== 'wl1' && m.isGenerated);
                    setIsLocked(!hasGeneratedRest);
                } else if (strategyData?.modules?.whatsappLaunch) {
                    const strategyMsgs = strategyData.modules.whatsappLaunch;
                    final14 = final14.map(moment => {
                        const match = strategyMsgs.find((m: any) => m.id === moment.id);
                        if (match) {
                            return {
                                ...moment,
                                content: (match as any).messages?.[0]?.text || (match as any).content || '',
                                isGenerated: !!((match as any).messages?.[0]?.text || (match as any).content)
                            };
                        }
                        return moment;
                    });
                    setIsLocked(true);
                }
                setWhatsappLaunch(final14);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingLocal(false);
            }
        };
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
        const offsets = [0, 2, 4, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
        const offset = offsets[index] !== undefined ? offsets[index] : 7;
        const calculatedDate = new Date(baseDate);
        calculatedDate.setDate(baseDate.getDate() + offset);
        return formatLongDate(calculatedDate.toISOString().split('T')[0]);
    };

    const getTimeForMessage = (index: number) => {
        if (index === 4) return '10:00 AM';
        if (index === 5 || index === 6) return '04:00 PM';
        return '';
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
            setActiveWaScript(activeWaScript); 
        } catch (e) {
            console.error(e);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Mensaje copiado para WhatsApp");
    };

    const handleImageUrlChange = (val: string) => {
        setImageUrls(prev => ({ ...prev, [activeWaScript]: val }));
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
        navigate(`/dashboard/whatsapp-launch/create?projectId=${projectId}`);
    };

    const isRealAdmin = planLimits?.planName === 'admin' && !isSimulating;
    const maxLaunches = planLimits?.maxWhatsAppLaunches || 1;
    const usagePercent = Math.min(100, (launchCount / maxLaunches) * 100);
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    return (
        <div id="psd-whatsapp-section" className="pt-8">
            <div id="psd-whatsapp-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg"><MessageCircle className="w-5 h-5" /> Resumen estratégico</div>
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">Secuencia de Lanzamiento <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"><b>Lanzamiento vía WhatsApp</b></span></h3>
            </div>

            {loadingLocal ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
                <>
                    <div className="max-w-[70em] mx-auto px-4 md:px-0 mb-12">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-in slide-in-from-top-2 duration-500 cursor-pointer hover:bg-white/10 transition-all" onClick={() => dateInputRef.current?.showPicker()}>
                            <label className="block text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-3 cursor-pointer"><Calendar className="w-8 h-8" /> Define la Fecha de Inicio del Lanzamiento</label>
                            <input ref={dateInputRef} type="date" value={launchDate} onChange={handleLaunchDateChange} className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white font-bold" style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>

                    <div id="psd-whatsapp-grid" className="grid lg:grid-cols-12 gap-8 relative">
                        <div className="lg:col-span-4 bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col shadow-2xl">
                            <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-green-900/30 rounded-lg text-green-400 border border-green-900/50"><Calendar className="w-6 h-6" /></div><h3 className="text-xl font-bold text-white">Listado de Mensajes</h3></div>
                            <div className="space-y-3 flex-1 pr-2 overflow-y-auto custom-scrollbar">
                                {whatsappLaunch.map((script: any, idx: number) => (
                                    <div key={script.id} onClick={() => setActiveWaScript(idx)} className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${sentMessages.has(idx) ? 'bg-green-900/10 border-green-500/30' : (activeWaScript === idx ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800')}`}>
                                        <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${sentMessages.has(idx) ? 'bg-green-500 text-black' : (activeWaScript === idx ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400')}`}>{idx + 1}</div><div className="flex-1 min-w-0"><span className="text-xl font-black uppercase tracking-widest block mb-1 text-blue-500">Mensaje {idx + 1}</span><h4 className="text-lg font-bold leading-tight truncate text-gray-300">{script.name}</h4></div></div>
                                        <div onClick={(e) => toggleSent(e, idx)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sentMessages.has(idx) ? 'border-green-500 bg-green-500' : 'border-gray-600'}`}>{sentMessages.has(idx) && <Check className="w-4 h-4 text-black font-black" />}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-8 bg-black/40 border border-gray-800 rounded-2xl p-6 flex flex-col relative h-full shadow-2xl">
                            {activeItem && activeItem.isGenerated ? (
                                <>
                                    <div className="bg-green-900/10 border border-green-500/20 p-8 rounded-xl space-y-8 mb-6">
                                        <h5 className="text-green-400 font-bold text-2xl uppercase tracking-wider">{activeItem.name}</h5>
                                        <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl flex gap-4"><Info className="w-6 h-6 text-emerald-400 shrink-0" /><p className="text-gray-300 text-base leading-relaxed"><span className="font-bold text-emerald-200 block mb-1">Propósito Estratégico:</span>{activeItem.purpose}</p></div>
                                    </div>
                                    <ChatSimulator messages={processedMessages} senderName={user?.name} />
                                    <div className="flex gap-4 mt-6"><button onClick={() => handleCopy(processedMessages[0]?.text || '')} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2"><Copy className="w-5 h-5" /> Copiar Mensaje</button><button onClick={() => navigate(`/dashboard/whatsapp-launch/editor/${launchId}`)} className="p-4 bg-white/5 border border-white/10 text-white rounded-xl"><PenTool className="w-6 h-6" /></button></div>
                                </>
                            ) : (
                                <div className="space-y-12 animate-in fade-in duration-500 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between"><span className="bg-emerald-900/20 text-emerald-400 border border-emerald-900/50 px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-lg">Pilar: {activeItem?.pilarType}</span><span className="text-white text-lg font-black uppercase tracking-widest italic">{activeItem?.momentText}</span></div>
                                    <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden flex-1">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                                        <div className="flex items-center gap-4 mb-10"><div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400"><Lightbulb className="w-8 h-8" /></div><h4 className="text-2xl font-black text-white tracking-tight">Estrategia de WhatsApp: Momento No {activeWaScript + 1}</h4></div>
                                        <div className="space-y-10">
                                            <div className="space-y-3"><label className="text-lg font-black text-white uppercase ml-1 flex items-center gap-2"><PenTool className="w-5 h-5 text-emerald-500" /> Título Sugerido</label><input type="text" value={activeItem?.name} onChange={(e) => handleUpdateMessage(activeWaScript, 'name', e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-xl outline-none" /></div>
                                            <div className="space-y-3"><div className="flex justify-between items-center"><label className="text-lg font-black text-white uppercase ml-1 flex items-center gap-2"><Settings2 className="w-5 h-5 text-emerald-500" /> Pilar Estratégico (Tipo)</label><button onClick={() => setIsTypeLocked(!isTypeLocked)} className="text-xs font-black text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">{isTypeLocked ? 'Desbloquear' : 'Bloquear'}</button></div><select disabled={isTypeLocked} value={activeItem?.pilarType} onChange={(e) => handleUpdateMessage(activeWaScript, 'pilarType', e.target.value)} className={`w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-xl outline-none appearance-none ${isTypeLocked ? 'opacity-50 grayscale pointer-events-none' : 'border-emerald-500/50'}`}>{waTypes.map(t => (<option key={t} value={t}>{t}</option>))}</select></div>
                                            <div className="space-y-3"><label className="text-lg font-black text-white uppercase ml-1 flex items-center gap-2"><Brain className="w-5 h-5 text-emerald-500" /> Propósito Estratégico</label><textarea rows={4} value={activeItem?.purpose} onChange={(e) => handleUpdateMessage(activeWaScript, 'purpose', e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-6 text-gray-300 text-lg font-light leading-relaxed outline-none resize-none" /></div>
                                        </div>
                                    </div>
                                    <div className="pb-6"><button onClick={() => setShowConfirmModal(true)} className="w-full py-6 rounded-[2cm] bg-emerald-600 text-white font-black text-lg uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4"><Wand2 className="w-7 h-7 fill-current" /> Generar con IA</button></div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-emerald-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                        <div className="p-8 md:p-10 space-y-8 flex-1 text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg animate-pulse"><Sparkles className="w-10 h-10" /></div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Confirma la generación</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">Generar un nuevo lanzamiento de WhatsApp consumirá créditos de tu plan <span className="text-emerald-400 font-bold capitalize">{planLimits?.planName || 'Starter'}</span>.</p>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] shadow-inner text-left"><div className="flex justify-between items-center mb-3"><span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Lanzamientos in tu plan</span><span className="text-white font-bold text-sm">{launchCount} / {isRealAdmin ? '∞' : maxLaunches}</span></div><div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden p-0.5 border border-white/5"><div className={`h-full ${progressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]`} style={{ width: `${isRealAdmin ? (launchCount > 0 ? 100 : 0) : usagePercent}%` }}></div></div></div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0"><button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button><button onClick={handleGenerate} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Confirmar y Generar</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};