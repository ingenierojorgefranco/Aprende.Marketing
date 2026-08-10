import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Rocket, ChevronRight, Loader2, CheckCircle, ShieldCheck, Play, ArrowRight, MousePointer2, UserCircle2, Brain, Wand2, Quote, User, HeartPulse, MessageSquareQuote, Lock, Package, FileText, Lightbulb, Camera, BarChart2, Flower2, Star, Users, Percent, Tag, TrendingUp, Info, Mail, Link, RotateCw, Maximize2, Edit3, Smartphone, Briefcase, Film, Video, Clapperboard, Flame, Settings, Eye, ExternalLink, GraduationCap, Puzzle, Clock, Crown, Download, Calendar, Check, X, AlertTriangle } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

interface StepProps {
    onNext: (data?: any) => void;
    data?: any;
    userData: any;
    disabled?: boolean;
    onView?: () => void;
    onEdit?: () => void;
    onGoToStep?: (step: number) => void;
}

// 1. BIENVENIDA
export const WelcomeStep: React.FC<StepProps> = ({ onNext, userData, disabled, onGoToStep }) => {
    const userName = userData.name?.split(' ')[0] || 'Mundo';
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-3xl mx-auto px-4 font-sans py-4"
        >
            {/* Step Navigation Pill Bar */}
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                <div
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FF5A1F] text-white shadow-[0_0_15px_rgba(255,90,31,0.35)]"
                >
                    <span>Step 1</span>
                    <span className="text-[10px] opacity-90">(Bienvenida)</span>
                </div>
                <span className="text-zinc-600 font-bold">•</span>
                <button
                    type="button"
                    onClick={() => onGoToStep && onGoToStep(2)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 cursor-pointer shadow-sm"
                >
                    <span>Step 2 →</span>
                    <span className="text-[10px] opacity-75">(Elegir Proyecto)</span>
                </button>
                <span className="text-zinc-600 font-bold">•</span>
                <button
                    type="button"
                    onClick={() => onGoToStep && onGoToStep(3)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 cursor-pointer shadow-sm"
                >
                    <span>Step 3 →</span>
                    <span className="text-[10px] opacity-75">(Revisar Producto)</span>
                </button>
            </div>

            <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#FF5A1F]/30 blur-3xl opacity-30 animate-pulse rounded-full"></div>
                <div className="w-16 h-16 bg-[#FF5A1F] rounded-2xl flex items-center justify-center mx-auto relative border border-white/15 shadow-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
            </div>
            
            <div className="space-y-4">
                {/* Encabezado (H1) */}
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    ¡Hola, <span className="text-[#FF5A1F]">{userName}</span>!
                </h1>

                {/* Subtítulo */}
                <h2 className="text-xl md:text-2xl font-bold text-[#FF5A1F] tracking-tight pt-2">
                    ¡Ya estás dentro! Vamos a dar el primer paso.
                </h2>

                {/* Mensaje de Instrucción */}
                <p 
                    className="max-w-2xl mx-auto leading-relaxed text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up pt-2" 
                    style={{ fontSize: "1.2em", lineHeight: "1.4em" }}
                >
                    Te ayudaremos a lanzar tu primer proyecto digital de la forma más rápida. Para hacerlo muy fácil, nuestros profesionales han preconfigurado varios proyectos listos para usar. Solo tienes que elegir el que mejor se adapte a ti y nosotros haremos el trabajo pesado.
                </p>
            </div>

            {/* Botón de acción */}
            <div className="pt-4">
                <button 
                    onClick={() => !disabled && onNext()}
                    disabled={disabled}
                    className={`group flex items-center gap-3 px-8 py-4 ${disabled ? 'bg-zinc-800 cursor-not-allowed opacity-50 text-zinc-500' : 'bg-[#FF5A1F] hover:bg-[#D94A1E] shadow-[0_12px_30px_-5px_rgba(255,90,31,0.4)] transform hover:-translate-y-0.5 active:scale-98'} text-white rounded-2xl font-black text-base md:text-lg tracking-wide transition-all mx-auto cursor-pointer`}
                >
                    {disabled ? 'Configuración en proceso' : 'Elegir mi primer proyecto'}
                    {!disabled && <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />}
                </button>
            </div>
        </motion.div>
    );
};

// 2. SELECCIÓN DE PROYECTO
export const ProjectSelectionStep: React.FC<StepProps & { projects: any[], loading: boolean, selectedProjectId?: string, isLocked?: boolean }> = ({ projects, loading, onNext, selectedProjectId, isLocked, onGoToStep }) => {
    const [showCustomProduct, setShowCustomProduct] = React.useState(false);
    const [confirmingProject, setConfirmingProject] = React.useState<any | null>(null);
    const [activeCategory, setActiveCategory] = React.useState('Belleza');

    const categories = [
        { id: 'Belleza', label: 'Belleza', icon: '💄' },
        { id: 'Manualidades', label: 'Manualidades', icon: '🧶' },
        { id: 'Mascotas', label: 'Mascotas', icon: '🐾' },
        { id: 'Negocios', label: 'Negocios', icon: '📈' },
    ];

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
            className="space-y-8 font-sans max-w-[1240px] mx-auto px-2 md:px-4 relative"
        >
            {/* Step Navigation Pill Bar */}
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                <button
                    type="button"
                    onClick={() => onGoToStep && onGoToStep(1)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 cursor-pointer shadow-sm"
                >
                    <span>← Step 1</span>
                    <span className="text-[10px] opacity-75">(Bienvenida)</span>
                </button>
                <span className="text-zinc-600 font-bold">•</span>
                <div
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FF5A1F] text-white shadow-[0_0_15px_rgba(255,90,31,0.35)]"
                >
                    <span>Step 2</span>
                    <span className="text-[10px] opacity-90">(Elegir Proyecto)</span>
                </div>
                <span className="text-zinc-600 font-bold">•</span>
                <button
                    type="button"
                    onClick={() => onGoToStep && onGoToStep(3)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 cursor-pointer shadow-sm"
                >
                    <span>Step 3 →</span>
                    <span className="text-[10px] opacity-75">(Creando Web)</span>
                </button>
            </div>

            {/* Header */}
            <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Elige el producto con el que crearás tu <span className="text-[#FF5A1F]">primer proyecto</span>
                </h2>
                <p className="max-w-2xl mx-auto leading-relaxed text-zinc-300 font-light text-sm md:text-base opacity-90">
                    Elige el producto digital que mejor encaja con tu experiencia, intereses y
                </p>

                {/* Filter Pills Bar */}
                <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap pt-3 pb-2">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-[#18181b] border-2 border-[#FF5A1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.25)] scale-102'
                                        : 'bg-[#18181b]/80 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                                }`}
                            >
                                <span className="text-base">{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch">
                {projects.slice(0, 3).map((project, index) => {
                    const isSelected = selectedProjectId === project.id;
                    const isRecommended = index === 0;

                    // Descriptions customized to match design / fallback
                    const titles = [
                        "Certificación Expert Microblading",
                        "Curso de Maquillaje Profesional",
                        "Tratamientos Faciales Avanzados"
                    ];

                    const descriptions = [
                        "Domina la técnica de cejas más rentable y triplica tus ingresos.",
                        "Ideal para estilistas y personas interesadas en el arte del color.",
                        "Técnicas de cuidado de la piel y nutrición profunda."
                    ];

                    const commissions = ["50%", "60%", "45%"];
                    const difficulties = ["Principiante", "Principiante", "Intermedio"];

                    const displayTitle = project.name?.toLowerCase().includes("microblading") 
                        ? "Certificación Expert Microblading" 
                        : (project.name?.toLowerCase().includes("manicurista") 
                            ? "Curso de Maquillaje Profesional" 
                            : (titles[index] || project.name));

                    let idealForDesc = descriptions[index] || project.shortDescription || project.description;
                    if (project.name?.toLowerCase().includes("manicurista")) {
                        idealForDesc = "Ideal para estilistas y personas interesadas en el arte del color.";
                    } else if (project.name?.toLowerCase().includes("microblading") || project.name?.toLowerCase().includes("cejas")) {
                        idealForDesc = "Domina la técnica de cejas más rentable y triplica tus ingresos.";
                    }

                    return (
                        <motion.div 
                            key={project.id}
                            whileHover={isLocked ? {} : { y: -6 }}
                            className={`bg-[#0b0b0c] border ${
                                isRecommended 
                                    ? 'border-2 border-[#FF5A1F] shadow-[0_0_30px_rgba(255,90,31,0.2)]' 
                                    : 'border-zinc-800/80 hover:border-zinc-700'
                            } ${isLocked && !isSelected ? 'opacity-40 grayscale' : 'opacity-100'} rounded-3xl overflow-hidden group cursor-pointer transition-all flex flex-col h-full relative w-full`}
                            onClick={() => !isLocked && setConfirmingProject(project)}
                        >
                            {/* Recommended Header Bar */}
                            {isRecommended && (
                                <div className="py-2 bg-[#FF5A1F] text-center w-full">
                                    <span className="text-[10px] md:text-xs font-black text-white tracking-[0.1em] uppercase flex items-center justify-center gap-1">
                                        ★ RECOMENDADO PARA COMENZAR
                                    </span>
                                </div>
                            )}

                            {/* Card Content Padding */}
                            <div className="p-4 md:p-5 flex flex-col flex-grow space-y-4 justify-between">
                                {/* Image Container with floating Category badge */}
                                <div className="h-44 md:h-48 bg-zinc-900 relative overflow-hidden rounded-2xl shrink-0">
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    
                                    {/* Floating category Badge */}
                                    <div className="absolute bottom-3 left-3 z-10">
                                        <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] md:text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-white/10">
                                            <span>💄</span> Categoría: {activeCategory}
                                        </span>
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <div className="space-y-2 text-left flex-grow">
                                    <h3 className={`text-lg md:text-xl font-extrabold leading-snug tracking-tight ${isSelected ? 'text-[#FF5A1F]' : 'text-white'} group-hover:text-[#FF5A1F] transition-colors line-clamp-2`}>
                                        {displayTitle}
                                    </h3>

                                    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light line-clamp-3">
                                        {idealForDesc}
                                    </p>
                                </div>

                                {/* Stats & Action Button */}
                                <div className="pt-3 border-t border-zinc-800/60 space-y-3 mt-auto">
                                    <div className="text-zinc-400 text-xs font-medium text-center">
                                        Comisión: <span className="text-white font-bold">{commissions[index]}</span> - Dificultad: <span className="text-white font-bold">{difficulties[index]}</span>
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLocked) setConfirmingProject(project);
                                        }}
                                        className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-extrabold text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer"
                                    >
                                        ELEGIR ESTE PRODUCTO
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer / Add My Product */}
            <div className="flex flex-col items-center justify-center space-y-1 pt-6 text-center">
                <button
                    type="button"
                    onClick={() => setShowCustomProduct(true)}
                    className="text-zinc-300 hover:text-white transition-colors font-extrabold text-xs md:text-sm flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
                >
                    ¿YA TIENES UN PRODUCTO? <span className="underline text-[#FF5A1F]">AÑADIR MI PRODUCTO →</span>
                </button>
                <p className="text-zinc-500 text-xs font-light">
                    O, si ya tienes uno en mente, simplemente añádelo ahora.
                </p>
            </div>

            {/* Confirmation Modal (Image 2 content) */}
            {confirmingProject && (() => {
                const rawCommission = confirmingProject.commissionRate || 58;
                const displayCommission = rawCommission < 1 ? Math.round(rawCommission * 100) : Math.round(rawCommission);
                const price = confirmingProject.price || 200;
                const profit = Math.round((price * displayCommission) / 100);
                const heroImage = confirmingProject.multimedia_json?.heroImages?.[0];
                const categoryLabel = "BELLEZA Y CUIDADO PERSONAL";
                const displayTitle = confirmingProject.name?.toLowerCase().includes("microblading") 
                    ? "Curso Profesional de Microblading de Cejas" 
                    : confirmingProject.name;
                // Helper to extract a clean, short description from the project data
                const getCleanShortDescription = (proj: any) => {
                    let raw = proj?.shortDescription 
                        || proj?.strategy_json?.shortDescription 
                        || proj?.strategy_json?.productDescription 
                        || proj?.strategy_json?.summary;
                    
                    if (!raw && proj?.description) {
                        raw = proj.description;
                    }

                    if (!raw) {
                        return "Transforma tu pasión por la belleza en un negocio de alto valor dominando la técnica con certificación profesional.";
                    }

                    // Strip any HTML tags and collapse whitespace
                    let cleaned = raw
                        .replace(/<[^>]*>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();

                    // If it was a long description with numbered headers (e.g. "1. Introducción..."), trim to first concise sentence
                    if (cleaned.length > 220) {
                        const firstSentenceMatch = cleaned.match(/^([^.!?]{40,180}[.!?])/);
                        if (firstSentenceMatch && firstSentenceMatch[1]) {
                            cleaned = firstSentenceMatch[1].trim();
                        } else {
                            cleaned = cleaned.substring(0, 180).trim() + "...";
                        }
                    }

                    return cleaned;
                };

                const displayDescription = getCleanShortDescription(confirmingProject);

                return (
                    <div 
                        onClick={() => setConfirmingProject(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 z-50 overflow-y-auto animate-fade-in font-sans cursor-pointer"
                    >
                        <div 
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0b0b0c] border border-zinc-800/90 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.95)] relative text-left my-auto space-y-6 cursor-default"
                        >
                            {/* Close X Button */}
                            <button
                                type="button"
                                onClick={() => setConfirmingProject(null)}
                                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-700/60 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
                                title="Cerrar modal"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header Text */}
                            <div className="text-center space-y-1">
                                <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                    ¿Estás seguro de elegir este producto digital?
                                </h2>
                                <p className="text-xs md:text-sm text-zinc-400 font-light">
                                    Revisa el producto antes de crear tu estrategia
                                </p>
                            </div>

                            {/* Inner Box Container */}
                            <div className="bg-[#111113] border border-zinc-800/80 rounded-2xl p-5 md:p-7 space-y-6">
                                {/* Category Badge & Title */}
                                <div className="space-y-2">
                                    <span className="px-3 py-1 bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] text-[10px] md:text-xs font-black uppercase tracking-wider rounded-lg inline-block">
                                        {categoryLabel}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
                                        {displayTitle}
                                    </h3>
                                    <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed">
                                        {displayDescription}
                                    </p>
                                </div>

                                {/* 2-Column Grid: Left Image, Right Metric Boxes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    {/* Left Column: Image with Play Overlay */}
                                    <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 aspect-video md:aspect-[4/3] flex items-center justify-center group shadow-md">
                                        {heroImage ? (
                                            <img 
                                                src={heroImage} 
                                                alt={confirmingProject.name} 
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#FF5A1F]/10 flex items-center justify-center">
                                                <Package className="w-12 h-12 text-[#FF5A1F] opacity-40" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,90,31,0.6)] transform group-hover:scale-110 transition-transform cursor-pointer">
                                                <Play className="w-7 h-7 fill-white ml-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: 3 Detail Metric Boxes */}
                                    <div className="space-y-3">
                                        {/* Box 1: Precio */}
                                        <div className="bg-[#18181b]/90 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                                                <Tag className="w-5 h-5 text-[#FF5A1F]" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-wider block">
                                                    PRECIO DEL PRODUCTO
                                                </span>
                                                <span className="text-lg md:text-xl font-extrabold text-white">
                                                    USD {price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Box 2: Comisión */}
                                        <div className="bg-[#18181b]/90 border border-blue-900/40 rounded-2xl p-4 flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                                <Percent className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-wider block">
                                                    COMISIÓN QUE OBTENDRÁS
                                                </span>
                                                <span className="text-lg md:text-xl font-extrabold text-white">
                                                    {displayCommission} %
                                                </span>
                                            </div>
                                        </div>

                                        {/* Box 3: Ganancia */}
                                        <div className="bg-[#18181b]/90 border border-emerald-900/40 rounded-2xl p-4 flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-wider block">
                                                    TU GANANCIA POR VENTA
                                                </span>
                                                <span className="text-lg md:text-xl font-extrabold text-white">
                                                    USD {profit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const p = confirmingProject;
                                        setConfirmingProject(null);
                                        onNext(p);
                                    }}
                                    className="w-full py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-[0_10px_30px_-5px_rgba(255,90,31,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                                >
                                    <span>ELEGIR ESTE PRODUCTO Y CREAR MI ESTRATEGIA</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setConfirmingProject(null)}
                                    className="w-full py-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs md:text-sm uppercase tracking-wider rounded-2xl border border-zinc-800 transition-all cursor-pointer text-center"
                                >
                                    Elegir otro producto
                                </button>
                            </div>

                        </div>
                    </div>
                );
            })()}

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
export const UnlockProtocolStep: React.FC<StepProps & { project: any, isStrategyGenerated?: boolean, onBackToSelection?: () => void, onGoToStep?: (step: number) => void }> = ({ project, onNext, isStrategyGenerated, onBackToSelection, onGoToStep }) => {
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
        idealText = "Transforma tu pasión por la belleza en un negocio de alto valor dominando la técnica de microblading hiperrealista desde cero. Logra independencia financiera diseñando miradas perfectas con certificación profesional.";
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
            className="space-y-4 font-sans max-w-5xl mx-auto px-4 md:px-0"
        >
            {/* Step Navigation Pill Bar */}
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                <button
                    type="button"
                    onClick={() => onGoToStep && onGoToStep(1)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 cursor-pointer shadow-sm"
                >
                    <span>← Step 1</span>
                    <span className="text-[10px] opacity-75">(Bienvenida)</span>
                </button>
                <span className="text-zinc-600 font-bold">•</span>
                <button
                    type="button"
                    onClick={() => onGoToStep && onGoToStep(2)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 cursor-pointer shadow-sm"
                >
                    <span>← Step 2</span>
                    <span className="text-[10px] opacity-75">(Elegir Proyecto)</span>
                </button>
                <span className="text-zinc-600 font-bold">•</span>
                <div
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FF5A1F] text-white shadow-[0_0_15px_rgba(255,90,31,0.35)]"
                >
                    <span>Step 3</span>
                    <span className="text-[10px] opacity-90">(Revisar Producto)</span>
                </div>
            </div>

            {/* Header / Title Area compact */}
            <div className="text-center space-y-1">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    Revisa el producto antes de crear tu estrategia
                </h2>
            </div>

            {/* Main Rounded Component Container */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-5 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* Left Column - Badge, Title, Description, Video */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* 1. Niche/Category badge */}
                        <div>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 ${isCejasOrMicroblading ? 'bg-[#200A03] border-[#FF5A1F] text-[#FF5A1F]' : 'bg-[#FF5A1F]/10 border-[#FF5A1F]/20 text-[#FF5A1F]'} border text-[10px] md:text-xs font-black uppercase tracking-wider rounded-lg`}>
                                {uppercaseNiche}
                            </span>
                        </div>

                        {/* 2. Product Title */}
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
                            {displayTitle}
                        </h3>

                        {/* 3. Product Description */}
                        <p className="text-zinc-300 font-light text-sm md:text-base leading-relaxed">
                            {idealText}
                        </p>

                        {/* 4. Video directly below description */}
                        <div className="relative group w-full aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center shadow-lg mt-2">
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
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/80 to-neutral-955/95" />
                                    
                                    <div className="relative z-10 w-1/2 flex flex-col items-center text-center space-y-1.5 justify-center h-full pt-4">
                                        <div className="text-[#DFB56C] font-serif text-3xl font-light tracking-widest leading-none">
                                            M
                                        </div>
                                        <div className="w-6 h-[1px] bg-[#DFB56C]/30" />
                                        <div className="text-white font-semibold text-[13px] md:text-[15px] tracking-[0.2em] uppercase leading-snug">
                                            Microblading
                                            <span className="block text-[11px] md:text-[12px] tracking-[0.3em] font-light text-zinc-100">de Cejas</span>
                                        </div>
                                        <div className="text-[#DFB56C]/80 font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase font-bold pt-1">
                                            Formación Profesional
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                                <div className="w-14 h-14 bg-[#FF5A1F] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform relative cursor-pointer">
                                    <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                                    <div className="absolute inset-0 bg-[#FF5A1F] rounded-full animate-ping opacity-25"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Pricing cards & Actions */}
                    <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full pt-2 lg:pt-0">
                        {/* Metrics Cards */}
                        <div className="space-y-3.5">
                            {/* Price Card */}
                            <div className="bg-gradient-to-r from-[#FF5A1F]/15 via-[#FF5A1F]/5 to-transparent border border-[#FF5A1F]/40 rounded-xl p-4 flex items-center gap-4 hover:from-[#FF5A1F]/20 hover:border-[#FF5A1F]/60 transition-all duration-300 group/item">
                                <div className="w-11 h-11 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                                    <Tag className="w-5 h-5 shrink-0" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] font-bold text-[#FF5A1F] uppercase tracking-wider leading-none font-sans">Precio del producto</span>
                                    <span className="text-[#FF5A1F] text-xl font-black tracking-tight mt-1 font-sans">
                                        USD {project.fullPrice || '200'}
                                    </span>
                                </div>
                            </div>

                            {/* Commission Card */}
                            <div className="bg-gradient-to-r from-blue-600/15 via-blue-950/5 to-transparent border border-blue-500/40 rounded-xl p-4 flex items-center gap-4 hover:from-blue-500/20 hover:border-blue-500/60 transition-all duration-300 group/item">
                                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                                    <Percent className="w-5 h-5 shrink-0" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider leading-none font-sans">Comisión que obtendrás</span>
                                    <span className="text-blue-400 text-xl font-black tracking-tight mt-1 font-sans">
                                        {displayCommission} %
                                    </span>
                                </div>
                            </div>

                            {/* Profit Card */}
                            <div className="bg-gradient-to-r from-emerald-600/15 via-emerald-950/5 to-transparent border border-emerald-500/40 rounded-xl p-4 flex items-center gap-4 hover:from-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300 group/item">
                                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                    <TrendingUp className="w-5 h-5 shrink-0" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider leading-none font-sans">Tu ganancia por venta</span>
                                    <span className="text-emerald-400 text-xl font-black tracking-tight mt-1 font-sans">
                                        USD {Math.round(parseFloat(profitValue))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                            {/* Choose product button */}
                            <button 
                                type="button"
                                onClick={() => !isStrategyGenerated && onNext()}
                                disabled={isStrategyGenerated}
                                className={`w-full py-4 px-6 ${isStrategyGenerated ? 'bg-emerald-600' : 'bg-[#FF5A1F] hover:bg-[#D94A1E]'} text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer`}
                            >
                                <span>{isStrategyGenerated ? 'Estrategia Generada' : 'Elegir este producto y crear mi estrategia'}</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Back selection button */}
                            {onBackToSelection && (
                                <button 
                                    type="button"
                                    onClick={onBackToSelection}
                                    className="w-full py-3 px-4 bg-transparent hover:bg-white/[0.04] text-zinc-300 hover:text-white border border-white/20 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>Volver a los otros productos</span>
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
    onGoToStep?: (step: number) => void;
}> = ({ progress, status, secondsElapsed = 0, message, project, onGoToStep }) => {
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

    const getCurrentTask = () => {
        if (progress < 33) {
            return {
                title: isWeb 
                    ? "Diseñando la estructura web" 
                    : isVideo 
                    ? "Estructurando contenidos de video" 
                    : "Analizando el producto",
                description: isWeb 
                    ? "Generando bloques, secciones y distribución visual persuasiva." 
                    : isVideo 
                    ? "Definiendo ganchos, guiones y estructura para los reels." 
                    : "Identificando su propuesta, público y principales beneficios."
            };
        }
        if (progress < 66) {
            return {
                title: isWeb 
                    ? "Redactando textos persuasivos" 
                    : isVideo 
                    ? "Generando guiones de atracción" 
                    : "Preparando la audiencia",
                description: isWeb 
                    ? "Escribiendo títulos profesionales y llamados a la acción de alta conversión." 
                    : isVideo 
                    ? "Redactando llamadas a la acción y textos de alto impacto." 
                    : "Organizando los perfiles de cliente que podrás revisar."
            };
        }
        return {
            title: isWeb 
                ? "Publicando en la nube segura" 
                : isVideo 
                ? "Finalizando la producción" 
                : "Construyendo la estrategia inicial",
            description: isWeb 
                ? "Desplegando tu página web optimizada para capturar clientes interesados." 
                : isVideo 
                ? "Optimizando y organizando todo el material listo para tu proyecto." 
                : "Preparando dolores, deseos y posibles ángulos de venta."
        };
    };

    const currentTask = getCurrentTask();
    const imageUrl = project?.multimedia_json?.heroImages?.[0] || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2670&auto=format&fit=cover';
    const productName = project?.productName || project?.name || 'Curso Profesional de Microblading de Cejas';

    return (
        <div className="flex flex-col items-center justify-center px-6 space-y-8 text-center max-w-xl mx-auto py-10 font-sans">
            {onGoToStep && (
                <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => onGoToStep(1)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 cursor-pointer shadow-sm"
                    >
                        <span>← Step 1</span>
                        <span className="text-[10px] opacity-75">(Bienvenida)</span>
                    </button>
                    <span className="text-zinc-600 font-bold">•</span>
                    <button
                        type="button"
                        onClick={() => onGoToStep(2)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 cursor-pointer shadow-sm"
                    >
                        <span>← Step 2</span>
                        <span className="text-[10px] opacity-75">(Elegir Proyecto)</span>
                    </button>
                    <span className="text-zinc-600 font-bold">•</span>
                    <div
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FF5A1F] text-white shadow-[0_0_15px_rgba(255,90,31,0.35)]"
                    >
                        <span>Step 3</span>
                        <span className="text-[10px] opacity-90">(Creando Web)</span>
                    </div>
                </div>
            )}

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
                <p className="text-zinc-300 text-base md:text-lg font-normal max-w-lg mx-auto leading-relaxed">
                    {displaySubtitle}
                </p>
            </div>

            {/* 3. Selected Product Card */}
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left max-w-lg mx-auto shadow-xl">
                <div className="w-20 md:w-24 aspect-video rounded-lg overflow-hidden relative shrink-0 bg-zinc-900 border border-white/10 flex items-center justify-center">
                    <img referrerPolicy="no-referrer" src={imageUrl} alt={productName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-8 h-8 rounded-full bg-[#FF5A1F] flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#FF5A1F] uppercase tracking-[0.15em]">PRODUCTO SELECCIONADO</span>
                    <h4 className="text-white font-extrabold text-base md:text-lg leading-snug mt-1 line-clamp-2">{productName}</h4>
                </div>
            </div>

            {/* 4. Componente Dinámico de Progreso y Tarea Actual */}
            <div className="w-full bg-[#0d0d0e]/90 border border-zinc-800/80 rounded-2xl p-6 space-y-4 max-w-lg mx-auto text-left shadow-2xl backdrop-blur-md font-sans">
                {/* Cabecera: Título de la acción actual + Porcentaje al lado */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full border border-[#FF5A1F] bg-[#FF5A1F]/10 flex items-center justify-center shrink-0 relative">
                            <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-[#FF5A1F] animate-spin"></div>
                            <div className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping"></div>
                        </div>
                        <span className="text-base sm:text-lg font-extrabold text-white truncate tracking-tight">
                            {currentTask.title}
                        </span>
                    </div>
                    <span className="text-lg sm:text-xl font-black text-[#FF5A1F] shrink-0 font-mono">
                        {Math.round(progress)}%
                    </span>
                </div>

                {/* Barra de Progreso Dinámica */}
                <div className="w-full bg-zinc-900 h-4 rounded-full overflow-hidden border border-white/10 p-0.5 relative shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(progress, 4)}%` }}
                        className="h-full bg-gradient-to-r from-[#FF5A1F] via-[#FF8C00] to-[#FFCD42] rounded-full relative shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[loading-shine_1.5s_infinite]"></div>
                    </motion.div>
                </div>

                {/* Texto explicativo de lo que hace en este momento */}
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                    {currentTask.description}
                </p>
            </div>

            {/* 5. Warning badge: Do not close page */}
            <div className="flex items-center justify-center pt-2 font-sans max-w-lg mx-auto">
                <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.25)] backdrop-blur-md">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                    <span className="text-xs sm:text-sm font-extrabold tracking-wide text-amber-200">
                        Por favor, no cierres esta página. Estamos generando tu proyecto.
                    </span>
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
            className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto px-4 font-sans"
        >
            {/* Títulos Principales */}
            <div className="space-y-2 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Tu estrategia inicial está lista
                </h2>
            </div>

            {/* Tarjeta Translúcida de Progreso con Grid 2x2 */}
            <div className="w-full max-w-3xl mx-auto bg-[#0b0b0c]/80 border border-white/5 rounded-3xl p-5 md:p-6 space-y-4 text-left shadow-2xl">
                <p className="text-zinc-300 font-light text-xs md:text-sm leading-relaxed px-1 block">
                    Hemos preparado la base estratégica para promocionar el{" "}
                    <span className="text-[#FF5A1F] font-bold">
                        {project?.name || "Certificación Expert Microblading"}
                    </span>.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Columna Izquierda - Item 1 */}
                    <div className="flex items-start gap-3 bg-[#141416]/60 border border-white/5 p-4 rounded-2xl h-full">
                        <div className="w-10 h-10 bg-orange-500/10 border border-[#FF5A1F]/20 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
                            <Package className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-xs md:text-sm font-bold tracking-tight">Producto seleccionado</p>
                            <p className="text-zinc-400 font-light text-xs leading-relaxed">{project?.name || "Curso Profesional de Microblading de Cejas"}</p>
                        </div>
                    </div>

                    {/* Columna Derecha - Item 2 */}
                    <div className="flex items-start gap-3 bg-[#141416]/60 border border-white/5 p-4 rounded-2xl h-full">
                        <div className="w-10 h-10 bg-orange-500/10 border border-[#FF5A1F]/20 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
                            <Users className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-xs md:text-sm font-bold tracking-tight">Público y necesidades</p>
                            <p className="text-zinc-400 font-light text-xs leading-relaxed">Audiencia, dolores, deseos y objeciones relacionados con el producto.</p>
                        </div>
                    </div>

                    {/* Columna Izquierda - Item 3 */}
                    <div className="flex items-start gap-3 bg-[#141416]/60 border border-white/5 p-4 rounded-2xl h-full">
                        <div className="w-10 h-10 bg-orange-500/10 border border-[#FF5A1F]/20 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
                            <Target className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-xs md:text-sm font-bold tracking-tight">Estrategia de comunicación</p>
                            <p className="text-zinc-400 font-light text-xs leading-relaxed">Ángulos de venta y mensajes iniciales para presentar la oportunidad.</p>
                        </div>
                    </div>

                    {/* Columna Derecha - Item 4 */}
                    <div className="flex items-start gap-3 bg-orange-500/[0.03] border border-[#FF5A1F]/30 p-4 rounded-2xl h-full shadow-[0_4px_20px_rgba(255,90,31,0.05)]">
                        <div className="w-10 h-10 bg-orange-500/15 border border-[#FF5A1F]/30 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
                            <Sparkles className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-xs md:text-sm font-bold tracking-tight">Siguiente paso</p>
                            <p className="text-zinc-300 font-light text-xs leading-relaxed">
                                Crear tu página web de captura de clientes con textos profesionales para atraer compradores.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón de Acción Principal (Naranja Vibrante Centrado) */}
            <div className="flex justify-center pt-2">
                <button 
                    onClick={() => onNext()}
                    className="py-3.5 px-8 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-2xl font-black text-sm md:text-base tracking-wide transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                >
                    <Rocket className="w-5 h-5 shrink-0" />
                    <span>Crear mi página web</span>
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

export const LandingSuccessStep: React.FC<LandingSuccessProps> = ({ onNext, project }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto p-4 md:p-8 font-sans text-center space-y-8"
        >
            {/* Icono de éxito con resplandor */}
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto relative shadow-2xl shadow-emerald-500/10">
                    <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    Tu página de <span className="text-emerald-400">captura de clientes</span> ha sido generada
                </h2>
                <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
                    Tu página de captura fue creada correctamente para tu proyecto <span className="text-white font-bold">{project?.name || "activo"}</span>. Podrás editarla, personalizarla y modificarla directamente desde tu sección de <span className="text-[#FF5A1F] font-semibold">Mis Proyectos</span>.
                </p>
            </div>

            <div className="bg-[#0b0b0c]/80 border border-zinc-800/60 p-6 rounded-2xl max-w-xl mx-auto space-y-3 shadow-xl">
                <p className="text-white text-sm md:text-base font-medium leading-relaxed">
                    Ahora prepararemos 3 videos de menos de un minuto (Reels) que utilizarás para atraer visitas y llevarlas hacia tu página.
                </p>
            </div>

            <div className="pt-2 max-w-md mx-auto space-y-3">
                <button 
                    onClick={() => onNext()}
                    className="w-full py-4 md:py-5 px-8 bg-[#FF5A1F] hover:bg-[#E54E15] text-white rounded-2xl font-extrabold text-base md:text-lg uppercase tracking-wider transition-all shadow-xl shadow-[#FF5A1F]/20 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                >
                    <span>CONTINUAR: PREPARAR MIS 3 REELS</span>
                    <Play className="w-5 h-5 fill-current shrink-0" />
                </button>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Podrás editar tu página más adelante desde la sección del proyecto.</span>
                </div>
            </div>
        </motion.div>
    );
};

// 6. REVELACIÓN DE HOOKS
export const HooksRevealStep: React.FC<StepProps & { hooks: any[], isUnlocked?: boolean, projectId?: string, project?: any, hooksRef?: React.RefObject<HTMLDivElement | null>, onOpenHookDetails?: (hook: any) => void }> = ({ hooks, onNext, isUnlocked, projectId, project, userData, hooksRef, onOpenHookDetails }) => {
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
        { hookText: "¿Sabías que una técnica de uñas rusas puede convertirse en una nueva habilidad profesional rentable?" },
        { hookText: "El error secreto que muchas manicuristas principiantes cometen al aplicar gel." },
        { hookText: "Lo que debes conocer antes de comenzar una formación premium en uñas." }
    ] : [
        { hookText: "¿Sabías que una técnica de cejas puede convertirse en una nueva habilidad profesional?" },
        { hookText: "El error que muchas principiantes cometen al aprender microblading." },
        { hookText: "Lo que debes conocer antes de comenzar una formación en microblading." }
    ];

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
            "salones de alta gama", "cobrar 5 veces más", "mito", "fórmulas tradicionales",
            "nueva habilidad profesional?", "nueva habilidad profesional rentable?", "formación en microblading.", "formación premium en uñas.", "error secreto", "manicuristas principiantes"
        ];
        
        const regex = new RegExp(`(${keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi");
        const parts = text.split(regex);
        
        return parts.map((part, index) => {
            const isMatch = keywords.some(kw => kw.toLowerCase() === part.toLowerCase());
            return isMatch ? (
                <span key={index} className="text-[#FF5A1F] font-extrabold">{part}</span>
            ) : (
                <span key={index}>{part}</span>
            );
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1400px] mx-auto p-2 md:p-6 lg:p-8 font-sans"
            style={{ paddingTop: 0 }}
        >
            {isUnlocked ? (
                /* --- ESTADO LISTOS / ACTIVO (MENSAJE DE ÉXITO SIMPLIFICADO) --- */
                <div className="w-full max-w-2xl mx-auto p-4 md:p-8 font-sans text-center space-y-8 my-auto">
                    {/* Icono de éxito con resplandor */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#FF5A1F]/20 blur-3xl rounded-full animate-pulse"></div>
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FF5A1F]/10 border-2 border-[#FF5A1F]/30 rounded-3xl flex items-center justify-center mx-auto relative shadow-2xl shadow-[#FF5A1F]/20">
                            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-[#FF5A1F]" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            Tus 3 reels de atracción <span className="text-[#FF5A1F]">están listos</span>
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
                            Tus 3 reels de atracción fueron generados con éxito para tu proyecto <span className="text-white font-bold">{project?.name || "activo"}</span>. Podrás ver los guiones, editarlos y descargarlos directamente desde tu sección del proyecto.
                        </p>
                    </div>

                    <div className="bg-[#0b0b0c]/80 border border-zinc-800/60 p-6 rounded-2xl max-w-xl mx-auto space-y-3 shadow-xl">
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Tu sistema inicial está listo</h3>
                        <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
                            Tus 3 reels, tu página de captación y los textos para publicar ya están guardados dentro de tu proyecto.
                        </p>
                    </div>

                    <div className="pt-2 max-w-md mx-auto space-y-3">
                        <button 
                            onClick={() => onNext()}
                            className="w-full py-4 md:py-5 px-8 bg-[#FF5A1F] hover:bg-[#E54E15] text-white rounded-2xl font-extrabold text-base md:text-lg uppercase tracking-wider transition-all shadow-xl shadow-[#FF5A1F]/20 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                        >
                            <Rocket className="w-5 h-5 text-white shrink-0" />
                            <span>FINALIZAR Y VER MI PROYECTO</span>
                        </button>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Podrás descargar, revisar y gestionar todo desde el panel de tu proyecto.</span>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- ESTADO PENDIENTE / PREVIEW (ISUNLOCKED === FALSE - VISTA RESUMIDA) --- */
                <div className="max-w-3xl mx-auto space-y-6 text-center font-sans">
                    {/* Header */}
                    <div className="space-y-2 max-w-2xl mx-auto">
                        <span className="text-[#FF5A1F] text-xs font-bold uppercase tracking-wider">
                            Paso 3 de 4 · Reels de atracción
                        </span>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mt-1">
                            Preparemos tus <span className="text-[#FF5A1F]">3 reels</span> de atracción
                        </h1>
                        <p className="text-zinc-300 font-light text-sm md:text-base leading-relaxed">
                            Utilizaremos la estrategia de tu proyecto y tu página de captación para preparar contenido optimizado que dirija personas interesadas hacia tu clase gratuita.
                        </p>
                    </div>

                    {/* Tarjeta Principal Contenedora */}
                    <div className="bg-[#0b0b0c]/85 border border-zinc-800/80 rounded-3xl p-5 md:p-8 space-y-6 text-left shadow-2xl">
                        {/* Grid de Configuración & Beneficios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Columna 1: Configuración recomendada */}
                            <div className="space-y-4">
                                <h3 className="text-[#FF5A1F] text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-[#FF5A1F] rounded-full"></span>
                                    Configuración recomendada
                                </h3>
                                <div className="divide-y divide-zinc-800/50 bg-[#141416]/60 border border-white/5 rounded-2xl p-4">
                                    <div className="flex items-center justify-between py-2.5 gap-3">
                                        <div className="flex items-center gap-2.5 text-zinc-400 text-xs md:text-sm">
                                            <Briefcase className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                                            <span>Producto:</span>
                                        </div>
                                        <span className="text-white text-xs md:text-sm font-semibold truncate text-right max-w-[180px]">
                                            {project?.name || (isManicurista ? "Curso de Manicurista" : "Curso de Microblading")}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5 gap-3">
                                        <div className="flex items-center gap-2.5 text-zinc-400 text-xs md:text-sm">
                                            <Target className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                                            <span>Objetivo:</span>
                                        </div>
                                        <span className="text-white text-xs md:text-sm font-semibold text-right">
                                            Llevar visitas a la clase
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5 gap-3">
                                        <div className="flex items-center gap-2.5 text-zinc-400 text-xs md:text-sm">
                                            <Smartphone className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                                            <span>Canales:</span>
                                        </div>
                                        <span className="text-white text-xs md:text-sm font-semibold text-right">
                                            Instagram Reels y TikTok
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5 gap-3">
                                        <div className="flex items-center gap-2.5 text-zinc-400 text-xs md:text-sm">
                                            <Film className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                                            <span>Formato:</span>
                                        </div>
                                        <span className="text-white text-xs md:text-sm font-semibold text-right">
                                            Sin mostrar el rostro
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Columna 2: Lo que obtendrás */}
                            <div className="space-y-4">
                                <h3 className="text-[#FF5A1F] text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                                    Lo que obtendrás
                                </h3>
                                <div className="space-y-3 bg-[#141416]/60 border border-white/5 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-white text-xs md:text-sm font-bold">3 Guiones Estratégicos</p>
                                            <p className="text-zinc-400 text-xs">Estructurados para captar atención en los primeros 3 segundos.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-white text-xs md:text-sm font-bold">Textos y CTAs Listos</p>
                                            <p className="text-zinc-400 text-xs">Acompañamientos optimizados para copiar y publicar.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-white text-xs md:text-sm font-bold">Edición y Personalización</p>
                                            <p className="text-zinc-400 text-xs">Podrás verlos, editarlos y gestionarlos en tu panel cuando estén creados.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Faja de Plan */}
                        <div className="bg-orange-950/20 border border-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 justify-center">
                            <span>🎁 Plan gratuito · 3 reels disponibles</span>
                        </div>
                    </div>

                    {/* Botón de Acción Principal Centrado */}
                    <div className="flex flex-col items-center gap-2 pt-1 max-w-md mx-auto">
                        <button 
                            onClick={() => onNext()}
                            className="w-full py-4 px-8 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-2xl font-black text-sm md:text-base uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4 shrink-0 fill-white" />
                            <span>PREPARAR MIS 3 REELS</span>
                        </button>
                        <p className="text-zinc-400 text-xs">
                            Una vez generados, podrás verlos y editarlos directamente desde tu proyecto.
                        </p>
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
