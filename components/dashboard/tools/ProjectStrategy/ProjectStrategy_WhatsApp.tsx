
import React from 'react';
import { MessageCircle, Sparkles, Check, MessageSquare, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatSimulator: React.FC<{ messages: any[] }> = ({ messages }) => (
    <div id="psd-chat-simulator-container" className="bg-[#0b141a] rounded-xl overflow-hidden border border-gray-800 flex flex-col h-[400px] font-sans text-sm shadow-xl transition-all duration-500 ease-in-out">
        <div id="psd-chat-header" className="bg-[#202c33] p-3 flex items-center gap-3 border-b border-gray-700">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
                L
            </div>
            <div>
                <p className="text-white font-bold text-xs">Laura (Avatar)</p>
                <p className="text-[10px] text-gray-400">en línea</p>
            </div>
        </div>
        <div id="psd-chat-body" className="flex-1 p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 bg-repeat overflow-y-auto">
            {(messages || []).map((msg, i) => (
                <div key={i} id={`psd-chat-message-${i}`} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 fade-in duration-300`} style={{animationDelay: `${i * 150}ms`}}>
                    <div className={`max-w-[85%] p-2.5 rounded-lg shadow-sm text-xs ${msg.role === 'user' ? 'bg-[#202c33] text-white rounded-tl-none' : 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'}`}>
                        {msg.type === 'link' ? (
                            <span className="text-blue-300 underline cursor-pointer hover:text-blue-200">{msg.text}</span>
                        ) : msg.type === 'image' ? (
                            <div className="flex flex-col gap-1">
                                <div className="h-24 w-40 bg-gray-700 rounded animate-pulse flex items-center justify-center text-gray-500 text-[10px]">IMAGEN</div>
                                <span>{msg.text}</span>
                            </div>
                        ) : (
                            msg.text
                        )}
                        <span className="block text-[9px] text-right opacity-60 mt-1">10:0{i} AM</span>
                    </div>
                </div>
            ))}
        </div>
        <div id="psd-chat-footer" className="p-3 bg-[#202c33] border-t border-gray-700 flex gap-2">
            <div className="flex-1 bg-[#2a3942] rounded-lg h-8"></div>
            <div className="w-8 h-8 bg-[#00a884] rounded-full"></div>
        </div>
    </div>
);

interface ProjectStrategy_WhatsAppProps {
    whatsappData: any[];
    activeWaScript: number;
    setActiveWaScript: (idx: number) => void;
    onUpgrade: () => void;
}

export const ProjectStrategy_WhatsApp: React.FC<ProjectStrategy_WhatsAppProps> = ({
    whatsappData, activeWaScript, setActiveWaScript, onUpgrade
}) => {
    const navigate = useNavigate();

    return (
        <div id="psd-whatsapp-section" className="pt-8">
            <div id="psd-whatsapp-header-container" className="w-[80%] mx-auto py-6">
                <h3 id="psd-whatsapp-title" className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    <MessageCircle className="w-8 h-8 text-green-500" /> Mensajes de WhatsApp listos para vender
                </h3>
                <p id="desc-whatsapp" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light mb-8">
                    El cierre de ventas moderno ocurre en conversaciones privadas. Hemos preparado guiones psicológicos probados para que no tengas que improvisar. Desde el saludo inicial hasta el manejo de objeciones de precio, estos mensajes están diseñados para convertir dudas en transacciones.
                </p>
                
                <div id="psd-whatsapp-upsell-banner" className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8 shadow-lg shadow-purple-900/10">
                    <div>
                        <h4 className="text-purple-300 font-bold text-2xl mb-2 flex items-center gap-2">
                            <Sparkles className="w-6 h-6" /> Potencia tu Alcance
                        </h4>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            ⚡ Tu Plan actual permite crear 2 guiones. Actualiza a PRO para generación ilimitada y dominar los buscadores.
                        </p>
                    </div>
                    <button
                        onClick={onUpgrade}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all whitespace-nowrap"
                    >
                        Actualizar a MAX 🚀
                    </button>
                </div>
            </div>

            <div id="psd-whatsapp-grid" className="grid lg:grid-cols-2 gap-8">
                {/* LEFT: SCRIPTS LIST */}
                <div id="psd-whatsapp-list-col" className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-900/30 rounded-lg text-green-400 border border-green-900/50"><MessageCircle className="w-6 h-6" /></div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Guiones de Venta</h3>
                            <p className="text-sm text-gray-400">Selecciona una etapa para simular.</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                        {(whatsappData || []).map((script: any, idx: number) => (
                            <div 
                                key={script.id || idx} 
                                id={`psd-whatsapp-script-${idx}`}
                                onClick={() => setActiveWaScript(idx)}
                                className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-4 ${activeWaScript === idx ? 'bg-green-900/10 border-green-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activeWaScript === idx ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold leading-snug ${activeWaScript === idx ? 'text-green-200' : 'text-gray-300'}`}>{script.title || 'Sin Título'}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{script.objective}</p>
                                    </div>
                                </div>
                                
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${activeWaScript === idx ? 'border-green-500 bg-green-500' : 'border-gray-600'}`}>
                                    {activeWaScript === idx && <Check className="w-3 h-3 text-black font-bold" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: SIMULATOR & STRATEGY */}
                <div id="psd-whatsapp-simulator-col" className="bg-black/40 border border-gray-800 rounded-2xl p-6 flex flex-col relative overflow-hidden h-full min-h-[500px]">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <MessageSquare className="w-32 h-32 text-green-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full gap-6">
                        {whatsappData && whatsappData.length > 0 && whatsappData[activeWaScript] ? (
                            <>
                                {/* Strategy Box */}
                                <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                                    <h5 className="text-green-400 font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <Brain className="w-4 h-4" /> Psicología detrás del guion
                                    </h5>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {whatsappData[activeWaScript].objective}
                                    </p>
                                </div>

                                {/* Simulator */}
                                <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                                    <ChatSimulator messages={whatsappData[activeWaScript].messages || []} />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-gray-500 italic">
                                No hay guiones de WhatsApp disponibles.
                            </div>
                        )}

                        <button onClick={() => navigate('/dashboard/whatsapp')} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition text-lg shadow-lg shadow-green-900/20 hover:scale-[1.02]">
                            <MessageSquare className="w-5 h-5" /> Ir al CRM de WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
