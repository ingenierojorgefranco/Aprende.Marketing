import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Link as LinkIcon, Briefcase, Plus, Trash2, Loader2, Sparkles, Target, Zap, MessageCircle, User as UserIcon, DollarSign, Brain } from 'lucide-react';
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
    
    // Blocking Logic
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    
    // Step 1: Identificación y Finanzas
    const [name, setName] = useState('');
    const [productName, setProductName] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [fullPrice, setFullPrice] = useState<number>(0);
    const [commissionRate, setCommissionRate] = useState<number>(65);

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
        if (!id && user.planLimits) {
            const max = user.planLimits.maxProjects;
            if (projectCount >= max) {
                setShowUpgradeModal(true);
            }
        }

        if (id) {
            loadProject(id);
        }
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
                setCommissionRate(proj.commissionRate || 65);
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
        const projectData = {
            name,
            productName,
            mentorName,
            fullPrice,
            commissionRate,
            niche: niche || name,
            targetAudience,
            brandTone,
            keyPainPoint,
            keyTransformation,
            leadMagnetType,
            communityChannel,
            mainGoal: 'Venta Directa',
            painPoints: keyPainPoint ? [keyPainPoint] : [],
            keyBenefits: keyTransformation ? [keyTransformation] : [],
            affiliateLinks: affiliateLinks.filter(l => l.url.trim() !== '')
        };

        try {
            if (id) {
                await api.updateProject(id, projectData as any);
                alert('Proyecto actualizado correctamente.');
            } else {
                await api.createProject(projectData as any);
            }
            navigate('/dashboard/projects');
        } catch (error) {
            console.error(error);
            if (api.isUsingMockData()) {
                alert("Modo Demo: Proyecto guardado temporalmente.");
                navigate('/dashboard/projects');
            } else {
                alert('Error al guardar el proyecto.');
            }
        } finally {
            setLoading(false);
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
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => navigate('/dashboard/projects')} 
                reason={`Has alcanzado el límite de ${user.planLimits?.maxProjects} proyectos de tu plan ${user.planLimits?.planName}.`}
            />

            <button onClick={() => navigate('/dashboard/projects')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
            </button>

            <div className={`bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden ${showUpgradeModal ? 'opacity-30 pointer-events-none' : ''}`}>
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
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-400">Nombre del Proyecto (Interno)</label>
                                    <input 
                                        type="text" 
                                        value={name} onChange={e => setName(e.target.value)} 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ej: Lanzamiento Curso Microblading"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-400">Nombre del Producto (Público)</label>
                                    <input 
                                        type="text" 
                                        value={productName} onChange={e => setProductName(e.target.value)} 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ej: Certificación Microblading Pro"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-400">Nombre del Experto / Instructor</label>
                                    <div className="relative">
                                        <UserIcon className="absolute top-3.5 left-4 w-5 h-5 text-gray-600" />
                                        <input 
                                            type="text" 
                                            value={mentorName} onChange={e => setMentorName(e.target.value)} 
                                            className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:border-primary outline-none"
                                            placeholder="Ej: Valentina Ross"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-400">Precio (USD)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute top-3.5 left-4 w-4 h-4 text-gray-600" />
                                            <input 
                                                type="number" 
                                                value={fullPrice} onChange={e => setFullPrice(parseFloat(e.target.value))} 
                                                className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                                                placeholder="200"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-400">% Comisión</label>
                                        <input 
                                            type="number" 
                                            value={commissionRate} onChange={e => setCommissionRate(parseFloat(e.target.value))} 
                                            className="w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                            placeholder="65"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Brain className="w-5 h-5 text-purple-400" /> Estrategia y Psicología de Venta
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Nicho de Mercado</label>
                                    <input 
                                        type="text" 
                                        value={niche} onChange={e => setNiche(e.target.value)} 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ej: Belleza y Estética"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tono de Comunicación</label>
                                    <select 
                                        value={brandTone} onChange={e => setBrandTone(e.target.value)}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                    >
                                        <option>Profesional y Confiable</option>
                                        <option>Amigable y Cercano</option>
                                        <option>Urgente y Agresivo</option>
                                        <option>Inspiracional y Motivador</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-red-400" /> ¿Cuál es el mayor dolor que resuelve?
                                    </label>
                                    <textarea 
                                        value={keyPainPoint} onChange={e => setKeyPainPoint(e.target.value)} 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-20 resize-none"
                                        placeholder="Ej: Tienen miedo de no conseguir clientes y fracasar financieramente..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-green-400" /> ¿Cuál es la mayor transformación que promete?
                                    </label>
                                    <textarea 
                                        value={keyTransformation} onChange={e => setKeyTransformation(e.target.value)} 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-20 resize-none"
                                        placeholder="Ej: Convertirse en una experta certificada que cobra $150 USD por sesión..."
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de Lead Magnet (Gancho)</label>
                                    <select 
                                        value={leadMagnetType} onChange={e => setLeadMagnetType(e.target.value)}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                    >
                                        <option>Ebook (Guía PDF)</option>
                                        <option>Masterclass (Video Clase)</option>
                                        <option>Checklist / Plantilla</option>
                                        <option>Consulta Gratuita</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Canal de Comunidad Post-Registro</label>
                                    <select 
                                        value={communityChannel} onChange={e => setCommunityChannel(e.target.value)}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                    >
                                        <option>Grupo de WhatsApp</option>
                                        <option>Canal de Telegram</option>
                                        <option>Email Directo</option>
                                        <option>Directo a Oferta</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <LinkIcon className="w-5 h-5 text-green-400" /> Activos y Enlaces de Afiliado
                            </h3>
                            
                            <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-blue-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4"/>
                                    <strong>Nota:</strong> Estos enlaces se usarán automáticamente para que el sistema de IA redirija a tus clientes hacia Hotmart.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {affiliateLinks.map((link, idx) => (
                                    <div key={idx} className="flex gap-2 mb-3 bg-black p-4 rounded-xl border border-gray-800">
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nombre del botón / enlace</label>
                                                <input 
                                                    type="text" 
                                                    value={link.label} onChange={e => handleLinkUpdate(idx, 'label', e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-xs"
                                                    placeholder="Ej: Inscribirme con Descuento"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">URL de Hotmart (Hotlink)</label>
                                                <input 
                                                    type="text" 
                                                    value={link.url} onChange={e => handleLinkUpdate(idx, 'url', e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 text-sm font-mono"
                                                    placeholder="https://go.hotmart.com/..."
                                                />
                                            </div>
                                        </div>
                                        <button onClick={() => {
                                            const newLinks = affiliateLinks.filter((_, i) => i !== idx);
                                            setAffiliateLinks(newLinks);
                                        }} className="text-gray-500 hover:text-red-400 p-2 self-center transition-colors"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                <button onClick={() => setAffiliateLinks([...affiliateLinks, { label: 'Nuevo Enlace', url: '' }])} className="w-full py-3 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded-xl text-sm flex items-center justify-center gap-2 transition">
                                    <Plus className="w-4 h-4" /> Agregar Otro Enlace de Afiliado
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800/50 p-6 border-t border-gray-800 flex justify-between">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition">
                            Atrás
                        </button>
                    ) : <div></div>}

                    {step < 3 ? (
                        <button onClick={() => setStep(step + 1)} className="px-8 py-2.5 rounded-lg bg-primary hover:bg-indigo-600 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-primary/20">
                            Siguiente Paso <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={saveProject} disabled={loading} className="px-10 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-green-900/20">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                            {id ? 'Actualizar Proyecto' : 'Finalizar y Crear Estrategia'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};