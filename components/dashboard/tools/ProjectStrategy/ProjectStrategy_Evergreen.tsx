import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Sparkles, Check, Info, Crown, Mail, ArrowRight, BookOpen, ChevronRight, PenTool, PlayCircle, X, Loader2, Copy, Lock, Unlock, Search, BarChart, Eye, Target, Brain, Shield, Edit3, Bold, Italic, AlignLeft, AlignCenter, AlignRight, List, Type, Palette, CheckCircle2, Wand2, Code, AlertCircle, Play } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PlanFeatures, PlanLimits, Plan, Article, EmailMessage } from '../../../../types';
import { api } from '../../../../services/api';
import confetti from 'canvas-confetti';

interface ProjectStrategy_EvergreenProps {
    projectId: string;
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
    hideHeader?: boolean;
}

export const ProjectStrategy_Evergreen: React.FC<ProjectStrategy_EvergreenProps> = ({
    projectId, evergreenData, avatars, activeEvergreenEmail, setActiveEvergreenEmail, onUpgrade, features, planLimits, nextPlan, linkedArticles = [],
    hideHeader = false
}) => {
    const navigate = useNavigate();
    const { user, isSimulating } = useOutletContext() as any;
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const [nurturingMessages, setNurturingMessages] = useState<EmailMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);

    // Estados para el flujo de generación profesional
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [generationError, setGenerationError] = useState<string | null>(null);

    // Estados para el editor profesional (igual que en ProjectStrategy_Email)
    const [localSubject, setLocalSubject] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [saveIndicator, setSaveIndicator] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isPreviewMode, setIsPreviewMode] = useState(true);
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [editingLink, setEditingLink] = useState<{ element: HTMLAnchorElement, url: string } | null>(null);
    
    const editorRef = useRef<HTMLDivElement>(null);
    const subjectRef = useRef<HTMLTextAreaElement>(null);
    const lastActiveEmailRef = useRef<number>(activeEvergreenEmail);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const sequences = await api.getEmailSequences();
                const nurturingSeq = sequences.find(s => s.projectId === projectId && s.type === 'nurturing');
                if (nurturingSeq) {
                    const messages = await api.getSequenceMessages(nurturingSeq.id);
                    setNurturingMessages(messages.filter(m => m.type === 'nurturing'));
                }
            } catch (error) {
                console.error("Error loading nurturing messages:", error);
            } finally {
                setLoadingMessages(false);
            }
        };
        loadMessages();
    }, [projectId]);

    // Si no hay artículos, mostramos el estado vacío con invitación a generar contenido
    if (linkedArticles.length === 0) {
        return (
            <div id="psd-evergreen-empty" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
            {!hideHeader && (
                <div className="seccion_encabezado space-y-12 mb-20">
                    {/* --- HEADER SECCIÓN --- */}
                    <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                        {/* Degradado superior sutil */}
                        <div className="absolute inset-x-0 -top-24 h-[600px] bg-orange-600/10 blur-[140px] -z-10 rounded-full" />
                        
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                            <Sparkles className="w-4 h-4" /> Correos Electrónicos a largo plazo
                        </div>
                        
                        <div className="space-y-4 px-4">
                            <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none text-center max-w-5xl mx-auto">
                                Secuencia de Autoridad <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">(Evergreen)</span>
                            </h3>
                            <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                                Esta secuencia se construye automáticamente a partir de los artículos que generes en la sección "Contenido". Cada artículo se transforma en un punto de contacto para nutrir a tu audiencia.
                            </p>
                        </div>
                    </div>

                    {/* --- VIDEO EXPLICATIVO --- */}
                    <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                        <div className="inline-flex items-center gap-3 text-orange-300 font-extrabold uppercase tracking-widest text-sm bg-orange-500/5 px-8 py-4 rounded-2xl border border-orange-500/10 backdrop-blur-sm mx-auto">
                            <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                        </div>
                        
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                            
                            <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-orange-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                                    title="Video Tutorial Evergreen" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

    // Lógica de límites
    const isRealAdmin = (planLimits?.planName === 'admin' || user?.role === 'admin') && !isSimulating;
    const emailsUsed = nurturingMessages.length;
    const maxEmails = planLimits?.maxEmailSequencesNurturing || 0;
    const usagePercent = maxEmails > 0 ? Math.min(100, (emailsUsed / maxEmails) * 100) : 0;
    const isLimitReached = !isRealAdmin && maxEmails > 0 && emailsUsed >= maxEmails;

    // Color de la barra de progreso
    const progressColor = (usagePercent > 90 && !isRealAdmin) ? 'bg-red-500' : usagePercent > 70 ? 'bg-orange-500' : 'bg-blue-500';

    // Sincronizar estados locales cuando cambiamos de correo
    useEffect(() => {
        const dayNum = 8 + (activeEvergreenEmail * 2);
        const dbMessage = nurturingMessages.find(m => m.dayIndex === dayNum);
        
        if (lastActiveEmailRef.current !== activeEvergreenEmail || localSubject === '' || (dbMessage && !localSubject)) {
            const tabName = `Día ${dayNum}`;
            if (dbMessage) {
                setLocalSubject(dbMessage.subject || tabName);
            } else {
                setLocalSubject(tabName);
            }
            setIsPreviewMode(true);
            lastActiveEmailRef.current = activeEvergreenEmail;
        }
    }, [activeEvergreenEmail, nurturingMessages, linkedArticles]);

    // Auto-resize subject
    useEffect(() => {
        if (subjectRef.current) {
            subjectRef.current.style.height = 'auto';
            subjectRef.current.style.height = `${subjectRef.current.scrollHeight}px`;
        }
    }, [localSubject]);

    const handleUpdateMessage = async (field: string, value: any) => {
        if (field === 'subject') setLocalSubject(value);

        const dayNum = 8 + (activeEvergreenEmail * 2);
        const dbMessage = nurturingMessages.find(m => m.dayIndex === dayNum);
        if (!dbMessage) return;

        setSaveIndicator('saving');
        try {
            let apiField = field;
            if (field === 'contentHtml') apiField = 'content_html';
            
            await api.updateEmailMessage(dbMessage.id, { [apiField]: value } as any);
            
            // Actualizar estado local de mensajes
            setNurturingMessages(prev => prev.map(m => m.id === dbMessage.id ? { ...m, [field]: value } : m));
            
            setSaveIndicator('saved');
            setTimeout(() => setSaveIndicator('idle'), 2000);
        } catch (e) {
            console.error(e);
            setSaveIndicator('idle');
        }
    };

    const handleEditorClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        setIsPreviewMode(false);

        if (anchor && editorRef.current?.contains(anchor)) {
            e.preventDefault();
            setEditingLink({
                element: anchor as HTMLAnchorElement,
                url: anchor.getAttribute('href') || ''
            });
        } else {
            setEditingLink(null);
        }
    };

    const handleLinkUpdate = (newUrl: string) => {
        if (editingLink) {
            editingLink.element.setAttribute('href', newUrl);
            setEditingLink({ ...editingLink, url: newUrl });
            if (editorRef.current) {
                handleUpdateMessage('contentHtml', editorRef.current.innerHTML);
            }
        }
    };

    const execCommand = (command: string, value: any = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            handleUpdateMessage('contentHtml', editorRef.current.innerHTML);
        }
    };

    const handleGenerateEmail = async () => {
        const article = linkedArticles[activeEvergreenEmail];
        if (!article || generationStatus === 'generating') return;

        setShowConfirmModal(false);
        setGeneratingId(article.id);
        setGenerationStatus('generating');
        setProgress(0);
        setSecondsElapsed(0);
        setGenerationError(null);

        // Mensajes de carga dinámicos
        const messages = [
            "Analizando el contenido del artículo...",
            "Extrayendo puntos clave de valor...",
            "Estructurando el gancho persuasivo...",
            "Redactando el cuerpo del correo...",
            "Optimizando el llamado a la acción...",
            "Finalizando detalles del copy..."
        ];
        setLoadingMessage(messages[0]);

        // Intervalo para actualizar progreso y mensajes
        const interval = setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
            setProgress(prev => {
                if (prev < 90) return prev + Math.random() * 5;
                return prev;
            });
            setLoadingMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                if (currentIndex < messages.length - 1 && Math.random() > 0.7) {
                    return messages[currentIndex + 1];
                }
                return prev;
            });
        }, 1000);

        try {
            // Llamada al nuevo endpoint centralizado a través del servicio api
            const result = await api.generateEvergreenEmail(projectId, {
                title: article.title,
                description: article.description,
                contentHtml: article.contentHtml
            });

            // --- ASOCIAR SOLO CON email_messages de tipo 'nurturing' ---
            // 1. Asegurar que existe la secuencia de nutrición
            const seq = await api.createEmailSequence(projectId, "Secuencia de Nutrición", 'nurturing');
            const sequenceId = seq.id;

            // 2. Upsert del mensaje en la secuencia (Día 8, 10, 12...)
            const dayIndex = 8 + (activeEvergreenEmail * 2);
            const newMessage = {
                sequenceId,
                dayIndex,
                subject: result.subject,
                contentHtml: result.body,
                type: 'nurturing' as const,
                pilarType: 'Nutrición',
                purpose: `Contenido de Valor: ${article.title}`
            };
            
            await api.upsertEmailMessage(newMessage);

            // Actualizar estado local para evitar recarga
            setNurturingMessages(prev => {
                const existing = prev.findIndex(m => m.dayIndex === dayIndex);
                if (existing !== -1) {
                    return prev.map((m, i) => i === existing ? { ...m, ...newMessage, id: m.id } : m);
                }
                return [...prev, { ...newMessage, id: `temp-${Date.now()}` } as EmailMessage];
            });
            
            setLocalSubject(result.subject);
            setIsPreviewMode(true);
            
            // Éxito
            clearInterval(interval);
            setProgress(100);
            setGenerationStatus('success');
            
            // Disparar confeti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF5A1F', '#3B82F6', '#FFFFFF']
            });

        } catch (error: any) {
            console.error("Error generating email:", error);
            clearInterval(interval);
            setGenerationStatus('error');
            setGenerationError(error.message || "Hubo un error al generar el correo. Por favor intenta de nuevo.");
        } finally {
            setGeneratingId(null);
        }
    };

    const handleCopyEmail = () => {
        const dayNum = 8 + (activeEvergreenEmail * 2);
        const email = nurturingMessages.find(m => m.dayIndex === dayNum);
        if (!email?.contentHtml) return;
        
        const htmlContent = `<div>${email.contentHtml}</div>`;
        const plainText = email.contentHtml.replace(/<[^>]*>/g, '');
        const blobHtml = new Blob([htmlContent], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });
        const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];

        navigator.clipboard.write(data).then(() => {
            alert("Mensaje de Correo Electrónico Copiado Correctamente. Pégalo en tu Sistema de Envío de Correos Masivos.");
        }).catch(() => {
            navigator.clipboard.writeText(plainText);
            alert("Copiado como texto plano.");
        });
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    // Mapeamos los artículos reales a una secuencia dinámica basada en email_messages
    const dynamicSequence = linkedArticles.map((article, idx) => {
        const dayNum = 8 + (idx * 2);
        const dbMessage = nurturingMessages.find(m => m.dayIndex === dayNum);
        
        return {
            id: article.id,
            day: `Día ${dayNum}`,
            subject: dbMessage?.subject || article.title,
            body: dbMessage?.contentHtml || '',
            type: 'Evergreen / Valor',
            objective: 'Construir autoridad de marca enviando tráfico al blog de tu landing page.',
            articleSlug: article.slug,
            originalArticle: article,
            isGenerated: !!dbMessage
        };
    });

    const activeEmail = dynamicSequence[activeEvergreenEmail] || dynamicSequence[0];

    return (
        <div id="psd-evergreen-section" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen pt-8">
            {/* ENCABEZADO ESTRATÉGICO */}
            {!hideHeader && (
                <div className="seccion_encabezado space-y-12 mb-20">
                    {/* --- HEADER SECCIÓN --- */}
                    <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                        {/* Degradado superior sutil */}
                        <div className="absolute inset-x-0 -top-24 h-[600px] bg-orange-600/10 blur-[140px] -z-10 rounded-full" />
                        
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                            <Sparkles className="w-4 h-4" /> Secuencia dinámica activa
                        </div>
                        
                        <div className="space-y-4 px-4">
                            <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none text-center max-w-5xl mx-auto">
                                Tu Estrategia <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">de Nutrición (Evergreen)</span>
                            </h3>
                            <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                                Tienes {linkedArticles.length} artículos vinculados. El sistema ha programado estos correos para enviarse a partir del Día 8, manteniendo tu oferta presente sin ser invasivo.
                            </p>
                        </div>
                    </div>

                    {/* --- VIDEO EXPLICATIVO --- */}
                    <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                        <div className="inline-flex items-center gap-3 text-orange-300 font-extrabold uppercase tracking-widest text-sm bg-orange-500/5 px-8 py-4 rounded-2xl border border-orange-500/10 backdrop-blur-sm mx-auto">
                            <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                        </div>
                        
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                            
                            <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-orange-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                                    title="Video Tutorial Evergreen" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CUADRÍCULA DE 12 COLUMNAS: LISTA + VISTA PREVIA */}
            <div id="psd-evergreen-grid" className="grid lg:grid-cols-12 gap-8 max-w-[85em] mx-auto">
                
                {/* COLUMNA IZQUIERDA: LISTADO DE CORREOS (Ocupa 5 de 12) */}
                <div id="psd-evergreen-list-col" className="lg:col-span-5 bg-gray-900 p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl flex flex-col h-full">
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-orange-900/30 rounded-2xl text-orange-400 border border-orange-900/50">
                            <Mail className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Email Marketing: Secuencia de Nutrición</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Sincronizado con tus Artículos</p>
                        </div>
                    </div>

                    {/* BARRA DE PROGRESO DE LÍMITES */}
                    <div className="mb-10 p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Correos de Nutrición</span>
                            <span className="text-white font-bold">{emailsUsed} / {maxEmails}</span>
                        </div>
                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ${progressColor}`}
                                style={{ width: `${usagePercent}%` }}
                            ></div>
                        </div>
                        {isLimitReached && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-orange-400 uppercase tracking-wider animate-pulse">
                                <Crown className="w-3 h-3" /> Has alcanzado el límite de tu plan
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                        {dynamicSequence.map((email, idx) => {
                            const isActive = activeEvergreenEmail === idx;
                            const isGenerated = !!email.body;

                            return (
                                <div 
                                    key={email.id} 
                                    onClick={() => setActiveEvergreenEmail(idx)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${isGenerated ? 'bg-emerald-600 border-emerald-500 text-white' : isActive ? 'bg-orange-900/20 border-orange-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'}`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium text-lg leading-snug ${isGenerated ? 'text-white' : isActive ? 'text-orange-300' : 'text-gray-300 group-hover:text-white'} flex items-center gap-2`}>
                                            {!isGenerated && <Lock className="w-4 h-4 text-gray-500" />}
                                            {email.subject}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                                {email.day}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${isGenerated ? 'bg-white border-white' : 'border-gray-600 group-hover:border-orange-400'}`}>
                                        {isGenerated && <Check className="w-4 h-4 font-bold text-emerald-600" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMNA DERECHA: VISTA PREVIA DEL CORREO (Ocupa 7 de 12) */}
                <div id="psd-evergreen-preview-col" className="lg:col-span-7 bg-gradient-to-br from-gray-900 via-gray-900 to-orange-900/10 border border-white/5 rounded-[3rem] p-10 flex flex-col relative overflow-hidden h-full min-h-[600px] shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Target className="w-40 h-40 text-orange-500" />
                    </div>
                    <div className={`absolute top-0 left-0 w-1 h-full ${activeEmail.isGenerated ? 'bg-emerald-500/50' : 'bg-orange-500/50'}`}></div>

                    <div className="relative z-10 flex flex-col h-full">
                        {activeEmail.isGenerated ? (
                            <div className="flex flex-col h-full space-y-6">
                                <div className="relative z-10 flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-black text-white uppercase tracking-tight">
                                            {activeEmail.type}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 border border-orange-400/30">
                                                {activeEmail.day}
                                            </span>
                                            {saveIndicator === 'saving' && <span className="flex items-center gap-2 text-orange-400 text-[10px] font-bold uppercase tracking-widest"><Loader2 className="w-3 h-3 animate-spin"/> Guardando...</span>}
                                            {saveIndicator === 'saved' && <span className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest"><CheckCircle2 className="w-3 h-3"/> Guardado</span>}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden flex flex-col flex-1">
                                        <div className="h-10 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                            </div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Editor de Correo Profesional</div>
                                            <div className="w-10"></div>
                                        </div>

                                        <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col">
                                            <div className="space-y-3 text-sm border-b border-gray-100 pb-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-400 min-w-[60px] uppercase text-sm">De:</span>
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">{user?.name?.charAt(0) || 'A'}</div>
                                                        <div className="flex flex-col">
                                                            <span className="text-black font-bold leading-none text-base">{user?.name || 'Tu Asistente'}</span>
                                                            <span className="text-base text-gray-400 font-medium">{user?.email || 'asistente@marketing.com'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-400 min-w-[60px] uppercase text-sm">Para:</span>
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">L</div>
                                                        <span className="text-black font-bold text-base">Tu Suscriptor (Avatar Estratégico)</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2 bg-orange-50/50 p-5 rounded-2xl border-2 border-dashed border-orange-200 transition-all hover:bg-orange-100/30 group/subject shadow-inner" style={{ marginTop: '3em' }}>
                                                    <span className="font-bold text-orange-500 min-w-[70px] uppercase text-[1em] mt-2.5">Asunto:</span>
                                                    <textarea 
                                                        ref={subjectRef}
                                                        value={localSubject}
                                                        title="Haz clic para editar el asunto"
                                                        onChange={(e) => {
                                                            setLocalSubject(e.target.value);
                                                            handleUpdateMessage('subject', e.target.value);
                                                            e.target.style.height = 'auto';
                                                            e.target.style.height = `${e.target.scrollHeight}px`;
                                                        }}
                                                        className="flex-1 bg-transparent border-none focus:ring-0 text-black font-normal text-[1.2rem] leading-[1.3em] resize-none p-0 cursor-text placeholder:text-gray-300 overflow-hidden"
                                                        rows={1}
                                                        placeholder="Escribe el asunto aquí..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 pt-4 relative">
                                                {/* Link Editor Floating UI */}
                                                {editingLink && (
                                                    <div 
                                                        className="absolute z-[100] bg-white border border-gray-200 rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200 link-editor-popup"
                                                        style={{
                                                            top: `${editingLink.element.offsetTop - 70}px`,
                                                            left: `${editingLink.element.offsetLeft}px`
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex flex-col gap-1 w-full">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enlace del Botón</label>
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    type="text"
                                                                    value={editingLink.url}
                                                                    onChange={(e) => handleLinkUpdate(e.target.value)}
                                                                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-blue-600 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 w-full min-w-[300px]"
                                                                    placeholder="https://..."
                                                                    autoFocus
                                                                />
                                                                <button 
                                                                    onClick={() => setEditingLink(null)}
                                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors shrink-0"
                                                                >
                                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* WYSIWYG Toolbar */}
                                                {!isPreviewMode && (
                                                    <div className="sticky top-0 z-30 mb-4 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-1.5 rounded-t-xl text-[10px] font-black uppercase tracking-widest">
                                                            <Edit3 className="w-3 h-3" /> {isHtmlMode ? 'Modo HTML' : 'Modo Edición'}
                                                        </div>
                                                        <div className="bg-white border border-gray-200 p-2 flex flex-wrap gap-1 items-center rounded-b-xl rounded-tr-xl shadow-xl">
                                                            {!isHtmlMode && (
                                                                <>
                                                                    <button onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700" title="Negrita"><Bold className="w-4 h-4" /></button>
                                                                    <button onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700" title="Cursiva"><Italic className="w-4 h-4" /></button>
                                                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                                                    <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700" title="Alinear Izquierda"><AlignLeft className="w-4 h-4" /></button>
                                                                    <button onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700" title="Alinear Centro"><AlignCenter className="w-4 h-4" /></button>
                                                                    <button onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700" title="Alinear Derecha"><AlignRight className="w-4 h-4" /></button>
                                                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                                                    <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700" title="Lista"><List className="w-4 h-4" /></button>
                                                                    <button onClick={() => execCommand('formatBlock', 'h2')} className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700" title="Título"><Type className="w-4 h-4" /></button>
                                                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                                                    <button onClick={() => execCommand('foreColor', '#FF5A1F')} className="p-2 hover:bg-gray-200 rounded transition-colors text-[#FF5A1F]" title="Color Principal"><Palette className="w-4 h-4" /></button>
                                                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                                                </>
                                                            )}
                                                            <button 
                                                                onClick={() => setIsHtmlMode(!isHtmlMode)} 
                                                                className={`p-2 rounded transition-colors ${isHtmlMode ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-200 text-gray-700'}`} 
                                                                title={isHtmlMode ? "Vista Visual" : "Ver HTML"}
                                                            >
                                                                <Code className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="flex-1 relative">
                                                    {isHtmlMode && !isPreviewMode ? (
                                                        <textarea
                                                            value={activeEmail.body}
                                                            onChange={(e) => handleUpdateMessage('contentHtml', e.target.value)}
                                                            className="w-full h-full min-h-[450px] rounded-3xl p-8 md:p-12 bg-gray-900 text-emerald-400 font-mono text-sm outline-none border border-gray-800 focus:ring-4 focus:ring-emerald-500/10 overflow-y-auto custom-scrollbar"
                                                            placeholder="Escribe tu HTML aquí..."
                                                        />
                                                    ) : (
                                                        <div 
                                                            ref={editorRef}
                                                            contentEditable={!isPreviewMode}
                                                            onClick={handleEditorClick}
                                                            onFocus={() => setIsPreviewMode(false)}
                                                            onBlur={(e) => {
                                                                const currentTarget = e.currentTarget;
                                                                setTimeout(() => {
                                                                    if (document.activeElement?.closest('.link-editor-popup')) return;
                                                                    setIsPreviewMode(true);
                                                                    handleUpdateMessage('contentHtml', currentTarget.innerHTML);
                                                                }, 200);
                                                            }}
                                                            className={`w-full h-full min-h-[450px] rounded-3xl p-8 md:p-12 focus:ring-4 focus:ring-orange-500/5 text-black text-[1.3rem] leading-[1.7em] font-serif outline-none overflow-y-auto custom-scrollbar cursor-text transition-all [&_p]:pt-[1.1em] [&_a]:my-8 [&_a]:inline-block ${!isPreviewMode ? 'bg-yellow-50/50 border-2 border-dashed border-yellow-400 shadow-2xl ring-1 ring-yellow-100' : 'bg-gray-50 border border-gray-100 hover:bg-gray-100/50'}`}
                                                            title="Haz clic para editar el contenido del mensaje"
                                                            dangerouslySetInnerHTML={{ __html: activeEmail.body }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleCopyEmail} className="flex-1 py-5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3">
                                        <Copy className="w-5 h-5" /> Copiar Contenido
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col h-full">
                                <div className="flex flex-col items-center text-center relative animate-in zoom-in-95 w-full h-full">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                        <Lock className="w-40 h-40 text-orange-500" />
                                    </div>
                                    
                                    <div className="w-full text-left mb-8">
                                        <h3 className="text-white mb-6 font-bold" style={{ fontSize: '1.6rem', lineHeight: '2rem' }}>
                                            {activeEmail.originalArticle.title}
                                        </h3>
                                        
                                        <div className="bg-orange-500/5 rounded-2xl p-6 border border-orange-500/20 backdrop-blur-sm mb-8">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Brain className="w-5 h-5 text-orange-400" />
                                                <span className="text-white font-bold text-xs uppercase tracking-widest">Enfoque Estratégico</span>
                                            </div>
                                            <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                                                <p className="text-white text-lg font-light leading-relaxed">
                                                    {activeEmail.originalArticle.psychologicalStrategy?.focus || activeEmail.originalArticle.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                                        <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-lg animate-pulse">
                                            <Lock className="w-10 h-10 text-orange-500" />
                                        </div>
                                        
                                        <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Contenidos Disponibles para Desbloquear</h4>
                                        <p className="text-white font-medium leading-relaxed max-w-md mx-auto mb-10 text-lg">
                                            Nuestro sistema convertirá tu artículo de Blog en un Contenido optimizado para Email Marketing. Haz clic en Desbloquear para generar el correo electrónico.
                                        </p>

                                        <div className="w-full max-w-sm space-y-4">
                                            <button 
                                                onClick={() => isLimitReached ? onUpgrade() : setShowConfirmModal(true)}
                                                disabled={generatingId === activeEmail.id || (isLimitReached && !activeEmail.isGenerated)}
                                                className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl shadow-orange-900/40 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group ${isLimitReached && !activeEmail.isGenerated ? 'bg-gray-800 text-gray-500' : 'bg-orange-600 hover:bg-orange-500 text-white'}`}
                                            >
                                                {generatingId === activeEmail.id ? (
                                                    <>
                                                        <Loader2 className="w-6 h-6 animate-spin" /> Redactando...
                                                    </>
                                                ) : isLimitReached && !activeEmail.isGenerated ? (
                                                    <>
                                                        <Crown className="w-6 h-6" /> Límite Alcanzado
                                                    </>
                                                ) : (
                                                    <>
                                                        <Unlock className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Desbloquear Mensaje de Email
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER INFORMATIVO */}
            <div className="max-w-[70em] mx-auto text-center pt-12 border-t border-white/5 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sistema Evergreen Automatizado v2.9 — Motor de Autoridad Dinámico</p>
            </div>

            {/* MODAL DE CONFIRMACIÓN Y LÍMITES */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 !mt-0" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-purple-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-rose-500"></div>
                        <div className="p-8 md:p-10 space-y-8 flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-3xl flex items-center justify-center mx-auto border border-purple-500/20 shadow-lg shadow-purple-900/10 animate-pulse"><Sparkles className="w-10 h-10" /></div>
                                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                                    Confirmar Consumo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Créditos</span>
                                </h1>
                                <p className="text-white text-lg leading-relaxed font-normal">
                                    Al desbloquear este artículo estratégico se consumirá 1 crédito de tu plan actual.
                                </p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-inner text-left">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Créditos de Artículos</span>
                                    <span className="text-white font-bold text-sm">{emailsUsed} / {maxEmails}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
                                    <div className={`h-full transition-all duration-[1500ms] ease-out rounded-full shadow-lg ${progressColor}`} style={{ width: `${usagePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button>
                            <button onClick={handleGenerateEmail} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Confirmar y Desbloquear</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PANTALLA DE CARGA DE GENERACIÓN */}
            {generationStatus === 'generating' && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
                    <div className="relative mb-12">
                        <div className="w-32 h-32 bg-orange-500/10 rounded-[2.5rem] flex items-center justify-center animate-pulse border border-orange-500/20">
                            <Wand2 className="w-16 h-16 text-orange-500" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-4">Redactando tu Correo Evergreen</h3>
                    <p className="text-orange-400 font-bold text-sm uppercase tracking-[0.3em] mb-12">{loadingMessage}</p>
                    
                    <div className="w-full max-w-md space-y-4">
                        <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-orange-600 to-red-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <span>Progreso: {Math.round(progress)}%</span>
                            <span>Tiempo: {secondsElapsed}s</span>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE ÉXITO */}
            {generationStatus === 'success' && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#161616] border border-white/10 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                        <div className="p-10 text-center space-y-8">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-lg mx-auto">
                                <Check className="w-12 h-12" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">¡Correo Generado!</h3>
                                <p className="text-gray-400 font-medium text-lg">Tu correo de nutrición ha sido redactado con éxito y está listo para ser revisado.</p>
                            </div>
                            <button 
                                onClick={() => setGenerationStatus('idle')}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/20 uppercase text-sm tracking-widest flex items-center justify-center gap-3"
                            >
                                <Eye className="w-5 h-5" /> Ver Correo Ahora
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE ERROR */}
            {generationStatus === 'error' && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#161616] border border-white/10 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-800"></div>
                        <div className="p-10 text-center space-y-8">
                            <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg mx-auto">
                                <AlertCircle className="w-12 h-12" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Error de Generación</h3>
                                <p className="text-gray-400 font-medium">{generationError || "Hubo un problema al conectar con la IA. Por favor, intenta de nuevo."}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleGenerateEmail}
                                    className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-900/20 uppercase text-sm tracking-widest flex items-center justify-center gap-3"
                                >
                                    <Sparkles className="w-5 h-5" /> Reintentar Generación
                                </button>
                                <button 
                                    onClick={() => setGenerationStatus('idle')}
                                    className="w-full py-5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
