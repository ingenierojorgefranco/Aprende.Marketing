import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Check, Info, Wand2, Lock, PlayCircle, Edit3, Settings2, Zap, Lightbulb, ChevronDown, ArrowRight, Copy, CheckCircle2, Globe, Link as LinkIcon, ExternalLink, X, Save, Target, AlertTriangle, Loader2, Crown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlanFeatures, PlanLimits, Plan, EmailMessage, LandingPage, AffiliateLink, EmailSequence } from '../../../../types';
import { api } from '../../../../services/api';
import { UpgradeModal } from '../../UpgradeModal';

interface ProjectStrategy_EmailProps {
    emailData: any[];
    avatars: any[];
    activeEmail: number;
    setActiveEmail: (idx: number) => void;
    onUpgrade: () => void;
    
    // Props de límites
    features?: PlanFeatures;
    planLimits?: PlanLimits;
    nextPlan?: Plan | null;
    isSimulating?: boolean;
}

export const ProjectStrategy_Email: React.FC<ProjectStrategy_EmailProps> = ({
    emailData, avatars, activeEmail, setActiveEmail, onUpgrade, features, planLimits, nextPlan, isSimulating = false
}) => {
    const navigate = useNavigate();
    const { id: projectId } = useParams() as { id: string };

    const [linkedSequences, setLinkedSequences] = useState<EmailSequence[]>([]);
    const [realMessages, setRealMessages] = useState<EmailMessage[]>([]);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [sequenceCount, setSequenceCount] = useState(0);

    // Estados locales para permitir el refinamiento estratégico antes de la generación
    const [localSubject, setLocalSubject] = useState('');
    const [localPilar, setLocalPilar] = useState('');
    const [localPurpose, setLocalPurpose] = useState('');
    const [isTypeLocked, setIsTypeLocked] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Estados locales para interactividad inmediata de redirección
    const [localRedirectType, setLocalRedirectType] = useState<'landing' | 'hotlink' | 'external' | undefined>(undefined);
    const [localRedirectUrl, setLocalRedirectUrl] = useState<string | undefined>(undefined);

    // Estados para contexto de redirección
    const [userPages, setUserPages] = useState<LandingPage[]>([]);
    const [projectLinks, setProjectLinks] = useState<AffiliateLink[]>([]);
    const [isAddingNewLink, setIsAddingNewLink] = useState(false);
    const [newLinkLabel, setNewLinkLabel] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [savingNewLink, setSavingNewLink] = useState(false);

    const emailTypes = ['Entrega de Valor', 'Agitación del Dolor', 'Prueba Social', 'Mecanismo Único', 'Lanzamiento', 'Escasez', 'Cierre'];

    useEffect(() => {
        const loadLocalData = async () => {
            if (!projectId) return;
            setLoadingLocal(true);
            try {
                const [pages, proj, sequences] = await Promise.all([
                    api.getPages(),
                    api.getProjectById(projectId),
                    api.getEmailSequences()
                ]);
                setUserPages(pages);
                if (proj) setProjectLinks(proj.affiliateLinks || []);
                const projectSeqs = sequences.filter(s => String(s.projectId) === String(projectId));
                setLinkedSequences(projectSeqs);
                setSequenceCount(sequences.length);
                if (projectSeqs.length > 0) {
                    const messages = await api.getSequenceMessages(projectSeqs[0].id);
                    setRealMessages(messages);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingLocal(false);
            }
        };
        loadLocalData();
    }, [projectId]);

    useEffect(() => {
        const currentReal = realMessages.find(m => m.dayIndex === activeEmail);
        const currentStatic = emailData[activeEmail];
        
        if (currentReal) {
            setLocalSubject(currentReal.subject || '');
            setLocalPilar(currentReal.pilarType || '');
            setLocalPurpose(currentReal.purpose || '');
            setLocalRedirectType(currentReal.redirectType);
            setLocalRedirectUrl(currentReal.redirectUrl);
        } else if (currentStatic) {
            setLocalSubject(currentStatic.subject || '');
            setLocalPilar(currentStatic.type || '');
            setLocalPurpose(currentStatic.objective || '');
            setLocalRedirectType(undefined);
            setLocalRedirectUrl(undefined);
        }
        setIsTypeLocked(true);
    }, [activeEmail, emailData, realMessages]);

    const handleUpdateMessage = async (field: string, value: any) => {
        if (field === 'redirectType') setLocalRedirectType(value);
        if (field === 'redirectUrl') setLocalRedirectUrl(value);

        const currentReal = realMessages.find(m => m.dayIndex === activeEmail);
        if (!currentReal) return;

        try {
            const apiField = field === 'contentHtml' ? 'content_html' : (field === 'isGenerated' ? 'is_generated' : field);
            await api.updateEmailMessage(currentReal.id, { [apiField]: value } as any);
            (currentReal as any)[field] = value;
            setActiveEmail(activeEmail);
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
        navigator.clipboard.write(data).then(() => alert("Cuerpo del correo copiado. Listo para pegar en Systeme.io")).catch(() => { navigator.clipboard.writeText(plainText); alert("Copiado como texto plano."); });
    };

    const handleStartWriting = () => {
        setShowConfirmModal(false);
        navigate(`/dashboard/email/create?projectId=${projectId}&day=${activeEmail}`);
    };

    const isRealAdmin = planLimits?.planName === 'admin' && !isSimulating;
    const maxSequences = planLimits?.maxEmailSequences || 5;
    const usagePercent = Math.min(100, (sequenceCount / maxSequences) * 100);
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    const currentMsg = realMessages.find(m => m.dayIndex === activeEmail);
    const isCurrentGenerated = !!currentMsg?.isGenerated;

    return (
        <div id="psd-email-section" className="pt-8">
            <div className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg"><Sparkles className="w-5 h-5" /> Correos Electrónicos Automáticos</div>
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">Secuencia de Nutrición <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">(7 Días)</span></h3>
            </div>

            {loadingLocal ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col h-full shadow-xl">
                        <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400 border border-yellow-900/50"><Mail className="w-6 h-6" /></div><h3 className="text-xl font-bold text-white">Estructura de la Secuencia</h3></div>
                        <div className="space-y-4 flex-1 pr-2">
                            {emailData.map((email: any, idx: number) => {
                                const isDayGenerated = realMessages.some(m => m.dayIndex === idx && m.isGenerated);
                                return (
                                    <div key={idx} onClick={() => setActiveEmail(idx)} className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${isDayGenerated ? 'bg-emerald-900/10 border-emerald-500/30' : (activeEmail === idx ? 'bg-yellow-900/10 border-yellow-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800')}`}>
                                        <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isDayGenerated ? 'bg-emerald-500 text-black' : (activeEmail === idx ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400')}`}>{idx + 1}</div><div className="min-w-0 flex-1"><span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isDayGenerated ? 'text-emerald-400' : 'text-gray-500'}`}>{email.day}</span><h4 className={`text-lg font-bold leading-tight whitespace-normal break-words ${isDayGenerated ? 'text-white' : (activeEmail === idx ? 'text-yellow-200' : 'text-gray-300')}`}>{email.subject}</h4></div></div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isDayGenerated ? 'border-emerald-500 bg-emerald-500' : (activeEmail === idx ? 'border-yellow-500 bg-yellow-500' : 'border-gray-600')}`}>{(isDayGenerated || activeEmail === idx) && <Check className={`w-4 h-4 font-bold ${isDayGenerated ? 'text-white' : 'text-black'}`} />}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-[#0B0B0B] border border-gray-800 rounded-[3rem] p-10 shadow-xl relative overflow-hidden flex-1 min-h-[600px]">
                        <div className={`absolute top-0 left-0 w-1 h-full ${isCurrentGenerated ? 'bg-emerald-500/50' : 'bg-yellow-500/50'}`}></div>
                        {isCurrentGenerated ? (
                            <div className="relative z-10 flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500 space-y-10">
                                <div className="flex justify-between items-center bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">GENERADO: DÍA {activeEmail + 1}</div>
                                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 flex-1 overflow-y-auto font-serif text-xl leading-[1.8] text-gray-900"><div dangerouslySetInnerHTML={{ __html: currentMsg?.contentHtml || '' }} /></div>
                                <button onClick={handleCopyEmail} className="w-full py-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-lg uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4"><Copy className="w-6 h-6" /> Copiar Contenido</button>
                            </div>
                        ) : (
                            <div className="relative z-10 space-y-10 animate-in fade-in duration-500 h-full flex flex-col">
                                <div className="flex items-center justify-between"><span className="bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Configurando: {localPilar || 'Nutrición'}</span><span className="text-white text-lg font-black uppercase tracking-widest">Correo del Día {activeEmail + 1}</span></div>
                                <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden flex-1">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
                                    <div className="flex items-center gap-4 mb-10"><div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-400"><Lightbulb className="w-8 h-8" /></div><div><h4 className="text-2xl font-black text-white tracking-tight">Estrategia de Correo: Día No {activeEmail + 1}</h4><p className="text-sm text-white font-bold uppercase tracking-widest mt-4 leading-relaxed">Nuestra inteligencia Artificial generará tu correo basado en esto.</p></div></div>
                                    <div className="space-y-10">
                                        <div className="space-y-3"><label className="text-lg font-black text-white uppercase tracking-[0.1em] flex items-center gap-2"><Edit3 className="w-5 h-5 text-[#FF5A1F]" /> Asunto Sugerido</label><textarea rows={2} value={localSubject} onChange={(e) => setLocalSubject(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-xl outline-none shadow-inner resize-none leading-relaxed"/></div>
                                        <div className="space-y-3"><div className="flex justify-between items-center"><label className="text-lg font-black text-white uppercase tracking-[0.1em] flex items-center gap-2"><Settings2 className="w-5 h-5 text-[#FF5A1F]" /> Pilar Estratégico (Tipo)</label><button onClick={() => setIsTypeLocked(!isTypeLocked)} className="text-xs font-black text-[#FF5A1F] uppercase px-3 py-1 bg-[#FF5A1F]/10 rounded-lg border border-[#FF5A1F]/20">{isTypeLocked ? 'Cambiar' : 'Bloquear'}</button></div><div className="relative"><select disabled={isTypeLocked} value={localPilar} onChange={(e) => setLocalPilar(e.target.value)} className={`w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-xl outline-none appearance-none ${isTypeLocked ? 'opacity-50 grayscale pointer-events-none' : 'border-yellow-500/50'}`}>{emailTypes.map(t => (<option key={t} value={t}>{t}</option>))}</select>{!isTypeLocked && <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown className="w-6 h-6 text-yellow-500" /></div>}</div></div>
                                        <div className="space-y-3"><label className="text-lg font-black text-white uppercase tracking-[0.1em] flex items-center gap-2"><Zap className="w-5 h-5 text-[#FF5A1F]" /> Propósito Estratégico</label><textarea rows={4} value={localPurpose} onChange={(e) => setLocalPurpose(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-6 text-gray-300 text-lg font-light leading-relaxed outline-none resize-none mb-6"/></div>
                                        <div className="space-y-4"><label className="block text-lg font-black text-white uppercase tracking-[0.1em] flex items-center gap-2"><Target className="w-5 h-5 text-[#FF5A1F]" /> ¿Dónde dirigir a tu audiencia?</label><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div onClick={() => handleUpdateMessage('redirectType', 'landing')} className={`p-6 rounded-[2rem] border-2 cursor-pointer flex flex-col items-center text-center gap-4 ${localRedirectType === 'landing' ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-black border-white/5'}`}><div className={`p-4 rounded-2xl ${localRedirectType === 'landing' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'}`}><Globe className="w-8 h-8" /></div><h4 className={`font-black text-sm uppercase mb-1 ${localRedirectType === 'landing' ? 'text-white' : 'text-gray-400'}`}>Landing Page</h4></div><div onClick={() => handleUpdateMessage('redirectType', 'hotlink')} className={`p-6 rounded-[2rem] border-2 cursor-pointer flex flex-col items-center text-center gap-4 ${localRedirectType === 'hotlink' ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] shadow-lg' : 'bg-black border-white/5'}`}><div className={`p-4 rounded-2xl ${localRedirectType === 'hotlink' ? 'bg-[#FF5A1F] text-white' : 'bg-white/5 text-gray-500'}`}><LinkIcon className="w-8 h-8" /></div><h4 className={`font-black text-sm uppercase mb-1 ${localRedirectType === 'hotlink' ? 'text-white' : 'text-gray-400'}`}>Hotlink Proyecto</h4></div><div onClick={() => handleUpdateMessage('redirectType', 'external')} className={`p-6 rounded-[2rem] border-2 cursor-pointer flex flex-col items-center text-center gap-4 ${localRedirectType === 'external' ? 'bg-purple-600/10 border-purple-500 shadow-lg' : 'bg-black border-white/5'}`}><div className={`p-4 rounded-2xl ${localRedirectType === 'external' ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}><ExternalLink className="w-8 h-8" /></div><h4 className={`font-black text-sm uppercase mb-1 ${localRedirectType === 'external' ? 'text-white' : 'text-gray-400'}`}>Link Externo</h4></div></div><div className="mt-4">{localRedirectType === 'landing' && (<div className="animate-in fade-in"><select value={userPages.find(p => (p.customDomain ? `https://${p.customDomain}` : `https://${p.subdomain}`) === localRedirectUrl)?.id || ''} onChange={(e) => { const page = userPages.find(p => p.id === e.target.value); if (page) handleUpdateMessage('redirectUrl', page.customDomain ? `https://${page.customDomain}` : `https://${page.subdomain}`); }} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none appearance-none"><option value="" disabled>-- Selecciona una Landing --</option>{userPages.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></div>)}{localRedirectType === 'external' && (<div className="animate-in fade-in"><input type="text" value={localRedirectUrl || ''} onChange={(e) => handleUpdateMessage('redirectUrl', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="https://ejemplo.com/tu-enlace" /></div>)}{localRedirectType === 'hotlink' && (<div className="animate-in fade-in space-y-4">{isAddingNewLink ? (<div className="p-6 bg-black border border-white/10 rounded-2xl space-y-4"><div className="flex justify-between items-center"><h5 className="text-white font-bold text-sm">Nuevo Hotlink</h5><button onClick={() => setIsAddingNewLink(false)}><X className="w-4 h-4 text-gray-500"/></button></div><div className="grid grid-cols-2 gap-4"><div><label className="text-[10px] text-gray-500 font-black uppercase">Etiqueta</label><input type="text" value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} className="w-full bg-gray-900 border border-white/5 rounded-xl px-3 py-2 text-white text-sm" placeholder="Ej: Checkout" /></div><div><label className="text-[10px] text-gray-500 font-black uppercase">URL</label><input type="text" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="w-full bg-gray-900 border border-white/5 rounded-xl px-3 py-2 text-emerald-400 text-sm" placeholder="https://go.hotmart.com/..." /></div></div><button onClick={handleAddNewHotlink} disabled={savingNewLink} className="w-full py-3 bg-[#FF5A1F] text-white font-black text-xs rounded-xl">{savingNewLink ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Guardar</button></div>) : (<div className={`relative ${!localRedirectUrl ? 'ring-2 ring-red-500/50 rounded-xl' : ''}`}><select value={localRedirectUrl || ''} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF5A1F] appearance-none" onChange={(e) => { if (e.target.value === 'ADD_NEW') { setIsAddingNewLink(true); } else { handleUpdateMessage('redirectUrl', e.target.value); } }}><option value="">-- Elige un Hotlink --</option>{projectLinks.map((link, i) => (<option key={i} value={link.url}>{link.label}</option>))}<option value="ADD_NEW" className="text-[#FF5A1F] font-bold">+ Añadir nuevo</option></select>{!localRedirectUrl && <div className="absolute -bottom-6 left-1 text-red-500 text-[9px] font-black uppercase animate-pulse"><AlertTriangle className="w-3 h-3 inline mr-1" /> Link obligatorio</div>}</div>)}</div>)}</div></div>
                                    </div>
                                    <div className="mt-8 pb-6"><button onClick={() => setShowConfirmModal(true)} disabled={!localRedirectUrl} className={`w-full py-6 rounded-[2cm] bg-gradient-to-r from-[#FF5A1F] to-orange-500 text-white font-black text-lg uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 ${!localRedirectUrl ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}><Wand2 className="w-7 h-7 fill-current" /> Redactar con IA <ArrowRight className="w-5 h-5" /></button></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-blue-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <div className="p-8 md:p-10 space-y-8 flex-1 overflow-y-auto text-center">
                            <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-lg animate-pulse"><Sparkles className="w-10 h-10" /></div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Confirma la generación</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">Redactar una nueva secuencia de email consumirá créditos de tu plan <span className="text-blue-400 font-bold capitalize">{planLimits?.planName || 'Starter'}</span>.</p>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] shadow-inner text-left"><div className="flex justify-between items-center mb-3"><span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Secuencias en tu plan</span><span className="text-white font-bold text-sm">{sequenceCount} / {isRealAdmin ? '∞' : maxSequences}</span></div><div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden p-0.5 border border-white/5"><div className={`h-full ${progressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]`} style={{ width: `${isRealAdmin ? (sequenceCount > 0 ? 100 : 0) : usagePercent}%` }}></div></div></div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4"><button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest">No, cancelar</button><button onClick={handleStartWriting} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl transform hover:scale-105 transition-all">Confirmar y Redactar</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};