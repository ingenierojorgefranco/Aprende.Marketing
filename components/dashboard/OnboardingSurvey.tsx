import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Send, Mail, User, Globe, Phone, Target, BarChart, Rocket, HelpCircle, Briefcase, Clock, Monitor, Share2, Award, Zap } from 'lucide-react';
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
    const [selectedCountryObj, setSelectedCountryObj] = useState<any>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [showCityInput, setShowCityInput] = useState(false);
    const [showCountryInput, setShowCountryInput] = useState(false);
    const [formData, setFormData] = useState({
        email: user.email || '',
        fullName: user.name || '',
        country: '',
        city: '',
        whatsapp: '',
        whatsappIndicative: '',
        mainGoal: '', 
        dedicationTime: '',
        onlinePresence: '',
        useSocialMedia: [] as string[],
        experienceLevel: '', 
        hasHotmartAcc: '',
        mastery: {
            funnels: '',
            emailMarketing: '',
            landingPages: '',
            ia: ''
        },
        businessType: [] as string[],
        budgetRange: '', 
        mainObstacle: '',
        urgencyLevel: '', 
        niche: '', 
        communityExpectation: ''
    });

    // Sincronizar indicativo cuando cambia el país
    useEffect(() => {
        if (selectedCountryObj) {
            setFormData(prev => ({ 
                ...prev, 
                whatsappIndicative: selectedCountryObj.dial, 
                country: selectedCountryObj.name === "+ Añadir País" ? '' : selectedCountryObj.name,
                city: '' // Limpiar ciudad al cambiar país
            }));
            setShowCityInput(selectedCountryObj.name === "+ Añadir País");
            setShowCountryInput(selectedCountryObj.name === "+ Añadir País");
        }
    }, [selectedCountryObj]);

    // Al cambiar de paso, subir al inicio del contenedor
    useEffect(() => {
        if (step === 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const container = document.getElementById('dashboard-scroll-container');
            if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const header = document.getElementById('survey-step-header');
            if (header) {
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                const container = document.getElementById('dashboard-scroll-container');
                if (container) {
                    container.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }
    }, [step]);

    const validateStep = (currentStep: number) => {
        switch (currentStep) {
            case 0: // Datos Básicos
                return !!formData.email && !!formData.fullName && !!formData.country && !!formData.city && !!formData.whatsapp && formData.whatsapp.length > 5;
            case 1: // Objetivos
                return !!formData.mainGoal && !!formData.dedicationTime;
            case 2: // Presencia Digital
                return !!formData.onlinePresence && formData.useSocialMedia.length > 0;
            case 3: // Conocimientos
                return !!formData.experienceLevel && !!formData.hasHotmartAcc && 
                       !!formData.mastery.funnels && !!formData.mastery.emailMarketing && 
                       !!formData.mastery.landingPages && !!formData.mastery.ia;
            case 4: // Negocio e Inversión
                return formData.businessType.length > 0 && !!formData.budgetRange;
            case 5: // Desafíos
                return !!formData.mainObstacle && !!formData.communityExpectation;
            case 6: // Pregunta de Oro
                return !!formData.niche && !!formData.urgencyLevel;
            default:
                return true;
        }
    };

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
                                    <Mail className="h-6 w-6 text-emerald-500 transition-colors" />
                                </div>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({...formData, email: e.target.value});
                                        setAttemptedNext(false);
                                    }}
                                    onFocus={() => setIsEditingEmail(true)}
                                    onBlur={() => setIsEditingEmail(false)}
                                    className={`w-full bg-white/5 border-2 rounded-2xl py-4 pl-12 pr-4 text-white font-medium text-lg focus:outline-none transition-all ${isEditingEmail ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : attemptedNext && !formData.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nombre Completo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-6 w-6 text-emerald-500 transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.fullName}
                                    onChange={(e) => {
                                        setFormData({...formData, fullName: e.target.value});
                                        setAttemptedNext(false);
                                    }}
                                    onFocus={() => setIsEditingName(true)}
                                    onBlur={() => setIsEditingName(false)}
                                    className={`w-full bg-white/5 border-2 rounded-2xl py-4 pl-12 pr-4 text-white font-medium text-lg focus:outline-none transition-all ${isEditingName ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : attemptedNext && !formData.fullName ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">País *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl z-10 pointer-events-none">
                                    {selectedCountryObj?.flag || "🌐"}
                                </span>
                                {showCountryInput ? (
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={formData.country}
                                            onChange={(e) => {
                                                setFormData({...formData, country: e.target.value});
                                                setAttemptedNext(false);
                                            }}
                                            className={`w-full bg-white/5 border-2 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg ${attemptedNext && !formData.country ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                                            placeholder="Escribe tu país"
                                        />
                                        <button 
                                            onClick={() => {
                                                setShowCountryInput(false);
                                                setSelectedCountryObj(null);
                                                setFormData({...formData, country: ''});
                                            }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-white underline"
                                        >
                                            Ver lista
                                        </button>
                                    </div>
                                ) : (
                                    <select 
                                        value={selectedCountryObj?.name || ""}
                                        onChange={(e) => {
                                            const c = countries.find(x => x.name === e.target.value);
                                            if (c) setSelectedCountryObj(c);
                                            setAttemptedNext(false);
                                        }}
                                        className={`w-full bg-white/5 border-2 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg appearance-none ${attemptedNext && !formData.country ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                                    >
                                        <option value="" className="bg-zinc-900">Selecciona tu país</option>
                                        {countries.map(c => (
                                            <option 
                                                key={c.name} 
                                                value={c.name} 
                                                className={`bg-zinc-900 ${c.name === "+ Añadir País" ? "text-emerald-400 font-bold" : ""}`}
                                            >
                                                {c.flag} {c.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ciudad *</label>
                            {selectedCountryObj && selectedCountryObj.cities.length > 0 && !showCityInput ? (
                                <div className="relative">
                                    <select 
                                        value={formData.city}
                                        onChange={(e) => {
                                            if (e.target.value === "OTRA") {
                                                setShowCityInput(true);
                                                setFormData({...formData, city: ''});
                                            } else {
                                                setFormData({...formData, city: e.target.value});
                                            }
                                            setAttemptedNext(false);
                                        }}
                                        className={`w-full bg-white/5 border-2 rounded-2xl py-4 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg appearance-none ${attemptedNext && !formData.city ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                                    >
                                        <option value="" className="bg-zinc-900">Selecciona tu ciudad</option>
                                        {selectedCountryObj.cities.map((city: string) => (
                                            <option key={city} value={city} className="bg-zinc-900">{city}</option>
                                        ))}
                                        <option value="OTRA" className="bg-zinc-900 font-bold text-emerald-400">+ Añadir Ciudad</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.city}
                                        onChange={(e) => {
                                            setFormData({...formData, city: e.target.value});
                                            setAttemptedNext(false);
                                        }}
                                        className={`w-full bg-white/5 border-2 rounded-2xl py-4 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg ${attemptedNext && !formData.city ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                                        placeholder={showCityInput ? "Escribe el nombre de tu ciudad" : "Primero selecciona un país"}
                                    />
                                    {showCityInput && (
                                        <button 
                                            onClick={() => setShowCityInput(false)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-white underline"
                                        >
                                            Ver lista
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Número de WhatsApp *</label>
                            <p className="text-sm text-white font-medium">Lo usaremos para soporte, novedades importantes y automatizaciones personalizadas.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-32 relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                                    {selectedCountryObj?.flag || "🌐"}
                                </div>
                                <input 
                                    type="text"
                                    readOnly
                                    value={formData.whatsappIndicative}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-10 pr-2 text-white font-bold text-lg text-center"
                                />
                            </div>
                            <div className="flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-6 w-6 text-emerald-500 transition-colors" />
                                </div>
                                <input 
                                    type="tel" 
                                    required
                                    value={formData.whatsapp}
                                    onChange={(e) => {
                                        setFormData({...formData, whatsapp: e.target.value});
                                        setAttemptedNext(false);
                                    }}
                                    className={`w-full bg-white/5 border-2 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-medium text-lg ${attemptedNext && !formData.whatsapp ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}
                                    placeholder="321 000 0000"
                                />
                            </div>
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
                                { id: "afiliado", label: "Generar ingresos como afiliado o creador digital", icon: <Target className="w-5 h-5 text-emerald-400" /> },
                                { id: "marca", label: "Construir una marca personal", icon: <User className="w-5 h-5 text-blue-400" /> },
                                { id: "clientes", label: "Conseguir clientes para mi negocio", icon: <Briefcase className="w-5 h-5 text-purple-400" /> },
                                { id: "ia", label: "Automatizar ventas con IA", icon: <Zap className="w-5 h-5 text-yellow-400" /> },
                                { id: "propio", label: "Crear y vender mi propio producto", icon: <Rocket className="w-5 h-5 text-red-400" /> },
                                { id: "cero", label: "Aprender marketing digital desde cero", icon: <Award className="w-5 h-5 text-emerald-400" /> }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        setFormData({...formData, mainGoal: opt.label});
                                        setAttemptedNext(false);
                                    }}
                                    className={`text-left p-5 rounded-2xl border-2 transition-all group flex items-center justify-between ${formData.mainGoal === opt.label ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' : attemptedNext && !formData.mainGoal ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white hover:border-emerald-500/30'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${formData.mainGoal === opt.label ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                                            {opt.icon}
                                        </div>
                                        <span className="font-bold text-lg">{opt.label}</span>
                                    </div>
                                    {formData.mainGoal === opt.label && <Check className="w-6 h-6 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Cuánto tiempo podrías dedicar semanalmente? *</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Menos de 2 horas", icon: <Clock className="w-5 h-5" /> },
                                { label: "2-5 horas", icon: <Clock className="w-5 h-5" /> },
                                { label: "5-10 horas", icon: <Clock className="w-5 h-5" /> },
                                { label: "10+ horas", icon: <Clock className="w-5 h-5" /> }
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => {
                                        setFormData({...formData, dedicationTime: opt.label});
                                        setAttemptedNext(false);
                                    }}
                                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 ${formData.dedicationTime === opt.label ? 'bg-emerald-500/20 border-emerald-500 text-white' : attemptedNext && !formData.dedicationTime ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white hover:border-emerald-500/30'}`}
                                >
                                    {opt.icon}
                                    <span className="font-bold text-lg text-center leading-tight">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Presencia Digital",
            description: "Cuéntanos sobre tu presencia digital actual para personalizar las herramientas.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Ya tienes presencia online activa? *</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { label: "Tengo redes sociales activas", icon: <Share2 className="w-5 h-5 text-blue-400" /> },
                                { label: "Tengo página web", icon: <Globe className="w-5 h-5 text-emerald-400" /> },
                                { label: "Tengo ambas", icon: <Monitor className="w-5 h-5 text-purple-400" /> },
                                { label: "Estoy comenzando desde cero", icon: <Rocket className="w-5 h-5 text-gray-400" /> }
                            ].map(opt => (
                                <button
                                    key={opt.label}
                                    onClick={() => {
                                        setFormData({...formData, onlinePresence: opt.label});
                                        setAttemptedNext(false);
                                    }}
                                    className={`text-left p-5 rounded-2xl border-2 transition-all group flex items-center justify-between ${formData.onlinePresence === opt.label ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' : attemptedNext && !formData.onlinePresence ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white hover:border-emerald-500/30'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${formData.onlinePresence === opt.label ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                                            {opt.icon}
                                        </div>
                                        <span className="font-bold text-lg">{opt.label}</span>
                                    </div>
                                    {formData.onlinePresence === opt.label && <Check className="w-6 h-6 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <label className={`text-sm font-bold uppercase tracking-wider transition-colors ${attemptedNext && formData.useSocialMedia.length === 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            ¿Qué plataformas usas actualmente para crear contenido o atraer audiencia? *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {["Instagram", "Facebook", "TikTok", "YouTube", "Telegram", "Publicidad Paga", "Enfoque en negocio", "Uso personal", "Ninguna aún"].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const sm = formData.useSocialMedia.includes(opt)
                                            ? formData.useSocialMedia.filter(s => s !== opt)
                                            : [...formData.useSocialMedia, opt];
                                        setFormData({...formData, useSocialMedia: sm});
                                        if (sm.length > 0) setAttemptedNext(false);
                                    }}
                                    className={`p-4 rounded-2xl border-2 transition-all text-lg font-bold flex items-center justify-center gap-2 ${formData.useSocialMedia.includes(opt) ? 'bg-emerald-500/20 border-emerald-500 text-white' : attemptedNext && formData.useSocialMedia.length === 0 ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white hover:border-emerald-500/30'}`}
                                >
                                    {opt}
                                    {formData.useSocialMedia.includes(opt) && <Check className="w-5 h-5" />}
                                </button>
                            ))}
                        </div>
                        {attemptedNext && formData.useSocialMedia.length === 0 && (
                            <p className="text-red-400 text-xs font-bold animate-pulse">Por favor selecciona al menos una plataforma.</p>
                        )}
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
                                    onClick={() => {
                                        setFormData({...formData, experienceLevel: opt});
                                        setAttemptedNext(false);
                                    }}
                                    className={`text-left p-4 rounded-2xl border-2 transition-all font-bold group flex items-center justify-between ${formData.experienceLevel === opt ? 'bg-emerald-500/20 border-emerald-500 text-white' : attemptedNext && !formData.experienceLevel ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    <span className="text-lg">{opt}</span>
                                    {formData.experienceLevel === opt && <Check className="w-5 h-5 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Ya tienes cuenta en Hotmart? *</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { id: 'SI_AFF', label: 'Sí, ya estoy afiliado a productos' },
                                { id: 'SI', label: 'Sí, tengo cuenta pero no la uso' },
                                { id: 'NO', label: 'No, todavía no tengo cuenta' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        setFormData({...formData, hasHotmartAcc: opt.label});
                                        setAttemptedNext(false);
                                    }}
                                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-lg leading-tight ${formData.hasHotmartAcc === opt.label ? 'bg-emerald-500/20 border-emerald-500 text-white' : attemptedNext && !formData.hasHotmartAcc ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <label className={`text-sm font-bold uppercase tracking-wider transition-colors ${attemptedNext && (!formData.mastery.funnels || !formData.mastery.emailMarketing || !formData.mastery.landingPages || !formData.mastery.ia) ? 'text-red-400' : 'text-gray-400'}`}>
                                ¿Qué tanto dominas estas áreas? *
                            </label>
                            {attemptedNext && (!formData.mastery.funnels || !formData.mastery.emailMarketing || !formData.mastery.landingPages || !formData.mastery.ia) && (
                                <p className="text-red-400 text-xs font-bold animate-pulse">Completa todos los niveles de dominio para continuar.</p>
                            )}
                        </div>
                        
                        {[
                            { key: 'funnels', label: 'Embudos de venta' },
                            { key: 'emailMarketing', label: 'Email Marketing' },
                            { key: 'landingPages', label: 'Landing Pages' },
                            { key: 'ia', label: 'IA y Automatización' }
                        ].map((area) => (
                            <div key={area.key} className="space-y-3">
                                <p className={`font-bold transition-colors ${attemptedNext && !formData.mastery[area.key as keyof typeof formData.mastery] ? 'text-red-500' : 'text-white'}`}>
                                    {area.label}
                                </p>
                                <div className={`grid grid-cols-4 gap-2 bg-white/5 p-1.5 rounded-2xl border transition-all ${attemptedNext && !formData.mastery[area.key as keyof typeof formData.mastery] ? 'border-red-500/50 bg-red-500/5' : 'border-white/5'}`}>
                                    {['Nada', 'Básico', 'Medio', 'Pro'].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => {
                                                setFormData({
                                                    ...formData, 
                                                    mastery: { ...formData.mastery, [area.key]: level }
                                                });
                                                setAttemptedNext(false);
                                            }}
                                            className={`py-3 rounded-xl transition-all text-xs font-black uppercase tracking-wider ${formData.mastery[area.key as keyof typeof formData.mastery] === level ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
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
            description: "Define tus preferencias y presupuesto para orientar tu estrategia.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Qué tipo de negocio digital quieres construir? * (Selección múltiple)</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                "Afiliación", "Marca personal", "Agencia", "Infoproductos",
                                "Ecommerce", "Servicios", "Comunidad/Membresía", "Aún no lo tengo claro"
                            ].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const bt = formData.businessType.includes(opt)
                                            ? formData.businessType.filter(s => s !== opt)
                                            : [...formData.businessType, opt];
                                        setFormData({...formData, businessType: bt});
                                        setAttemptedNext(false);
                                    }}
                                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-lg leading-tight flex items-center justify-center gap-2 ${formData.businessType.includes(opt) ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' : attemptedNext && formData.businessType.length === 0 ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white hover:border-emerald-500/30'}`}
                                >
                                    {opt}
                                    {formData.businessType.includes(opt) && <Check className="w-5 h-5 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Cuánto podrías invertir mensualmente para acelerar resultados? *</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { id: '0', label: 'Prefiero empezar sin invertir por ahora' },
                                { id: '1-50', label: '$1 - $50 USD' },
                                { id: '50-200', label: '$50 - $200 USD' },
                                { id: '200-500', label: '$200 - $500 USD' },
                                { id: '500+', label: 'Más de $500 USD' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        setFormData({...formData, budgetRange: opt.label});
                                        setAttemptedNext(false);
                                    }}
                                    className={`text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${formData.budgetRange === opt.label ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg' : attemptedNext && !formData.budgetRange ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    <span className="font-bold text-lg">{opt.label}</span>
                                    {formData.budgetRange === opt.label && <Check className="w-6 h-6 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Desafíos y Necesidades",
            description: "Ayúdanos a entender tus retos actuales para brindarte las mejores soluciones.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Cuál sientes que es tu mayor obstáculo actualmente? *</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                "Falta de claridad sobre qué vender",
                                "Dificultad para conseguir tráfico/visitas",
                                "No sé cómo convertir visitas en ventas",
                                "Me cuesta crear contenido constante",
                                "No entiendo las herramientas tecnológicas",
                                "Me falta una estrategia paso a paso",
                                "Necesito automatizar procesos operativos",
                                "Dificultad con la Inteligencia Artificial"
                            ].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        setFormData({...formData, mainObstacle: opt});
                                        setAttemptedNext(false);
                                    }}
                                    className={`text-left p-4 rounded-2xl border-2 transition-all font-bold text-lg ${formData.mainObstacle === opt ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg' : attemptedNext && !formData.mainObstacle ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿Qué sientes que más necesitas de nosotros en este momento? *</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                "Claridad sobre qué vender",
                                "Conseguir tráfico",
                                "Convertir visitas en ventas",
                                "Crear contenido",
                                "Automatizar procesos",
                                "Tener una estrategia paso a paso",
                                "Mantener constancia",
                                "Entender herramientas de IA"
                            ].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        setFormData({...formData, communityExpectation: opt});
                                        setAttemptedNext(false);
                                    }}
                                    className={`text-left p-4 rounded-2xl border-2 transition-all font-bold text-lg ${formData.communityExpectation === opt ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg' : attemptedNext && !formData.communityExpectation ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white'}`}
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
            title: "🔍 PREGUNTA DE ORO",
            description: "Para darte acceso total, necesitamos saber dónde estás hoy y qué tan serio es tu compromiso.",
            content: (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">¿En qué nicho te encuentras o te gustaría enfocarte? *</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { id: "salud", label: "Salud y Bienestar", icon: "🍎" },
                                { id: "dinero", label: "Dinero y Negocios", icon: "💰" },
                                { id: "relaciones", label: "Relaciones y Crecimiento", icon: "🤝" },
                                { id: "tecnologia", label: "Tecnología y Software", icon: "💻" },
                                { id: "educacion", label: "Educación y Cursos", icon: "🎓" },
                                { id: "otro", label: "Otro Nicho / No sé", icon: "❓" }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        setFormData({...formData, niche: opt.label});
                                        setAttemptedNext(false);
                                    }}
                                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all gap-2 ${formData.niche === opt.label ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg' : attemptedNext && !formData.niche ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    <span className="text-3xl">{opt.icon}</span>
                                    <span className="font-bold text-lg text-center">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider text-emerald-400">¿Qué tan comprometido estás para tener resultados en los próximos 90 días? *</label>
                        <div className="space-y-3">
                            {[
                                { level: "Bajo", label: "Solo tengo curiosidad, no quiero invertir tiempo ahora.", color: "text-gray-500" },
                                { level: "Medio", label: "Tengo interés y puedo dedicarle unas horas semanales.", color: "text-blue-400" },
                                { level: "Alto", label: "Estoy decidido a que esto funcione y lo haré prioridad.", color: "text-emerald-400" },
                                { level: "Total", label: "Lo haré cueste lo que cueste, mi éxito depende de esto.", color: "text-emerald-500" }
                            ].map(opt => (
                                <button
                                    key={opt.level}
                                    onClick={() => {
                                        setFormData({...formData, urgencyLevel: opt.label});
                                        setAttemptedNext(false);
                                    }}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${formData.urgencyLevel === opt.label ? 'bg-emerald-500/20 border-emerald-500 text-white' : attemptedNext && !formData.urgencyLevel ? 'border-red-500/50 bg-red-500/5' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-black uppercase tracking-widest ${opt.color}`}>{opt.level}</span>
                                        <span className="font-bold text-lg">{opt.label}</span>
                                    </div>
                                    {formData.urgencyLevel === opt.label && <Check className="w-6 h-6 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
    ];

    const handleNext = () => {
        const isValid = validateStep(step);
        
        if (!isValid) {
            setAttemptedNext(true);
            return;
        }

        setAttemptedNext(false);
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
            setAttemptedNext(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        console.log("🚀 Iniciando envío de encuesta...");
        console.log("📦 Datos a enviar:", JSON.stringify(formData, null, 2));

        // Validación final de seguridad
        const isAllValid = Array.from({length: steps.length}, (_, i) => validateStep(i)).every(v => v);
        
        if (!isAllValid) {
            console.error("❌ Error de validación final detectado.");
            alert("Por favor rellena todos los campos obligatorios antes de finalizar.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.submitSurvey(formData);
            console.log("✅ Encuesta guardada exitosamente:", response);
            onComplete();
        } catch (error) {
            console.error("❌ Error al guardar la encuesta:", error);
            alert("Ocurrió un error al guardar la encuesta. Revisa tu conexión.");
        } finally {
            setLoading(false);
        }
    };

    const progress = ((step + 1) / steps.length) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto py-8 px-4">
            {/* Header Progresivo */}
            <div id="survey-step-header" className="mb-12 scroll-mt-32">
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
                            <p className="text-white text-xl md:text-2xl leading-relaxed font-bold">
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
