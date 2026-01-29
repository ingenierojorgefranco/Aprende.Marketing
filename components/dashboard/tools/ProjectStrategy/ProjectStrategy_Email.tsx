
import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Check, Info, Wand2, Lock, PlayCircle, Edit3, Settings2, Zap, Lightbulb, ChevronDown, ArrowRight, Copy, CheckCircle2, Globe, Link as LinkIcon, ExternalLink, X, Save, Target, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
}

export const ProjectStrategy_Email: React.FC<ProjectStrategy_EmailProps> = ({
    emailData, avatars, activeEmail, setActiveEmail, onUpgrade, features, planLimits, nextPlan, realMessages = []
}) => {
    const navigate = useNavigate();
    const { id: projectId } = useParams() as { id: string };

    // Estados locales para permitir el refinamiento estratégico antes de la generación
    const [localSubject, setLocalSubject] = useState('');
    const [localPilar, setLocalPilar] = useState('');
    const [localPurpose, setLocalPurpose] = useState('');
    const [isTypeLocked, setIsTypeLocked] = useState(true);

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

    // Sincronizar estados locales cuando cambia el correo activo en la lista
    useEffect(() => {
        const currentReal = realMessages.find(m => m.dayIndex === activeEmail);
        const currentStatic = emailData[activeEmail];
        
        if (currentReal) {
            setLocalSubject(currentReal.subject || '');
            setLocalPilar(currentReal.pilarType || '');
            setLocalPurpose(currentReal.purpose || '');
        } else if (currentStatic) {
            setLocalSubject(currentStatic.subject || '');
            setLocalPilar(currentStatic.type || '');
            setLocalPurpose(currentStatic.objective || '');
        }
        setIsTypeLocked(true);
    }, [activeEmail, emailData, realMessages]);

    const handleUpdateMessage = async (field: string, value: any) => {
        const currentReal = realMessages.find(m => m.dayIndex === activeEmail);
        if (!currentReal) return;

        try {
            const apiField = field === 'contentHtml' ? 'content_html' : (field === 'isGenerated' ? 'is_generated' : field);
            await api.updateEmailMessage(currentReal.id, { [apiField]: value } as any);
            // Actualización local para feedback visual inmediato si el dashboard no recarga
            currentReal[field as keyof EmailMessage] = value as any;
        } catch (e) {
            console.error(e);
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
        const email = realMessages.find(m => m.dayIndex === activeEmail);
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

    const currentMsg = realMessages.find(m => m.dayIndex === activeEmail);
    const isCurrentGenerated = !!currentMsg?.isGenerated;
    const currentRealContent = currentMsg?.contentHtml || '';

    return (
        <div id="psd-email-section" className="pt-8">
            {/* --- ENCABEZADO ESTRATÉGICO --- */}
            <div className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/5">
                    <Sparkles className="w-5 h-5" /> Correos Electrónicos Automáticos
                </div>
                
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Secuencia de Nutrición <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">(7 Días)</span>
                </h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* LEFT: EMAIL LIST */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col h-full shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400 border border-yellow-900/50"><Mail className="w-6 h-6" /></div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Estructura de la Secuencia</h3>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                        {emailData.map((email: any, idx: number) => {
                            const isDayGenerated = realMessages.some(m => m.dayIndex === idx && m.isGenerated);
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => setActiveEmail(idx)}
                                    className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${isDayGenerated ? 'bg-emerald-900/10 border-emerald-500/30' : (activeEmail === idx ? 'bg-yellow-900/10 border-yellow-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800')}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isDayGenerated ? 'bg-emerald-500 text-black' : (activeEmail === idx ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400')}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isDayGenerated ? 'text-emerald-400' : 'text-gray-500'}`}>{email.day}</span>
                                            <h4 className={`text-lg font-bold leading-tight truncate ${isDayGenerated ? 'text-white' : (activeEmail === idx ? 'text-yellow-200' : 'text-gray-300')}`}>{email.subject}</h4>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isDayGenerated ? 'border-emerald-500 bg-emerald-500' : (activeEmail === idx ? 'border-yellow-500 bg-yellow-500' : 'border-gray-600')}`}>
                                        {(isDayGenerated || activeEmail === idx) && <Check className={`w-4 h-4 font-bold ${isDayGenerated ? 'text-white' : 'text-black'}`} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: CONFIGURATION / CONTENT */}
                <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden flex-1 min-h-[600px]">
                    <div className={`absolute top-0 left-0 w-1 h-full ${isCurrentGenerated ? 'bg-emerald-500/50' : 'bg-yellow-500/50'}`}></div>
                    
                    {isCurrentGenerated ? (
                        <div className="relative z-10 flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500 space-y-10">
                            <div className="flex justify-between items-center bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                GENERADO: DÍA {activeEmail + 1}
                            </div>
                            <div className="bg-white rounded-[2rem] shadow-2xl p-10 flex-1 overflow-y-auto font-serif text-xl leading-[1.8] text-gray-900">
                                <div dangerouslySetInnerHTML={{ __html: currentRealContent }} />
                            </div>
                            <button onClick={handleCopyEmail} className="w-full py-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-lg uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4">
                                <Copy className="w-6 h-6" /> Copiar Contenido
                            </button>
                        </div>
                    ) : (
                        <div className="relative z-10 space-y-10 animate-in fade-in duration-500 h-full flex flex-col">
                            <h4 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <Lightbulb className="w-8 h-8 text-yellow-400" /> Correo Día {activeEmail + 1}
                            </h4>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2 mb-2"><Edit3 className="w-5 h-5 text-[#FF5A1F]" /> Asunto</label>
                                    <textarea rows={2} value={localSubject} onChange={(e) => setLocalSubject(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-white font-bold text-xl outline-none focus:border-yellow-500/50 resize-none leading-relaxed" />
                                </div>

                                <div>
                                    <label className="text-lg font-black text-white uppercase tracking-[0.1em] ml-1 flex items-center gap-2 mb-2"><Target className="w-5 h-5 text-[#FF5A1F]" /> Redirección de Audiencia</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div onClick={() => handleUpdateMessage('redirectType', 'landing')} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${currentMsg?.redirectType === 'landing' ? 'bg-blue-600/10 border-blue-500' : 'bg-black border-white/5 hover:border-white/10'}`}>
                                            <Globe className={`w-6 h-6 ${currentMsg?.redirectType === 'landing' ? 'text-blue-500' : 'text-gray-500'}`} />
                                            <span className="text-[10px] font-black text-white uppercase">Landing</span>
                                        </div>
                                        <div onClick={() => handleUpdateMessage('redirectType', 'hotlink')} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${currentMsg?.redirectType === 'hotlink' ? 'bg-[#FF5A1F]/10 border-[#FF5A1F]' : 'bg-black border-white/5 hover:border-white/10'}`}>
                                            <LinkIcon className={`w-6 h-6 ${currentMsg?.redirectType === 'hotlink' ? 'text-[#FF5A1F]' : 'text-gray-500'}`} />
                                            <span className="text-[10px] font-black text-white uppercase">Hotlink</span>
                                        </div>
                                        <div onClick={() => handleUpdateMessage('redirectType', 'external')} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${currentMsg?.redirectType === 'external' ? 'bg-purple-600/10 border-purple-500' : 'bg-black border-white/5 hover:border-white/10'}`}>
                                            <ExternalLink className={`w-6 h-6 ${currentMsg?.redirectType === 'external' ? 'text-purple-500' : 'text-gray-500'}`} />
                                            <span className="text-[10px] font-black text-white uppercase">Externo</span>
                                        </div>
                                    </div>

                                    {currentMsg?.redirectType === 'landing' && (
                                        <select value={userPages.find(p => (p.customDomain ? `https://${p.customDomain}` : `https://${p.subdomain}`) === currentMsg.redirectUrl)?.id || ''} onChange={(e) => {
                                            const page = userPages.find(p => p.id === e.target.value);
                                            if (page) handleUpdateMessage('redirectUrl', page.customDomain ? `https://${page.customDomain}` : `https://${page.subdomain}`);
                                        }} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer">
                                            <option value="">-- Selecciona una Landing --</option>
                                            {userPages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    )}

                                    {currentMsg?.redirectType === 'hotlink' && (
                                        <div className="space-y-4">
                                            {isAddingNewLink ? (
                                                <div className="p-4 bg-black border border-white/10 rounded-xl space-y-3">
                                                    <div className="flex justify-between items-center"><span className="text-[10px] text-white font-black uppercase">Nuevo Hotlink</span><button onClick={() => setIsAddingNewLink(false)}><X className="w-4 h-4 text-gray-500"/></button></div>
                                                    <input value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} placeholder="Etiqueta..." className="w-full bg-gray-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
                                                    <input value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="URL..." className="w-full bg-gray-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-emerald-400" />
                                                    <button onClick={handleAddNewHotlink} disabled={savingNewLink} className="w-full py-2 bg-[#FF5A1F] text-white font-black text-[10px] uppercase tracking-widest rounded-lg">{savingNewLink ? "Guardando..." : "Guardar"}</button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <select value={currentMsg.redirectUrl || ''} onChange={(e) => { if (e.target.value === 'ADD_NEW') setIsAddingNewLink(true); else handleUpdateMessage('redirectUrl', e.target.value); }} className={`w-full bg-black border rounded-xl px-4 py-3 text-white text-sm outline-none appearance-none cursor-pointer ${!currentMsg.redirectUrl ? 'border-red-500/50' : 'border-white/10 focus:border-[#FF5A1F]'}`}>
                                                        <option value="">-- Selecciona un Hotlink --</option>
                                                        {projectLinks.map((l, i) => <option key={i} value={l.url}>{l.label}</option>)}
                                                        <option value="ADD_NEW" className="text-[#FF5A1F] font-bold">+ Crear nuevo Hotlink</option>
                                                    </select>
                                                    {!currentMsg.redirectUrl && <p className="text-[9px] text-red-500 font-bold uppercase mt-1 animate-pulse">Link de destino obligatorio</p>}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {currentMsg?.redirectType === 'external' && (
                                        <input value={currentMsg.redirectUrl || ''} onChange={(e) => handleUpdateMessage('redirectUrl', e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500" />
                                    )}
                                </div>
                            </div>

                            <button onClick={() => navigate(`/dashboard/email/create?projectId=${projectId}&day=${activeEmail}`)} disabled={!currentMsg?.redirectUrl} className={`w-full py-6 rounded-[2cm] bg-gradient-to-r from-[#FF5A1F] to-orange-500 text-white font-black text-lg uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95 ${!currentMsg?.redirectUrl ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                                <Wand2 className="w-7 h-7" /> Redactar con IA <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
