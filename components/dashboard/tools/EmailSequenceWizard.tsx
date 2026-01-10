import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
    Mail, Briefcase, ChevronRight, ArrowLeft, 
    Zap, Loader2, Info, Sparkles, Plus, 
    Check, Calendar, LayoutTemplate, X, Wand2, Lock,
    ChevronDown, ChevronUp, Settings2, Edit3, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { api } from '../../../services/api';
import { Project, User, Plan } from '../../../types';
import { ProjectMasterStrategy } from '../../../services/strategySchema';

interface DashboardContext {
    user: User;
    pageCount: number;
}

export const EmailSequenceWizard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useOutletContext() as DashboardContext;
    const [step, setStep] = useState(0); // 0: Select Project, 1: Planning, 2: Visualization
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [strategy, setStrategy] = useState<ProjectMasterStrategy | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeEmailIdx, setActiveEmailIdx] = useState(0);
    const [nextPlan, setNextPlan] = useState<Plan | null>(null);

    /* Actualización: Estado para manejar la edición de la estructura de correos - 24/05/2024 23:05 */
    const [editableEmails, setEditableEmails] = useState<any[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [projectsData, plansData] = await Promise.all([
                    api.getProjects(),
                    api.getPublicPlans().catch(() => [])
                ]);
                setProjects(projectsData);

                const currentPlanName = user.planLimits?.planName || 'starter';
                const sortedPlans = Array.isArray(plansData) ? [...plansData].sort((a, b) => a.priceMonthly - b.priceMonthly) : [];
                const currentIndex = sortedPlans.findIndex(p => p.slug === currentPlanName);
                if (currentIndex !== -1 && currentIndex < sortedPlans.length - 1) {
                    setNextPlan(sortedPlans[currentIndex + 1]);
                }
            } catch (e) {
                console.error("Error cargando datos iniciales", e);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [user.planLimits]);

    const handleProjectSelect = async (project: Project) => {
        setSelectedProject(project);
        setLoading(true);
        try {
            const strategyData = await api.getProjectStrategy(project.id);
            if (strategyData) {
                setStrategy(strategyData);
                /* Actualización: Los objetivos se cargan como descripción estratégica, no como prompt técnico - 24/05/2024 23:05 */
                const defaultEmails = [
                    { day: "Día 0", subject: "Aquí tienes tu acceso: Guía de Inicio Rápido en Microblading 🎁", type: "Entrega de Valor", objective: "Entregar el Lead Magnet prometido y dar una bienvenida entusiasta que genere autoridad inmediata.", bodyPreview: "Hola [Nombre], tal como te prometí, aquí tienes el acceso directo a la guía que te enseñará a dar tus primeros pasos..." },
                    { day: "Día 1", subject: "¿Cansada de trabajar 10h y no ver frutos reales? 😫", type: "Agitación del Dolor", objective: "Conectar con la frustración del avatar por la falta de resultados y posicionar el método como la solución definitiva.", bodyPreview: "Hola [Nombre], entiendo perfectamente esa sensación de darlo todo y que la cuenta bancaria no se mueva. El problema no es tu esfuerzo, es el vehículo..." },
                    { day: "Día 2", subject: "Cómo Maria pasó de 0 a $2,000/mes con cejas 📈", type: "Prueba Social", objective: "Mostrar un caso de éxito real que derribe la creencia de que es imposible empezar desde cero sin experiencia.", bodyPreview: "Hola [Nombre], hoy quiero contarte la historia de una de mis alumnas que, como tú, tenía miedo de empezar pero decidió confiar en el proceso..." },
                    { day: "Día 3", subject: "La verdad sobre el Microblading (y por qué otros métodos fallan) 💎", type: "Mecanismo Único", objective: "Explicar el factor diferenciador de tu técnica para justificar un precio premium frente a la competencia barata.", bodyPreview: "Hola [Nombre], ¿sabes por qué muchas esteticistas no logran resultados naturales? La clave está en el visajismo avanzado..." },
                    { day: "Día 4", subject: "¡INSCRIPCIONES ABIERTAS! Domina la Certificación Pro 🚀", type: "Lanzamiento / Oferta", objective: "Abrir oficialmente las inscripciones resaltando la transformación y los beneficios exclusivos del programa.", bodyPreview: "Hola [Nombre], llegó el momento. Las puertas de la Certificación Expert Microblading están abiertas..." },
                    { day: "Día 5", subject: "Tus 3 Bonos Exclusivos expiran en pocas horas... ⏳", type: "Escasez / Valor", objective: "Generar urgencia mediante la pérdida de bonos de acción rápida para incentivar la compra inmediata.", bodyPreview: "Hola [Nombre], no quiero que te quedes fuera de los bonos de acción rápida..." },
                    { day: "Día 6", subject: "ÚLTIMA LLAMADA: Tu futuro profesional empieza aquí o termina hoy", type: "Cierre / Urgencia", objective: "Último recordatorio antes del cierre de inscripciones, apelando al costo de oportunidad de no tomar acción ahora.", bodyPreview: "Hola [Nombre], esta es mi última invitación. Mañana el precio subirá y esta oportunidad no volverá..." }
                ];
                
                setEditableEmails(strategyData.modules.emails.nurture.length > 0 ? strategyData.modules.emails.nurture.map((e: any) => ({ ...e })) : defaultEmails);
                setStep(1);
            } else {
                alert("Este proyecto aún no tiene una estrategia generada. Por favor, genérala primero en la sección Proyectos.");
            }
        } catch (e) {
            console.error("Error cargando estrategia", e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = (index: number, field: string, value: string) => {
        const newEmails = [...editableEmails];
        newEmails[index][field] = value;
        setEditableEmails(newEmails);
    };

    if (loading && step === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FF5A1F]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">Cargando tus proyectos...</p>
            </div>
        );
    }

    const isUnlocked = user.planLimits?.features?.emailStrategy || false;

    // Ancho dinámico basado en el paso actual
    const containerWidth = (step >= 1 && strategy) ? 'max-w-[1400px]' : 'max-w-5xl';

    return (
        <div className={`${containerWidth} mx-auto bg-gray-900 rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden min-h-[600px] flex flex-col relative animate-in fade-in duration-500 transition-all`}>
            
            <div className="bg-[#FF5A1F]/10 p-8 text-center border-b border-[#FF5A1F]/10 shrink-0 relative">
                {step > 0 && selectedProject && (
                    <button 
                        onClick={() => { setStep(0); setStrategy(null); setSelectedProject(null); }}
                        className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Cambiar Proyecto
                    </button>
                )}
                
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                    <Mail className="w-8 h-8 text-[#FF5A1F]" />
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Asistente de Secuencias de Email</h2>
                
                {selectedProject && (
                    <p className="text-[10px] text-[#FF5A1F] font-black uppercase tracking-[0.3em] mt-2">Proyecto: {selectedProject.name}</p>
                )}

                {/* Actualización: El botón 0. Proyecto es enlazable para permitir navegación rápida - 24/05/2024 23:35 */}
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                   <button 
                     onClick={() => { setStep(0); setStrategy(null); setSelectedProject(null); }}
                     className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer ${step === 0 ? 'bg-[#FF5A1F] text-white' : 'bg-gray-800 text-gray-500 hover:text-white'}`}
                   >
                     0. Proyecto
                   </button>
                   <div className="w-4 h-px bg-gray-700"></div>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 1 ? 'bg-[#FF5A1F] text-white' : 'bg-gray-800 text-gray-500'}`}>1. Planificación</span>
                   <div className="w-4 h-px bg-gray-700"></div>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 2 ? 'bg-[#FF5A1F] text-white' : 'bg-gray-800 text-gray-500'}`}>2. Secuencia</span>
                </div>
            </div>

            <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                {step === 0 && (
                    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">
                                    Selecciona tu Proyecto
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                Para redactar correos que cierren ventas, nuestra IA necesita leer tu estrategia maestra. Selecciona un proyecto para visualizar su secuencia de 7 días.
                            </p>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <button 
                                        key={project.id}
                                        onClick={() => handleProjectSelect(project)}
                                        className="p-8 bg-[#0B0B0B] border border-white/5 rounded-[2rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-bold text-lg group-hover:text-[#FF5A1F] transition-colors truncate">{project.name}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">{project.niche}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">{project.description}</p>
                                        <div className="flex items-center justify-end">
                                            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-[#FF5A1F] transition-all group-hover:translate-x-1" />
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="md:col-span-3 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[2rem] text-center">
                                    <p className="text-gray-500 mb-6">Aún no tienes proyectos creados con estrategia.</p>
                                    <button 
                                        onClick={() => navigate('/dashboard/projects/create')}
                                        className="px-8 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20"
                                    >
                                        Crear mi primer proyecto
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Actualización: Estructura de planificación con visor de email - 24/05/2024 23:35 */}
                {step === 1 && strategy && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-700 pt-6">
                        
                        <div className="grid lg:grid-cols-12 gap-10 max-w-[90em] mx-auto items-stretch">
                            
                            {/* COLUMNA IZQUIERDA: LISTADO (Col-span-6 -> 50%) */}
                            <div className="lg:col-span-6 bg-gray-900 p-6 md:p-8 rounded-[2.5rem] border border-gray-800 flex flex-col h-full shadow-2xl">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="p-3 bg-yellow-900/30 rounded-2xl text-yellow-400 border border-yellow-900/50"><Mail className="w-7 h-7" /></div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight leading-none">Estructura de la Secuencia</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">Contenidos persuasivos por día.</p>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1 overflow-y-auto max-h-[800px] custom-scrollbar pr-2">
                                    {editableEmails.map((email, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setActiveEmailIdx(idx)}
                                            className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-5 ${activeEmailIdx === idx ? 'bg-yellow-900/20 border-yellow-500/50 shadow-xl shadow-yellow-900/30 translate-x-2' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${activeEmailIdx === idx ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${activeEmailIdx === idx ? 'text-yellow-300' : 'text-gray-500'}`}>
                                                    Día {idx}
                                                </p>
                                                <div className={`border border-dashed p-1 rounded-xl transition-all ${activeEmailIdx === idx ? 'border-yellow-500/40 bg-black/40' : 'border-white/10 hover:border-white/20'}`}>
                                                    <textarea 
                                                        rows={2}
                                                        value={email.subject}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => handleUpdateEmail(idx, 'subject', e.target.value)}
                                                        className={`w-full bg-transparent font-bold text-xl leading-tight outline-none resize-none overflow-hidden transition-all ${activeEmailIdx === idx ? 'text-white' : 'text-gray-300'}`}
                                                        placeholder="Escribe el asunto aquí..."
                                                    />
                                                </div>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full transition-all ${activeEmailIdx === idx ? 'bg-yellow-500 shadow-[0_0_8px_#f59e0b]' : 'bg-gray-800'}`}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* COLUMNA DERECHA: VISOR (Col-span-6 -> 50%) - El botón Redactar ahora por encima de la tarjeta del visor - 24/05/2024 23:35 */}
                            <div className="lg:col-span-6 flex flex-col h-full min-h-[900px]">
                                {/* Actualización: Botón reubicado por encima de la tarjeta del visor como acción prioritaria - 24/05/2024 23:35 */}
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full py-6 mb-6 rounded-[2rem] bg-gradient-to-r from-[#FF5A1F] to-orange-500 hover:from-[#D94A1E] hover:to-orange-600 text-white font-black text-2xl uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(255,90,31,0.4)] flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95 shrink-0"
                                >
                                    <Wand2 className="w-7 h-7 fill-current" /> Redactar Secuencia con IA
                                </button>

                                <div className="bg-[#0b0b0b] border border-gray-800 rounded-[3rem] p-10 flex flex-col relative overflow-hidden h-full shadow-2xl">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                        <Mail className="w-64 h-64 text-yellow-500" />
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="mb-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                    {editableEmails[activeEmailIdx].type || 'Nutrición'}
                                                </span>
                                                <span className="text-gray-500 text-sm font-black uppercase tracking-widest">{editableEmails[activeEmailIdx].day}</span>
                                            </div>
                                            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">
                                                {editableEmails[activeEmailIdx].subject}
                                            </h3>
                                        </div>

                                        <div className="bg-yellow-900/5 border-2 border-dashed border-yellow-500/20 p-8 rounded-[2.5rem] mb-10 group/logic transition-all hover:bg-yellow-900/10">
                                            <div className="flex gap-6 items-start">
                                                <div className="p-3 bg-yellow-500/20 rounded-xl shrink-0 group-hover/logic:scale-110 transition-transform"><Edit3 className="w-6 h-6 text-yellow-300" /></div>
                                                <div className="flex-1 overflow-hidden flex flex-col">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-yellow-300 font-black text-xs uppercase tracking-[0.2em] block">Objetivo del correo</span>
                                                        <span className="text-[9px] font-black text-yellow-500/50 uppercase tracking-widest">Editable</span>
                                                    </div>
                                                    <textarea 
                                                        rows={4}
                                                        value={editableEmails[activeEmailIdx].objective}
                                                        onChange={(e) => handleUpdateEmail(activeEmailIdx, 'objective', e.target.value)}
                                                        className="w-full bg-transparent text-gray-300 text-sm font-light leading-relaxed outline-none resize-none custom-scrollbar"
                                                        placeholder="Escribe el objetivo estratégico aquí..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white text-gray-900 rounded-[2rem] p-10 md:p-14 shadow-2xl relative overflow-hidden font-serif leading-relaxed text-xl flex-1 border-2 border-gray-200 flex flex-col">
                                            <div className="border-b-2 border-gray-100 pb-8 mb-10 text-sm text-gray-400 font-sans space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <strong className="text-gray-900 uppercase font-black tracking-widest text-[10px]">De:</strong> 
                                                    <span className="font-medium text-gray-700">{user.name} &lt;{user.email}&gt;</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <strong className="text-gray-900 uppercase font-black tracking-widest text-[10px]">Para:</strong> 
                                                    <span className="font-medium text-gray-700">{strategy.avatars[0].name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <strong className="text-gray-900 uppercase font-black tracking-widest text-[10px]">Asunto:</strong>
                                                    <input 
                                                        type="text"
                                                        value={editableEmails[activeEmailIdx].subject}
                                                        onChange={(e) => handleUpdateEmail(activeEmailIdx, 'subject', e.target.value)}
                                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 font-bold outline-none focus:border-blue-500 font-sans"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                                <p className="mb-8 font-black text-2xl text-gray-900">Hola {strategy.avatars[0].name.split(' ')[0]},</p>
                                                <p className="mb-8 text-gray-700 leading-[1.8] italic">{editableEmails[activeEmailIdx].bodyPreview}</p>
                                                
                                                <div className="my-12 p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center relative overflow-hidden group/box">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover/box:rotate-12 transition-transform">
                                                        <Zap className="w-16 h-16 text-gray-900" />
                                                    </div>
                                                    {/* Actualización: Marcador de texto corregido - 24/05/2024 23:05 */}
                                                    <p className="text-gray-400 text-base font-sans non-italic font-bold uppercase tracking-[0.2em] relative z-10">
                                                        [ Nuestra inteligencia artificial redactará tu correo electrónico con base en tu publico objetivo e instrucciones ]
                                                    </p>
                                                </div>

                                                <p className="text-xl text-gray-900 font-medium">Atentamente,<br/><span className="font-black text-2xl">{(strategy as any).instructor?.name || user.name}</span><br/><span className="text-sm text-gray-500 font-sans uppercase font-bold tracking-widest">{(strategy as any).instructor?.badgeText || 'Instructora del Proyecto'}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && strategy && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="bg-gray-800/50 border border-gray-700 border-dashed rounded-2xl p-6 flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-900 rounded-xl text-[#FF5A1F] border border-gray-700 shadow-lg">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Proyecto Activo</p>
                                    <h3 className="text-xl font-bold text-white">{selectedProject?.name}</h3>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold text-sm transition-all border border-gray-700 flex items-center gap-2 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Ajustar Planificación
                            </button>
                        </div>

                        {/* Layout de Visualización Final */}
                        <div className="grid lg:grid-cols-12 gap-10">
                            
                            {/* LISTADO DE EMAILS (IZQUIERDA - 33%) */}
                            <div className="lg:col-span-4 bg-gray-900/50 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 flex flex-col h-full hover:border-blue-500/30 transition-all duration-500 shadow-2xl group">
                                <h4 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-[#FF5A1F]" /> Secuencia de 7 Días
                                </h4>
                                
                                <div className="space-y-3 flex-1">
                                    {editableEmails.map((email: any, idx: number) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setActiveEmailIdx(idx)}
                                            className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 ${activeEmailIdx === idx ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/20' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${activeEmailIdx === idx ? 'bg-white text-blue-600' : 'bg-gray-800 text-gray-500'}`}>
                                                CORREO {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeEmailIdx === idx ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    Día {idx}
                                                </p>
                                                <h5 className={`font-bold truncate text-sm ${activeEmailIdx === idx ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                    {email.subject}
                                                </h5>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full transition-all ${activeEmailIdx === idx ? 'bg-white shadow-[0_0_8px_#fff]' : 'bg-gray-800'}`}></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-5 bg-blue-900/20 border border-blue-500/20 rounded-[1.5rem] flex items-start gap-4">
                                    <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
                                    <p className="text-gray-400 text-xs leading-relaxed italic">
                                        "Esta secuencia utiliza el gatillo de reciprocidad para calentar al lead antes de la oferta."
                                    </p>
                                </div>
                            </div>

                            {/* DETALLE DEL EMAIL (DERECHA - 66%) */}
                            <div className="lg:col-span-8 bg-gray-900/50 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 md:p-12 flex flex-col h-full hover:border-yellow-500/30 transition-all duration-500 shadow-2xl group">
                                <div className="bg-white rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col border border-gray-200 flex-1">
                                    <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">IA Persuasive Email Viewer</div>
                                        <div className="w-10"></div>
                                    </div>

                                    <div className="p-10 overflow-y-auto max-h-[650px] custom-scrollbar bg-white">
                                        <div className="space-y-8">
                                            <div className="space-y-4 border-b border-gray-100 pb-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                                        {editableEmails[activeEmailIdx].type || 'Nutrición'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Día {activeEmailIdx}</span>
                                                </div>
                                                <p className="text-blue-800 text-lg leading-relaxed font-medium italic border-l-4 border-blue-200 pl-6 py-1 bg-blue-50/50 rounded-r-xl">
                                                    {editableEmails[activeEmailIdx].objective}
                                                </p>
                                            </div>

                                            <div className="space-y-6 pt-2">
                                                <div className="text-sm text-gray-500 font-medium space-y-1">
                                                    <p><strong>De:</strong> {user.name} &lt;{user.email}&gt;</p>
                                                    <p><strong>Para:</strong> {strategy.avatars[0].name}</p>
                                                    <p><strong>Asunto:</strong> <span className="text-gray-900 font-bold">{editableEmails[activeEmailIdx].subject}</span></p>
                                                </div>

                                                <div className="prose prose-lg text-gray-700 leading-[1.8] font-serif italic pt-6">
                                                    <p className="font-bold text-gray-900 text-2xl mb-6">Hola {strategy.avatars[0].name.split(' ')[0]},</p>
                                                    
                                                    <p className="text-xl mb-4">
                                                        {editableEmails[activeEmailIdx].bodyPreview}
                                                    </p>

                                                    <p className="text-lg mb-6 text-gray-600 font-sans non-italic">
                                                        Entiendo que hoy en día es difícil encontrar un camino claro para <span className="font-bold text-gray-900">{selectedProject?.niche}</span>, pero estoy aquí para decirte que el obstáculo principal de {strategy.avatars[0].pain.toLowerCase()} tiene una solución directa.
                                                    </p>
                                                    
                                                    <div className="my-10 p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-center relative overflow-hidden group/box">
                                                        <div className="absolute top-0 right-0 p-2 opacity-5"><Zap className="w-12 h-12" /></div>
                                                        {/* Actualización: Marcador de texto corregido en visor final - 24/05/2024 23:05 */}
                                                        <p className="text-gray-400 text-base font-sans non-italic relative z-10">
                                                            [ Nuestra inteligencia artificial redactará tu correo electrónico con base en tu publico objetivo e instrucciones ]
                                                        </p>
                                                    </div>

                                                    <p className="text-lg text-gray-600 mb-8 font-sans non-italic">
                                                        Mañana te enviaré algo que te ayudará a resolver específicamente el problema de tu audiencia. Mantente atento a tu bandeja de entrada.
                                                    </p>

                                                    <p className="text-xl text-gray-900 font-medium">Atentamente,<br/><span className="font-black text-2xl">{(strategy as any).instructor?.name || user.name}</span><br/><span className="text-sm text-gray-500 font-sans uppercase font-bold tracking-widest">{(strategy as any).instructor?.badgeText || 'Instructora del Proyecto'}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => isUnlocked ? navigate('/dashboard/email') : navigate('/dashboard/admin/plans')}
                                        className={`w-full py-5 rounded-[1.5rem] font-black text-xl uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 ${isUnlocked ? 'bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-[#FF5A1F]/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}`}
                                    >
                                        {isUnlocked ? <Wand2 className="w-6 h-6 fill-current" /> : <Lock className="w-6 h-6" />}
                                        {isUnlocked ? 'Activar Secuencia con IA' : 'Desbloquear con Plan PRO'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ListIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);
