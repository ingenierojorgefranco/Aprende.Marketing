
import React from 'react';
import { Calendar, Sparkles, Check, Info, Crown, Lock } from 'lucide-react';
import { PlanFeatures, PlanLimits, Plan } from '../../../../types';

interface ProjectStrategy_EvergreenProps {
    evergreenData: any[];
    avatars: any[];
    activeEvergreenEmail: number;
    setActiveEvergreenEmail: (idx: number) => void;
    onUpgrade: () => void;
    
    // Updated Prop
    features?: PlanFeatures;
    planLimits?: PlanLimits;
    nextPlan?: Plan | null;
}

export const ProjectStrategy_Evergreen: React.FC<ProjectStrategy_EvergreenProps> = ({
    evergreenData, avatars, activeEvergreenEmail, setActiveEvergreenEmail, onUpgrade, features, planLimits, nextPlan
}) => {
    
    // Check feature flag directly
    const isUnlocked = features?.evergreenStrategy || false;
    const currentPlanName = planLimits?.planName || 'Starter';
    const nextPlanName = nextPlan?.name || 'Superior';

    return (
        <div id="psd-evergreen-section" className="pt-12">
            <div id="psd-evergreen-header-container" className="w-[80%] mx-auto py-6">
                <h3 id="psd-evergreen-title" className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-8 h-8 text-orange-500" /> Secuencia Evergreen (30 Días)
                </h3>
                <div id="psd-evergreen-desc" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light mb-8 space-y-4">
                    <p>
                        Mientras la estrategia de 7 días de email marketing está diseñada específicamente para cerrar ventas rápidas y generar ingresos inmediatos, nuestra secuencia evergreen de 30 días tiene un propósito diferente y complementario.
                    </p>
                    <p>
                        Esta secuencia te permitirá generar contenido informativo, educativo y motivacional que nutrirá a tu audiencia a largo plazo. Estos correos son vitales porque construyen una autoridad inquebrantable, manteniendo a tu marca en la mente del consumidor (Top of Mind) hasta que estén listos para comprar, maximizando el valor de vida del cliente (LTV).
                    </p>
                </div>

                {/* CONDITIONAL BANNER BASED ON FEATURE FLAG */}
                {!isUnlocked ? (
                    <div id="psd-evergreen-upsell-banner" className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8 shadow-lg shadow-purple-900/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500 text-white rounded-lg shadow-lg shadow-purple-500/20">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-purple-300 font-bold text-xl mb-1 flex items-center gap-2">
                                    Funcionalidad Bloqueada
                                </h4>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Actualmente tienes activo el plan <span className="text-white font-bold uppercase">{currentPlanName}</span>, actualiza tu Plan a <span className="text-white font-bold uppercase">{nextPlanName}</span> para desbloquear esta secuencia y seguir creando.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onUpgrade}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all whitespace-nowrap"
                        >
                            Actualizar a {nextPlanName} 🚀
                        </button>
                    </div>
                ) : (
                    <div id="psd-evergreen-included-banner" className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl flex items-center gap-4 mb-8 shadow-lg shadow-green-900/10">
                        <div className="p-3 bg-green-500 text-white rounded-lg shadow-lg shadow-green-500/20">
                            <Check className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-green-300 font-bold text-xl mb-1">
                                Funcionalidad Incluida
                            </p>
                            <p className="text-gray-300 text-lg">
                                ✅ Tienes acceso total a la <strong>Secuencia Evergreen (30 Días)</strong>. ¡Genera confianza a largo plazo sin costo extra!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div id="psd-evergreen-card" className="relative w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 overflow-hidden group shadow-2xl">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* LEFT: LIST */}
                    <div id="psd-evergreen-list-col" className="h-full flex flex-col gap-6">
                        <div id="psd-evergreen-list-card" className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400 border border-orange-900/50"><Calendar className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Secuencia Evergreen de 30 Días</h3>
                                    <p className="text-sm text-gray-400">Contenidos informativos para nutrir a tu audiencia y generar autoridad.</p>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                                {evergreenData.map((email: any, idx: number) => {
                                    const isGap = idx === 3; 
                                    return (
                                        <React.Fragment key={email.id}>
                                            {isGap && (
                                                <div className="flex flex-col items-center gap-1 py-2 opacity-30">
                                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                </div>
                                            )}
                                            <div 
                                                id={`psd-evergreen-item-${idx}`}
                                                onClick={() => setActiveEvergreenEmail(idx)}
                                                className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all cursor-pointer group flex items-start justify-between gap-4 ${activeEvergreenEmail === idx ? 'bg-orange-900/10 border-orange-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${activeEvergreenEmail === idx ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                                                        {email.day.replace('Día ', '')}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{email.day}</span>
                                                        <h4 className={`text-lg font-bold leading-snug ${activeEvergreenEmail === idx ? 'text-orange-200' : 'text-gray-300'}`}>{email.subject}</h4>
                                                    </div>
                                                </div>
                                                
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-2 ${activeEvergreenEmail === idx ? 'border-orange-500 bg-orange-500' : 'border-gray-600'}`}>
                                                    {activeEvergreenEmail === idx && <Check className="w-4 h-4 text-white font-bold" />}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: DETAIL PANEL */}
                    <div id="psd-evergreen-detail-card" className="bg-black/40 border border-gray-800 rounded-2xl p-8 flex flex-col relative overflow-hidden h-full min-h-[600px]">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <Calendar className="w-32 h-32 text-orange-500" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-orange-900/20 text-orange-400 border border-orange-900/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {evergreenData[activeEvergreenEmail].type}
                                    </span>
                                    <span className="text-gray-500 text-xs font-mono">{evergreenData[activeEvergreenEmail].day}</span>
                                </div>
                                
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{evergreenData[activeEvergreenEmail].subject}</h3>
                            </div>

                            <div className="bg-orange-900/10 border border-orange-500/20 p-4 rounded-xl mb-8">
                                <div className="flex gap-2">
                                    <Info className="w-5 h-5 shrink-0 mt-0.5 text-orange-200" />
                                    <div>
                                        <span className="text-orange-200 font-bold block mb-1">Objetivo del correo:</span>
                                        <p className="text-gray-300 text-base font-light leading-relaxed">
                                            {evergreenData[activeEvergreenEmail].objective}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white text-gray-900 rounded-xl p-8 shadow-2xl relative overflow-hidden font-serif leading-relaxed text-lg flex-1 border-2 border-gray-200">
                                <div className="border-b border-gray-200 pb-4 mb-6 text-sm text-gray-500 font-sans">
                                    <p><strong>De:</strong> Tu Nombre &lt;info@tuempresa.com&gt;</p>
                                    <p><strong>Para:</strong> {avatars[0].name}</p>
                                </div>

                                <p className="mb-4">Hola {avatars[0].name.split(' ')[0]},</p>
                                <p className="mb-6">{evergreenData[activeEvergreenEmail].bodyPreview}</p>
                                
                                <div className="my-8 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm italic">
                                    [... Haz clic para generar el contenido completo automáticamente ...]
                                </div>

                                <p>Atentamente,<br/>Tu Equipo.</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-800">
                                <button 
                                    onClick={isUnlocked ? () => {} : onUpgrade} // Add logic if needed for action
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg hover:scale-[1.02] ${isUnlocked ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-orange-900/20' : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'}`}
                                >
                                    {isUnlocked ? (
                                        <><Crown className="w-6 h-6" /> Redactar secuencia automáticamente</>
                                    ) : (
                                        <><Lock className="w-5 h-5" /> Desbloquear para redactar</>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-3">
                                    {isUnlocked ? 'La IA usará esta estrategia.' : 'Actualiza tu plan para desbloquear esta función.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
