import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Rocket, ChevronRight, Loader2, CheckCircle, ShieldCheck, Play, ArrowRight, MousePointer2, UserCircle2, Brain, Wand2, Quote, User, HeartPulse, MessageSquareQuote, Lock, Package, FileText, Lightbulb, Camera, BarChart2, Flower2, Star, Users, Percent, Tag, TrendingUp, Info, Mail } from 'lucide-react';
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
            
            <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    ¡Hola, <span className="text-[#FF5A1F]">{userName}</span>!
                </h1>
                <h2 className="text-xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
                    Tu recorrido inicial está listo
                </h2>
                <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
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
                            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                                Podrás elegir una oportunidad analizada por Aprende Marketing o utilizar un producto que ya hayas seleccionado.
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
                            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                                Definiremos la audiencia, el problema principal y el ángulo desde el que presentarás el producto.
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
                            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                                Generarás la estructura de tu página, el contenido inicial y el sistema para captar y hacer seguimiento a tus contactos.
                            </p>
                        </div>
                    </div>

                    {/* Bloque de Nota Integradora */}
                    <div className="pt-6 mt-6 border-t border-white/5">
                        <div className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 p-4 rounded-xl flex gap-3 items-start">
                            <div className="w-8 h-8 bg-[#FF5A1F]/10 rounded-lg flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5 border border-[#FF5A1F]/20">
                                <Lightbulb className="w-4 h-4" />
                            </div>
                            <p className="text-zinc-300 text-xs md:text-sm font-medium leading-relaxed">
                                <strong className="text-[#FF5A1F]">No necesitas tener conocimientos técnicos.</strong> Te guiaremos paso a paso y podrás revisar cada decisión antes de continuar.
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
                <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    Según tus respuestas, estas son las oportunidades que mejor encajan con tu experiencia, tus intereses y los recursos que tienes disponibles.
                </p>
            </div>

            {/* Subcabecera interactiva con doble alineación */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-b border-white/5 max-w-[1240px] mx-auto w-full">
                <div className="flex items-center gap-2 text-[#FF5A1F] font-bold text-sm md:text-base">
                    <span>✨ {projects.length} productos recomendados para ti</span>
                </div>
                <button
                    type="button"
                    onClick={() => setShowCustomProduct(true)}
                    className="text-amber-500 hover:text-amber-400 transition-colors font-bold text-xs md:text-sm flex items-center gap-1.5 uppercase tracking-wide cursor-pointer"
                >
                    ¿Ya tienes un producto? <span className="underline">Añadir mi producto</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
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

                    // Level label dynamically mapped
                    const levelLabel = project.level || "inicial";

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

                                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-4 min-h-[72px]">
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
                                        <BarChart2 className="w-4 h-4 text-zinc-500 shrink-0" />
                                        <span className="text-xs text-zinc-400 font-medium">
                                            <strong className="text-white font-bold">Nivel:</strong> {levelLabel}
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
                                    {/* Action links */}
                                    <div className="text-center">
                                        <span className="text-zinc-500 hover:text-[#FF5A1F] transition-colors font-bold text-xs tracking-wider inline-flex items-center gap-1 uppercase">
                                            Ver análisis <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>

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
                        ¡Perfecto! <span className="text-emerald-500">Estamos listos!!! </span>
                    </h2>
                    <div className="space-y-2">
                        <p className="text-lg md:text-xl text-slate-200 font-medium">
                            Ya he desbloqueado el producto digital <span className="text-emerald-400 font-bold">"{project?.name || 'Digital'}"</span> para que lo uses
                        </p>
                        <p className="text-base md:text-lg text-white max-w-2xl mx-auto font-medium leading-normal">
                            Ahora crearé por ti todo un <span className="text-white font-bold">sistema de ventas completo</span>.
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
                            className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors group"
                        >
                            <item.icon className="w-6 h-6 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                            <div className="space-y-1">
                                <p className="text-white text-lg font-bold tracking-tight leading-relaxed">{item.title}</p>
                                <p className="text-gray-300 text-base font-normal leading-relaxed">{item.desc}</p>
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
                    ¡Excelente! <span className="text-emerald-500">He creado tu Web de Captura</span>!
                </h2>
                <p className="text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed">
                    Esta página web será el lugar donde tus visitantes interesadas dejarán sus datos de contacto para acceder a la información de tu producto digital
                </p>
                <div className="space-y-2 pt-4">
                    <p className="text-[#FF5A1F] font-black uppercase tracking-widest text-sm italic">
                        🚀 Haz clic para ver la Página Web de Captura profesional que he creado para ti
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
                    Más adelante podrás cambiar los textos y colores de tu página de captura
                </p>
            </div>

            <button 
                onClick={() => onNext()}
                className="group flex items-center gap-4 px-12 py-7 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-[2.5rem] font-black text-2xl transition-all shadow-[0_20px_50px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95 mx-auto"
            >
                Ahora crearemos Videos para atraer visitantes interesados
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
                                Videos de <span className="text-purple-500">para atraer clientes</span>
                            </h2>
                            <p className="text-[1.3rem] text-white max-w-2xl mx-auto font-medium leading-relaxed">
                                Crearé videos de menos de 1 minuto que publicarás en tus redes sociales para atraer cientos de clientes interesados.
                            </p>
                        </div>

                        <div className="space-y-6 pt-4">
                            <p className="text-white text-xl font-bold uppercase tracking-tight">Con estos videos podrás:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                                {[
                                    'Atraer todos los días personas interesadas en tu producto digital.',
                                    'Hacer que tus redes sociales crezcan ilimitadamente',
                                    'Construir una audiencia propia que te generará futuras ventas',
                                    'Generar más confianza y credibilidad con tu audiencia.'
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
                           He creado <span className="text-purple-400">tus Videos de Atracción</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                            A continuación podrás descargar 3 videos que publicarás en YouTube, Instagram, Tik Tok y Facebook para atraer clientes interesados.
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
                                                📅 PUBLICALO EL VIDEO: {idx === 0 ? 'HOY' : idx === 1 ? 'MAÑANA' : idx === 2 ? 'PASADO MAÑANA' : `DÍA ${idx + 1}`}
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
                                                    Ver y Descargar Video
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
                                FINALZIAR CONFIGURACIÓN DE TU SISTEMA DE VENTAS
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
