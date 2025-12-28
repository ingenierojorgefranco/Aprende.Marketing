
import React from 'react';
import { Search, AlertCircle, Sparkles, Target, ShieldCheck, Brain, Zap, Magnet, Shield, Quote, Crown, MessageSquare, X, Check, Lock, GraduationCap, Flame, AlertTriangle, Rocket, ArrowRight } from 'lucide-react';
import { ProjectStrategy_Psychology } from './ProjectStrategy_Psychology';

interface ProjectStrategy_AvatarDiagnosisProps {
    avatars: any[];
    psychology: {
        pains: string[];
        solutions: string[];
        awarenessStages: {
            stage1_pain: string;
            stage2_solution: string;
            stage3_barrier: string;
        };
        buyingPsychology: {
            notBuyingReasons: Array<{ title: string; description: string }>;
            buyingReasons: Array<{ title: string; description: string }>;
            strategistConclusion: string;
        };
        conversionStrategy: {
            mainFocus: Array<{ label: string; description: string }>;
            prioritizedChannels: Array<{ label: string; type: string }>;
            communicationStyle: Array<{ label: string; description: string }>;
            tacticalNote: string;
        };
        psychographicProfile?: {
            ageRange: string;
            interests: string;
            primaryDesire: string;
            digitalBehavior: string;
            mainBarrier: string;
        };
    };
}

export const ProjectStrategy_AvatarDiagnosis: React.FC<ProjectStrategy_AvatarDiagnosisProps> = ({ avatars, psychology }) => {
    // Definimos los roles estratégicos para cada posición en el array
    const roles = [
        { 
            label: "Estrategia de Atracción", 
            desc: "Usado para Títulos (H1), Anuncios y Video de Ventas (VSL).", 
            icon: Magnet, 
            color: "text-pink-400", 
            bg: "bg-pink-500/10",
            border: "border-pink-500/20"
        },
        { 
            label: "Estrategia de Autoridad", 
            desc: "Usado para Emails de Lógica, Testimonios y Casos de Éxito.", 
            icon: Shield, 
            color: "text-purple-400", 
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        { 
            label: "Estrategia de Cierre", 
            desc: "Usado para Scripts de WhatsApp y manejo de Objeciones finales.", 
            icon: MessageSquare, 
            color: "text-blue-400", 
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        }
    ];

    // Helper para obtener el badge según el índice
    const getAvatarRoleBadge = (idx: number) => {
        const badges = [
            { label: "Avatar Prioritario (Base de la Landing Page)", gradient: "from-pink-600 to-rose-600" },
            { label: "Avatar Secundario (Secuencia de Seguimiento)", gradient: "from-purple-600 to-indigo-600" },
            { label: "Avatar Terciario (Secuencia de Cierre)", gradient: "from-blue-600 to-cyan-600" }
        ];
        const badge = badges[idx] || badges[0];

        return (
            <div className={`absolute top-0 right-0 bg-gradient-to-l ${badge.gradient} text-white text-[10px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 z-20`}>
                <Crown className="w-3 h-3" /> {badge.label}
            </div>
        );
    };

    // Helper para generar explicaciones estratégicas de los pilares de transformación
    const getPilarStrategyReason = (index: number) => {
        const reasons = [
            "Al tener clara esta meta, nuestra IA redactará tus anuncios y el video de ventas enfocándose en la 'seguridad técnica', eliminando el miedo al error que frena la compra de tu prospecto.",
            "Esta es la promesa económica. El sistema la usará en tus correos de seguimiento para pintar un cuadro de libertad financiera en la mente del cliente, haciendo que el precio del producto parezca una inversión pequeña comparada con el retorno.",
            "Este pilar ataca la autoridad. Al identificarlo, el sistema genera testimonios y casos de éxito ficticios pero ultra-realistas que validan que tu método es el camino más corto al éxito.",
            "Sirve para cerrar la venta por WhatsApp. Esta transformación específica le da a tu equipo de ventas el argumento final para derribar las últimas dudas del cliente más exigente."
        ];
        return reasons[index] || "Identificar este pilar permite que nuestra IA personalice cada mensaje de tu embudo, asegurando que el cliente sienta que el producto fue diseñado exclusivamente para sus necesidades.";
    };

    // Extraemos el perfil psicográfico para renderizado dinámico
    const profile = psychology.psychographicProfile;
    const buyingPsych = psychology.buyingPsychology;
    const convStrategy = psychology.conversionStrategy;

    return (
        <div id="psd-avatar-diagnosis-section" className="space-y-16 pt-8">
            
            {/* --- CABECERA DE SECCIÓN --- */}
            <div id="psd-integrated-avatars-header" className="max-w-[70em] mx-auto text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-widest animate-pulse">
                    <Sparkles className="w-4 h-4" /> Inteligencia de Clientes
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                    <Search className="w-12 h-12 text-blue-500" /> ¿Cuales son tus clientes ideales?
                </h3>
                
                <div className="space-y-6 text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                    <p>
                        Hemos identificado 3 perfiles de clientes que podrían estar interesados en adquirir tu propudcto digital, lo que hará nuestro sistema es crear todos los contenidos y estrategia de venta basándose en estos 3 perfiles estrategicos.
                    </p>
                </div>
            </div>

            {/* --- LISTA DE AVATARES --- */}
            <div id="psd-avatars-list" className="space-y-12 max-w-[70em] mx-auto">
                {avatars.map((avatar: any, idx: number) => {
                    const role = roles[idx] || roles[0];
                    const isMain = idx === 0;

                    return (
                        <div key={avatar.id} className={`group relative bg-gray-900/40 backdrop-blur-md rounded-[2.5rem] border transition-all duration-500 shadow-2xl overflow-hidden ${isMain ? 'border-pink-500/30 shadow-pink-500/5' : idx === 1 ? 'border-purple-500/20' : 'border-blue-500/20'}`}>
                            
                            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>

                            {getAvatarRoleBadge(idx)}

                            <div className="p-8 md:p-12">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
                                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                                        <div className="relative mb-6">
                                            <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                                            <div className="w-28 h-28 rounded-3xl bg-gray-800 border-2 border-white/10 flex items-center justify-center text-5xl shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                                                {idx === 0 ? '👩‍🎨' : idx === 1 ? '👩‍💼' : '👩‍👧'}
                                            </div>
                                        </div>
                                        <h4 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">{avatar.name}</h4>
                                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                            <span className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/10 text-sm font-black text-gray-200 uppercase tracking-wider">{avatar.age}</span>
                                            <span className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/10 text-sm font-black text-gray-200 uppercase tracking-wider">{avatar.archetype}</span>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-7">
                                        <div className="mb-3">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Pensamiento dominante</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 relative group/quote">
                                            <Quote className="absolute top-6 left-6 w-12 h-12 text-white/5 -scale-x-100" />
                                            <p className="text-gray-200 italic text-xl md:text-xl leading-relaxed font-serif relative z-10 pl-4">
                                                "{avatar.quote}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div>
                                            <h5 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-yellow-500" /> Impulsores Psicológicos
                                            </h5>
                                            <div className="space-y-6">
                                                {Object.entries(avatar.motivations).map(([key, value]: any) => (
                                                    <div key={key} className="space-y-2">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-sm text-gray-300 font-bold capitalize tracking-wide">{key}</span>
                                                            <span className="text-xs font-mono text-white/50">{value}%</span>
                                                        </div>
                                                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                                            <div 
                                                                className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)] ${idx === 0 ? 'bg-gradient-to-r from-pink-600 to-rose-400' : idx === 1 ? 'bg-gradient-to-r from-purple-600 to-fuchsia-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} 
                                                                style={{width: `${value}%`}}
                             ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={`p-6 rounded-2xl border ${role.bg} ${role.border} flex gap-5 items-start`}>
                                            <div className={`p-3 rounded-xl bg-black/40 ${role.color} shrink-0`}>
                                                <role.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${role.color}`}>{role.label}</p>
                                                <p className="text-gray-300 text-sm leading-relaxed">{role.desc}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-2xl group/card hover:bg-rose-500/10 transition-colors">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><AlertCircle className="w-5 h-5" /></div>
                                                <p className="text-xs font-black text-rose-400 uppercase tracking-widest">Dolor Principal</p>
                                            </div>
                                            <p className="text-gray-200 text-lg leading-relaxed font-medium">{avatar.pain}</p>
                                        </div>

                                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl group/card hover:bg-emerald-500/10 transition-colors">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Target className="w-5 h-5" /></div>
                                                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Deseo profundo</p>
                                            </div>
                                            <p className="text-gray-200 text-lg leading-relaxed font-medium">{avatar.desire}</p>
                                        </div>

                                        <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl group/card hover:bg-blue-500/10 transition-colors">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><ShieldCheck className="w-5 h-5" /></div>
                                                <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Objeción de Ventas</p>
                                            </div>
                                            <p className="text-gray-200 text-lg leading-relaxed font-medium">{avatar.objection}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- BLOQUE: DIAGNÓSTICO DE MERCADO PROFUNDO (DINÁMICO) --- */}
            <div id="psd-market-deep-diagnosis" className="max-w-[70em] mx-auto space-y-12">
                
                <div id="psd-psychographic-header" className="space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-black uppercase tracking-widest animate-pulse">
                        <Brain className="w-4 h-4" /> Análisis Psicológico
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                        <Brain className="w-12 h-12 text-purple-500" /> Perfil Psicológico de tu Cliente Ideal
                    </h3>
                    <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                        Este análisis ha sido generado por nuestra IA cruzando los datos de tu producto con los perfiles de avatar detectados anteriormente. Es la brújula que guía cada palabra de tu estrategia.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Perfil Psicográfico Dinámico (EXTRAIDO DEL SCHEMA) */}
                    <div className="bg-gray-900/60 rounded-[2rem] border border-gray-800 p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Zap className="w-24 h-24 text-purple-500" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Brain className="w-6 h-6 text-purple-400" /> Perfil Psicográfico
                        </h4>
                        <div className="space-y-4 text-gray-300 text-[1.2rem] leading-[1.6] font-light">
                            <ul className="space-y-5">
                                <li className="flex gap-4 items-start">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0 mt-1" /> 
                                    <div>
                                        <b className="text-white block text-sm uppercase tracking-wider mb-1">Rango de Edad:</b> 
                                        {profile?.ageRange || avatars[0].age}
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0 mt-1" /> 
                                    <div>
                                        <b className="text-white block text-sm uppercase tracking-wider mb-1">Intereses Detectados:</b> 
                                        {profile?.interests || "Estética, belleza y autoempleo"}
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0 mt-1" /> 
                                    <div>
                                        <b className="text-white block text-sm uppercase tracking-wider mb-1">Deseo Principal:</b> 
                                        {profile?.primaryDesire || avatars[0].desire}
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0 mt-1" /> 
                                    <div>
                                        <b className="text-white block text-sm uppercase tracking-wider mb-1">Comportamiento Digital:</b> 
                                        {profile?.digitalBehavior || avatars[0].behavior}
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0 mt-1" /> 
                                    <div>
                                        <b className="text-white block text-sm uppercase tracking-wider mb-1">Miedo o Barrera:</b> 
                                        {profile?.mainBarrier || avatars[0].objection}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Dolores Detectados Dinámicos */}
                    <div className="bg-gray-900/60 rounded-[2rem] border border-gray-800 p-8 shadow-xl">
                        <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-rose-400" /> Dolores Detectados
                        </h4>
                        <div className="space-y-4 text-gray-300 text-[1.3rem] leading-[1.8] font-light">
                            <ul className="space-y-4">
                                {psychology.pains.map((pain, pIdx) => (
                                    <li key={pIdx} className="flex gap-3">
                                        <X className="w-5 h-5 text-rose-500 shrink-0 mt-2" /> 
                                        {pain}
                                    </li>
                                ))}
                                {psychology.pains.length === 0 && <li className="text-gray-500 italic">No hay dolores definidos.</li>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Transformación Buscada Dinámica */}
                <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/10 rounded-[2rem] border border-emerald-500/20 p-8 shadow-xl">
                    <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-emerald-400" /> ¿Cuál es la transformación que busca tu cliente?
                    </h4>
                    <div className="grid md:grid-cols-2 gap-8">
                        {psychology.solutions.map((sol, sIdx) => (
                            <div key={sIdx} className="bg-black/40 p-6 rounded-[2rem] border border-emerald-500/10 flex flex-col gap-4">
                                <div>
                                    <p className="text-emerald-400 font-black text-base uppercase tracking-[0.1em] mb-2">Pilar Estratégico #{sIdx + 1}</p>
                                    <div className="h-px w-12 bg-emerald-500/30"></div>
                                </div>
                                
                                <div>
                                    <b className="text-white block text-sm uppercase tracking-wider mb-1 opacity-60">Lo que el cliente logrará:</b>
                                    <p className="text-gray-200 text-[1.3rem] leading-[1.8] font-light italic">
                                        "{sol}"
                                    </p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <b className="text-emerald-300 block text-xs uppercase tracking-widest mb-2">¿Para qué sirve identificar esto?</b>
                                    <p className="text-gray-400 text-base leading-relaxed font-light">
                                        {getPilarStrategyReason(sIdx)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {psychology.solutions.length === 0 && (
                            <div className="col-span-full py-4 text-center text-gray-500 italic">No hay soluciones definidas.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- NIVELES DE CONCIENCIA DEL PROSPECTO --- */}
            <div id="psd-awareness-section" className="max-w-[70em] mx-auto space-y-12">
                <div id="psd-awareness-header" className="space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-widest animate-pulse">
                        <Target className="w-4 h-4" /> Grados de Consciencia
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                        <Target className="w-12 h-12 text-orange-500" /> Nivel de Conciencia del Prospecto
                    </h3>
                    <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                        Entender el grado de consciencia de tu cliente es la clave para no venderle antes de tiempo. Este mapa nos permite saber qué tan cerca está de tomar la decisión y qué información necesita para avanzar al siguiente nivel.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gray-800 hidden md:block -z-10"></div>
                    
                    <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 text-center flex flex-col items-center gap-4 hover:border-orange-500/30 transition-all">
                        <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400 font-black">1</div>
                        <p className="text-rose-400 font-black uppercase text-xs tracking-widest">Nivel: Dolor</p>
                        <h5 className="text-xl font-bold text-white">Consciente del Problema</h5>
                        <p className="text-gray-400 text-base leading-relaxed">"{psychology.awarenessStages.stage1_pain}"</p>
                    </div>

                    <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 text-center flex flex-col items-center gap-4 hover:border-orange-500/30 transition-all">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-black">2</div>
                        <p className="text-blue-400 font-black uppercase text-xs tracking-widest">Nivel: Solución</p>
                        <h5 className="text-xl font-bold text-white">Consciente de la Solución</h5>
                        <p className="text-gray-400 text-base leading-relaxed">"{psychology.awarenessStages.stage2_solution}"</p>
                    </div>

                    <div className="bg-orange-500/10 rounded-3xl p-8 border border-orange-500/40 text-center flex flex-col items-center gap-4 transform md:scale-105 shadow-2xl">
                        <div className="w-12 h-12 bg-orange-500 text-black rounded-full flex items-center justify-center text-xl font-black">!</div>
                        <p className="text-orange-400 font-black uppercase text-xs tracking-widest">Oportunidad de Cierre</p>
                        <h5 className="text-xl font-bold text-white">Barrera Detectada</h5>
                        <p className="text-gray-300 text-base leading-relaxed">"{psychology.awarenessStages.stage3_barrier}"</p>
                    </div>
                </div>
            </div>

            {/* --- PSICOLOGÍA DE COMPRA IDENTIFICADA --- */}
            <div id="psd-buy-psychology-section" className="max-w-[70em] mx-auto space-y-12">
                <div id="psd-awareness-header" className="space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-black uppercase tracking-widest animate-pulse">
                        <Brain className="w-4 h-4" /> Gatillos de Venta
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                        <Brain className="w-12 h-12 text-yellow-500" /> Psicología de Compra Identificada
                    </h3>
                    <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                        No compramos productos, compramos mejores versiones de nosotros mismos. Hemos configurado tu mensaje de ventas basándonos en los disparadores psicológicos exactos que activan el deseo de posesión y confianza en tu cliente ideal.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-red-900/5 border border-red-500/20 rounded-[2.5rem] p-8 space-y-8">
                        <h5 className="text-xl font-black text-rose-400 flex items-center gap-2 uppercase tracking-tight">
                            <X className="w-6 h-6" /> El cliente NO COMPRA cuando:
                        </h5>
                        <div className="space-y-6">
                            {buyingPsych.notBuyingReasons.map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                                    <div>
                                        <p className="text-white font-bold text-lg leading-none mb-1">{item.title}</p>
                                        <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                            {buyingPsych.notBuyingReasons.length === 0 && <p className="text-gray-500 italic">No se han definido razones de no-compra.</p>}
                        </div>
                    </div>

                    <div className="bg-emerald-900/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-8">
                        <h5 className="text-xl font-black text-emerald-400 flex items-center gap-2 uppercase tracking-tight">
                            <Check className="w-6 h-6" /> El cliente COMPRA cuando:
                        </h5>
                        <div className="space-y-6">
                            {buyingPsych.buyingReasons.map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                                    <div>
                                        <p className="text-white font-bold text-lg leading-none mb-1">{item.title}</p>
                                        <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                            {buyingPsych.buyingReasons.length === 0 && <p className="text-gray-500 italic">No se han definido razones de compra.</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900/80 border border-gray-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Lock className="w-32 h-32 text-white" />
                    </div>
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h5 className="text-blue-400 font-black text-sm uppercase tracking-widest mb-2">Conclusión del Estratega</h5>
                        <p className="text-white italic text-xl md:text-2xl leading-relaxed font-serif">
                            "{buyingPsych.strategistConclusion || "El sistema optimizará el mensaje basándose en la seguridad y el respaldo técnico."}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[70em] mx-auto">
                <ProjectStrategy_Psychology psychology={psychology} />
            </div>

            {/* --- ESTRATEGIA DE CONVERSIÓN DEFINIDA (DINÁMICA) --- */}
            <div id="psd-conversion-strategy-section" className="max-w-[70em] mx-auto space-y-12">
                <div id="psd-strategy-header" className="space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-black uppercase tracking-widest animate-pulse">
                        <Zap className="w-4 h-4" /> Hoja de Ruta
                    </div>
                    <h3 id="psd-strategy-title" className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                        <Zap className="w-12 h-12 text-yellow-500" /> Estrategia de Conversión Definida
                    </h3>
                    <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                        Basándonos en el análisis del avatar y su psicología de compra, el sistema ha definido la siguiente hoja de ruta estratégica para tus canales.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/10 via-black to-black rounded-[3rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Target className="w-64 h-64 text-white" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {/* Enfoque Principal Dinámico */}
                        <div className="space-y-6 group">
                            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                                <Flame className="w-8 h-8 text-orange-500" />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Enfoque Principal</h4>
                            <ul className="space-y-4">
                                {convStrategy.mainFocus.map((item, i) => (
                                    <li key={i} className="space-y-1">
                                        <p className="text-orange-400 font-bold text-base">{item.label}</p>
                                        <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light">{item.description}</p>
                                    </li>
                                ))}
                                {convStrategy.mainFocus.length === 0 && <p className="text-gray-500 italic">No definido.</p>}
                            </ul>
                        </div>

                        {/* Canales Prioritarios Dinámicos */}
                        <div className="space-y-6 group">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-8 h-8 text-blue-500" />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Canales Prioritarios</h4>
                            <div className="space-y-4">
                                {convStrategy.prioritizedChannels.map((chan, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group/item hover:bg-white/10 transition-colors">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 ${chan.type === 'LP' ? 'bg-blue-600' : chan.type === 'WA' ? 'bg-green-600' : 'bg-orange-600'}`}>
                                            {chan.type}
                                        </div>
                                        <p className="text-gray-300 font-bold text-sm">{chan.label}</p>
                                    </div>
                                ))}
                                {convStrategy.prioritizedChannels.length === 0 && <p className="text-gray-500 italic">No definidos.</p>}
                            </div>
                        </div>

                        {/* Tipo de Comunicación Dinámico */}
                        <div className="space-y-6 group">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-8 h-8 text-purple-500" />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Tipo de Comunicación</h4>
                            <ul className="space-y-4">
                                {convStrategy.communicationStyle.map((item, i) => (
                                    <li key={i} className="space-y-1">
                                        <p className="text-purple-400 font-bold text-base">{item.label}</p>
                                        <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light">{item.description}</p>
                                    </li>
                                ))}
                                {convStrategy.communicationStyle.length === 0 && <p className="text-gray-500 italic">No definido.</p>}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="max-w-[70em] mx-auto flex gap-6 items-center bg-gray-900/50 p-6 rounded-2xl border border-gray-800 border-dashed">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 border border-blue-500/30">
                        <ShieldCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light">
                        <b className="text-blue-300 block mb-1">Nota Táctica:</b>
                        {convStrategy.tacticalNote || "El sistema optimizará el flujo basándose en la máxima tasa de conversión detectada para tu nicho."}
                    </p>
                </div>
            </div>
        </div>
    );
};
