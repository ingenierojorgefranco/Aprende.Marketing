
import React, { useState, useEffect } from 'react';
import { 
    Link as LinkIcon, Gift, ShoppingCart as CartIcon, 
    X, Rocket, Loader2, CheckCircle2, AlertTriangle, Play 
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
            {/* --- HEADER SECCIÓN --- */}
            <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                {/* Degradado superior sutil */}
                <div className="absolute inset-x-0 -top-24 h-[600px] bg-blue-600/10 blur-[140px] -z-10 rounded-full" />
                
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                    <LinkIcon className="w-4 h-4" /> Hotlinks
                </div>
                
                <div className="space-y-4 px-4">
                    <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
                        Configura tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Hotlinks</span>
                    </h3>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
                        Configura tus enlaces ahora para que el sistema pueda automatizar tus ventas. Si no sabes cómo obtenerlos, mira el tutorial de abajo.
                    </p>
                </div>
            </div>

            {/* --- VIDEO EXPLICATIVO --- */}
            <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                <div className="inline-flex items-center gap-3 text-blue-400 font-extrabold uppercase tracking-widest text-sm bg-blue-500/5 px-8 py-4 rounded-2xl border border-blue-500/10 backdrop-blur-sm mx-auto">
                    <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                </div>
                
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                    
                    <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-blue-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/2yez3O8ibzA?rel=0&controls=1&showinfo=0" 
                            title="Video Tutorial Hotlinks" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* --- FORMULARIO --- */}
            <div className="max-w-4xl mx-auto w-full px-4">
                <div className="relative">
                    <div className="bg-[#0a0f1d]/60 backdrop-blur-2xl border border-blue-500/10 rounded-[3rem] p-8 md:p-14 shadow-2xl space-y-12">
                        <div className="space-y-12">
                            {/* URL del Producto Digital */}
                            <div className="space-y-6">
                                <div className="space-y-4 text-left">
                                    <label className="text-[12px] font-bold text-emerald-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <Rocket className="w-4 h-4" />
                                        </div>
                                        URL de Afiliación al Producto Digital
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={form.digitalProductUrl}
                                            onChange={(e) => setForm({ ...form, digitalProductUrl: e.target.value })}
                                            placeholder="https://app-vlc.hotmart.com/affiliate-links/..."
                                            disabled={!!project?.masterParentId}
                                            className={`w-full bg-black/40 border ${project?.masterParentId ? 'border-emerald-500/20 opacity-70 pr-[180px]' : 'border-blue-500/10'} rounded-2xl py-6 px-8 text-white text-lg outline-none focus:border-blue-500/40 transition-all placeholder:text-gray-600`}
                                        />
                                        {project?.masterParentId && (
                                            <a 
                                                href={form.digitalProductUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[11px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-5 py-3 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all backdrop-blur-md"
                                            >
                                                <CheckCircle2 className="w-4 h-4" /> Afiliarme
                                            </a>
                                        )}
                                        {!project?.masterParentId && form.digitalProductUrl && (
                                            <a 
                                                href={form.digitalProductUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-500/10 text-emerald-400 px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 backdrop-blur-md"
                                            >
                                                Afiliarme
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-400 uppercase font-medium tracking-widest ml-4">
                                        {project?.masterParentId 
                                            ? "Este proyecto hereda automáticamente el enlace de afiliación del proyecto maestro."
                                            : "Con este enlace podrás afiliarte al producto digital en Hotmart para tener tus Enlaces de Afiliados."}
                                    </p>
                                </div>
                            </div>

                            {/* Lead Magnet */}
                            <div className="space-y-8 pt-12 border-t border-blue-500/5 text-left">
                                <div className="space-y-4">
                                    <label className="text-[12px] font-bold text-blue-400 uppercase tracking-[0.2em] ml-2">¿Qué vas a regalar para atraer clientes? (Regalo / Lead Magnet)</label>
                                    <div className="relative">
                                        <select 
                                            value={form.leadMagnetType} 
                                            onChange={(e) => setForm({ ...form, leadMagnetType: e.target.value })}
                                            className="w-full bg-black/40 border border-blue-500/10 rounded-2xl py-6 px-8 text-white text-lg outline-none focus:border-blue-500/40 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Ebook / Guía PDF">Ebook / Guía PDF</option>
                                            <option value="Clase Gratis / VSL">Clase Gratis / Carta de Ventas en Video</option>
                                            <option value="Masterclass en Vivo">Masterclass en Vivo</option>
                                            <option value="Plantilla / Checklist">Plantilla / Checklist</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[12px] font-bold text-blue-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <Gift className="w-4 h-4" />
                                        </div>
                                        URL de tu {form.leadMagnetType}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={form.leadMagnetUrl}
                                        onChange={(e) => setForm({ ...form, leadMagnetUrl: e.target.value })}
                                        placeholder="https://pega-aqui-tu-link-de-google-drive-o-clase.com"
                                        className={`w-full bg-black/40 border ${errors.leadMagnetUrl ? 'border-red-500/50' : 'border-blue-500/10'} rounded-2xl py-6 px-8 text-white text-lg outline-none focus:border-blue-500/40 transition-all placeholder:text-gray-600`}
                                    />
                                    {errors.leadMagnetUrl && (
                                        <p className="text-red-400/80 text-[12px] font-bold uppercase tracking-widest mt-2 ml-4 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" /> {errors.leadMagnetUrl}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Affiliate Links */}
                            <div className="pt-12 border-t border-blue-500/5 space-y-10 text-left">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[12px] font-bold text-blue-300 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <CartIcon className="w-4 h-4" />
                                        </div>
                                        Tus Enlaces para recibir Comisiones
                                    </label>
                                    <button 
                                        onClick={handleAddLink}
                                        className="text-[10px] font-extrabold text-blue-300 bg-blue-500/10 px-6 py-2.5 rounded-xl border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                                    >
                                        + Añadir Enlace
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-8">
                                    {form.affiliateLinks.map((link, idx) => (
                                        <div key={idx} className="bg-white/[0.03] border border-blue-500/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 transition-all relative">
                                            <button 
                                                onClick={() => handleRemoveLink(idx)} 
                                                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-red-500 transition-all"
                                            >
                                                <X className="w-5 h-5"/>
                                            </button>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest ml-2">Etiqueta del Botón</p>
                                                    <input 
                                                        type="text" 
                                                        value={link.label}
                                                        onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
                                                        placeholder="Ej: Checkout Principal"
                                                        className="w-full bg-black/40 border border-blue-500/10 rounded-xl py-5 px-6 text-white text-base outline-none focus:border-blue-500/40 transition-all"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest ml-2">URL de Afiliado (Hotlink)</p>
                                                    <input 
                                                        type="text" 
                                                        value={link.url}
                                                        onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                                                        placeholder="https://go.hotmart.com/..."
                                                        className={`w-full bg-black/40 border ${errors.affiliateLinks && !link.url.trim() ? 'border-red-500/40' : 'border-blue-500/10'} rounded-xl py-5 px-6 text-emerald-400 font-mono text-base outline-none focus:border-blue-500/40 transition-all`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Botón Guardar */}
                        <div className="pt-12 flex flex-col items-center space-y-8">
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full md:w-auto min-w-[340px] py-6 px-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-lg uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-500/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                                {saving ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
                                ) : (
                                    <><Rocket className="w-5 h-5" /> Guardar Configuración</>
                                )}
                            </button>

                            {showSuccess && (
                                <div className="flex items-center gap-3 text-emerald-400 font-bold uppercase tracking-widest text-[11px] animate-in fade-in zoom-in duration-500 bg-emerald-500/5 px-6 py-2.5 rounded-full border border-emerald-500/20">
                                    <CheckCircle2 className="w-4 h-4" /> ¡Configuración guardada satisfactoriamente!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
