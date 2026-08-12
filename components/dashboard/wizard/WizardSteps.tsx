import React, { useState, useEffect } from 'react';
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
            className="text-center space-y-8 max-w-3xl mx-auto px-4 font-sans py-8"
        >
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
                    ¡A continuación te ayudaré a crear tu primer proyecto digital!
                </h2>

                {/* Mensaje de Instrucción */}
                <p 
                    className="max-w-2xl mx-auto leading-relaxed text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up pt-2" 
                    style={{ fontSize: "1.2em", lineHeight: "1.4em", paddingTop: "1.5em" }}
                >
                    Para hacerlo muy fácil, hemos seleccionado varios productos digitales que podrás elegir y usar. <br /><br />Solo tienes que elegir el que mejor se adapte a ti y nuestra inteligencia artificial creará todo lo que necesitas para convertirlo en tu primer negocio digital.
                </p>
            </div>

            {/* Botón de acción */}
            <div className="pt-4">
                <button 
                    onClick={() => !disabled && onNext()}
                    disabled={disabled}
                    className={`group flex items-center gap-3 px-8 py-4 ${disabled ? 'bg-zinc-800 cursor-not-allowed opacity-50 text-zinc-500' : 'bg-[#FF5A1F] hover:bg-[#D94A1E] shadow-[0_12px_30px_-5px_rgba(255,90,31,0.4)] transform hover:-translate-y-0.5 active:scale-98'} text-white rounded-2xl font-black text-base md:text-lg tracking-wide transition-all mx-auto cursor-pointer`}
                >
                    {disabled ? 'Configuración en proceso' : 'Elegir mi Producto Digital'}
                    {!disabled && <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />}
                </button>
            </div>
        </motion.div>
    );
};

// 2. SELECCIÓN DE PROYECTO
export const ProjectSelectionStep: React.FC<StepProps & { projects: any[], loading: boolean, selectedProjectId?: string, isLocked?: boolean }> = ({ projects, loading, onNext, selectedProjectId, isLocked, onGoToStep }) => {
    const [confirmingProject, setConfirmingProject] = React.useState<any | null>(null);
    const [activeCategory, setActiveCategory] = React.useState('Belleza');

    const categories = [
        { id: 'Belleza', label: 'Belleza', icon: '💄' },
        { id: 'Manualidades', label: 'Manualidades', icon: '🧶' },
        { id: 'Mascotas', label: 'Mascotas', icon: '🐾' },
        { id: 'Negocios', label: 'Negocios', icon: '💼' },
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
            style={{ opacity: 1, paddingTop: "4em" }}
            className="space-y-6 font-sans max-w-[1240px] mx-auto px-2 md:px-4 relative py-2"
        >
            {/* Header */}
            <div className="text-center space-y-2.5">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    Selecciona tu <span className="text-[#FF5A1F]">Producto Digital</span>
                </h2>
                <p 
                    className="text-zinc-300 font-normal text-sm sm:text-base max-w-2xl mx-auto"
                    style={{
                        paddingTop: '1em',
                        paddingBottom: '1em',
                        fontSize: '1.16em',
                        lineHeight: '1.5em',
                        color: 'white',
                    }}
                >
                    Elige el Producto Digital que mejor se adapte a ti, nuestro sistema creará un sistema de ventas completo con inteligencia artificial para este producto digital
                </p>

                {/* Glowing Spark Divider */}
                <div className="relative flex justify-center items-center my-3 max-w-xs mx-auto">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-[#FF5A1F] blur-[2px] shadow-[0_0_10px_#FF5A1F]"></div>
                </div>

                {/* Filter Pills Bar */}
                <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap pt-1 pb-1">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-[#121215] border border-[#FF5A1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.25)] scale-102'
                                        : 'bg-[#121215]/80 border border-zinc-800/80 text-zinc-300 hover:text-white hover:border-zinc-700'
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch pt-2">
                {projects.slice(0, 3).map((project, index) => {
                    const isSelected = selectedProjectId === project.id;

                    const titles = [
                        "Certificación Expert Microblading",
                        "Curso de Maquillaje Profesional",
                        "Master en Pisos de Resina Epóxica"
                    ];

                    const descriptions = [
                        "Domina la técnica de cejas y crea un servicio rentable con alta demanda.",
                        "Aprende maquillaje, color y técnica profesional para realzar la belleza en cualquier ocasión.",
                        "Aprende acabados profesionales en pisos de resina y conviértelo en un servicio altamente rentable."
                    ];

                    const displayTitle = project.name?.toLowerCase().includes("microblading") 
                        ? "Certificación Expert Microblading" 
                        : (project.name?.toLowerCase().includes("manicurista") 
                            ? "Curso de Maquillaje Profesional" 
                            : (project.name?.toLowerCase().includes("pisos") || project.name?.toLowerCase().includes("resina")
                                ? "Master en Pisos de Resina Epóxica"
                                : (titles[index] || project.name)));

                    let idealForDesc = descriptions[index] || project.shortDescription || project.description;
                    if (project.name?.toLowerCase().includes("microblading") || project.name?.toLowerCase().includes("cejas")) {
                        idealForDesc = "Domina la técnica de cejas y crea un servicio rentable con alta demanda.";
                    } else if (project.name?.toLowerCase().includes("manicurista") || project.name?.toLowerCase().includes("maquillaje")) {
                        idealForDesc = "Aprende maquillaje, color y técnica profesional para realzar la belleza en cualquier ocasión.";
                    } else if (project.name?.toLowerCase().includes("pisos") || project.name?.toLowerCase().includes("resina")) {
                        idealForDesc = "Aprende acabados profesionales en pisos de resina y conviértelo en un servicio altamente rentable.";
                    }

                    return (
                        <motion.div 
                            key={project.id}
                            whileHover={isLocked ? {} : { y: -6 }}
                            className={`bg-[#0b0b0d] border border-zinc-800/80 hover:border-[#FF5A1F]/60 hover:shadow-[0_0_30px_rgba(255,90,31,0.25)] ${
                                isSelected ? 'border-2 border-[#FF5A1F] shadow-[0_0_30px_rgba(255,90,31,0.25)]' : ''
                            } ${isLocked && !isSelected ? 'opacity-40 grayscale' : 'opacity-100'} rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full relative w-full group cursor-pointer transition-all duration-300 space-y-4`}
                            onClick={() => !isLocked && setConfirmingProject(project)}
                        >
                            {/* Image Container with floating Category badge Top-Left */}
                            <div className="h-44 md:h-48 bg-zinc-900 relative overflow-hidden rounded-2xl shrink-0 border border-zinc-800/50">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                
                                {/* Floating category Badge Top-Left */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-white/10 shadow-sm">
                                        <span>💄</span> Categoría: {activeCategory}
                                    </span>
                                </div>
                            </div>

                            {/* Content Block */}
                            <div className="space-y-2 text-left flex-grow">
                                <h3 className={`text-lg md:text-xl font-extrabold leading-snug tracking-tight ${isSelected ? 'text-[#FF5A1F]' : 'text-white'} group-hover:text-[#FF5A1F] transition-colors line-clamp-2`}>
                                    {displayTitle}
                                </h3>

                                <p 
                                    className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light line-clamp-3"
                                    style={{
                                        fontSize: '1em',
                                        lineHeight: '1.3em',
                                        color: 'white',
                                        paddingTop: '0.4em'
                                    }}
                                >
                                    {idealForDesc}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="pt-2 mt-auto">
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isLocked) setConfirmingProject(project);
                                    }}
                                    className="w-full py-3.5 px-5 bg-gradient-to-r from-[#FF5A1F] to-[#FF4500] hover:from-[#FF4500] hover:to-[#FF5A1F] text-white font-extrabold text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_20px_rgba(255,90,31,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                                >
                                    <span>ELEGIR ESTE PRODUCTO</span>
                                    <ArrowRight className="w-4 h-4 shrink-0" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Features Bar matching Image 2 */}
            <div className="pt-6 border-t border-zinc-800/60 max-w-5xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center text-left">
                    {/* Feature 1 */}
                    <div className="flex items-center gap-3.5 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-xs sm:text-sm" style={{ fontSize: "1em" }}>Productos probados</p>
                            <p className="text-zinc-400 text-[11px] sm:text-xs font-light" style={{ lineHeight: "1em", paddingTop: "0.50em", fontSize: "0.90em" }}>Enfocados en resultados reales</p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-center gap-3.5 px-2 md:border-l md:border-zinc-800/80">
                        <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-xs sm:text-sm">Guía paso a paso</p>
                            <p className="text-zinc-400 text-[11px] sm:text-xs font-light">Aprende con método y claridad</p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-center gap-3.5 px-2 md:border-l md:border-zinc-800/80">
                        <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                            <Rocket className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-xs sm:text-sm">Escala tu negocio</p>
                            <p className="text-zinc-400 text-[11px] sm:text-xs font-light">Convierte tu aprendizaje en ingresos</p>
                        </div>
                    </div>
                </div>
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
                            className="bg-[#0b0b0d] border border-orange-500/20 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-[0_0_60px_rgba(255,90,31,0.15)] relative text-left my-auto space-y-5 cursor-default"
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
                            <div className="text-center space-y-1.5">
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                                    Confirma tu producto digital
                                </h2>
                                <p className="text-zinc-400 text-xs sm:text-sm font-normal">
                                    Revisa y confirma la información del producto digital para crear tu proyecto
                                </p>
                            </div>

                            {/* Inner Box Container */}
                            <div className="bg-[#101012] border border-zinc-800/80 rounded-2xl p-5 md:p-6 space-y-5">
                                {/* Category Badge & Title */}
                                <div className="space-y-2">
                                    <span className="px-3 py-1 bg-orange-950/50 border border-orange-500/40 text-[#FF5A1F] text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-lg inline-block">
                                        {categoryLabel}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug">
                                        {displayTitle}
                                    </h3>
                                </div>

                                {/* 2-Column Grid: Left Image, Right Metric Boxes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
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
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 border-2 border-[#FF5A1F] text-[#FF5A1F] flex items-center justify-center shadow-[0_0_25px_rgba(255,90,31,0.5)] transform group-hover:scale-110 transition-transform cursor-pointer backdrop-blur-sm">
                                                <Play className="w-7 h-7 fill-[#FF5A1F] ml-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: 3 Detail Metric Boxes */}
                                    <div className="space-y-3">
                                        {/* Box 1: Precio de Venta */}
                                        <div className="bg-[#141417] border border-zinc-800/90 rounded-2xl p-3.5 sm:p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                                                <Tag className="w-5 h-5 text-[#FF5A1F]" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                                                    Precio en el que se venderá tu Producto
                                                </span>
                                                <span className="text-base md:text-lg font-black text-white">
                                                    USD {price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Box 2: Tu Comisión */}
                                        <div className="bg-[#141417] border border-zinc-800/90 rounded-2xl p-3.5 sm:p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                                                <Percent className="w-5 h-5 text-[#FF5A1F]" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                                                    % de Comisión por recomendarlo
                                                </span>
                                                <span className="text-base md:text-lg font-black text-white">
                                                    {displayCommission} %
                                                </span>
                                            </div>
                                        </div>

                                        {/* Box 3: Ganancia Estimada (Highlighted with Orange Border) */}
                                        <div className="bg-[#181414] border-2 border-[#FF5A1F] shadow-[0_0_20px_rgba(255,90,31,0.2)] rounded-2xl p-3.5 sm:p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                                                <TrendingUp className="w-5 h-5 text-[#FF5A1F]" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] md:text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                                                    ¿Cuánto ganarás por cada venta?
                                                </span>
                                                <span className="text-lg md:text-xl font-black text-white">
                                                    USD {profit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const p = confirmingProject;
                                        setConfirmingProject(null);
                                        onNext(p);
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] via-[#FF4500] to-[#FF5A1F] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_25px_rgba(255,90,31,0.45)] border border-orange-400/30 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.99]"
                                >
                                    <span>CONFIRMAR Y CREAR MI PROYECTO</span>
                                    <ArrowRight className="w-5 h-5 shrink-0" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setConfirmingProject(null)}
                                    className="w-full py-3.5 bg-[#121215] hover:bg-zinc-800/80 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-2xl border border-zinc-800 transition-all cursor-pointer text-center"
                                >
                                    ELEGIR OTRO PRODUCTO DIGITAL
                                </button>

                                <p className="text-center text-zinc-400 text-xs font-normal tracking-wide pt-1">
                                    Nuestra inteligencia artificial creará todo lo que necesitas para ganar dinero con este producto digital
                                </p>
                            </div>

                        </div>
                    </div>
                );
            })()}
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
            className="space-y-6 font-sans max-w-5xl mx-auto px-4 md:px-0 py-2"
        >
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
export const GeneratingStep: React.FC<{ 
    progress: number; 
    status: string; 
    secondsElapsed?: number; 
    message?: string;
    project?: any;
    onGoToStep?: (step: number) => void;
}> = ({ progress, status, secondsElapsed = 0, message, project, onGoToStep }) => {
    const isWeb = message?.toLowerCase().includes('web') || message?.toLowerCase().includes('página') || status?.toLowerCase().includes('página') || true;
    const isVideo = message?.toLowerCase().includes('video') || message?.toLowerCase().includes('atracción') || status?.toLowerCase().includes('videos');

    const [simulatedProgress, setSimulatedProgress] = useState(6);

    useEffect(() => {
        if (progress >= 100) {
            setSimulatedProgress(100);
            return;
        }

        const interval = setInterval(() => {
            setSimulatedProgress((prev) => {
                if (prev >= 95) return prev;
                const increment = Math.floor(Math.random() * 3) + 2;
                return Math.min(prev + increment, 95);
            });
        }, 450);

        return () => clearInterval(interval);
    }, [progress]);

    const activeProgress = Math.min(100, Math.max(progress, simulatedProgress));

    const webSteps = [
        { title: "Analizando tu estrategia", desc: "Estamos analizando tu nicho y propuesta para estructurar la página ideal." },
        { title: "Construyendo la estructura", desc: "Creando los bloques, secciones y la distribución visual persuasiva de tu sitio." },
        { title: "Configurando formulario y oferta", desc: "Estamos adaptando la estructura, la oferta y el formulario a la estrategia de tu producto." },
        { title: "Preparando tu página", desc: "Desplegando tu sitio web optimizado para que comiences a capturar clientes." }
    ];

    const videoSteps = [
        { title: "Estructurando contenidos de video", desc: "Definiendo ganchos, guiones y la estructura ideal para tus reels." },
        { title: "Generando guiones de atracción viral", desc: "Redactando llamadas a la acción directas y textos de alto impacto." },
        { title: "Optimizando ganchos iniciales", desc: "Estructurando los primeros 3 segundos para maximizar la retención." },
        { title: "Finalizando producción de tus videos", desc: "Optimizando y organizando todo el material listo para tu proyecto." }
    ];

    const projectSteps = [
        { title: "Analizando tu producto", desc: "Identificando su propuesta de valor, público objetivo y principales beneficios." },
        { title: "Definiendo propuesta de valor y beneficios", desc: "Estructurando la promesa principal y los ganchos emocionales del producto." },
        { title: "Identificando dolores y deseos de tu audiencia", desc: "Mapeando las necesidades, frustraciones y motivaciones de tus compradores ideales." },
        { title: "Construyendo tu estrategia inicial", desc: "Finalizando la configuración de tu proyecto y preparando tu panel de control." }
    ];

    const currentStepsList = isVideo ? videoSteps : (isWeb ? webSteps : projectSteps);

    const activeIndex = Math.min(
        currentStepsList.length - 1,
        Math.floor((activeProgress / 100) * currentStepsList.length)
    );

    const currentTask = currentStepsList[activeIndex];

    const imageUrl = project?.multimedia_json?.heroImages?.[0] || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2670&auto=format&fit=cover';
    const productName = project?.productName || project?.name || 'Curso Profesional Certificado de Microblading de Cejas';

    return (
        <div className="flex flex-col items-center justify-center px-4 space-y-6 text-center max-w-lg mx-auto py-4 font-sans">
            {/* 1. Top Sparkles / Magic Wand Icon Box with Glow */}
            <div className="relative mx-auto">
                <div className="absolute inset-0 bg-[#FF5A1F]/25 blur-[50px] rounded-full" />
                
                {/* Floating particles */}
                <div className="absolute -top-1 -left-2 w-1.5 h-1.5 rounded-full bg-[#FF5A1F] opacity-80 animate-ping" />
                <div className="absolute -bottom-1 -right-2 w-1 h-1 rounded-full bg-orange-400 opacity-60" />

                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0c0c0e] border border-[#FF5A1F]/40 flex items-center justify-center shadow-[0_0_40px_rgba(255,90,31,0.25)]">
                    <Wand2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF5A1F]" />
                </div>
            </div>

            {/* 2. Main Title and Subtitle */}
            <div className="space-y-2 text-center max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Estamos <span className="text-[#FF5A1F]">creando tu página de captura</span>
                </h2>
                <p className="text-zinc-400 font-normal text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    Estamos utilizando la estrategia de tu proyecto para construir<br className="hidden sm:inline" /> una página optimizada para convertir visitantes en prospectos.
                </p>
            </div>

            {/* 3. Selected Product Card */}
            <div className="w-full max-w-md mx-auto bg-[#0c0c0e]/90 border border-zinc-800/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3.5 text-left shadow-xl">
                <div className="w-16 sm:w-20 aspect-video rounded-xl overflow-hidden relative shrink-0 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <img referrerPolicy="no-referrer" src={imageUrl} alt={productName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FF5A1F] flex items-center justify-center shadow-lg">
                            <Play className="w-3.5 h-3.5 text-white fill-current translate-x-0.5" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] sm:text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">PRODUCTO SELECCIONADO</span>
                    <h4 className="text-white font-extrabold text-xs sm:text-sm leading-snug mt-0.5 line-clamp-2">{productName}</h4>
                </div>
            </div>

            {/* 4. Progress and Checklist Card */}
            <div className="w-full max-w-md mx-auto bg-[#0c0c0e]/90 border border-zinc-800/80 rounded-2xl p-5 md:p-6 space-y-4 text-left shadow-2xl backdrop-blur-md">
                {/* Header: Rotating sync icon + title + percentage */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5A1F] animate-spin shrink-0" />
                        <span className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight">
                            Creando tu página
                        </span>
                    </div>
                    <span className="text-sm sm:text-base font-extrabold text-[#FF5A1F] shrink-0 font-mono">
                        {Math.round(activeProgress)}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-900 h-2.5 sm:h-3 rounded-full overflow-hidden border border-zinc-800 p-0.5 relative shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(activeProgress, 5)}%` }}
                        className="h-full bg-gradient-to-r from-[#FF5A1F] via-[#FF7A00] to-[#FF8A00] rounded-full relative shadow-[0_0_12px_rgba(255,90,31,0.6)]"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                </div>

                {/* Vertical Steps Checklist */}
                <div className="relative space-y-3 pt-2 pb-1">
                    {/* Connector Line behind */}
                    <div className="absolute left-[9px] top-4 bottom-4 w-[1.5px] bg-zinc-800/80 z-0" />

                    {currentStepsList.map((stepItem, idx) => {
                        const isCompleted = idx < activeIndex;
                        const isActive = idx === activeIndex;

                        return (
                            <div key={idx} className="relative flex items-center gap-3 z-10">
                                {isCompleted ? (
                                    <div className="w-5 h-5 rounded-full bg-[#FF5A1F] text-black flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(255,90,31,0.5)]">
                                        <Check className="w-3.5 h-3.5 stroke-[3] text-black" />
                                    </div>
                                ) : isActive ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-[#FF5A1F] bg-[#0c0c0e] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,90,31,0.6)]">
                                        <div className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-zinc-700/80 bg-[#0c0c0e] shrink-0" />
                                )}

                                <span className={`text-xs sm:text-sm ${
                                    isActive 
                                        ? "text-white font-bold" 
                                        : isCompleted 
                                            ? "text-zinc-300 font-medium" 
                                            : "text-zinc-500 font-normal"
                                }`}>
                                    {stepItem.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-800/80 pt-1" />

                {/* Bottom step description */}
                <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                    {currentTask.desc}
                </p>
            </div>

            {/* 5. Bottom Warning Pill */}
            <div className="w-full max-w-md mx-auto bg-[#0c0c0e]/80 border border-zinc-800/80 rounded-2xl py-3 px-4 sm:px-5 flex items-center justify-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-normal text-center shadow-lg">
                <div className="w-5 h-5 rounded-full border border-[#FF5A1F]/80 text-[#FF5A1F] flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                    i
                </div>
                <span>
                    No cierres esta ventana mientras terminamos de generar tu página.
                </span>
            </div>
        </div>
    );
};

export const GenerationStep = GeneratingStep;

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
export const StrategyReadyStep: React.FC<StepProps & { project?: any }> = ({ onNext }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center space-y-7 max-w-6xl mx-auto px-4 py-8 font-sans relative"
        >
            {/* Ambient background glowing curve */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="w-[850px] h-[850px] rounded-full border border-orange-500/15 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent blur-3xl opacity-60"></div>
            </div>

            {/* Checkmark Icon with Glowing Box */}
            <div className="relative pt-2">
                <div className="absolute inset-0 bg-[#FF5A1F]/25 blur-[60px] rounded-full"></div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#0b0b0e] border border-[#FF5A1F]/40 flex items-center justify-center shadow-[0_0_50px_rgba(255,90,31,0.3)] mx-auto">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#FF5A1F] flex items-center justify-center text-[#FF5A1F]">
                        <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
                    </div>
                </div>
            </div>

            {/* Main Title & Description */}
            <div className="space-y-4 max-w-5xl mx-auto w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:whitespace-nowrap">
                    Tu proyecto está listo para <span className="text-[#FF5A1F]">empezar</span>
                </h2>
                <div className="space-y-1 text-zinc-300 font-normal text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    <p>Ya hemos estructurado la base inicial de tu estrategia.</p>
                    <p>Ahora vamos a crear la página que utilizarás para captar tus primeros prospectos.</p>
                </div>
            </div>

            {/* Action Button & Note */}
            <div className="flex flex-col items-center gap-2.5 pt-2 w-full max-w-md mx-auto">
                <button 
                    type="button"
                    onClick={() => onNext()}
                    className="w-full py-4 px-8 bg-gradient-to-r from-[#FF5A1F] via-[#FF4500] to-[#FF5A1F] hover:opacity-95 text-white rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase transition-all shadow-[0_8px_30px_rgba(255,90,31,0.45)] border border-orange-400/30 flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                >
                    <Rocket className="w-5 h-5 shrink-0" />
                    <span>CREAR MI PÁGINA DE CAPTURA</span>
                    <ArrowRight className="w-5 h-5 shrink-0" />
                </button>

                <p className="text-zinc-400 text-xs sm:text-sm font-normal pt-1">
                    La IA utilizará la estrategia de tu proyecto para construirla.
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
interface LandingSuccessProps extends StepProps {
    project?: any;
    createdPageSubdomain?: string;
}

export const LandingSuccessStep: React.FC<LandingSuccessProps> = ({ onNext, project }) => {
    const productName = project?.productName || project?.name || 'Curso Profesional de Microblading de Cejas';

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto px-4 py-8 font-sans"
        >
            {/* Checkmark Icon with Glowing Box */}
            <div className="relative">
                <div className="absolute inset-0 bg-[#FF5A1F]/20 blur-[50px] rounded-full animate-pulse"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0d0d0e] border-2 border-[#FF5A1F]/40 flex items-center justify-center shadow-[0_10px_50px_-10px_rgba(255,90,31,0.35)]">
                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF5A1F]" />
                </div>
            </div>

            {/* Main Title */}
            <div className="space-y-3">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    Tu página de <span className="text-[#FF5A1F]">captura de clientes</span> ha sido generada
                </h2>
                <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                    Tu página de captura fue creada correctamente para tu proyecto <span className="text-white font-bold">{productName}</span>. Podrás editarla, personalizarla y modificarla directamente desde la sección del proyecto.
                </p>
            </div>

            {/* Card Content Box */}
            <div className="w-full bg-[#0d0d0e]/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-3 text-center shadow-2xl backdrop-blur-md">
                <h3 className="text-white font-extrabold text-lg sm:text-xl tracking-tight">
                    Siguiente paso: Reels de atracción
                </h3>
                <p className="text-zinc-400 font-light text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                    Ahora prepararemos 3 videos de menos de un minuto (Reels) que utilizarás para atraer visitas y llevarlas hacia tu página de captura.
                </p>
            </div>

            {/* Action Button */}
            <div className="flex flex-col items-center gap-3 pt-2 w-full max-w-md">
                <button 
                    type="button"
                    onClick={() => onNext()}
                    className="w-full py-4 px-8 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-2xl font-black text-sm sm:text-base tracking-wide uppercase transition-all shadow-[0_10px_35px_rgba(255,90,31,0.35)] flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                >
                    <span>CONTINUAR: PREPARAR MIS 3 REELS</span>
                    <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs font-light">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto px-4 py-8 font-sans"
        >
            {isUnlocked ? (
                /* --- ESTADO LISTOS / ACTIVO (PANEL DE ÉXITO) --- */
                <>
                    {/* Icon Box */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#FF5A1F]/20 blur-[50px] rounded-full animate-pulse"></div>
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0d0d0e] border-2 border-[#FF5A1F]/40 flex items-center justify-center shadow-[0_10px_50px_-10px_rgba(255,90,31,0.35)]">
                            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF5A1F]" />
                        </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-3">
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                            Tus 3 reels de atracción <span className="text-[#FF5A1F]">están listos</span>
                        </h2>
                        <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                            Tus 3 reels de atracción fueron generados con éxito para tu proyecto <span className="text-white font-bold">{project?.name || "activo"}</span>. Podrás ver los guiones, editarlos y descargarlos directamente desde tu sección del proyecto.
                        </p>
                    </div>

                    {/* Card Content Box */}
                    <div className="w-full bg-[#0d0d0e]/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-3 text-center shadow-2xl backdrop-blur-md">
                        <h3 className="text-white font-extrabold text-lg sm:text-xl tracking-tight">
                            Tu sistema inicial está listo
                        </h3>
                        <p className="text-zinc-400 font-light text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                            Tus 3 reels, tu página de captación y los textos para publicar ya están guardados dentro de tu proyecto.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-center gap-3 pt-2 w-full max-w-md">
                        <button 
                            type="button"
                            onClick={() => onNext()}
                            className="w-full py-4 px-8 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-2xl font-black text-sm sm:text-base tracking-wide uppercase transition-all shadow-[0_10px_35px_rgba(255,90,31,0.35)] flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                        >
                            <Rocket className="w-5 h-5 shrink-0 text-white" />
                            <span>FINALIZAR Y VER MI PROYECTO</span>
                            <ArrowRight className="w-5 h-5 shrink-0" />
                        </button>
                        <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs font-light">
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            <span>Podrás descargar, revisar y gestionar todo desde el panel de tu proyecto.</span>
                        </div>
                    </div>
                </>
            ) : (
                /* --- ESTADO PENDIENTE / PREVIEW (SINTÉTICO Y ELEGANTE) --- */
                <>
                    {/* Icon Box */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#FF5A1F]/20 blur-[50px] rounded-full animate-pulse"></div>
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0d0d0e] border-2 border-[#FF5A1F]/40 flex items-center justify-center shadow-[0_10px_50px_-10px_rgba(255,90,31,0.35)]">
                            <Film className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF5A1F]" />
                        </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-3">
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                            Generar <span className="text-[#FF5A1F]">Reels de Atracción</span>
                        </h2>
                        <p className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                            Generaremos 3 reels estratégicos con guiones, textos y llamadas a la acción para atraer clientes potenciales a tu proyecto.
                        </p>
                    </div>

                    {/* Card Content Box */}
                    <div className="w-full bg-[#0d0d0e]/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-3 text-center shadow-2xl backdrop-blur-md">
                        <h3 className="text-white font-extrabold text-lg sm:text-xl tracking-tight">
                            Contenido en video optimizado
                        </h3>
                        <p className="text-zinc-400 font-light text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                            Utilizaremos la estrategia de tu proyecto para crear guiones virales de menos de 1 minuto, diseñados para captar la atención en los primeros segundos y dirigir personas interesadas hacia tu página de captura.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-center gap-3 pt-2 w-full max-w-md">
                        <button 
                            type="button"
                            onClick={() => onNext()}
                            className="w-full py-4 px-8 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-2xl font-black text-sm sm:text-base tracking-wide uppercase transition-all shadow-[0_10px_35px_rgba(255,90,31,0.35)] flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                        >
                            <Sparkles className="w-5 h-5 shrink-0 fill-white" />
                            <span>GENERAR REELS DE ATRACCIÓN</span>
                            <ArrowRight className="w-5 h-5 shrink-0" />
                        </button>
                        <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs font-light">
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            <span>Podrás verlos, editarlos y gestionarlos en la sección de tu proyecto.</span>
                        </div>
                    </div>
                </>
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
