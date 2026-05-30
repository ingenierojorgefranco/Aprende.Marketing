import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Rocket, ChevronRight, Loader2, CheckCircle, ShieldCheck, Play, ArrowRight, MousePointer2, UserCircle2, Brain, Wand2, Quote, User, HeartPulse, MessageSquareQuote, Lock } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

interface StepProps {
    onNext: (data?: any) => void;
    data?: any;
    userData: any;
    disabled?: boolean;
    onView?: () => void;
    onEdit?: () => void;
}

// 1. BIENVENIDA
export const WelcomeStep: React.FC<StepProps> = ({ onNext, userData, disabled }) => {
    const userName = userData.name?.split(' ')[0] || 'Emprendedor';
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
        >
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#FF5A1F] blur-3xl opacity-20 animate-pulse"></div>
                <div className="w-24 h-24 bg-[#FF5A1F] rounded-3xl flex items-center justify-center mx-auto mb-6 relative border border-white/20 shadow-2xl">
                    <Sparkles className="w-12 h-12 text-white" />
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                        ¡Hola, {userName}!
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-medium text-[#FF5A1F] tracking-tight">
                        Bienvenido a Aprende.Marketing
                    </h2>
                </div>
                <p className="text-[1.4rem] text-white max-w-2xl mx-auto font-medium leading-relaxed">
                    A continuación te ayudaré a construir tu primer sistema de ventas paso a paso.
                </p>
            </div>

            <div className="bg-[#111] border border-white/5 p-10 rounded-[3.5rem] max-w-2xl mx-auto shadow-2xl relative overflow-hidden text-left mt-8">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Rocket className="w-32 h-32 text-white" />
                </div>
                
                <div className="space-y-6 relative z-10 text-lg">
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            'Te ayudaré a seleccionar un proyecto digital rentable.',
                            'Crearé tu página web donde visitantes interesados podrán registrarse.',
                            'Crearé tus videos y contenidos listos para publicar en Redes Sociales'
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                </div>
                                <p className="text-white text-[1.1em] font-normal leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-white/5">
                        <p className="text-[#FF5A1F] font-medium flex items-center gap-2">
                            👉 <span className="tracking-tight">Empieza Ahora, no necesitas experiencia.</span>
                        </p>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => !disabled && onNext()}
                disabled={disabled}
                className={`group flex items-center gap-4 px-12 py-7 ${disabled ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-[#FF5A1F] hover:bg-[#D94A1E] shadow-[0_20px_50px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95'} text-white rounded-[2.5rem] font-black text-2xl transition-all mx-auto`}
            >
                {disabled ? 'Configuración en proceso' : 'Comenzar configuración'}
                {!disabled && <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />}
            </button>
        </motion.div>
    );
};

// 2. SELECCIÓN DE PROYECTO
export const ProjectSelectionStep: React.FC<StepProps & { projects: any[], loading: boolean, selectedProjectId?: string, isLocked?: boolean }> = ({ projects, loading, onNext, selectedProjectId, isLocked }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#FF5A1F]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-black uppercase tracking-[0.2em]">Cargando Vehículos de Venta...</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
        >
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    Elige el <span className="text-[#FF5A1F]">proyecto digital</span> con el que quieres empezar
                </h2>
                <p className="text-[1.3rem] text-white max-w-2xl mx-auto font-medium leading-relaxed">
                    Selecciona la oportunidad que mejor se adapte a tus intereses y empieza a construir tu sistema de ventas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] mx-auto w-full">
                {projects.map((project) => {
                    const isSelected = selectedProjectId === project.id;
                    
                    return (
                        <motion.div 
                            key={project.id}
                            whileHover={isLocked ? {} : { y: -10 }}
                            className={`bg-[#111] border ${isSelected ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20' : 'border-white/5'} ${isLocked && !isSelected ? 'opacity-40 grayscale' : 'opacity-100'} rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#FF5A1F]/50 transition-all flex flex-col h-full shadow-2xl relative min-h-[520px] w-full`}
                            onClick={() => !isLocked && onNext(project)}
                        >
                            {isSelected && (
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-[#FF5A1F] text-white p-1 rounded-full">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            )}
                            <div className="h-64 bg-gray-800 relative overflow-hidden">
                                {project.multimedia_json?.heroImages?.[0] ? (
                                    <img src={project.multimedia_json.heroImages[0]} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                                        <Target className="w-12 h-12 text-[#FF5A1F] opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="px-4 py-2 bg-white text-[#FF5A1F] text-[12px] font-black uppercase rounded-full shadow-lg">
                                        {project.niche || 'Digital'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-10 flex flex-col flex-1">
                                <h3 className={`text-3xl font-black mb-4 ${isSelected ? 'text-[#FF5A1F]' : 'text-white'} group-hover:text-[#FF5A1F] transition-colors`}>
                                    {project.name}
                                </h3>
                                <p className="text-white text-base leading-relaxed mb-8 flex-1 line-clamp-4">
                                    {project.shortDescription || project.description}
                                </p>
                                <div className="flex items-center justify-center pt-8 border-t border-white/5">
                                    <button className="w-full py-4 bg-[#FF5A1F] text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF5A1F]/20 group-hover:bg-[#D94A1E] transition-all">
                                        Seleccionar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

// 2.5 PROTOCOLO DE DESBLOQUEO (Modal-like)
export const UnlockProtocolStep: React.FC<StepProps & { project: any, isStrategyGenerated?: boolean, onBackToSelection?: () => void }> = ({ project, onNext, isStrategyGenerated, onBackToSelection }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    
    // Ensure commission is a whole number for display
    const rawCommission = project.commissionRate || 80;
    const displayCommission = rawCommission < 1 ? Math.round(rawCommission * 100) : Math.round(rawCommission);
    const profitValue = project.fullPrice && displayCommission ? (project.fullPrice * (displayCommission / 100)).toFixed(2) : '0.00';

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative"
        >
            {/* Niche Badge - Corner Position */}
            <div className="absolute top-4 right-4 z-20 px-6 py-2 bg-[#FF5A1F] border border-white/20 rounded-full shadow-2xl">
                <p className="text-xs font-black text-white uppercase tracking-[0.2em]">{project.niche || 'Digital'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                {/* Lateral info */}
                <div className="md:col-span-2 bg-[#111] p-10 lg:p-14 border-r border-white/5 flex flex-col justify-center">
                    <div className="space-y-10">
                        <div className="space-y-2 text-center">
                            <p className="text-[#FF5A1F] font-black text-xs uppercase tracking-[0.3em]">Producto que vas a vender</p>
                            <h3 className="text-[2rem] font-black text-white uppercase leading-tight tracking-tighter">{project.name}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl px-8 py-4 flex flex-col items-center justify-center text-center space-y-2 shadow-lg shadow-emerald-500/5">
                                <p className="text-emerald-500/70 font-medium text-sm uppercase tracking-wider">¿Cuánto vas a ganar? (Dólares)</p>
                                <p className="text-emerald-500 text-5xl font-black tracking-tighter">$ {profitValue}</p>
                            </div>

                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl px-8 py-4 flex flex-col items-center justify-center text-center space-y-2">
                                <p className="text-blue-500/70 font-medium text-sm uppercase tracking-wider">Comisión por Venta</p>
                                <p className="text-blue-500 text-5xl font-black tracking-tighter">{displayCommission}%</p>
                            </div>
                            
                            <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-4 flex flex-col items-center justify-center text-center space-y-2">
                                <p className="text-gray-400 font-medium text-sm uppercase tracking-wider">Precio de Venta al Público</p>
                                <p className="text-white text-5xl font-black tracking-tighter">$ {project.fullPrice || '0.00'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video/Main Action */}
                <div className="md:col-span-3 p-10 lg:p-14 flex flex-col items-center justify-center text-center space-y-10">
                    <div className="w-full space-y-6">
                        <p className="text-xs text-white font-medium uppercase tracking-[0.2em] mb-4">Mira el video para conocer detalles del producto</p>
                        <div className="relative group w-full aspect-video bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/10 flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                            <div 
                                className="absolute inset-0 w-full h-full group/play overflow-hidden"
                            >
                                {project.multimedia_json?.heroImages?.[0] ? (
                                    <img 
                                        src={project.multimedia_json.heroImages[0]} 
                                        alt={project.name} 
                                        className="w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-700" 
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                                        <Target className="w-12 h-12 text-[#FF5A1F] opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 group-hover/play:bg-black/30 transition-colors flex items-center justify-center">
                                    <div className="w-20 h-20 bg-[#FF5A1F] rounded-full flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform relative">
                                        <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
                                        <div className="absolute inset-0 bg-[#FF5A1F] rounded-full animate-ping opacity-25"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[1.1rem] text-white max-w-2xl mx-auto font-medium leading-relaxed">Haz clic en Desbloquear para crear tu estrategia de ventas</p>
                    </div>

                    <div className="w-full space-y-8">
                        <div className="space-y-6">
                            <button 
                                onClick={() => !isStrategyGenerated && onNext()}
                                disabled={isStrategyGenerated}
                                className={`w-full py-7 ${isStrategyGenerated ? 'bg-emerald-500 cursor-default' : 'bg-[#FF5A1F] hover:bg-[#D94A1E]'} text-white rounded-[2.5rem] font-black text-2xl transition-all shadow-[0_25px_50px_-10px_rgba(255,90,31,0.5)] flex items-center justify-center gap-4 group transform hover:-translate-y-1 active:scale-95`}
                            >
                                {isStrategyGenerated ? 'ESTRATEGIA DESBLOQUEADA' : 'DESBLOQUEAR AHORA'}
                                <Zap className={`w-7 h-7 fill-white ${!isStrategyGenerated ? 'animate-pulse' : ''}`} />
                            </button>
                            
                            {(onBackToSelection && !isStrategyGenerated) && (
                                <button 
                                    onClick={onBackToSelection}
                                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all mx-auto flex items-center gap-2"
                                >
                                    <ChevronRight className="w-4 h-4 rotate-180" />
                                    Seleccionar otro proyecto
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// 3. GENERACIÓN (LOADING STATE)
export const GenerationStep: React.FC<{ progress: number, status: string, secondsElapsed?: number, message?: string }> = ({ progress, status, secondsElapsed = 0, message }) => {
    return (
        <div className="flex flex-col items-center justify-center px-6 space-y-12 text-center max-w-4xl mx-auto py-10">
            <div className="relative">
                <div className="absolute inset-x-0 -top-20 -bottom-20 bg-[#FF5A1F]/20 blur-[120px] rounded-full animate-pulse transition-all duration-1000"></div>
                <div className="relative w-40 h-40 rounded-[3rem] bg-[#0A0A0A] border-2 border-[#FF5A1F]/30 flex items-center justify-center shadow-[0_25px_100px_-20px_rgba(255,90,31,0.3)] group overflow-hidden">
                    <Brain className="w-20 h-20 text-[#FF5A1F] animate-bounce" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5A1F]/5 to-transparent"></div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-3 rounded-full shadow-2xl border-4 border-[#0A0A0A] animate-in zoom-in-50 duration-500">
                        <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
                    </div>
                </div>
            </div>

            <div className="space-y-10 w-full max-w-2xl relative z-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
                        {status || 'Estoy creando tu estrategia de Ventas'}
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl font-medium italic max-w-lg mx-auto leading-relaxed opacity-80">
                        "{message || "No cierres esta ventana, estoy analizando el producto que has elegido y configurando todo lo que necesitas para generar ventas masivas."}"
                    </p>
                </div>
                
                <div className="flex flex-col items-center gap-8">
                    {/* Contador de tiempo */}
                    <div className="bg-gradient-to-br from-[#111] to-black p-10 rounded-[3rem] border border-white/5 shadow-2xl text-center min-w-[320px] transform hover:scale-105 transition-transform">
                        <p className="text-[#FF5A1F] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Terminaré en menos de</p>
                        <div className="text-white font-mono text-6xl font-black tracking-tighter drop-shadow-[0_5px_15px_rgba(255,255,255,0.1)]">
                            {Math.floor(Math.max(0, 90 - secondsElapsed) / 60).toString().padStart(2, '0')}:{(Math.max(0, 90 - secondsElapsed) % 60).toString().padStart(2, '0')}
                        </div>
                        {secondsElapsed > 90 && (
                            <p className="text-amber-500 font-bold text-sm mt-4 animate-pulse">
                                Espera un poco más, estoy ultimando detalles
                            </p>
                        )}
                    </div>

                    <div className="w-full space-y-6">
                        <div className="flex justify-between items-end px-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                    Procesando arquitectura...
                                </span>
                            </div>
                            <span className="text-2xl font-black text-[#FF5A1F]">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-[#111] h-8 rounded-full overflow-hidden border border-white/10 p-1.5 shadow-2xl relative">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-[#FF5A1F] via-[#FF8C00] to-white rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[loading-shine_1.5s_infinite]"></div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 px-8 py-4 bg-red-500/5 border border-red-500/20 rounded-[2rem] backdrop-blur-md">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                        <p className="text-red-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                            ⚠️ No cierres esta pestaña, el sistema está trabajando...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. REVELACIÓN DE AVATARES
export const AvatarRevealStep: React.FC<StepProps & { avatars: any[] }> = ({ avatars, onNext }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
        >
            <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-2xl">
                    <UserCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                    Conoce a las personas <span className="text-blue-500">a las que vas a atraer</span>
                </h2>
                <p className="text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed">
                    Identificamos los perfiles con mayor probabilidad de compra para este proyecto.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {avatars.map((avatar, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6 shadow-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all text-blue-500 shrink-0">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Perfil {idx + 1}</p>
                                <h4 className="text-xl font-bold text-white tracking-tight">{avatar.name}</h4>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Target className="w-4 h-4" />
                                    <p className="text-xs font-bold uppercase tracking-wider">Lo que quiere</p>
                                </div>
                                <p className="text-[15px] text-slate-300 leading-relaxed font-normal">
                                    {avatar.painPoints?.[0] || 'Busca una solución efectiva para su situación actual.'}
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <HeartPulse className="w-4 h-4" />
                                    <p className="text-xs font-bold uppercase tracking-wider">Lo que le preocupa</p>
                                </div>
                                <p className="text-[15px] text-slate-300 leading-relaxed font-normal">
                                    {avatar.desires?.[0] || 'Alcanzar mejores resultados y estabilidad financiera.'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <button 
                    onClick={() => onNext()}
                    className="flex items-center gap-4 px-10 py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-3xl font-black text-lg transition-all shadow-[0_15px_30px_-10px_rgba(59,130,246,0.4)] transform hover:-translate-y-1 active:scale-95"
                >
                    Continuar configuración
                    <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        </motion.div>
    );
};

// 4.5 ESTRATEGIA LISTA
export const StrategyReadyStep: React.FC<StepProps & { project?: any }> = ({ onNext, project }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 md:space-y-8"
        >
            <div className="relative inline-block">
                {/* Visual "Wow" Effect: Animated rings/glow */}
                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-30 animate-pulse"></div>
                <div className="absolute -inset-4 border-2 border-emerald-500/20 rounded-[3rem] animate-ping opacity-20"></div>
                
                <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-0 relative border border-white/30 shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)]">
                    <CheckCircle className="w-14 h-14 text-white" />
                </div>
            </div>

            <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto mt-0">
                <div className="space-y-3 md:space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                        ¡Perfecto! <span className="text-emerald-500">Ya estamos listos</span>
                    </h2>
                    <div className="space-y-2">
                        <p className="text-lg md:text-xl text-slate-200 font-medium">
                            El proyecto <span className="text-emerald-400 font-bold">"{project?.name || 'Digital'}"</span> ya esta listo para que lo uses
                        </p>
                        <p className="text-base md:text-lg text-white max-w-2xl mx-auto font-medium leading-normal">
                            Ahora te ayudaré a crear todo un <span className="text-white font-bold">sistema de ventas completo</span> por ti.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2 text-left">
                    {[
                        { title: 'Página Web', desc: 'Crearé tu página web profesional para capturar clientes interesados.', icon: MousePointer2 },
                        { title: 'Videos de Atracción', desc: 'Crearé los videos exactos para atraer clientes interesados.', icon: Play },
                        { title: 'Email Marketing', desc: 'Crearé secuencias de correos para generar confianza', icon: Zap },
                        { title: 'Estrategia WhatsApp', desc: 'Diseñará la mejor estrategia para que vendas usando tu grupo de Whatsapp', icon: ShieldCheck }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="bg-white/5 border border-white/10 p-4 rounded-[2rem] flex items-center gap-4 hover:bg-white/10 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                <item.icon className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-white font-bold text-base tracking-tight leading-tight">{item.title}</p>
                                <p className="text-gray-300 text-sm font-normal leading-snug">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => onNext()}
                className="group flex items-center gap-4 px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] transform hover:-translate-y-1 active:scale-95 mx-auto mt-4"
            >
                Excelente, Vamos a ello!!!
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
        </motion.div>
    );
};

// 5. PREPARACIÓN DE LANDING
export const LandingIntroStep: React.FC<StepProps & { isCreated?: boolean }> = ({ onNext, isCreated }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-10"
        >
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#FF5A1F] blur-3xl opacity-20 animate-pulse"></div>
                <div className="w-24 h-24 bg-[#FF5A1F] rounded-3xl flex items-center justify-center mx-auto mb-6 relative border border-white/20 shadow-2xl">
                    <MousePointer2 className="w-12 h-12 text-white" />
                </div>
            </div>

            <div className="space-y-8 max-w-5xl mx-auto">
                <div className="space-y-4 max-w-2xl mx-auto">
                    <p className="text-[#FF5A1F] text-sm font-bold uppercase tracking-widest">Ahora crearé tu</p>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                        Tu página <span className="text-emerald-500">de captura</span>
                    </h2>
                    <p className="text-[1.3rem] text-white max-w-2xl mx-auto font-medium leading-relaxed">
                        Tu página será el lugar donde las personas dejarán sus datos para conocer más sobre tu oferta.
                    </p>
                </div>

                <div className="space-y-6 pt-4">
                    <p className="text-white text-xl font-bold uppercase tracking-tight">Con esta página podrás:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                        {[
                            'Atraer personas interesadas en tu proyecto digital',
                            'Capturar prospectos automáticamente las 24 horas',
                            'Construir una audiencia propia para futuras ventas',
                            'Generar más confianza y credibilidad en tu oferta'
                        ].map((benefit, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                                <p className="text-white text-lg font-normal leading-relaxed">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={() => !isCreated && onNext()}
                disabled={isCreated}
                className={`group flex items-center gap-4 px-10 py-6 ${isCreated ? 'bg-emerald-500 cursor-default' : 'bg-[#FF5A1F] hover:bg-[#D94A1E]'} text-white rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(255,90,31,0.5)] transform ${!isCreated ? 'hover:-translate-y-2 active:scale-95' : ''} mx-auto`}
            >
                {isCreated ? 'TU PÁGINA DE CAPTURA HA SIDO GENERADA' : 'Crear mi página ahora'}
                <ArrowRight className={`w-6 h-6 ${!isCreated ? 'group-hover:translate-x-2 transition-transform' : ''}`} />
            </button>
        </motion.div>
    );
};

// 5.5 ÉXITO DE LANDING
export const LandingSuccessStep: React.FC<StepProps> = ({ onNext, onView, onEdit }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-10"
        >
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20"></div>
                <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 relative border border-white/20 shadow-2xl">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none max-w-3xl mx-auto">
                    ¡Tu página Web <span className="text-emerald-500">de captura ha sido creada</span>!
                </h2>
                <p className="text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed">
                    Esta página será tu centro de operaciones para capturar leads y convertirlos en clientes reales.
                </p>
                <div className="space-y-2 pt-4">
                    <p className="text-[#FF5A1F] font-black uppercase tracking-widest text-sm italic">
                        🚀 Ahora puedes ver la página que creado para ti
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 justify-center">
                <button 
                    onClick={() => onView?.()}
                    className="px-16 py-6 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black text-xl uppercase tracking-widest transition-all flex items-center gap-4 shadow-xl shadow-blue-500/20 transform hover:scale-105 active:scale-95"
                >
                    <Play className="w-6 h-6 fill-current" />
                    Ver mi página
                </button>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest italic">
                    más adelante puedes modificarla
                </p>
            </div>

            <button 
                onClick={() => onNext()}
                className="group flex items-center gap-4 px-12 py-7 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-[2.5rem] font-black text-2xl transition-all shadow-[0_20px_50px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95 mx-auto"
            >
                Vamos por el siguiente paso
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
        </motion.div>
    );
};

// 6. REVELACIÓN DE HOOKS
export const HooksRevealStep: React.FC<StepProps & { hooks: any[], isUnlocked?: boolean, projectId?: string, project?: any, hooksRef?: React.RefObject<HTMLDivElement | null> }> = ({ hooks, onNext, isUnlocked, projectId, project, userData, hooksRef }) => {
    // Si ya están desbloqueados, usamos los que vienen. Si no, mostramos los 3 primeros como preview.
    const displayHooks = isUnlocked ? hooks : hooks.slice(0, 3);
    const hooksGridRef = React.useRef<HTMLDivElement>(null);
    const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
    const [showWarningModal, setShowWarningModal] = React.useState(false);

    // Scroll automatically when unlocked
    React.useEffect(() => {
        if (isUnlocked && hooksGridRef.current) {
            setTimeout(() => {
                hooksGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }, [isUnlocked]);

    // Hooks bloqueados de alta conversión y copywriting psicológico, personalizados según el proyecto
    const defaultLockedHooks = [
        {
            hookText: "¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de belleza de alta demanda?"
        },
        {
            hookText: "El gran mito de la belleza revelado: Por qué las fórmulas tradicionales ya no funcionan y cómo solucionarlo hoy."
        },
        {
            hookText: "La fórmula exacta que usan los líderes y salones de alta gama para cobrar 5 veces más sin perder un solo cliente."
        }
    ];

    const isManicurista = project?.name?.toLowerCase().includes('manicurista') || project?.name?.toLowerCase().includes('uña') || project?.name?.toLowerCase().includes('nail');
    const isMicroblading = project?.name?.toLowerCase().includes('microblading') || project?.name?.toLowerCase().includes('ceja') || project?.name?.toLowerCase().includes('brow');

    const customizedLockedHooks = isManicurista ? [
        { hookText: "¿Sabías que dominar la técnica de uñas rusas es el camino más rápido para pasar de cobrar $10 a $50 por servicio?" },
        { hookText: "El error secreto de las manicuristas novatas que arruina el set en 3 días y ahuyenta a las mejores clientas." },
        { hookText: "Cómo construir una agenda llena de clientas premium dispuestas a pagar tarifas de lujo por tus diseños avanzados." }
    ] : isMicroblading ? [
        { hookText: "¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de microblading de cejas?" },
        { hookText: "El secreto del diseño de miradas perfectas: El error que comete el 90% de las principiantes al trazar cejas." },
        { hookText: "La estrategia exacta de las artistas de microblading top para atraer clientas de alto valor sin competir por precio." }
    ] : defaultLockedHooks;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-0 w-full relative"
        >
            {/* SECCIÓN A: Introducción y Generador de Vídeos */}
            <div 
                ref={hooksRef} 
                className="w-full max-w-6xl mx-auto px-4 md:px-6 min-h-screen flex flex-col justify-center py-20 snap-start snap-always relative"
                id="hooks-intro-section"
            >
                <div className="text-center space-y-10">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse"></div>
                        <div className="w-24 h-24 bg-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 relative border border-white/20 shadow-2xl">
                            <Quote className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <div className="space-y-8 max-w-5xl mx-auto">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <p className="text-[#FF5A1F] text-sm font-bold uppercase tracking-widest">Ahora crearé tus</p>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                                Videos de <span className="text-purple-500">Atracción</span>
                            </h2>
                            <p className="text-[1.3rem] text-white max-w-2xl mx-auto font-medium leading-relaxed">
                                Crearé los de videos de atracción exactos para captar clientes interesados.
                            </p>
                        </div>

                        <div className="space-y-6 pt-4">
                            <p className="text-white text-xl font-bold uppercase tracking-tight">Con estos videos podrás:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                                {[
                                    'Atraer personas interesadas en tu proyecto digital',
                                    'Capturar prospectos automáticamente las 24 horas',
                                    'Construir una audiencia propia para futuras ventas',
                                    'Generar más confianza y credibilidad en tu oferta'
                                ].map((benefit, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                                        <CheckCircle className="w-6 h-6 text-purple-500 shrink-0" />
                                        <p className="text-white text-lg font-normal leading-relaxed">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {!isUnlocked && (
                    <div className="flex flex-col items-center gap-6 mt-16">
                        <button 
                            onClick={() => onNext()}
                            className="group flex items-center gap-4 px-12 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(168,85,247,0.3)] transform hover:-translate-y-2 active:scale-95 animate-bounce"
                        >
                            GENERAR VIDEOS DE ATRACCIÓN
                            <Zap className="w-6 h-6 fill-white animate-pulse" />
                        </button>
                    </div>
                )}
                
                {isUnlocked && (
                    <div className="flex flex-col items-center gap-3 mt-12 animate-pulse">
                        <span className="text-purple-400 text-xs font-black uppercase tracking-[0.2em]">Tus videos se han generado abajo</span>
                        <div className="text-purple-400 animate-bounce text-sm">↓ Desliza hacia abajo para verlos ↓</div>
                    </div>
                )}
            </div>

            {/* SECCIÓN B: Vídeos Listos para Usarse (Desbloqueados y Bloqueados) */}
            {isUnlocked && (
                <div 
                    ref={hooksGridRef} 
                    className="w-full max-w-7xl mx-auto px-4 md:px-6 min-h-screen flex flex-col justify-start py-20 snap-start snap-always relative border-t border-white/5 animate-in fade-in slide-in-from-bottom-10 duration-700"
                    id="hooks-grid-section"
                >
                    <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black border border-purple-500/20 p-8 md:p-12 text-center relative overflow-hidden shadow-[0_25px_60px_rgba(168,85,247,0.15)] mb-16">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Sparkles className="w-32 h-32 text-purple-400 animate-pulse" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-3">
                            Tus videos están <span className="text-purple-400">listos para usarse</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                            ¡Excelente! Ya puedes descargar tus videos de atracción, los cuales podrás publicar como videos cortos (Reels) en YouTube, Instagram, Tik Tok y Facebook.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                        {/* Seccion 1: Hooks Desbloqueados Activos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full mb-0">
                            {displayHooks.length > 0 ? displayHooks.map((hook, idx) => {
                                const downloadVideoUrl = hook.contentJson?.downloadUrl || hook.contentJson?.videoUrl || hook.downloadUrl || hook.videoUrl;
                                const hasDownloadUrl = downloadVideoUrl && downloadVideoUrl !== '#';

                                return (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="bg-gradient-to-b from-[#082215] to-[#04140b] border border-emerald-500/20 px-6 py-6 rounded-[2rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] group hover:border-emerald-400/40 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
                                    >
                                        <div className="flex-1 space-y-3 relative z-10 flex flex-col justify-center pt-2 pb-4">
                                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest inline-block self-center mb-4 animate-pulse">
                                                📅 PUBLICAR: {idx === 0 ? 'HOY' : idx === 1 ? 'MAÑANA' : idx === 2 ? 'PASADO MAÑANA' : `DÍA ${idx + 1}`}
                                            </div>
                                            <h3 className="text-[1.3rem] leading-[1.8rem] font-medium mb-4 text-center group-hover:text-orange-400 transition-colors duration-300 text-white">
                                                {hook.hookText || hook.text || hook.title || hook.question || 'Descubre el secreto para automatizar tus ventas.'}
                                            </h3>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
                                            {hasDownloadUrl ? (
                                                <a 
                                                    href={downloadVideoUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-full py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5A1F]/10 cursor-pointer"
                                                >
                                                    <Play className="w-3 h-3 fill-white" />
                                                    Descargar Video
                                                </a>
                                            ) : (
                                                <div 
                                                    className="w-full py-3 bg-gray-800/40 text-gray-500 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5 cursor-not-allowed select-none"
                                                    title="Video de descarga no asignado"
                                                >
                                                    <Play className="w-3 h-3 fill-gray-500 opacity-50" />
                                                    No Habilitado / En Proceso
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                 );
                            }) : (
                                <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/5 italic text-gray-500">
                                    Cargando ganchos especializados...
                                </div>
                            )}
                        </div>

                        {/* Botón Verde Finalizar Configuración */}
                        <div className="flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto">
                            <button 
                                onClick={() => onNext()}
                                className="w-full group flex items-center justify-center gap-4 px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-lg transition-all shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] transform hover:-translate-y-1 active:scale-95 cursor-pointer whitespace-nowrap"
                                id="btn-finalize-customization"
                            >
                                FINALIZAR CONFIGURACIÓN
                                <Rocket className="w-5 h-5 animate-pulse" />
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                user={userData} 
                currentPlan={userData?.planLimits?.planName}
                projectId={projectId}
            />
        </motion.div>
    );
};

// 7. ÉXITO FINAL
export const SuccessStep: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-10 py-10"
        >
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#FF5A1F] blur-3xl opacity-20"></div>
                <div className="w-24 h-24 bg-[#FF5A1F] rounded-3xl flex items-center justify-center mx-auto mb-6 relative border border-white/20 shadow-2xl">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
                    ¡TODO <span className="text-[#FF5A1F]">LISTO</span>!
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                    Tu primer negocio ha sido configurado. 
                    Ya tienes tu proyecto desbloqueado, tu página de captura generada y tus hooks listos para usarse.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-[#111] p-8 rounded-[2.5rem] border border-[#FF5A1F]/10 flex flex-col items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-emerald-500 fill-current" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Proyecto Desbloqueado</span>
                </div>
                <div className="bg-[#111] p-8 rounded-[2.5rem] border border-[#FF5A1F]/10 flex flex-col items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Página Configurada</span>
                </div>
                <div className="bg-[#111] p-8 rounded-[2.5rem] border border-[#FF5A1F]/10 flex flex-col items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                        <Quote className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Biblioteca de Hooks</span>
                </div>
            </div>

            <button 
                onClick={onFinish}
                className="px-12 py-7 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-[2.5rem] font-black text-2xl transition-all shadow-[0_25px_60px_-15px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95 inline-flex items-center gap-4"
            >
                EMPEZAR A VENDER
                <Rocket className="w-8 h-8" />
            </button>
        </motion.div>
    );
};
