import React, { useState, useEffect, useRef } from 'react';
import { Mail, Sparkles, Check, Info, Wand2, Lock, PlayCircle, Edit3, Settings2, Zap, Lightbulb, ChevronDown, ArrowRight, Copy, CheckCircle2, Globe, Link as LinkIcon, ExternalLink, X, Save, Target, AlertTriangle, Loader2, Crown, Bold, Italic, AlignLeft, AlignCenter, AlignRight, List, Type, Palette } from 'lucide-react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { PlanFeatures, PlanLimits, Plan, EmailMessage, LandingPage, AffiliateLink } from '../../../../types';
import { api } from '../../../../services/api';

interface ProjectStrategy_EmailProps {
    emailData: any[];
    avatars: any[];
    activeEmail: number;
    setActiveEmail: (idx: number) => void;
    onUpgrade: () => void;
    
    // Props de límites y persistencia real
    features?: PlanFeatures;
    planLimits?: PlanLimits;
    nextPlan?: Plan | null;
    realMessages?: EmailMessage[];
    isSimulating?: boolean;
    sequenceCount?: number;
    sequenceId?: string | null;
}

export const ProjectStrategy_Email: React.FC<ProjectStrategy_EmailProps> = ({
    emailData, avatars, activeEmail, setActiveEmail, onUpgrade, features, planLimits, nextPlan, realMessages = [], isSimulating = false, sequenceCount = 0, sequenceId = null
}) => {
    const navigate = useNavigate();
    const { id: projectId } = useParams() as { id: string };
    const { user } = useOutletContext() as any;

    // Estados locales para permitir el refinamiento estratégico antes de la generación
    const [localSubject, setLocalSubject] = useState('');
    const [localPilar, setLocalPilar] = useState('');
    const [localPurpose, setLocalPurpose] = useState('');
    const [isTypeLocked, setIsTypeLocked] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [saveIndicator, setSaveIndicator] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isPreviewMode, setIsPreviewMode] = useState(true);
    const editorRef = useRef<HTMLDivElement>(null);

    // Estados locales para interactividad inmediata de redirección
    const [localRedirectType, setLocalRedirectType] = useState<'landing' | 'hotlink' | 'external' | undefined>(undefined);
    const [localRedirectUrl, setLocalRedirectUrl] = useState<string | undefined>(undefined);

    // Referencia para rastrear el cambio de correo activo y evitar resets accidentales
    const lastActiveEmailRef = useRef<number>(activeEmail);

    // Estados para redirección
    const [userPages, setUserPages] = useState<LandingPage[]>([]);
    const [projectLinks, setProjectLinks] = useState<AffiliateLink[]>([]);
    const [isAddingNewLink, setIsAddingNewLink] = useState(false);
    const [newLinkLabel, setNewLinkLabel] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [savingNewLink, setSavingNewLink] = useState(false);

    const emailTypes = [
        'Entrega de Valor', 
        'Agitación del Dolor', 
        'Prueba Social', 
        'Mecanismo Único', 
        'Lanzamiento', 
        'Escasez', 
        'Cierre'
    ];

    useEffect(() => {
        const loadContext = async () => {
            try {
                const [pages, proj] = await Promise.all([
                    api.getPages(),
                    api.getProjectById(projectId)
                ]);
                setUserPages(pages);
                if (proj) setProjectLinks(proj.affiliateLinks || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadContext();
    }, [projectId]);

    // Sincronizar estados locales solo cuando realmente cambiamos de correo
    useEffect(() => {
        const currentReal = realMessages.find(m => m.dayIndex === activeEmail + 1);
        const currentStatic = emailData[activeEmail];
        
        // Solo reseteamos los estados locales si el índice del correo ha cambiado o si los datos reales acaban de cargar
        if (lastActiveEmailRef.current !== activeEmail || localSubject === '' || (currentReal && !localSubject)) {
            if (currentReal) {
                setLocalSubject(currentReal.subject || '');
                setLocalPilar(currentReal.pilarType || '');
                setLocalPurpose(currentReal.purpose || '');
                
                // Lógica de destino por defecto
                const defaultType = currentReal.redirectType || 'hotlink';
                setLocalRedirectType(defaultType);
                
                if (currentReal.redirectUrl) {
                    setLocalRedirectUrl(currentReal.redirectUrl);
                } else if (defaultType === 'hotlink' && projectLinks.length > 0) {
                    // Buscar link con "precio full" o "completo"
                    const fullPriceLink = projectLinks.find(l => 
                        l.label.toLowerCase().includes('precio full') || 
                        l.label.toLowerCase().includes('completo')
                    );
                    setLocalRedirectUrl(fullPriceLink ? fullPriceLink.url : projectLinks[0].url);
                } else {
                    setLocalRedirectUrl(undefined);
                }
            } else if (currentStatic) {
                setLocalSubject(currentStatic.subject || '');
                setLocalPilar(currentStatic.type || '');
                setLocalPurpose(currentStatic.objective || '');
                
                // Default para estáticos
                setLocalRedirectType('hotlink');
                if (projectLinks.length > 0) {
                    const fullPriceLink = projectLinks.find(l => 
                        l.label.toLowerCase().includes('precio full') || 
                        l.label.toLowerCase().includes('completo')
                    );
                    setLocalRedirectUrl(fullPriceLink ? fullPriceLink.url : projectLinks[0].url);
                } else {
                    setLocalRedirectUrl(undefined);
                }
            }
            setIsTypeLocked(true);
            lastActiveEmailRef.current = activeEmail;
        }
    }, [activeEmail, emailData, realMessages, projectLinks]);

    const handleUpdateMessage = async (field: string, value: any) => {
        // Actualización optimista del estado local para interactividad inmediata
        if (field === 'redirectType') setLocalRedirectType(value);
        if (field === 'redirectUrl') setLocalRedirectUrl(value);
        if (field === 'subject') setLocalSubject(value);
        if (field === 'pilarType') setLocalPilar(value);
        if (field === 'purpose') setLocalPurpose(value);

        const currentReal = realMessages.find(m => m.dayIndex === activeEmail + 1);
        if (!currentReal) return;

        setSaveIndicator('saving');
        try {
            const apiField = field === 'contentHtml' ? 'content_html' : (field === 'isGenerated' ? 'is_generated' : field);
            await api.updateEmailMessage(currentReal.id, { [apiField]: value } as any);
            setSaveIndicator('saved');
            setTimeout(() => setSaveIndicator('idle'), 2000);
        } catch (e) {
            console.error(e);
            setSaveIndicator('idle');
        }
    };

    const handleAddNewHotlink = async () => {
        if (!newLinkLabel || !newLinkUrl) return;
        setSavingNewLink(true);
        try {
            const proj = await api.getProjectById(projectId);
            if (proj) {
                const updatedLinks = [...(proj.affiliateLinks || []), { label: newLinkLabel, url: newLinkUrl }];
                await api.updateProject(projectId, { ...proj, affiliateLinks: updatedLinks } as any);
                setProjectLinks(updatedLinks);
                handleUpdateMessage('redirectUrl', newLinkUrl);
                setIsAddingNewLink(false);
                setNewLinkLabel('');
                setNewLinkUrl('');
            }
        } catch (e) {
            alert("Error al guardar link");
        } finally {
            setSavingNewLink(false);
        }
    };

    const handleCopyEmail = () => {
        const email = realMessages.find(m => m.dayIndex === activeEmail + 1);
        if (!email?.contentHtml) return;
        
        const htmlContent = `<div>${email.contentHtml}</div>`;
        const plainText = email.contentHtml.replace(/<[^>]*>/g, '');
        const blobHtml = new Blob([htmlContent], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });
        const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];

        navigator.clipboard.write(data).then(() => {
            alert("Cuerpo del correo copiado. Listo para pegar en Systeme.io");
        }).catch(() => {
            navigator.clipboard.writeText(plainText);
            alert("Copiado como texto plano.");
        });
    };

    const execCommand = (command: string, value: any = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            handleUpdateMessage('contentHtml', editorRef.current.innerHTML);
        }
    };

    const handleGenerateFullSequence = async () => {
        setShowConfirmModal(false);
        setIsGenerating(true);
        try {
            // Recopilamos la configuración de los 7 días
            const sequenceData = emailData.map((email, idx) => {
                const real = realMessages.find(m => m.dayIndex === idx + 1);
                return {
                    dayIndex: idx + 1,
                    subject: real?.subject || email.subject,
                    pilarType: real?.pilarType || email.type,
                    purpose: real?.purpose || email.objective,
                    redirectType: real?.redirectType || 'landing',
                    redirectUrl: real?.redirectUrl || ''
                };
            });

            await api.generateFullEmailSequence(projectId, sequenceData);
            // Recargar la página o refrescar datos
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Error al generar la secuencia completa.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Lógica de límites
    const isRealAdmin = planLimits?.planName === 'admin' && !isSimulating;
    const maxSequences = planLimits?.maxEmailSequences || 5;
    const sequenceUsed = sequenceCount;
    const usagePercent = Math.min(100, (sequenceUsed / maxSequences) * 100);
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    const currentMsg = realMessages.find(m => m.dayIndex === activeEmail + 1);
    const isCurrentGenerated = !!currentMsg?.isGenerated;
    const currentRealContent = currentMsg?.contentHtml || '';

    return (
        <div id="psd-email-section" className="pt-8">
            {/* --- ENCABEZADO ESTRATÉGICO ACTUALIZADO --- */}
            <div className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/5">
                    <Sparkles className="w-5 h-5" /> Correos Electrónicos Automáticos
                </div>
                
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Email Marketing: <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">Secuencia de Conversión (7 Días)</span>
                </h3>

                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-blue-500 pl-8 py-2">
                        Hemos diseñado una secuencia de 7 correos electrónicos estratégicos diseñados para nutrir a tus prospectos y llevarlos paso a paso hacia la decisión de compra, utilizando gatillos mentales de autoridad, escasez y urgencia.
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

            <div className="grid lg:grid-cols-12 gap-8">
                {/* LEFT: EMAIL LIST */}
                <div className="lg:col-span-5 bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col h-full shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400 border border-yellow-900/50"><Mail className="w-6 h-6" /></div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Estructura de la Secuencia</h3>
                        </div>
                    </div>

                    {/* Barra de Progreso de Emails */}
                    <div className="w-full mb-6">
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Correos Generados/Desbloqueados</span>
                                <span className="text-white font-bold">{sequenceUsed} / {isRealAdmin ? '∞' : maxSequences}</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (sequenceUsed > 0 ? 100 : 0) : usagePercent}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 pr-2">
                        {emailData.map((email: any, idx: number) => {
                            const isDayGenerated = realMessages.some(m => m.dayIndex === idx + 1 && m.isGenerated);
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => setActiveEmail(idx)}
                                    className={`relative pl-6 pr-6 py-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${isDayGenerated ? 'bg-emerald-900/10 border-emerald-500/30' : (activeEmail === idx ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-white/5 hover:bg-white/5')}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isDayGenerated ? 'bg-emerald-500 text-black' : (activeEmail === idx ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-500')}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className={`text-lg font-bold uppercase tracking-wider block mb-0.5 ${isDayGenerated ? 'text-emerald-400' : 'text-gray-500'}`}>Día {idx + 1}</span>
                                            <h4 className={`text-xl font-normal leading-relaxed whitespace-normal break-words ${isDayGenerated ? 'text-white' : (activeEmail === idx ? 'text-blue-200' : 'text-gray-400')}`}>{email.subject}</h4>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isDayGenerated ? 'border-emerald-500 bg-emerald-500' : (activeEmail === idx ? 'border-blue-500 bg-blue-500' : 'border-white/10 bg-white/5')}`}>
                                        {(isDayGenerated || activeEmail === idx) && <Check className={`w-3 h-3 font-bold ${isDayGenerated ? 'text-white' : 'text-white'}`} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botón General de Generación */}
                    {sequenceUsed === 0 && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <button 
                                onClick={() => setShowConfirmModal(true)}
                                disabled={isGenerating}
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Generando Secuencia...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" /> Generar Secuencia Completa
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT: CONFIGURATION / CONTENT */}
                <div className="lg:col-span-7 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/10 border border-white/5 rounded-[3rem] p-10 shadow-xl relative overflow-hidden flex-1 min-h-[600px]">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Target className="w-40 h-40 text-blue-500" /></div>
                    <div className={`absolute top-0 left-0 w-1 h-full ${isCurrentGenerated ? 'bg-emerald-500/50' : 'bg-blue-500/50'}`}></div>
                    
                    {isCurrentGenerated ? (
                        <div className="flex flex-col h-full space-y-6">
                            <div className="relative z-10 flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-black text-white uppercase tracking-tight">
                                    {localPilar || 'Nutrición'}
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 border border-blue-400/30">
                                        Día {activeEmail + 1}
                                    </span>
                                    {saveIndicator === 'saving' && <span className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest"><Loader2 className="w-3 h-3 animate-spin"/> Guardando...</span>}
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

                                {/* WYSIWYG Toolbar */}
                                {!isPreviewMode && (
                                    <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center shrink-0 animate-in slide-in-from-top-2 duration-300">
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
                                )}

                                <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col">
                                    <div className="space-y-3 text-sm border-b border-gray-100 pb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-400 min-w-[60px] uppercase text-[10px]">De:</span>
                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">{user?.name?.charAt(0) || 'A'}</div>
                                                <div className="flex flex-col">
                                                    <span className="text-black font-bold leading-none">{user?.name || 'Tu Asistente'}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">{user?.email || 'asistente@marketing.com'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-400 min-w-[60px] uppercase text-[10px]">Para:</span>
                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">L</div>
                                                <span className="text-black font-bold">{avatars[0]?.name || 'Cliente Ideal'} (Avatar Estratégico)</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2 mt-16 bg-blue-50/50 p-5 rounded-2xl border-2 border-dashed border-blue-200 transition-all hover:bg-blue-100/30 group/subject shadow-inner">
                                            <span className="font-bold text-blue-500 min-w-[70px] uppercase text-[10px] mt-2.5">Asunto:</span>
                                            <textarea 
                                                value={localSubject}
                                                title="Haz clic para editar el asunto"
                                                onChange={(e) => {
                                                    setLocalSubject(e.target.value);
                                                    handleUpdateMessage('subject', e.target.value);
                                                }}
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-black font-black text-xl md:text-2xl leading-tight resize-none h-auto p-0 cursor-text placeholder:text-gray-300"
                                                rows={2}
                                                placeholder="Escribe el asunto aquí..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 pt-4">
                                        <div 
                                            ref={editorRef}
                                            contentEditable={!isPreviewMode}
                                            onFocus={() => setIsPreviewMode(false)}
                                            onBlur={(e) => {
                                                setIsPreviewMode(true);
                                                handleUpdateMessage('contentHtml', e.currentTarget.innerHTML);
                                            }}
                                            className={`w-full h-full min-h-[450px] bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 focus:ring-4 focus:ring-blue-500/5 text-black text-2xl leading-[2] font-serif outline-none overflow-y-auto custom-scrollbar cursor-text transition-all ${!isPreviewMode ? 'bg-white shadow-2xl ring-1 ring-blue-100' : 'hover:bg-gray-100/50'}`}
                                            title="Haz clic para editar el contenido del mensaje"
                                            dangerouslySetInnerHTML={{ __html: currentRealContent }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                                <button onClick={handleCopyEmail} className="flex-1 py-5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3">
                                    <Copy className="w-5 h-5" /> Copiar Contenido
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 space-y-10 animate-in fade-in duration-500 h-full flex flex-col">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-black text-white uppercase tracking-tight">
                                    {localPilar || 'Nutrición'}
                                </span>
                                <span className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 border border-blue-400/30">
                                    Día {activeEmail + 1}
                                </span>
                            </div>

                            <div className="relative flex-1">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-400 border border-yellow-500/20">
                                        <Lightbulb className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium tracking-tight" style={{ fontSize: '1.6rem', lineHeight: '2.2rem' }}>Estrategia de Correo Electrónico: Día No {activeEmail + 1}</h4>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Edit3 className="w-4 h-4 text-orange-500" /> Asunto Sugerido
                                        </label>
                                        <div className="relative">
                                            <textarea 
                                                rows={2}
                                                value={localSubject}
                                                onChange={(e) => {
                                                    setLocalSubject(e.target.value);
                                                    handleUpdateMessage('subject', e.target.value);
                                                }}
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 text-white font-semibold text-xl outline-none focus:border-yellow-500/30 focus:ring-4 focus:ring-yellow-500/5 transition-all resize-none leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                <Settings2 className="w-4 h-4 text-orange-500" /> Pilar Estratégico (Tipo)
                                            </label>
                                            <button 
                                                onClick={() => setIsTypeLocked(!isTypeLocked)}
                                                className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-all"
                                            >
                                                {isTypeLocked ? '[ Cambiar ]' : '[ Bloquear ]'}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <select 
                                                disabled={isTypeLocked}
                                                value={localPilar}
                                                onChange={(e) => {
                                                    setLocalPilar(e.target.value);
                                                    handleUpdateMessage('pilarType', e.target.value);
                                                }}
                                                className={`w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-6 text-white font-semibold text-lg outline-none transition-all appearance-none cursor-pointer ${isTypeLocked ? 'opacity-40 grayscale pointer-events-none' : 'border-yellow-500/30 ring-4 ring-yellow-500/5'}`}
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

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-orange-500" /> Propósito Estratégico del Día
                                        </label>
                                        <textarea 
                                            rows={4}
                                            value={localPurpose}
                                            onChange={(e) => {
                                                setLocalPurpose(e.target.value);
                                                handleUpdateMessage('purpose', e.target.value);
                                            }}
                                            className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-6 text-gray-400 text-lg font-normal leading-relaxed outline-none focus:border-yellow-500/30 focus:ring-4 focus:ring-yellow-500/5 transition-all resize-none mb-6"
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Target className="w-4 h-4 text-orange-500" /> ¿Dónde dirigir a tu audiencia?
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div 
                                                onClick={() => handleUpdateMessage('redirectType', 'landing')}
                                                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${localRedirectType === 'landing' ? 'bg-blue-600/10 border-blue-500 ring-4 ring-blue-500/5' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className={`p-4 rounded-2xl transition-colors ${localRedirectType === 'landing' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-500'}`}>
                                                    <Globe className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-xs uppercase tracking-widest mb-1 ${localRedirectType === 'landing' ? 'text-white' : 'text-gray-400'}`}>Landing Page</h4>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Envía el tráfico a una de tus páginas internas creadas.</p>
                                                </div>
                                            </div>
                                            
                                            <div 
                                                onClick={() => handleUpdateMessage('redirectType', 'hotlink')}
                                                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${localRedirectType === 'hotlink' ? 'bg-orange-600/10 border-orange-500 ring-4 ring-orange-500/5' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className={`p-4 rounded-2xl transition-colors ${localRedirectType === 'hotlink' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-gray-500'}`}>
                                                    <LinkIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-xs uppercase tracking-widest mb-1 ${localRedirectType === 'hotlink' ? 'text-white' : 'text-gray-400'}`}>Hotlink Proyecto</h4>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Usa directamente tus enlaces de afiliado de Hotmart.</p>
                                                </div>
                                            </div>

                                            <div 
                                                onClick={() => handleUpdateMessage('redirectType', 'external')}
                                                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${localRedirectType === 'external' ? 'bg-purple-600/10 border-purple-500 ring-4 ring-purple-500/5' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className={`p-4 rounded-2xl transition-colors ${localRedirectType === 'external' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-gray-500'}`}>
                                                    <ExternalLink className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-xs uppercase tracking-widest mb-1 ${localRedirectType === 'external' ? 'text-white' : 'text-gray-400'}`}>Link Externo</h4>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Cualquier otra página web externa que desees promocionar.</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            {localRedirectType === 'landing' && (
                                                <div className="animate-in fade-in slide-in-from-top-2">
                                                    <select
                                                        value={userPages.find(p => (p.customDomain ? `https://${p.customDomain}` : `https://${p.subdomain}`) === localRedirectUrl)?.id || ''}
                                                        onChange={(e) => {
                                                            const page = userPages.find(p => p.id === e.target.value);
                                                            if (page) handleUpdateMessage('redirectUrl', page.customDomain ? `https://${page.customDomain}` : `https://${page.subdomain}`);
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

                                            {localRedirectType === 'external' && (
                                                <div className="animate-in fade-in slide-in-from-top-2">
                                                    <input
                                                        type="text"
                                                        value={localRedirectUrl || ''}
                                                        onChange={(e) => handleUpdateMessage('redirectUrl', e.target.value)}
                                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                                                        placeholder="https://ejemplo.com/tu-enlace"
                                                    />
                                                </div>
                                            )}
                                            
                                            {localRedirectType === 'hotlink' && (
                                                <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                                                    {isAddingNewLink ? (
                                                        <div className="p-6 bg-black border border-white/10 rounded-2xl space-y-4 shadow-xl">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h5 className="text-white font-bold text-sm">Nuevo Hotlink para Proyecto</h5>
                                                                <button onClick={() => setIsAddingNewLink(false)}><X className="w-4 h-4 text-gray-500"/></button>
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
                                                                disabled={savingNewLink}
                                                                className="w-full py-3 bg-[#FF5A1F] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#D94A1E] transition flex items-center justify-center gap-2"
                                                            >
                                                                {savingNewLink ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                                                                Guardar en el Proyecto
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={`relative ${!localRedirectUrl ? 'ring-2 ring-red-500/50 rounded-xl' : ''}`}>
                                                            <select
                                                                value={localRedirectUrl || ''}
                                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF5A1F] outline-none transition appearance-none cursor-pointer"
                                                                onChange={(e) => {
                                                                    if (e.target.value === 'ADD_NEW') {
                                                                        setIsAddingNewLink(true);
                                                                    } else {
                                                                        handleUpdateMessage('redirectUrl', e.target.value);
                                                                    }
                                                                }}
                                                            >
                                                                <option value="">-- Elige un Hotlink --</option>
                                                                {projectLinks.map((link, i) => (
                                                                    <option key={i} value={link.url}>{link.label}</option>
                                                                ))}
                                                                <option value="ADD_NEW" className="text-[#FF5A1F] font-bold">+ Añadir nuevo Hotlink</option>
                                                            </select>
                                                            {!localRedirectUrl && (
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
                        </div>
                    )}
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-blue-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <div className="p-8 md:p-10 space-y-8 flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-lg shadow-blue-900/10 animate-pulse">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Confirma la generación masiva</h3>
                                </div>
                                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                    Estás a punto de generar la secuencia completa de 7 correos electrónicos. Por favor, asegúrate de haber revisado los asuntos, pilares y propósitos de cada día antes de proceder.
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] shadow-inner">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Créditos de Secuencia Disponibles</span>
                                    <span className="text-white font-bold text-sm">{sequenceUsed} / {isRealAdmin ? '∞' : maxSequences}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div className={`h-full ${progressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]`} style={{ width: `${isRealAdmin ? (sequenceUsed > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">Revisar de nuevo</button>
                            <button onClick={handleGenerateFullSequence} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-900/20 transform hover:scale-105 active:scale-95 transition-all">Generar Secuencia Completa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};