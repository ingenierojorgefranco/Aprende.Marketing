import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Sparkles, Check, Info, Crown, Mail, ArrowRight, BookOpen, ChevronRight, PenTool, PlayCircle, X, Loader2, Copy, Lock, Unlock, Search, BarChart, Eye, Target, Brain, Shield, Edit3, Bold, Italic, AlignLeft, AlignCenter, AlignRight, List, Type, Palette, CheckCircle2, Wand2 } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PlanFeatures, PlanLimits, Plan, Article, EmailMessage } from '../../../../types';
import { api } from '../../../../services/api';

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
}

export const ProjectStrategy_Evergreen: React.FC<ProjectStrategy_EvergreenProps> = ({
    projectId, evergreenData, avatars, activeEvergreenEmail, setActiveEvergreenEmail, onUpgrade, features, planLimits, nextPlan, linkedArticles = []
}) => {
    const navigate = useNavigate();
    const { user } = useOutletContext() as any;
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const [nurturingMessages, setNurturingMessages] = useState<EmailMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);

    // Estados para el editor profesional (igual que en ProjectStrategy_Email)
    const [localSubject, setLocalSubject] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [saveIndicator, setSaveIndicator] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isPreviewMode, setIsPreviewMode] = useState(true);
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
            <div id="psd-evergreen-empty" className="space-y-12 animate-in fade-in duration-500 pt-8">
                <div id="psd-evergreen-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                        <Sparkles className="w-4 h-4" /> Correos Electrónicos a largo plazo
                    </div>
                    <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                        Secuencia de Autoridad <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">(Evergreen)</span>
                    </h3>
                    
                    <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                        <p className="flex-1 border-l-4 border-orange-500 pl-8 py-2">
                            Esta secuencia se construye automáticamente a partir de los artículos que generes en la sección "Contenido". Cada artículo se transforma en un punto de contacto para nutrir a tu audiencia.
                        </p>
                        <div className="hidden md:block w-px h-24 bg-blue-500/30"></div>
                        <div 
                            className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                        >
                            <iframe 
                                className="w-full h-full rounded-2xl"
                                src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
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

    // Lógica de límites
    const emailsUsed = nurturingMessages.length;
    const maxEmails = planLimits?.maxEmailSequencesNurturing || 0;
    const usagePercent = maxEmails > 0 ? Math.min(100, (emailsUsed / maxEmails) * 100) : 0;
    const isLimitReached = maxEmails > 0 && emailsUsed >= maxEmails;

    // Color de la barra de progreso
    const progressColor = usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-orange-500' : 'bg-blue-500';

    // Sincronizar estados locales cuando cambiamos de correo
    useEffect(() => {
        const dayNum = 8 + (activeEvergreenEmail * 2);
        const dbMessage = nurturingMessages.find(m => m.dayIndex === dayNum);
        
        if (lastActiveEmailRef.current !== activeEvergreenEmail || localSubject === '' || (dbMessage && !localSubject)) {
            if (dbMessage) {
                setLocalSubject(dbMessage.subject || '');
            } else {
                const article = linkedArticles[activeEvergreenEmail];
                setLocalSubject(article ? `[LECTURA RECOMENDADA] ${article.title}` : '');
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
        if (!article || generatingId) return;

        setShowConfirmModal(false);
        setGeneratingId(article.id);
        setIsGenerating(true);

        try {
            // Llamada al nuevo endpoint centralizado en el backend
            const response = await fetch('/api/email/generate-evergreen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    projectId,
                    articleData: {
                        title: article.title,
                        description: article.description,
                        contentHtml: article.contentHtml
                    }
                })
            });

            if (!response.ok) throw new Error("Error en la generación del correo");
            const result = await response.json();

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
        } catch (error) {
            console.error("Error generating email:", error);
            alert("Hubo un error al generar el correo. Por favor intenta de nuevo.");
        } finally {
            setGeneratingId(null);
            setIsGenerating(false);
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
            subject: dbMessage?.subject || `[LECTURA RECOMENDADA] ${article.title}`,
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
        <div id="psd-evergreen-section" className="space-y-12 animate-in fade-in duration-500 pt-8">
            {/* ENCABEZADO ESTRATÉGICO */}
            <div id="psd-evergreen-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                    <Sparkles className="w-4 h-4" /> Secuencia dinámica activa
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Tu Estrategia <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">de Nutrición (Evergreen)</span>
                </h3>
                
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-blue-500 pl-8 py-2">
                        Tienes {linkedArticles.length} artículos vinculados. El sistema ha programado estos correos para enviarse a partir del Día 8, manteniendo tu oferta presente sin ser invasivo.
                    </p>
                    <div className="hidden md:block w-px h-24 bg-orange-500/30"></div>
                    <div 
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                    >
                        <iframe 
                            className="w-full h-full rounded-2xl"
                            src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
                            title="Video Tutorial" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* CUADRÍCULA DE 12 COLUMNAS: LISTA + VISTA PREVIA */}
            <div id="psd-evergreen-grid" className="grid lg:grid-cols-12 gap-8 max-w-[85em] mx-auto">
                
                {/* COLUMNA IZQUIERDA: LISTADO DE CORREOS (Ocupa 5 de 12) */}
                <div id="psd-evergreen-list-col" className="lg:col-span-5 bg-gray-900 p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl flex flex-col h-full">
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-orange-900/30 rounded-2xl text-orange-400 border border-orange-900/50">
                            <Mail className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white tracking-tight">Cronograma de Autoridad</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Sincronizado con tus Artículos</p>
                        </div>
                    </div>

                    {/* BARRA DE PROGRESO DE LÍMITES */}
                    <div className="mb-10 p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h5 className="text-white font-bold text-sm">Correos de Nutrición</h5>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Límite de tu Plan</p>
                            </div>
                            <div className="text-right">
                                <span className="text-white font-black text-xl">{emailsUsed}</span>
                                <span className="text-gray-600 font-bold text-sm ml-1">/ {maxEmails}</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden shadow-inner">
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
                                        <p className={`text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest`}>
                                            {email.day}
                                        </p>
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
                                                        className="absolute z-[100] bg-white border border-gray-200 rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200"
                                                        style={{
                                                            top: `${editingLink.element.offsetTop - 70}px`,
                                                            left: `${editingLink.element.offsetLeft}px`
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enlace del Botón</label>
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    type="text"
                                                                    value={editingLink.url}
                                                                    onChange={(e) => handleLinkUpdate(e.target.value)}
                                                                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-blue-600 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                                                                    placeholder="https://..."
                                                                />
                                                                <button 
                                                                    onClick={() => setEditingLink(null)}
                                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                                                                >
                                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* WYSIWYG Toolbar */}
                                                {!isPreviewMode && (
                                                    <>
                                                        <div className="absolute -top-16 left-0 flex items-center gap-2 bg-yellow-400 text-black px-4 py-1.5 rounded-t-xl text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2 duration-300">
                                                            <Edit3 className="w-3 h-3" /> Modo Edición
                                                        </div>
                                                        <div className="absolute -top-12 left-0 right-0 bg-white border border-gray-200 p-2 flex flex-wrap gap-1 items-center z-20 rounded-xl shadow-xl animate-in slide-in-from-bottom-2 duration-300">
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
                                                        </div>
                                                    </>
                                                )}
                                                <div 
                                                    ref={editorRef}
                                                    contentEditable={!isPreviewMode}
                                                    onClick={handleEditorClick}
                                                    onFocus={() => setIsPreviewMode(false)}
                                                    onBlur={(e) => {
                                                        setIsPreviewMode(true);
                                                        handleUpdateMessage('contentHtml', e.currentTarget.innerHTML);
                                                    }}
                                                    className={`w-full h-full min-h-[450px] rounded-3xl p-8 md:p-12 focus:ring-4 focus:ring-orange-500/5 text-black text-[1.3rem] leading-[1.7em] font-serif outline-none overflow-y-auto custom-scrollbar cursor-text transition-all [&_p]:pt-[1.1em] [&_a]:my-8 [&_a]:inline-block ${!isPreviewMode ? 'bg-yellow-50/50 border-2 border-dashed border-yellow-400 shadow-2xl ring-1 ring-yellow-100' : 'bg-gray-50 border border-gray-100 hover:bg-gray-100/50'}`}
                                                    title="Haz clic para editar el contenido del mensaje"
                                                    dangerouslySetInnerHTML={{ __html: activeEmail.body }}
                                                />
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
                                        <h3 className="text-white mb-6 font-medium tracking-tight text-3xl md:text-4xl leading-tight">
                                            {activeEmail.originalArticle.title}
                                        </h3>
                                        
                                        <div className="bg-orange-500/5 rounded-2xl p-6 border border-orange-500/20 backdrop-blur-sm mb-8">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Brain className="w-5 h-5 text-orange-400" />
                                                <span className="text-white font-bold text-xs uppercase tracking-widest">Enfoque Estratégico</span>
                                            </div>
                                            <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                                                <p className="text-white text-lg font-light leading-relaxed">
                                                    {activeEmail.originalArticle.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                                        <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-lg animate-pulse">
                                            <Lock className="w-10 h-10 text-orange-500" />
                                        </div>
                                        
                                        <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Artículos Disponibles para Desbloquear</h4>
                                        <p className="text-white font-medium leading-relaxed max-w-md mx-auto mb-10 text-lg">
                                            Nuestro sistema ha generado este Artículo Estratégico por ti. Haz clic en Desbloquear para ver todo el contenido.
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
                                                        <Unlock className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Desbloquear Artículo
                                                    </>
                                                )}
                                            </button>
                                            <div className="flex items-center justify-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                <Shield className="w-3 h-3" /> Acceso Instantáneo tras Desbloqueo
                                            </div>
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
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#161616] border border-white/10 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
                        
                        <div className="p-10 space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-lg">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">¿Generar Correo de Nutrición?</h3>
                                    <p className="text-gray-400 font-medium">Usaremos IA para transformar tu artículo en un correo persuasivo.</p>
                                </div>
                            </div>

                            {/* Barra de Límites dentro de la Modal */}
                            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Uso de tu Plan</span>
                                    <span className="text-white font-black">{emailsUsed} / {maxEmails}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${progressColor}`} style={{ width: `${usagePercent}%` }}></div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleGenerateEmail}
                                    className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-900/20 uppercase text-sm tracking-widest flex items-center justify-center gap-3"
                                >
                                    <PenTool className="w-5 h-5" /> Sí, Redactar Ahora
                                </button>
                                <button 
                                    onClick={() => setShowConfirmModal(false)}
                                    className="w-full py-5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PANTALLA DE CARGA DE GENERACIÓN */}
            {isGenerating && (
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
                    <p className="text-orange-400 font-bold text-sm uppercase tracking-[0.3em] mb-12">Nuestra IA está analizando tu artículo para crear el copy perfecto...</p>
                    <div className="w-full max-w-md bg-gray-900 h-2 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-orange-600 to-red-500 animate-progress-indefinite"></div>
                    </div>
                </div>
            )}
        </div>
    );
};
