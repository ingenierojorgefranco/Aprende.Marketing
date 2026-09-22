
import React, { useState, useEffect } from 'react';
import { 
    Link as LinkIcon, Gift, ShoppingCart as CartIcon, 
    X, Rocket, Loader2, CheckCircle2, AlertTriangle, ExternalLink, Copy, MessageCircle 
} from 'lucide-react';
import { api } from '../../../../services/api';
import { Project, AffiliateLink } from '../../../../types';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';

interface ProjectStrategy_HotlinksProps {
    projectId: string;
    totalSteps?: number;
}

export const ProjectStrategy_Hotlinks: React.FC<ProjectStrategy_HotlinksProps> = ({ projectId, totalSteps }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [form, setForm] = useState({
        whatsappGroupUrl: '',
        digitalProductUrl: '',
        affiliateLinks: [
            { label: 'Hotlink_Precio_Full', url: '' },
            { label: 'Hotlink_Precio_Descuento', url: '' }
        ] as AffiliateLink[]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const loadProject = async () => {
            if (!projectId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const data = await api.getProjectById(projectId);
                if (data) {
                    setProject(data);
                    let initialLinks = data.affiliateLinks && data.affiliateLinks.length > 0 
                        ? [...data.affiliateLinks] 
                        : [];
                    if (initialLinks.length === 0) {
                        initialLinks = [
                            { label: 'Hotlink_Precio_Full', url: '' },
                            { label: 'Hotlink_Precio_Descuento', url: '' }
                        ];
                    } else if (initialLinks.length === 1) {
                        initialLinks.push({ label: 'Hotlink_Precio_Descuento', url: '' });
                    }
                    setForm({
                        whatsappGroupUrl: data.whatsappGroupUrl || data.whatsapp_group_url || (data.multimedia_json as any)?.whatsappGroupUrl || '',
                        digitalProductUrl: data.digitalProductUrl || '',
                        affiliateLinks: initialLinks
                    });
                }
            } catch (error) {
                console.error("Error loading project for hotlinks:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [projectId]);

    const isProtectedLink = (link: AffiliateLink, idx: number) => {
        // Los dos primeros enlaces creados por defecto no se pueden borrar
        if (idx < 2) return true;
        const norm = (link.label || '').trim().toLowerCase();
        if (norm === 'hotlink_precio_full' || norm === 'hotlink_precio_descuento' || norm === 'checkout principal' || norm === 'checkout con descuento') {
            return true;
        }
        return false;
    };

    const handleUpdateLink = (idx: number, field: 'label' | 'url', val: string) => {
        const newLinks = [...form.affiliateLinks];
        newLinks[idx] = { ...newLinks[idx], [field]: val };
        setForm({ ...form, affiliateLinks: newLinks });
        if (field === 'url' && val.trim() !== '') {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated.affiliateLinks;
                return updated;
            });
        }
    };

    const handleAddLink = () => {
        setForm({
            ...form,
            affiliateLinks: [...form.affiliateLinks, { label: 'Nuevo Enlace', url: '' }]
        });
    };

    const handleRemoveLink = (idx: number) => {
        if (idx < 2 || isProtectedLink(form.affiliateLinks[idx], idx)) {
            return; // Restricción: No se permite eliminar los enlaces por defecto
        }
        const newLinks = form.affiliateLinks.filter((_, i) => i !== idx);
        setForm({ ...form, affiliateLinks: newLinks });
    };

    const handleSave = async () => {
        if (!project || !projectId) return;

        setErrors({});

        setSaving(true);
        try {
            const firstFullLink = form.affiliateLinks.find(
                l => l && l.label && (l.label.toLowerCase().includes('full') || l.label.toLowerCase().includes('principal'))
            ) || form.affiliateLinks[0];
            const firstHotlinkUrl = firstFullLink?.url?.trim() || '';

            const currentMultimedia = typeof project.multimedia_json === 'string'
                ? (() => { try { return JSON.parse(project.multimedia_json); } catch { return {}; } })()
                : (project.multimedia_json || {});

            const updatedProject = {
                ...project,
                whatsappGroupUrl: form.whatsappGroupUrl.trim(),
                whatsapp_group_url: form.whatsappGroupUrl.trim(),
                digitalProductUrl: project.masterParentId ? undefined : form.digitalProductUrl,
                affiliateLinks: form.affiliateLinks,
                selectedHotlinkUrl: firstHotlinkUrl || (project as any).selectedHotlinkUrl,
                thankYouPageConfig: {
                    ...((project as any).thankYouPageConfig || {}),
                    ...(firstHotlinkUrl ? { upsellButtonUrl: firstHotlinkUrl } : {})
                },
                multimedia_json: {
                    ...currentMultimedia,
                    thankYouPage: {
                        ...(currentMultimedia.thankYouPage || {}),
                        ...(firstHotlinkUrl ? { upsellButtonUrl: firstHotlinkUrl } : {})
                    }
                }
            };

            await api.updateProject(projectId, updatedProject as any);
            
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3500);
        } catch (error: any) {
            alert(error.message || "Error al guardar los hotlinks.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4 bg-[#0B1120] border border-slate-800 rounded-2xl">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF5A1F]" />
                <p className="text-slate-400 font-medium text-sm">Cargando configuración de Hotlinks...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-left animate-in fade-in duration-500">
            
            {/* HEADER DEL PASO 3 */}
            <StepHeaderCard
                stepNumber={3}
                totalSteps={totalSteps}
                stageNumber={1}
                categoryTitle="Configura tus enlaces de afiliado"
                title="Configura tus enlaces de afiliado"
                description="Configura tus enlaces de afiliado para dirigir a tus clientes al producto correcto, registrar tus recomendaciones y recibir las comisiones de cada venta.."
            />

            {/* CONTENEDOR TUTORIAL Y FORMULARIO EN BLOQUES ESTRUCTURADOS */}
            <div className="space-y-6">
                
                {/* VIDEO TUTORIAL BLOQUE */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                    <StepVideoContainer 
                        stepNumber={3}
                        videoUrl="https://www.youtube.com/embed/2yez3O8ibzA?rel=0&controls=1&showinfo=0"
                        title="Video Tutorial Hotlinks"
                    />
                </div>

                {/* BLOQUE 1: AFILIACIÓN AL PRODUCTO DIGITAL (2 PASOS) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex items-center gap-3.5 border-b border-slate-800/80 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                            <Rocket className="w-5 h-5" />
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide uppercase">
                            Afiliación al Producto Digital
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {/* Paso 1 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">1</span>
                                <label className="text-sm font-bold text-white uppercase tracking-wider">Abre el Mercado de Hotmart</label>
                            </div>
                            <p className="text-xs text-slate-400 font-medium pl-8">Haz clic en el botón para abrir el mercado de afiliación en una nueva pestaña (asegúrate de tener tu sesión iniciada).</p>
                            <div className="pl-8">
                                <a 
                                    href="https://app.hotmart.com/market/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all shadow-lg shadow-orange-500/20"
                                >
                                    Abrir Mercado de Hotmart <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Paso 2 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">2</span>
                                <label className="text-sm font-bold text-white uppercase tracking-wider">Busca y Afíliate a este Producto</label>
                            </div>
                            <p className="text-xs text-slate-400 font-medium pl-8">Copia el nombre exacto del producto y búscalo en el mercado de Hotmart para solicitar tu afiliación.</p>
                            
                            <div className="relative flex flex-col sm:flex-row gap-2.5 pl-8">
                                <input 
                                    type="text" 
                                    value={form.digitalProductUrl}
                                    onChange={(e) => setForm({ ...form, digitalProductUrl: e.target.value })}
                                    placeholder="Nombre exacto del producto..."
                                    disabled={!!project?.masterParentId}
                                    className={`w-full bg-[#0d1322] border ${project?.masterParentId ? 'border-emerald-500/30 opacity-70' : 'border-slate-700/80'} rounded-xl py-3.5 px-5 text-white text-sm sm:text-base outline-none focus:border-[#FF5A1F] transition-all placeholder:text-slate-600 font-mono`}
                                />
                                {form.digitalProductUrl && (
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(form.digitalProductUrl);
                                            alert("¡Nombre copiado! Ahora pégalo en el buscador de Hotmart.");
                                        }}
                                        className="shrink-0 inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 uppercase bg-emerald-500/15 px-5 py-3.5 rounded-xl border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                    >
                                        <Copy className="w-4 h-4" /> Copiar Nombre
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* BLOQUE 2: ENLACE DEL GRUPO DE WHATSAPP (PÁGINA DE GRACIAS) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex items-center gap-3.5 border-b border-slate-800/80 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide uppercase">
                                Enlace de tu Grupo de WhatsApp (Página de Gracias)
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Este enlace se vinculará directamente al botón de la página de gracias para que tus prospectos se unan al grupo donde les entregarás su regalo manualmente.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-bold text-slate-200">URL de Invitación a tu Grupo de WhatsApp</span>
                                </div>
                                {form.whatsappGroupUrl && (
                                    <a
                                        href={form.whatsappGroupUrl.startsWith('http') ? form.whatsappGroupUrl : `https://${form.whatsappGroupUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline"
                                    >
                                        Probar enlace <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                            <input 
                                type="text" 
                                value={form.whatsappGroupUrl}
                                onChange={(e) => {
                                    setForm({ ...form, whatsappGroupUrl: e.target.value });
                                    if (errors.whatsappGroupUrl) {
                                        setErrors(prev => {
                                            const updated = { ...prev };
                                            delete updated.whatsappGroupUrl;
                                            return updated;
                                        });
                                    }
                                }}
                                placeholder="https://chat.whatsapp.com/AbCdEfGhIjK123456"
                                className={`w-full bg-[#0d1322] border ${errors.whatsappGroupUrl ? 'border-red-500/60' : 'border-slate-700/80'} rounded-xl py-3.5 px-5 text-white text-sm sm:text-base outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 font-mono`}
                            />
                            {errors.whatsappGroupUrl && (
                                <p className="text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <span>{errors.whatsappGroupUrl}</span>
                                </p>
                            )}
                            <div className="flex items-start gap-2.5 bg-emerald-950/25 border border-emerald-900/40 rounded-xl p-3.5 text-xs text-emerald-300/90 leading-relaxed">
                                <span className="text-emerald-400 font-bold text-sm">💡</span>
                                <span>
                                    <strong>¿Cómo funciona?</strong> Al registrarse en tu landing page, los prospectos llegan a la página de gracias donde se les invita a unirse a este grupo de WhatsApp para recibir su material de preparación gratuito. Cada vez que alguien hace clic en el botón de WhatsApp, el sistema contabiliza automáticamente el clic en tus analíticas.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BLOQUE 3: ENLACES DE AFILIADO / HOTLINKS */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                                <CartIcon className="w-5 h-5" />
                            </div>
                            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide uppercase">
                                Tus Enlaces para recibir Comisiones
                            </h3>
                        </div>
                        <button 
                            onClick={handleAddLink}
                            className="text-xs font-extrabold text-sky-300 bg-sky-500/15 px-4 py-2.5 rounded-xl border border-sky-500/30 hover:bg-sky-500 hover:text-white transition-all uppercase tracking-wider self-start sm:self-auto cursor-pointer"
                        >
                            + AÑADIR ENLACE
                        </button>
                    </div>

                    {errors.affiliateLinks && (
                        <p className="text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{errors.affiliateLinks}</span>
                        </p>
                    )}
                    
                    <div className="grid grid-cols-1 gap-4">
                        {form.affiliateLinks.map((link, idx) => {
                            const isProtected = isProtectedLink(link, idx);
                            return (
                                <div key={idx} className="bg-[#0d1322]/90 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4 relative">
                                    {!isProtected && (
                                        <button 
                                            onClick={() => handleRemoveLink(idx)} 
                                            className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                                            title="Eliminar enlace"
                                        >
                                            <X className="w-4 h-4"/>
                                        </button>
                                    )}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Etiqueta del Botón</label>
                                                {isProtected && (
                                                    <span className="text-[10px] text-slate-400 font-medium bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                                                        Por defecto
                                                    </span>
                                                )}
                                            </div>
                                            <input 
                                                type="text" 
                                                value={link.label}
                                                onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
                                                placeholder={idx === 0 ? "Hotlink_Precio_Full" : idx === 1 ? "Hotlink_Precio_Descuento" : "Etiqueta del enlace"}
                                                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-[#FF5A1F] transition-all font-medium"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">URL de Afiliado (Hotlink)</label>
                                            <input 
                                                type="text" 
                                                value={link.url}
                                                onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                                                placeholder="https://go.hotmart.com/..."
                                                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 px-4 text-emerald-400 font-mono text-sm outline-none focus:border-[#FF5A1F] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* BLOQUE DE GUARDAR CONFIGURACIÓN */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center space-y-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] py-4 px-10 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF5A1F]/20 transform hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                    >
                        {saving ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
                        ) : (
                            <><Rocket className="w-5 h-5" /> Guardar Configuración</>
                        )}
                    </button>

                    {showSuccess && (
                        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs animate-in fade-in duration-300 bg-emerald-500/10 px-5 py-2.5 rounded-xl border border-emerald-500/30">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>¡Configuración guardada correctamente!</span>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

