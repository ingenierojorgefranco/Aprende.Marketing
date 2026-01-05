import React, { useState } from 'react';
import { StrategyJSON } from '../../../types';
import { User as UserIcon, Brain, Zap, FileText, ArrowRight, CheckCircle, Mail, MessageSquare, Megaphone, Loader2 } from 'lucide-react';

interface StrategyViewerProps {
    strategy: StrategyJSON;
    onClose: () => void;
}

export const StrategyViewer: React.FC<StrategyViewerProps> = ({ strategy, onClose }) => {
    const [activeTab, setActiveTab] = useState<'avatar' | 'psychology' | 'funnel' | 'assets'>('avatar');

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition font-medium text-sm ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
            <Icon className="w-4 h-4" /> {label}
        </button>
    );

    return (
        <div 
            ////////// Actualización: Cierre de modal al hacer clic en fondo - 28/05/2025 15:30 //////////
            onClick={() => onClose()}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
            <div 
                ////////// Actualización: Evitar propagación al contenido - 28/05/2025 15:30 //////////
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0f1115] border border-gray-800 rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-in zoom-in-95"
            >
                
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" /> Estrategia Maestra Generada
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Este informe fue generado por IA basado en tu proyecto.</p>
                    </div>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition">
                        Cerrar
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 bg-gray-900/30 overflow-x-auto">
                    <TabButton id="avatar" label="Avatar" icon={UserIcon} />
                    <TabButton id="psychology" label="Psicología" icon={Brain} />
                    <TabButton id="funnel" label="Embudo" icon={Zap} />
                    <TabButton id="assets" label="Activos & Copy" icon={FileText} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-black/50 custom-scrollbar">
                    
                    {/* AVATAR TAB */}
                    {activeTab === 'avatar' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-2xl border border-blue-500/20 flex gap-6 items-start">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-4xl shadow-lg border border-white/10 shrink-0">
                                    👤
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{strategy.avatar.name}</h3>
                                    <p className="text-blue-300 font-medium mb-4">{strategy.avatar.age} • {strategy.avatar.occupation}</p>
                                    <p className="text-gray-300 leading-relaxed italic border-l-4 border-blue-500 pl-4">{strategy.avatar.story}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                                    <h4 className="text-white font-bold mb-4 flex items-center gap-2"><span className="text-red-400">😡</span> Frustraciones</h4>
                                    <ul className="space-y-3">
                                        {strategy.avatar.frustrations.map((item, i) => (
                                            <li key={i} className="text-gray-400 text-sm flex gap-2">
                                                <span className="text-red-500">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                                    <h4 className="text-white font-bold mb-4 flex items-center gap-2"><span className="text-green-400">😍</span> Deseos Profundos</h4>
                                    <ul className="space-y-3">
                                        {strategy.avatar.desires.map((item, i) => (
                                            <li key={i} className="text-gray-400 text-sm flex gap-2">
                                                <span className="text-green-500">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PSYCHOLOGY TAB */}
                    {activeTab === 'psychology' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                                    <h4 className="text-purple-400 font-bold mb-4 uppercase tracking-wider text-xs">Gatillos Emocionales</h4>
                                    <ul className="space-y-3">
                                        {strategy.psychology.emotionalTriggers.map((item, i) => (
                                            <li key={i} className="text-white font-medium text-lg leading-tight">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gray-900 p-6 rounded-xl border border-orange-500/30">
                                    <h4 className="text-orange-400 font-bold mb-4 uppercase tracking-wider text-xs">Objeciones a Derribar</h4>
                                    <ul className="space-y-3">
                                        {strategy.psychology.objections.map((item, i) => (
                                            <li key={i} className="text-gray-300 text-sm flex gap-2"><span className="text-orange-500">✕</span> {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gray-900 p-6 rounded-xl border border-red-500/30">
                                    <h4 className="text-red-400 font-bold mb-4 uppercase tracking-wider text-xs">Falsas Creencias</h4>
                                    <ul className="space-y-3">
                                        {strategy.psychology.falseBeliefs.map((item, i) => (
                                            <li key={i} className="text-gray-300 text-sm flex gap-2"><span className="text-red-500">⚠</span> {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FUNNEL TAB */}
                    {activeTab === 'funnel' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            
                            <div className="flex flex-col md:flex-row gap-4 items-stretch mb-8">
                                <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 text-center">
                                    <div className="text-4xl mb-4">🧲</div>
                                    <h4 className="text-white font-bold mb-2">Lead Magnet</h4>
                                    <p className="text-gray-400 text-sm">{strategy.funnel.leadMagnetIdea}</p>
                                </div>
                                <div className="hidden md:flex items-center justify-center text-gray-600"><ArrowRight className="w-6 h-6"/></div>
                                {strategy.funnel.tripwireIdea && (
                                    <>
                                        <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 text-center">
                                            <div className="text-4xl mb-4">⚡</div>
                                            <h4 className="text-white font-bold mb-2">Tripwire (Opcional)</h4>
                                            <p className="text-gray-400 text-sm">{strategy.funnel.tripwireIdea}</p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center text-gray-600"><ArrowRight className="w-6 h-6"/></div>
                                    </>
                                )}
                                <div className="flex-1 bg-gradient-to-b from-blue-900/40 to-blue-900/10 p-6 rounded-xl border border-blue-500/50 text-center shadow-lg shadow-blue-900/20">
                                    <div className="text-4xl mb-4">💎</div>
                                    <h4 className="text-white font-bold mb-2">Oferta Principal</h4>
                                    <p className="text-blue-200 text-sm">{strategy.funnel.coreOfferPitch}</p>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                                <h4 className="text-white font-bold mb-4">Pasos del Embudo</h4>
                                <div className="space-y-4">
                                    {strategy.funnel.funnelSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 font-bold shrink-0">{i + 1}</div>
                                            <div className="h-px bg-gray-800 flex-1"></div>
                                            <div className="bg-black border border-gray-700 px-4 py-2 rounded-lg text-gray-300 text-sm flex-1">{step}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ASSETS TAB */}
                    {activeTab === 'assets' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            
                            {/* Emails */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold flex items-center gap-2 text-lg"><Mail className="w-5 h-5 text-blue-400"/> Secuencia de Emails</h3>
                                <div className="grid gap-4">
                                    {strategy.assets.emailSequence.map((email, i) => (
                                        <div key={i} className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{email.delay}</span>
                                                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-900/50">Email #{i+1}</span>
                                            </div>
                                            <h4 className="text-white font-bold mb-2">Asunto: {email.subject}</h4>
                                            <p className="text-gray-400 text-sm whitespace-pre-wrap">{email.body}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-4 pt-6 border-t border-gray-800">
                                <h3 className="text-white font-bold flex items-center gap-2 text-lg"><MessageSquare className="w-5 h-5 text-green-400"/> Scripts WhatsApp</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {strategy.assets.whatsappScripts.map((wa, i) => (
                                        <div key={i} className="bg-[#0b141a] p-5 rounded-xl border border-gray-800 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10"><MessageSquare className="w-20 h-20" /></div>
                                            <h4 className="text-green-400 font-bold mb-3 text-sm uppercase">{wa.scenario}</h4>
                                            <div className="bg-[#202c33] p-3 rounded-lg rounded-tl-none text-white text-sm inline-block max-w-[90%] shadow-sm">
                                                {wa.script}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ads */}
                            <div className="space-y-4 pt-6 border-t border-gray-800">
                                <h3 className="text-white font-bold flex items-center gap-2 text-lg"><Megaphone className="w-5 h-5 text-purple-400"/> Anuncios (Ads)</h3>
                                <div className="grid gap-4">
                                    {strategy.assets.adCopies.map((ad, i) => (
                                        <div key={i} className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{ad.platform}</span>
                                            <h4 className="text-white font-bold mb-2">{ad.headline}</h4>
                                            <p className="text-gray-400 text-sm">{ad.body}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};