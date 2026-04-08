import React, { useState, useEffect } from 'react';
import { Lead, EmailSequence, User, Project, Plan } from '../../../types';
import { Mail, RefreshCw, Database, Loader2, CheckCircle, ExternalLink, Zap, Send, X, List, Target, ShieldCheck, Tag, Plus, Clock, LayoutTemplate, Settings, Users, AlertCircle, Play, PlayCircle, Edit3, Eye, Trash2, Crown, Calendar, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import { api } from '../../../services/api';
/* */ /* Actualización: Importación de useNavigate para manejar redirección - 24/06/2024 15:15 */
import { useNavigate, Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { DeletionRestrictionModal } from '../DeletionRestrictionModal';
import { EmailSequenceWizard } from './EmailSequenceWizard';
/* Fin de actualización - 24/06/2024 15:15 */

export const EmailMarketing: React.FC = () => {
  /* */ /* Actualización: Revisión de consistencia en el acceso a datos del proyecto para la gestión de secuencias - 25/06/2024 11:50 */
  
  /* */ /* Actualización: Inicialización de navigate - 24/06/2024 15:15 */
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isSimulating } = useOutletContext() as { user: User, isSimulating: boolean };
  const [projects, setProjects] = useState<Project[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  /* Fin de actualización - 24/06/2024 15:15 */

  const [activeTab, setActiveTab] = useState<'conversion' | 'nurturing' | 'leads' | 'config'>('conversion');
  const [wizardType, setWizardType] = useState<'conversion' | 'nurturing'>('conversion');
  const [systemeIoKey, setSystemeIoKey] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [syncing, setSyncing] = useState(false);

  /* */ /* Actualización: Estado para secuencias reales - 24/06/2024 16:20 */
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [loadingSequences, setLoadingSequences] = useState(true);

  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedLeadForSync, setSelectedLeadForSync] = useState<Lead | null>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [syncingSingle, setSyncingSingle] = useState(false);
  const [syncMode, setSyncMode] = useState<'single' | 'bulk'>('single');
  const [modalStep, setModalStep] = useState<'selection' | 'success'>('selection');
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [showProjectSelection, setShowProjectSelection] = useState(false);

  // --- Nuevo Estado para Restricción de Eliminación ---
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [sequenceToRestrict, setSequenceToRestrict] = useState<EmailSequence | null>(null);
  // ----------------------------------------------------

  useEffect(() => {
    loadSettings();
    loadLeads();
    loadSequences();
    loadProjects();
    loadPlans();

    // Check if we should open the wizard based on URL params
    if (searchParams.get('projectId') || searchParams.get('day')) {
      setIsWizardOpen(true);
    }
  }, []);

  const loadProjects = async () => {
      try {
          const data = await api.getProjects();
          setProjects(data || []);
      } catch (e) {
          console.error("Error loading projects", e);
      }
  };

  const loadPlans = async () => {
      try {
          const data = await api.getPublicPlans();
          setPlans(data || []);
      } catch (e) {
          console.error("Error loading plans", e);
      }
  };

  const effectiveLimits = React.useMemo(() => {
    if (!user.planLimits) return null;
    if (typeof user.planLimits === 'string') {
      try {
        const parsed = JSON.parse(user.planLimits);
        // Handle potential nesting or direct object
        return parsed.planLimits || parsed;
      } catch (e) {
        return null;
      }
    }
    return user.planLimits;
  }, [user.planLimits]);

  // Use user.planSlug or fallback to planName from effectiveLimits
  const planSlugToFind = user.planSlug || effectiveLimits?.planName;
  const userPlan = plans.find(p => p.slug === planSlugToFind);

  const maxConversionSequences = Number(effectiveLimits?.maxEmailSequences ?? userPlan?.limitsConfig?.maxEmailSequences ?? 0);
  const maxNurturingSequences = Number(effectiveLimits?.maxEmailSequencesNurturing ?? userPlan?.limitsConfig?.maxEmailSequencesNurturing ?? 0);

  useEffect(() => {
    if (user.role === 'admin') {
      console.log("DEBUG - EmailMarketing User Context:", user);
      console.log("DEBUG - planLimits original:", user.planLimits, "Tipo:", typeof user.planLimits);
      console.log("DEBUG - effectiveLimits:", effectiveLimits);
      console.log("DEBUG - planSlugToFind:", planSlugToFind);
      console.log("DEBUG - userPlan:", userPlan);
      console.log("DEBUG - maxNurturingSequences:", maxNurturingSequences);
    }
  }, [user, effectiveLimits, planSlugToFind, userPlan, maxNurturingSequences]);

  useEffect(() => {
    if (systemeIoKey) {
        loadTags();
    }
  }, [systemeIoKey]);

  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      const settings = await api.getIntegrationSettings();
      if (settings.systemeIoKey) {
        setSystemeIoKey(settings.systemeIoKey);
      }
    } catch (e) {
      console.error("Error loading settings", e);
    } finally {
      setLoadingSettings(false);
    }
  };

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (e) {
      console.error("Error loading leads", e);
    } finally {
      setLoadingLeads(false);
    }
  };

  /* */ /* Actualización: Función para cargar secuencias reales desde la API - 24/06/2024 16:20 */
  const loadSequences = async () => {
    setLoadingSequences(true);
    try {
      const data = await api.getEmailSequences();
      setSequences(data);
    } catch (e) {
      console.error("Error cargando secuencias", e);
    } finally {
      setLoadingSequences(false);
    }
  };

  /* */ /* Actualización: Implementación de eliminación física de secuencia con confirmación - 11/12/2024 15:45 */
  const handleDeleteSequence = async (seq: EmailSequence, e: React.MouseEvent) => {
    e.stopPropagation();

    if (user.role !== 'admin') {
      setSequenceToRestrict(seq);
      setShowRestrictionModal(true);
      return;
    }

    if (!window.confirm("¿Estás seguro de eliminar esta secuencia de correos? Se borrarán todos los borradores asociados.")) return;
    
    try {
        await api.deleteEmailSequence(seq.id);
        setSequences(prev => prev.filter(s => s.id !== seq.id));
    } catch (error) {
        alert("Error al eliminar la secuencia.");
    }
  };

  const loadTags = async () => {
      if (!systemeIoKey) return;
      setLoadingTags(true);
      try {
          const data = await api.getSystemeIoTags();
          setTags(data);
      } catch (e) {
          console.error("Error loading tags", e);
      } finally {
          setLoadingTags(false);
      }
  };

  const handleSaveKey = async () => {
    setSavingKey(true);
    try {
      await api.updateIntegrationSettings({ systemeIoKey });
      alert("Configuración de Systeme.io guardada correctamente.");
      loadTags();
    } catch (e) {
      alert("Error al guardar la API Key.");
    } finally {
      setSavingKey(false);
    }
  };

  const handleManualSyncTrigger = () => {
    if (!systemeIoKey) {
        alert("Primero debes configurar y guardar tu API Key de Systeme.io.");
        return;
    }
    setSyncMode('bulk');
    setModalStep('selection');
    setShowTagModal(true);
  };

  const executeBulkSync = async (tagId: string) => {
    setSyncing(true);
    try {
        const res = await api.syncPendingLeads(tagId);
        setModalStep('success');
        loadLeads();
    } catch (e: any) {
        alert("Error durante la sincronización.");
    } finally {
        setSyncing(false);
    }
  };

  const openTagSelector = async (lead: Lead) => {
    if (!systemeIoKey) {
        alert("Configura primero tu API Key de Systeme.io en la pestaña Configuración.");
        return;
    }
    setSelectedLeadForSync(lead);
    setSyncMode('single');
    setModalStep('selection');
    setShowTagModal(true);
  };

  const handleSingleSync = async (tagId: string) => {
    if (!selectedLeadForSync) return;
    setSyncingSingle(true);
    try {
        await api.syncSingleLead(selectedLeadForSync.id, tagId);
        setLeads(prev => prev.map(l => l.id === selectedLeadForSync.id ? { ...l, synced: true } : l));
        setModalStep('success');
    } catch (e: any) {
        alert("Error al enviar el lead.");
    } finally {
        setSyncingSingle(false);
    }
  };

  const handleCreateTag = async () => {
      if (!newTagName.trim()) return;
      setIsCreatingTag(true);
      try {
          await api.createSystemeIoTag(newTagName);
          setNewTagName('');
          await loadTags();
      } catch (e) {
          alert("Error al crear la etiqueta.");
      } finally {
          setIsCreatingTag(false);
      }
  };

  const isRealAdmin = user.role === 'admin' && !isSimulating;
  
  const conversionSequences = sequences.filter(s => s.type === 'conversion' || !s.type);
  const nurturingSequences = sequences.filter(s => s.type === 'nurturing');

  const isAtLimitConversion = !isRealAdmin && conversionSequences.length >= maxConversionSequences;
  const isAtLimitNurturing = !isRealAdmin && nurturingSequences.length >= maxNurturingSequences;

  const usagePercentConversion = maxConversionSequences > 0 ? Math.min(100, (conversionSequences.length / maxConversionSequences) * 100) : 0;
  const usagePercentNurturing = maxNurturingSequences > 0 ? Math.min(100, (nurturingSequences.length / maxNurturingSequences) * 100) : 0;

  const getProgressColor = (percent: number) => {
    if (percent > 85) return isRealAdmin ? "bg-green-500" : "bg-red-500";
    if (percent > 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER DE SECCIÓN */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A1F]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.2em] shadow-sm">
                      <Mail className="w-3 h-3" /> Sistema de Email Marketing Profesional
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                      Crea Campañas de Email Marketing Profesionales <span className="text-[#FF5A1F]">para incrementar tus Ventas</span>
                  </h1>
                  <p className="text-white pt-[0.8em] pb-[0.6em] text-[1.2rem] max-w-2xl leading-[1.625] font-medium">
                      Activa secuencias de correos estratégicas que trabajan por ti 24/7. Nutre a tus prospectos, elimina sus objeciones y guíalos paso a paso hasta la compra, sin necesidad de estar presente.
                  </p>
                  
                  {/* Barra de Límite de Secuencias Premium - Sincronizada con MyPages */}
                  <div className="pt-4 max-w-md mx-auto md:mx-0">
                      <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-inner space-y-4">
                          {/* Contador Conversión */}
                          <div>
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Secuencia de Emails de Conversión</span>
                                  <span className="text-white font-bold">{conversionSequences.length} / {isRealAdmin ? '∞' : maxConversionSequences}</span>
                              </div>
                              <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                  <div 
                                    className={`h-full transition-all duration-1000 ease-out shadow-lg ${getProgressColor(usagePercentConversion)}`} 
                                    style={{ width: `${isRealAdmin ? (conversionSequences.length > 0 ? 100 : 0) : usagePercentConversion}%` }}
                                  ></div>
                              </div>
                              {isAtLimitConversion && (
                                  <div className="mt-2 flex items-start gap-2 text-[10px] text-yellow-300 bg-yellow-900/20 p-2 rounded-lg border border-yellow-700/30">
                                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                      <span>Límite de Conversión alcanzado.</span>
                                  </div>
                              )}
                          </div>

                          {/* Contador Nutrición */}
                          <div>
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Secuencia de Emails de Nutrición</span>
                                  <span className="text-white font-bold">{nurturingSequences.length} / {isRealAdmin ? '∞' : maxNurturingSequences}</span>
                              </div>
                              <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                  <div 
                                    className={`h-full transition-all duration-1000 ease-out shadow-lg ${getProgressColor(usagePercentNurturing)}`} 
                                    style={{ width: `${isRealAdmin ? (nurturingSequences.length > 0 ? 100 : 0) : usagePercentNurturing}%` }}
                                  ></div>
                              </div>
                              {isAtLimitNurturing && (
                                  <div className="mt-2 flex items-start gap-2 text-[10px] text-yellow-300 bg-yellow-900/20 p-2 rounded-lg border border-yellow-700/30">
                                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                      <span>Límite de Nutrición alcanzado.</span>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>

              <div className="shrink-0 flex flex-col gap-6 w-full md:w-[400px]">
                  {/* Contenedor de Video Interactivo */}
                  <div 
                      className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                  >
                      <iframe 
                          className="w-full h-full rounded-2xl"
                          src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                          title="Video Tutorial" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                      ></iframe>
                  </div>

                  {/* Botones centrados debajo del video */}
                  <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          setActiveTab('conversion');
                          setWizardType('conversion');
                          setShowProjectSelection(true);
                        }}
                        className="w-full px-8 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform active:scale-[0.98]"
                      >
                        <Plus className="w-4 h-4" /> Crear Secuencia de Conversión
                      </button>
                      
                      <button 
                        onClick={() => {
                          setActiveTab('nurturing');
                          setWizardType('nurturing');
                          setShowProjectSelection(true);
                        }}
                        className="w-full px-8 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform active:scale-[0.98]"
                      >
                        <Plus className="w-4 h-4" /> Crear Secuencia de Nutrición
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* NAVEGACIÓN POR PESTAÑAS */}
      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-2">
          <button 
              onClick={() => { setActiveTab('conversion'); setShowProjectSelection(false); setIsWizardOpen(false); }}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'conversion' ? 'text-[#FF5A1F]' : 'text-gray-500 hover:text-white'}`}
          >
              <LayoutTemplate className="w-4 h-4" /> Secuencia de Conversión
              {activeTab === 'conversion' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF5A1F] rounded-full shadow-[0_0_10px_rgba(255,90,31,0.5)]"></div>}
          </button>
          <button 
              onClick={() => { setActiveTab('nurturing'); setShowProjectSelection(false); setIsWizardOpen(false); }}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'nurturing' ? 'text-[#FF5A1F]' : 'text-gray-500 hover:text-white'}`}
          >
              <Mail className="w-4 h-4" /> Emails de Nutrición
              {activeTab === 'nurturing' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF5A1F] rounded-full shadow-[0_0_10px_rgba(255,90,31,0.5)]"></div>}
          </button>
          <button 
              onClick={() => { setActiveTab('leads'); setIsWizardOpen(false); }}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'leads' ? 'text-[#FF5A1F]' : 'text-gray-500 hover:text-white'}`}
          >
              <Users className="w-4 h-4" /> Leads
              {activeTab === 'leads' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF5A1F] rounded-full shadow-[0_0_10px_rgba(255,90,31,0.5)]"></div>}
          </button>
          <button 
              onClick={() => { setActiveTab('config'); setIsWizardOpen(false); }}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'config' ? 'text-[#FF5A1F]' : 'text-gray-500 hover:text-white'}`}
          >
              <Settings className="w-4 h-4" /> Configuración
              {activeTab === 'config' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF5A1F] rounded-full shadow-[0_0_10px_rgba(255,90,31,0.5)]"></div>}
          </button>
      </div>

      {/* CONTENIDO DE PESTAÑAS */}
      <div className="animate-in fade-in duration-500">
            {/* PESTAÑA: SECUENCIAS */}
            {(activeTab === 'conversion' || activeTab === 'nurturing') && (
            <div className="space-y-8 animate-in slide-in-from-left-4">
                {isWizardOpen && wizardType === activeTab ? (
                  <EmailSequenceWizard 
                    type={wizardType}
                    onClose={() => {
                      setIsWizardOpen(false);
                      setSearchParams({}); // Clear params when closing
                      loadSequences(); // Refresh list
                    }} 
                  />
                ) : (
                  <>
                    {loadingSequences ? (
                    <div className="flex justify-center p-20 text-[#FF5A1F]"><Loader2 className="w-12 h-12 animate-spin" /></div>
                ) : showProjectSelection ? (
                    <div className="mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative max-w-5xl animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-[#FF5A1F]/10 p-8 text-center border-b border-[#FF5A1F]/10 relative">
                            <button 
                                onClick={() => setShowProjectSelection(false)} 
                                className="absolute top-6 left-6 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                                <Mail className="w-8 h-8 text-[#FF5A1F]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Asistente de Secuencias de Email</h2>
                            <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#FF5A1F] text-white">0. Proyecto</span>
                                <div className="w-4 h-px bg-gray-700"></div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-800 text-gray-500">1. Configuración</span>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 flex-1 overflow-y-auto relative">
                            <div className="space-y-12 text-center flex flex-col items-center">
                                <div className="max-w-2xl mx-auto">
                                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">
                                            Selecciona el proyecto para crear tu estrategia de {activeTab === 'conversion' ? 'Conversión' : 'Nutrición'}
                                        </span>
                                    </h2>
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                        Para redactar correos que cierren ventas, nuestra IA necesita leer tu estrategia maestra. Selecciona un proyecto para visualizar su secuencia de 7 días.
                                    </p>
                                </div>

                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                                    {projects.length > 0 ? (
                                        <>
                                            {/* CARD: CREAR NUEVO PROYECTO */}
                                            <div 
                                                className="p-10 bg-[#0B0B0B] border-2 border-dashed border-white/10 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-center group flex flex-col items-center justify-center shadow-2xl relative overflow-hidden h-full cursor-pointer min-h-[400px]" 
                                                onClick={() => navigate('/dashboard/projects')}
                                            >
                                                <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-all shadow-lg mb-6">
                                                    <Plus className="w-10 h-10" />
                                                </div>
                                                <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors uppercase tracking-tight">Crear Nuevo Proyecto</h4>
                                                <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Define un nuevo nicho para generar ganchos</p>
                                            </div>

                                            {projects.map((project) => (
                                                <div 
                                                    key={project.id}
                                                    className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full"
                                                >
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="flex items-center gap-5 mb-8">
                                                        <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors shadow-inner">
                                                            <Briefcase className="w-8 h-8" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors">{project.name}</h4>
                                                            <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 mb-10">
                                                        <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-3">Descripción del Proyecto</p>
                                                        <p className="text-gray-400 text-lg leading-relaxed font-medium">{project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción.")}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            setWizardType(activeTab === 'nurturing' ? 'nurturing' : 'conversion');
                                                            setSearchParams({ projectId: project.id });
                                                            setIsWizardOpen(true);
                                                            setShowProjectSelection(false);
                                                        }}
                                                        className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95"
                                                    >
                                                        Seleccionar <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="md:col-span-3 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[2rem] text-center">
                                            <p className="text-gray-500 mb-6">Aún no tienes proyectos creados con estrategia.</p>
                                            <button 
                                                onClick={() => navigate('/dashboard/projects/create')}
                                                className="px-8 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20"
                                            >
                                                Crear mi primer proyecto
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : sequences.filter(s => activeTab === 'conversion' ? (s.type === 'conversion' || !s.type) : s.type === 'nurturing').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tarjeta de añadir nueva */}
                        <button 
                            onClick={() => {
                              setWizardType(activeTab === 'nurturing' ? 'nurturing' : 'conversion');
                              setShowProjectSelection(true);
                            }}
                            className="bg-gray-900 border-2 border-dashed border-white/20 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 group hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/5 transition-all duration-500 min-h-[400px]"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-all">
                                <Plus className="w-10 h-10" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-bold transition-colors" style={{ color: 'white', fontSize: '2em' }}>Crear Nueva Secuencia</h4>
                                <p className="mt-2 font-medium" style={{ color: 'gray', paddingTop: '1em', fontSize: '1.2em' }}>Vincula un nuevo proyecto para automatizar ventas</p>
                            </div>
                        </button>
                        {sequences.filter(s => activeTab === 'conversion' ? (s.type === 'conversion' || !s.type) : s.type === 'nurturing').map(seq => (
                            <div key={seq.id} className="bg-[#111] rounded-[2.5rem] border border-white/5 p-6 hover:border-[#FF5A1F]/30 transition-all duration-300 group flex flex-col shadow-2xl relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <div className="bg-white/5 text-white text-[0.8em] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit border border-white/5 font-black uppercase tracking-widest mb-4">
                                            <Calendar className="w-3 h-3" />
                                            {seq.createdAt.toLocaleDateString()}
                                        </div>
                                        <Link 
                                            to={`/dashboard/projects/${seq.projectId}/strategy`}
                                            target="_blank"
                                            className="text-2xl font-black text-white hover:text-[#FF5A1F] transition-colors leading-tight block"
                                        >
                                            {seq.projectName}
                                        </Link>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => handleDeleteSequence(seq, e)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                            title="Eliminar Secuencia"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            <span className="text-xs font-bold">Eliminar</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                                        <p className="text-[0.9em] font-black text-gray-500 uppercase tracking-widest mb-4">Progreso de la Estrategia (7 Días)</p>
                                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
                                            {[0, 1, 2, 3, 4, 5, 6].map(day => (
                                                <div 
                                                    key={day} 
                                                    onClick={() => {
                                                      navigate(`/dashboard/projects/${seq.projectId}/strategy?section=email&day=${day}&type=${seq.type || 'conversion'}`);
                                                    }}
                                                    className={`flex-1 h-10 rounded-lg transition-all duration-500 flex items-center justify-center cursor-pointer hover:opacity-80 active:scale-95 min-w-[60px] ${seq.generatedDays.includes(day) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-gray-800'}`}
                                                >
                                                    <span className="text-[10px] font-black text-white px-1 text-center leading-tight">Día {day + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones de la Tarjeta */}
                                <div className="flex flex-col gap-3 mt-10">
                                    <button 
                                        onClick={() => {
                                          setWizardType(seq.type || 'conversion');
                                          setSearchParams({ projectId: seq.projectId });
                                          setIsWizardOpen(true);
                                        }}
                                        className="w-full py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <Edit3 className="w-5 h-5" /> Ver / Editar Correos Electronicos
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#111] p-20 rounded-[3rem] border border-white/5 text-center space-y-8 animate-in zoom-in-95 duration-700">
                        <div className="w-24 h-24 bg-[#FF5A1F]/10 rounded-[2rem] flex items-center justify-center text-[#FF5A1F] mx-auto border border-[#FF5A1F]/20 shadow-lg shadow-[#FF5A1F]/10">
                            <Mail className="w-12 h-12" />
                        </div>
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Tu Ecosistema de Email está en blanco</h3>
                            <p className="text-gray-400 font-medium text-lg mt-4 leading-relaxed">
                                Aún no has configurado ninguna secuencia de cierre. La IA puede redactar 7 días de correos persuasivos basados en tu proyecto para ayudarte a vender en automático.
                            </p>
                        </div>
                        <button 
                            onClick={() => {
                              setWizardType(activeTab === 'nurturing' ? 'nurturing' : 'conversion');
                              setShowProjectSelection(true);
                            }}
                            className="px-12 py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-lg uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-[#FF5A1F]/20 transform hover:scale-105 active:scale-95"
                        >
                            Crear mi primera secuencia
                        </button>
                    </div>
                )}
              </>
            )}
            </div>
        )}

        {/* PESTAÑA: LEADS */}
        {activeTab === 'leads' && (
            <div className="bg-[#111] rounded-[2.5rem] shadow-xl border border-white/5 overflow-hidden animate-in slide-in-from-left-4">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-black/20">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Prospectos Capturados</h2>
                        <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Historial de registros de tus landing pages</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <button 
                            onClick={handleManualSyncTrigger}
                            disabled={syncing || loadingLeads}
                            className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-[#FF5A1F]/10 hover:border-[#FF5A1F]/50 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {syncing ? <Loader2 className="w-4 h-4 animate-spin text-[#FF5A1F]" /> : <RefreshCw className="w-4 h-4 text-[#FF5A1F]" />}
                            Sincronización Masiva
                        </button>
                        <button
                            onClick={loadLeads}
                            disabled={loadingLeads}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest transition-all"
                        >
                            {loadingLeads ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            Actualizar
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="p-6">Prospecto</th>
                                <th className="p-6">Email</th>
                                <th className="p-6">Origen</th>
                                <th className="p-6 text-center">Estado Systeme.io</th>
                                <th className="p-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leads.length > 0 ? leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6 text-white font-bold">{lead.name}</td>
                                    <td className="p-6 text-gray-400 font-medium">{lead.email}</td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase border border-blue-500/20">{lead.sourcePage}</span>
                                    </td>
                                    <td className="p-6 text-center">
                                        {lead.synced ? (
                                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                                <CheckCircle className="w-3 h-3" /> Sincronizado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-orange-400 text-[10px] font-black uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                                                <RefreshCw className="w-3 h-3" /> Pendiente
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        {!lead.synced && (
                                            <button 
                                                onClick={() => openTagSelector(lead)}
                                                className="p-2.5 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F] text-[#FF5A1F] hover:text-white border border-[#FF5A1F]/30 rounded-lg transition-all"
                                                title="Enviar a Systeme.io"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-gray-600 font-medium italic">
                                        {loadingLeads ? "Cargando prospectos..." : "Aún no has recibido ningún lead."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* PESTAÑA: CONFIGURACIÓN */}
        {activeTab === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-left-4">
                {/* Bloque: API Key */}
                <div className="bg-[#111] p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden flex flex-col h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Zap className="w-32 h-32 text-[#FF5A1F]" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#FF5A1F]/10 rounded-2xl flex items-center justify-center text-[#FF5A1F] border border-[#FF5A1F]/20">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Conexión API</h2>
                            <p className="text-sm text-gray-500 font-medium">Vincula tu cuenta de Systeme.io.</p>
                        </div>
                    </div>
                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">API Key Personal</label>
                            <div className="flex flex-col gap-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FF5A1F] transition-colors" />
                                    <input
                                        type="password"
                                        value={systemeIoKey}
                                        onChange={(e) => setSystemeIoKey(e.target.value)}
                                        placeholder="Introduce tu API Key de Systeme.io"
                                        className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#FF5A1F] outline-none transition"
                                        disabled={loadingSettings || savingKey}
                                    />
                                </div>
                                <button 
                                    onClick={handleSaveKey}
                                    disabled={savingKey || loadingSettings}
                                    className="w-full py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {savingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Vincular Cuenta
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                Puedes encontrar tu clave en Systeme.io &gt; Configuración &gt; Configuración de la API pública.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bloque: Gestión de Etiquetas */}
                <div className="bg-[#111] p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden flex flex-col h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-purple-500">
                        <Tag className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                            <Tag className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Etiquetas (Tags)</h2>
                            <p className="text-sm text-gray-500 font-medium">Gestiona tus etiquetas de Systeme.io.</p>
                        </div>
                    </div>
                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nueva Etiqueta</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="Ej: Lead Microblading"
                                    className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition"
                                />
                                <button 
                                    onClick={handleCreateTag} 
                                    disabled={isCreatingTag || !newTagName.trim() || !systemeIoKey}
                                    className="p-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {isCreatingTag ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Listado Actual</label>
                            <div className="max-h-[120px] overflow-y-auto custom-scrollbar pr-2 flex flex-wrap gap-2">
                                {loadingTags ? (
                                    <div className="w-full flex items-center gap-2 text-gray-600 italic text-xs py-2">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Cargando...
                                    </div>
                                ) : tags.length > 0 ? (
                                    tags.map(tag => (
                                        <span key={tag.id} className="px-3 py-1.5 bg-purple-900/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                            <Tag className="w-3 h-3" /> {tag.name}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-600 italic text-xs py-2">No se detectaron etiquetas.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* MODAL DE SELECCIÓN DE ETIQUETA */}
      {showTagModal && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !syncingSingle && !syncing && setShowTagModal(false)}
          >
              <div 
                className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                  {modalStep === 'selection' && (
                      <>
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#FF5A1F]/10 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FF5A1F]/20 rounded-2xl flex items-center justify-center text-[#FF5A1F] shadow-[0_0_20px_rgba(255,90,31,0.2)]">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Sincronización</h3>
                                    <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">Vincula una Etiqueta</p>
                                </div>
                            </div>
                            <button onClick={() => setShowTagModal(false)} disabled={syncingSingle || syncing} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            {syncMode === 'single' && selectedLeadForSync && (
                                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Prospecto</p>
                                    <p className="text-white font-bold">{selectedLeadForSync.email}</p>
                                </div>
                            )}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><List className="w-4 h-4 text-[#FF5A1F]" /> 1. Elige la Etiqueta</h4>
                                <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                    {loadingTags ? (
                                        <div className="py-12 flex flex-col items-center gap-3 text-gray-500"><Loader2 className="w-8 h-8 animate-spin" /><p className="text-xs font-bold uppercase tracking-widest">Consultando Systeme.io...</p></div>
                                    ) : tags.length > 0 ? (
                                        tags.map(tag => (
                                            <button 
                                                key={tag.id}
                                                onClick={() => syncMode === 'single' ? handleSingleSync(tag.id) : executeBulkSync(tag.id)}
                                                disabled={syncingSingle || syncing}
                                                className="w-full text-left p-4 rounded-xl border border-white/5 bg-black hover:bg-[#FF5A1F]/5 hover:border-[#FF5A1F]/30 transition-all group flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="text-white font-bold group-hover:text-[#FF5A1F] transition-colors">{tag.name}</p>
                                                    <p className="text-[10px] text-gray-600 uppercase font-bold">Enviar a esta etiqueta</p>
                                                </div>
                                                <Send className="w-4 h-4 text-gray-700 group-hover:text-[#FF5A1F] transition-all" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-8 px-4 text-center border border-dashed border-red-500/30 rounded-2xl bg-red-500/5">
                                            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                                            <p className="text-gray-500 text-xs leading-relaxed">No tienes etiquetas creadas. Es necesario asignar una etiqueta para disparar automatizaciones.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Plus className="w-4 h-4 text-purple-400" /> 2. O Crea una Nueva</h4>
                                <div className="flex gap-2">
                                    <input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="Nombre..." className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition text-sm" />
                                    <button onClick={handleCreateTag} disabled={isCreatingTag || !newTagName.trim()} className="px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">Crear</button>
                                </div>
                            </div>
                        </div>
                      </>
                  )}
                  {modalStep === 'success' && (
                      <div className="animate-in zoom-in-95 duration-500 flex flex-col">
                          <div className="p-10 text-center space-y-6">
                              <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                  <CheckCircle className="w-12 h-12" />
                              </div>
                              <h2 className="text-3xl font-black text-white tracking-tight uppercase">¡Éxito!</h2>
                              <p className="text-gray-400 font-medium">Los datos se han enviado correctamente a Systeme.io.</p>
                          </div>
                          <div className="px-8 pb-10 space-y-8">
                              <div className="bg-blue-600/10 border border-blue-500/30 rounded-[2rem] overflow-hidden">
                                  <div className="p-6 bg-blue-600/20 border-b border-blue-500/20 flex items-center gap-4">
                                      <Play className="w-5 h-5 text-blue-400 fill-current" />
                                      <h4 className="text-white font-black text-sm uppercase tracking-widest">Siguiente Paso: Automatización</h4>
                                  </div>
                                  <div className="p-6 space-y-4">
                                      <p className="text-gray-300 text-xs leading-relaxed">Recuerda ir a <span className="text-white font-bold">Systeme.io &gt; Reglas de Automatización</span> para configurar que al añadir esta etiqueta, el contacto se inscriba a tu campaña de email.</p>
                                      <button onClick={() => setShowTagModal(false)} className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all shadow-xl">Entendido</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {showVideoModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-[#FF5A1F]" /> Tutorial: Email Marketing
                    </h3>
                    <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                <div className="aspect-video w-full">
                    <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                        title="Tutorial Email Marketing" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="p-6 bg-gray-900">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Aprende cómo utilizar nuestra inteligencia artificial para redactar secuencias de correos que conviertan prospectos en clientes finales utilizando gatillos mentales probados.
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* MODAL RESTRICCIÓN DE ELIMINACIÓN */}
      <DeletionRestrictionModal 
          isOpen={showRestrictionModal} 
          onClose={() => setShowRestrictionModal(false)}
          itemName={sequenceToRestrict ? `Secuencia Email: ${sequenceToRestrict.projectName}` : ''}
          userEmail={user.email}
          userName={user.name}
      />
    </div>
  );
};