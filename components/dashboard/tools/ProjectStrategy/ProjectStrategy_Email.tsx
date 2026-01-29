import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Check, Info, Wand2, Lock, PlayCircle, Edit3, Settings2, Zap, Lightbulb, ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlanFeatures, PlanLimits, Plan } from '../../../../types';

interface ProjectStrategy_EmailProps {
    emailData: any[];
    avatars: any[];
    activeEmail: number;
    setActiveEmail: (idx: number) => void;
    onUpgrade: () => void;
    
    // Props de límites
    features?: PlanFeatures;
    planLimits?: PlanLimits;
    nextPlan?: Plan | null;
}

export const ProjectStrategy_Email: React.FC<ProjectStrategy_EmailProps> = ({
    emailData, avatars, activeEmail, setActiveEmail, onUpgrade, features, planLimits, nextPlan
}) => {
    const navigate = useNavigate();

    // Estados locales para permitir el refinamiento estratégico antes de la generación
    const [localSubject, setLocalSubject] = useState('');
    const [localPilar, setLocalPilar] = useState('');
    const [localPurpose, setLocalPurpose] = useState('');
    const [isTypeLocked, setIsTypeLocked] = useState(true);

    const emailTypes = [
        'Entrega de Valor', 
        'Agitación del Dolor', 
        'Prueba Social', 
        'Mecanismo Único', 
        'Lanzamiento', 
        'Escasez', 
        'Cierre'
    ];

    // Sincronizar estados locales cuando cambia el correo activo en la lista
    useEffect(() => {
        if (emailData && emailData[activeEmail]) {
            const current = emailData[activeEmail];
            setLocalSubject(current.subject || '');
            setLocalPilar(current.type || '');
            setLocalPurpose(current.objective || '');
            setIsTypeLocked(true);
        }
    }, [activeEmail, emailData]);

    return (
        <div id="psd-email-section" className="pt-8">
            {/* --- ENCABEZADO ESTRATÉGICO DE CLASE MUNDIAL --- */}
            <div id="psd-email-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/5">
                    <Sparkles className="w-5 h-5" /> Correos Electrónicos Automáticos
                </div>
                
                <h3 id="psd-email-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Secuencia de Nutrición <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">(7 Días)</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-10 text-white text-xl leading-relaxed font-light">
                    <p className="border-l-4 border-yellow-500 pl-8 py-2">
                        La bandeja de entrada es un espacio sagrado. Hemos diseñado esta secuencia para educar a tu lead y derribar sus objeciones internas de forma progresiva.
                    </p>
                    <p className="border-l-4 border-blue-500 pl-8 py-2">
                        Preparamos el terreno psicológico para presentar tu oferta justo en el momento en que el usuario está más predispuesto a tomar la decisión de compra.
                    </p>
                </div>
            </div>

            {/* BLOQUE DE VIDEO: SOPORTE VISUAL ESTRATÉGICO */}
            <div id="psd-email-video-block" className="max-w-[70em] mx-auto px-4 md:px-0 mb-12">
                <div className="bg-gray-900/40 p-4 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-indigo-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30"></div>
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-inner bg-black relative">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" 
                            title="Estrategia de Email Marketing" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity group-hover:opacity-0">
                            <PlayCircle className="w-5 h-5 text-indigo-400" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Video Explicativo de Email</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="psd-email-grid" className="grid lg:grid-cols-2 gap-8">
                {/* LEFT: EMAIL LIST */}
                <div id="psd-email-list-col" className="h-full flex flex-col gap-6">
                    <div id="psd-email-list-card" className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col h-full shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400 border border-yellow-900/50"><Mail className="w-6 h-6" /></div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Estructura de la Secuencia</h3>
                                <p className="text-sm text-gray-400">Contenidos persuasivos por día.</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                            {emailData.map((email: any, idx: number) => (
                                <div 
                                    key={email.id} 
                                    id={`psd-email-item-${idx}`}
                                    onClick={() => setActiveEmail(idx)}
                                    className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all cursor-pointer group flex items-start justify-between gap-4 ${activeEmail === idx ? 'bg-yellow-900/10 border-yellow-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${activeEmail === idx ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{email.day}</span>
                                            <h4 className={`text-lg font-bold leading-snug ${activeEmail === idx ? 'text-yellow-200' : 'text-gray-300'}`}>{email.subject}</h4>
                                        </div>
                                    </div>
                                    
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-2 ${activeEmail === idx ? 'border-yellow-500 bg-yellow-500' : 'border-gray-600'}`}>
                                        {activeEmail === idx && <Check className="w-4 h-4 text-black font-bold" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: CONFIGURACIÓN ESTRATÉGICA (Transformado al estilo GeneratorLanding) */}
                <div id="psd-email-detail-card" className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] shadow-xl group/form relative overflow-hidden flex-1 min-h-[600px]">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
                    
                    <div className="relative z-10 space-y-12 animate-in fade-in duration-500 h-full flex flex-col">
                        <div className="flex items-center justify-between">
                            <span className="bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                Configurando: {localPilar || 'Nutrición'}
                            </span>
                            <span className="text-white text-lg font-black uppercase tracking-widest">Correo del Día {activeEmail + 1}</span>
                        </div>

                        <div className="flex-1 space-y-10">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-400">
                                    <Lightbulb className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white tracking-tight">Estrategia de Correo Electrónico: Día No {activeEmail + 1}</h4>
                                    <p className="text-sm text-white font-bold uppercase tracking-widest mt-4 leading-relaxed">Refina la instrucción estratégica antes de que la IA redacte el contenido completo.</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {/* Campo Asunto */}
                                <div className="space-y-3">
                                    <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                        <Edit3 className="w-5 h-5 text-[#FF5A1F]" /> Asunto Sugerido
                                    </label>
                                    <div className="relative">
                                        <textarea 
                                            rows={2}
                                            value={localSubject}
                                            onChange={(e) => setLocalSubject(e.target.value)}
                                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-xl outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all shadow-inner resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>

                                {/* Pilar Estratégico */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                            <Settings2 className="w-5 h-5 text-[#FF5A1F]" /> Pilar Estratégico (Tipo)
                                        </label>
                                        <button 
                                            onClick={() => setIsTypeLocked(!isTypeLocked)}
                                            className="text-xs font-black text-[#FF5A1F] uppercase tracking-widest hover:underline px-3 py-1 bg-[#FF5A1F]/10 rounded-lg border border-[#FF5A1F]/20 transition-all"
                                        >
                                            {isTypeLocked ? 'Cambiar' : 'Bloquear'}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <select 
                                            disabled={isTypeLocked}
                                            value={localPilar}
                                            onChange={(e) => setLocalPilar(e.target.value)}
                                            className={`w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-xl outline-none transition-all shadow-inner appearance-none cursor-pointer ${isTypeLocked ? 'opacity-50 grayscale pointer-events-none' : 'border-yellow-500/50 ring-2 ring-yellow-500/10'}`}
                                        >
                                            {emailTypes.map(t => (
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

                                {/* Propósito del Día */}
                                <div className="space-y-3">
                                    <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-[#FF5A1F]" /> Propósito Estratégico del Día
                                    </label>
                                    <textarea 
                                        rows={4}
                                        value={localPurpose}
                                        onChange={(e) => setLocalPurpose(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-gray-300 text-lg font-light leading-relaxed outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all shadow-inner resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 shrink-0">
                            <button 
                                onClick={() => navigate('/dashboard/email')} 
                                className="w-full py-6 rounded-[2cm] bg-gradient-to-r from-[#FF5A1F] to-orange-500 hover:from-[#D94A1E] hover:to-orange-600 text-white font-black text-lg uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95"
                            >
                                <Wand2 className="w-7 h-7 fill-current" /> Redactar Secuencia con IA
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
