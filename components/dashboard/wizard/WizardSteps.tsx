import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Rocket, ChevronRight, Loader2, CheckCircle, ShieldCheck, Play, ArrowRight, MousePointer2, UserCircle2, Brain, Wand2, Quote, User, HeartPulse, MessageSquareQuote, Lock, Package, FileText, Lightbulb, Camera, BarChart2, Flower2, Star, Users, Percent, Tag, TrendingUp, Info, Mail, Link, RotateCw, Maximize2, Edit3, Smartphone, Briefcase, Film, Video, Clapperboard, Flame, Settings, Eye } from 'lucide-react';
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
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{
                    paddingBottom: '0.5em',
                    paddingTop: '0em'
                }}>
                    Elige el producto con el que crearás tu <span className="text-[#FF5A1F]">primer proyecto</span>
                </h2>
                <p className="max-w-2xl mx-auto leading-relaxed text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up" style={{
                    fontSize: '1.2em',
                    lineHeight: '1.4em',
                    paddingTop: 0,
                    marginTop: 0
                }}>
                    Elige el producto digital que mejor encaja con tu experiencia, intereses y recursos que tienes disponibles.
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

    const isCejasOrMicroblading = project.name?.toLowerCase().includes("cejas") || project.name?.toLowerCase().includes("microblading") || project.id === "proj-microblading-01";

    // Customized product ideal description
    let idealText = "";
    if (project.shortDescription || project.description) {
        idealText = project.shortDescription || project.description;
    } else if (isCejasOrMicroblading) {
        idealText = "Una oportunidad ideal para personas interesadas en belleza, contenido visual y una estrategia basada en clase gratuita.";
    } else if (project.name?.toLowerCase().includes("manicurista")) {
        idealText = "Una oportunidad ideal para personas creativas que disfrutan del cuidado de manos y uñas y quieren profesionalizar sus servicios.";
    } else if (project.name?.toLowerCase().includes("pestañas") || project.name?.toLowerCase().includes("lashista")) {
        idealText = "Una oportunidad ideal para personas apasionadas por la belleza que buscan especializarse en una técnica de alta demanda.";
    } else if (project.name?.toLowerCase().includes("resina") || project.name?.toLowerCase().includes("pisos")) {
        idealText = "Una oportunidad ideal para personas interesadas en la construcción, decoración de interiores y modelado de alta rentabilidad.";
    } else {
        idealText = "Una oportunidad ideal para personas interesadas en belleza, contenido visual y una estrategia basada en clase gratuita.";
    }

    const displayTitle = isCejasOrMicroblading ? "Curso Profesional de Microblading de Cejas" : project.name;
    const uppercaseNiche = isCejasOrMicroblading ? "BELLEZA Y CUIDADO PERSONAL" : (project.niche || 'Belleza y estética').toUpperCase();

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
            </div>

            {/* Main Rounded Component Container */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* Left Column - Product details */}
                    <div className="space-y-6 flex flex-col justify-start">
                        <div className="space-y-6">
                            {/* Niche/Category badge top left */}
                            <div>
                                <span className={`inline-flex items-center gap-1 px-3 py-1.5 ${isCejasOrMicroblading ? 'bg-[#200A03] border-[#FF5A1F] text-[#FF5A1F]' : 'bg-[#FF5A1F]/10 border-[#FF5A1F]/20 text-[#FF5A1F]'} border text-[10px] md:text-xs font-black uppercase tracking-wider rounded-lg`}>
                                    {uppercaseNiche}
                                </span>
                            </div>

                            {/* Product Title and Description */}
                            <div className="space-y-3">
                                <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                                    {displayTitle}
                                </h3>
                                <p 
                                    className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up" 
                                    style={{ fontSize: "1.06rem", lineHeight: "1.6rem" }}
                                >
                                    {idealText}
                                </p>
                            </div>
                        </div>

                        {/* Bottom stats cards */}
                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <div className="flex flex-col gap-3">
                                {/* Price Card */}
                                <div className="bg-gradient-to-r from-cyan-600/10 via-cyan-950/5 to-transparent border border-cyan-500/30 rounded-xl p-3.5 flex items-center gap-4 hover:from-cyan-500/15 hover:border-cyan-500/50 hover:shadow-[0_8px_24px_-10px_rgba(6,182,212,0.25)] transition-all duration-300 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover/item:bg-cyan-500/20 group-hover/item:border-cyan-500/40 transition-all duration-300 shrink-0">
                                        <Tag className="w-5 h-5 shrink-0" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[11px] font-semibold text-cyan-400/80 uppercase tracking-wider leading-none font-sans">Precio del producto</span>
                                        <span className="text-white text-sm md:text-base font-extrabold tracking-tight mt-1.5 font-sans">
                                            USD {project.fullPrice || '200'}
                                        </span>
                                    </div>
                                </div>

                                {/* Commission Card */}
                                <div className="bg-gradient-to-r from-emerald-600/10 via-emerald-900/5 to-transparent border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-4 hover:from-emerald-500/15 hover:border-emerald-500/50 hover:shadow-[0_8px_24px_-10px_rgba(16,185,129,0.25)] transition-all duration-300 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/item:bg-emerald-500/20 group-hover/item:border-emerald-500/40 transition-all duration-300 shrink-0">
                                        <Percent className="w-5 h-5 shrink-0" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-wider leading-none font-sans">Comisión que obtendrás</span>
                                        <span className="text-white text-sm md:text-base font-extrabold tracking-tight mt-1.5 font-sans">
                                            {displayCommission} %
                                        </span>
                                    </div>
                                </div>

                                {/* Estimated Revenue Card */}
                                <div className="bg-gradient-to-r from-[#FF5A1F]/15 via-[#FF5A1F]/5 to-transparent border border-[#FF5A1F]/40 rounded-xl p-3.5 flex items-center gap-4 hover:from-[#FF5A1F]/20 hover:border-[#FF5A1F]/60 hover:shadow-[0_8px_24px_-10px_rgba(255,90,31,0.35)] transition-all duration-300 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shadow-[0_0_15px_-3px_rgba(255,90,31,0.4)] group-hover/item:bg-[#FF5A1F]/20 group-hover/item:border-[#FF5A1F]/50 transition-all duration-300 shrink-0">
                                        <TrendingUp className="w-5 h-5 shrink-0" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[11px] font-semibold text-[#FF5A1F]/90 uppercase tracking-wider leading-none font-sans font-medium">Tu ganancia por venta</span>
                                        <span className="text-[#FF5A1F] text-sm md:text-base font-extrabold tracking-tight mt-1.5 font-sans">
                                            USD {Math.round(parseFloat(profitValue))}
                                        </span>
                                    </div>
                                </div>
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
                                
                                {isCejasOrMicroblading && (
                                    <div className="absolute inset-0 flex items-center justify-end p-6 select-none pointer-events-none">
                                        {/* El degradado horizontal de izquierda a derecha */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/80 to-neutral-955/95" />
                                        
                                        {/* Logotipo dorado "M" y marca */}
                                        <div className="relative z-10 w-1/2 flex flex-col items-center text-center space-y-1.5 justify-center h-full pt-4">
                                            {/* Logo de la M dorada */}
                                            <div className="text-[#DFB56C] font-serif text-3xl font-light tracking-widest leading-none">
                                                M
                                            </div>
                                            
                                            {/* Separador de marca sutil */}
                                            <div className="w-6 h-[1px] bg-[#DFB56C]/30" />
                                            
                                            {/* Título de la marca */}
                                            <div className="text-white font-semibold text-[13px] md:text-[15px] tracking-[0.2em] uppercase leading-snug">
                                                Microblading
                                                <span className="block text-[11px] md:text-[12px] tracking-[0.3em] font-light text-zinc-100">de Cejas</span>
                                            </div>
                                            
                                            {/* Subtítulo */}
                                            <div className="text-[#DFB56C]/80 font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase font-bold pt-1">
                                                Formación Profesional
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/25 transition-colors flex items-center justify-center">
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
                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up">Audiencia y ángulo de venta</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-[#FF5A1F]" />
                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up">Página de captación</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-[#FF5A1F]" />
                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up">Contenido y seguimiento inicial</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions stack (Vertical flow identical to Image 2) */}
                        <div className="flex flex-col gap-3 pt-2">
                            {/* Choose primary strategy build button (Top button) */}
                            <button 
                                type="button"
                                onClick={() => !isStrategyGenerated && onNext()}
                                disabled={isStrategyGenerated}
                                className={`w-full py-4 px-6 ${isStrategyGenerated ? 'bg-emerald-600' : 'bg-[#FF5A1F] hover:bg-[#D94A1E]'} text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group`}
                            >
                                <span>{isStrategyGenerated ? 'Estrategia Generada' : 'Elegir este producto y crear mi estrategia'}</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Back selection button (Bottom button) */}
                            {onBackToSelection && (
                                <button 
                                    type="button"
                                    onClick={onBackToSelection}
                                    className="w-full py-3 px-4 bg-transparent hover:bg-white/[0.04] text-white hover:text-zinc-200 border border-white/20 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                                >
                                    <span>← Volver a los productos</span>
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
export const GenerationStep: React.FC<{ 
    progress: number; 
    status: string; 
    secondsElapsed?: number; 
    message?: string;
    project?: any;
}> = ({ progress, status, secondsElapsed = 0, message, project }) => {
    const isWeb = message?.toLowerCase().includes('web') || message?.toLowerCase().includes('página') || status?.toLowerCase().includes('página');
    const isVideo = message?.toLowerCase().includes('video') || message?.toLowerCase().includes('atracción') || message?.toLowerCase().includes('video') || status?.toLowerCase().includes('videos');

    let displayTitle = (
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Estamos <span className="text-[#FF5A1F]">preparando</span> tu proyecto
        </h2>
    );
    if (isWeb) {
        displayTitle = (
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Estamos <span className="text-[#FF5A1F]">creando</span> tu página web
            </h2>
        );
    } else if (isVideo) {
        displayTitle = (
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Estamos <span className="text-[#FF5A1F]">creando</span> tus videos
            </h2>
        );
    } else {
        displayTitle = (
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Estamos <span className="text-[#FF5A1F]">preparando</span> tu proyecto
            </h2>
        );
    }

    let displaySubtitle = "Analizamos el producto seleccionado para crear la base inicial de tu estrategia.";
    if (isWeb) {
        displaySubtitle = "Crearemos tu página web profesional para capturar clientes interesados.";
    } else if (isVideo) {
        displaySubtitle = "Estamos creando los videos para atraer tus potenciales clientes.";
    }

    const step1State = (progress >= 33 ? 'completed' : 'active') as 'completed' | 'active' | 'pending';
    const step2State = (progress >= 66 ? 'completed' : (progress >= 33 ? 'active' : 'pending')) as 'completed' | 'active' | 'pending';
    const step3State = (progress >= 100 ? 'completed' : (progress >= 66 ? 'active' : 'pending')) as 'completed' | 'active' | 'pending';

    const renderCircle = (state: 'completed' | 'active' | 'pending') => {
        if (state === 'completed') {
            return (
                <div className="w-6 h-6 rounded-full bg-[#FF5A1F] flex items-center justify-center shadow-[0_0_12px_rgba(255,90,31,0.4)] shrink-0">
                    <svg className="w-3.5 h-3.5 text-white stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
            );
        }
        if (state === 'active') {
            return (
                <div className="w-6 h-6 rounded-full border border-[#FF5A1F] bg-[#FF5A1F]/5 flex items-center justify-center shrink-0 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-[#FF5A1F] animate-spin"></div>
                    <div className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping"></div>
                </div>
            );
        }
        return (
            <div className="w-6 h-6 rounded-full border border-zinc-700 bg-transparent flex items-center justify-center shrink-0"></div>
        );
    };

    const imageUrl = project?.multimedia_json?.heroImages?.[0] || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2670&auto=format&fit=cover';
    const productName = project?.productName || project?.name || 'Curso Profesional de Microblading de Cejas';

    return (
        <div className="flex flex-col items-center justify-center px-6 space-y-8 text-center max-w-xl mx-auto py-10">
            {/* 1. Header with orange glow and slow spinning settings icon */}
            <div className="relative">
                <div className="absolute inset-x-0 -top-12 -bottom-12 bg-[#FF5A1F]/20 blur-[80px] rounded-full animate-pulse transition-all duration-1000"></div>
                <div className="relative w-28 h-28 rounded-3xl bg-[#0A0A0A] border-2 border-[#FF5A1F]/30 flex items-center justify-center shadow-[0_15px_60px_-15px_rgba(255,90,31,0.3)] group overflow-hidden">
                    <Settings className="w-14 h-14 text-[#FF5A1F] animate-spin-slow" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5A1F]/5 to-transparent"></div>
                </div>
            </div>

            {/* 2. Titles */}
            <div className="space-y-3">
                {displayTitle}
                <p className="text-zinc-400 text-sm md:text-base font-light max-w-md mx-auto leading-relaxed">
                    {displaySubtitle}
                </p>
            </div>

            {/* 3. Selected Product Card */}
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 text-left max-w-md mx-auto shadow-xl">
                <div className="w-20 md:w-24 aspect-video rounded-lg overflow-hidden relative shrink-0 bg-zinc-900 border border-white/10 flex items-center justify-center">
                    <img referrerPolicy="no-referrer" src={imageUrl} alt={productName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-8 h-8 rounded-full bg-[#FF5A1F] flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#FF5A1F] uppercase tracking-[0.2em]">PRODUCTO SELECCIONADO</span>
                    <h4 className="text-white font-extrabold text-sm md:text-base leading-snug mt-1 line-clamp-2">{productName}</h4>
                </div>
            </div>

            {/* 4. Progressive Checklist */}
            <div className="w-full bg-[#111111]/40 border border-white/5 rounded-2xl p-5 space-y-4 max-w-md mx-auto text-left backdrop-blur-sm shadow-xl">
                {/* Step 1 */}
                <div className="flex items-start gap-3.5 font-sans">
                    {renderCircle(step1State)}
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold leading-tight ${step1State === 'pending' ? 'text-zinc-600' : 'text-white'}`}>
                            {isWeb ? "Diseñando la estructura web" : "Analizando el producto"}
                        </span>
                        <span className="text-xs text-zinc-500 mt-0.5">
                            {isWeb ? "Generando bloques, secciones y distribución visual persuasiva." : "Identificando su propuesta, público y principales beneficios."}
                        </span>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3.5 font-sans">
                    {renderCircle(step2State)}
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold leading-tight ${step2State === 'pending' ? 'text-zinc-600' : 'text-white'}`}>
                            {isWeb ? "Redactando textos persuasivos" : "Preparando la audiencia"}
                        </span>
                        <span className="text-xs text-zinc-500 mt-0.5">
                            {isWeb ? "Escribiendo títulos profesionales y llamados a la acción de alta conversión." : "Organizando los perfiles de cliente que podrás revisar."}
                        </span>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3.5 font-sans">
                    {renderCircle(step3State)}
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold leading-tight ${step3State === 'pending' ? 'text-zinc-600' : 'text-white'}`}>
                            {isWeb ? "Publicando en la nube segura" : "Construyendo la estrategia inicial"}
                        </span>
                        <span className="text-xs text-zinc-500 mt-0.5">
                            {isWeb ? "Desplegando tu página web optimizada para capturar clientes interesados." : "Preparando dolores, deseos y posibles ángulos de venta."}
                        </span>
                    </div>
                </div>
            </div>

            {/* 5. Progress Bar */}
            <div className="w-full max-w-md space-y-2">
                <div className="w-full bg-[#111] h-5 rounded-full overflow-hidden border border-white/10 p-1 relative shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#FF5A1F] via-[#FF8C00] to-[#FFCD42] rounded-full relative shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[loading-shine_1.5s_infinite]"></div>
                    </motion.div>
                </div>
                <div className="flex justify-end pr-1">
                    <span className="text-xs font-bold text-[#FF5A1F]">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* 6. Info card footer */}
            <div className="flex items-center gap-3 justify-center text-zinc-400 text-xs md:text-sm max-w-md mx-auto pt-2 font-sans">
                <Info className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                <div className="text-left">
                    <p className="font-bold text-zinc-300 text-xs md:text-sm">Este proceso suele tardar unos instantes.</p>
                    <p className="text-zinc-500 text-[10px] md:text-xs">Te llevaremos automáticamente al siguiente paso cuando esté listo.</p>
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
            {/* Títulos Principales */}
            <div className="space-y-3 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Tu estrategia inicial está lista
                </h2>
            </div>

            {/* Tarjeta Translúcida de Progreso ("Lo que ya está preparado") */}
            <div className="w-full max-w-2xl mx-auto bg-[#0b0b0c]/60 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 text-left">
                <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up text-left px-1 block" style={{ fontSize: '1em', color: '#a2afaf' }}>
                    Hemos preparado la base estratégica para promocionar el{" "}
                    <span className="text-[#FF5A1F] font-bold">
                        {project?.name || "Certificación Expert Microblading"}
                    </span>.
                </p>
                
                <div className="space-y-3">
                    {/* Item 1 - Producto */}
                    <div className="flex items-center gap-4 bg-[#141416]/50 border border-white/5 p-4 rounded-2xl">
                        <div className="w-11 h-11 bg-orange-500/5 border border-white/5 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <Package className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold tracking-tight">Producto seleccionado</p>
                            <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{ fontSize: '1em', color: '#a2afaf' }}>{project?.name || "Curso Profesional de Microblading de Cejas"}</p>
                        </div>
                    </div>

                    {/* Item 2 - Público */}
                    <div className="flex items-center gap-4 bg-[#141416]/50 border border-white/5 p-4 rounded-2xl">
                        <div className="w-11 h-11 bg-orange-500/5 border border-white/5 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <Users className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold tracking-tight">Público y necesidades</p>
                            <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{ fontSize: '1em', color: '#a2afaf' }}>Audiencia, dolores, deseos y objeciones relacionados con el producto.</p>
                        </div>
                    </div>

                    {/* Item 3 - Estrategia */}
                    <div className="flex items-center gap-4 bg-[#141416]/50 border border-white/5 p-4 rounded-2xl">
                        <div className="w-11 h-11 bg-orange-500/5 border border-white/5 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <Target className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold tracking-tight">Estrategia de comunicación</p>
                            <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{ fontSize: '1em', color: '#a2afaf' }}>Ángulos de venta y mensajes iniciales para presentar la oportunidad.</p>
                        </div>
                    </div>

                    {/* Item 4 - Siguiente Paso (Destacado) */}
                    <div className="flex items-start gap-4 bg-orange-500/[0.02] border border-[#FF5A1F]/30 p-5 rounded-2xl shadow-[0_4px_30px_rgba(255,90,31,0.03)]">
                        <div className="w-11 h-11 bg-orange-500/10 border border-[#FF5A1F]/20 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
                            <Sparkles className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold tracking-tight">Siguiente paso</p>
                            <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{ fontSize: '1em', color: '#a2afaf' }}>
                                Ahora crearemos tu página web de captura de clientes. La página incluirá textos profesionales que atraerán personas realmente interesadas.
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
                        {/* Cabecera Izquierda */}
                        <div className="space-y-4">
                            {/* Icono Check superior verde esmeralda brillante */}
                            <div className="bg-emerald-500 text-white rounded-xl w-14 h-14 flex items-center justify-center border border-emerald-400/20 shadow-lg shadow-emerald-500/10">
                                <CheckCircle className="w-8 h-8 text-white fill-emerald-500" />
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3rem] font-black text-white leading-[1.05] tracking-tight mt-3">
                                Tu página de <br />
                                <span className="text-emerald-400">captación</span> ha sido <br />
                                generada
                            </h2>
                            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-semibold">
                                La primera versión está guardada como borrador dentro de tu proyecto.
                            </p>
                        </div>

                        {/* Sección "Resumen de tu página" */}
                        <div className="space-y-2.5">
                            <h3 className="text-white text-xs font-bold tracking-tight uppercase text-zinc-500">Resumen de tu página</h3>
                            <div className="bg-[#0b0b0c]/85 border border-zinc-800/40 rounded-2xl overflow-hidden divide-y divide-zinc-800/30">
                                {/* Proyecto */}
                                <div className="flex items-center justify-between p-3.5 flex-wrap sm:flex-nowrap gap-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm font-semibold">
                                        <Package className="w-4.5 h-4.5 text-[#FF5A1F]" />
                                        <span>Proyecto</span>
                                    </div>
                                    <span className="text-white text-xs font-extrabold truncate text-right">
                                        {project?.name || "Curso Profesional Certificado de Microblading de Cejas"}
                                    </span>
                                </div>

                                {/* URL Temporal */}
                                <div className="flex items-center justify-between p-3.5 flex-wrap sm:flex-nowrap gap-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm font-semibold">
                                        <Link className="w-4.5 h-4.5 text-[#FF5A1F]" />
                                        <span>URL temporal</span>
                                    </div>
                                    <span className="text-zinc-400 text-xs font-mono truncate text-right font-semibold">
                                        aprende.marketing/{subdomainPart || "microblading-demo"}
                                    </span>
                                </div>

                                {/* Formulario */}
                                <div className="flex items-center justify-between p-3.5 flex-wrap sm:flex-nowrap gap-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm font-semibold">
                                        <FileText className="w-4.5 h-4.5 text-[#FF5A1F]" />
                                        <span>Formulario</span>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Configurado
                                    </span>
                                </div>

                                {/* Estado */}
                                <div className="flex items-center justify-between p-3.5 flex-wrap sm:flex-nowrap gap-3">
                                    <div className="flex items-center gap-3 text-zinc-400 text-sm font-semibold">
                                        <ShieldCheck className="w-4.5 h-4.5 text-[#FF5A1F]" />
                                        <span>Estado</span>
                                    </div>
                                    <span className="bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                                        Borrador
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Nueva Tarjeta "Siguiente paso del sistema" */}
                        <div className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/10 rounded-2xl p-4 flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5A1F]/20">
                                <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-white text-sm font-bold tracking-tight">Siguiente paso del sistema</h4>
                                <p className="text-zinc-400 text-xs font-semibold leading-relaxed">
                                    Ahora prepararemos los 3 reels de atracción que utilizarás para llevar visitantes hacia tu página.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-6 border-t border-zinc-900 flex flex-col gap-4">
                        <button 
                            onClick={() => onNext()}
                            className="w-full px-6 py-4 bg-[#FF5A1F] hover:bg-[#E54E15] text-white rounded-xl font-black text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/15 active:scale-98 cursor-pointer"
                        >
                            <span>Continuar: preparar mis 3 reels</span>
                            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                        </button>
                        <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-bold">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Podrás editar y publicar tu página más adelante desde la sección Página web.</span>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Vista Previa en Vivo Interactiva */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="flex flex-col h-full bg-[#080809]/40 border border-zinc-805 rounded-[2.5rem] p-5 md:p-6 shadow-3xl">
                        {/* Mockup de Navegador Web */}
                        <div className="flex-1 min-h-[280px] lg:min-h-[360px] bg-[#121214] border border-zinc-800 rounded-[1.75rem] overflow-hidden flex flex-col shadow-2xl relative">
                            {/* Barra de Direcciones estilo Chrome/Safari */}
                            <div className="bg-[#1c1c1f] px-4 py-3.5 flex items-center justify-between border-b border-zinc-900 select-none">
                                <div className="flex items-center gap-4 flex-1">
                                    {/* Botones del sistema window */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500 font-bold"></div>
                                    </div>
                                    
                                    {/* Botones de navegación mockup */}
                                    <div className="hidden sm:flex items-center gap-2.5 text-zinc-650 shrink-0">
                                        <ChevronRight className="w-4 h-4 rotate-180 hover:text-[#FF5A1F] cursor-pointer text-zinc-600 transition-colors" />
                                        <ChevronRight className="w-4 h-4 hover:text-[#FF5A1F] cursor-pointer text-zinc-500 transition-colors" />
                                        <RotateCw className="w-3.5 h-3.5 hover:text-[#FF5A1F] cursor-pointer text-zinc-500 transition-colors" />
                                    </div>

                                    {/* Barra de Direcciones segura */}
                                    <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-300 flex items-center gap-2 overflow-hidden select-all shadow-inner max-w-lg">
                                        <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                                        <span className="truncate font-mono text-zinc-400 font-semibold">
                                            tuproyecto.aprendemarketing.com
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="bg-[#FFB800]/10 border border-[#FFB800]/20 text-[#FFB800] text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-inner font-mono">
                                        BORRADOR
                                    </span>
                                </div>
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
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-500 bg-zinc-950/95 gap-3">
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
                                className="inline-flex items-center gap-2 text-[#FF5A1F] hover:text-[#E54E15] text-xs md:text-sm font-extrabold transition-all duration-200 group active:scale-95 cursor-pointer"
                            >
                                <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Ampliar vista previa</span>
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
