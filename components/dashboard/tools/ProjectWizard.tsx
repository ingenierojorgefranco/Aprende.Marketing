import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { 
    ArrowLeft, ArrowRight, Save, Target, Zap, 
    Link as LinkIcon, Briefcase, Plus, Trash2, 
    Loader2, Sparkles, Check, Globe, DollarSign, 
    Percent, Lightbulb, Trash, Info, RefreshCw
} from 'lucide-react';
import { api } from '../../../services/api';
import { generateProjectStrategy } from '../../../services/geminiService';
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
    
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    
    // Blocking Logic
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    
    // New Fields
    const [name, setName] = useState('');
    const [productName, setProductName] = useState('');
    const [salesPageUrl, setSalesPageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [leadMagnetType, setLeadMagnetType] = useState('E-book / PDF');
    const [fullPrice, setFullPrice] = useState<number>(0);
    const [commissionRate, setCommissionRate] = useState<number>(0);
    
    // AI Generated Fields (Editable later)
    const [niche, setNiche] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [brandTone, setBrandTone] = useState('');
    const [painPoints, setPainPoints] = useState<string[]>([]);
    const [keyBenefits, setKeyBenefits] = useState<string[]>([]);
    const [mainGoal, setMainGoal] = useState('Captación de Leads');
    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([{ label: 'Checkout Principal', url: '' }]);

    useEffect(() => {
        if (!id && user.planLimits) {
            if (projectCount >= user.planLimits.maxProjects) {
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
                setSalesPageUrl(proj.salesPageUrl || '');
                setDescription(proj.description || '');
                setLeadMagnetType(proj.leadMagnetType || 'E-book / PDF');
                setFullPrice(proj.fullPrice || 0);
                setCommissionRate(proj.commissionRate || 0);
                
                setNiche(proj.niche || '');
                setTargetAudience(proj.targetAudience || '');
                setBrandTone(proj.brandTone || '');
                setPainPoints(proj.painPoints || []);
                setKeyBenefits(proj.keyBenefits || []);
                setMainGoal(proj.mainGoal || 'Captación de Leads');
                setAffiliateLinks(proj.affiliateLinks || [{ label: 'Checkout Principal', url: '' }]);
            }
        } catch (error) {
            console.error("Error loading project", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStep === 1 && !name) return;
        if (currentStep === 2 && !productName) return;
        if (currentStep === 4 && !description) return;
        
        if (currentStep === 6) {
            // Trigger AI Generation at step 6 before showing results or moving to links
            handleAIEngine();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleAIEngine = async () => {
        setLoadingAI(true);
        try {
            const strategy = await generateProjectStrategy(
                name, productName, description, leadMagnetType, salesPageUrl
            );
            
            // Populate AI Data
            setNiche(strategy.niche);
            setTargetAudience(strategy.targetAudience);
            setBrandTone(strategy.brandTone);
            setPainPoints(strategy.painPoints);
            setKeyBenefits(strategy.keyBenefits);
            
            setCurrentStep(7); // Move to strategy overview
        } catch (e) {
            alert("Hubo un error con la IA. Por favor, revisa tu conexión.");
        } finally {
            setLoadingAI(false);
        }
    };

    const saveProject = async () => {
        setLoading(true);
        const projectData = {
            name, productName, salesPageUrl, description, leadMagnetType,
            fullPrice, commissionRate, niche, targetAudience, brandTone,
            painPoints, keyBenefits, mainGoal, affiliateLinks: affiliateLinks.filter(l => l.url.trim() !== '')
        };

        try {
            if (id) {
                await api.updateProject(id, projectData);
            } else {
                await api.createProject(projectData);
            }
            navigate('/dashboard/projects');
        } catch (error) {
            console.error(error);
            alert('Error al guardar el proyecto.');
        } finally {
            setLoading(false);
        }
    };

    const StepIndicator = () => (
        <div className="flex gap-1.5 justify-center mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]' : i < currentStep ? 'w-4 bg-primary/40' : 'w-4 bg-gray-800'}`}></div>
            ))}
        </div>
    );

    if (loading && id) return <div className="flex items-center justify-center h-64 text-white"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="max-w-3xl mx-auto pb-20 pt-10">
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => navigate('/dashboard/projects')} reason={`Límite de proyectos alcanzado.`} />

            <div className="mb-10 flex items-center justify-between">
                <button onClick={() => navigate('/dashboard/projects')} className="text-gray-500 hover:text-white flex items-center gap-2 transition group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver a Proyectos
                </button>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                    ProjectWizard Pro AI v2.0
                </div>
            </div>

            <StepIndicator />

            <div className="bg-[#0f1115] border border-gray-800 rounded-[2.5rem] shadow-2xl p-10 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Sparkles className="w-40 h-40 text-primary" /></div>

                {/* --- STEPS CONTENT --- */}

                {currentStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <span className="text-primary font-black uppercase text-sm tracking-widest mb-3 block">Comencemos por el principio</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">¿Cómo se llamará internamente <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">tu proyecto?</span></h2>
                        </div>
                        <input 
                            autoFocus
                            type="text" 
                            value={name} onChange={e => setName(e.target.value)} 
                            className="w-full bg-transparent border-b-2 border-gray-800 text-3xl md:text-4xl text-white py-4 outline-none focus:border-primary transition-colors font-medium placeholder:text-gray-800"
                            placeholder="Ej: Lanzamiento Keto 2024"
                            onKeyDown={e => e.key === 'Enter' && handleNext()}
                        />
                        <p className="text-gray-500 mt-6 text-lg">Este nombre es solo para tu organización personal.</p>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <span className="text-primary font-black uppercase text-sm tracking-widest mb-3 block">El corazón del negocio</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">¿Cuál es el nombre <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">del producto?</span></h2>
                        </div>
                        <input 
                            autoFocus
                            type="text" 
                            value={productName} onChange={e => setProductName(e.target.value)} 
                            className="w-full bg-transparent border-b-2 border-gray-800 text-3xl md:text-4xl text-white py-4 outline-none focus:border-primary transition-colors font-medium placeholder:text-gray-800"
                            placeholder="Ej: Masterclass de Uñas"
                            onKeyDown={e => e.key === 'Enter' && handleNext()}
                        />
                        <p className="text-gray-500 mt-6 text-lg">Indica el nombre real que verán los clientes en la página de ventas.</p>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <span className="text-primary font-black uppercase text-sm tracking-widest mb-3 block">Análisis de la competencia</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">¿Tienes un link a la <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">página de ventas?</span></h2>
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-700 w-8 h-8" />
                            <input 
                                autoFocus
                                type="url" 
                                value={salesPageUrl} onChange={e => setSalesPageUrl(e.target.value)} 
                                className="w-full bg-transparent border-b-2 border-gray-800 text-2xl md:text-3xl text-blue-400 py-4 pl-12 outline-none focus:border-primary transition-colors font-medium placeholder:text-gray-800"
                                placeholder="https://..."
                                onKeyDown={e => e.key === 'Enter' && handleNext()}
                            />
                        </div>
                        <p className="text-gray-500 mt-6 text-lg">Opcional. Nuestra IA analizará la URL para entender mejor tu oferta.</p>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <span className="text-primary font-black uppercase text-sm tracking-widest mb-3 block">El valor real</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Cuéntanos sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">el producto</span></h2>
                        </div>
                        <textarea 
                            autoFocus
                            value={description} onChange={e => setDescription(e.target.value)} 
                            className="w-full bg-gray-900/50 border-2 border-gray-800 rounded-3xl p-6 text-xl text-white outline-none focus:border-primary transition-all h-48 resize-none placeholder:text-gray-700"
                            placeholder="Describe qué hace especial a este producto, qué problema resuelve y por qué alguien debería comprarlo..."
                        />
                        <p className="text-gray-500 mt-4 text-sm flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" /> Entre más detalles nos des, mejores serán los textos generados por IA.
                        </p>
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <span className="text-primary font-black uppercase text-sm tracking-widest mb-3 block">La estrategia de captación</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">¿Qué regalarás <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">como gancho?</span></h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['E-book / PDF', 'Clase en Video', 'Webinar en Vivo', 'Checklist', 'Sesión de Asesoría', 'Cupón de Descuento'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => { setLeadMagnetType(type); handleNext(); }}
                                    className={`p-6 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${leadMagnetType === type ? 'bg-primary/20 border-primary text-white shadow-lg' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'}`}
                                >
                                    {type}
                                    {leadMagnetType === type && <Check className="w-5 h-5" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 6 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <span className="text-primary font-black uppercase text-sm tracking-widest mb-3 block">Finanzas del proyecto</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Precios y <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Comisiones</span></h2>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-primary border border-gray-800"><DollarSign className="w-8 h-8"/></div>
                                <div className="flex-1">
                                    <label className="text-gray-500 text-sm font-bold uppercase mb-2 block">Precio Full al Público</label>
                                    <input 
                                        type="number" value={fullPrice} onChange={e => setFullPrice(Number(e.target.value))}
                                        className="w-full bg-transparent border-b border-gray-800 text-3xl text-white outline-none focus:border-primary transition"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-green-400 border border-gray-800"><Percent className="w-8 h-8"/></div>
                                <div className="flex-1">
                                    <label className="text-gray-500 text-sm font-bold uppercase mb-2 block">Porcentaje de Comisión</label>
                                    <input 
                                        type="number" value={commissionRate} onChange={e => setCommissionRate(Number(e.target.value))}
                                        className="w-full bg-transparent border-b border-gray-800 text-3xl text-white outline-none focus:border-primary transition"
                                    />
                                </div>
                            </div>
                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex justify-between items-center">
                                <span className="text-gray-400 font-medium">Ganancia estimada por venta:</span>
                                <span className="text-3xl font-black text-green-500">${((fullPrice * commissionRate) / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 7 && (
                    <div className="animate-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-800">
                            <h2 className="text-3xl font-black text-white flex items-center gap-3"><Sparkles className="w-8 h-8 text-primary" /> Estrategia Generada</h2>
                            {/* Fixed: Added missing RefreshCw import */}
                            <button onClick={() => setCurrentStep(4)} className="text-sm text-primary hover:underline flex items-center gap-1 font-bold"><RefreshCw className="w-4 h-4"/> Volver a redactar</button>
                        </div>

                        <div className="space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-6 bg-gray-900/50 rounded-3xl border border-gray-800">
                                    <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-4">Nicho Identificado</h4>
                                    <p className="text-white text-xl font-bold">{niche}</p>
                                </div>
                                <div className="p-6 bg-gray-900/50 rounded-3xl border border-gray-800">
                                    <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-4">Tono de Marca</h4>
                                    <p className="text-white text-xl font-bold">{brandTone}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-4 ml-2">Audiencia Maestra</h4>
                                <div className="p-8 bg-black/40 border border-gray-800 rounded-[2rem]">
                                    <p className="text-gray-300 text-lg leading-relaxed font-light italic">"{targetAudience}"</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-4 ml-2 flex items-center gap-2"><Target className="w-4 h-4"/> 7 Dolores Críticos</h4>
                                    <ul className="space-y-2">
                                        {painPoints.map((p, i) => <li key={i} className="bg-red-900/10 border border-red-500/20 p-3 rounded-xl text-gray-300 text-sm flex gap-2"><span>⚠️</span> {p}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-green-400 font-black uppercase text-xs tracking-widest mb-4 ml-2 flex items-center gap-2"><Zap className="w-4 h-4"/> Beneficios Clave</h4>
                                    <ul className="space-y-2">
                                        {keyBenefits.map((b, i) => <li key={i} className="bg-green-900/10 border border-green-500/20 p-3 rounded-xl text-gray-300 text-sm flex gap-2"><span>✅</span> {b}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 8 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <span className="text-primary font-black uppercase text-sm tracking-widest mb-3 block">Paso Final</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Configura tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">enlaces</span></h2>
                        </div>
                        <div className="space-y-6">
                            {affiliateLinks.map((link, idx) => (
                                <div key={idx} className="bg-black/40 border border-gray-800 rounded-3xl p-6 relative group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Etiqueta del enlace</label>
                                            <input 
                                                type="text" value={link.label} onChange={e => {
                                                    const newLinks = [...affiliateLinks];
                                                    newLinks[idx].label = e.target.value;
                                                    setAffiliateLinks(newLinks);
                                                }}
                                                className="w-full bg-transparent border-b border-gray-800 py-1 text-white focus:border-primary outline-none text-lg font-bold"
                                                placeholder="Ej: Checkout con 50% DCTO"
                                            />
                                        </div>
                                        <button onClick={() => {
                                            if (affiliateLinks.length > 1) setAffiliateLinks(affiliateLinks.filter((_, i) => i !== idx));
                                        }} className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-900/20 rounded-xl transition">
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">URL de Afiliado (Hotlink)</label>
                                        <input 
                                            type="text" value={link.url} onChange={e => {
                                                const newLinks = [...affiliateLinks];
                                                newLinks[idx].url = e.target.value;
                                                setAffiliateLinks(newLinks);
                                            }}
                                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-blue-400 font-mono text-sm focus:border-primary outline-none"
                                            placeholder="https://go.hotmart.com/..."
                                        />
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => setAffiliateLinks([...affiliateLinks, { label: 'Nuevo Enlace', url: '' }])}
                                className="w-full py-4 border-2 border-dashed border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 rounded-3xl font-bold transition flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Agregar otro enlace
                            </button>
                        </div>
                    </div>
                )}

                {/* --- NAVIGATION BUTTONS --- */}
                <div className="mt-16 flex justify-between items-center">
                    {currentStep > 1 && currentStep !== 7 && (
                        <button onClick={() => setCurrentStep(prev => prev - 1)} className="text-gray-400 font-bold flex items-center gap-2 hover:text-white transition">
                            <ArrowLeft className="w-5 h-5"/> Anterior
                        </button>
                    )}
                    <div className="flex-1"></div>
                    
                    {currentStep < 6 ? (
                        <button 
                            onClick={handleNext}
                            className="bg-primary hover:bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-primary/25 flex items-center gap-3 transform hover:scale-105"
                        >
                            Siguiente <ArrowRight className="w-6 h-6" />
                        </button>
                    ) : currentStep === 6 ? (
                        <button 
                            onClick={handleAIEngine}
                            disabled={loadingAI}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-purple-900/30 flex items-center gap-3 transform hover:scale-105"
                        >
                            {loadingAI ? <><Loader2 className="w-6 h-6 animate-spin"/> Generando Estrategia...</> : <><Sparkles className="w-6 h-6" /> Generar con IA</>}
                        </button>
                    ) : currentStep === 7 ? (
                        <button 
                            onClick={() => setCurrentStep(8)}
                            className="bg-primary hover:bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-primary/25 flex items-center gap-3 transform hover:scale-105"
                        >
                            Aceptar y Continuar <ArrowRight className="w-6 h-6" />
                        </button>
                    ) : (
                        <button 
                            onClick={saveProject}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-500 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-green-900/30 flex items-center gap-3 transform hover:scale-105"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin"/> : <><Save className="w-6 h-6" /> Finalizar Proyecto</>}
                        </button>
                    )}
                </div>
            </div>
            
            {currentStep === 1 && (
                <div className="mt-8 bg-blue-900/20 border border-blue-500/20 p-6 rounded-3xl animate-in fade-in slide-in-from-top-4 delay-300">
                    <p className="text-blue-300 text-sm flex gap-3">
                        <Info className="w-5 h-5 shrink-0" />
                        Este asistente está potenciado por Gemini 3 Flash. Analizaremos tu mercado para entregarte un centro de comando de ventas optimizado.
                    </p>
                </div>
            )}
        </div>
    );
};
