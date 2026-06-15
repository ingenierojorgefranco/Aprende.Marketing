import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Flame, AlertTriangle, Brain, 
    Play, TrendingUp, UserCheck, CheckCircle2, Users, Sparkles,
    Target, Star, Zap, Lightbulb, Shield, Loader2,
    MessageSquare, Calendar, ChevronDown, BookOpen, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../../services/api';
import { LandingPage } from '../../../../types';
import { ProjectMasterStrategy } from '../../../../services/strategySchema';

// Mapeo de iconos para renderizado dinámico
const IconMap: Record<string, React.ReactNode> = {
  Users: <Users />,
  Brain: <Brain />,
  Target: <Target />,
  CheckCircle2: <CheckCircle2 />,
  Sparkles: <Sparkles />,
  TrendingUp: <TrendingUp />,
  AlertTriangle: <AlertTriangle />,
  Lightbulb: <Lightbulb />,
  Zap: <Zap />,
  Star: <Star />,
  Shield: <Shield />,
  UserCheck: <UserCheck />,
  BookOpen: <BookOpen />,
  Crown: <Crown />
};

interface ProjectStrategy_PsychologyProps {
    strategy: ProjectMasterStrategy;
    benefitsItems?: Array<{ title: string; desc?: string; description?: string }>;
}
export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ strategy, benefitsItems = [] }) => {
    const { id } = useParams() as { id: string };
    const [localStrategy, setLocalStrategy] = useState<ProjectMasterStrategy | null>(strategy);
    const [isSaving, setIsSaving] = useState(false);
    const [activeAvatarIndex, setActiveAvatarIndex] = useState<number | null>(0);

    const getSystemAvatarsProps = (strategyData: any) => {
        const hasSavedAvatars = !!(strategyData?.avatars && strategyData.avatars.length > 0);
        const defaultAvs = [
            {
                name: "María Fernanda",
                priority: "PRINCIPAL",
                priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
                audiencePct: "68% DE TU AUDIENCIA",
                audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
                age: "28 - 35 años",
                occupation: "Emprendedora",
                income: "Ingresos variables",
                transformation_title: "Si buscas escalar tu negocio con el servicio más rentable del sector estética...",
                detailed_pains: [
                    "Si te frustra ver tu agenda vacía mientras la competencia cobra fortunas por servicios que tú aún no dominas.",
                    "Si te agota trabajar largas jornadas por un ingreso que no refleja tu esfuerzo ni tu talento.",
                    "Si te duele sentirte invisible en un mercado saturado de servicios baratos que nadie valora."
                ]
            },
            {
                name: "Valeria Mendoza",
                priority: "SECUNDARIO",
                priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
                audiencePct: "22% DE TU AUDIENCIA",
                audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
                age: "22 - 27 años",
                occupation: "Cosmetóloga Junior",
                income: "Ingreso fijo bajo",
                transformation_title: "Si buscas escalar tu negocio de belleza con el servicio más lucrativo del mercado actual...",
                detailed_pains: [
                    "Si te frustra ver cómo tu agenda se llena de servicios que apenas cubren tus gastos básicos.",
                    "Si te agota sentirte invisible frente a competidores que cobran el triple que tú.",
                    "Si te duele sentir que tu talento está estancado por no tener una técnica de alto impacto."
                ]
            },
            {
                name: "Mónica Silva",
                priority: "COMPLEMENTARIO",
                priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
                audiencePct: "10% DE TU AUDIENCIA",
                audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
                age: "36 - 45 años",
                occupation: "Emprendedora desde cero",
                income: "Sin ingresos estables",
                transformation_title: "Si sueñas con la libertad de manejar tu propio tiempo sin depender de un sueldo fijo...",
                detailed_pains: [
                    "Si te frustra trabajar más de 10 horas al día sin ver un crecimiento real en tu cuenta bancaria.",
                    "Si te agota la inseguridad de depender de que tus clientas agenden citas de bajo costo.",
                    "Si te duele sentir que no pasas suficiente tiempo de calidad con tu familia por el cansancio."
                ]
            }
        ];

        return [0, 1, 2].map((idx) => {
            const defaultAv = defaultAvs[idx];
            const realAv = strategyData?.avatars?.[idx];
            
            if (!realAv) {
                if (hasSavedAvatars) {
                    return {
                        id: `fallback-${idx}`,
                        name: "(no definido)",
                        priority: idx === 0 ? "PRINCIPAL" : idx === 1 ? "SECUNDARIO" : "COMPLEMENTARIO",
                        priorityClass: idx === 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border" : idx === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-400 border" : "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
                        audiencePct: idx === 0 ? "68% DE TU AUDIENCIA" : idx === 1 ? "22% DE TU AUDIENCIA" : "10% DE TU AUDIENCIA",
                        audienceClass: idx === 0 ? "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border" : idx === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-550 border" : "bg-violet-500/10 border-violet-500/30 text-violet-550 border",
                        img: idx === 0 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300" : idx === 1 ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
                        age: "(no definido)",
                        occupation: "(no definido)",
                        income: "(no definido)",
                        transformation_title: defaultAv.transformation_title,
                        detailed_pains: defaultAv.detailed_pains
                    };
                }
                return { ...defaultAv, id: `default-${idx}` };
            }

            const id = realAv.id || `real-${idx}`;
            const name = realAv.name || (hasSavedAvatars ? "(no definido)" : defaultAv.name);
            const age = realAv.ageRange || realAv.age || realAv.age_range || (hasSavedAvatars ? "(no definido)" : defaultAv.age);
            const occupation = realAv.archetype || realAv.occupation || realAv.profession || realAv.profession_title || realAv.job || realAv.role || (hasSavedAvatars ? "(no definido)" : defaultAv.occupation);
            const income = realAv.incomeRange || realAv.income || (hasSavedAvatars ? "(no definido)" : defaultAv.income);
            const img = realAv.image || realAv.img || defaultAv.img;

            const rawPriority = (realAv.priority || realAv.role || realAv.type || defaultAv.priority || "").toUpperCase();
            const priority = rawPriority;
            let priorityClass = defaultAv.priorityClass;

            if (rawPriority.includes("PRINCIPAL")) {
                priorityClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border";
            } else if (rawPriority.includes("SECUNDARIO")) {
                priorityClass = "bg-amber-500/10 border-amber-500/30 text-amber-400 border";
            } else if (rawPriority.includes("COMPLEMENTARIO")) {
                priorityClass = "bg-violet-500/10 border-violet-500/30 text-violet-400 border";
            }

            let transformation_title = realAv.transformation_title || realAv.learning_hook || defaultAv.transformation_title;
            
            // Comparación cruzada para dolores cargados
            const customPains = strategyData?.psychology?.pains && Array.isArray(strategyData.psychology.pains)
                ? strategyData.psychology.pains.filter((p: any) => 
                    p && typeof p !== 'string' && 
                    (String(p.avatarId) === String(id) || String(p.avatarId) === String(idx + 1))
                  )
                : [];
            
            let detailed_pains = defaultAv.detailed_pains;
            if (customPains.length > 0) {
                detailed_pains = customPains.map((p: any) => typeof p === 'string' ? p : p.text);
            } else if (realAv.detailed_pains && Array.isArray(realAv.detailed_pains) && realAv.detailed_pains.length > 0) {
                detailed_pains = realAv.detailed_pains;
            } else {
                detailed_pains = [
                    realAv.pain ? `Si te frustra ver que: ${realAv.pain}` : defaultAv.detailed_pains[0],
                    realAv.daily_manifestation ? `Si te agota sentir que: ${realAv.daily_manifestation}` : defaultAv.detailed_pains[1],
                    realAv.objection ? `Si te duele dudar sobre: ${realAv.objection}` : defaultAv.detailed_pains[2]
                ].filter(Boolean);
            }

            return {
                id,
                name,
                img,
                age,
                occupation,
                income,
                priority,
                priorityClass,
                transformation_title,
                detailed_pains
            };
        });
    };

    useEffect(() => {
        if (strategy) setLocalStrategy(strategy);
    }, [strategy]);

    // Guardia de carga para evitar errores de desestructuración si la estrategia es null/undefined
    if (!strategy || !localStrategy) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-400">Cargando análisis psicológico...</p>
                </div>
            </div>
        );
    }

    const saveProjectStrategy = async (updatedStrategy: ProjectMasterStrategy) => {
        if (!id) return;
        setIsSaving(true);
        try {
            await api.updateProjectStrategy!(id, updatedStrategy);
        } catch (error) {
            console.error("Error saving strategy:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = (path: string, value: any) => {
        if (!localStrategy) return;
        
        const newStrategy = { ...localStrategy };
        
        if (path.startsWith('avatar-title-')) {
            const avatarId = path.split('avatar-title-')[1];
            let targetIdx = -1;
            if (avatarId.startsWith('default-')) {
                targetIdx = parseInt(avatarId.split('default-')[1]);
            } else if (avatarId.startsWith('real-')) {
                targetIdx = parseInt(avatarId.split('real-')[1]);
            } else if (avatarId.startsWith('fallback-')) {
                targetIdx = parseInt(avatarId.split('fallback-')[1]);
            } else {
                targetIdx = newStrategy.avatars.findIndex(av => String(av.id) === String(avatarId));
            }

            if (targetIdx !== -1) {
                if (!newStrategy.avatars || !Array.isArray(newStrategy.avatars)) {
                    newStrategy.avatars = [];
                }
                while (newStrategy.avatars.length <= targetIdx) {
                    newStrategy.avatars.push({
                        id: newStrategy.avatars.length + 1,
                        name: "",
                        pain: "",
                        daily_manifestation: "",
                        objection: ""
                    } as any);
                }
                newStrategy.avatars[targetIdx].transformation_title = value;
            } else {
                newStrategy.avatars = newStrategy.avatars.map(av => 
                    String(av.id) === String(avatarId) ? { ...av, transformation_title: value } : av
                );
            }
        } else if (path.startsWith('pain-')) {
            const painTarget = path.split('pain-')[1];
            const [avatarId, painIdx] = painTarget.split('|');
            const indexInt = parseInt(painIdx);

            const cleanPrefix = (text: string, prefixPattern: string) => {
                let clean = text.trim();
                if (clean.toLowerCase().startsWith(prefixPattern.toLowerCase())) {
                    clean = clean.substring(prefixPattern.length).trim();
                }
                if (clean.startsWith(':')) {
                    clean = clean.substring(1).trim();
                }
                return clean;
            };
            
            // Let's identify the index (0, 1, or 2) of this avatar being edited
            let targetIdx = -1;
            if (avatarId.startsWith('default-')) {
                targetIdx = parseInt(avatarId.split('default-')[1]);
            } else if (avatarId.startsWith('real-')) {
                targetIdx = parseInt(avatarId.split('real-')[1]);
            } else if (avatarId.startsWith('fallback-')) {
                targetIdx = parseInt(avatarId.split('fallback-')[1]);
            } else {
                targetIdx = newStrategy.avatars.findIndex(av => String(av.id) === String(avatarId));
            }

            if (targetIdx !== -1) {
                if (!newStrategy.avatars || !Array.isArray(newStrategy.avatars)) {
                    newStrategy.avatars = [];
                }
                while (newStrategy.avatars.length <= targetIdx) {
                    newStrategy.avatars.push({
                        id: newStrategy.avatars.length + 1,
                        name: "",
                        pain: "",
                        daily_manifestation: "",
                        objection: ""
                    } as any);
                }

                const targetAvatar = newStrategy.avatars[targetIdx];
                const realId = targetAvatar.id;

                const avatarIdxStr = String(targetIdx + 1);
                const avatarPains = newStrategy.psychology.pains && Array.isArray(newStrategy.psychology.pains)
                    ? newStrategy.psychology.pains.filter((p: any) => 
                        p && typeof p !== 'string' && (String(p.avatarId) === String(realId) || String(p.avatarId) === avatarIdxStr)
                      )
                    : [];

                if (avatarPains.length > 0) {
                    const targetItem = avatarPains[indexInt];
                    if (targetItem) {
                        newStrategy.psychology.pains = newStrategy.psychology.pains.map((p: any) => 
                            p === targetItem ? { ...p, text: value } : p
                        );
                    } else {
                        let cleanVal = value;
                        if (indexInt === 0) {
                            cleanVal = cleanPrefix(value, "Si te frustra ver que");
                            targetAvatar.pain = cleanVal;
                        } else if (indexInt === 1) {
                            cleanVal = cleanPrefix(value, "Si te agota sentir que");
                            targetAvatar.daily_manifestation = cleanVal;
                        } else if (indexInt === 2) {
                            cleanVal = cleanPrefix(value, "Si te duele dudar sobre");
                            targetAvatar.objection = cleanVal;
                        }
                    }
                } else {
                    let cleanVal = value;
                    if (indexInt === 0) {
                        cleanVal = cleanPrefix(value, "Si te frustra ver que");
                        targetAvatar.pain = cleanVal;
                    } else if (indexInt === 1) {
                        cleanVal = cleanPrefix(value, "Si te agota sentir que");
                        targetAvatar.daily_manifestation = cleanVal;
                    } else if (indexInt === 2) {
                        cleanVal = cleanPrefix(value, "Si te duele dudar sobre");
                        targetAvatar.objection = cleanVal;
                    }
                }
            }
        } else if (path.startsWith('module-')) {
            const [_, field, idx] = path.split('-');
            const index = parseInt(idx);
            
            if (!newStrategy.psychology.learningModules) {
                newStrategy.psychology.learningModules = learningModules.map((m: any) => ({
                    title: m.title,
                    description: m.description,
                    icon: m.icon,
                    color: m.color || 'text-orange-400',
                    glow: m.glow || '',
                    bg: m.bg || 'bg-orange-500/10',
                    border: m.border || 'border-orange-500/20'
                }));
            }
            
            if (newStrategy.psychology.learningModules) {
                newStrategy.psychology.learningModules = newStrategy.psychology.learningModules.map((m, i) => 
                    i === index ? { ...m, [field]: value } : m
                );
            }
        }

        setLocalStrategy(newStrategy);
        saveProjectStrategy(newStrategy);
    };

    const { avatars = [], psychology = { pains: [], solutions: [], awarenessStages: { stage1_pain: '', stage2_solution: '', stage3_barrier: '' }, conversionStrategy: { mainFocus: [], tacticalNote: '' }, learningModules: [] } } = localStrategy;

    const defaultBenefitsList = [
        { title: "EL MAPA DEL ÉXITO PREMIUM", description: "Descubrirás el camino exacto para posicionarte como la opción de lujo que las clientas desean.", icon: "Target", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "hover:shadow-blue-500/10" },
        { title: "ARQUITECTURA DE LA MIRADA", description: "Dominarás el arte de diseñar rostros que generen recomendaciones automáticas y ventas masivas.", icon: "BookOpen", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "hover:shadow-purple-500/10" },
        { title: "INGRESOS DE ALTO IMPACTO", description: "La clave definitiva para dejar de competir por precio y empezar a cobrar por tu maestría.", icon: "TrendingUp", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "hover:shadow-emerald-500/10" },
        { title: "EL ESCUDO DE SEGURIDAD", description: "Aprende los protocolos clínicos que protegen tu trabajo y te brindan confianza absoluta.", icon: "Shield", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "hover:shadow-rose-500/10" },
        { title: "PROTOCOLO DE ATENCIÓN ÉLITE", description: "Cómo estructurar citas de alta gama completas que fidelicen a tus clientes desde la primera sesión.", icon: "Crown", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "hover:shadow-amber-500/10" },
        { title: "LA COMUNIDAD PRIVADA VIP", description: "Soporte constante las 24 horas para guiarte en tus prácticas reales con modelos.", icon: "Users", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", glow: "hover:shadow-indigo-500/10" }
    ];

    const getStyledItem = (item: any, idx: number) => {
        const title = item.title || item.name || "Módulo de Valor";
        const description = item.description || item.desc || item.text || "Módulo estructurado para detonar urgencia y persuasión de compra.";
        const icon = item.icon || (idx % 3 === 0 ? 'Brain' : idx % 3 === 1 ? 'Target' : 'Zap');
        const color = item.color || (idx % 3 === 0 ? 'text-blue-400' : idx % 3 === 1 ? 'text-emerald-400' : 'text-purple-400');
        const bg = item.bg || (idx % 3 === 0 ? 'bg-blue-500/10' : idx % 3 === 1 ? 'bg-emerald-500/10' : 'bg-purple-500/10');
        const border = item.border || (idx % 3 === 0 ? 'border-blue-500/20' : idx % 3 === 1 ? 'border-emerald-500/20' : 'border-purple-500/20');
        const glow = item.glow || (idx % 3 === 0 ? 'hover:shadow-blue-500/10' : idx % 3 === 1 ? 'hover:shadow-emerald-500/10' : 'hover:shadow-purple-500/10');
        return { title, description, icon, color, bg, border, glow };
    };

    const rawWebBenefits = (localStrategy as any)?.modules?.web?.landingPageTabs?.benefits?.items || [];
    const rawBenefits = (localStrategy as any)?.benefits || [];

    const learningModules = (psychology.learningModules && psychology.learningModules.length > 0)
        ? psychology.learningModules
        : (psychology.solutions && psychology.solutions.length > 0)
        ? psychology.solutions.map((sol: any, idx: number) => getStyledItem(typeof sol === 'object' ? sol : { title: "Módulo de aprendizaje", description: sol }, idx))
        : (rawWebBenefits.length > 0)
        ? rawWebBenefits.map((item: any, idx: number) => getStyledItem(item, idx))
        : (rawBenefits.length > 0)
        ? rawBenefits.map((item: any, idx: number) => getStyledItem(item, idx))
        : defaultBenefitsList;

    const EditableField = ({ value, onSave, multiline = false, className = "" }: { value: string, onSave: (val: string) => void, multiline?: boolean, className?: string }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [tempValue, setTempValue] = useState(value);

        useEffect(() => {
            setTempValue(value);
        }, [value]);

        const handleBlur = () => {
            setIsEditing(false);
            if (tempValue !== value) onSave(tempValue);
        };

        if (isEditing) {
            return multiline ? (
                <textarea
                    autoFocus
                    className={`${className} bg-white/10 border border-white/20 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-purple-500/50 resize-none min-h-[100px] text-white`}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                />
            ) : (
                <input
                    autoFocus
                    className={`${className} bg-white/10 border border-white/20 rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-purple-500/50 text-white`}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
                />
            );
        }

        return (
            <div 
                onClick={() => setIsEditing(true)}
                className={`${className} group-hover:bg-white/5 cursor-edit transition-all duration-300 rounded-xl -m-2 p-2 hover:ring-1 hover:ring-white/10`}
            >
                {value || <span className="opacity-30 italic">Click para editar...</span>}
            </div>
        );
    };

    return (
        <div id="psd-psychology-section" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
            
            {isSaving && (
                <div className="fixed top-8 right-8 z-50 flex items-center gap-2 bg-purple-500/20 backdrop-blur-xl border border-purple-500/30 px-4 py-2 rounded-full text-purple-200 text-xs font-bold animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando cambios...
                </div>
            )}
            
            <div className="seccion_encabezado space-y-12">
                <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                    <div className="absolute inset-x-0 -top-24 h-[600px] bg-orange-600/10 blur-[140px] -z-10 rounded-full" />
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                        <Flame className="w-4 h-4 fill-current" /> ¿Cómo persuadimos tus clientes?
                    </div>
                    
                    <div className="space-y-4 px-4">
                        <h3 id="psd-psychology-title" className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 tracking-tight leading-none">
                            Psicología y Estrategia de Persuasión
                        </h3>
                        <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                            Comprar no es un acto racional, es un acto emocional que luego se justifica con lógica. Por eso, nuestra estrategia no vende características técnicas, vende la solución al dolor que no deja dormir a tu cliente.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                    <div className="inline-flex items-center gap-3 text-orange-300 font-extrabold uppercase tracking-widest text-sm bg-orange-500/5 px-8 py-4 rounded-2xl border border-orange-500/10 backdrop-blur-sm mx-auto">
                        <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                    </div>
                    
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-rose-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                        
                        <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-orange-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial Psychology" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* --- SECCIÓN FRUSTRACIONES DEL AVATAR (Interactive Accordions) --- */}
            <div className="max-w-[75em] mx-auto px-6 mt-32 space-y-12">
                {/* Inner Header */}
                <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/5">
                        <MessageSquare className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight font-sans">
                            Frustraciones del Avatar
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mt-2 font-sans">
                            Retos emocionales, miedos ocultos e insatisfacciones profundas que impulsan a tu cliente a buscar una solución de inmediato. Mapeado detalladamente por avatar.
                        </p>
                    </div>
                </div>

                {/* Banner instructivo elegante */}
                <div className="flex items-center gap-3 px-2 text-sm text-zinc-400 select-none font-sans">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                    <span>Haz clic en cualquiera de los avatares para expandir y ver sus frustraciones específicas.</span>
                </div>

                {/* Accordion List for 3 Avatars Pains */}
                <div className="space-y-6 mt-4">
                    {(() => {
                        const objectionsAvsToRender = getSystemAvatarsProps(localStrategy);

                        return objectionsAvsToRender.map((av, idx) => {
                            const isOpen = activeAvatarIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className={`border rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] hover:bg-[#121216]/50 ${
                                        isOpen
                                            ? "bg-[#0c0c11]/90 border-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.06)]"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                    }`}
                                >
                                    {/* Header clickable bar */}
                                    <div
                                        onClick={() => {
                                            setActiveAvatarIndex(isOpen ? null : idx);
                                        }}
                                        className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer select-none"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-left">
                                            {/* Avatar Picture with custom border */}
                                            <div className="relative shrink-0 flex justify-center">
                                                <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-full border-2 border-blue-500 p-0.5 bg-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.25)] flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={av.img}
                                                        alt={av.name}
                                                        referrerPolicy="no-referrer"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans">
                                                        {av.name}
                                                    </h3>
                                                    {/* Badges */}
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none ${av.priorityClass}`}>
                                                        {av.priority}
                                                    </span>
                                                </div>

                                                {/* demographic line with icon */}
                                                <div className="flex items-center gap-2 text-zinc-400 text-sm md:text-[14px] font-medium flex-wrap">
                                                    <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                                                    <span>{av.age}</span>
                                                    <span>•</span>
                                                    <span>{av.occupation}</span>
                                                    <span>•</span>
                                                    <span>{av.income}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chevron status */}
                                        <div className="flex justify-end items-center md:pl-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion expandable body */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                            >
                                                <div className="p-6 md:p-10 space-y-8 bg-gradient-to-b from-[#0c0c11]/80 to-[#08080c]/95 border-t border-white/[0.04]">
                                                    {/* Content block inside active view */}
                                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                                                        {/* Left column hook */}
                                                        <div className="lg:col-span-5 space-y-6 text-left">
                                                            <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/5">
                                                                <TrendingUp className="w-7 h-7" />
                                                            </div>
                                                            <h4 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans">
                                                                <EditableField 
                                                                    value={av.transformation_title}
                                                                    onSave={(val) => handleUpdate(`avatar-title-${av.id}`, val)}
                                                                />
                                                            </h4>
                                                        </div>

                                                        {/* Line element separator */}
                                                        <div className="hidden lg:block lg:col-span-1 h-32 w-px bg-white/[0.06] mx-auto" />

                                                        {/* Right column with 3 pains details */}
                                                        <div className="lg:col-span-6 space-y-6 text-left">
                                                            {av.detailed_pains.map((dolor, pIdx) => (
                                                                <div key={pIdx} className="flex gap-5 items-start text-left">
                                                                    {/* High contrast custom glowing dot element */}
                                                                    <div className="relative shrink-0 mt-2">
                                                                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                                                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-500 animate-ping opacity-70" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <EditableField 
                                                                            value={dolor}
                                                                            onSave={(val) => handleUpdate(`pain-${av.id}|${pIdx}`, val)}
                                                                            multiline
                                                                            className="text-zinc-200 text-lg md:text-xl leading-relaxed font-semibold cursor-edit"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        });
                    })()}
                </div>
            </div>

            {/* --- SECCIÓN DINÁMICA: ESTA CLASE ES PARA TI SI... --- */}
            <div className="max-w-[75em] mx-auto px-6 text-center mt-32 space-y-16">
                <h2 className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight tracking-tight">Esta clase es para ti si...</h2>
                
                <div className="flex flex-col gap-16 text-left">
                    {avatars.map((avatar, idx) => (
                        <div key={avatar.id} className={`relative p-12 md:p-20 rounded-[4rem] border border-white/10 ${idx === 0 ? 'bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#090e1a] hover:shadow-blue-500/10' : idx === 1 ? 'bg-gradient-to-br from-[#061a14] via-[#04120e] to-[#030d0a] hover:shadow-emerald-500/10' : 'bg-gradient-to-br from-[#1a0b2e] via-[#12061d] to-[#0f041d] hover:shadow-purple-500/10'} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-2 group overflow-hidden backdrop-blur-sm`}>
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
                               {idx === 0 ? <TrendingUp size={300} /> : idx === 1 ? <UserCheck size={300} /> : <Sparkles size={300} />}
                            </div>
                            
                            <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
                                <div className="space-y-10 flex-1">
                                    <div className="flex flex-col gap-6">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${idx === 0 ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' : idx === 1 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200' : 'bg-purple-500/20 border-purple-500/30 text-purple-200'} border text-xs font-bold uppercase tracking-widest w-fit`}>
                                            <Users className="w-3.5 h-3.5" /> Avatar: {avatar.name}
                                        </div>
                                        <div className="w-28 h-28 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                                            {idx === 0 ? <TrendingUp className="w-10 h-10 text-blue-400" /> : idx === 1 ? <UserCheck className="w-10 h-10 text-emerald-400" /> : <Sparkles className="w-10 h-10 text-purple-400" />}
                                        </div>
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                                        <EditableField 
                                            value={avatar.transformation_title || (idx === 0 ? "Si buscas crear tu propio negocio y reinventarte profesionalmente" : idx === 1 ? "Si ya estás en el sector belleza y quieres dominar la técnica más top" : "Si te da miedo fallar por falta de experiencia pero buscas respaldo")}
                                            onSave={(val) => handleUpdate(`avatar-title-${avatar.id}`, val)}
                                            multiline
                                        />
                                    </h3>
                                </div>
                                
                                <div className="lg:w-[45%] space-y-8 lg:pl-16 lg:border-l border-white/10">
                                    {(() => {
                                        // 1. Buscamos dolores personalizados en psychology.pains para este avatar (objeto)
                                        // o para su índice idx + 1
                                        const customPains = psychology.pains && Array.isArray(psychology.pains)
                                            ? psychology.pains.filter((p: any) => 
                                                p && typeof p !== 'string' && 
                                                (String(p.avatarId) === String(avatar.id) || String(p.avatarId) === String(idx + 1))
                                              ).map((p: any) => typeof p === 'string' ? p : p.text)
                                            : [];

                                        if (customPains.length > 0) {
                                            return customPains;
                                        }

                                        // 2. Si no hay, construimos fallback dinámico basado en avatar.pain, daily_manifestation y objection
                                        const p1 = avatar.pain 
                                            ? (avatar.pain.toLowerCase().startsWith('si te frustra') ? avatar.pain : `Si te frustra ver que: ${avatar.pain}`)
                                            : `Si te frustra ver que: (no definido)`;

                                        const p2 = avatar.daily_manifestation 
                                            ? (avatar.daily_manifestation.toLowerCase().startsWith('si te agota') ? avatar.daily_manifestation : `Si te agota sentir que: ${avatar.daily_manifestation}`)
                                            : `Si te agota sentir que: (no definido)`;

                                        const p3 = avatar.objection 
                                            ? (avatar.objection.toLowerCase().startsWith('si te duele') ? avatar.objection : `Si te duele dudar sobre: ${avatar.objection}`)
                                            : `Si te duele dudar sobre: (no definido)`;

                                        return [p1, p2, p3];
                                    })().map((painPoint, pIdx) => (
                                        <div key={pIdx} className="flex gap-6">
                                            <div className="mt-3 shrink-0">
                                                <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${idx === 0 ? 'from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.8)]' : idx === 1 ? 'from-emerald-600 to-green-500 shadow-[0_0_20px_rgba(5,150,105,0.8)]' : 'from-purple-600 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]'}`}></div>
                                            </div>
                                            <div className="flex-1">
                                                <EditableField 
                                                    value={painPoint}
                                                    onSave={(val) => handleUpdate(`pain-${avatar.id}|${pIdx}`, val)}
                                                    multiline
                                                    className="text-gray-200 text-[1.4rem] leading-relaxed font-medium"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECCIÓN DINÁMICA: LO QUE APRENDERÁS EN NUESTRA CLASE */}
            <div className="max-w-[75em] mx-auto px-6 text-center mt-32 space-y-16">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight tracking-tight">Lo que aprenderás en nuestra clase</h2>
                    <div className={`h-1.5 w-24 rounded-full mx-auto bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]`}></div>
                </div>

                <div className="grid gap-8 md:grid-cols-3 text-left">
                    {learningModules.map((item: any, idx: number) => (
                        <div key={idx} className={`relative p-10 rounded-[3.5rem] border bg-gradient-to-br ${item.bg} ${item.border} shadow-2xl transition-all duration-700 group overflow-hidden ${item.glow} backdrop-blur-sm hover:-translate-y-2`}>
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-125 transition-all duration-700 pointer-events-none">
                                {IconMap[item.icon] && React.cloneElement(IconMap[item.icon] as any, { size: 180 })}
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                    {IconMap[item.icon] && React.cloneElement(IconMap[item.icon] as any, { size: 32, className: item.color })}
                                </div>
                                <h3 className="text-[1.6rem] font-black text-white leading-tight uppercase tracking-tight">
                                    <EditableField 
                                        value={item.title}
                                        onSave={(val) => handleUpdate(`module-title-${idx}`, val)}
                                    />
                                </h3>
                                <div className="text-gray-300 text-[1.1rem] leading-relaxed font-medium">
                                    <EditableField 
                                        value={item.description}
                                        onSave={(val) => handleUpdate(`module-description-${idx}`, val)}
                                        multiline
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
