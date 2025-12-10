import React, { useState } from 'react';
import { Lead } from '../../../types';
import { Mail, RefreshCw, Database } from 'lucide-react';

export const EmailMarketing: React.FC = () => {
  const [apiKey, setApiKey] = useState('gr_x8s9d8f7s9d8f79s8d7f'); 
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', sourcePage: 'Crypto Masterclass', date: '2024-05-10', synced: true },
    { id: '2', name: 'Sarah Smith', email: 'sarah@test.com', sourcePage: 'Fitness 4 Moms', date: '2024-05-11', synced: true },
    { id: '3', name: 'Mike Johnson', email: 'mike@web.com', sourcePage: 'Crypto Masterclass', date: '2024-05-12', synced: false },
  ]);

  const syncLeads = () => {
    const updatedLeads = leads.map(l => ({ ...l, synced: true }));
    setLeads(updatedLeads);
    alert("¡Leads sincronizados correctamente con GetResponse!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" /> Configuración de Integración
        </h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">API Key de GetResponse</label>
            <div className="flex items-center gap-2 bg-black rounded-lg border border-gray-700 px-3 py-2">
              <Mail className="text-gray-500 w-5 h-5" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-transparent w-full outline-none text-white"
              />
            </div>
          </div>
          <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-indigo-600 transition">
            Guardar Key
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Leads Capturados</h2>
          <button
            onClick={syncLeads}
            className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 text-gray-300 text-sm transition"
          >
            <RefreshCw className="w-4 h-4" /> Sincronizar Ahora
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400 text-sm">
            <tr>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Página Origen</th>
              <th className="p-4 font-medium">Fecha</th>
              <th className="p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-800/50">
                <td className="p-4 text-white font-medium">{lead.name}</td>
                <td className="p-4 text-gray-400">{lead.email}</td>
                <td className="p-4 text-gray-400">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs border border-blue-900/50">{lead.sourcePage}</span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{lead.date}</td>
                <td className="p-4">
                  {lead.synced ? (
                    <span className="text-green-400 text-xs font-bold bg-green-900/30 px-2 py-1 rounded border border-green-900/50">Sincronizado</span>
                  ) : (
                    <span className="text-orange-400 text-xs font-bold bg-orange-900/30 px-2 py-1 rounded border border-orange-900/50">Pendiente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};