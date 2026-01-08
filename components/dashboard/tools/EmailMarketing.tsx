
import React, { useState, useEffect } from 'react';
import { Lead } from '../../../types';
import { Mail, RefreshCw, Database, Loader2, CheckCircle, ExternalLink, Zap, Send, X, List, Target, ShieldCheck, Tag, Plus, Clock, LayoutTemplate, Settings, Users, AlertCircle, Play } from 'lucide-react';
import { api } from '../../../services/api';

export const EmailMarketing: React.FC = () => {
  /* */ /* Actualización: Implementación de Header premium y sistema de pestañas (Secuencia, Leads, Configuración) para organizar las herramientas de Email Marketing - 01/01/2026 16:00 */
  
  const [activeTab, setActiveTab] = useState<'sequence' | 'leads' | 'config'>('sequence');
  const [systemeIoKey, setSystemeIoKey] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedLeadForSync, setSelectedLeadForSync] = useState<Lead | null>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [syncingSingle, setSyncingSingle] = useState(false);
  const [syncMode, setSyncMode] = useState<'single' | 'bulk'>('single');
  const [modalStep, setModalStep] = useState<'selection' | 'success'>('selection');
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  useEffect(() => {
    loadSettings();
    loadLeads();
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

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
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
              </div>
              <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-inner text-center">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Prospectos Totales</p>
                      <p className="text-3xl font-black text-white">{leads.length}</p>
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
                <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 text-center space-y-6">
                    <div className="w-20 h-20 bg-[#FF5A1F]/10 rounded-3xl flex items-center justify-center text-[#FF5A1F] mx-auto border border-[#FF5A1F]/20">
                        <Clock className="w-10 h-10" />
                    </div>
                    <div className="max-w-xl mx-auto">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Secuencias Inteligentes de 7 Días</h3>
                        <p className="text-gray-400 font-medium mt-2 leading-relaxed">Aquí podrás gestionar las secuencias automáticas generadas para tus proyectos. Pronto podrás editarlas y enviarlas directamente a tu plataforma de email marketing.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-4">
                        {[1, 2, 3, 4, 5, 6, 7].map(day => (
                            <div key={day} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center group hover:border-[#FF5A1F]/30 transition-all opacity-40">
                                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-[10px] font-black text-gray-500 mb-4 group-hover:bg-[#FF5A1F]/20 group-hover:text-[#FF5A1F]">DÍA {day}</div>
                                <div className="w-full h-2 bg-gray-800 rounded-full mb-2"></div>
                                <div className="w-2/3 h-2 bg-gray-800 rounded-full"></div>
                            </div>
                        ))}
                        <div className="bg-[#FF5A1F]/5 p-6 rounded-2xl border border-dashed border-[#FF5A1F]/30 flex flex-col items-center justify-center text-[#FF5A1F] opacity-60">
                            <Plus className="w-8 h-8 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Nueva Secuencia</p>
                        </div>
                    </div>
                </div>
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
                        {/* */ /* Actualización: Corrección de caracteres '>' por '&gt;' para evitar errores de compilación TS1382 - 24/05/2024 18:00 */ }
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
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nueva Etiqueta</label>
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
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Listado Actual</label>
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
                                      {/* */ /* Actualización: Corrección de caracteres '>' por '&gt;' para evitar errores de compilación TS1382 - 24/05/2024 18:00 */ }
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
    </div>
  );
};
