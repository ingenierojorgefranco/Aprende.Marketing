import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Rocket, ChevronRight, Loader2, CheckCircle, ShieldCheck, Play, ArrowRight, MousePointer2, UserCircle2, Brain, Wand2, Quote, User, HeartPulse, MessageSquareQuote, Lock, Package, FileText, Lightbulb, Camera, BarChart2, Flower2, Star, Users, Percent, Tag, TrendingUp, Info, Mail, Link, RotateCw, Maximize2, Edit3, Smartphone, Briefcase, Film, Video, Clapperboard, Flame } from 'lucide-react';
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
    const userName = userData.name?.split(' ')[0] || 'Mundo';
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-3xl mx-auto px-4 md:px-0 font-sans"
        >
            <div className="relative inline-block mb-2">
                <div className="absolute inset-0 bg-[#FF5A1F]/30 blur-3xl opacity-30 animate-pulse rounded-full"></div>
                <div className="w-20 h-20 bg-[#FF5A1F] rounded-2xl flex items-center justify-center mx-auto relative border border-white/15 shadow-2xl">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
            </div>
            
            <div className="space-y-4" style={{ marginTop: '0' }}>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    ¡Hola, <span className="text-[#FF5A1F]">{userName}</span>!
                </h1>

                <p className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up">
                    Hemos preparado los primeros pasos de acuerdo con tu experiencia, objetivos y recursos disponibles.
                </p>
            </div>

            <div className="bg-[#111111]/80 border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden text-left mt-6">
                <div className="text-center font-bold text-[#FF5A1F] uppercase tracking-wider text-xs md:text-sm mb-6 pb-2 border-b border-white/5">
                    Dentro del asistente vas a:
                </div>
                
                <div className="space-y-6 relative z-10">
                    {/* Paso 1 */}
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#FF5A1F]/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 border border-[#FF5A1F]/20 mt-0.5">
                            <Package className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-extrabold text-white text-base md:text-lg leading-tight">
                                Definir el producto que vas a promocionar
                            </h3>
                            <p className="text-zinc-400 font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up" style={{ color: '#c5c5c5', fontSize: '1.07em', lineHeight: '1.5em' }}>
                                Selecciona cualquiera de los productos digitales que nuestros profesionales han elegido para ti
                            </p>
                        </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#FF5A1F]/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 border border-[#FF5A1F]/20 mt-0.5">
                            <Target className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-extrabold text-white text-base md:text-lg leading-tight">
                                Construir la estrategia de tu proyecto
                            </h3>
                            <p className="text-zinc-400 font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up" style={{ color: '#c5c5c5', fontSize: '1.07em', lineHeight: '1.5em' }}>
                                Definiremos tu audiencia, público objetivo y mejor estrategia de ventas para tu producto elegido
                            </p>
                        </div>
                    </div>

                    {/* Paso 3 */}
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#FF5A1F]/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 border border-[#FF5A1F]/20 mt-0.5">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-extrabold text-white text-base md:text-lg leading-tight">
                                Preparar tus recursos de lanzamiento
                            </h3>
                            <p className="text-zinc-400 font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up" style={{ color: '#c5c5c5', fontSize: '1.07em', lineHeight: '1.5em' }}>
                                Generaremos tu página web, el contenido inicial y los videos para atraer visitantes interesados desde tus redes sociales.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => !disabled && onNext()}
                disabled={disabled}
                className={`group flex items-center gap-3 px-8 py-5 ${disabled ? 'bg-zinc-800 cursor-not-allowed opacity-50 text-zinc-500' : 'bg-[#FF5A1F] hover:bg-[#D94A1E] shadow-[0_12px_30px_-5px_rgba(255,90,31,0.4)] transform hover:-translate-y-1 active:scale-98'} text-white rounded-2xl font-black text-lg md:text-xl tracking-wide transition-all mx-auto`}
            >
                {disabled ? 'Configuración en proceso' : 'Crear mi primer proyecto'}
                {!disabled && <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />}
            </button>
        </motion.div>
    );
};

// 2. SELECCIÓN DE PROYECTO
export const ProjectSelectionStep: React.FC<StepProps & { projects: any[], loading: boolean, selectedProjectId?: string, isLocked?: boolean }> = ({ projects, loading, onNext, selectedProjectId, isLocked }) => {
    const [showCustomProduct, setShowCustomProduct] = React.useState(false);

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
            className="space-y-10 font-sans"
        >
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Elige el producto con el que crearás tu <span className="text-[#FF5A1F]">primer proyecto</span>
                </h2>
                <p className="max-w-2xl mx-auto leading-relaxed text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up" style={{
                    fontSize: '1.2em',
                    lineHeight: '1.4em'
                }}>
                    Según tus respuestas, estas son las oportunidades que mejor encajan con tu experiencia, tus intereses y los recursos que tienes disponibles.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1240px] mx-auto w-full">
                {projects.slice(0, 3).map((project, index) => {
                    const isSelected = selectedProjectId === project.id;
                    const isRecommended = index === 0;

                    // Ideal descriptions customized elegant wording or dynamic fallback
                    let idealForDesc = "Ideal para personas interesadas en belleza, contenido visual y aprendizaje de una habilidad profesional.";
                    if (project.name.toLowerCase().includes("manicurista")) {
                        idealForDesc = "Ideal para personas creativas que disfrutan del cuidado de manos y uñas y quieren profesionalizar sus servicios.";
                    } else if (project.name.toLowerCase().includes("pestañas") || project.name.toLowerCase().includes("lashista")) {
                        idealForDesc = "Ideal para personas apasionadas por la belleza que buscan especializarse en una técnica de alta demanda.";
                    } else if (project.name.toLowerCase().includes("resina") || project.name.toLowerCase().includes("pisos")) {
                        idealForDesc = "Ideal para personas interesadas en la construcción, decoración de interiores y modelado de alta rentabilidad.";
                    } else if (project.shortDescription || project.description) {
                        idealForDesc = project.shortDescription || project.description;
                    }

                    return (
                        <motion.div 
                            key={project.id}
                            whileHover={isLocked ? {} : { y: -6 }}
                            className={`bg-[#0F0F0F] border ${
                                isRecommended 
                                    ? 'border-[#FF5A1F] ring-1 ring-[#FF5A1F]/30 shadow-[0_15px_40px_-15px_rgba(255,90,31,0.2)]' 
                                    : 'border-white/5 hover:border-white/10'
                            } ${isLocked && !isSelected ? 'opacity-40 grayscale' : 'opacity-100'} rounded-3xl overflow-hidden group cursor-pointer transition-all flex flex-col h-full relative w-full`}
                            onClick={() => !isLocked && onNext(project)}
                        >
                            {/* Recommended Header Badge */}
                            {isRecommended && (
                                <div className="absolute top-0 left-0 right-0 py-2 bg-[#FF5A1F] text-center z-10 rounded-t-3xl">
                                    <span className="text-[10px] md:text-xs font-black text-white tracking-[0.1em] uppercase flex items-center justify-center gap-1">
                                        ★ RECOMENDADO PARA COMENZAR
                                    </span>
                                </div>
                            )}

                            {/* Image Container with floating Category badge */}
                            <div className={`h-48 bg-zinc-900 relative overflow-hidden shrink-0 ${isRecommended ? 'pt-8' : ''}`}>
                                {project.multimedia_json?.heroImages?.[0] ? (
                                    <img 
                                        src={project.multimedia_json.heroImages[0]} 
                                        alt={project.name} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                                        <Package className="w-10 h-10 text-[#FF5A1F] opacity-30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent"></div>
                                
                                {/* Floating category Badge */}
                                <div className="absolute bottom-3 left-4">
                                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 border border-white/10">
                                        <Flower2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
                                        {project.niche || 'Belleza y estética'}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex flex-col flex-grow space-y-4">
                                <h3 className={`text-xl font-black leading-snug tracking-tight ${isSelected ? 'text-[#FF5A1F]' : 'text-white'} group-hover:text-[#FF5A1F] transition-colors line-clamp-2`}>
                                    {project.name}
                                </h3>

                                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-4 min-h-[72px]" style={{
                                    color: '#efe4e4',
                                    fontSize: '1em',
                                    lineHeight: '1.5em',
                                    textAlign: 'center'
                                }}>
                                    {idealForDesc}
                                </p>

                                {/* Specifications Table/Rows */}
                                <div className="space-y-2 pt-2">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 flex items-center gap-2.5">
                                        <Camera className="w-4 h-4 text-zinc-500 shrink-0" />
                                        <span className="text-xs text-zinc-400 font-medium">
                                            <strong className="text-white font-bold">Ideal para:</strong> contenido visual
                                        </span>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 flex items-center gap-2.5">
                                        <Target className="w-4 h-4 text-[#FF5A1F] shrink-0 animate-pulse" />
                                        <span className="text-xs text-zinc-400 font-medium">
                                            <strong className="text-white font-bold">Estrategia:</strong> orgánico + clase gratuita
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex flex-col space-y-3 mt-auto">
                                    <button 
                                        type="button"
                                        className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs md:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all"
                                    >
                                        Elegir este producto
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    type="button"
                    onClick={() => setShowCustomProduct(true)}
                    className="text-amber-500 hover:text-amber-400 transition-colors font-bold text-xs md:text-sm flex items-center gap-1.5 uppercase tracking-wide cursor-pointer"
                >
                    ¿Ya tienes un producto? <span className="underline">Añadir mi producto</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Bottom Proof Panel */}
            <div className="pt-4 flex items-center justify-center gap-2 text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold leading-none uppercase tracking-wider text-center">
                    Podrás revisar la estrategia antes de confirmar tu elección.
                </span>
            </div>

            {/* Toast/Modal for Add my product */}
            {showCustomProduct && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-[#111] border border-[#FF5A1F]/30 p-6 md:p-8 rounded-3xl max-w-md w-full text-center space-y-6">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-lg font-black text-white">¡Excelente! Pronto podrás subir tu producto</h4>
                            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                                Actualmente estamos optimizando el asistente para que puedas integrar cualquier producto de Hotmart o tu propio infoproducto. 
                                Por ahora, te recomendamos seleccionar uno de nuestros nichos validados para que experimentes el poder de la estrategia instantánea de Aprende.Marketing.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowCustomProduct(false)}
                            className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// 2.5 SISTEMA DE DESBLOQUEO (Modal-like)
export const UnlockProtocolStep: React.FC<StepProps & { project: any, isStrategyGenerated?: boolean, onBackToSelection?: () => void }> = ({ project, onNext, isStrategyGenerated, onBackToSelection }) => {
    // Calculo de Comision que se mostrará
    const rawCommission = project.commissionRate || 80;
    const displayCommission = rawCommission < 1 ? Math.round(rawCommission * 100) : Math.round(rawCommission);
    const profitValue = project.fullPrice && displayCommission ? (project.fullPrice * (displayCommission / 100)).toFixed(2) : '0.00';

    // Customized product ideal description
    let idealText = "Una oportunidad ideal para personas interesadas en belleza, contenido visual y una estrategia basada en clase gratuita.";
    if (project.name?.toLowerCase().includes("manicurista")) {
        idealText = "Una oportunidad ideal para personas creativas que disfrutan del cuidado de manos y uñas y quieren profesionalizar sus servicios.";
    } else if (project.name?.toLowerCase().includes("pestañas") || project.name?.toLowerCase().includes("lashista")) {
        idealText = "Una oportunidad ideal para personas apasionadas por la belleza que buscan especializarse en una técnica de alta demanda.";
    } else if (project.name?.toLowerCase().includes("resina") || project.name?.toLowerCase().includes("pisos")) {
        idealText = "Una oportunidad ideal para personas interesadas en la construcción, decoración de interiores y modelado de alta rentabilidad.";
    } else if (project.shortDescription || project.description) {
        idealText = project.shortDescription || project.description;
    }

    const uppercaseNiche = (project.niche || 'Belleza y estética').toUpperCase();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 font-sans max-w-6xl mx-auto px-4 md:px-0"
        >
            {/* Header / Title Area */}
            <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Revisa el producto antes de crear tu estrategia
                </h2>
                <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    Conoce la oportunidad y decide si quieres usarla para construir tu primer proyecto.
                </p>
            </div>

            {/* Main Rounded Component Container */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* Left Column - Product details */}
                    <div className="space-y-6 flex flex-col justify-between">
                        <div className="space-y-6">
                            {/* Niche/Category badge top left */}
                            <div>
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-[10px] md:text-xs font-black uppercase tracking-wider rounded-lg">
                                    {uppercaseNiche}
                                </span>
                            </div>

                            {/* Product Title and Description */}
                            <div className="space-y-3">
                                <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                                    {project.name}
                                </h3>
                                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                                    {idealText}
                                </p>
                            </div>

                            {/* Bullet Features (Camera, Star, Target) */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] shrink-0 border border-[#FF5A1F]/20">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                    <p className="text-zinc-200 text-xs md:text-sm font-medium">Contenido visual y educativo</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] shrink-0 border border-[#FF5A1F]/20">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    </div>
                                    <p className="text-zinc-200 text-xs md:text-sm font-medium">Nivel {project.level || 'inicial'}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] shrink-0 border border-[#FF5A1F]/20">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <p className="text-zinc-200 text-xs md:text-sm font-medium">Estrategia orgánica + clase gratuita</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom stats cards */}
                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <div className="grid grid-cols-3 gap-3">
                                {/* Price Card */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-1">
                                    <div className="flex items-center gap-1 text-zinc-500">
                                        <Tag className="w-3.5 h-3.5" />
                                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">Precio</span>
                                    </div>
                                    <span className="text-white text-sm md:text-base font-extrabold tracking-tight">
                                        USD {project.fullPrice || '0'}
                                    </span>
                                </div>

                                {/* Commission Card */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-1">
                                    <div className="flex items-center gap-1 text-zinc-500">
                                        <Percent className="w-3.5 h-3.5 text-[#FF5A1F]" />
                                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">Comisión</span>
                                    </div>
                                    <span className="text-white text-sm md:text-base font-extrabold tracking-tight">
                                        {displayCommission} %
                                    </span>
                                </div>

                                {/* Estimated Revenue Card */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-1">
                                    <div className="flex items-center gap-1 text-zinc-500">
                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">Estimado</span>
                                    </div>
                                    <span className="text-emerald-500 text-sm md:text-base font-extrabold tracking-tight">
                                        USD {profitValue}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-zinc-500 italic">
                                <Info className="w-3.5 h-3.5 shrink-0" />
                                <span>Datos de referencia sujetos a cambios del productor.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Video overlay, checklists and CTA buttons */}
                    <div className="space-y-6">
                        {/* Video / Image with Play Trigger */}
                        <div className="space-y-2">
                            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                Conoce esta oportunidad en 90 segundos
                            </span>
                            <div className="relative group w-full aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center shadow-lg">
                                {project.multimedia_json?.heroImages?.[0] ? (
                                    <img 
                                        src={project.multimedia_json.heroImages[0]} 
                                        alt={project.name} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                                        <Target className="w-10 h-10 text-[#FF5A1F] opacity-30 animate-pulse" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-16 bg-[#FF5A1F] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform relative cursor-pointer">
                                        <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                                        <div className="absolute inset-0 bg-[#FF5A1F] rounded-full animate-ping opacity-25"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checklist Section */}
                        <div className="space-y-3 pt-2">
                            <h4 className="text-white text-sm md:text-base font-extrabold">Qué obtendrás</h4>
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-[#FF5A1F]" />
                                    <span className="text-zinc-300 text-xs md:text-sm">Audiencia y ángulo de venta</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-[#FF5A1F]" />
                                    <span className="text-zinc-300 text-xs md:text-sm">Página de captación</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-[#FF5A1F]" />
                                    <span className="text-zinc-300 text-xs md:text-sm">Contenido y seguimiento inicial</span>
                                </div>
                            </div>
                        </div>

                        {/* Highlight review text */}
                        <div className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 p-3 md:p-4 rounded-xl flex items-center gap-2.5">
                            <Info className="w-4.5 h-4.5 text-[#FF5A1F] shrink-0" />
                            <p className="text-zinc-300 font-medium text-xs md:text-sm">
                                Tú revisarás y personalizarás la estrategia antes de publicarla.
                            </p>
                        </div>

                        {/* Actions stack */}
                        <div className="space-y-3 pt-2">
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Back selection button */}
                                {onBackToSelection && (
                                    <button 
                                        type="button"
                                        onClick={onBackToSelection}
                                        className="sm:w-1/3 py-3 px-4 bg-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white border border-white/10 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                                    >
                                        ← Volver a los productos
                                    </button>
                                )}
                                
                                {/* Choose primary strategy build button */}
                                <button 
                                    type="button"
                                    onClick={() => !isStrategyGenerated && onNext()}
                                    disabled={isStrategyGenerated}
                                    className={`flex-1 py-3.5 px-6 ${isStrategyGenerated ? 'bg-emerald-600' : 'bg-[#FF5A1F] hover:bg-[#D94A1E]'} text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group`}
                                >
                                    <span>{isStrategyGenerated ? 'Estrategia Generada' : 'Elegir este producto y crear mi estrategia'}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <div className="text-center">
                                <span className="text-[11px] text-zinc-500 font-medium">Esta acción utilizará 1 de tus proyectos disponibles.</span>
                            </div>
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
                        {status || 'Perfecto, estoy creando tu estrategia de Ventas'}
                    </h2>
                    <p className="text-white text-lg md:text-xl font-medium italic max-w-lg mx-auto leading-relaxed">
                        "{message || "No cierres esta ventana, estoy analizando el producto digital que has elegido y configurando todo lo que necesitas para generar ventas masivas."}"
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
                                    Desbloqueando Producto Digital...
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
                            ⚠️ No cierres esta ventana, estoy creando tu estrategia digital...
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto px-4"
        >
            {/* Círculo de Éxito Superior con Glow Verde */}
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
                <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/80 flex items-center justify-center relative shadow-[0_0_25px_rgba(34,197,94,0.3)]">
                    <svg className="w-8 h-8 text-green-500 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            {/* Títulos Principales */}
            <div className="space-y-3 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Tu estrategia inicial está lista
                </h2>
                <p className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up">
                    Hemos preparado la base estratégica para promocionar el{" "}
                    <span className="text-[#FF5A1F] font-bold">
                        {project?.name || "Curso Profesional de Microblading de Cejas"}
                    </span>.
                </p>
            </div>

            {/* Tarjeta Translúcida de Progreso ("Lo que ya está preparado") */}
            <div className="w-full max-w-2xl mx-auto bg-[#0b0b0c]/60 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 text-left">
                <h3 className="text-white font-semibold text-lg tracking-tight px-1 block">
                    Lo que ya está preparado
                </h3>
                
                <div className="space-y-3">
                    {/* Item 1 - Producto */}
                    <div className="flex items-center gap-4 bg-[#141416]/50 border border-white/5 p-4 rounded-2xl">
                        <div className="w-11 h-11 bg-orange-500/5 border border-white/5 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <Package className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold tracking-tight">Producto seleccionado</p>
                            <p className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up">{project?.name || "Curso Profesional de Microblading de Cejas"}</p>
                        </div>
                    </div>

                    {/* Item 2 - Público */}
                    <div className="flex items-center gap-4 bg-[#141416]/50 border border-white/5 p-4 rounded-2xl">
                        <div className="w-11 h-11 bg-orange-500/5 border border-white/5 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <Users className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold tracking-tight">Público y necesidades</p>
                            <p className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up">Audiencia, dolores, deseos y objeciones relacionados con el producto.</p>
                        </div>
                    </div>

                    {/* Item 3 - Estrategia */}
                    <div className="flex items-center gap-4 bg-[#141416]/50 border border-white/5 p-4 rounded-2xl">
                        <div className="w-11 h-11 bg-orange-500/5 border border-white/5 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <Target className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold tracking-tight">Estrategia de comunicación</p>
                            <p className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up">Ángulos de venta y mensajes iniciales para presentar la oportunidad.</p>
                        </div>
                    </div>

                    {/* Item 4 - Siguiente Paso (Destacado) */}
                    <div className="flex items-start gap-4 bg-orange-500/[0.02] border border-[#FF5A1F]/30 p-5 rounded-2xl shadow-[0_4px_30px_rgba(255,90,31,0.03)]">
                        <div className="w-11 h-11 bg-orange-500/10 border border-[#FF5A1F]/20 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
                            <Sparkles className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold tracking-tight">Siguiente paso</p>
                            <p className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up">
                                Ahora utilizaremos esta estrategia para crear tu página de captación. La página incluirá la estructura, los textos y las llamadas a la acción necesarias para registrar personas interesadas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón de Acción Principal (Naranja Vibrante) */}
            <div className="flex flex-col items-center gap-3 pt-2">
                <button 
                    onClick={() => onNext()}
                    className="w-full max-w-md py-4 px-6 bg-[#FF5A1F] hover:bg-[#FF7A42] text-white rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-[#FF5A1F]/10 flex items-center justify-between gap-3 active:scale-[0.98] focus:outline-none"
                >
                    <Rocket className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-center font-bold">Crear mi página web</span>
                    <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
                <p className="text-xs text-zinc-650 font-semibold tracking-tight select-none mt-1">
                    Proyecto 1 de 3 creado.
                </p>
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

            <div className="space-y-8 max-w-5xl mx-auto">
                <div className="space-y-4 max-w-2xl mx-auto">
                    <p className="text-[#FF5A1F] text-sm font-bold uppercase tracking-widest">Ahora crearé tu</p>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                        Tu página Web <span className="text-emerald-500">de captura</span>
                    </h2>
                    <p className="text-[1.3rem] text-white max-w-2xl mx-auto font-medium leading-relaxed">
                        Tu página web de captura será el lugar donde las personas registrarán sus datos para conocer más sobre tu producto digital.
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
                {isCreated ? 'TU PÁGINA DE CAPTURA HA SIDO GENERADA' : 'CREAR PÁGINA DE CAPTURA'}
                <ArrowRight className={`w-6 h-6 ${!isCreated ? 'group-hover:translate-x-2 transition-transform' : ''}`} />
            </button>
        </motion.div>
    );
};

// 5.5 ÉXITO DE LANDING
interface LandingSuccessProps extends StepProps {
    project?: any;
    createdPageSubdomain?: string;
}

export const LandingSuccessStep: React.FC<LandingSuccessProps> = ({ onNext, onView, onEdit, project, createdPageSubdomain }) => {
    const subdomainPart = createdPageSubdomain ? createdPageSubdomain.split(".")[0] : "";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1400px] mx-auto p-2 md:p-6 lg:p-8 font-sans"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                {/* Columna Izquierda: Información y Control */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    <div className="space-y-6">
                        {/* Cabecera */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                                    Revisar y publicar tu página
                                </h1>
                                <span className="bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider select-none shrink-0">
                                    Borrador
                                </span>
                            </div>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                                Comprueba el contenido, el formulario y la apariencia antes de publicar tu página de captación.
                            </p>
                        </div>

                        {/* Ficha de Detalles */}
                        <div className="bg-[#0b0b0c]/85 border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/40">
                            {/* Proyecto */}
                            <div className="flex items-center justify-between p-4 flex-wrap sm:flex-nowrap gap-3">
                                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <Package className="w-4.5 h-4.5 text-[#FF5A1F]" />
                                    <span>Proyecto</span>
                                </div>
                                <span className="text-white text-sm font-semibold truncate text-right">
                                    {project?.name || "Curso Profesional de Microblading de Cejas"}
                                </span>
                            </div>

                            {/* URL Temporal */}
                            <div className="flex items-center justify-between p-4 flex-wrap sm:flex-nowrap gap-3">
                                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <Link className="w-4.5 h-4.5 text-[#FF5A1F]" />
                                    <span>URL temporal</span>
                                </div>
                                <span className="text-zinc-300 text-sm font-mono truncate text-right">
                                    aprende.marketing/{subdomainPart || "microblading-demo"}
                                </span>
                            </div>

                            {/* Formulario */}
                            <div className="flex items-center justify-between p-4 flex-wrap sm:flex-nowrap gap-3">
                                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <FileText className="w-4.5 h-4.5 text-[#FF5A1F]" />
                                    <span>Formulario</span>
                                </div>
                                <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    Configurado
                                </span>
                            </div>

                            {/* Estado */}
                            <div className="flex items-center justify-between p-4 flex-wrap sm:flex-nowrap gap-3">
                                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <ShieldCheck className="w-4.5 h-4.5 text-[#FF5A1F]" />
                                    <span>Estado</span>
                                </div>
                                <span className="bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Borrador
                                </span>
                            </div>
                        </div>

                        {/* Antes de Publicar Checklist */}
                        <div className="bg-[#0b0b0c]/40 border border-zinc-800/40 rounded-2xl p-5 space-y-4">
                            <h3 className="text-white text-sm font-bold tracking-wide flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-[#FF5A1F] rounded-full"></span>
                                Antes de publicar
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2.5 text-zinc-300 text-xs font-medium">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Titular revisado</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-zinc-300 text-xs font-medium">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Formulario revisado</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-zinc-300 text-xs font-medium">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Llamadas a la acción revisadas</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-zinc-300 text-xs font-medium">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Aviso de privacidad visible</span>
                                </div>
                            </div>
                        </div>

                        {/* Cuadro de Información */}
                        <div className="bg-[#121214]/60 border border-zinc-800/40 rounded-2xl p-4 flex gap-3.5 items-start">
                            <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
                                <Info className="w-4.5 h-4.5 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[#FF5A1F] font-extrabold text-xs tracking-wider uppercase">Qué puedes hacer aquí</h4>
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Visualiza la página real, realiza ajustes y publícala cuando esté lista.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-6 border-t border-zinc-900 flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={onEdit}
                                className="px-5 py-4 bg-transparent hover:bg-zinc-800/60 text-white border border-zinc-750 hover:border-zinc-500 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 w-full active:scale-98"
                            >
                                <Edit3 className="w-4 h-4 text-zinc-400" />
                                Editar página
                            </button>
                            <button 
                                onClick={() => onNext()}
                                className="px-5 py-4 bg-[#FF5A1F] hover:bg-[#E54E15] text-white rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 w-full shadow-lg shadow-[#FF5A1F]/15 active:scale-98"
                            >
                                <Rocket className="w-4 h-4" />
                                Publicar página
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-medium">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Tu página todavía no es pública.</span>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Vista Previa en Vivo Interactiva */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="flex flex-col h-full bg-[#080809]/40 border border-zinc-800/60 rounded-3xl p-5 md:p-6 shadow-3xl">
                        {/* Indicador de Vista Previa */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest select-none">
                                Vista previa en vivo
                            </span>
                        </div>

                        {/* Mockup de Navegador Web */}
                        <div className="flex-1 min-h-[380px] lg:min-h-[480px] bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                            {/* Barra de Direcciones estilo Chrome/Safari */}
                            <div className="bg-[#1c1c1f] px-4 py-3 flex items-center gap-3 border-b border-zinc-900 select-none">
                                {/* Botones del sistema window */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                                </div>
                                {/* Botones de navegación */}
                                <div className="flex items-center gap-2 text-zinc-600 shrink-0 ml-2">
                                    <ChevronRight className="w-4 h-4 rotate-180 hover:text-zinc-400 cursor-pointer" />
                                    <ChevronRight className="w-4 h-4 hover:text-zinc-400 cursor-pointer" />
                                    <RotateCw className="w-3.5 h-3.5 ml-1 hover:text-zinc-400 cursor-pointer" />
                                </div>
                                {/* Barra de Direcciones segura */}
                                <div className="flex-1 bg-[#121214] border border-zinc-800/80 rounded-lg px-4 py-1.5 text-xs text-zinc-400 flex items-center gap-2 overflow-hidden select-all shadow-inner">
                                    <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                                    <span className="truncate font-mono">
                                        aprende.marketing/{subdomainPart || "microblading-demo"}
                                    </span>
                                </div>
                                <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer shrink-0">
                                    <RotateCw className="w-3.5 h-3.5" />
                                </span>
                            </div>

                            {/* Contenedor del Iframe interactivo */}
                            <div className="flex-1 bg-zinc-950 relative overflow-hidden h-full">
                                {subdomainPart ? (
                                    <iframe 
                                        src={`/admin/lp/${subdomainPart}`} 
                                        className="w-full h-full border-none bg-zinc-950"
                                        title="Vista previa interactiva de Landing Page"
                                        sandbox="allow-scripts allow-same-origin allow-forms"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-500 bg-zinc-950/90 gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
                                        <p className="text-sm font-semibold text-zinc-400">Preparando tu vista previa interactiva...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enlace para Ampliar */}
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={onView}
                                className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-xs md:text-sm font-bold transition-all duration-200 group active:scale-95"
                            >
                                <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Ampliar vista previa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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

    const currentDisplayHooks = displayHooks && displayHooks.length > 0 
        ? displayHooks 
        : customizedLockedHooks;

    // Helper to highlight key words in orange for maximum psychological and visual fidelity
    const highlightText = (text: string) => {
        if (!text) return "";
        const keywords = [
            "triplicar", "ingresos mensuales", "técnica de belleza", "alta demanda",
            "uñas rusas", "cobrar $10 a $50", "agenda llena", "clientas premium",
            "tarifas de lujo", "microblading de cejas", "diseño de miradas perfectas",
            "error", "principiantes", "atraer clientas", "competir por precio",
            "clase gratuita", "nueva profesión", "desde cero", "sector de la belleza",
            "salones de alta gama", "cobrar 5 veces más", "mito", "fórmulas tradicionales"
        ];
        
        const regex = new RegExp(`(${keywords.join("|")})`, "gi");
        const parts = text.split(regex);
        
        return parts.map((part, index) => {
            const isMatch = keywords.some(kw => kw.toLowerCase() === part.toLowerCase());
            return isMatch ? (
                <span key={index} className="text-[#FF5A1F] font-extrabold">{part}</span>
            ) : (
                <span key={index}>{part}</span>
            );
        });
    };    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1400px] mx-auto p-2 md:p-6 lg:p-8 font-sans"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                {/* Columna Izquierda: Configuración y Control */}
                <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-6">
                    <div className="space-y-6">
                        {/* Identificador de paso */}
                        <div className="space-y-2">
                            <span className="text-[#FF5A1F] text-xs font-bold uppercase tracking-wider">
                                Paso 3 de 4 · Reels de atracción
                            </span>
                            <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                                Preparemos tus primeros reels de atracción
                            </h1>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                                Utilizaremos la estrategia de tu proyecto y tu página de captación para preparar contenido que dirija personas interesadas hacia tu clase gratuita.
                            </p>
                        </div>

                        {/* Tarjeta Configuración recomendada */}
                        <div className="bg-[#0b0b0c]/85 border border-zinc-800/80 rounded-2xl overflow-hidden p-5 space-y-4">
                            <h3 className="text-[#FF5A1F] text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-[#FF5A1F] rounded-full"></span>
                                Configuración recomendada
                            </h3>
                            <div className="divide-y divide-zinc-800/40">
                                {/* Producto */}
                                <div className="flex items-center justify-between py-3 flex-wrap sm:flex-nowrap gap-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                        <Briefcase className="w-4 h-4 text-[#FF5A1F]" />
                                        <span>Producto</span>
                                    </div>
                                    <span className="text-white text-sm font-semibold truncate text-right max-w-[240px]">
                                        {project?.name || "Curso Profesional de Microblading de Cejas"}
                                    </span>
                                </div>

                                {/* Objetivo */}
                                <div className="flex items-center justify-between py-3 flex-wrap sm:flex-nowrap gap-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                        <Target className="w-4 h-4 text-[#FF5A1F]" />
                                        <span>Objetivo</span>
                                    </div>
                                    <span className="text-white text-sm font-semibold text-right">
                                        Llevar visitas hacia la clase gratuita
                                    </span>
                                </div>

                                {/* Canales */}
                                <div className="flex items-center justify-between py-3 flex-wrap sm:flex-nowrap gap-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                        <Smartphone className="w-4 h-4 text-[#FF5A1F]" />
                                        <span>Canales</span>
                                    </div>
                                    <span className="text-white text-sm font-semibold text-right">
                                        Instagram Reels y TikTok
                                    </span>
                                </div>

                                {/* Formato */}
                                <div className="flex items-center justify-between py-3 flex-wrap sm:flex-nowrap gap-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                        <Film className="w-4 h-4 text-[#FF5A1F]" />
                                        <span>Formato</span>
                                    </div>
                                    <span className="text-white text-sm font-semibold text-right">
                                        Videos sin mostrar el rostro
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sección Cada reel incluirá */}
                        <div className="bg-[#0b0b0c]/40 border border-zinc-800/40 rounded-2xl p-5 space-y-3">
                            <h4 className="text-white text-sm font-bold tracking-wide">
                                Cada reel incluirá
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shadow-sm">
                                    ⚓ Hook
                                </span>
                                <span className="bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shadow-sm">
                                    📝 Guion
                                </span>
                                <span className="bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shadow-sm">
                                    🔤 Texto para publicar
                                </span>
                                <span className="bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shadow-sm">
                                    ⚡ CTA hacia tu página
                                </span>
                            </div>
                        </div>

                        {/* Faja de Plan */}
                        <div className="bg-orange-950/20 border border-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-3 rounded-full flex items-center gap-2 justify-center">
                            <span>🎁 Plan gratuito · 3 reels disponibles</span>
                        </div>
                    </div>

                    {/* Botones y Candado */}
                    <div className="pt-6 border-t border-zinc-900 flex flex-col gap-4">
                        <button 
                            onClick={() => onNext()}
                            className="px-6 py-4.5 bg-[#FF5A1F] hover:bg-[#E54E15] text-white rounded-xl font-extrabold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 w-full shadow-lg shadow-[#FF5A1F]/15 active:scale-98 transform hover:-translate-y-0.5"
                        >
                            <Flame className="w-4 h-4 shrink-0 animate-pulse" />
                            {isUnlocked ? "Finalizar configuración del sistema" : "Preparar mis 3 reels"}
                        </button>
                        <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-medium">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Podrás revisar los reels antes de utilizarlos en tu proyecto.</span>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Vista Previa de los 3 Reels */}
                <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between">
                    <div className="flex flex-col h-full bg-[#080809]/40 border border-zinc-800/60 rounded-3xl p-5 md:p-6 shadow-3xl">
                        {/* Indicador superior */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest select-none">
                                Vista previa
                            </span>
                        </div>

                        {/* Grid de 3 Reels con diseño Vertical de Video */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 flex-1 items-stretch">
                            {currentDisplayHooks.slice(0, 3).map((hook, idx) => {
                                const hookTextStr = hook.hookText || hook.text || hook.title || hook.question || '';
                                const downloadVideoUrl = hook.contentJson?.downloadUrl || hook.contentJson?.videoUrl || hook.downloadUrl || hook.videoUrl;
                                const hasDownloadUrl = downloadVideoUrl && downloadVideoUrl !== '#';

                                // Custom format and times matching mockups
                                const formats = ["Educativo", "Problema y solución", "Oportunidad"];
                                const formattedDurations = ["35 s", "42 s", "38 s"];

                                return (
                                    <div 
                                        key={idx}
                                        className="bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg group hover:border-[#FF5A1F]/30 hover:shadow-2xl hover:shadow-[#FF5A1F]/5 transition-all duration-300"
                                    >
                                        {/* Mockup de Celular Vertical (Estructura de Video) */}
                                        <div className="aspect-[9/13] w-full bg-gradient-to-b from-zinc-900 to-zinc-950 relative p-4 flex flex-col justify-between overflow-hidden border-b border-zinc-800/85">
                                            {/* Top Bar de Video */}
                                            <div className="flex items-center justify-between w-full relative z-10 select-none">
                                                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border border-white/5">
                                                    {idx + 1}
                                                </span>
                                                <Clapperboard className="w-4 h-4 text-zinc-400" />
                                            </div>

                                            {/* Video Background Effect Overlay */}
                                            <div className="absolute inset-0 bg-radial-gradient from-[#FF5A1F]/10 via-transparent to-transparent opacity-40 pointer-events-none group-hover:opacity-60 transition-opacity duration-300"></div>

                                            {/* Hook Overlaid on Video Screen */}
                                            <div className="relative z-10 flex-1 flex items-center justify-center text-center px-1 py-4">
                                                <p className="text-white text-xs font-semibold tracking-tight leading-relaxed max-w-full text-center select-none">
                                                    {highlightText(hookTextStr)}
                                                </p>
                                            </div>

                                            {/* Gradient Shade on Bottom */}
                                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                                        </div>

                                        {/* Info & Metadata Section under Screen */}
                                        <div className="p-4 flex-1 flex flex-col justify-between bg-zinc-950/40 space-y-3">
                                            <div className="space-y-2.5">
                                                {/* Hook full info text */}
                                                <div>
                                                    <span className="text-[#FF5A1F] text-[10px] font-black uppercase tracking-widest block mb-1">
                                                        Hook
                                                    </span>
                                                    <p className="text-zinc-400 text-xs leading-relaxed font-semibold line-clamp-3">
                                                        {hookTextStr}
                                                    </p>
                                                </div>

                                                {/* Formato info */}
                                                <div className="flex items-center justify-between text-xs py-1 border-t border-zinc-900">
                                                    <span className="text-[#888] font-medium">Formato</span>
                                                    <span className="text-zinc-300 font-semibold">{formats[idx] || "Educativo"}</span>
                                                </div>

                                                {/* Duracion info */}
                                                <div className="flex items-center justify-between text-xs py-1 border-t border-zinc-900">
                                                    <span className="text-[#888] font-medium">Duración</span>
                                                    <span className="text-zinc-300 font-semibold">{formattedDurations[idx] || "40 s"}</span>
                                                </div>
                                            </div>

                                            {/* Button to download/play */}
                                            <div className="pt-2">
                                                {hasDownloadUrl ? (
                                                    <a 
                                                        href={downloadVideoUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="w-full py-2 bg-[#FF5A1F] hover:bg-[#E54E15] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap active:scale-98"
                                                    >
                                                        <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                                                        Ver y descargar video
                                                    </a>
                                                ) : (
                                                    <button 
                                                        disabled
                                                        className="w-full py-2 bg-zinc-900/40 text-zinc-650 border border-zinc-800/45 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed select-none transition-all"
                                                    >
                                                        <Play className="w-3.5 h-3.5 fill-zinc-650 shrink-0 opacity-40" />
                                                        Video listo
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

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
