import React, { useState, useEffect } from 'react';
import { 
    Gift, CheckCircle2, Download, Copy, ExternalLink, Sparkles, Lock, 
    FileText, Loader2, ChevronDown, Check, MessageSquare, Send, ArrowRight
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';
import { api } from '../../../../services/api';
import { User, Plan, LandingPage, Project } from '../../../../types';

interface LeadMagnetItem {
    name: string;
    url: string;
    imageUrl?: string;
    description?: string;
    fromMaster?: boolean;
}

interface ProjectStrategy_LeadMagnetProps {
    projectId: string;
    totalSteps?: number;
    strategyData?: any;
    onUpgrade?: () => void;
    user?: User | any;
    planLimits?: Plan;
}

export const ProjectStrategy_LeadMagnet: React.FC<ProjectStrategy_LeadMagnetProps> = ({
    projectId,
    totalSteps = 10,
    strategyData,
    onUpgrade,
    user: userProp,
    planLimits: planLimitsProp
}) => {
    // Resolver usuario y contexto
    let contextUser: any = null;
    let contextPlanLimits: any = null;
    let contextIsSimulating = false;

    try {
        const ctx = useOutletContext() as any;
        if (ctx) {
            contextUser = ctx.user;
            contextPlanLimits = ctx.planLimits;
            contextIsSimulating = ctx.isSimulating;
        }
    } catch {
        // Renderizado fuera de OutletContext
    }

    const activeUser = userProp || contextUser;
    const activePlanLimits = planLimitsProp || contextPlanLimits;

    const [loading, setLoading] = useState(true);
    const [projectData, setProjectData] = useState<Project | null>(null);
    const [masterProjectData, setMasterProjectData] = useState<Project | null>(null);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [selectedLeadMagnetIndex, setSelectedLeadMagnetIndex] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);
    const [copiedMessage, setCopiedMessage] = useState(false);

    // Permisos de Plan
    const isRealAdmin = (activePlanLimits?.planName === 'admin' || activeUser?.role === 'admin') && !contextIsSimulating;
    const isPro = isRealAdmin || (activePlanLimits?.planName !== 'starter' && activePlanLimits?.planName !== 'free' && (!projectData?.planSlug || projectData?.planSlug !== 'starter'));

    // Cargar datos del proyecto, landing pages y proyecto maestro
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (!projectId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const [project, allPages] = await Promise.all([
                    api.getProjectById(projectId),
                    api.getPages()
                ]);

                if (!isMounted) return;
                setProjectData(project);
                const projectPages = (allPages || []).filter(p => String(p.projectId) === String(projectId));
                setLinkedPages(projectPages);

                if (project?.masterParentId) {
                    try {
                        const master = await api.getProjectById(project.masterParentId);
                        if (isMounted && master) {
                            setMasterProjectData(master);
                        }
                    } catch (err) {
                        console.warn("No se pudo cargar el proyecto maestro para lead magnets:", err);
                    }
                }
            } catch (err) {
                console.error("Error al cargar datos para Lead Magnet:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [projectId]);

    // Extraer lead magnets disponibles del proyecto y del proyecto maestro
    const multimedia = typeof projectData?.multimedia_json === 'string'
        ? (() => { try { return JSON.parse(projectData.multimedia_json); } catch { return {}; } })()
        : (projectData?.multimedia_json || {});

    const masterMultimedia = typeof masterProjectData?.multimedia_json === 'string'
        ? (() => { try { return JSON.parse(masterProjectData.multimedia_json); } catch { return {}; } })()
        : (masterProjectData?.multimedia_json || {});

    const projectLMs: LeadMagnetItem[] =
        Array.isArray(multimedia?.leadMagnets) && multimedia.leadMagnets.length > 0
            ? multimedia.leadMagnets
            : (projectData?.leadMagnetUrl ? [{ name: 'Lead Magnet Principal', url: projectData.leadMagnetUrl }] : []);

    const masterLMs: LeadMagnetItem[] =
        Array.isArray(masterMultimedia?.leadMagnets) && masterMultimedia.leadMagnets.length > 0
            ? masterMultimedia.leadMagnets.map((lm: any) => ({ ...lm, fromMaster: true }))
            : (masterProjectData?.leadMagnetUrl ? [{ name: 'Lead Magnet Maestro', url: masterProjectData.leadMagnetUrl, fromMaster: true }] : []);

    const availableLeadMagnets: LeadMagnetItem[] = (() => {
        if (projectLMs.length > 0 && masterLMs.length > 0) {
            const seen = new Set(projectLMs.map(lm => lm.url));
            const merged = [...projectLMs];
            masterLMs.forEach(lm => {
                if (!seen.has(lm.url)) {
                    merged.push(lm);
                }
            });
            return merged;
        }
        if (projectLMs.length > 0) return projectLMs;
        return masterLMs;
    })();

    // Sincronizar selección inicial de lead magnet guardada
    useEffect(() => {
        if (availableLeadMagnets.length > 0) {
            if (linkedPages.length > 0) {
                const ty = linkedPages[0].content?.thankYouPage;
                if (ty?.leadMagnetUrl) {
                    const foundIdx = availableLeadMagnets.findIndex(lm => lm.url === ty.leadMagnetUrl);
                    if (foundIdx !== -1) {
                        setSelectedLeadMagnetIndex(foundIdx);
                        return;
                    }
                }
                if (ty?.leadMagnetName) {
                    const foundIdx = availableLeadMagnets.findIndex(lm => lm.name === ty.leadMagnetName);
                    if (foundIdx !== -1) {
                        setSelectedLeadMagnetIndex(foundIdx);
                        return;
                    }
                }
            }

            // Si es usuario básico y hay más de 1 lead magnet, persistir uno asignado
            if (!isPro && availableLeadMagnets.length > 1) {
                const storageKey = `assigned_lm_${projectId}`;
                const savedIndexStr = localStorage.getItem(storageKey);
                if (savedIndexStr !== null && Number(savedIndexStr) < availableLeadMagnets.length) {
                    setSelectedLeadMagnetIndex(Number(savedIndexStr));
                } else {
                    const randIdx = Math.floor(Math.random() * availableLeadMagnets.length);
                    setSelectedLeadMagnetIndex(randIdx);
                    localStorage.setItem(storageKey, String(randIdx));
                }
            }
        }
    }, [linkedPages, availableLeadMagnets.length, isPro, projectId]);

    // Manejar selección de Lead Magnet y persistencia
    const handleSelectLeadMagnet = async (index: number) => {
        if (!isPro && index !== selectedLeadMagnetIndex && availableLeadMagnets.length > 1) {
            onUpgrade?.();
            return;
        }

        setSelectedLeadMagnetIndex(index);
        const chosen = availableLeadMagnets[index];
        if (!chosen) return;

        setIsSaving(true);
        try {
            // 1. Actualizar configuración en página de gracias vinculada si existe
            if (linkedPages.length > 0) {
                const currentPage = linkedPages[0];
                const updatedThankYou = {
                    ...(currentPage.content?.thankYouPage || {}),
                    leadMagnetName: chosen.name,
                    leadMagnetUrl: chosen.url,
                    leadMagnetImageUrl: chosen.imageUrl || '',
                    leadMagnetDescription: chosen.description || '',
                    bookTitle: chosen.name.toUpperCase(),
                    bookSubtitle: "Guía práctica en PDF descargable"
                };
                const updatedPage: LandingPage = {
                    ...currentPage,
                    content: {
                        ...currentPage.content,
                        thankYouPage: updatedThankYou
                    }
                };
                await api.updatePage(updatedPage);
                setLinkedPages(prev => prev.map((p, i) => i === 0 ? updatedPage : p));
            }

            // 2. Persistir en el proyecto
            if (projectData && projectId) {
                const currentMultimedia = typeof projectData.multimedia_json === 'string'
                    ? (() => { try { return JSON.parse(projectData.multimedia_json); } catch { return {}; } })()
                    : (projectData.multimedia_json || {});

                const updatedProject = {
                    ...projectData,
                    leadMagnetUrl: chosen.url,
                    multimedia_json: {
                        ...currentMultimedia,
                        selectedLeadMagnet: chosen
                    }
                };
                await api.updateProject(projectId, updatedProject as any);
                setProjectData(updatedProject);
            }
        } catch (err) {
            console.error("Error al persistir lead magnet seleccionado:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const currentLM = availableLeadMagnets[selectedLeadMagnetIndex];

    // Texto sugerido para enviar por WhatsApp
    const defaultWhatsAppMessage = currentLM 
        ? `¡Hola! 👋 ¡Muchísimas gracias por unirte a nuestro grupo de WhatsApp! 🎉\n\nAquí tienes tu material y guía de *${currentLM.name}* totalmente gratis para que puedas descargarla y aprovecharla al máximo.\n\n¡Esperamos que este contenido de alto valor sea de muchísima utilidad para ti! Si tienes cualquier consulta, escríbenos directamente por aquí.`
        : `¡Hola! 👋 ¡Muchísimas gracias por unirte a nuestro grupo de WhatsApp! 🎉\n\nAquí tienes tu material y guía totalmente gratis para que puedas descargarla y aprovecharla al máximo.\n\n¡Esperamos que este contenido de alto valor sea de muchísima utilidad para ti! Si tienes cualquier consulta, escríbenos directamente por aquí.`;

    const handleCopyMessage = () => {
        if (!defaultWhatsAppMessage) return;
        navigator.clipboard.writeText(defaultWhatsAppMessage);
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2500);
    };

    const handleOpenWhatsAppWeb = () => {
        if (!defaultWhatsAppMessage) return;
        const encodedText = encodeURIComponent(defaultWhatsAppMessage);
        window.open(`https://web.whatsapp.com/send?text=${encodedText}`, '_blank');
    };

    return (
        <div id="psd-leadmagnet-whatsapp-section" className="space-y-6 text-left animate-in fade-in duration-500">
            {/* 1. HEADER CARD */}
            <StepHeaderCard
                stepNumber={5}
                totalSteps={totalSteps}
                stageNumber={1}
                categoryTitle="5. LeadMagnet de Whatsapp"
                title={<>LeadMagnet de WhatsApp <span className="text-[#FF5A1F]">(Entrega Manual)</span></>}
                description="Configura y descarga el recurso gratuito (Lead Magnet) que entregarás de forma manual por WhatsApp a los prospectos captados en tu página web para romper el hielo y construir confianza inmediata."
            />

            {/* 2. VIDEO TUTORIAL */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                <StepVideoContainer 
                    stepNumber={5}
                    videoUrl="https://www.youtube.com/embed/WUqaWRJG92c?rel=0&controls=1&showinfo=0"
                    title="Video Tutorial: LeadMagnet de WhatsApp"
                />
            </div>

            {/* 3. CONTENIDO PRINCIPAL: LEADMAGNET (Ref. Imagen 2) */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 text-left">
                
                {/* Encabezado descriptivo */}
                <div className="border-b border-slate-800/80 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                    <Gift className="w-5 h-5" />
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                                    LEADMAGNET DE WHATSAPP
                                </h3>
                            </div>
                            <p className="text-sm sm:text-base text-slate-300 max-w-3xl pt-1 leading-relaxed">
                                Selecciona cuál de los Lead Magnets subidos al proyecto vas a utilizar para entregar y compartir de forma manual a tus prospectos a través de WhatsApp.
                            </p>
                        </div>

                        {isSaving && (
                            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl self-start sm:self-center">
                                <Loader2 className="w-4 h-4 animate-spin" /> Guardando cambios...
                            </span>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
                        <p className="text-sm font-medium">Cargando recursos del proyecto...</p>
                    </div>
                ) : availableLeadMagnets.length > 0 ? (
                    <div className="space-y-6">
                        
                        {/* Selector de Lead Magnet */}
                        <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="block text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wide">
                                    SELECCIONAR LEAD MAGNET
                                </label>
                                {!isPro && availableLeadMagnets.length > 1 && (
                                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                                        <Lock className="w-3.5 h-3.5" /> 1 de {availableLeadMagnets.length} Desbloqueado (Plan Básico)
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <select
                                    value={selectedLeadMagnetIndex}
                                    onChange={(e) => handleSelectLeadMagnet(Number(e.target.value))}
                                    disabled={isSaving}
                                    className="w-full bg-[#080d18] border border-slate-700 hover:border-slate-600 text-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-amber-500 appearance-none cursor-pointer pr-10 transition shadow-inner"
                                >
                                    {availableLeadMagnets.map((lm, idx) => {
                                        const isLocked = !isPro && idx !== selectedLeadMagnetIndex && availableLeadMagnets.length > 1;
                                        return (
                                            <option key={idx} value={idx} className="bg-slate-900 text-white py-2.5">
                                                {`Leadmagnet ${idx + 1}: ${lm.name || 'Sin título'}${lm.fromMaster ? ' (Proyecto Maestro)' : ''}${isLocked ? ' [🔒 Plan PRO]' : ''}`}
                                            </option>
                                        );
                                    })}
                                </select>
                                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Ficha informativa del Lead Magnet seleccionado con portada y descripción (Exacto a Imagen 2) */}
                        {currentLM && (
                            <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
                                    <div className="flex items-start gap-4 min-w-0 flex-1">
                                        {currentLM.imageUrl ? (
                                            <img 
                                                src={currentLM.imageUrl} 
                                                alt="Portada Lead Magnet" 
                                                className="w-16 h-22 sm:w-20 sm:h-28 object-cover rounded-xl border border-slate-700 shrink-0 bg-slate-900 shadow-md" 
                                            />
                                        ) : (
                                            <div className="w-16 h-22 sm:w-20 sm:h-28 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                                                <Gift className="w-8 h-8 sm:w-10 sm:h-10" />
                                            </div>
                                        )}
                                        
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] sm:text-xs font-black uppercase px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block">
                                                    {`LEADMAGNET ${selectedLeadMagnetIndex + 1}`}
                                                </span>
                                                {currentLM.fromMaster && (
                                                    <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 inline-block">
                                                        Proyecto Maestro
                                                    </span>
                                                )}
                                                {!isPro && availableLeadMagnets.length > 1 && (
                                                    <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-block">
                                                        Asignado (Plan Básico)
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                                                {currentLM.name || "Sin título"}
                                            </h4>

                                            {currentLM.description ? (
                                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                                                    {currentLM.description}
                                                </p>
                                            ) : (
                                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                                    Guía práctica y material de alto valor en formato PDF descargable listo para compartir.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón de apertura / descarga */}
                                    {currentLM.url && (
                                        <a
                                            href={currentLM.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-sm sm:text-base shadow-lg shadow-amber-500/20 cursor-pointer shrink-0 border border-amber-300"
                                            title="Ver y Descargar LeadMagnet"
                                        >
                                            <Download className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                                            <span>Ver y Descargar LeadMagnet</span>
                                        </a>
                                    )}
                                </div>

                                {/* Pie de estado */}
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 pt-4 border-t border-slate-800/80">
                                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="truncate">
                                        Activo para entrega manual y en la página de gracias vinculada
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Banner de restricción para Plan Básico */}
                        {!isPro && availableLeadMagnets.length > 1 && (
                            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                                        Como usuario básico tienes 1 Lead Magnet asignado al azar. Desbloquea todos y cámbialos a tu gusto con el <strong className="text-amber-400 font-extrabold">Plan PRO</strong>.
                                    </p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => onUpgrade?.()}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wide shrink-0 transition shadow-lg cursor-pointer"
                                >
                                    Mejorar a PRO
                                </button>
                            </div>
                        )}

                        {/* 4. MENSAJE SUGERIDO PARA WHATSAPP (Ampliado a todo el ancho) */}
                        {currentLM && (
                            <div className="w-full pt-2">
                                <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-lg">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-200 uppercase tracking-wide">
                                                <MessageSquare className="w-5 h-5 text-emerald-400" />
                                                <span>Guión sugerido para WhatsApp</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                                Mensaje de bienvenida y entrega listo para copiar y enviar a los miembros que se unan a tu grupo de WhatsApp:
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <button
                                                type="button"
                                                onClick={handleCopyMessage}
                                                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                                                    copiedMessage 
                                                    ? 'bg-emerald-600 text-white shadow-emerald-900/30' 
                                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                                }`}
                                            >
                                                {copiedMessage ? (
                                                    <>
                                                        <Check className="w-4 h-4 text-emerald-200" />
                                                        <span>¡Mensaje copiado!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        <span>Copiar mensaje</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleOpenWhatsAppWeb}
                                                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
                                                title="Abrir WhatsApp Web con el texto preparado"
                                            >
                                                <Send className="w-4 h-4 text-emerald-400" />
                                                <span>WhatsApp Web</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-[#080d18] border border-slate-800 rounded-xl p-4 sm:p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans shadow-inner">
                                        {defaultWhatsAppMessage}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="bg-[#080d18] border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                            <FileText className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-base font-bold text-white">No hay Lead Magnets disponibles</h4>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                                Aún no has subido Lead Magnets en este proyecto ni en su Proyecto Maestro. Sube tus PDFs en "Administrador de Proyectos" para poder seleccionarlos y compartirlos aquí.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
