

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Target, User, Zap, Link as LinkIcon, Briefcase, Plus, Trash2, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { api } from '../services/api';
import { generateProjectStrategy } from '../services/geminiService';
import { AffiliateLink } from '../types';

export const ProjectWizard: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Si hay ID, estamos editando
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [niche, setNiche] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    
    const [targetAudience, setTargetAudience] = useState('');
    const [mainGoal, setMainGoal] = useState('');
    const [brandTone, setBrandTone] = useState('');
    
    const [painPoints, setPainPoints] = useState<string[]>(['']);
    const [keyBenefits, setKeyBenefits] = useState<string[]>(['']);
    
    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([{ label: 'Checkout Principal', url: '' }]);

    // AI Suggestions State
    const [suggestedPainPoints, setSuggestedPainPoints] = useState<string[]>([]);
    const [suggestedBenefits, setSuggestedBenefits] = useState<string[]>([]);

    useEffect(() => {
        if (id) {
            loadProject(id);
        }
    }, [id]);

    const loadProject = async (projectId: string) => {
        setLoading(true);
        try {
            const proj = await api.getProjectById(projectId);
            if (proj) {
                setName(proj.name);
                setNiche(proj.niche);
                setProductName(proj.productName);
                setDescription(proj.description);
                setTargetAudience(proj.targetAudience);
                setMainGoal(proj.mainGoal);
                setBrandTone(proj.brandTone);
                setPainPoints(proj.painPoints && proj.painPoints.length > 0 ? proj.painPoints : ['']);
                setKeyBenefits(proj.keyBenefits && proj.keyBenefits.length > 0 ? proj.keyBenefits : ['']);
                setAffiliateLinks(proj.affiliateLinks && proj.affiliateLinks.length > 0 ? proj.affiliateLinks : [{ label: 'Checkout Principal', url: '' }]);
            }
        } catch (error) {
            console.error("Error loading project", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[]) => {
        setter([...items, '']);
    };

    const handleUpdateItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[], index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        setter(newItems);
    };

    const handleRemoveItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[], index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setter(newItems);
    };

    const handleLinkUpdate = (index: number, field: 'label' | 'url', value: string) => {
        const newLinks = [...affiliateLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setAffiliateLinks(newLinks);
    };

    const handleGenerateIdeas = async () => {
        if (!name || !niche || !productName) {
            alert("Por favor completa los datos del paso 1 antes de pedir ayuda a la IA.");
            setStep(1);
            return;
        }

        setLoadingAI(true);
        try {
            const strategy = await generateProjectStrategy(name, niche, productName, description);
            
            // Si la audiencia está vacía, sugerir
            if (!targetAudience) setTargetAudience(strategy.targetAudience);
            
            // Guardar sugerencias para que el usuario haga clic y agregue
            setSuggestedPainPoints(strategy.painPoints);
            setSuggestedBenefits(strategy.keyBenefits);

        } catch (error) {
            alert("No se pudo generar ideas. Intenta de nuevo.");
        } finally {
            setLoadingAI(false);
        }
    };

    const addSuggestion = (type: 'pain' | 'benefit', text: string) => {
        if (type === 'pain') {
            const current = painPoints.filter(p => p.trim() !== '');
            setPainPoints([...current, text]);
            setSuggestedPainPoints(suggestedPainPoints.filter(p => p !== text)); // Remover de sugeridos
        } else {
            const current = keyBenefits.filter(b => b.trim() !== '');
            setKeyBenefits([...current, text]);
            setSuggestedBenefits(suggestedBenefits.filter(b => b !== text)); // Remover de sugeridos
        }
    };

    const saveProject = async () => {
        if (!name || !niche) return alert('Por favor completa al menos el nombre y el nicho.');
        
        setLoading(true);
        const projectData = {
            name,
            niche,
            description,
            targetAudience,
            brandTone,
            productName,
            mainGoal,
            painPoints: painPoints.filter(p => p.trim() !== ''),
            keyBenefits: keyBenefits.filter(b => b.trim() !== ''),
            affiliateLinks: affiliateLinks.filter(l => l.url.trim() !== '')
        };

        try {
            if (id) {
                // UPDATE
                await api.updateProject(id, projectData);
                alert('Proyecto actualizado correctamente.');
            } else {
                // CREATE
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

    if (loading && id) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <button onClick={() => navigate('/dashboard/projects')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
            </button>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Progress Header */}
                <div className="bg-gray-800/50 p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> {id ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                        </h2>
                        <p className="text-sm text-gray-400">Paso {step} de 4</p>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-2 w-12 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-700'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="p-8 min-h-[400px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Briefcase className="w-5 h-5 text-blue-400" /> Fundamentos del Proyecto
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Proyecto</label>
                                    <input 
                                        type="text" 
                                        value={name} onChange={e => setName(e.target.value)} 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ej: Lanzamiento Curso Keto"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Producto/Servicio</label>
                                    <input 
                                        type="text" 
                                        value={productName} onChange={e => setProductName(e.target.value)} 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ej: Reto Keto 30 Días"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nicho de Mercado</label>
                                <input 
                                    type="text" 
                                    value={niche} onChange={e => setNiche(e.target.value)} 
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="Ej: Salud y Bienestar / Pérdida de Peso"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción Breve</label>
                                <textarea 
                                    value={description} onChange={e => setDescription(e.target.value)} 
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-24 resize-none"
                                    placeholder="¿De qué trata este proyecto?"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Target className="w-5 h-5 text-red-400" /> Estrategia y Audiencia
                                </h3>
                                <button 
                                    onClick={handleGenerateIdeas}
                                    disabled={loadingAI}
                                    className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition"
                                >
                                    {loadingAI ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                                    Generar Ideas con IA
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Público Objetivo (Avatar)</label>
                                <textarea 
                                    value={targetAudience} onChange={e => setTargetAudience(e.target.value)} 
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-24"
                                    placeholder="Ej: Mujeres de 30 a 50 años que han intentado dietas sin éxito..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo Principal</label>
                                <select 
                                    value={mainGoal} onChange={e => setMainGoal(e.target.value)}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Venta Directa">Venta Directa (Crash)</option>
                                    <option value="Captación de Leads">Captación de Leads (Magnet)</option>
                                    <option value="Webinar">Registro a Webinar</option>
                                    <option value="Lanzamiento">Lanzamiento Meteórico</option>
                                    <option value="Branding">Marca Personal / Branding</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Dolores Principales (Pain Points)</label>
                                
                                {/* AI Suggestions Area */}
                                {suggestedPainPoints.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                                        <span className="text-xs text-purple-400 w-full font-bold flex items-center gap-1"><Sparkles className="w-3 h-3"/> Sugerencias IA (Clic para agregar):</span>
                                        {suggestedPainPoints.map((s, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => addSuggestion('pain', s)}
                                                className="bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-800 transition text-left"
                                            >
                                                + {s}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {painPoints.map((point, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            value={point} onChange={e => handleUpdateItem(setPainPoints, painPoints, idx, e.target.value)}
                                            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder={`Dolor #${idx + 1}`}
                                        />
                                        <button onClick={() => handleRemoveItem(setPainPoints, painPoints, idx)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddItem(setPainPoints, painPoints)} className="text-sm text-primary flex items-center gap-1 hover:underline"><Plus className="w-3 h-3"/> Agregar Dolor</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Zap className="w-5 h-5 text-yellow-400" /> Identidad y Propuesta de Valor
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tono de Voz de la Marca</label>
                                <input 
                                    type="text" 
                                    value={brandTone} onChange={e => setBrandTone(e.target.value)} 
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="Ej: Autoritario, Empático, Urgente, Divertido..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Beneficios Clave / Promesas (Golden Nuggets)</label>

                                {/* AI Suggestions Area */}
                                {suggestedBenefits.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                                        <span className="text-xs text-purple-400 w-full font-bold flex items-center gap-1"><Sparkles className="w-3 h-3"/> Sugerencias IA (Clic para agregar):</span>
                                        {suggestedBenefits.map((s, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => addSuggestion('benefit', s)}
                                                className="bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-800 transition text-left"
                                            >
                                                + {s}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {keyBenefits.map((benefit, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            value={benefit} onChange={e => handleUpdateItem(setKeyBenefits, keyBenefits, idx, e.target.value)}
                                            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder={`Beneficio #${idx + 1}`}
                                        />
                                        <button onClick={() => handleRemoveItem(setKeyBenefits, keyBenefits, idx)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddItem(setKeyBenefits, keyBenefits)} className="text-sm text-primary flex items-center gap-1 hover:underline"><Plus className="w-3 h-3"/> Agregar Beneficio</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <LinkIcon className="w-5 h-5 text-green-400" /> Activos y Enlaces
                            </h3>
                            
                            <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-blue-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4"/>
                                    <strong>Estrategia:</strong> La IA usará estos enlaces automáticamente cuando genere tus páginas y artículos.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tus Hotlinks de Afiliado</label>
                                {affiliateLinks.map((link, idx) => (
                                    <div key={idx} className="flex gap-2 mb-3 bg-black p-3 rounded-lg border border-gray-800">
                                        <div className="flex-1 space-y-2">
                                            <input 
                                                type="text" 
                                                value={link.label} onChange={e => handleLinkUpdate(idx, 'label', e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-xs"
                                                placeholder="Etiqueta (ej: Checkout, VSL)"
                                            />
                                            <input 
                                                type="text" 
                                                value={link.url} onChange={e => handleLinkUpdate(idx, 'url', e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-green-400 text-sm font-mono"
                                                placeholder="https://go.hotmart.com/..."
                                            />
                                        </div>
                                        <button onClick={() => {
                                            const newLinks = affiliateLinks.filter((_, i) => i !== idx);
                                            setAffiliateLinks(newLinks);
                                        }} className="text-gray-500 hover:text-red-400 p-2 self-center"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                <button onClick={() => setAffiliateLinks([...affiliateLinks, { label: 'Nuevo Enlace', url: '' }])} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-sm flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> Agregar Otro Hotlink</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="bg-gray-800/50 p-6 border-t border-gray-800 flex justify-between">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition">
                            Atrás
                        </button>
                    ) : <div></div>}

                    {step < 4 ? (
                        <button onClick={() => setStep(step + 1)} className="px-6 py-2 rounded-lg bg-primary hover:bg-indigo-600 text-white font-bold transition flex items-center gap-2">
                            Siguiente <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={saveProject} disabled={loading} className="px-8 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-green-900/20">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                            {id ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
