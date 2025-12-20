import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Link as LinkIcon, Briefcase, Plus, Trash2, Loader2, Sparkles, Target, Zap, MessageCircle, User as UserIcon, DollarSign, Brain, Percent } from 'lucide-react';
import { api } from '../../../services/api';
import { AffiliateLink, User } from '../../../types';
import { UpgradeModal } from '../UpgradeModal';

interface DashboardContext {
  user: User;
  projectCount: number;
}

export const ProjectWizard: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams() as { id: string };
    const { user, projectCount } = useOutletContext() as DashboardContext;
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    
    // Blocking Logic
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    
    // Step 1: Identificación y Finanzas
    const [name, setName] = useState('');
    const [productName, setProductName] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [fullPrice, setFullPrice] = useState<number>(0);
    const [commissionAmount, setCommissionAmount] = useState<number>(0);
    const [calculatedRate, setCalculatedRate] = useState<number>(0);

    // Step 2: Estrategia y Psicología
    const [niche, setNiche] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [brandTone, setBrandTone] = useState('Amigable y Profesional');
    const [keyPainPoint, setKeyPainPoint] = useState('');
    const [keyTransformation, setKeyTransformation] = useState('');
    const [leadMagnetType, setLeadMagnetType] = useState('Ebook (Guía PDF)');
    const [communityChannel, setCommunityChannel] = useState('Grupo de WhatsApp');
    
    // Step 3: Enlaces
    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([{ label: 'Checkout Principal', url: '' }]);

    useEffect(() => {
        if (fullPrice > 0 && commissionAmount >= 0) {
            const rate = (commissionAmount / fullPrice) * 100;
            setCalculatedRate(Math.round(rate * 100) / 100);
        } else {
            setCalculatedRate(0);
        }
    }, [fullPrice, commissionAmount]);

    useEffect(() => {
        if (!id && user.planLimits) {
            const max = user.planLimits.maxProjects;
            if (projectCount >= max) {
                setShowUpgradeModal(true);
            }
        }
        if (id) loadProject(id);
    }, [id, user, projectCount]);

    const loadProject = async (projectId: string) => {
        setLoading(true);
        try {
            const proj = await api.getProjectById(projectId);
            if (proj) {
                setName(proj.name);
                setProductName(proj.productName || '');
                setMentorName(proj.mentorName || '');
                setFullPrice(proj.fullPrice || 0);
                setCommissionAmount(proj.commissionAmount || 0);
                setNiche(proj.niche || '');
                setTargetAudience(proj.targetAudience || '');
                setBrandTone(proj.brandTone || 'Amigable y Profesional');
                setKeyPainPoint(proj.keyPainPoint || '');
                setKeyTransformation(proj.keyTransformation || '');
                setLeadMagnetType(proj.leadMagnetType || 'Ebook (Guía PDF)');
                setCommunityChannel(proj.communityChannel || 'Grupo de WhatsApp');
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

    const saveProject = async () => {
        if (!name || !productName) return alert('Por favor completa el nombre del proyecto y del producto.');
        
        setLoading(true);
        setAiGenerating(true);

        const projectData = {
            name, productName, mentorName, fullPrice, commissionAmount, 
            commissionRate: calculatedRate, niche: niche || name, targetAudience, 
            brandTone, keyPainPoint, keyTransformation, leadMagnetType, 
            communityChannel, mainGoal: 'Venta Directa',
            painPoints: keyPainPoint ? [keyPainPoint] : [],
            keyBenefits: keyTransformation ? [keyTransformation] : [],
            affiliateLinks: affiliateLinks.filter(l => l.url.trim() !== '')
        };

        try {
            // 1. Generar la Estrategia por IA (Preview)
            const strategyPreview = await api.previewProjectStrategy(projectData);
            
            // 2. Guardar el Proyecto en la base de datos (con la estrategia incluida)
            const savedProject = await api.createProject({ ...projectData, strategy_json: strategyPreview } as any);
            
            // 3. Almacenar en sesión temporal para visualización inmediata
            sessionStorage.setItem(`preview_strategy_${savedProject.id}`, JSON.stringify(strategyPreview));

            navigate(`/dashboard/projects/${savedProject.id}/strategy`);
        } catch (error) {
            console.error(error);
            alert('Error al generar la estrategia con IA. Se guardó solo el proyecto.');
            navigate('/dashboard/projects');
        } finally {
            setLoading(false);
            setAiGenerating(false);
        }
    };

    if (loading && id) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => navigate('/dashboard/projects')} reason={`Límite de ${user.planLimits?.maxProjects} proyectos alcanzado.`} />

            <button onClick={() => navigate('/dashboard/projects')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
            </button>

            <div className={`bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden ${showUpgradeModal || aiGenerating ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bg-gray-800/50 p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> {id ? 'Editar Proyecto' : 'Configurar Nueva Estrategia'}
                        </h2>
                        <p className="text-sm text-gray-400">Paso {step} de 3</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-2 w-16 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-700'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="p-8 min-h-[400px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Briefcase className="w-5 h-5 text-blue-400" /> Identificación y Datos Financieros
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Proyecto</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ej: Curso Microblading" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Producto</label>
                                    <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ej: Certificación Pro" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Mentor / Experto</label>
                                    <input type="text" value={mentorName} onChange={e => setMentorName(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ej: Valentina Ross" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Precio Full (USD)</label>
                                        <input type="number" value={fullPrice || ''} onChange={e => setFullPrice(parseFloat(e.target.value))} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Tu Ganancia (USD)</label>
                                        <input type="number" value={commissionAmount || ''} onChange={e => setCommissionAmount(parseFloat(e.target.value))} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Brain className="w-5 h-5 text-purple-400" /> Estrategia y Psicología
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nicho</label>
                                    <input type="text" value={niche} onChange={e => setNiche(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" placeholder="Ej: Belleza" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Tono de Marca</label>
                                    <select value={brandTone} onChange={e => setBrandTone(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none">
                                        <option>Amigable y Profesional</option>
                                        <option>Urgente y Directo</option>
                                        <option>Inspiracional</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Mayor Dolor que Resuelve</label>
                                    <textarea value={keyPainPoint} onChange={e => setKeyPainPoint(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-20" placeholder="Ej: Miedo al fracaso financiero..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Mayor Transformación Prometida</label>
                                    <textarea value={keyTransformation} onChange={e => setKeyTransformation(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-20" placeholder="Ej: Ser una profesional independiente..." />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <LinkIcon className="w-5 h-5 text-green-400" /> Enlaces de Afiliado
                            </h3>
                            <div className="space-y-4">
                                {affiliateLinks.map((link, idx) => (
                                    <div key={idx} className="flex gap-2 bg-black p-4 rounded-xl border border-gray-800">
                                        <div className="flex-1 space-y-3">
                                            <input type="text" value={link.label} onChange={e => handleLinkUpdate(idx, 'label', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-xs" placeholder="Nombre (Ej: Checkout)" />
                                            <input type="text" value={link.url} onChange={e => handleLinkUpdate(idx, 'url', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 text-sm font-mono" placeholder="URL Hotmart" />
                                        </div>
                                        <button onClick={() => setAffiliateLinks(affiliateLinks.filter((_, i) => i !== idx))} className="text-gray-500 hover:text-red-400 p-2"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                <button onClick={() => setAffiliateLinks([...affiliateLinks, { label: 'Nuevo Enlace', url: '' }])} className="w-full py-3 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded-xl text-sm transition">
                                    + Agregar Otro Enlace
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800/50 p-6 border-t border-gray-800 flex justify-between">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition">Atrás</button>
                    ) : <div></div>}

                    {step < 3 ? (
                        <button onClick={() => setStep(step + 1)} className="px-8 py-2.5 rounded-lg bg-primary hover:bg-indigo-600 text-white font-bold transition flex items-center gap-2">Siguiente Paso <ArrowRight className="w-4 h-4" /></button>
                    ) : (
                        <button onClick={saveProject} disabled={loading} className="px-10 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-green-900/20">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                            Finalizar y Crear Estrategia
                        </button>
                    )}
                </div>
            </div>

            {aiGenerating && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6 text-center backdrop-blur-sm">
                    <div className="max-w-md space-y-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping absolute inset-0 mx-auto"></div>
                            <Sparkles className="w-24 h-24 text-primary mx-auto relative z-10" />
                        </div>
                        <h3 className="text-3xl font-black text-white">IA Generando Estrategia...</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Estamos analizando tu nicho, diseñando tus avatares y redactando toda tu secuencia de ventas. Esto puede tardar hasta 30 segundos.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-primary font-bold">
                            <Loader2 className="w-5 h-5 animate-spin" /> No cierres esta ventana
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
