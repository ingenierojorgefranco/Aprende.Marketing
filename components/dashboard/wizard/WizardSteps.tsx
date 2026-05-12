import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Rocket, ChevronRight, Loader2, CheckCircle, ShieldCheck, Play, ArrowRight, MousePointer2, UserCircle2, Brain, Wand2, Quote } from 'lucide-react';

interface StepProps {
    onNext: (data?: any) => void;
    data?: any;
    userData: any;
}

// 1. BIENVENIDA
export const WelcomeStep: React.FC<StepProps> = ({ onNext, userData }) => {
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
            
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
                    ¡HOLA, {userName}!
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed italic">
                    "Tu camino hacia las ventas masivas en Hotmart comienza aquí."
                </p>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] max-w-xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Rocket className="w-24 h-24 text-white" />
                </div>
                <p className="text-lg text-gray-300 relative z-10 font-medium">
                    Hemos analizado tu perfil y estamos listos para configurar tu primer 
                    <span className="text-[#FF5A1F] font-bold"> Negocio Digital Automatizado</span>.
                </p>
            </div>

            <button 
                onClick={() => onNext()}
                className="group flex items-center gap-4 px-10 py-6 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-3xl font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95 mx-auto"
            >
                VAMOS A EMPEZAR
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
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
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                    ELIGE TU <span className="text-[#FF5A1F]">VEHÍCULO</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium">Selecciona el nicho en el que deseas empezar a vender hoy mismo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                    const isSelected = selectedProjectId === project.id;
                    
                    return (
                        <motion.div 
                            key={project.id}
                            whileHover={isLocked ? {} : { y: -10 }}
                            className={`bg-[#111] border ${isSelected ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20' : 'border-white/5'} ${isLocked && !isSelected ? 'opacity-40 grayscale' : 'opacity-100'} rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#FF5A1F]/50 transition-all flex flex-col h-full shadow-xl relative`}
                            onClick={() => !isLocked && onNext(project)}
                        >
                            {isSelected && (
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-[#FF5A1F] text-white p-1 rounded-full">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            )}
                            <div className="h-48 bg-gray-800 relative overflow-hidden">
                                {project.multimedia_json?.heroImages?.[0] ? (
                                    <img src={project.multimedia_json.heroImages[0]} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                                        <Target className="w-12 h-12 text-[#FF5A1F] opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="px-3 py-1 bg-[#FF5A1F] text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                                        {project.niche || 'Digital'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className={`text-2xl font-black mb-3 ${isSelected ? 'text-[#FF5A1F]' : 'text-white'} group-hover:text-[#FF5A1F] transition-colors`}>
                                    {project.name}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                    {project.shortDescription || project.description}
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="text-emerald-500 font-black text-lg">
                                        80% COMISIÓN
                                    </div>
                                    <div className={`w-10 h-10 ${isSelected ? 'bg-[#FF5A1F] text-white' : 'bg-[#FF5A1F]/10 text-[#FF5A1F]'} rounded-full flex items-center justify-center group-hover:bg-[#FF5A1F] group-hover:text-white transition-all shadow-lg shadow-[#FF5A1F]/10`}>
                                        <Zap className="w-5 h-5 fill-current" />
                                    </div>
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
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
        >
            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                {/* Lateral info */}
                <div className="md:col-span-2 bg-[#111] p-10 border-r border-white/5 flex flex-col">
                    <div className="flex-1 space-y-8">
                        <div className="space-y-2">
                            <p className="text-[#FF5A1F] font-black text-xs uppercase tracking-widest">Protocolo de Acceso</p>
                            <h3 className="text-3xl font-black text-white uppercase leading-none">{project.name}</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Biblioteca de Estrategia</p>
                                    <p className="text-gray-500 text-xs">Acceso inmediato a toda la arquitectura de ventas.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Target className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Avatares Ganadores</p>
                                    <p className="text-gray-500 text-xs">Perfiles psicológicos listos para ser impactados.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5 text-[#FF5A1F]" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Generador de Páginas</p>
                                    <p className="text-gray-500 text-xs">Crea tu landing de ventas con un solo clic.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <div className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2 italic">Advertencia</div>
                        <p className="text-[10px] text-gray-500 font-medium">Al desbloquear este proyecto, se asignará un cupo de tu plan actual para habilitar todas las herramientas de IA asociadas.</p>
                    </div>
                </div>

                {/* Video/Main Action */}
                <div className="md:col-span-3 p-10 flex flex-col items-center justify-center text-center space-y-10">
                    <div className="relative group w-full aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center">
                        {project.multimedia_json?.videoUrl ? (
                             <iframe src={project.multimedia_json.videoUrl} className="w-full h-full" allowFullScreen />
                        ) : (
                            <div className="text-gray-700 flex flex-col items-center gap-4">
                                <Play className="w-20 h-20 fill-gray-800" />
                                <span className="text-xs font-black uppercase tracking-widest">Vista previa no disponible</span>
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mira este video antes de continuar</p>
                        </div>
                    </div>

                    <div className="w-full space-y-4">
                        <button 
                            onClick={() => !isStrategyGenerated && onNext()}
                            disabled={isStrategyGenerated}
                            className={`w-full py-6 ${isStrategyGenerated ? 'bg-emerald-500 cursor-default' : 'bg-[#FF5A1F] hover:bg-[#D94A1E]'} text-white rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_40px_-10px_rgba(255,90,31,0.4)] flex items-center justify-center gap-4 group`}
                        >
                            {isStrategyGenerated ? 'ESTRATEGIA DESBLOQUEADA' : 'DESBLOQUEAR AHORA'}
                            <Zap className={`w-6 h-6 fill-white ${!isStrategyGenerated ? 'animate-pulse' : ''}`} />
                        </button>
                        
                        {(onBackToSelection && !isStrategyGenerated) && (
                            <button 
                                onClick={onBackToSelection}
                                className="w-full py-4 text-gray-500 hover:text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                Seleccionar otro proyecto
                            </button>
                        )}

                        <p className="text-xs text-gray-500 flex items-center justify-center gap-2 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            Transacción segura y acceso garantizado
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// 3. GENERACIÓN (LOADING STATE)
export const GenerationStep: React.FC<{ progress: number, status: string, secondsElapsed?: number }> = ({ progress, status, secondsElapsed = 0 }) => {
    return (
        <div className="flex flex-col items-center justify-center px-6 space-y-12 text-center max-w-4xl mx-auto">
            <div className="relative">
                <div className="absolute inset-x-0 -top-20 -bottom-20 bg-[#FF5A1F]/20 blur-[100px] rounded-full animate-pulse"></div>
                <div className="relative w-32 h-32 rounded-[2.5rem] bg-[#111] border border-[#FF5A1F]/30 flex items-center justify-center shadow-2xl shadow-[#FF5A1F]/10">
                    <Brain className="w-16 h-16 text-[#FF5A1F] animate-bounce" />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full shadow-lg border-2 border-[#111]">
                        <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
                    </div>
                </div>
            </div>

            <div className="space-y-8 w-full max-w-2xl">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight italic">
                        {status || 'Estrategia en proceso'}
                    </h2>
                    <p className="text-gray-400 text-lg font-medium italic max-w-lg mx-auto leading-relaxed">
                        "Nuestra IA está analizando tu nicho, redactando secuencias de email y configurando tu embudo psicológico de ventas."
                    </p>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                    {/* Contador de tiempo */}
                    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-center min-w-[280px]">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-2">Estimado de finalización:</p>
                        <div className="text-white font-mono text-5xl font-black tracking-tighter">
                            {Math.floor(Math.max(0, 90 - secondsElapsed) / 60).toString().padStart(2, '0')}:{(Math.max(0, 90 - secondsElapsed) % 60).toString().padStart(2, '0')}
                        </div>
                    </div>

                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-end px-2">
                            <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.3em] animate-pulse">
                                Procesando arquitectura...
                            </span>
                            <span className="text-xl font-black text-white">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-[#111] h-6 rounded-full overflow-hidden border border-white/5 p-1.5 shadow-inner relative">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8C00] rounded-full shadow-[0_0_25px_rgba(255,90,31,0.4)] relative"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[loading-shine_1.5s_infinite]"></div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                        <p className="text-red-400 font-black uppercase text-[10px] tracking-[0.2em]">
                            ⚠️ No cierres esta página, el proceso está en curso...
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
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-xl">
                    <Brain className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                    TUS <span className="text-blue-500">AVATARES</span> IDEALES
                </h2>
                <p className="text-gray-400 text-lg font-medium">Hemos identificado 3 perfiles que tienen una alta probabilidad de compra.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {avatars.map((avatar, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: idx === 0 ? -20 : idx === 2 ? 20 : 0, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl hover:border-blue-500/30 transition-all group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all font-black text-2xl text-blue-500">
                            {idx + 1}
                        </div>
                        <h4 className="text-xl font-black text-white uppercase">{avatar.name}</h4>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Dolor Principal</p>
                                <p className="text-sm text-gray-400 leading-snug">{avatar.painPoints?.[0] || 'Dificultad para generar ingresos extras.'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Deseo Ardiente</p>
                                <p className="text-sm text-gray-400 leading-snug">{avatar.desires?.[0] || 'Libertad financiera y tiempo libre.'}</p>
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
                    PASO SIGUIENTE
                    <ArrowRight className="w-6 h-6" />
                </button>
            </div>
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

            <div className="space-y-6 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                    SISTEMA DE <span className="text-[#FF5A1F]">CAPTACIÓN</span>
                </h2>
                <p className="text-xl text-gray-400 font-medium">
                    "Tus avatares necesitan un lugar a donde llegar. Ahora vamos a construir tu página web de alto impacto psicológico."
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black text-gray-500 uppercase tracking-widest">
                    <Zap className="w-3 h-3 text-[#FF5A1F]" />
                    Generación Automática en {isCreated ? 'Completada' : '10 Segundos'}
                </div>
            </div>

            <button 
                onClick={() => !isCreated && onNext()}
                disabled={isCreated}
                className={`group flex items-center gap-4 px-10 py-6 ${isCreated ? 'bg-emerald-500 cursor-default' : 'bg-[#FF5A1F] hover:bg-[#D94A1E]'} text-white rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(255,90,31,0.5)] transform ${!isCreated ? 'hover:-translate-y-2 active:scale-95' : ''} mx-auto`}
            >
                {isCreated ? 'TU PÁGINA DE CAPTURA HA SIDO GENERADA' : 'CREAR MI PÁGINA AHORA'}
                <ArrowRight className={`w-6 h-6 ${!isCreated ? 'group-hover:translate-x-2 transition-transform' : ''}`} />
            </button>
        </motion.div>
    );
};

// 6. REVELACIÓN DE HOOKS
export const HooksRevealStep: React.FC<StepProps & { hooks: any[], isUnlocked?: boolean, projectId?: string }> = ({ hooks, onNext, isUnlocked, projectId }) => {
    // Tomar solo 3 hooks para el wizard
    const displayHooks = hooks.slice(0, 3);
    const hooksGridRef = React.useRef<HTMLDivElement>(null);

    // Scroll automatically when unlocked
    React.useEffect(() => {
        if (isUnlocked && hooksGridRef.current) {
            setTimeout(() => {
                hooksGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }, [isUnlocked]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
        >
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20 shadow-xl font-bold italic text-3xl">
                    <Quote className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                    GANCHOS DE <span className="text-purple-500">ATRACCIÓN</span>
                </h2>
                <div className="space-y-4 max-w-3xl mx-auto">
                    <p className="text-gray-400 text-lg font-medium italic">
                        "Tus avatares necesitan ganchos que detengan el scroll. Nuestro sistema te entrega los videos (reels) listos para atraer clientes interesados en comprar tu producto digital."
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-500 uppercase tracking-widest">
                        <Zap className="w-3 h-3 fill-current" />
                        Desbloqueo Inteligente de 3 Ganchos Primarios
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={() => !isUnlocked && onNext()}
                    disabled={isUnlocked}
                    className={`group flex items-center gap-4 px-12 py-6 ${isUnlocked ? 'bg-emerald-500 cursor-default' : 'bg-[#FF5A1F] hover:bg-[#D94A1E]'} text-white rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(255,140,0,0.3)] transform ${!isUnlocked ? 'hover:-translate-y-2' : ''} active:scale-95`}
                >
                    {isUnlocked ? 'GANCHOS DESBLOQUEADOS' : 'GENERAR VIDEOS DE ATRACCIÓN'}
                    <Zap className={`w-6 h-6 fill-white ${!isUnlocked ? 'animate-pulse' : ''}`} />
                </button>
            </div>

            {isUnlocked && (
                <div ref={hooksGridRef} className="space-y-10 pt-10 border-t border-white/5 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black text-white uppercase italic">Tus videos de atracción están desbloqueados</h3>
                        <p className="text-gray-500 font-medium">Usa estos ganchos para tus anuncios o contenido orgánico.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {displayHooks.length > 0 ? displayHooks.map((hook, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-purple-500/30 transition-all flex flex-col h-full"
                            >
                                <div className="flex-1 space-y-4 relative z-10">
                                    <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-500 uppercase tracking-widest inline-block">
                                        Hook #{idx + 1}
                                    </div>
                                    <h4 className="text-xl font-black text-white leading-tight italic">
                                        "{hook.hookText || hook.text || 'Descubre el secreto para automatizar tus ventas.'}"
                                    </h4>
                                    
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Estrategia Psicológica</p>
                                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                                            {hook.psychologicalApproach || hook.psychologicalAppeal || 'Utiliza el sesgo de curiosidad para invitar al usuario a conocer más sobre la solución definitiva.'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                                    <a 
                                        href={`https://aprende.marketing/dashboard/projects/${projectId}/strategy?section=hooks&hookId=${hook.id || idx}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10 transition-all hover:border-purple-500/30"
                                    >
                                        Detalles del Hook
                                    </a>
                                    <a 
                                        href={hook.videoUrl || '#'} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5A1F]/10"
                                    >
                                        <Play className="w-3 h-3 fill-white" />
                                        Descargar Video
                                    </a>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/5 italic text-gray-500">
                                Cargando ganchos especializados...
                            </div>
                        )}
                    </div>
                </div>
            )}
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
