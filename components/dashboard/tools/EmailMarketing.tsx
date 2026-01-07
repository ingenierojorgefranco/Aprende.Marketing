import React, { useState, useEffect } from 'react';
import { Lead } from '../../../types';
import { Mail, RefreshCw, Database, Loader2, CheckCircle, ExternalLink, Zap } from 'lucide-react';
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

  ////////// Actualización: Función para disparar la sincronización manual de leads pendientes - 07/06/2025 19:40 //////////
  const handleManualSync = async () => {
    if (!systemeIoKey) {
        alert("Primero debes configurar y guardar tu API Key de Systeme.io.");
        return;
    }
    
    setSyncing(true);
    try {
        const res = await api.syncPendingLeads();
        alert(res.message);
        loadLeads();
    } catch (e: any) {
        alert("Error durante la sincronización: " + (e.message || "Error desconocido"));
    } finally {
        setSyncing(false);
    }
  };
  ////////// Fin de actualización - 07/06/2025 19:40 //////////

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
                        onChange={(e) => setSyncing ? setSystemeIoKey(e.target.value) : null}
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
                    Sincronizar Leads Pendientes
                </button>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    * Envía ahora mismo los leads que fueron capturados antes de poner la API Key.
                </p>
          </div>
          {/* ////////// Fin de actualización - 07/06/2025 19:40 ////////// */}
          
          <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <ExternalLink className="w-4 h-4" />
              </div>
              {/* ////////// Corrección de error de compilación escapando caracteres > con &gt; - 07/06/2025 19:35 ////////// */}
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                ¿No tienes tu API Key? búscala en tu panel de Systeme.io &gt; Configuración &gt; Configuración de la API pública. Al configurar esta clave, cada registro en tus Landing Pages se enviará automáticamente.
              </p>
              {/* ////////// Fin de actualización - 07/06/2025 19:35 ////////// */}
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
                <th className="p-6 text-center">Sincronización</th>
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
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-600 font-medium italic">
                    {loadingLeads ? "Cargando prospectos..." : "Aún no has recibido ningún lead en tus Landing Pages."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};