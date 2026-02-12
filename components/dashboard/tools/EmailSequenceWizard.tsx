import React, { useState, useEffect } from 'react';
/* */ /* Actualización: Importación de useSearchParams para soporte de Deep Linking - 25/05/2024 18:15 */
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
/* Fin de actualización - 25/05/2024 18:15 */
import { 
    Mail, Briefcase, ChevronRight, ArrowLeft, 
    Zap, Loader2, Info, Sparkles, Plus, 
    Check, Calendar, LayoutTemplate, X, Wand2, Lock,
    ChevronDown, ChevronUp, Settings2, Edit3, ShieldCheck, AlertTriangle,
    Lightbulb, CheckCircle2, User as UserIcon, Copy, Save, Target, Globe, Link as LinkIcon, ExternalLink
} from 'lucide-react';
import { api } from '../../../services/api';
import { Project, User, Plan, EmailMessage, LandingPage, AffiliateLink } from '../../../types';
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
    const [userPages, setUserPages] = useState<LandingPage[]>([]);

    // Estados para la creación de nuevos hotlinks integrada
    const [isAddingNewLink, setIsAddingNewLink] = useState(false);
    const [newLinkLabel, setNewLinkLabel] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [savingNewLink, setSavingNewLink] = useState(false);

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
                const [projectsData, plansData, pagesData] = await Promise.all([
                    api.getProjects(),
                    api.getPublicPlans().catch(() => []),
                    api.getPages().catch(() => [])
                ]);
                setProjects(projectsData);
                setUserPages(pagesData);

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
            const strategyData = project.strategy_json;
            const allSequences = await api.getEmailSequences();
            const existingSeq = allSequences.find(s => String(s.projectId) === String(project.id));
            
            const hasLinks = project.affiliateLinks && project.affiliateLinks.length > 0;
            const defaultHotlink = hasLinks ? project.affiliateLinks[0].url : '';

            if (existingSeq) {
                const realMessages = await api.getSequenceMessages(existingSeq.id);
                // Si los mensajes no tienen link definido y el proyecto tiene links, asignamos el primero por defecto
                const messagesWithDefaults = realMessages.map(m => ({
                    ...m,
                    redirectType: m.redirectType || (hasLinks ? 'hotlink' : 'landing'),
                    redirectUrl: m.redirectUrl || defaultHotlink
                }));
                setEditableEmails(messagesWithDefaults);
                if (strategyData) setStrategy(strategyData);
            } else if (strategyData) {
                setStrategy(strategyData);
                const nurtureEmails = strategyData.modules?.emails?.nurture || [];
                
                const mappedMessages: EmailMessage[] = nurtureEmails.map((email: any, idx: number) => ({
                    id: `temp-${idx}`,
                    sequenceId: '', 
                    dayIndex: idx,
                    subject: email.subject || '',
                    pilarType: email.type || '',
                    purpose: email.objective || '',
                    contentHtml: '',
                    isGenerated: false,
                    redirectType: hasLinks ? 'hotlink' : 'landing',
                    redirectUrl: defaultHotlink
                }));
                setEditableEmails(mappedMessages);
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
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = async (index: number, field: string, value: any) => {
        const newEmails = [...editableEmails];
        (newEmails[index] as any)[field] = value;
        setEditableEmails(newEmails);
        
        const message = newEmails[index];
        if (message.id.startsWith('temp-')) return;

        setShowSaveIndicator(true);
        try {
            const apiField = field === 'contentHtml' ? 'content_html' : (field === 'isGenerated' ? 'is_generated' : field);
            await api.updateEmailMessage(message.id, { [apiField]: value } as any);
            setTimeout(() => setShowSaveIndicator(false), 2000);
        } catch (e) {
            console.error("Error guardando cambio en mensaje", e);
        }
    };

    const handleTypeSwap = async (newType: string) => {
        const otherIdx = editableEmails.findIndex((e, i) => i !== activeEmailIdx && e.pilarType === newType);
        const currentType = editableEmails[activeEmailIdx].pilarType;
        
        const newEmails = [...editableEmails];
        if (otherIdx !== -1) {
            newEmails[otherIdx].pilarType = currentType;
            if (!newEmails[otherIdx].id.startsWith('temp-')) {
                await api.updateEmailMessage(newEmails[otherIdx].id, { pilarType: currentType } as any);
            }
        }
        newEmails[activeEmailIdx].pilarType = newType;
        if (!newEmails[activeEmailIdx].id.startsWith('temp-')) {
            await api.updateEmailMessage(newEmails[activeEmailIdx].id, { pilarType: newType } as any);
        }
        
        setEditableEmails(newEmails);
        setIsTypeLocked(true);
        setShowSaveIndicator(true);
        setTimeout(() => setShowSaveIndicator(false), 2000);
    };

    const handleAddNewHotlink = async () => {
        if (!selectedProject || !newLinkLabel || !newLinkUrl) return;
        setSavingNewLink(true);
        try {
            const newLink: AffiliateLink = { label: newLinkLabel, url: newLinkUrl };
            const updatedLinks = [...(selectedProject.affiliateLinks || []), newLink];
            
            await api.updateProject(selectedProject.id, {
                ...selectedProject,
                affiliateLinks: updatedLinks
            } as any);

            setSelectedProject({ ...selectedProject, affiliateLinks: updatedLinks });
            handleUpdateEmail(activeEmailIdx, 'redirectUrl', newLinkUrl);
            
            setIsAddingNewLink(false);
            setNewLinkLabel('');
            setNewLinkUrl('');
        } catch (e) {
            alert("Error al guardar the nuevo link.");
        } finally {
            setSavingNewLink(false);
        }
    };

    const handleGenerateSingleEmail = async () => {
        setIsGeneratingEmail(true);
        try {
            let currentMessages = [...editableEmails];
            
            if (currentMessages[activeEmailIdx].id.startsWith('temp-') && selectedProject) {
                const seqInfo = await api.createEmailSequence(selectedProject.id, `Secuencia: ${selectedProject.name}`);
                const realMessages = await api.getSequenceMessages(seqInfo.id);
                
                for (let i = 0; i < realMessages.length; i++) {
                    await api.updateEmailMessage(realMessages[i].id, {
                        subject: currentMessages[i].subject,
                        pilar_type: currentMessages[i].pilarType,
                        purpose: currentMessages[i].purpose
                    } as any);
                    realMessages[i].subject = currentMessages[i].subject;
                    realMessages[i].pilarType = currentMessages[i].pilarType;
                    realMessages[i].purpose = currentMessages[i].purpose;
                }
                currentMessages = realMessages;
                setEditableEmails(currentMessages);
            }

            await new Promise(resolve => setTimeout(resolve, 2500));
            
            const email = currentMessages[activeEmailIdx];
            const avatarName = strategy?.avatars[0]?.name.split(' ')[0] || "amiga";
            const targetUrl = email.redirectUrl || 'https://google.com';
            
            let generatedBody = `Hola ${avatarName},<br><br>Tal como te lo prometí, aquí tienes la llave para empezar tu transformación. Entiendo que hoy en día es difícil encontrar un camino claro en ${selectedProject?.niche}, pero estoy aquí para decirte que existe una <span style="color: #FF5A1F; font-weight: bold;">solución directa</span>.<br><br>He preparado este material pensando exclusivamente en resolver ese sentimiento de estancamiento que me comentaste. No se trata solo de aprender una técnica, sino de dominar un negocio que te brinde la libertad que mereces.<br><br><a href="${targetUrl}" style="color: #FF5A1F; text-decoration: underline; font-weight: bold;">[Haz clic aquí para acceder ahora mismo]</a><br><br>Haz clic en el enlace de abajo para acceder ahora mismo.<br><br>Espero que lo disfrutes,<br>${user.name}`;

            if (email.pilarType === 'Agitación del Dolor') {
                generatedBody = `Hola ${avatarName},<br><br>¿Alguna vez has sentido que trabajas 10 horas al día y al final del mes tu cuenta bancaria sigue igual? Ese nudo en el estómago es real y no es tu culpa, es el vehículo que estás usando.<br><br>Muchas personas en ${selectedProject?.niche} cometen el error de competir por precio en lugar de por valor. Mañana te mostraré cómo <span style="color: #FF5A1F; font-weight: bold;">romper ese ciclo para siempre</span>.<br><br><a href="${targetUrl}" style="color: #FF5A1F; text-decoration: underline; font-weight: bold;">[Consulta la guía de ayuda aquí]</a><br><br>Un abrazo,<br>${user.name}`;
            } else if (email.pilarType === 'Prueba Social') {
                generatedBody = `Hola ${avatarName},<br><br>Hoy quiero contarte la historia de una de mis alumnas que estaba exactamente donde tú estás hoy. Tenía miedo de fracasar y no sabía por dónde empezar.<br><br>Después de aplicar el método que te he estado compartiendo, logró sus <span style="color: #10B981; font-weight: bold;">primeros $500 extras</span> en menos de 15 días. Si ella pudo, tú también puedes.<br><br><a href="${targetUrl}" style="color: #FF5A1F; text-decoration: underline; font-weight: bold;">[Mira más resultados aquí]</a><br><br>Mañana te contaré el secreto técnico detrás de este éxito.<br><br>Saludos,<br>${user.name}`;
            }

            const newEmails = [...currentMessages];
            newEmails[activeEmailIdx].isGenerated = true;
            newEmails[activeEmailIdx].contentHtml = generatedBody;
            
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
    const currentEmail = editableEmails[activeEmailIdx];

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
                <button 
                    onClick={() => { 
                        if (step === 0 || urlProjectId) {
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
                    {step === 0 ? 'Volver' : (urlProjectId ? 'Ver otra Secuencia' : 'Cambiar Proyecto')}
                </button>
                
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
                                <>
                                    {projects.map((project) => (
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
                                                <p className="text-gray-400 text-lg leading-relaxed font-medium">{project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción.")}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleProjectSelect(project)}
                                                className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95"
                                            >
                                                Seleccionar <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => navigate('/dashboard/projects/create')}
                                        className="p-10 bg-transparent border-2 border-dashed border-gray-800 rounded-[3rem] hover:border-gray-600 hover:text-white transition-all text-gray-500 group flex flex-col items-center justify-center gap-6 shadow-2xl min-h-[400px]"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center shadow-lg group-hover:bg-gray-700 transition-colors">
                                            <Plus className="w-8 h-8 text-gray-400 group-hover:text-white" />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-xl font-black uppercase tracking-widest">Crear un nuevo proyecto</h4>
                                            <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-60">Define un nuevo nicho o producto</p>
                                        </div>
                                    </button>
                                </>
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

                                <div className="space-y-4 flex-1 pr-2">
                                    {editableEmails.map((email, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setActiveEmailIdx(idx)}
                                            className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-5 ${activeEmailIdx === idx ? 'bg-yellow-900/20 border-yellow-500/50 shadow-xl shadow-yellow-900/30 translate-x-2' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${activeEmailIdx === idx ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
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

                                    {editableEmails.length > 0 && editableEmails[activeEmailIdx] ? (
                                        editableEmails[activeEmailIdx].isGenerated ? (
                                            <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                                <div className="flex justify-between items-center bg-gray-800/30 p-4 rounded-2xl border border-white/5">
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
                                            <div className="relative z-10 space-y-12 animate-in fade-in duration-500 flex-1 flex flex-col">
                                                <div className="flex items-center justify-between">
                                                    <span className="bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                        Configurando: {editableEmails[activeEmailIdx].pilarType || 'Nutrición'}
                                                    </span>
                                                    <span className="text-white text-lg font-black uppercase tracking-widest">Correo del Día {activeEmailIdx + 1}</span>
                                                </div>

                                                <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] shadow-xl group/form relative overflow-hidden flex-1">
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

                                                        <div className="space-y-3">
                                                            <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                                                <Zap className="w-5 h-5 text-[#FF5A1F]" /> Propósito Estratégico del Día
                                                            </label>
                                                            <textarea 
                                                                rows={4}
                                                                value={editableEmails[activeEmailIdx].purpose}
                                                                onChange={(e) => handleUpdateEmail(activeEmailIdx, 'purpose', e.target.value)}
                                                                className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-6 text-gray-300 text-lg font-light leading-relaxed outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all shadow-inner resize-none mb-6"
                                                            />
                                                        </div>

                                                        <div className="space-y-4">
                                                            <label className="block text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                                                                <Target className="w-5 h-5 text-[#FF5A1F]" /> ¿Dónde dirigir a tu audiencia?
                                                            </label>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div 
                                                                    onClick={() => handleUpdateEmail(activeEmailIdx, 'redirectType', 'landing')}
                                                                    className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${editableEmails[activeEmailIdx].redirectType === 'landing' ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}
                                                                >
                                                                    <div className={`p-4 rounded-2xl transition-colors ${editableEmails[activeEmailIdx].redirectType === 'landing' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                                                        <Globe className="w-8 h-8" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${editableEmails[activeEmailIdx].redirectType === 'landing' ? 'text-white' : 'text-gray-400'}`}>Landing Page</h4>
                                                                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Envía el tráfico a una de tus páginas internas creadas.</p>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div 
                                                                    onClick={() => handleUpdateEmail(activeEmailIdx, 'redirectType', 'hotlink')}
                                                                    className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${editableEmails[activeEmailIdx].redirectType === 'hotlink' ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] shadow-lg shadow-orange-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}
                                                                >
                                                                    <div className={`p-4 rounded-2xl transition-colors ${editableEmails[activeEmailIdx].redirectType === 'hotlink' ? 'bg-[#FF5A1F] text-white' : 'bg-white/5 text-gray-500'}`}>
                                                                        <LinkIcon className="w-8 h-8" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${editableEmails[activeEmailIdx].redirectType === 'hotlink' ? 'text-white' : 'text-gray-400'}`}>Hotlink Proyecto</h4>
                                                                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Usa directamente tus enlaces de afiliado de Hotmart.</p>
                                                                    </div>
                                                                </div>

                                                                <div 
                                                                    onClick={() => handleUpdateEmail(activeEmailIdx, 'redirectType', 'external')}
                                                                    className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${editableEmails[activeEmailIdx].redirectType === 'external' ? 'bg-purple-600/10 border-purple-500 shadow-lg shadow-purple-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}
                                                                >
                                                                    <div className={`p-4 rounded-2xl transition-colors ${editableEmails[activeEmailIdx].redirectType === 'external' ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                                                        <ExternalLink className="w-8 h-8" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${editableEmails[activeEmailIdx].redirectType === 'external' ? 'text-white' : 'text-gray-400'}`}>Link Externo</h4>
                                                                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Cualquier otra página web externa que desees promocionar.</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="mt-4">
                                                                {editableEmails[activeEmailIdx].redirectType === 'landing' && (
                                                                    <div className="animate-in fade-in slide-in-from-top-2">
                                                                        <select
                                                                            value={userPages.find(p => (p.customDomain ? `https://${p.customDomain}` : `https://${p.subdomain}`) === editableEmails[activeEmailIdx].redirectUrl)?.id || ''}
                                                                            onChange={(e) => {
                                                                                const page = userPages.find(p => p.id === e.target.value);
                                                                                if (page) {
                                                                                    handleUpdateEmail(activeEmailIdx, 'redirectUrl', page.customDomain ? `https://${page.customDomain}` : `https://${page.subdomain}`);
                                                                                }
                                                                            }}
                                                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                                                        >
                                                                            <option value="" disabled>-- Selecciona una Landing Page --</option>
                                                                            {userPages.map(p => (
                                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                )}

                                                                {editableEmails[activeEmailIdx].redirectType === 'external' && (
                                                                    <div className="animate-in fade-in slide-in-from-top-2">
                                                                        <input
                                                                            type="text"
                                                                            value={editableEmails[activeEmailIdx].redirectUrl || ''}
                                                                            onChange={(e) => handleUpdateEmail(activeEmailIdx, 'redirectUrl', e.target.value)}
                                                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                                                                            placeholder="https://ejemplo.com/tu-enlace"
                                                                        />
                                                                    </div>
                                                                )}
                                                                
                                                                {editableEmails[activeEmailIdx].redirectType === 'hotlink' && (
                                                                    <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                                                                        {isAddingNewLink ? (
                                                                            <div className="p-6 bg-black border border-white/10 rounded-2xl space-y-4 shadow-xl">
                                                                                <div className="flex justify-between items-center mb-2">
                                                                                    <h5 className="text-white font-bold text-sm">Nuevo Hotlink para Proyecto</h5>
                                                                                    <button onClick={() => setIsAddingNewLink(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4"/></button>
                                                                                </div>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div className="space-y-1">
                                                                                        <label className="text-[10px] text-gray-500 font-black uppercase">Nombre del Enlace</label>
                                                                                        <input 
                                                                                            type="text" 
                                                                                            value={newLinkLabel}
                                                                                            onChange={e => setNewLinkLabel(e.target.value)}
                                                                                            className="w-full bg-gray-900 border border-white/5 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FF5A1F] outline-none"
                                                                                            placeholder="Ej: Checkout Pro"
                                                                                        />
                                                                                    </div>
                                                                                    <div className="space-y-1">
                                                                                        <label className="text-[10px] text-gray-500 font-black uppercase">URL Hotmart</label>
                                                                                        <input 
                                                                                            type="text" 
                                                                                            value={newLinkUrl}
                                                                                            onChange={e => setNewLinkUrl(e.target.value)}
                                                                                            className="w-full bg-gray-900 border border-white/5 rounded-xl px-3 py-2 text-emerald-400 text-sm focus:border-[#FF5A1F] outline-none"
                                                                                            placeholder="https://go.hotmart.com/..."
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <button 
                                                                                    onClick={handleAddNewHotlink}
                                                                                    disabled={savingNewLink || !newLinkLabel || !newLinkUrl}
                                                                                    className="w-full py-3 bg-[#FF5A1F] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#D94A1E] transition flex items-center justify-center gap-2"
                                                                                >
                                                                                    {savingNewLink ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                                                                                    Guardar en el Proyecto
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className={`relative ${!editableEmails[activeEmailIdx].redirectUrl ? 'ring-2 ring-red-500/50 rounded-xl' : ''}`}>
                                                                                <select
                                                                                    value={editableEmails[activeEmailIdx].redirectUrl || ''}
                                                                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF5A1F] outline-none transition appearance-none cursor-pointer"
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value === 'ADD_NEW') {
                                                                                            setIsAddingNewLink(true);
                                                                                        } else {
                                                                                            handleUpdateEmail(activeEmailIdx, 'redirectUrl', e.target.value);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <option value="">-- Elige un Hotlink --</option>
                                                                                    {selectedProject?.affiliateLinks?.map((link, i) => (
                                                                                        <option key={i} value={link.url}>{link.label}</option>
                                                                                    ))}
                                                                                    <option value="ADD_NEW" className="text-[#FF5A1F] font-bold">+ Añadir nuevo Hotlink</option>
                                                                                </select>
                                                                                {!editableEmails[activeEmailIdx].redirectUrl && (
                                                                                    <div className="absolute -bottom-6 left-1 flex items-center gap-1 text-red-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                                                                                        <AlertTriangle className="w-3 h-3" /> Link de destino obligatorio
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pb-6">
                                                    <button 
                                                        onClick={handleGenerateSingleEmail}
                                                        disabled={isGeneratingEmail || !editableEmails[activeEmailIdx].redirectUrl}
                                                        className={`w-full py-6 rounded-[2cm] transition-all shadow-xl flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95 font-black text-lg uppercase tracking-[0.2em] ${!editableEmails[activeEmailIdx].redirectUrl ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-[#FF5A1F] to-orange-500 hover:from-[#D94A1E] hover:to-orange-600 text-white shadow-[#FF5A1F]/20'}`}
                                                    >
                                                        <Wand2 className="w-7 h-7 fill-current" /> 
                                                        {!editableEmails[activeEmailIdx].redirectUrl ? 'Define un link para continuar' : `Generar Correo el Día No ${activeEmailIdx + 1}`}
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