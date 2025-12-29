import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Link as LinkIcon, Briefcase, Plus, Trash2, Loader2, Sparkles, DollarSign, Target, Globe, MessageSquare, Brain, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type, Palette, Code } from 'lucide-react';
import { api } from '../../../services/api';
import { AffiliateLink, User, Project } from '../../../types';
import { UpgradeModal } from '../UpgradeModal';

// --- VISUAL EDITOR COMPONENT (LOCAL) ---
interface VisualEditorProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
}

const VisualEditor = ({ value, onChange, className, placeholder }: VisualEditorProps) => {
    const [isSourceMode, setIsSourceMode] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (contentRef.current && contentRef.current.innerHTML !== value && !isSourceMode) {
            contentRef.current.innerHTML = value || '';
        }
    }, [value, isSourceMode]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (contentRef.current) {
            onChange(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
    };

    const ToolbarButton = ({ icon: Icon, cmd, arg, title }: any) => (
        <button 
            type="button"
            onClick={() => execCmd(cmd, arg)} 
            className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition" 
            title={title}
            disabled={isSourceMode}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className={`border border-gray-700 rounded-xl overflow-hidden bg-black ${className}`}>
            <div className={`flex flex-wrap items-center gap-1 bg-gray-900 p-2 border-b border-gray-700 ${isSourceMode ? 'opacity-50 pointer-events-none' : ''}`}>
                <ToolbarButton icon={Bold} cmd="bold" title="Negrita" />
                <ToolbarButton icon={Italic} cmd="italic" title="Cursiva" />
                <ToolbarButton icon={Underline} cmd="underline" title="Subrayado" />
                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                <ToolbarButton icon={AlignLeft} cmd="justifyLeft" title="Izquierda" />
                <ToolbarButton icon={AlignCenter} cmd="justifyCenter" title="Centro" />
                <ToolbarButton icon={AlignRight} cmd="justifyRight" title="Derecha" />
                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                <ToolbarButton icon={List} cmd="insertUnorderedList" title="Lista" />
                <div className="ml-auto">
                    <button 
                        type="button" 
                        onClick={() => setIsSourceMode(!isSourceMode)} 
                        className={`p-1.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase transition ${isSourceMode ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Code className="w-3 h-3" /> {isSourceMode ? 'Visual' : 'HTML'}
                    </button>
                </div>
            </div>

            <div className="relative min-h-[200px] bg-black">
                {isSourceMode ? (
                    <textarea 
                        ref={textAreaRef}
                        className="w-full h-full min-h-[200px] p-4 bg-[#0d1117] text-gray-300 font-mono text-xs outline-none resize-none"
                        value={value}
                        onChange={handleSourceChange}
                    />
                ) : (
                    <div 
                        ref={contentRef}
                        className="prose prose-invert prose-p:my-2 prose-ul:my-4 prose-li:my-1 max-w-none p-4 outline-none min-h-[200px] text-gray-300"
                        contentEditable
                        onInput={handleInput}
                        suppressContentEditableWarning={true}
                    />
                )}
            </div>
        </div>
    );
};

interface DashboardContext {
  user: User;
  projectCount: number;
  isSimulating: boolean;
}

export const ProjectWizard: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams() as { id: string };
    const { user, projectCount, isSimulating } = useOutletContext() as DashboardContext;
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    
    const [name, setName] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [brandTone, setBrandTone] = useState('Amigable y Cercano');
    
    const [fullPrice, setFullPrice] = useState<number>(0);
    const [commissionValue, setCommissionValue] = useState<number>(0);
    const [leadMagnetType, setLeadMagnetType] = useState('Ebook / Guía PDF');
    const [salesPageUrl, setSalesPageUrl] = useState('');
    
    const [niche, setNiche] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [mainGoal, setMainGoal] = useState('Venta Directa');
    const [painPoints, setPainPoints] = useState<string[]>([]);
    const [keyBenefits, setKeyBenefits] = useState<string[]>([]);
    
    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([{ label: 'Checkout Principal', url: '' }]);

    const commissionRate = fullPrice > 0 ? (commissionValue / fullPrice) * 100 : 0;

    useEffect(() => {
        const isRealAdmin = user.role === 'admin' && !isSimulating;
        
        if (!id && !isRealAdmin && user.planLimits) {
            const max = user.planLimits.maxProjects;
            if (projectCount >= max) {
                setShowUpgradeModal(true);
            }
        }

        if (id) {
            loadProject(id);
        }
    }, [id, user, projectCount, isSimulating]);

    const loadProject = async (projectId: string) => {
        setLoading(true);
        try {
            const proj = await api.getProjectById(projectId);
            if (proj) {
                setName(proj.name);
                setProductName(proj.productName);
                setDescription(proj.description);
                setBrandTone(proj.brandTone || 'Amigable y Cercano');
                
                setFullPrice(proj.fullPrice || 0);
                if (proj.commissionRate && proj.fullPrice) {
                    setCommissionValue(proj.commissionRate * proj.fullPrice);
                }
                setLeadMagnetType(proj.leadMagnetType || 'Ebook / Guía PDF');
                setSalesPageUrl(proj.salesPageUrl || '');
                
                setNiche(proj.niche || '');
                setTargetAudience(proj.targetAudience || '');
                setMainGoal(proj.mainGoal || 'Venta Directa');
                setPainPoints(proj.painPoints || []);
                setKeyBenefits(proj.keyBenefits || []);
                setAffiliateLinks(proj.affiliateLinks && proj.affiliateLinks.length > 0 ? proj.affiliateLinks : [{ label: 'Checkout Principal', url: '' }]);
            }
        } catch (error) {
            console.error("Error loading project", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkUpdate = (index: number, field: 'label' | 'url', value: string) => {
        const newLinks = [...affiliateLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setAffiliateLinks(newLinks);
    };

    const handleAnalyzeSite = async () => {
        if (!salesPageUrl) return alert('Por favor ingresa una URL para analizar.');
        
        setAnalyzing(true);
        try {
            const data = await api.analyzeSite(salesPageUrl);
            if (data.productName) setProductName(data.productName);
            if (data.description) setDescription(data.description);
            if (data.niche) setNiche(data.niche);
            alert('¡Análisis completado! Hemos completado la información basándonos en la página web.');
        } catch (error: any) {
            console.error("Analysis failure:", error);
            alert(error.message || 'No se pudo analizar el sitio.');
        } finally {
            setAnalyzing(false);
        }
    };

    const saveProject = async () => {
        if (!name || !productName) return alert('Por favor completa el nombre del proyecto y del producto.');
        
        setLoading(true);
        setLoadingStatus('Fase 1/2: Guardando información en base de datos...');
        
        const projectData = {
            name,
            productName,
            description,
            brandTone,
            fullPrice,
            commissionRate: fullPrice > 0 ? commissionValue / fullPrice : 0,
            leadMagnetType,
            salesPageUrl,
            niche: niche || name, 
            targetAudience: targetAudience || '',
            mainGoal: mainGoal || 'Venta Directa',
            painPoints: painPoints,
            keyBenefits: keyBenefits,
            affiliateLinks: affiliateLinks.filter(l => l.url.trim() !== '')
        };

        try {
            let projectId = id;
            if (id) {
                await api.updateProject(id, projectData as any);
            } else {
                const saved = await api.createProject(projectData as any);
                projectId = saved.id;
            }

            setLoadingStatus('Fase 2/2: La IA está diseñando tu Estrategia Maestra...');
            await api.generateProjectStrategyFull(projectId);
            navigate(`/dashboard/projects/${projectId}/strategy`);
        } catch (error) {
            console.error(error);
            alert('Error al procesar el proyecto.');
            setLoading(false);
            setLoadingStatus('');
        }
    };

    if (loading && id && !loadingStatus) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 relative">
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => navigate('/dashboard/projects')} 
                reason={`Has alcanzado el límite de proyectos de tu plan.`}
            />

            {loadingStatus && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <div className="relative mb-10">
                        <div className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="w-24 h-24 bg-gray-900 border-4 border-primary/30 rounded-3xl flex items-center justify-center shadow-2xl relative">
                            <Brain className="w-12 h-12 text-primary animate-bounce" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight max-w-lg">
                        Tu Estrategia está siendo diseñada...
                    </h3>
                    <p className="text-blue-400 font-bold mb-8 uppercase tracking-widest text-sm animate-pulse">
                        {loadingStatus}
                    </p>
                </div>
            )}

            <button onClick={() => navigate('/dashboard/projects')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
            </button>

            <div className={`bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden ${showUpgradeModal || loadingStatus ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="bg-gray-800/50 p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> {id ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                        </h2>
                        <p className="text-sm text-gray-400">Paso {step} de 3</p>
                    </div>
                </div>

                <div className="p-8 min-h-[450px]">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                                <label className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Analizador Inteligente (Opcional)
                                </label>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <input 
                                        type="text" 
                                        value={salesPageUrl} onChange={e => setSalesPageUrl(e.target.value)} 
                                        className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Pega la URL de tu página de ventas..."
                                    />
                                    <button 
                                        onClick={handleAnalyzeSite}
                                        disabled={analyzing || !salesPageUrl}
                                        className="bg-primary hover:bg-indigo-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                        {analyzing ? 'Analizando...' : 'Analizar Sitio'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Nombre del Proyecto</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ej: Lanzamiento Uñas Pro" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Nombre del Producto</label>
                                    <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ej: Masterclass Uñas Perfectas" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Descripción del Producto</label>
                                <VisualEditor value={description} onChange={setDescription} placeholder="Describe el producto o usa el analizador..." />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Tono de Comunicación</label>
                                <select value={brandTone} onChange={e => setBrandTone(e.target.value)} className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                                    <option value="Amigable y Cercano">Amigable y Cercano</option>
                                    <option value="Profesional y Serio">Profesional y Serio</option>
                                    <option value="Agresivo y Urgente">Agresivo y Urgente</option>
                                    <option value="Inspirador y Aspiracional">Inspirador y Aspiracional</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Precio de Venta (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="number" value={fullPrice} onChange={e => setFullPrice(parseFloat(e.target.value) || 0)} className="w-full bg-black border border-gray-700 rounded-xl px-10 py-3 text-white focus:border-emerald-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Tu Comisión (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="number" value={commissionValue} onChange={e => setCommissionValue(parseFloat(e.target.value) || 0)} className="w-full bg-black border border-gray-700 rounded-xl px-10 py-3 text-white focus:border-emerald-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="space-y-4">
                                {affiliateLinks.map((link, idx) => (
                                    <div key={idx} className="flex gap-3 p-4 bg-black rounded-2xl border border-gray-800 group">
                                        <div className="flex-1 space-y-3">
                                            <input type="text" value={link.label} onChange={e => handleLinkUpdate(idx, 'label', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-xs" placeholder="Etiqueta" />
                                            <input type="text" value={link.url} onChange={e => handleLinkUpdate(idx, 'url', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-indigo-400 text-xs font-mono" placeholder="URL" />
                                        </div>
                                        <button onClick={() => setAffiliateLinks(affiliateLinks.filter((_, i) => i !== idx))} className="text-gray-600 hover:text-red-500 p-2"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                <button onClick={() => setAffiliateLinks([...affiliateLinks, { label: 'Nuevo Enlace', url: '' }])} className="w-full py-4 border-2 border-dashed border-gray-800 text-gray-500 hover:text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2">+ Agregar Hotlink</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800/30 p-6 border-t border-gray-800 flex justify-between items-center">
                    {step > 1 && <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl bg-gray-800 text-white font-bold transition flex items-center gap-2">Anterior</button>}
                    <div />
                    {step < 3 ? (
                        <button onClick={() => setStep(step + 1)} className="px-8 py-3 rounded-xl bg-primary text-white font-bold transition flex items-center gap-2">Siguiente</button>
                    ) : (
                        <button onClick={saveProject} disabled={loading} className="px-10 py-3 rounded-xl bg-green-600 text-white font-bold transition flex items-center gap-2 shadow-lg">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>} Finalizar y Generar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};