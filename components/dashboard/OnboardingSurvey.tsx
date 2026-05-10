import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Send, Mail, User, Globe, Phone, Target, BarChart, Rocket, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';

interface OnboardingSurveyProps {
    onComplete: () => void;
}

export const OnboardingSurvey: React.FC<OnboardingSurveyProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        countryCity: '',
        whatsapp: '',
        mainObjectives: [] as string[],
        dedicationTime: '',
        hasWebsite: '',
        websiteUrl: '',
        useSocialMedia: [] as string[],
        hotmartExperience: {
            hasKnowledge: '',
            hasHotmartAcc: '',
            promotedProductType: '',
            funnelMastery: '',
            emailMarketingExp: '',
            landingPageExp: ''
        },
        interests: {
            productTypes: [] as string[],
            specificProduct: ''
        },
        resources: {
            hasMentor: '',
            hasBudget: ''
        },
        obstacles: {
            mainObstacle: '',
            skillToImprove: '',
            communityExpectation: ''
        }
    });

    const steps = [
        {
            title: "Bienvenido",
            description: "Te invitamos a llenar este breve formulario para que podamos entender tus objetivos, experiencia y necesidades.",
            content: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Correo electrónico *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-all"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Cuál es tu Nombre Completo? *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                            <input 
                                type="text" 
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-all"
                                placeholder="Nombre completo"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Cuál es tu País y Ciudad *</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                            <input 
                                type="text" 
                                required
                                value={formData.countryCity}
                                onChange={(e) => setFormData({...formData, countryCity: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-all"
                                placeholder="Ej: Bogotá, Colombia"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Cuál es tu Número de WhatsApp? *</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                            <input 
                                type="tel" 
                                required
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:outline-none transition-all"
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
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Cuál es tu principal objetivo? (Puedes elegir varios)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {[
                                "Aprender a Vender Productos Digitales",
                                "Crear mi Curso Digital en Hotmart",
                                "Aprender a usar correctamente la IA",
                                "Aprender sobre Email Marketing",
                                "Aprender a vender por WhatsApp",
                                "Aprender SEO y Posicionamiento Web",
                                "Crear Páginas Web Profesionales",
                                "Monetizar Redes Sociales"
                            ].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const objectives = formData.mainObjectives.includes(opt)
                                            ? formData.mainObjectives.filter(o => o !== opt)
                                            : [...formData.mainObjectives, opt];
                                        setFormData({...formData, mainObjectives: objectives});
                                    }}
                                    className={`text-left p-3 rounded-xl border transition-all text-sm ${formData.mainObjectives.includes(opt) ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/50'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Cuánto tiempo podrías dedicar semanalmente?</label>
                        <input 
                            type="text" 
                            value={formData.dedicationTime}
                            onChange={(e) => setFormData({...formData, dedicationTime: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all"
                            placeholder="Ej: 2 horas diarias"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "Infraestructura Online",
            description: "Cuéntanos sobre tu presencia digital actual.",
            content: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Tienes una página web o blog? *</label>
                        <div className="flex gap-4">
                            {['SI', 'NO'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setFormData({...formData, hasWebsite: opt})}
                                    className={`flex-1 p-3 rounded-xl border transition-all ${formData.hasWebsite === opt ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    {formData.hasWebsite === 'SI' && (
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">¿Cuál es su URL y sobre qué trata? *</label>
                            <textarea 
                                value={formData.websiteUrl}
                                onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all min-h-[100px]"
                                placeholder="https://..."
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Usas Redes Sociales para tu Negocio?</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {["Instagram", "Facebook", "TikTok", "YouTube", "Telegram", "Discord"].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const sm = formData.useSocialMedia.includes(opt)
                                            ? formData.useSocialMedia.filter(s => s !== opt)
                                            : [...formData.useSocialMedia, opt];
                                        setFormData({...formData, useSocialMedia: sm});
                                    }}
                                    className={`p-3 rounded-xl border transition-all text-sm ${formData.useSocialMedia.includes(opt) ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
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
            title: "Experiencia y Conocimientos",
            description: "Queremos conocer tu nivel actual en marketing digital.",
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 italic">¿Conocimientos previos marketing digital?</label>
                            <div className="flex gap-2">
                                {['SI', 'NO'].map(opt => (
                                    <button key={opt} onClick={() => setFormData({...formData, hotmartExperience: {...formData.hotmartExperience, hasKnowledge: opt}})} className={`flex-1 p-2 text-xs rounded-lg border ${formData.hotmartExperience.hasKnowledge === opt ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5'}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 italic">¿Ya tienes cuenta en Hotmart?</label>
                            <div className="flex gap-2">
                                {['SI', 'NO'].map(opt => (
                                    <button key={opt} onClick={() => setFormData({...formData, hotmartExperience: {...formData.hotmartExperience, hasHotmartAcc: opt}})} className={`flex-1 p-2 text-xs rounded-lg border ${formData.hotmartExperience.hasHotmartAcc === opt ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5'}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Cuánto dominas los embudos de venta?</label>
                        <div className="flex gap-2">
                            {['Mucho', 'Regular', 'Poco', 'Nada'].map(opt => (
                                <button key={opt} onClick={() => setFormData({...formData, hotmartExperience: {...formData.hotmartExperience, funnelMastery: opt}})} className={`flex-1 p-2 text-xs rounded-lg border ${formData.hotmartExperience.funnelMastery === opt ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5'}`}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 italic">¿Experiencia Email Marketing?</label>
                            <div className="flex gap-2">
                                {['SI', 'No'].map(opt => (
                                    <button key={opt} onClick={() => setFormData({...formData, hotmartExperience: {...formData.hotmartExperience, emailMarketingExp: opt}})} className={`flex-1 p-2 text-xs rounded-lg border ${formData.hotmartExperience.emailMarketingExp === opt ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5'}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 italic">¿Sabes crear Landing Pages?</label>
                            <div className="flex gap-2">
                                {['SI', 'No'].map(opt => (
                                    <button key={opt} onClick={() => setFormData({...formData, hotmartExperience: {...formData.hotmartExperience, landingPageExp: opt}})} className={`flex-1 p-2 text-xs rounded-lg border ${formData.hotmartExperience.landingPageExp === opt ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5'}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Intereses y Recursos",
            description: "Define tus preferencias y presupuesto.",
            content: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Qué tipo de productos te interesa promover?</label>
                        <div className="grid grid-cols-2 gap-2">
                            {["Cursos Online", "Ebooks", "Software", "Coaching"].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const prods = formData.interests.productTypes.includes(opt)
                                            ? formData.interests.productTypes.filter(p => p !== opt)
                                            : [...formData.interests.productTypes, opt];
                                        setFormData({...formData, interests: {...formData.interests, productTypes: prods}});
                                    }}
                                    className={`p-3 rounded-xl border transition-all text-sm ${formData.interests.productTypes.includes(opt) ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Presupuesto mensual para herramientas/publicidad?</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['SI', 'NO', 'Definir'].map(opt => (
                                <button key={opt} onClick={() => setFormData({...formData, resources: {...formData.resources, hasBudget: opt}})} className={`p-2 text-xs rounded-lg border ${formData.resources.hasBudget === opt ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5'}`}>{opt}</button>
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
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Cuál es tu mayor obstáculo actual?</label>
                        <textarea 
                            value={formData.obstacles.mainObstacle}
                            onChange={(e) => setFormData({...formData, obstacles: {...formData.obstacles, mainObstacle: e.target.value}})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all min-h-[80px]"
                            placeholder="Describe tu principal reto..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">¿Qué tipo de apoyo esperas de esta comunidad?</label>
                        <textarea 
                            value={formData.obstacles.communityExpectation}
                            onChange={(e) => setFormData({...formData, obstacles: {...formData.obstacles, communityExpectation: e.target.value}})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none transition-all min-h-[80px]"
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
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = async () => {
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
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <div className="space-y-1">
                        <p className="text-emerald-500 font-bold text-sm">PASO {step + 1} DE {steps.length}</p>
                        <h2 className="text-2xl font-black text-white">{steps[step].title}</h2>
                    </div>
                    <p className="text-gray-400 text-sm">{Math.round(progress)}% completado</p>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-emerald-500"
                    />
                </div>
            </div>

            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
            >
                <div className="mb-8">
                    <p className="text-gray-400 leading-relaxed">
                        {steps[step].description}
                    </p>
                </div>

                {steps[step].content}

                <div className="flex gap-4 mt-8">
                    {step > 0 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Atrás
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="flex-[2] py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Guardando...' : step === steps.length - 1 ? 'Finalizar Encuesta' : 'Siguiente'}
                        {step === steps.length - 1 ? (
                            <Send className="w-5 h-5" />
                        ) : (
                            <ChevronRight className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
