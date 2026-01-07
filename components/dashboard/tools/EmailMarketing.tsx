import React, { useState, useEffect } from 'react';
import { Lead } from '../../../types';
import { Mail, RefreshCw, Database, Loader2, CheckCircle, ExternalLink, Zap, Send, X, List, Target, ShieldCheck, ChevronRight } from 'lucide-react';
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
  ////////// Fin de actualización - 17/06/2025 11:30 //////////

  useEffect(() => {
    loadSettings();
    loadLeads();
  }, []);

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

  const handleSaveKey = async () => {
    setSavingKey(true);
    try {
      await api.updateIntegrationSettings({ systemeIoKey });
      alert("Configuración de Systeme.io guardada correctamente.");
    } catch (e) {
      alert("Error al guardar la API Key.");
    } finally {
      setSavingKey(false);
    }
  };

  const syncLeads = async () => {
    // Refrescamos la lista local
    loadLeads();
  };

  ////////// Actualización: Función para disparar la sincronización manual masiva con logs detallados - 07/06/2025 20:15 //////////
  const handleManualSync = async () => {
    if (!systemeIoKey) {
        alert("Primero debes configurar y guardar tu API Key de Systeme.io.");
        return;
    }
    
    setSyncing(true);
    try {
        const res = await api.syncPendingLeads();
        console.log("[Mass Sync Success]:", res);
        alert(res.message);
        loadLeads();
    } catch (e: any) {
        ////////// Registro de error detallado en consola para diagnóstico - 07/06/2025 20:15 //////////
        console.error("[FULL SYNC ERROR OBJECT]:", e);
        alert("Error durante la sincronización: " + (e.message || "Error desconocido. Revisa la consola (F12) para más detalles."));
        ////////// Fin de actualización - 07/06/2025 20:15 //////////
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
    setShowTagModal(true);
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

  const handleSingleSync = async (tagId?: string) => {
    if (!selectedLeadForSync) return;

    setSyncingSingle(true);
    try {
        const res = await api.syncSingleLead(selectedLeadForSync.id, tagId);
        console.log("[Single Sync Success]:", res);
        // Actualizamos localmente el lead enviado
        setLeads(prev => prev.map(l => l.id === selectedLeadForSync.id ? { ...l, synced: true } : l));
        setShowTagModal(false);
    } catch (e: any) {
        console.error(`[SINGLE SYNC ERROR ID ${selectedLeadForSync.id}]:`, e);
        alert("Error al enviar el lead: " + (e.message || "Error desconocido"));
    } finally {
        setSyncingSingle(false);
    }
  };
  ////////// Fin de actualización - 17/06/2025 11:30 //////////

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#111] p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Zap className="w-32 h-32 text-[#FF5A1F]" />
        </div>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#FF5A1F]/10 rounded-2xl flex items-center justify-center text-[#FF5A1F] border border-[#FF5A1F]/20">
                <Database className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-white">Integración Systeme.io</h2>
                <p className="text-sm text-gray-500 font-medium">Sincroniza tus leads automáticamente con tus listas de email marketing.</p>
            </div>
        </div>

        <div className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">API Key de Systeme.io</label>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
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
                    className="px-10 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {savingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Guardar Configuración
                </button>
            </div>
          </div>

          {/* ////////// Actualización: Botón para Sincronización Manual de Leads Pendientes - 07/06/2025 19:40 ////////// */}
          <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                <button 
                    onClick={handleManualSync}
                    disabled={syncing || loadingLeads}
                    className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-[#FF5A1F]/10 hover:border-[#FF5A1F]/50 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {syncing ? <Loader2 className="w-4 h-4 animate-spin text-[#FF5A1F]" /> : <RefreshCw className="w-4 h-4 text-[#FF5A1F]" />}
                    Sincronizar Todos los Pendientes
                </button>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    * Envía ahora mismo todos los leads que están marcados como "Pendiente".
                </p>
          </div>
          {/* ////////// Fin de actualización - 07/06/2025 19:40 ////////// */}
          
          <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                ¿No tienes tu API Key? búscala en tu panel de Systeme.io &gt; Configuración &gt; Configuración de la API pública. Al configurar esta clave, cada registro en tus Landing Pages se enviará automáticamente.
              </p>
          </div>
        </div>
      </div>

      <div className="bg-[#111] rounded-[2.5rem] shadow-xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Leads Capturados</h2>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Historial de registros del ecosistema</p>
          </div>
          <button
            onClick={syncLeads}
            disabled={loadingLeads}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest transition-all"
          >
            {loadingLeads ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Actualizar Lista
          </button>
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

      {/* ////////// Actualización: Modal Premium de Selección de Etiqueta (Tag) - 17/06/2025 11:30 ////////// */}
      {showTagModal && selectedLeadForSync && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !syncingSingle && setShowTagModal(false)}
          >
              <div 
                className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#FF5A1F]/10 to-transparent">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#FF5A1F]/20 rounded-2xl flex items-center justify-center text-[#FF5A1F] shadow-[0_0_20px_rgba(255,90,31,0.2)]">
                              <Target className="w-6 h-6" />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-white">Asignar Etiqueta (Tag)</h3>
                              <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">Systeme.io Integration</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => setShowTagModal(false)} 
                        disabled={syncingSingle}
                        className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
                      >
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="p-8 space-y-6">
                      <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Prospecto seleccionado</p>
                          <div className="flex items-center justify-between">
                              <p className="text-white font-bold">{selectedLeadForSync.name}</p>
                              <p className="text-[#FF5A1F] font-medium text-sm">{selectedLeadForSync.email}</p>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                              <List className="w-4 h-4 text-[#FF5A1F]" /> Tus Etiquetas Disponibles
                          </h4>
                          
                          <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                              {loadingTags ? (
                                  <div className="py-12 flex flex-col items-center gap-3 text-gray-500">
                                      <Loader2 className="w-8 h-8 animate-spin" />
                                      <p className="text-xs font-bold uppercase tracking-widest">Consultando Systeme.io...</p>
                                  </div>
                              ) : tags.length > 0 ? (
                                  <>
                                      <button 
                                          onClick={() => handleSingleSync()}
                                          disabled={syncingSingle}
                                          className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group flex items-center justify-between"
                                      >
                                          <div>
                                              <p className="text-gray-200 font-bold">Enviar sólo como contacto</p>
                                              <p className="text-[10px] text-gray-500 uppercase font-bold">Sin asignación de etiqueta</p>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-all" />
                                      </button>
                                      
                                      {tags.map(tag => (
                                          <button 
                                              key={tag.id}
                                              onClick={() => handleSingleSync(tag.id)}
                                              disabled={syncingSingle}
                                              className="w-full text-left p-4 rounded-xl border border-white/5 bg-black hover:bg-[#FF5A1F]/5 hover:border-[#FF5A1F]/30 transition-all group flex items-center justify-between"
                                          >
                                              <div>
                                                  <p className="text-white font-bold group-hover:text-[#FF5A1F] transition-colors">{tag.name}</p>
                                                  <p className="text-[10px] text-gray-600 uppercase font-bold">Vincular a esta etiqueta</p>
                                              </div>
                                              <Send className="w-4 h-4 text-gray-700 group-hover:text-[#FF5A1F] transition-all" />
                                          </button>
                                      ))}
                                  </>
                              ) : (
                                  <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
                                      <p className="text-gray-500 text-sm italic">No se encontraron etiquetas creadas en tu cuenta.</p>
                                      <button 
                                          onClick={() => handleSingleSync()}
                                          className="mt-4 px-6 py-2 bg-white/5 text-white rounded-lg text-xs font-bold uppercase"
                                      >
                                          Enviar sólo contacto
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sincronización Segura Activada
                      </div>
                  </div>
              </div>
          </div>
      )}
      {/* ////////// Fin de actualización - 17/06/2025 11:30 ////////// */}
    </div>
  );
};