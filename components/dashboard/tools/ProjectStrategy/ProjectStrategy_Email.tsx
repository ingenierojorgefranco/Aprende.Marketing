
import React from 'react';
import { Mail, Sparkles, Check, Info, Wand2, Lock } from 'lucide-react';
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
    
    const isUnlocked = features?.emailStrategy || false;
    const currentPlanName = planLimits?.planName || 'Starter';
    const nextPlanName = nextPlan?.name || 'Superior';

    // Porcentaje visual (100% si está desbloqueado, 0% si no)
    const usagePercent = isUnlocked ? 100 : 0;

    return (
        <div id="psd-email-section" className="pt-8">
            <div id="psd-email-header-container" className="max-w-[70em] mx-auto text-left space-y-6 py-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-widest animate-pulse">
                    <Sparkles className="w-4 h-4" /> Estrategia de Email
                </div>
                <h3 id="psd-email-title" className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                    <Mail className="w-12 h-12 text-yellow-500" /> Secuencia de Nutrición (7 Días)
                </h3>
                <p id="psd-email-desc" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                    La bandeja de entrada es un espacio sagrado. Hemos diseñado esta secuencia para educar a tu lead, derribar sus objeciones internas y presentar tu oferta justo cuando están listos para comprar.
                </p>
                
                {/* DYNAMIC LIMITS BANNER */}
                {!isUnlocked ? (
                    <div id="psd-email-upsell-banner" className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-2xl flex flex-col gap-8 mb-12 shadow-lg shadow-purple-900/10 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500 text-white rounded-lg shadow-lg shadow-purple-500/20 flex-shrink-0">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-purple-300 font-bold text-xl mb-1">
                                        Funcionalidad Bloqueada
                                    </h4>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        Actualmente tienes activo el plan <span className="text-white font-bold uppercase">{currentPlanName}</span>. Actualiza a <span className="text-white font-bold uppercase">{nextPlanName}</span> para desbloquear la redacción de emails.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onUpgrade}
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all whitespace-nowrap"
                            >
                                Desbloquear Emails 🚀
                            </button>
                        </div>

                        {/* Progress Bar for Locked View */}
                        <div className="bg-black/40 p-6 rounded-xl border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest">Secuencias Disponibles</span>
                                <span className="text-white font-bold">0 / 1</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out bg-gray-700`} style={{ width: `0%` }}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div id="psd-email-included-banner" className="bg-green-900/20 border border-green-500/30 p-8 rounded-2xl flex flex-col gap-6 mb-12 shadow-lg shadow-green-900/10 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500 text-white rounded-lg shadow-lg shadow-green-500/20 flex-shrink-0">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-green-300 font-bold text-xl mb-1">
                                    Funcionalidad Incluida
                                </p>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Tu plan actual "<span className="text-white font-bold">{currentPlanName.toUpperCase()}</span>" ya incluye la generación de esta secuencia profesional de 7 días.
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-black/30 p-6 rounded-xl border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest">Secuencias Disponibles</span>
                                <span className="text-white font-bold">1 / 1</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]`} style={{ width: `100%` }}></div>
                            </div>
                        </div>
                    </div>
                )}
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
                            {(emailData || []).map((email: any, idx: number) => (
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

                {/* RIGHT: DETAIL PANEL */}
                <div id="psd-email-detail-card" className="bg-black/40 border border-gray-800 rounded-2xl p-8 flex flex-col relative overflow-hidden h-full min-h-[600px] shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <Mail className="w-32 h-32 text-yellow-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        {emailData && emailData.length > 0 && emailData[activeEmail] ? (
                            <>
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {emailData[activeEmail].type}
                                        </span>
                                        <span className="text-gray-500 text-xs font-mono">{emailData[activeEmail].day}</span>
                                    </div>
                                    
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{emailData[activeEmail].subject}</h3>
                                </div>

                                <div className="bg-yellow-900/10 border border-yellow-500/20 p-6 rounded-xl mb-8">
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg h-fit"><Info className="w-5 h-5 text-yellow-200" /></div>
                                        <div>
                                            <span className="text-yellow-200 font-bold block mb-1">Lógica Persuasiva</span>
                                            <p className="text-gray-300 text-base font-light leading-relaxed">
                                                {emailData[activeEmail].objective}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white text-gray-900 rounded-xl p-8 shadow-2xl relative overflow-hidden font-serif leading-relaxed text-lg flex-1 border-2 border-gray-200">
                                    <div className="border-b border-gray-200 pb-4 mb-6 text-sm text-gray-500 font-sans">
                                        <p><strong>De:</strong> Tu Nombre &lt;info@tuempresa.com&gt;</p>
                                        <p><strong>Para:</strong> {avatars?.[0]?.name || 'Prospecto'}</p>
                                    </div>

                                    <p className="mb-4 font-bold">Hola {avatars?.[0]?.name?.split(' ')[0] || 'amiga/o'},</p>
                                    <p className="mb-6">{emailData[activeEmail].bodyPreview}</p>
                                    
                                    <div className="my-8 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm italic">
                                        [... El sistema redactará el cuerpo completo basado en tu avatar ...]
                                    </div>

                                    <p>Atentamente,<br/>Tu Equipo.</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-gray-500 italic">
                                No hay datos de email disponibles.
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <button 
                                onClick={isUnlocked ? () => navigate('/dashboard/email') : onUpgrade} 
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg hover:scale-[1.02] ${isUnlocked ? 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-yellow-900/20' : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'}`}
                            >
                                {isUnlocked ? <Wand2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                {isUnlocked ? 'Redactar Secuencia con IA' : 'Desbloquear Funcionalidad'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
