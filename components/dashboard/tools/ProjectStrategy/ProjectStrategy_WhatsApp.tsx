import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Check, Copy, Calendar, Brain, PlayCircle, Download, Image as ImageIcon, Lock, Wand2, ArrowRight, PenTool, Info, Sparkles, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../../services/api';

const ChatSimulator: React.FC<{ messages: any[] }> = ({ messages }) => {
    const renderWhatsAppText = (text: string) => {
        if (!text) return null;
        // Divide el texto por fragmentos encerrados en asteriscos: *texto*
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
                    A
                </div>
                <div>
                    <p className="text-white font-bold text-lg leading-tight">Ariana Zamora</p>
                    <p className="text-xs text-emerald-400 font-medium">en línea</p>
                </div>
            </div>
            <div id="psd-chat-body" className="p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 bg-repeat max-h-[400px] overflow-y-auto custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} id={`psd-chat-message-${i}`} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 fade-in duration-300`} style={{animationDelay: `${i * 150}ms`}}>
                        <div className={`max-w-[85%] p-2.5 rounded-lg shadow-sm text-lg whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#202c33] text-white rounded-tl-none' : 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'}`}>
                            {msg.type === 'link' ? (
                                <span className="text-blue-300 underline cursor-pointer hover:text-blue-200">{msg.text}</span>
                            ) : msg.type === 'image' ? (
                                <div className="flex flex-col gap-1">
                                    <div className="h-24 w-40 bg-gray-700 rounded animate-pulse flex items-center justify-center text-gray-500 text-[10px]">IMAGEN</div>
                                    <span>{msg.text}</span>
                                </div>
                            ) : (
                                renderWhatsAppText(msg.text)
                            )}
                            <span className="block text-[9px] text-right opacity-60 mt-1">10:0{i} AM ✓✓</span>
                        </div>
                    </div>
                ))}
            </div>
            <div id="psd-chat-footer" className="p-3 bg-[#202c33] border-t border-gray-700 flex gap-2 shrink-0">
                <div className="flex-1 bg-[#2a3942] rounded-lg h-8"></div>
                <div className="w-8 h-8 bg-[#00a884] rounded-full flex items-center justify-center text-white">
                    <MessageCircle className="w-4 h-4 fill-current" />
                </div>
            </div>
        </div>
    );
};

interface ProjectStrategy_WhatsAppProps {
    whatsappLaunch?: any[];
    activeWaScript: number;
    setActiveWaScript: (idx: number) => void;
    onUpgrade: () => void;
    isLocked?: boolean;
    projectId?: string;
}

export const ProjectStrategy_WhatsApp: React.FC<ProjectStrategy_WhatsAppProps> = ({
    whatsappLaunch = [], activeWaScript, setActiveWaScript, onUpgrade, isLocked = true, projectId
}) => {
    const navigate = useNavigate();
    const [launchDate, setLaunchDate] = useState<string>('');
    const [launchId, setLaunchId] = useState<string | null>(null);
    const [sentMessages, setSentMessages] = useState<Set<number>>(new Set());
    const [imageUrls, setImageUrls] = useState<Record<number, string>>({
        0: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80'
    });
    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadLaunchConfig = async () => {
            if (!projectId) return;
            try {
                const launch = await api.getWhatsAppLaunchByProject(projectId);
                if (launch) {
                    setLaunchId(launch.id);
                    if (launch.launchDate) {
                        const dateOnly = typeof launch.launchDate === 'string' 
                            ? launch.launchDate.split('T')[0] 
                            : launch.launchDate.toISOString().split('T')[0];
                        setLaunchDate(dateOnly);
                    }
                }
            } catch (e) {
                console.error("Error cargando configuración de lanzamiento", e);
            }
        };
        loadLaunchConfig();
    }, [projectId]);

    const formatLongDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T12:00:00'); 
        const formatter = new Intl.DateTimeFormat('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
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

    const currentData = whatsappLaunch;
    const activeItem = currentData[activeWaScript] || currentData[0];

    // Lógica dinámica para normalizar y reemplazar fechas en el mensaje
    let displayMessages: any[] = [];
    if (activeItem) {
        if (activeItem.messages && Array.isArray(activeItem.messages)) {
            displayMessages = activeItem.messages;
        } else if (activeItem.content) {
            displayMessages = [{ role: 'agent', text: activeItem.content }];
        }
    }

    const processedMessages = displayMessages.map((m: any) => {
        let text = m.text || '';
        if (launchDate) {
            const classDate = getCalculatedDate(launchDate, 4);
            text = text.replace('[FECHA_CLASE]', classDate);
        }
        return {
            ...m,
            text: text
        };
    });

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

    const getMessageDisplayName = (idx: number, originalName: string) => {
        if (idx === 5) return "Cuenta Regresiva";
        if (idx === 7) return "Oferta Abierta";
        if (idx === 11) return "Últimos Cupos";
        if (idx === 13) return "Cierre de Lanzamiento";
        return originalName;
    };

    const handleContainerClick = () => {
        if (dateInputRef.current) {
            try {
                dateInputRef.current.showPicker();
            } catch (e) {
                dateInputRef.current.focus();
                dateInputRef.current.click();
            }
        }
    };

    const handleLaunchDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setLaunchDate(newDate);
        if (launchId) {
            try {
                await api.updateWhatsAppLaunch(launchId, { launchDate: newDate });
            } catch (error) {
                console.error("Error persistiendo fecha de lanzamiento", error);
            }
        }
    };

    return (
        <div id="psd-whatsapp-section" className="pt-8">
            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    transform: scale(2.2);
                    filter: invert(1);
                    margin-left: 10px;
                }
                input[type="date"] {
                    font-size: 1.5rem;
                    padding: 1rem;
                }
            `}</style>
            <div id="psd-whatsapp-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-green-500/5">
                    <MessageCircle className="w-5 h-5" /> Resumen estratégico de tu Proyecto
                </div>
                <h3 id="psd-whatsapp-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Secuencia de Lanzamiento <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"><b>Lanzamiento vía WhatsApp</b></span>
                </h3>
                <div className="grid md:grid-cols-2 gap-10 text-white text-xl leading-relaxed font-light">
                    <p className="border-l-4 border-green-500 pl-8 py-2">
                        Esta secuencia está diseñada para generar un pico de ventas masivo en tu grupo de WhatsApp, guiando a los prospectos desde la expectativa hasta la apertura de inscripciones.
                    </p>
                    <p className="border-l-4 border-emerald-500 pl-8 py-2">
                        Utiliza cada mensaje en el momento indicado para activar los gatillos mentales de comunidad, anticipación y escasez en tu audiencia.
                    </p>
                </div>
            </div>

            <div id="psd-whatsapp-video-block" className="max-w-[70em] mx-auto px-4 md:px-0 mb-12">
                <div className="bg-gray-900/40 p-4 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-indigo-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30"></div>
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-inner bg-black relative">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" 
                            title="Estrategia de Cierre por WhatsApp" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity group-hover:opacity-0">
                            <PlayCircle className="w-5 h-5 text-indigo-400" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Video Explicativo de Cierre</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selector Global de Fecha */}
            <div className="max-w-[70em] mx-auto px-4 md:px-0 mb-12">
                <div 
                    className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-in slide-in-from-top-2 duration-500 cursor-pointer hover:bg-white/10 transition-all"
                    onClick={handleContainerClick}
                >
                    <label className="block text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-3 cursor-pointer">
                        <Calendar className="w-8 h-8" /> Define la Fecha de Inicio del Lanzamiento
                    </label>
                    <input 
                        ref={dateInputRef}
                        type="date" 
                        value={launchDate}
                        onChange={handleLaunchDateChange}
                        className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition-all font-bold cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
            </div>

            <div id="psd-whatsapp-grid" className="grid lg:grid-cols-12 gap-8 relative">
                
                <div id="psd-whatsapp-list-col" className="lg:col-span-4 bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-900/30 rounded-lg text-green-400 border border-green-900/50">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Listado de Mensajes</h3>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 pr-2 overflow-y-auto custom-scrollbar">
                        {currentData.map((script: any, idx: number) => {
                            return (
                                <div 
                                    key={script.id} 
                                    id={`psd-whatsapp-script-${idx}`}
                                    onClick={() => setActiveWaScript(idx)}
                                    className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${sentMessages.has(idx) ? 'bg-green-900/10 border-green-500/30' : (activeWaScript === idx ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800')}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${sentMessages.has(idx) ? 'bg-green-500 text-black' : (activeWaScript === idx ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400')}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`text-xl font-black uppercase tracking-widest block mb-1 ${sentMessages.has(idx) ? 'text-green-500' : 'text-blue-500'}`}>Mensaje {idx + 1}</span>
                                            <h4 className={`text-lg font-bold leading-tight truncate ${sentMessages.has(idx) ? 'text-green-200' : (activeWaScript === idx ? 'text-blue-200' : 'text-gray-300')}`}>{getMessageDisplayName(idx, script.name || script.title)}</h4>
                                            <div className="text-base text-gray-500 mt-0.5" style={{ fontSize: '1rem' }}>
                                                {launchDate ? (
                                                    <>
                                                        <p>{getCalculatedDate(launchDate, idx)}</p>
                                                        {getTimeForMessage(idx) && <p className="font-bold text-gray-400">{getTimeForMessage(idx)}</p>}
                                                    </>
                                                ) : ''}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        onClick={(e) => toggleSent(e, idx)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${sentMessages.has(idx) ? 'border-green-500 bg-green-500' : 'border-gray-600 hover:border-gray-400'}`}
                                    >
                                        {sentMessages.has(idx) && <Check className="w-4 h-4 text-black font-black" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div id="psd-whatsapp-simulator-col" className="lg:col-span-8 bg-black/40 border border-gray-800 rounded-2xl p-6 flex flex-col relative overflow-hidden h-full shadow-2xl">
                    
                    <div className="relative z-10 flex flex-col gap-6 mb-6">
                        <div className="bg-green-900/10 border border-green-500/20 p-8 rounded-xl space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center text-[10px] font-black shrink-0">
                                        {activeWaScript + 1}
                                    </div>
                                    <h5 className="text-green-400 font-bold text-2xl uppercase tracking-wider">
                                        Mensaje {activeWaScript + 1}
                                    </h5>
                                </div>
                                <p className="text-gray-300 text-xl leading-relaxed font-light">
                                    {getMessageDisplayName(activeWaScript, activeItem.name || activeItem.title)}
                                </p>
                            </div>

                            <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl flex gap-4">
                                <Info className="w-6 h-6 text-emerald-400 shrink-0" />
                                <p className="text-gray-300 text-base leading-relaxed">
                                    <span className="font-bold text-emerald-200 block mb-1">Propósito Estratégico:</span>
                                    {activeItem?.purpose || activeItem?.objective}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> URL de Imagen Adjunta (Opcional)
                                </label>
                                <input 
                                    type="text" 
                                    value={imageUrls[activeWaScript] || ''}
                                    onChange={(e) => handleImageUrlChange(e.target.value)}
                                    placeholder="Pega la URL de la imagen que enviarás con este mensaje..."
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {imageUrls[activeWaScript] && (
                                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                                    <div className="relative aspect-video max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                        <img src={imageUrls[activeWaScript]} alt="Adjunto" className="w-full h-full object-cover" />
                                    </div>
                                    <button 
                                        onClick={() => window.open(imageUrls[activeWaScript], '_blank')}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10 transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Descargar Imagen Adjunta
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ÁREA DE SIMULADOR Y COPIADO */}
                    <div className="relative flex-1 flex flex-col gap-6">
                        
                        <div className={`flex-1 flex flex-col gap-6 transition-all duration-500`}>
                            {activeItem.isGenerated ? (
                                <>
                                    <div className="border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                                        <ChatSimulator messages={processedMessages} />
                                    </div>

                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleCopy(processedMessages[0]?.text || '')}
                                            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-lg shadow-lg shadow-emerald-900/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                                        >
                                            <Copy className="w-5 h-5" /> Copiar Mensaje
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/dashboard/whatsapp-launch/editor/${projectId}`)}
                                            className="p-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl transition-all"
                                            title="Editar Script"
                                        >
                                            <PenTool className="w-6 h-6" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-12 animate-in fade-in duration-500 flex-1 flex flex-col">
                                    <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden flex-1">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                                        
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                                <Lightbulb className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-white tracking-tight leading-none">Estrategia de WhatsApp: Momento No {activeWaScript + 1}</h4>
                                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-4 leading-relaxed">Nuestra inteligencia Artificial generará tu mensaje persuasivo basado en esto.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-3">
                                                <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                                    Pilar Estratégico: <span className="text-emerald-400">{activeItem.pilarType}</span>
                                                </label>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                                    <Brain className="w-5 h-5 text-emerald-500" /> Propósito Estratégico
                                                </label>
                                                <div className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-gray-300 text-lg font-light leading-relaxed">
                                                    {activeItem.purpose || activeItem.objective}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                                    <PenTool className="w-5 h-5 text-emerald-500" /> Título Sugerido
                                                </label>
                                                <div className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-xl">
                                                    {activeItem.name || activeItem.title}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pb-6">
                                        <button 
                                            onClick={() => navigate(`/dashboard/whatsapp-launch/create?projectId=${projectId}`)}
                                            className="w-full py-6 rounded-[2cm] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95 shadow-emerald-900/30"
                                        >
                                            <Wand2 className="w-7 h-7 fill-current" /> Generar Mensaje con IA
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FOOTER INFORMATIVO */}
            <div className="max-w-[70em] mx-auto text-center pt-12 border-t border-white/5 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sistema de Lanzamiento WhatsApp v2.9 — Motor Meteórico</p>
            </div>
        </div>
    );
};
