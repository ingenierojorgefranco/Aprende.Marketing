import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    ChevronRight, 
    ChevronLeft, 
    Check, 
    Globe, 
    Target, 
    BarChart, 
    Rocket, 
    HelpCircle, 
    Briefcase, 
    Clock, 
    Zap,
    Lock,
    Tag,
    ChevronDown,
    Instagram,
    Facebook,
    Youtube,
    Mail,
    MessageSquare,
    TrendingUp,
    Ban,
    Megaphone,
    PenTool,
    Music,
    Wallet
} from 'lucide-react';
import { api } from '../../services/api';
import { User as UserType } from '../../types';
import { countries } from '../../src/lib/countriesData';

interface OnboardingSurveyProps {
    user: UserType;
    onComplete: () => void;
}

export const OnboardingSurvey: React.FC<OnboardingSurveyProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [attemptedNext, setAttemptedNext] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: user.email || '',
        fullName: user.name || '',
        country: '',
        mainGoal: '', 
        dedicationTime: '',
        experienceLevel: '', 
        budgetRange: '', 
        mainObstacle: '',
        niche: '', 
        howToStart: '',
        achievementPriority: '',
        currentResources: [] as string[],
        contentCreationPreference: '',
    });

    // Subir al inicio al cambiar de paso
    useEffect(() => {
        const header = document.getElementById('survey-step-header');
        if (header) {
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [step]);

    const validateStep = (currentStep: number) => {
        switch (currentStep) {
            case 0: // Paso 1: Personalicemos tu experiencia
                return !!formData.experienceLevel && !!formData.mainGoal && !!formData.country;
            case 1: // Paso 2: Definamos qué quieres promocionar
                return !!formData.howToStart && !!formData.niche && !!formData.achievementPriority;
            case 2: // Paso 3: Recursos e información de canales
                return formData.currentResources.length > 0 && !!formData.contentCreationPreference;
            case 3: // Paso 4: Compromiso de Éxito
                return !!formData.dedicationTime && !!formData.mainObstacle;
            default:
                return true;
        }
    };

    const handleToggleResource = (label: string) => {
        let updated = [...formData.currentResources];
        if (label === "Todavía no tengo ninguno") {
            setFormData({
                ...formData,
                currentResources: updated.includes(label) ? [] : [label]
            });
        } else {
            updated = updated.filter(item => item !== "Todavía no tengo ninguno");
            if (updated.includes(label)) {
                updated = updated.filter(item => item !== label);
            } else {
                updated.push(label);
            }
            setFormData({
                ...formData,
                currentResources: updated
            });
        }
        setAttemptedNext(false);
    };

    const handleNext = () => {
        const isValid = validateStep(step);
        if (!isValid) {
            setAttemptedNext(true);
            setErrorMessage("Por favor, responde todas las preguntas del paso actual antes de continuar.");
            return;
        }

        setAttemptedNext(false);
        setErrorMessage("");
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
            setAttemptedNext(false);
            setErrorMessage("");
        }
    };

    const handleSubmit = async () => {
        const isAllValid = [0, 1, 2, 3].every(i => validateStep(i));
        if (!isAllValid) {
            setErrorMessage("Por favor responde a todas las preguntas obligatorias antes de comenzar.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        try {
            console.log("🚀 Enviando encuesta simplificada al backend...", formData);
            await api.submitSurvey(formData);
            console.log("✅ Encuesta guardada exitosamente");
            onComplete();
        } catch (error) {
            console.error("❌ Error al guardar la encuesta:", error);
            setErrorMessage("Ocurrió un error al guardar la encuesta. Revisa tu conexión de red e intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const progressPercentages = [14, 43, 71, 100];
    const progress = progressPercentages[step];

    return (
        <div className="w-full max-w-3xl mx-auto py-8 px-4">
            
            {/* Cabecera del Stepper */}
            <div id="survey-step-header" className="mb-8 w-full font-sans select-none scroll-mt-32">
                <div className="flex items-center justify-between mb-4.5 px-1 bg-transparent" style={{ paddingBottom: '2em' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center font-black text-xs md:text-sm shadow-[0_2px_10px_rgba(255,90,31,0.25)] shrink-0">
                            {step + 1}
                        </div>
                        <span className="text-white font-extrabold text-[10px] md:text-xs uppercase tracking-[0.18em] leading-normal pt-0.5">
                            ETAPA DE ONBOARDING
                        </span>
                    </div>
                    <div className="text-white font-extrabold uppercase tracking-[0.12em] pt-0.5" style={{ fontSize: '1em', color: 'white' }}>
                        TU PROGRESO <span className="text-[#FF5A1F] font-black tracking-normal ml-1">{progress}%</span>
                    </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="h-full bg-[#FF5A1F] rounded-full shadow-[0_0_8px_rgba(255,90,31,0.3)]"
                    />
                </div>
            </div>

            {/* Títulos y descripciones principales fuera de la tarjeta translúcida */}
            <motion.div
                key={`survey-header-${step}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-10 px-2 select-none"
            >
                <h2 className="text-3xl md:text-[36px] font-extrabold text-white leading-tight tracking-tight mb-3">
                    {step === 0 && "Personalicemos tu experiencia"}
                    {step === 1 && "Definamos qué quieres promocionar"}
                    {step === 2 && "Cuéntanos con qué recursos cuentas"}
                    {step === 3 && "Preparemos un plan que puedas cumplir"}
                </h2>
                <p className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up max-w-xl mx-auto" style={{ fontSize: '1.2rem' }}>
                    {step === 0 && (
                        <>
                            Cuéntanos cuál es tu punto de partida para recomendarte el mejor recorrido dentro de Aprende Marketing. Te tomará <span className="text-[#FF5A1F] font-semibold">menos de 3 minutos</span>.
                        </>
                    )}
                    {step === 1 && "Esto nos ayudará a recomendarte productos, audiencias y estrategias relevantes."}
                    {step === 2 && "Adaptaremos el contenido y el embudo a los canales que ya utilizas."}
                    {step === 3 && "Ajustaremos la estrategia a tu disponibilidad, presupuesto y principal dificultad."}
                </p>
            </motion.div>

            {/* Contenido de la Encuesta */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#111111]/90 border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A1F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    {/* Paso 1: Personalicemos tu experiencia */}
                    {step === 0 && (
                        <div className="space-y-8 relative z-10">
                            <div className="space-y-8">
                                {/* Pregunta 1 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <BarChart className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿Cuánta experiencia tienes vendiendo productos digitales?
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: "cero", label: "Estoy comenzando desde cero" },
                                            { id: "intentado", label: "Ya lo he intentado, pero todavía no consigo ventas" },
                                            { id: "ventas", label: "Ya he conseguido algunas ventas" }
                                        ].map((opt) => {
                                            const isSelected = formData.experienceLevel === opt.label;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, experienceLevel: opt.label });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && !formData.experienceLevel 
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                        isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-zinc-700 bg-transparent'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                                                    </div>
                                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-0 animate-fade-in-up" style={{ marginTop: '0', fontSize: '1rem' }}>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Pregunta 2 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Target className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿Cuál es tu objetivo principal?
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: "primera_venta", label: "Conseguir mi primera venta" },
                                            { id: "sistema", label: "Crear un sistema constante de captación y ventas" },
                                            { id: "automatizar", label: "Automatizar un negocio que ya tengo" }
                                        ].map((opt) => {
                                            const isSelected = formData.mainGoal === opt.label;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, mainGoal: opt.label });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && !formData.mainGoal 
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                        isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-zinc-700 bg-transparent'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                                                    </div>
                                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-0 animate-fade-in-up" style={{ marginTop: '0', fontSize: '1rem' }}>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Pregunta 3 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Globe className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿En qué país estás?
                                        </h3>
                                    </div>
                                    <div className="relative">
                                        <select 
                                            value={formData.country}
                                            onChange={(e) => {
                                                setFormData({ ...formData, country: e.target.value });
                                                setAttemptedNext(false);
                                            }}
                                            className={`w-full bg-[#111111]/90 border-2 rounded-2xl py-4 px-5 text-white focus:border-[#FF5A1F] focus:outline-none transition-all font-bold text-base md:text-lg appearance-none ${
                                                attemptedNext && !formData.country 
                                                    ? 'border-red-500/30 bg-red-500/5' 
                                                    : 'border-white/10'
                                            }`}
                                        >
                                            <option value="" className="bg-zinc-900 text-zinc-400">Selecciona tu país</option>
                                            {countries.filter(c => c.name !== "+ Añadir País").map(c => (
                                                <option 
                                                    key={c.name} 
                                                    value={c.name} 
                                                    className="bg-zinc-900"
                                                >
                                                    {c.flag} {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 2: Definamos qué quieres promocionar */}
                    {step === 1 && (
                        <div className="space-y-8 relative z-10">
                            <div className="space-y-8">
                                {/* Pregunta 1 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Rocket className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿Cómo quieres comenzar?
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: "elegir", label: "Quiero elegir un producto analizado por Aprende Marketing." },
                                            { id: "tengo", label: "Ya tengo un producto y quiero crear su estrategia." },
                                            { id: "nose", label: "Todavía no sé cuál es la mejor opción para mí." }
                                        ].map((opt) => {
                                            const isSelected = formData.howToStart === opt.label;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, howToStart: opt.label });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && !formData.howToStart 
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                        isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-zinc-700 bg-transparent'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                                                    </div>
                                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-0 animate-fade-in-up" style={{ marginTop: '0', fontSize: '1rem' }}>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Pregunta 2 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Tag className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿Qué temática te interesa más?
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: "belleza", label: "Belleza y cuidado personal." },
                                            { id: "salud", label: "Salud y bienestar." },
                                            { id: "dinero", label: "Dinero y negocios." },
                                            { id: "relaciones", label: "Relaciones y desarrollo personal." },
                                            { id: "educacion", label: "Educación y habilidades." },
                                            { id: "tech", label: "Tecnología y herramientas digitales." },
                                            { id: "nopo", label: "Todavía no lo tengo claro." }
                                        ].map((opt) => {
                                            const isSelected = formData.niche === opt.label;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, niche: opt.label });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && !formData.niche 
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                        isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-zinc-700 bg-transparent'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                                                    </div>
                                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-0 animate-fade-in-up" style={{ marginTop: '0', fontSize: '1rem' }}>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Pregunta 3 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Target className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿Qué quieres conseguir primero?
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: "lanzar", label: "Lanzar mi primera estrategia y conseguir mi primera venta." },
                                            { id: "sistema_cap", label: "Crear un sistema constante de captación y seguimiento." },
                                            { id: "mejorar", label: "Mejorar una estrategia que ya estoy utilizando." }
                                        ].map((opt) => {
                                            const isSelected = formData.achievementPriority === opt.label;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, achievementPriority: opt.label });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && !formData.achievementPriority 
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                        isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-zinc-700 bg-transparent'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                                                    </div>
                                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-0 animate-fade-in-up" style={{ marginTop: '0', fontSize: '1rem' }}>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 3: Cuéntanos con qué recursos cuentas */}
                    {step === 2 && (
                        <div className="space-y-8 relative z-10">
                            <div className="space-y-8">
                                {/* Pregunta 1 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Megaphone className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                                ¿Qué canales o recursos tienes actualmente?
                                            </h3>
                                            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Selección múltiple</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { id: "instagram", label: "Instagram", icon: Instagram },
                                            { id: "facebook", label: "Facebook", icon: Facebook },
                                            { id: "tiktok", label: "TikTok", icon: Music },
                                            { id: "youtube", label: "YouTube", icon: Youtube },
                                            { id: "web", label: "Página web o landing page", icon: Globe },
                                            { id: "email", label: "Lista de correo", icon: Mail },
                                            { id: "whatsapp", label: "Comunidad o grupo de WhatsApp", icon: MessageSquare },
                                            { id: "ads", label: "Publicidad pagada", icon: TrendingUp },
                                            { id: "none", label: "Todavía no tengo ninguno", icon: Ban }
                                        ].map((item) => {
                                            const isSelected = formData.currentResources.includes(item.label);
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleToggleResource(item.label)}
                                                    className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && formData.currentResources.length === 0
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <span className="text-[#FF5A1F] shrink-0">
                                                        <Icon className="w-4.5 h-4.5" />
                                                    </span>
                                                    <span className="font-bold text-xs md:text-sm text-left leading-snug">{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Pregunta 2 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <PenTool className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿Cómo te gustaría crear contenido?
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: "camara", label: "Apareciendo frente a la cámara." },
                                            { id: "voz", label: "Con voz, pero sin mostrar mi rostro." },
                                            { id: "textos", label: "Con videos y textos sin utilizar mi voz." },
                                            { id: "claro", label: "Todavía no lo tengo claro." }
                                        ].map((opt) => {
                                            const isSelected = formData.contentCreationPreference === opt.label;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, contentCreationPreference: opt.label });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && !formData.contentCreationPreference
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                        isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-zinc-700 bg-transparent'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                                                    </div>
                                                    <span className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-0 animate-fade-in-up" style={{ marginTop: '0', fontSize: '1rem' }}>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 4: Preparemos un plan que puedas cumplir */}
                    {step === 3 && (
                        <div className="space-y-8 relative z-10">
                            <div className="space-y-8">
                                {/* Pregunta 1 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Clock className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿Cuánto tiempo puedes dedicar semanalmente?
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { id: "menos_2", label: "Menos de 2 horas." },
                                            { id: "entre_2_5", label: "Entre 2 y 5 horas." },
                                            { id: "entre_5_10", label: "Entre 5 y 10 horas." },
                                            { id: "mas_10", label: "Más de 10 horas." }
                                        ].map((opt) => {
                                            const isSelected = formData.dedicationTime === opt.label;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, dedicationTime: opt.label });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && !formData.dedicationTime 
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                        isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-zinc-700 bg-transparent'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                                                    </div>
                                                    <span className="font-bold text-xs md:text-sm leading-snug">{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Pregunta 2 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Target className="w-4.5 h-4.5" />
                                        </div>
                                        <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                            ¿Cuál es el principal obstáculo que quieres resolver?
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            "No sé qué producto elegir.",
                                            "No sé cómo atraer personas interesadas.",
                                            "Recibo visitas, pero no consigo registros o ventas.",
                                            "Me cuesta crear contenido con constancia.",
                                            "No sé cómo construir el embudo.",
                                            "Las herramientas tecnológicas me resultan complicadas.",
                                            "Necesito una estrategia clara paso a paso.",
                                            "Quiero automatizar parte del proceso."
                                        ].map((opt) => {
                                            const isSelected = formData.mainObstacle === opt;
                                            return (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, mainObstacle: opt });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : attemptedNext && !formData.mainObstacle 
                                                                ? 'border-red-500/30 bg-red-500/5' 
                                                                : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                        isSelected ? 'border-[#FF5A1F] bg-[#FF5A1F]' : 'border-zinc-700 bg-transparent'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                                                    </div>
                                                    <span className="font-bold text-xs md:text-sm leading-snug">{opt}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Pregunta 3 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/10 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0">
                                            <Wallet className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-white text-base md:text-lg tracking-tight">
                                                ¿Qué presupuesto mensual podrías destinar a herramientas o promoción?
                                            </h3>
                                            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Opcional</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {[
                                            { id: "prefiero_no", label: "Prefiero empezar sin invertir." },
                                            { id: "hasta_50", label: "Hasta 50 USD." },
                                            { id: "entre_50_150", label: "Entre 50 y 150 USD." },
                                            { id: "entre_150_300", label: "Entre 150 y 300 USD." },
                                            { id: "mas_300", label: "Más de 300 USD." }
                                        ].map((opt) => {
                                            const isSelected = formData.budgetRange === opt.label;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, budgetRange: opt.label });
                                                        setAttemptedNext(false);
                                                    }}
                                                    className={`w-full text-center p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center min-h-[72px] ${
                                                        isSelected 
                                                            ? 'border-[#FF5A1F]/50 bg-[#FF5A1F]/5 text-white shadow-[0_4px_25px_rgba(255,90,31,0.06)]' 
                                                            : 'border-white/5 bg-[#111111]/40 text-zinc-300 hover:border-white/10 hover:bg-[#161616]/50'
                                                    }`}
                                                >
                                                    <span className="font-bold text-xs md:text-sm text-center leading-snug">{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[11px] text-zinc-500 font-semibold text-center mt-2 uppercase tracking-wide">
                                        Esta respuesta solo se utilizará para adaptar tus recomendaciones.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Display validation or generic errors beautifully */}
                    {errorMessage && (
                        <div id="survey-error-message" className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold flex items-center gap-3 animate-pulse">
                            <Zap className="w-5 h-5 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Botones de navegación (Atrás / Continuar) */}
                    <div id="survey-navigation-buttons" className="flex flex-col sm:flex-row gap-4 mt-10">
                        {step > 0 && (
                            <button
                                id="btn-onboarding-back"
                                type="button"
                                onClick={handleBack}
                                className="flex-1 py-4 px-6 rounded-xl bg-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 font-bold text-base uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none"
                            >
                                <ChevronLeft className="w-4 h-4 shrink-0" />
                                Volver
                            </button>
                        )}
                        <button
                            id="btn-onboarding-continue"
                            type="button"
                            onClick={handleNext}
                            disabled={loading}
                            className={`py-4 px-6 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF7A42] hover:brightness-110 text-white font-extrabold text-base transition-all shadow-lg shadow-[#FF5A1F]/10 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 focus:outline-none ${
                                step > 0 ? 'flex-[2]' : 'w-full'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Zap className="w-4 h-4 animate-pulse" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    Continuar
                                    <ChevronRight className="w-4 h-4 shrink-0" />
                                </>
                            )}
                        </button>
                    </div>



                </motion.div>
            </AnimatePresence>
        </div>
    );
};
