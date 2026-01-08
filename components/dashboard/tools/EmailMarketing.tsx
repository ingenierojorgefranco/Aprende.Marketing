import React, { useState, useEffect } from 'react';
import { Lead } from '../../../types';
import { Mail, RefreshCw, Database, Loader2, CheckCircle, ExternalLink, Zap, Send, X, List, Target, ShieldCheck, ChevronRight, Tag, Plus, Play, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';

export const EmailMarketing: React.FC = () => {
  ////////// Actualización: Integración de Systeme.io en la interfaz de usuario - 07/06/2025 19:30 //////////
  const [systemeIoKey, setSystemeIoKey] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  ////////// Actualización: Estado para sincronización manual de leads pendientes - 07/06/2025 19:40 //////////
  const [syncing, setSyncing] = useState(false);
  ////////// Fin de actualización - 07/06/2025 19:40 //////////

  ////////// Actualización: Estado para seguimiento de sincronización individual y selección de etiquetas (Tags) - 17/06/2025 11:30 //////////
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedLeadForSync, setSelectedLeadForSync] = useState<Lead | null>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [syncingSingle, setSyncingSingle] = useState(false);
  /* Actualización: Estado para modo de sincronización (masiva o individual) y paso de éxito educativo - 30/06/2025 15:30 */
  const [syncMode, setSyncMode] = useState<'single' | 'bulk'>('single');
  const [modalStep, setModalStep] = useState<'selection' | 'success'>('selection');
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  ////////// Fin de actualización - 17/06/2025 11:30 //////////

  /* */ /* Reparación: Sincronización de carga de etiquetas para asegurar visualización inmediata tras recuperación de API Key de la base de datos - 30/06/2025 16:00 */
  useEffect(() => {
    loadSettings();
    loadLeads();
  }, []);

  // Efecto reactivo para cargar etiquetas cuando la clave esté disponible
  useEffect(() => {
    if (systemeIoKey) {
        loadTags();
    }
  }, [systemeIoKey]);
  /* Fin de reparación - 30/06/2025 16:00 */

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

  /* Actualización: La sincronización manual masiva ahora abre primero el selector de etiquetas obligatorio - 30/06/2025 15:30 */
  ////////// Actualización: Función para disparar la sincronización manual masiva con logs detallados - 07/06/2025 20:15 //////////
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
        console.log("[Mass Sync Success]:", res);
        setModalStep('success');
        loadLeads();
    } catch (e: any) {
        console.error("[FULL SYNC ERROR OBJECT]:", e);
        alert("Error durante la sincronización: " + (e.message || "Error desconocido. Revisa la consola (F12) para más detalles."));
    } finally {
        setSyncing(false);
    }
  };
  ////////// Fin de actualización - 07/06/2025 19:40 //////////

  ////////// Actualización: Función para abrir modal de selección de etiqueta (Tag) individual - 17/06/2025 11:30 //////////
  const openTagSelector = async (lead: Lead) => {
    if (!systemeIoKey) {
        alert("Configura primero tu API Key de Systeme.io arriba.");
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
        const res = await api.syncSingleLead(selectedLeadForSync.id, tagId);
        console.log("[Single Sync Success]:", res);
        // Actualizamos localmente el lead enviado
        setLeads(prev => prev.map(l => l.id === selectedLeadForSync.id ? { ...l, synced: true } : l));
        setModalStep('success');
    } catch (e: any) {
        console.error(`[SINGLE SYNC ERROR ID ${selectedLeadForSync.id}]:`, e);
        alert("Error al enviar el lead: " + (e.message || "Error desconocido"));
    } finally {
        setSyncingSingle(false);
    }
  };

  /* Actualización: Función para crear una etiqueta directamente desde la interfaz - 30/06/2025 15:30 */
  const handleCreateTag = async () => {
      if (!newTagName.trim()) return;
      setIsCreatingTag(true);
      try {
          await api.createSystemeIoTag(newTagName);
          setNewTagName('');
          await loadTags();
      } catch (e) {
          alert("Error al crear la etiqueta. Verifica tu conexión.");
      } finally {
          setIsCreatingTag(false);
      }
  };
  ////////// Fin de actualización - 17/06/2025 11:30 //////////

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Grid de Configuración Superior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloque 1: API Key */}
        <div className="bg-[#111] p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Zap className="w-32 h-32 text-[#FF5A1F]" />
            </div>
            
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#FF5A1F]/10 rounded-2xl flex items-center justify-center text-[#FF5A1F] border border-[#FF5A1F]/20">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">Configuración de API</h2>
                    <p className="text-sm text-gray-500 font-medium">Vincula tu cuenta de Systeme.io.</p>
                </div>
            </div>

            <div className="space-y-6 flex-1">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">API Key de Systeme.io</label>
                <div className="flex flex-col gap-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FF5A1F] transition-colors" />
                        <input
                            type="password"
                            value={systemeIoKey}
                            // Fix: Use setSystemeIoKey instead of the non-existent setValue function
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
                        Guardar API Key
                    </button>
                </div>
            </div>

            <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <ExternalLink className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    Busca tu API Key en Systeme.io &gt; Configuración &gt; Configuración de la API pública.
                </p>
            </div>
            </div>
        </div>

        {/* Bloque 2: Gestión de Etiquetas (NUEVO) - 30/06/2025 15:30 */}
        <div className="bg-[#111] p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-purple-500">
                <Tag className="w-32 h-32" />
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                    <Tag className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">Gestión de Etiquetas</h2>
                    <p className="text-sm text-gray-500 font-medium">Crea y visualiza tus tags de Systeme.io.</p>
                </div>
            </div>

            <div className="space-y-6 flex-1">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Crear Nueva Etiqueta</label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="Ej: Lanzamiento Enero"
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
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Etiquetas Actuales</label>
                    <div className="max-h-[120px] overflow-y-auto custom-scrollbar pr-2 flex flex-wrap gap-2">
                        {loadingTags ? (
                            <div className="w-full flex items-center gap-2 text-gray-600 italic text-xs py-2">
                                <Loader2 className="w-3 h-3 animate-spin" /> Cargando etiquetas...
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

      {/* Tabla de Leads */}
      <div className="bg-[#111] rounded-[2.5rem] shadow-xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-black/20">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Leads Capturados</h2>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Historial de registros del ecosistema</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* ////////// Actualización: Botón para Sincronización Manual de Leads Pendientes - 07/06/2025 19:40 ////////// */}
            <button 
                onClick={handleManualSyncTrigger}
                disabled={syncing || loadingLeads}
                className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-[#FF5A1F]/10 hover:border-[#FF5A1F]/50 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {syncing ? <Loader2 className="w-4 h-4 animate-spin text-[#FF5A1F]" /> : <RefreshCw className="w-4 h-4 text-[#FF5A1F]" />}
                Sincronizar Todos los Pendientes
            </button>
            <button
                onClick={loadLeads}
                disabled={loadingLeads}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest transition-all"
            >
                {loadingLeads ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Actualizar Lista
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="p-6">Nombre del Prospecto</th>
                <th className="p-6">Correo Electrónico</th>
                <th className="p-6">Página de Origen</th>
                <th className="p-6 text-center">Estado de Envío</th>
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
                        <CheckCircle className="w-3 h-3" /> Enviado a Systeme
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-orange-400 text-[10px] font-black uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                        <RefreshCw className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    {/* ////////// Actualización: Botón para abrir selector de etiqueta (Tag) individual - 17/06/2025 11:30 ////////// */}
                    {!lead.synced && (
                        <button 
                            onClick={() => openTagSelector(lead)}
                            className="p-2.5 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F] text-[#FF5A1F] hover:text-white border border-[#FF5A1F]/30 rounded-lg transition-all"
                            title="Seleccionar etiqueta y enviar a Systeme.io"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    )}
                    {/* ////////// Fin de actualización - 17/06/2025 11:30 ////////// */}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-600 font-medium italic">
                    {loadingLeads ? "Cargando prospectos..." : "Aún no has recibido ningún lead en tus Landing Pages."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ////////// Actualización: Modal Premium de Selección de Etiqueta (Tag) Rediseñado - 30/06/2025 15:30 ////////// */}
      {showTagModal && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !syncingSingle && !syncing && setShowTagModal(false)}
          >
              <div 
                className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                  {/* Modal Step 1: Selection */}
                  {modalStep === 'selection' && (
                      <>
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#FF5A1F]/10 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FF5A1F]/20 rounded-2xl flex items-center justify-center text-[#FF5A1F] shadow-[0_0_20px_rgba(255,90,31,0.2)]">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Vincular Etiqueta (Obligatorio)</h3>
                                    <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">Sincronización Inteligente</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowTagModal(false)} 
                                disabled={syncingSingle || syncing}
                                className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {syncMode === 'single' && selectedLeadForSync && (
                                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Prospecto seleccionado</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-bold">{selectedLeadForSync.name}</p>
                                        <p className="text-[#FF5A1F] font-medium text-sm">{selectedLeadForSync.email}</p>
                                    </div>
                                </div>
                            )}

                            {syncMode === 'bulk' && (
                                <div className="p-5 bg-orange-500/10 rounded-2xl border border-orange-500/20 space-y-2">
                                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Sincronización Masiva</p>
                                    <p className="text-white font-bold">Se enviarán todos los prospectos pendientes.</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <List className="w-4 h-4 text-[#FF5A1F]" /> 1. Elige la Etiqueta de Destino
                                </h4>
                                
                                <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                    {loadingTags ? (
                                        <div className="py-12 flex flex-col items-center gap-3 text-gray-500">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Consultando Systeme.io...</p>
                                        </div>
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
                                                    <p className="text-[10px] text-gray-600 uppercase font-bold">Seleccionar para enviar</p>
                                                </div>
                                                <Send className="w-4 h-4 text-gray-700 group-hover:text-[#FF5A1F] transition-all" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-8 px-4 text-center border border-dashed border-red-500/30 rounded-2xl bg-red-500/5">
                                            <div className="flex flex-col items-center gap-3 mb-4">
                                                <AlertCircle className="w-10 h-10 text-red-500" />
                                                <h4 className="text-white font-bold">Creación Urgente Necesaria</h4>
                                                <p className="text-gray-500 text-xs leading-relaxed">No tienes etiquetas creadas en Systeme.io. Es obligatorio asignar una etiqueta para disparar tus automatizaciones de marketing.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-purple-400" /> 2. O Crea una Nueva Etiqueta Ahora
                                </h4>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        placeholder="Nombre de la etiqueta..."
                                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition text-sm"
                                    />
                                    <button 
                                        onClick={handleCreateTag}
                                        disabled={isCreatingTag || !newTagName.trim()}
                                        className="px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-30"
                                    >
                                        {isCreatingTag ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sincronización Segura Activada
                            </div>
                        </div>
                      </>
                  )}

                  {/* Modal Step 2: Success Educational View */}
                  {modalStep === 'success' && (
                      <div className="animate-in zoom-in-95 duration-500 flex flex-col">
                          <div className="p-10 text-center space-y-6">
                              <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-emerald-500/20">
                                  <CheckCircle className="w-12 h-12" />
                              </div>
                              <div>
                                  <h2 className="text-3xl font-black text-white tracking-tight">¡Etiqueta Vinculada!</h2>
                                  <p className="text-gray-400 mt-2 font-medium">Tus prospectos han sido enviados correctamente.</p>
                              </div>
                          </div>

                          <div className="px-8 pb-10 space-y-8">
                              <div className="bg-blue-600/10 border border-blue-500/30 rounded-[2rem] overflow-hidden">
                                  <div className="p-6 bg-blue-600/20 border-b border-blue-500/20 flex items-center gap-4">
                                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                          <Play className="w-5 h-5 fill-current" />
                                      </div>
                                      <div className="text-left">
                                          <h4 className="text-white font-black text-sm uppercase tracking-widest">Paso Final: Configura tu Automatización</h4>
                                          <p className="text-blue-200/60 text-xs">Aprende a disparar tus campañas de email en Systeme.io</p>
                                      </div>
                                  </div>

                                  <div className="aspect-video bg-black relative group cursor-pointer overflow-hidden">
                                      {/* Video Placeholder con diseño Premium */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                      <img 
                                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop" 
                                        className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                                        alt="Tutorial Automatización"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center z-20">
                                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                              <Play className="w-6 h-6 text-black fill-current ml-1" />
                                          </div>
                                      </div>
                                      <div className="absolute bottom-6 left-6 right-6 z-20 text-left">
                                          <p className="text-white font-bold text-sm">Cómo crear la Regla de Automatización</p>
                                          <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Duración: 2:45 Minutos</p>
                                      </div>
                                  </div>

                                  <div className="p-6 space-y-4">
                                      <p className="text-gray-300 text-xs leading-relaxed">
                                          Recuerda que para que los correos se envíen solos, debes ir a <span className="text-white font-bold">Systeme.io &gt; Reglas de Automatización</span> y crear una regla donde el disparador sea "Etiqueta Añadida" y la acción sea "Inscribirse a Campaña".
                                      </p>
                                      <button 
                                        onClick={() => setShowTagModal(false)}
                                        className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all shadow-xl"
                                      >
                                          Finalizar Configuración
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}
      {/* ////////// Fin de actualización - 17/06/2025 11:30 ////////// */}
    </div>
  );
};
