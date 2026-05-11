import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Send, Mail, User, Globe, Phone, Target, BarChart, Rocket, HelpCircle, Briefcase, Clock, Monitor, Share2, Award, Zap } from 'lucide-react';
import { api } from '../../services/api';
import { User as UserType } from '../../types';

interface OnboardingSurveyProps {
    user: UserType;
    onComplete: () => void;
}

// Sample Country Data (Normally this would come from an API or larger file)
const countries = [
    { name: "Argentina", cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"] },
    { name: "Bolivia", cities: ["La Paz", "Santa Cruz", "Cochabamba"] },
    { name: "Chile", cities: ["Santiago", "Valparaíso", "Concepción"] },
    { name: "Colombia", cities: ["Bogotá", "Medellín", "Cali", "Barranquilla"] },
    { name: "Costa Rica", cities: ["San José", "Alajuela"] },
    { name: "Ecuador", cities: ["Quito", "Guayaquil", "Cuenca"] },
    { name: "España", cities: ["Madrid", "Barcelona", "Valencia", "Sevilla"] },
    { name: "México", cities: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla"] },
    { name: "Panamá", cities: ["Ciudad de Panamá", "David"] },
    { name: "Perú", cities: ["Lima", "Arequipa", "Trujillo"] },
    { name: "Uruguay", cities: ["Montevideo", "Salto"] },
    { name: "Venezuela", cities: ["Caracas", "Maracaibo", "Valencia"] },
    { name: "Otros", cities: [] }
];

export const OnboardingSurvey: React.FC<OnboardingSurveyProps> = ({ user, onComplete }) => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [formData, setFormData] = useState({
        email: user.email || '',
        fullName: user.name || '',
        country: '',
        city: '',
        whatsapp: '',
        mainGoal: '', // El resultado principal que quieres conseguir
        dedicationTime: '',
        hasWebsite: '',
        useSocialMedia: [] as string[],
        experienceLevel: '', // Nivel actual
        hasHotmartAcc: '',
        mastery: {
            funnels: '',
            emailMarketing: '',
            landingPages: ''
        },
        businessType: '', // Tipo de negocio que quieres construir
        budgetRange: '', // Cuánto podrías invertir
        mainObstacle: '',
        skillToImprove: '',
        communityExpectation: ''
    });

    const steps = [
        {
            title: "Tus Datos Básicos",
            description: "Te invitamos a llenar este breve formulario para que podamos entender tus objetivos, experiencia y necesidades.",
            content: (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Correo electrónico</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-6 w-6 text-emerald-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input 
                                    type="email" 
                                    readOnly
                                    value={formData.email}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-500 cursor-not-allowed font-medium text-lg"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nombre Completo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-6 w-6 text-emerald-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    readOnly
                                    value={formData.fullName}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-500 cursor-not-allowed font-medium text-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">País *</label>
                            <select 
                                value={selectedCountry}
                                onChange={(e) => {
                                    setSelectedCountry(e.target.value);
                                    setFormData({...formData, country: e.target.value, city: ''});
                                }}
                                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg appearance-none"
                            >
                                <option value="" className="bg-zinc-900">Selecciona tu país</option>
                                {countries.map(c => (
                                    <option key={c.name} value={c.name} className="bg-zinc-900">{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ciudad *</label>
                            {selectedCountry && selectedCountry !== "Otros" ? (
                                <select 
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg appearance-none"
                                >
                                    <option value="" className="bg-zinc-900">Selecciona tu ciudad</option>
                                    {countries.find(c => c.name === selectedCountry)?.cities.map(city => (
                                        <option key={city} value={city} className="bg-zinc-900">{city}</option>
                                    ))}
                                    <option value="Otra" className="bg-zinc-900">Otra ciudad...</option>
                                </select>
                            ) : (
                                <input 
                                    type="text" 
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg"
                                    placeholder="Escribe tu ciudad"
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Número de WhatsApp *</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone className="h-6 w-6 text-emerald-500 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <input 
                                type="tel" 
                                required
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg"
                                placeholder="+57 321..."
                            />
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Objetivos y Motivación",
            description: "Queremos entender qué te impulsa a unirte a nuestra comunidad.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Cuál es el resultado principal que quieres conseguir? *</label>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                "Generar ingresos vendiendo productos digitales",
                                "Construir una marca personal",
                                "Consigan clientes para mi negocio",
                                "Automatizar ventas con IA",
                                "Crear y vender mi propio producto",
                                "Aprender marketing digital desde cero"
                            ].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({...formData, mainGoal: opt})}
                                    className={`text-left p-5 rounded-2xl border-2 transition-all group flex items-center justify-between ${formData.mainGoal === opt ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/30'}`}
                                >
                                    <span className="font-bold text-lg">{opt}</span>
                                    {formData.mainGoal === opt && <Check className="w-6 h-6 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Cuánto tiempo podrías dedicar semanalmente? *</label>
                        <select 
                            value={formData.dedicationTime}
                            onChange={(e) => setFormData({...formData, dedicationTime: e.target.value})}
                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-6 text-white focus:border-emerald-500 focus:outline-none transition-all font-bold text-xl appearance-none"
                        >
                            <option value="" className="bg-zinc-900">Selecciona el tiempo</option>
                            <option value="Menos de 5 horas" className="bg-zinc-900">Menos de 5 horas</option>
                            <option value="5-10 horas" className="bg-zinc-900">5-10 horas</option>
                            <option value="10-20 horas" className="bg-zinc-900">10-20 horas</option>
                            <option value="Más de 20 horas" className="bg-zinc-900">Más de 20 horas (Dedicación completa)</option>
                        </select>
                    </div>
                </div>
            )
        },
        {
            title: "Infraestructura Online",
            description: "Cuéntanos sobre tu presencia digital actual.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Tienes una página web o blog? *</label>
                        <div className="flex gap-4">
                            {['SI', 'NO'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({...formData, hasWebsite: opt})}
                                    className={`flex-1 p-6 rounded-2xl border-2 transition-all font-black text-2xl ${formData.hasWebsite === opt ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/30'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Usas Redes Sociales para tu Negocio?</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {["Instagram", "Facebook", "TikTok", "YouTube", "Telegram", "No tengo redes activas todavía"].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const sm = formData.useSocialMedia.includes(opt)
                                            ? formData.useSocialMedia.filter(s => s !== opt)
                                            : [...formData.useSocialMedia, opt];
                                        setFormData({...formData, useSocialMedia: sm});
                                    }}
                                    className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${formData.useSocialMedia.includes(opt) ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/30'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "¿Conocimientos previos?",
            description: "Queremos conocer tu nivel actual en marketing digital.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Cuál describe mejor tu nivel actual? *</label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                "Estoy empezando desde cero",
                                "Ya he intentado vender online",
                                "Ya genero algunas ventas",
                                "Ya tengo experiencia en marketing digital"
                            ].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({...formData, experienceLevel: opt})}
                                    className={`text-left p-4 rounded-2xl border-2 transition-all font-bold ${formData.experienceLevel === opt ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Ya tienes cuenta en Hotmart? *</label>
                        <div className="flex gap-4">
                            {['SI', 'NO'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({...formData, hasHotmartAcc: opt})}
                                    className={`flex-1 p-4 rounded-2xl border-2 transition-all font-bold ${formData.hasHotmartAcc === opt ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Qué tanto dominas estas áreas?</label>
                        
                        {[
                            { key: 'funnels', label: 'Embudos de venta' },
                            { key: 'emailMarketing', label: 'Email Marketing' },
                            { key: 'landingPages', label: 'Landing Pages' }
                        ].map((area) => (
                            <div key={area.key} className="space-y-3">
                                <p className="text-white font-bold">{area.label}</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {['Nada', 'Básico', 'Intermedio', 'Avanzado'].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setFormData({
                                                ...formData, 
                                                mastery: { ...formData.mastery, [area.key]: level }
                                            })}
                                            className={`p-3 rounded-xl border-2 transition-all text-xs font-black ${formData.mastery[area.key as keyof typeof formData.mastery] === level ? 'bg-emerald-500/40 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: "Tipo de Negocio e Inversión",
            description: "Define tus preferencias y presupuesto.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Qué tipo de negocio digital quieres construir? *</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                "Afiliación", "Marca personal", "Agencia", "Infoproductos",
                                "Ecommerce", "Servicios", "Comunidad/Membresía", "Aún no lo tengo claro"
                            ].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({...formData, businessType: opt})}
                                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData.businessType === opt ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Cuánto podrías invertir mensualmente? *</label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {['$0', '$1-$50', '$50-$200', '$200-$500', '+$500'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({...formData, budgetRange: opt})}
                                    className={`p-3 rounded-xl border-2 transition-all text-xs font-black ${formData.budgetRange === opt ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Dificultades y Apoyo",
            description: "Identifica tus obstáculos para poder impulsarte.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Cuál crees que es tu mayor obstáculo actual? *</label>
                        <textarea 
                            value={formData.mainObstacle}
                            onChange={(e) => setFormData({...formData, mainObstacle: e.target.value})}
                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-6 text-white focus:border-emerald-500 focus:outline-none transition-all min-h-[120px] font-medium text-lg"
                            placeholder="Describe tu principal reto..."
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Qué tipo de apoyo esperas de esta comunidad? *</label>
                        <textarea 
                            value={formData.communityExpectation}
                            onChange={(e) => setFormData({...formData, communityExpectation: e.target.value})}
                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-6 text-white focus:border-emerald-500 focus:outline-none transition-all min-h-[120px] font-medium text-lg"
                            placeholder="Orientación, recursos, equipo..."
                        />
                    </div>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        // Validaciones básicas antes de enviar
        if (!formData.country || !formData.whatsapp || !formData.mainGoal || !formData.experienceLevel) {
            alert("Por favor rellena todos los campos obligatorios.");
            return;
        }

        setLoading(true);
        try {
            await api.submitSurvey(formData);
            onComplete();
        } catch (error) {
            console.error("Error submitting survey", error);
            alert("Ocurrió un error al guardar la encuesta.");
        } finally {
            setLoading(false);
        }
    };

    const progress = ((step + 1) / steps.length) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto py-8 px-4">
            {/* Header Progresivo */}
            <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">
                                {step + 1}
                            </span>
                            <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em]">ETAPA DE ONBOARDING</p>
                        </div>
                        <h2 className="text-4xl font-black text-white leading-none tracking-tight">{steps[step].title}</h2>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Tu Progreso</p>
                        <p className="text-2xl font-black text-white leading-none">{Math.round(progress)}%</p>
                    </div>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    />
                </div>
            </div>

            {/* Contenido de la Encuesta */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="bg-zinc-900/50 border-2 border-white/5 rounded-[40px] p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="mb-12">
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                {steps[step].description}
                            </p>
                        </div>

                        {steps[step].content}

                        <div className="flex flex-col sm:flex-row gap-4 mt-16">
                            {step > 0 && (
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-6 px-8 rounded-3xl bg-white/5 hover:bg-white/10 text-white font-black text-lg transition-all border-2 border-white/5 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                    Atrás
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="flex-[2] py-6 px-8 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Zap className="w-6 h-6 animate-pulse" />
                                        Guardando...
                                    </>
                                ) : step === steps.length - 1 ? (
                                    <>
                                        Comenzar Ahora
                                        <Rocket className="w-6 h-6" />
                                    </>
                                ) : (
                                    <>
                                        Siguiente Paso
                                        <ChevronRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Footer Trust Message */}
            <div className="mt-12 text-center text-gray-500 flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <p className="text-xs font-bold uppercase tracking-widest">Tus datos están seguros y se usarán para personalizar tu experiencia</p>
            </div>
        </div>
    );
};
