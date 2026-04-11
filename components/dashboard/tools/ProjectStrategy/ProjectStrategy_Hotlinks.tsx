
import React, { useState, useEffect } from 'react';
import { 
    Link as LinkIcon, Gift, ShoppingCart as CartIcon, 
    X, Rocket, Loader2, CheckCircle2, AlertTriangle 
} from 'lucide-react';
import { api } from '../../../../services/api';
import { Project, AffiliateLink } from '../../../../types';

interface ProjectStrategy_HotlinksProps {
    projectId: string;
}

export const ProjectStrategy_Hotlinks: React.FC<ProjectStrategy_HotlinksProps> = ({ projectId }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [form, setForm] = useState({
        leadMagnetType: '',
        leadMagnetUrl: '',
        digitalProductUrl: '',
        affiliateLinks: [
            { label: 'Checkout Principal', url: '' },
            { label: 'Checkout con Descuento', url: '' }
        ] as AffiliateLink[]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);
            try {
                const data = await api.getProjectById(projectId);
                if (data) {
                    setProject(data);
                    setForm({
                        leadMagnetType: data.leadMagnetType || '',
                        leadMagnetUrl: data.leadMagnetUrl || '',
                        digitalProductUrl: data.digitalProductUrl || '',
                        affiliateLinks: data.affiliateLinks && data.affiliateLinks.length > 0 
                            ? data.affiliateLinks 
                            : [
                                { label: 'Checkout Principal', url: '' },
                                { label: 'Checkout con Descuento', url: '' }
                            ]
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
        const newLinks = form.affiliateLinks.filter((_, i) => i !== idx);
        setForm({ ...form, affiliateLinks: newLinks });
    };

    const handleSave = async () => {
        if (!project) return;

        const newErrors: Record<string, string> = {};
        if (!form.leadMagnetUrl.trim()) {
            newErrors.leadMagnetUrl = "Este campo es obligatorio para que la IA genere tu estrategia";
        }
        
        const hasAtLeastOneLink = form.affiliateLinks.some(l => l.url.trim() !== '');
        if (!hasAtLeastOneLink) {
            newErrors.affiliateLinks = "Este campo es obligatorio para que la IA genere tu estrategia";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSaving(true);
        try {
            await api.updateProject(projectId, {
                ...project,
                leadMagnetType: form.leadMagnetType,
                leadMagnetUrl: form.leadMagnetUrl,
                digitalProductUrl: project.masterParentId ? undefined : form.digitalProductUrl,
                affiliateLinks: form.affiliateLinks
            } as any);
            
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error: any) {
            alert(error.message || "Error al guardar los hotlinks.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-400 font-medium">Cargando configuración...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-20">
            {/* --- HEADER SECCIÓN --- */}
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-[2rem] flex items-center justify-center border border-[#FF5A1F]/20 shadow-lg shadow-[#FF5A1F]/5 animate-pulse">
                    <LinkIcon className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight italic">Vinculación de tus Hotlinks</h3>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                        Para que tu ecosistema esté listo para vender, necesitamos que proporciones tus propios enlaces de afiliado.
                    </p>
                </div>
            </div>

            {/* --- VIDEO EXPLICATIVO --- */}
            <div className="max-w-4xl mx-auto w-full">
                <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative group">
                    <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/2yez3O8ibzA?rel=0&controls=1&showinfo=0" 
                        title="Video Tutorial Hotlinks" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            {/* --- FORMULARIO --- */}
            <div className="max-w-4xl mx-auto w-full bg-[#0B0B0B] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-10">
                <div className="space-y-8">
                    {/* URL del Producto Digital */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-3">
                                <Rocket className="w-5 h-5" /> URL de Afiliación al Producto Digital
                            </label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={form.digitalProductUrl}
                                    onChange={(e) => setForm({ ...form, digitalProductUrl: e.target.value })}
                                    placeholder="https://app-vlc.hotmart.com/affiliate-links/..."
                                    disabled={!!project?.masterParentId}
                                    className={`w-full bg-black border ${project?.masterParentId ? 'border-emerald-500/30 opacity-70 pr-[180px]' : 'border-white/10'} rounded-2xl py-5 px-8 text-white text-lg outline-none focus:border-emerald-500/50 transition-all shadow-inner placeholder:text-gray-800`}
                                />
                                {project?.masterParentId && (
                                    <a 
                                        href={form.digitalProductUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Afiliarme al Producto
                                    </a>
                                )}
                                {!project?.masterParentId && form.digitalProductUrl && (
                                    <a 
                                        href={form.digitalProductUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                                    >
                                        Afiliarme al Producto
                                    </a>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest ml-4">
                                {project?.masterParentId 
                                    ? "Este proyecto hereda automáticamente el enlace de afiliación del proyecto maestro."
                                    : "Con este enlace podrás afiliarte al producto digital en Hotmart para tener tus Enlaces de Afiliados y se te asignen las comisiones por cada venta del producto."}
                            </p>
                        </div>
                    </div>

                    {/* Lead Magnet */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-[#FF5A1F] uppercase tracking-[0.2em] ml-2">Tipo de Lead Magnet (Regalo)</label>
                            <select 
                                value={form.leadMagnetType} 
                                onChange={(e) => setForm({ ...form, leadMagnetType: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white text-lg outline-none focus:border-[#FF5A1F]/50 transition-all appearance-none cursor-pointer shadow-inner"
                            >
                                <option value="Ebook / Guía PDF">Ebook / Guía PDF</option>
                                <option value="Clase Gratis / VSL">Clase Gratis / Carta de Ventas en Video</option>
                                <option value="Masterclass en Vivo">Masterclass en Vivo</option>
                                <option value="Plantilla / Checklist">Plantilla / Checklist</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black text-[#FF5A1F] uppercase tracking-[0.2em] ml-2 flex items-center gap-3">
                                <Gift className="w-5 h-5" /> URL de tu {form.leadMagnetType}
                            </label>
                            <input 
                                type="text" 
                                value={form.leadMagnetUrl}
                                onChange={(e) => setForm({ ...form, leadMagnetUrl: e.target.value })}
                                placeholder="https://pega-aqui-tu-link-de-google-drive-o-clase.com"
                                className={`w-full bg-black border ${errors.leadMagnetUrl ? 'border-red-500 shadow-red-900/10' : 'border-white/10'} rounded-2xl py-5 px-8 text-white text-lg outline-none focus:border-[#FF5A1F]/50 transition-all shadow-inner placeholder:text-gray-800`}
                            />
                            {errors.leadMagnetUrl && (
                                <p className="text-red-500 text-xs font-black uppercase tracking-widest mt-2 ml-4 flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" /> {errors.leadMagnetUrl}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Affiliate Links */}
                    <div className="pt-10 border-t border-white/5 space-y-8">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <CartIcon className="w-5 h-5" /> Hotlinks de Pago (Afiliado)
                            </label>
                            <button 
                                onClick={handleAddLink}
                                className="text-xs font-black text-blue-400 bg-blue-900/20 px-5 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                            >
                                + Añadir
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            {form.affiliateLinks.map((link, idx) => (
                                <div key={idx} className="bg-black/40 border border-white/5 rounded-[2rem] p-6 md:p-8 space-y-6 relative group/link hover:border-blue-500/20 transition-all">
                                    <button 
                                        onClick={() => handleRemoveLink(idx)} 
                                        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover/link:opacity-100"
                                    >
                                        <X className="w-5 h-5"/>
                                    </button>
                                    
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] ml-2">Etiqueta del Botón</p>
                                        <input 
                                            type="text" 
                                            value={link.label}
                                            onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
                                            placeholder="Ej: Checkout Principal"
                                            className="w-full bg-black border border-white/5 rounded-xl py-4 px-6 text-white text-lg outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] ml-2">URL de Afiliado</p>
                                        <input 
                                            type="text" 
                                            value={link.url}
                                            onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                                            placeholder="https://go.hotmart.com/..."
                                            className={`w-full bg-black border ${errors.affiliateLinks && !link.url.trim() ? 'border-red-500' : 'border-white/5'} rounded-xl py-4 px-6 text-emerald-400 font-mono text-lg outline-none focus:border-blue-500/50 transition-all`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.affiliateLinks && (
                            <p className="text-red-500 text-xs font-black uppercase tracking-widest mt-2 ml-4 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" /> {errors.affiliateLinks}
                            </p>
                        )}
                    </div>
                </div>

                {/* Botón Guardar */}
                <div className="pt-8 flex flex-col items-center space-y-6">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto min-w-[300px] py-6 px-12 bg-gradient-to-r from-[#FF5A1F] to-orange-500 hover:from-[#D94A1E] hover:to-orange-600 text-white font-black text-xl uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#FF5A1F]/20 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {saving ? (
                            <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</>
                        ) : (
                            <><Rocket className="w-6 h-6" /> Guardar Configuración</>
                        )}
                    </button>

                    {showSuccess && (
                        <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-widest text-sm animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-5 h-5" /> ¡Configuración guardada con éxito!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
