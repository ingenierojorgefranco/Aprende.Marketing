import React, { useState, useEffect } from 'react';
/* */ /* Actualización: Importación de useSearchParams para soporte de Deep Linking - 25/05/2024 18:15 */
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
/* Fin de actualización - 25/05/2024 18:15 */
import { 
    Mail, Briefcase, ChevronRight, ArrowLeft, 
    Zap, Loader2, Info, Sparkles, Plus, 
    Check, Calendar, LayoutTemplate, X, Wand2, Lock,
    ChevronDown, ChevronUp, Settings2, Edit3, ShieldCheck, AlertTriangle,
    Lightbulb, CheckCircle2, User as UserIcon, Copy, Save
} from 'lucide-react';
import { api } from '../../../services/api';
import { Project, User, Plan, EmailMessage } from '../../../types';
import { ProjectMasterStrategy } from '../../../services/strategySchema';

interface DashboardContext {
    user: User;
    pageCount: number;
}

export const EmailSequenceWizard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useOutletContext() as DashboardContext;
    /* */ /* Actualización: Extracción de parámetros de búsqueda para navegación profunda - 25/05/2024 18:15 */
    const [searchParams] = useSearchParams();
    const urlProjectId = searchParams.get('projectId');
    const urlDay = searchParams.get('day');
    /* Fin de actualización - 25/05/2024 18:15 */

    const [step, setStep] = useState(0); // 0: Select Project, 1: Edición
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [strategy, setStrategy] = useState<ProjectMasterStrategy | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeEmailIdx, setActiveEmailIdx] = useState(0);
    const [nextPlan, setNextPlan] = useState<Plan | null>(null);

    /* */ /* Actualización: Estado para manejar la edición de la estructura de correos y descripción estratégica de valor - 24/05/2024 21:15 */
    const [editableEmails, setEditableEmails] = useState<EmailMessage[]>([]);

    /* */ /* Actualización: Estado para el indicador de auto-guardado asíncrono - 24/05/2024 22:30 */
    const [showSaveIndicator, setShowSaveIndicator] = useState(false);

    /* Actualización: Implementación de lógica de bloqueo para el tipo de correo y lista de pilares estratégicos - 24/05/2024 16:45 */
    const [isTypeLocked, setIsTypeLocked] = useState(true);
    const emailTypes = [
        'Entrega de Valor', 
        'Agitación del Dolor', 
        'Prueba Social', 
        'Mecanismo Único', 
        'Lanzamiento', 
        'Escasez', 
        'Cierre'
    ];

    /* */ /* Actualización: Estados para la generación asincrónica individual de correos y seguimiento de estado de generación - 24/05/2024 21:15 */
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
    /* Fin de actualización - 24/05/2024 21:15 */

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
                console.error("Error cargando dador iniciales", e);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [user.planLimits]);

    /* */ /* Actualización: Efecto para disparar la selección automática de proyecto si existe en la URL - 25/05/2024 18:15 */
    useEffect(() => {
        if (urlProjectId && projects.length > 0 && !selectedProject) {
            const proj = projects.find(p => p.id === urlProjectId);
            if (proj) {
                handleProjectSelect(proj);
            }
        }
    }, [urlProjectId, urlDay, projects, selectedProject]);
    /* Fin de actualización - 25/05/2024 18:15 */

    const handleProjectSelect = async (project: Project) => {
        setSelectedProject(project);
        setLoading(true);
        try {
            // 1. Crear o recuperar secuencia en el backend
            const seqInfo = await api.createEmailSequence(project.id, `Secuencia: ${project.name}`);
            
            // 2. Obtener los 7 mensajes
            const messages = await api.getSequenceMessages(seqInfo.id);
            setEditableEmails(messages);
            
            // 3. Cargar estrategia para contexto
            const strategyData = await api.getProjectStrategy(project.id);
            if (strategyData) {
                setStrategy(strategyData);
            }
            
            if (urlDay) {
                const dayIdx = parseInt(urlDay);
                if (!isNaN(dayIdx) && dayIdx >= 0 && dayIdx < 7) {
                    setActiveEmailIdx(dayIdx);
                }
            }

            setStep(1);
        } catch (e) {
            console.error("Error cargando secuencia vinculada", e);
            alert("Error al inicializar la secuencia en el servidor.");
        } finally {
            setLoading(false);
        }
    };

    /* */ /* Actualización: Lógica de auto-guardado asíncrono en base de datos - 24/05/2024 22:30 */
    const handleUpdateEmail = async (index: number, field: string, value: any) => {
        const newEmails = [...editableEmails];
        (newEmails[index] as any)[field] = value;
        setEditableEmails(newEmails);
        
        const message = newEmails[index];
        setShowSaveIndicator(true);
        try {
            /* */ /* Actualización: Corrección de nombres de campos (contentHtml -> content_html, isGenerated -> is_generated) para asegurar la persistencia en el backend - 24/06/2024 16:50 */
            const apiField = field === 'contentHtml' ? 'content_html' : (field === 'isGenerated' ? 'is_generated' : field);
            await api.updateEmailMessage(message.id, { [apiField]: value } as any);
            setTimeout(() => setShowSaveIndicator(false), 2000);
        } catch (e) {
            console.error("Error guardando cambio en mensaje", e);
        }
    };

    /* Actualización: Función de intercambio (swap) de tipos de correo con persistencia - 24/05/2024 16:45 */
    const handleTypeSwap = async (newType: string) => {
        const otherIdx = editableEmails.findIndex((e, i) => i !== activeEmailIdx && e.pilarType === newType);
        const currentType = editableEmails[activeEmailIdx].pilarType;
        
        const newEmails = [...editableEmails];
        if (otherIdx !== -1) {
            newEmails[otherIdx].pilarType = currentType;
            await api.updateEmailMessage(newEmails[otherIdx].id, { pilarType: currentType } as any);
        }
        newEmails[activeEmailIdx].pilarType = newType;
        await api.updateEmailMessage(newEmails[activeEmailIdx].id, { pilarType: newType } as any);
        
        setEditableEmails(newEmails);
        setIsTypeLocked(true);
        setShowSaveIndicator(true);
        setTimeout(() => setShowSaveIndicator(false), 2000);
    };

    /* */ /* Actualización: Función para generar correo individual con inclusión de etiquetas HTML para estilos y enlace a Google - 24/05/2024 21:15 */
    const handleGenerateSingleEmail = async () => {
        setIsGeneratingEmail(true);
        try {
            // Simulamos la generación del copy por parte de la IA
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            const email = editableEmails[activeEmailIdx];
            const avatarName = strategy?.avatars[0]?.name.split(' ')[0] || "amiga";
            
            // Generamos un ejemplo de texto persuasivo con HTML (colores y enlaces)
            let generatedBody = `Hola ${avatarName},<br><br>Tal como te lo prometí, aquí tienes la llave para empezar tu transformación. Entiendo que hoy en día es difícil encontrar un camino claro en ${selectedProject?.niche}, pero estoy aquí para decirte que existe una <span style="color: #FF5A1F; font-weight: bold;">solución directa</span>.<br><br>He preparado este material pensando exclusivamente en resolver ese sentimiento de estancamiento que me comentaste. No se trata solo de aprender una técnica, sino de dominar un negocio que te brinde la libertad que mereces.<br><br><a href="https://google.com" style="color: #FF5A1F; text-decoration: underline; font-weight: bold;">[Haz clic aquí para ver la guía en Google]</a><br><br>Haz clic en el enlace de abajo para acceder ahora mismo.<br><br>Espero que lo disfrutes,<br>${user.name}`;

            if (email.pilarType === 'Agitación del Dolor') {
                generatedBody = `Hola ${avatarName},<br><br>¿Alguna vez has sentido que trabajas 10 horas al día y al final del mes tu cuenta bancaria sigue igual? Ese nudo en el estómago es real y no es tu culpa, es el vehículo que estás usando.<br><br>Muchas personas en ${selectedProject?.niche} cometen el error de competir por precio en lugar de por valor. Mañana te mostraré cómo <span style="color: #FF5A1F; font-weight: bold;">romper ese ciclo para siempre</span>.<br><br><a href="https://google.com" style="color: #FF5A1F; text-decoration: underline; font-weight: bold;">[Consulta la guía de ayuda aquí en Google]</a><br><br>Un abrazo,<br>${user.name}`;
            } else if (email.pilarType === 'Prueba Social') {
                generatedBody = `Hola ${avatarName},<br><br>Hoy quiero contarte la historia de una de mis alumnas que estaba exactamente donde tú estás hoy. Tenía miedo de fracasar y no sabía por dónde empezar.<br><br>Después de aplicar el método que te he estado compartiendo, logró sus <span style="color: #10B981; font-weight: bold;">primeros $500 extras</span> en menos de 15 días. Si ella pudo, tú también puedes.<br><br><a href="https://google.com" style="color: #FF5A1F; text-decoration: underline; font-weight: bold;">[Mira más resultados aquí en Google]</a><br><br>Mañana te contaré el secreto técnico detrás de este éxito.<br><br>Saludos,<br>${user.name}`;
            }

            const newEmails = [...editableEmails];
            newEmails[activeEmailIdx].isGenerated = true;
            newEmails[activeEmailIdx].contentHtml = generatedBody;
            
            /* */ /* Actualización: Sincronización de llaves de API (content_html, is_generated) para persistencia correcta tras generación - 24/06/2024 16:50 */
            await api.updateEmailMessage(newEmails[activeEmailIdx].id, { 
                content_html: generatedBody, 
                is_generated: true 
            } as any);
            
            setEditableEmails(newEmails);
            setShowSaveIndicator(true);
            setTimeout(() => setShowSaveIndicator(false), 2000);
        } catch (error) {
            console.error("Error generando correo", error);
        } finally {
            setIsGeneratingEmail(false);
        }
    };

    /* */ /* Actualización: Funcionalidad de copiado exclusivo del contenido (sin asunto), centrado y estilizado en azul claro para Systeme.io - 24/05/2024 22:30 */
    const handleCopyEmail = () => {
        const email = editableEmails[activeEmailIdx];
        const htmlContent = `<div>${email.contentHtml}</div>`;
        const plainText = email.contentHtml.replace(/<[^>]*>/g, '');

        const blobHtml = new Blob([htmlContent], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });
        const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];

        navigator.clipboard.write(data).then(() => {
            alert("Cuerpo del correo copiado. Listo para pegar en Systeme.io");
        }).catch(err => {
            console.error("Error al copiar", err);
            navigator.clipboard.writeText(plainText);
            alert("Copiado como texto plano.");
        });
    };

    if (loading && step === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FF5A1F]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">Cargando tus proyectos...</p>
            </div>
        );
    }

    const containerWidth = (step >= 1 && strategy) ? 'max-w-[1400px]' : 'max-w-5xl';

    return (
        <div className={`${containerWidth} mx-auto bg-gray-900 rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden min-h-[600px] flex flex-col relative animate-in fade-in duration-500 transition-all`}>
            
            {/* Overlay flotante de carga */}
            {isGeneratingEmail && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0B0B0B] border border-white/10 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95">
                        <Loader2 className="w-16 h-16 text-[#FF5A1F] animate-spin" />
                        <p className="text-white font-black uppercase tracking-[0.3em] text-center text-sm">generando tu correo...</p>
                    </div>
                </div>
            )}

            <div className="bg-[#FF5A1F]/10 p-8 text-center border-b border-[#FF5A1F]/10 shrink-0 relative">
                {/* */ /* Actualización: Lógica dinámica para el botón Volver según el contexto de la URL - 25/06/2024 10:15 */ }
                {step > 0 && selectedProject && (
                    <button 
                        onClick={() => { 
                            if (urlProjectId) {
                                navigate('/dashboard/email');
                            } else {
                                setStep(0); 
                                setStrategy(null); 
                                setSelectedProject(null); 
                            }
                        }}
                        className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                        {urlProjectId ? 'Ver otra Secuencia' : 'Cambiar Proyecto'}
                    </button>
                )}
                {/* Fin de actualización - 25/06/2024 10:15 */}
                
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                    <Mail className="w-8 h-8 text-[#FF5A1F]" />
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Asistente de Secuencias de Email</h2>
                
                {selectedProject && (
                    <p className="text-[10px] text-[#FF5A1F] font-black uppercase tracking-[0.3em] mt-2">Proyecto: {selectedProject.name}</p>
                )}

                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 0 ? 'bg-[#FF5A1F] text-white' : 'bg-gray-800 text-gray-500'}`}>0. Proyecto</span>
                   <div className="w-4 h-px bg-gray-700"></div>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 1 ? 'bg-[#FF5A1F] text-white' : 'bg-gray-800 text-gray-500'}`}>1. Configuración y Edición</span>
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

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <div 
                                        key={project.id}
                                        className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors shadow-inner">
                                                <Briefcase className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors truncate">{project.name}</h4>
                                                <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 mb-10">
                                            <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-3">Descripción del Proyecto</p>
                                            <p className="text-gray-400 text-lg leading-relaxed font-medium">{project.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleProjectSelect(project)}
                                            className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95"
                                        >
                                            Seleccionar <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="md:col-span-3 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[2rem] text-center">
                                    <p className="text-gray-500 mb-6">Aún no tienes proyectos creados con estrategia.</p>
                                    <button 
                                        onClick={() => navigate('/dashboard/projects/create')}
                                        className="px-8 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20"
                                    >
                                        Crear mi primer proyecto
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 1 && strategy && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-700 pt-6 h-full flex flex-col">
                        
                        <div className="grid lg:grid-cols-12 gap-10 max-w-[90em] mx-auto items-stretch flex-1 overflow-hidden">
                            
                            {/* COLUMNA IZQUIERDA: LISTADO (5 Cols) */}
                            <div className="lg:col-span-5 bg-gray-900 p-6 md:p-8 rounded-[2.5rem] border border-gray-800 flex flex-col h-full shadow-2xl">
                                <div className="flex items-center gap-3 mb-10 shrink-0">
                                    <div className="p-3 bg-yellow-900/30 rounded-2xl text-yellow-400 border border-yellow-900/50"><Mail className="w-7 h-7" /></div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight leading-none">Estructura de la Secuencia</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">Contenidos persuasivos por día.</p>
                                    </div>
                                </div>

                                {/* */ /* Actualización: Eliminación de scroll interno en la lista de secuencia para visualización completa de tabs - 25/06/2024 11:30 */ }
                                <div className="space-y-4 flex-1 pr-2">
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
                                                <h5 className={`font-bold text-lg leading-tight ${activeEmailIdx === idx ? 'text-white' : 'text-gray-300'}`}>
                                                    {email.subject}
                                                </h5>
                                            </div>
                                            <div className="shrink-0">
                                                <CheckCircle2 className={`w-7 h-7 transition-all ${email.isGenerated ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'text-gray-700'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* COLUMNA DERECHA: CONFIGURACIÓN / EDITOR (7 Cols) */}
                            <div className="lg:col-span-7 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 bg-[#0B0B0B] border border-gray-800 rounded-[3rem] shadow-2xl">
                                <div className="p-8 md:p-12 relative flex-1 flex flex-col">
                                    
                                    {showSaveIndicator && (
                                        <div className="absolute top-4 right-12 z-50 flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in fade-in slide-in-from-top-1 duration-300">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Cambios guardados</span>
                                        </div>
                                    )}

                                    {/* */ /* Actualización: Sincronización de ID mock y validación de existencia de mensajes para evitar error 'isGenerated' de undefined - 20/05/2024 10:15 */ }
                                    {/* VISOR CONDICIONAL */}
                                    {editableEmails.length > 0 && editableEmails[activeEmailIdx] ? (
                                        editableEmails[activeEmailIdx].isGenerated ? (
                                            <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                                <div className="flex justify-between items-center bg-gray-800/30 p-4 rounded-2xl border border-white/5">
                                                    {/* */ /* Actualización: Eliminación de etiqueta verde y reposicionamiento del enlace de edición en blanco - 25/06/2024 11:30 */ }
                                                    <button 
                                                        onClick={() => handleUpdateEmail(activeEmailIdx, 'isGenerated', false)}
                                                        className="text-[10px] font-black text-white uppercase tracking-widest hover:underline transition-all"
                                                    >
                                                        Modificar estrategia del mensaje
                                                    </button>
                                                </div>

                                                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden flex flex-col flex-1">
                                                    <div className="h-10 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
                                                        <div className="flex gap-1.5">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                                        </div>
                                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Editor de Correo Persuasivo</div>
                                                        <div className="w-10"></div>
                                                    </div>

                                                    <div className="p-8 md:p-10 space-y-6 flex-1 flex flex-col">
                                                        {/* Campos de Cabecera */}
                                                        <div className="space-y-3 text-sm border-b border-gray-100 pb-6">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-gray-400 min-w-[60px] uppercase text-[10px]">De:</span>
                                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[10px] font-bold">{user.name.charAt(0)}</div>
                                                                    <span className="text-black font-bold">{user.name} &lt;{user.email}&gt;</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-gray-400 min-w-[60px] uppercase text-[10px]">Para:</span>
                                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">L</div>
                                                                    <span className="text-black font-bold">{strategy.avatars[0].name} (Avatar Estratégico)</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-bold text-gray-400 min-w-[60px] uppercase text-[10px] mt-2">Asunto:</span>
                                                                <textarea 
                                                                    value={editableEmails[activeEmailIdx].subject}
                                                                    onChange={(e) => handleUpdateEmail(activeEmailIdx, 'subject', e.target.value)}
                                                                    className="flex-1 bg-white border-none focus:ring-0 text-black font-black text-xl md:text-2xl leading-tight resize-none h-auto p-0"
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Cuerpo del Correo Editable con fondo gris clarito y paddings */}
                                                        <div className="flex-1 pt-4">
                                                            <div 
                                                                contentEditable
                                                                onBlur={(e) => handleUpdateEmail(activeEmailIdx, 'contentHtml', e.currentTarget.innerHTML)}
                                                                dangerouslySetInnerHTML={{ __html: editableEmails[activeEmailIdx].contentHtml }}
                                                                className="w-full h-full min-h-[400px] bg-gray-50 border border-gray-100 rounded-2xl p-10 focus:ring-0 text-black text-xl leading-[1.8] font-serif outline-none overflow-y-auto custom-scrollbar"
                                                                style={{ whiteSpace: 'pre-wrap' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center pt-4">
                                                    <button 
                                                        onClick={handleCopyEmail}
                                                        className="px-12 py-5 rounded-[1.5rem] bg-sky-500 hover:bg-sky-400 text-white font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-sky-900/20 transform hover:scale-105 active:scale-95"
                                                    >
                                                        <Copy className="w-5 h-5" /> Copiar Mensaje del Día {activeEmailIdx + 1}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* CONFIGURACIÓN ESTRATÉGICA (SI NO SE HA GENERADO) */
                                            <div className="relative z-10 space-y-12 animate-in fade-in duration-500">
                                                <div className="flex items-center justify-between">
                                                    <span className="bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                        Configurando: {editableEmails[activeEmailIdx].pilarType || 'Nutrición'}
                                                    </span>
                                                    <span className="text-white text-lg font-black uppercase tracking-widest">Correo del Día {activeEmailIdx + 1}</span>
                                                </div>

                                                {/* FORMULARIO DE INSTRUCCIONES */}
                                                <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] shadow-xl group/form relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
                                                    
                                                    <div className="flex items-center gap-4 mb-10">
                                                        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-400">
                                                            <Lightbulb className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-2xl font-black text-white tracking-tight">Estrategia de Correo Electrónico: Día No {activeEmailIdx + 1}</h4>
                                                            <p className="text-sm text-white font-bold uppercase tracking-widest mt-4 leading-relaxed">Nuestra inteligencia Artificial generará tu correo electrónico teniendo en cuenta la siguiente información.</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-10">
                                                        {/* Campo Asunto */}
                                                        <div className="space-y-3">
                                                            <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                                                <Edit3 className="w-5 h-5 text-[#FF5A1F]" /> Asunto Sugerido
                                                            </label>
                                                            <div className="relative">
                                                                <textarea 
                                                                    rows={2}
                                                                    value={editableEmails[activeEmailIdx].subject}
                                                                    onChange={(e) => handleUpdateEmail(activeEmailIdx, 'subject', e.target.value)}
                                                                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-xl outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all shadow-inner resize-none leading-relaxed"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Tipo de Correo con Swap Logic */}
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                                                    <Settings2 className="w-5 h-5 text-[#FF5A1F]" /> Pilar Estratégico (Tipo)
                                                                </label>
                                                                <button 
                                                                    onClick={() => setIsTypeLocked(!isTypeLocked)}
                                                                    className="text-xs font-black text-[#FF5A1F] uppercase tracking-widest hover:underline px-3 py-1 bg-[#FF5A1F]/10 rounded-lg border border-[#FF5A1F]/20 transition-all"
                                                                >
                                                                    {isTypeLocked ? 'Cambiar' : 'Cancelar'}
                                                                </button>
                                                            </div>
                                                            <div className="relative">
                                                                <select 
                                                                    disabled={isTypeLocked}
                                                                    value={editableEmails[activeEmailIdx].pilarType}
                                                                    onChange={(e) => handleTypeSwap(e.target.value)}
                                                                    className={`w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-xl outline-none transition-all shadow-inner appearance-none cursor-pointer ${isTypeLocked ? 'opacity-50 grayscale pointer-events-none' : 'border-yellow-500/50 ring-2 ring-yellow-500/10'}`}
                                                                >
                                                                    {emailTypes.map(t => (
                                                                        <option key={t} value={t}>{t}</option>
                                                                    ))}
                                                                </select>
                                                                {!isTypeLocked && (
                                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                        <ChevronDown className="w-6 h-6 text-yellow-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Campo Propósito */}
                                                        <div className="space-y-3">
                                                            <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                                                <Zap className="w-5 h-5 text-[#FF5A1F]" /> Propósito Estratégico del Día
                                                            </label>
                                                            <textarea 
                                                                rows={6}
                                                                value={editableEmails[activeEmailIdx].purpose}
                                                                onChange={(e) => handleUpdateEmail(activeEmailIdx, 'purpose', e.target.value)}
                                                                className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-gray-300 text-lg font-light leading-relaxed outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all shadow-inner resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pb-6">
                                                    <button 
                                                        onClick={handleGenerateSingleEmail}
                                                        className="w-full py-6 rounded-[2cm] bg-gradient-to-r from-[#FF5A1F] to-orange-500 hover:from-[#D94A1E] hover:to-orange-600 text-white font-black text-lg uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95"
                                                    >
                                                        <Wand2 className="w-7 h-7 fill-current" /> Generar Correo el Día No {activeEmailIdx + 1}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 space-y-4">
                                            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center">
                                                <Loader2 className="w-10 h-10 animate-spin text-[#FF5A1F]" />
                                            </div>
                                            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Cargando contenido del mensaje...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};