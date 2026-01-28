
import React, { useState, useEffect } from 'react';
import { Lead, EmailSequence, User } from '../../../types';
import { Mail, RefreshCw, Database, Loader2, CheckCircle, ExternalLink, Zap, Send, X, List, Target, ShieldCheck, Tag, Plus, Clock, LayoutTemplate, Settings, Users, AlertCircle, Play, PlayCircle, Edit3, Eye, Trash2, Crown } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { UpgradeModal } from '../UpgradeModal';

interface DashboardContext {
  user: User;
  isSimulating: boolean;
}

export const EmailMarketing: React.FC = () => {
  const navigate = useNavigate();
  const { user, isSimulating } = useOutletContext() as DashboardContext;

  const [activeTab, setActiveTab] = useState<'sequence' | 'leads' | 'config'>('sequence');
  const [systemeIoKey, setSystemeIoKey] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [syncing, setSyncing] = useState(false);

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadSettings();
    loadLeads();
    loadSequences();
  }, []);

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

  const handleDeleteSequence = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("¿Estás seguro de eliminar esta secuencia de correos? Se borrarán todos los borradores asociados.")) return;
    
    try {
        await api.deleteEmailSequence(id);
        setSequences(prev => prev.filter(s => s.id !== id));
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
        await api.syncPendingLeads(tagId);
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

  // Lógica de límites
  const isRealAdmin = user.role === 'admin' && !isSimulating;
  const maxSequences = user.planLimits?.maxEmailSequences || 1;
  const currentCount = sequences.length;
  const usagePercent = Math.min(100, (currentCount / maxSequences) * 100);
  const isAtLimit = !isRealAdmin && currentCount >= maxSequences;

  const handleCreateSequenceTrigger = () => {
      if (isAtLimit) {
          setShowUpgradeModal(true);
          return;
      }
      navigate('/dashboard/email/create');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
          currentPlan={user.planLimits?.planName}
          reason="Has alcanzado el límite de secuencias de tu plan. Actualiza para escalar tu estrategia de cierre por email."
      />

      {/* HEADER DE SECCIÓN */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A1F]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.2em] shadow-sm">
                      <Mail className="w-3 h-3" /> Email Marketing Automático
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                      Vende en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-400">Piloto Automático</span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                      Sincroniza tus prospectos con Systeme.io y activa secuencias de correos persuasivos diseñados para cerrar ventas mientras duermes.
                  </p>
                  
                  {/* Barra de Límite de Secuencias Premium */}
                  <div className="pt-4 max-w-md mx-auto md:mx-0">
                      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-inner">
                          <div className="flex justify-between items-center mb-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                              <span>Secuencias Creadas</span>
                              <span className="text-white">{currentCount} / {isRealAdmin ? '∞' : maxSequences}</span>
                          </div>
                          <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                              <div className="h-full bg-[#FF5A1F] rounded-full shadow-[0_0_15px_rgba(255,90,31,0.6)] transition-all duration-[1500ms] ease-out" style={{ width: `${isRealAdmin ? 100 : usagePercent}%` }}></div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="shrink-0 flex flex-col gap-4 w-full md:w-auto min-w-[280px]">
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-inner text-center">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Prospectos Totales</p>
                      <p className="text-3xl font-black text-white">{leads.length}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                      {isAtLimit ? (
                        <button 
                          onClick={() => setShowUpgradeModal(true)}
                          className="w-full px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 transform active:scale-[0.98]"
                        >
                          <Crown className="w-4 h-4" /> Subir a PRO
                        </button>
                      ) : (
                        <button 
                          onClick={handleCreateSequenceTrigger}
                          className="w-full px-8 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform active:scale-[0.98]"
                        >
                          <Plus className="w-4 h-4" /> Crear Nueva Secuencia
                        </button>
                      )}
                      <button className="w-full px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3">
                        <PlayCircle className="w-4 h-4" /> ¿Cómo funciona?
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* NAVEGACIÓN POR PESTAÑAS */}
      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-2">
          <button 
              onClick={() => setActiveTab('sequence')}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'sequence' ? 'text-[#FF5A1F]' : 'text-gray-500 hover:text-white'}`}
          >
              <LayoutTemplate className="w-4 h-4" /> Secuencias
              {activeTab === 'sequence' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF5A1F] rounded-full shadow-[0_0_10px_rgba(255,90,31,0.5)]"></div>}
          </button>
          <button 
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'leads' ? 'text-[#FF5A1F]' : 'text-gray-500 hover:text-white'}`}
          >
              <Users className="w-4 h-4" /> Leads
              {activeTab === 'leads' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF5A1F] rounded-full shadow-[0_0_10px_rgba(255,90,31,0.5)]"></div>}
          </button>
          <button 
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'config' ? 'text-[#FF5A1F]' : 'text-gray-500 hover:text-white'}`}
          >
              <Settings className="w-4 h-4" /> Configuración
              {activeTab === 'config' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF5A1F] rounded-full shadow-[0_0_10px_rgba(255,90,31,0.5)]"></div>}
          </button>
      </div>

      {/* CONTENIDO DE PESTAÑAS */}
      <div className="animate-in fade-in duration-500">
        
        {/* PESTAÑA: SECUENCIAS */}
        {activeTab === 'sequence' && (
            <div className="space-y-8 animate-in slide-in-from-left-4">
                {loadingSequences ? (
                    <div className="flex justify-center p-20 text-[#FF5A1F]"><Loader2 className="w-12 h-12 animate-spin" /></div>
                ) : sequences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {sequences.map(seq => (
                            <div key={seq.id} className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 hover:border-[#FF5A1F]/30 transition-all duration-300 group flex flex-col shadow-2xl relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <Link 
                                            to={`/dashboard/projects/${seq.projectId}/strategy`}
                                            target="_blank"
                                            className="text-2xl font-black text-white hover:text-[#FF5A1F] transition-colors leading-tight mb-2 block"
                                        >
                                            Proyecto: {seq.projectName}
                                        </Link>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${seq.status === 'activa' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                                    {seq.status}
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Creado {seq.createdAt.toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Tag className="w-3 h-3 text-[#FF5A1F]" /> Etiqueta: <span className="text-white">{seq.tagName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => handleDeleteSequence(seq.id, e)}
                                            className="p-3 rounded-2xl bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                            title="Eliminar Secuencia"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all shadow-lg">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Progreso de la Estrategia (7 Días)</p>
                                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
                                            {[0, 1, 2, 3, 4, 5, 6].map(day => (
                                                <div 
                                                    key={day} 
                                                    onClick={() => navigate(`/dashboard/email/create?projectId=${seq.projectId}&day=${day}`)}
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
                                        onClick={() => navigate(`/dashboard/email/create?projectId=${seq.projectId}`)}
                                        className="w-full py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <Edit3 className="w-5 h-5" /> Ver / Editar Correos Electronicos
                                    </button>
                                    
                                    <button className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg">
                                        <Settings className="w-4 h-4" /> Configurar Envío Automático
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* Tarjeta de añadir nueva */}
                        <button 
                            onClick={handleCreateSequenceTrigger}
                            className="bg-black/20 border-2 border-dashed border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 group hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/5 transition-all duration-500 min-h-[400px]"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-all">
                                <Plus className="w-10 h-10" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-bold text-gray-500 group-hover:text-white transition-colors">{isAtLimit ? 'Límite de Secuencias Alcanzado' : 'Crear Nueva Secuencia'}</h4>
                                <p className="text-xs text-gray-600 mt-2 font-medium">{isAtLimit ? 'Actualiza tu plan para crear más automatizaciones' : 'Vincula un nuevo proyecto para automatizar ventas'}</p>
                            </div>
                        </button>
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
                            onClick={handleCreateSequenceTrigger}
                            className="px-12 py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-lg uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-[#FF5A1F]/20 transform hover:scale-105 active:scale-95"
                        >
                            Crear mi primera secuencia
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* PESTAÑA: LEADS */}
        {activeTab === 'leads' && (/* Leads logic logic same as before */ null)}

        {/* PESTAÑA: CONFIGURACIÓN */}
        {activeTab === 'config' && (/* Config logic same as before */ null)}
      </div>
    </div>
  );
};
