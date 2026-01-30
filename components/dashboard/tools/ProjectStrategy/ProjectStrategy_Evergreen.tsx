import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Check, Info, Crown, Mail, ArrowRight, BookOpen, ChevronRight, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlanFeatures, PlanLimits, Plan, Article } from '../../../../types';

interface ProjectStrategy_EvergreenProps {
    evergreenData: any[];
    avatars: any[];
    activeEvergreenEmail: number;
    setActiveEvergreenEmail: (idx: number) => void;
    onUpgrade: () => void;
    
    // Props de límites y datos vinculados
    features?: PlanFeatures;
    planLimits?: PlanLimits;
    nextPlan?: Plan | null;
    linkedArticles?: Article[];
}

export const ProjectStrategy_Evergreen: React.FC<ProjectStrategy_EvergreenProps> = ({
    evergreenData, avatars, activeEvergreenEmail, setActiveEvergreenEmail, onUpgrade, features, planLimits, nextPlan, linkedArticles = []
}) => {
    const navigate = useNavigate();

    // Si no hay artículos, mostramos el estado vacío con invitación a generar contenido
    if (linkedArticles.length === 0) {
        return (
            <div id="psd-evergreen-empty" className="space-y-12 animate-in fade-in duration-500 pt-8">
                <div id="psd-evergreen-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                        <Sparkles className="w-4 h-4" /> Correos Electrónicos a largo plazo
                    </div>
                    <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                        Secuencia de Autoridad <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">(Evergreen)</span>
                    </h3>
                    <p className="text-gray-300 text-xl font-light border-l-4 border-orange-500 pl-8 py-2">
                        Esta secuencia se construye automáticamente a partir de los artículos que generes en la sección "Contenido". Cada artículo se transforma en un punto de contacto para nutrir a tu audiencia.
                    </p>
                </div>

                <div className="bg-[#111] p-16 rounded-[3rem] border border-white/5 text-center space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <BookOpen className="w-32 h-32 text-orange-500" />
                    </div>
                    <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mx-auto border border-orange-500/20 shadow-lg">
                        <Info className="w-10 h-10" />
                    </div>
                    <div className="max-w-md mx-auto">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Sin contenidos generados</h4>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Para activar la secuencia Evergreen, primero debes redactar al menos un artículo SEO en la pestaña "Generar Estrategia de Contenidos".
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate({ search: "?section=content" })}
                        className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center gap-3 mx-auto transform hover:scale-[1.03]"
                    >
                        Ir a Generar Contenidos <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    // Mapeamos los artículos reales a una secuencia dinámica
    const dynamicSequence = linkedArticles.map((article, idx) => ({
        id: article.id,
        day: `Día ${8 + (idx * 7)}`,
        subject: `[LECTURA RECOMENDADA] ${article.title}`,
        type: 'Evergreen / Valor',
        objective: 'Construir autoridad de marca enviando tráfico al blog de tu landing page.',
        bodyPreview: `Hola ${avatars[0]?.name.split(' ')[0] || 'amiga'}, hoy quiero compartir contigo un tema vital que acabamos de publicar en nuestro portal: "${article.title}". Entender esto es fundamental para tu éxito...`,
        articleSlug: article.slug
    }));

    const activeEmail = dynamicSequence[activeEvergreenEmail] || dynamicSequence[0];

    return (
        <div id="psd-evergreen-section" className="space-y-12 animate-in fade-in duration-500 pt-8">
            {/* ENCABEZADO ESTRATÉGICO */}
            <div id="psd-evergreen-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                    <Sparkles className="w-4 h-4" /> Secuencia dinámica activa
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Tu Estrategia <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Evergreen de 30 Días</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-10 text-white text-xl leading-relaxed font-light">
                    <p className="border-l-4 border-blue-500 pl-8 py-2">
                        Tienes {linkedArticles.length} artículos vinculados. El sistema ha programado estos correos para enviarse a partir del Día 8, manteniendo tu oferta presente sin ser invasivo.
                    </p>
                    <p className="border-l-4 border-orange-500 pl-8 py-2">
                        Cada clic hacia tu blog no solo educa al prospecto, sino que aumenta el deseo de adquirir tu solución profesional definitiva.
                    </p>
                </div>
            </div>

            {/* CUADRÍCULA DE 12 COLUMNAS: LISTA + VISTA PREVIA */}
            <div id="psd-evergreen-grid" className="grid lg:grid-cols-12 gap-8 max-w-[85em] mx-auto">
                
                {/* COLUMNA IZQUIERDA: LISTADO DE CORREOS (Ocupa 4 de 12) */}
                <div id="psd-evergreen-list-col" className="lg:col-span-4 bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-orange-900/30 rounded-2xl text-orange-400 border border-orange-900/50">
                            <Mail className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white tracking-tight">Cronograma de Autoridad</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Sincronizado con tus Artículos</p>
                        </div>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                        {dynamicSequence.map((email, idx) => (
                            <div 
                                key={email.id} 
                                onClick={() => setActiveEvergreenEmail(idx)}
                                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-5 ${activeEvergreenEmail === idx ? 'bg-orange-900/10 border-orange-500/30 shadow-xl' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${activeEvergreenEmail === idx ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                        {email.day.split(' ')[1]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${activeEvergreenEmail === idx ? 'text-orange-400' : 'text-gray-600'}`}>
                                            {email.day}
                                        </p>
                                        <h5 className={`font-bold text-lg leading-tight whitespace-normal break-words ${activeEvergreenEmail === idx ? 'text-white' : 'text-gray-400'}`}>
                                            {email.subject}
                                        </h5>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <Check className={`w-5 h-5 ${activeEvergreenEmail === idx ? 'text-orange-500' : 'text-gray-800'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA: VISTA PREVIA DEL CORREO (Ocupa 8 de 12) */}
                <div id="psd-evergreen-preview-col" className="lg:col-span-8 bg-[#0b0b0b] border border-gray-800 rounded-[3rem] p-10 flex flex-col relative overflow-hidden h-full min-h-[600px] shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Calendar className="w-40 h-40 text-orange-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-orange-900/20 text-orange-400 border border-orange-900/50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {activeEmail.type}
                                </span>
                                <span className="text-gray-600 font-mono text-xs font-bold">{activeEmail.day}</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">{activeEmail.subject}</h3>
                        </div>

                        <div className="bg-orange-900/10 border border-orange-500/20 p-6 rounded-2xl mb-10 flex gap-4">
                            <Info className="w-6 h-6 text-orange-400 shrink-0" />
                            <p className="text-gray-300 text-base leading-relaxed">
                                <span className="font-bold text-orange-200 block mb-1">Estrategia Detrás:</span>
                                {activeEmail.objective}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-2xl p-10 text-gray-900 font-serif leading-relaxed text-xl flex-1 border-2 border-gray-200 flex flex-col">
                            <div className="border-b border-gray-100 pb-6 mb-8 text-sm text-gray-400 font-sans italic">
                                <p>De: Tu Marca Profesional</p>
                                <p>Asunto: {activeEmail.subject}</p>
                            </div>

                            <p className="mb-6">Hola {avatars[0]?.name.split(' ')[0] || 'amiga'},</p>
                            <p className="mb-8">{activeEmail.bodyPreview}</p>
                            
                            <div className="my-10 text-center">
                                <div className="inline-block px-10 py-5 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl pointer-events-none">
                                    Hacer clic para leer el artículo
                                </div>
                                <p className="text-gray-400 text-xs mt-4 font-sans italic">El enlace dirigirá automáticamente al blog de tu landing page.</p>
                            </div>

                            <div className="mt-auto pt-8 border-t border-gray-100 font-sans">
                                <p className="text-base text-gray-500">Un abrazo,<br/><strong>Tu Equipo.</strong></p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <button 
                                onClick={() => navigate('/dashboard/email')}
                                className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center gap-3 transform active:scale-95"
                            >
                                <PenTool className="w-5 h-5" /> Configurar en Systeme.io
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FOOTER INFORMATIVO */}
            <div className="max-w-[70em] mx-auto text-center pt-12 border-t border-white/5 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sistema Evergreen Automatizado v2.9 — Motor de Autoridad Dinámico</p>
            </div>
        </div>
    );
};
