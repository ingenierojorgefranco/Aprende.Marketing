import React, { useState, useEffect } from 'react';
import { 
    Globe, 
    PlayCircle, 
    ChevronUp, 
    ChevronDown, 
    ExternalLink, 
    MessageCircle, 
    X, 
    CheckCircle, 
    Edit2, 
    Save, 
    Loader2, 
    Check, 
    AlertCircle 
} from 'lucide-react';
import { LandingPage, User } from '../../types';
import { api } from '../../services/api';
import { UpgradeModal } from './UpgradeModal';

interface CustomDomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    page?: LandingPage | null;
    projectId?: string;
    user?: User | null;
    onDomainSaved?: (newDomain: string) => void;
    initialEditMode?: boolean;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({
    isOpen,
    onClose,
    page,
    projectId,
    user,
    onDomainSaved,
    initialEditMode = false
}) => {
    // Accordion state: default steps collapsed for manual step-by-step
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
    const [domainInput, setDomainInput] = useState<string>('');
    const [isFinishing, setIsFinishing] = useState<boolean>(false);
    const [configFinalized, setConfigFinalized] = useState<boolean>(false);
    const [savedDomain, setSavedDomain] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [targetPage, setTargetPage] = useState<LandingPage | null>(page || null);
    const [currentUser, setCurrentUser] = useState<User | null>(user || null);
    const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

    // Synchronize page data and user when modal opens
    useEffect(() => {
        if (isOpen) {
            setFeedbackMsg(null);
            setActiveAccordion(null);
            
            if (projectId) {
                const finalized = localStorage.getItem(`domain_config_finalized_${projectId}`) === 'true';
                setConfigFinalized(finalized);
            } else {
                setConfigFinalized(false);
            }
            
            if (user) {
                setCurrentUser(user);
            } else {
                api.getCurrentUser().then(u => {
                    if (u) setCurrentUser(u);
                }).catch(() => {});
            }

            if (page) {
                setTargetPage(page);
                const current = page.customDomain || '';
                setSavedDomain(current);
                setDomainInput(current);
                setIsEditing(initialEditMode || !current);
            } else if (projectId) {
                // Fetch page associated with project if page not passed
                api.getPages().then(pages => {
                    const found = pages.find(p => p.projectId === projectId);
                    if (found) {
                        setTargetPage(found);
                        const current = found.customDomain || '';
                        setSavedDomain(current);
                        setDomainInput(current);
                        setIsEditing(initialEditMode || !current);
                    } else {
                        setSavedDomain('');
                        setDomainInput('');
                        setIsEditing(true);
                    }
                }).catch(() => {
                    setSavedDomain('');
                    setDomainInput('');
                    setIsEditing(true);
                });
            } else {
                setSavedDomain('');
                setDomainInput('');
                setIsEditing(true);
            }
        }
    }, [isOpen, page, projectId, user, initialEditMode]);

    if (!isOpen) return null;

    // Utility to strip http, https, www, slashes
    const cleanDomain = (val: string): string => {
        let d = val.trim().toLowerCase();
        d = d.replace(/^https?:\/\//, '');
        d = d.replace(/^www\./, '');
        d = d.replace(/\/.*$/, '');
        return d;
    };

    const currentPlan = currentUser?.planLimits?.planName || 'starter';
    const isFreePlan = ['starter', 'gratuito', 'free', 'gratis', 'basico', 'básico', 'plan free'].includes(currentPlan.toLowerCase());
    const isUserAdmin = currentUser?.role === 'admin';
    const isRestricted = isFreePlan && !isUserAdmin;

    const domainForMessage = savedDomain || cleanDomain(domainInput) || 'No especificado';
    const emailForMessage = currentUser?.email || 'No especificado';
    const userIdForMessage = currentUser?.id || 'No especificado';

    const whatsappText = `Hola, he configurado mi nombre de dominio para mi página en Aprende Marketing y me gustaría que procedan a su vinculación.

📌 Datos de vinculación:
- Dominio: ${domainForMessage}
- Email: ${emailForMessage}
- ID de usuario: ${userIdForMessage}

Por favor, ayúdenme a añadirlo a Aprende Marketing para tenerlo operativo.`;

    const whatsappUrl = `https://wa.me/34641941902?text=${encodeURIComponent(whatsappText)}`;

    const handleFinishConfiguration = async () => {
        setIsFinishing(true);
        try {
            const domainName = savedDomain || cleanDomain(domainInput) || "No especificado";
            const userEmail = currentUser?.email || "No especificado";
            const userName = currentUser?.name || "Usuario Demo";
            
            await api.submitSupportTicket({
                itemName: "Configuración de Dominio Finalizada",
                reason: `El usuario ha finalizado la configuración de su dominio personalizado en la plataforma.
📌 Detalles de vinculación:
- Dominio registrado: ${domainName}
- Nombre de usuario: ${userName}
- Email: ${userEmail}
- ID de usuario: ${currentUser?.id || "No especificado"}

Por favor, revisa el dominio y los registros DNS en el servidor de Google Cloud para activarlo.`,
                userName,
                userEmail
            });
            
            if (projectId) {
                localStorage.setItem(`domain_config_finalized_${projectId}`, 'true');
            }
            setConfigFinalized(true);
        } catch (e) {
            console.error("Error al finalizar configuración de dominio:", e);
        } finally {
            setIsFinishing(false);
        }
    };

    const handleSaveDomain = async () => {
        setFeedbackMsg(null);
        const cleaned = cleanDomain(domainInput);

        if (!cleaned) {
            setFeedbackMsg({
                text: 'Por favor, ingresa un nombre de dominio completo (ejemplo: tudominio.com).',
                type: 'error'
            });
            return;
        }

        setIsSaving(true);
        try {
            const wasEditing = !!savedDomain;
            
            if (targetPage) {
                const updatedPage: LandingPage = {
                    ...targetPage,
                    customDomain: cleaned
                };
                await api.updatePage(updatedPage);
                setTargetPage(updatedPage);
            } else if (projectId) {
                // Find and update project page
                const pages = await api.getPages();
                const found = pages.find(p => p.projectId === projectId);
                if (found) {
                    const updatedPage: LandingPage = {
                        ...found,
                        customDomain: cleaned
                    };
                    await api.updatePage(updatedPage);
                    setTargetPage(updatedPage);
                }
            }

            setSavedDomain(cleaned);
            setDomainInput(cleaned);
            setIsEditing(false);

            if (onDomainSaved) {
                onDomainSaved(cleaned);
            }

            setFeedbackMsg({
                text: wasEditing 
                    ? 'El dominio ha sido editado exitosamente.' 
                    : 'El dominio ha sido guardado exitosamente.',
                type: 'success'
            });

            // Automatically hide success notification after 5 seconds
            setTimeout(() => {
                setFeedbackMsg(null);
            }, 5000);

        } catch (err) {
            console.error("Error al guardar dominio:", err);
            setFeedbackMsg({
                text: 'Ocurrió un error al guardar el dominio. Por favor, intenta de nuevo.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setDomainInput(savedDomain);
        setIsEditing(false);
        setFeedbackMsg(null);
    };

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-gray-800 transition"
                >
                    <X className="w-5 h-5" />
                </button>
                
                {/* Modal Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                        <Globe className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Asigna tu Dominio Personalizado</h2>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
                        Conecta tu propio dominio (.com, .net, etc.) para profesionalizar tu marca, aumentar la confianza de tus clientes y disparar tus conversiones.
                    </p>
                </div>

                {isRestricted ? (
                    <div className="bg-gradient-to-b from-primary/10 via-black/40 to-black/60 border border-primary/20 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden my-6">
                        {/* Decorative glow background */}
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/25 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/15 rounded-full blur-2xl pointer-events-none"></div>
                        
                        <div className="w-16 h-16 bg-primary/15 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-lg text-2xl">
                            👑
                        </div>
                        
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                            Característica Exclusiva <span className="text-primary">Plan PRO</span>
                        </h3>
                        
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
                            Lleva tu marca al siguiente nivel. Conecta tu propio dominio para eliminar el subdominio de <strong className="text-white">Aprende Marketing</strong>, personalizar tu ecosistema completo y multiplicar tus conversiones de forma profesional.
                        </p>
                        
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-[#FF5A1F]/90 text-white font-black text-lg rounded-xl shadow-xl shadow-primary/25 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <span>👑 Actualizar mi Plan a PRO</span>
                        </button>
                        
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">
                            <span>✓ Soporte Dedicado</span>
                            <span>•</span>
                            <span>✓ SSL Incluido</span>
                            <span>•</span>
                            <span>✓ Activación Inmediata</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Video Tutorial Integrado */}
                        <div className="mb-8 bg-black/40 border border-white/5 rounded-3xl p-6">
                            <p className="text-white font-bold mb-4 flex items-center justify-center gap-2">
                                <PlayCircle className="w-5 h-5 text-primary" /> Mira el video completo para configurar tu dominio
                            </p>
                            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
                                    title="Tutorial Configuración de Dominio" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Sistema de Acordeón con 4 Pasos */}
                        <div className="space-y-4 mb-8">
                            
                            {/* Paso 1: Comprar Dominio */}
                            <div className="border border-gray-800 rounded-2xl overflow-hidden">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 1 ? null : 1)}
                                    className="w-full flex items-center justify-between p-5 bg-gray-850 hover:bg-gray-800 transition text-left"
                                >
                                    <span className="font-bold text-white flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black">1</div>
                                        Comprar Dominio
                                    </span>
                                    {activeAccordion === 1 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                {activeAccordion === 1 && (
                                    <div className="p-6 bg-black/30 border-t border-gray-800 animate-in slide-in-from-top-2 text-center">
                                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                            Si aún no tienes un dominio, te recomendamos comprarlo en <a href="https://name.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Name.com</a>. Es una de las plataformas más estables y fáciles de configurar con nuestro sistema.
                                        </p>
                                        <a 
                                            href="https://www.name.com" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 px-10 py-4 bg-primary hover:bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary/20 transform hover:scale-105 active:scale-95 mb-4"
                                        >
                                            Comprar en Name.com <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Paso 2: Registros DNS */}
                            <div className="border border-gray-800 rounded-2xl overflow-hidden">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 2 ? null : 2)}
                                    className="w-full flex items-center justify-between p-5 bg-gray-850 hover:bg-gray-800 transition text-left"
                                >
                                    <span className="font-bold text-white flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black">2</div>
                                        Configurar Registros DNS
                                    </span>
                                    {activeAccordion === 2 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                {activeAccordion === 2 && (
                                    <div className="p-6 bg-black/30 border-t border-gray-800 animate-in slide-in-from-top-2">
                                        <p className="text-gray-300 text-lg mb-8 font-bold">Accede al panel de tu proveedor de dominio (Name.com, GoDaddy, etc.) y añade estos registros exactamente:</p>
                                        
                                        <div className="overflow-hidden border border-gray-800 rounded-xl shadow-lg">
                                            <table className="w-full text-base text-left">
                                                <thead className="bg-gray-800 text-gray-300 font-black uppercase tracking-widest">
                                                    <tr>
                                                        <th className="p-4">Tipo</th>
                                                        <th className="p-4">Nombre / Host</th>
                                                        <th className="p-4">Valor / Destino</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800 text-gray-400 font-mono">
                                                    <tr className="bg-black/40">
                                                        <td className="p-4 font-bold text-blue-400">A</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">216.239.32.21</td>
                                                    </tr>
                                                    <tr className="bg-black/20">
                                                        <td className="p-4 font-bold text-blue-400">A</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">216.239.34.21</td>
                                                    </tr>
                                                    <tr className="bg-black/40">
                                                        <td className="p-4 font-bold text-blue-400">A</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">216.239.36.21</td>
                                                    </tr>
                                                    <tr className="bg-black/20">
                                                        <td className="p-4 font-bold text-blue-400">A</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">216.239.38.21</td>
                                                    </tr>
                                                    <tr className="bg-black/40">
                                                        <td className="p-4 font-bold text-purple-400">AAAA</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">2001:4860:4802:32::15</td>
                                                    </tr>
                                                    <tr className="bg-black/20">
                                                        <td className="p-4 font-bold text-purple-400">AAAA</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">2001:4860:4802:34::15</td>
                                                    </tr>
                                                    <tr className="bg-black/40">
                                                        <td className="p-4 font-bold text-purple-400">AAAA</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">2001:4860:4802:36::15</td>
                                                    </tr>
                                                    <tr className="bg-black/20">
                                                        <td className="p-4 font-bold text-purple-400">AAAA</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">2001:4860:4802:38::15</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Paso 3: Nombre de Dominio (NUEVO PASO REQUERIDO) */}
                            <div className="border border-gray-800 rounded-2xl overflow-hidden">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 3 ? null : 3)}
                                    className="w-full flex items-center justify-between p-5 bg-gray-850 hover:bg-gray-800 transition text-left"
                                >
                                    <span className="font-bold text-white flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black">3</div>
                                        Nombre de Dominio
                                    </span>
                                    {activeAccordion === 3 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                {activeAccordion === 3 && (
                                    <div className="p-6 bg-black/30 border-t border-gray-800 animate-in slide-in-from-top-2">
                                        
                                        {/* Notification Feedback */}
                                        {feedbackMsg && (
                                            <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 border text-sm font-medium animate-in fade-in ${
                                                feedbackMsg.type === 'success' 
                                                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                                                    : 'bg-red-950/60 border-red-500/40 text-red-300'
                                            }`}>
                                                {feedbackMsg.type === 'success' ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                                )}
                                                <span>{feedbackMsg.text}</span>
                                            </div>
                                        )}

                                        {!isEditing && savedDomain ? (
                                            /* Estado A: Dominio ya guardado (Caja Verde con botón Editar) */
                                            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-950/20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                                        <CheckCircle className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-0.5">
                                                            Dominio Registrado
                                                        </p>
                                                        <p className="text-white font-extrabold text-lg sm:text-xl font-mono">
                                                            {savedDomain}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => setIsEditing(true)}
                                                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Editar
                                                </button>
                                            </div>
                                        ) : (
                                            /* Estado B: Formulario para ingresar / editar dominio */
                                            <div className="space-y-4">
                                                <p className="text-gray-300 text-sm font-medium leading-relaxed">
                                                    Ingresa tu nombre de dominio completo <span className="text-orange-400 font-bold">sin el "www"</span> (por ejemplo: <code className="bg-gray-800 px-2 py-0.5 rounded text-white font-mono">tudominio.com</code>):
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <div className="relative flex-1">
                                                        <input 
                                                            type="text"
                                                            value={domainInput}
                                                            onChange={(e) => setDomainInput(e.target.value)}
                                                            placeholder="ejemplo: tudominio.com"
                                                            disabled={isSaving}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveDomain()}
                                                            className="w-full bg-black/70 border border-gray-700 focus:border-primary rounded-xl px-4 py-3.5 text-white font-mono placeholder:text-gray-600 outline-none transition"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={handleSaveDomain}
                                                            disabled={isSaving || !domainInput.trim()}
                                                            className="flex-1 sm:flex-none px-6 py-3.5 bg-primary hover:bg-indigo-600 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                                                        >
                                                            {isSaving ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    Guardando...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save className="w-4 h-4" />
                                                                    {savedDomain ? 'Guardar Cambios' : 'Guardar Dominio'}
                                                                </>
                                                            )}
                                                        </button>

                                                        {savedDomain && (
                                                            <button 
                                                                onClick={handleCancelEdit}
                                                                disabled={isSaving}
                                                                className="px-4 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl transition text-sm"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Paso 4: Finalizar Configuración */}
                            <div className="border border-gray-800 rounded-2xl overflow-hidden">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 4 ? null : 4)}
                                    className="w-full flex items-center justify-between p-5 bg-gray-850 hover:bg-gray-800 transition text-left"
                                >
                                    <span className="font-bold text-white flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black">4</div>
                                        Finalizar Configuración
                                    </span>
                                    {activeAccordion === 4 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                {activeAccordion === 4 && (
                                    <div className="p-8 bg-black/30 border-t border-gray-800 animate-in slide-in-from-top-2 text-center">
                                        {configFinalized ? (
                                            <div className="space-y-6 py-4 animate-in zoom-in-95">
                                                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                                                    <Check className="w-8 h-8 stroke-[3]" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-white uppercase tracking-tight">¡Configuración Finalizada!</h4>
                                                    <p className="text-gray-300 text-base leading-relaxed mt-4 max-w-md mx-auto">
                                                        Nuestro equipo técnico evaluará la información registrada para el dominio <strong className="text-white">{savedDomain || cleanDomain(domainInput) || 'tu dominio'}</strong> y procederá a configurarlo en nuestro servidor. Te notificaremos de inmediato.
                                                    </p>
                                                </div>
                                                <div className="inline-block px-6 py-2.5 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-wider rounded-lg border border-emerald-500/20">
                                                    En proceso de activación por soporte
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
                                                    Para completar la vinculación y poder utilizar tu dominio en <strong className="text-white font-bold">Aprende Marketing</strong>, confirma que has configurado los registros DNS. Nuestro equipo técnico evaluará la información registrada y procederá a configurar el dominio en nuestro servidor de inmediato.
                                                </p>
                                                <button 
                                                    onClick={handleFinishConfiguration}
                                                    disabled={isFinishing}
                                                    className="inline-flex items-center gap-3 px-10 py-5 bg-primary hover:bg-[#FF5A1F]/90 disabled:opacity-50 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all transform hover:scale-105 active:scale-95 mb-4"
                                                >
                                                    {isFinishing ? (
                                                        <>
                                                            <Loader2 className="w-6 h-6 animate-spin" /> Finalizando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-6 h-6" /> Finalizar Configuración
                                                        </>
                                                    )}
                                                </button>
                                                <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] mt-4">
                                                    Activación técnica en nuestro servidor
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {showUpgradeModal && (
                    <UpgradeModal 
                        isOpen={showUpgradeModal} 
                        onClose={() => setShowUpgradeModal(false)} 
                    />
                )}
            </div>
        </div>
    );
};
