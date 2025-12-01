import React, { useState } from 'react';
import { ArrowLeft, Lock, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('admin@plataformadeventa.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Consola visual para debug
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLogs([]); // Limpiar logs anteriores
    addLog("Iniciando proceso de login...");
    addLog(`Usuario: ${email}`);
    
    try {
        addLog("Llamando a api.login()...");
        const user = await api.login(email, password, addLog);
        addLog("Usuario recibido correctamente.");
        onLogin(user);
    } catch (err: any) {
        addLog(`Error fatal: ${err.message}`);
        setError(err.message || 'Error al iniciar sesión');
        setLoading(false);
    }
  };

  const handleForceOffline = () => {
     addLog("Forzando entrada offline...");
     const offlineUser: User = { id: 'force-off', name: 'Demo User', email: email };
     onLogin(offlineUser);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
      <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Volver
      </button>
      
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Bienvenido de nuevo</h2>
          <p className="text-gray-400 mt-2">Ingresa a tu panel de administración</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 p-3 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                    <p className="font-bold">Error de Acceso</p>
                    <p>{error}</p>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Conectando...</> : 'Ingresar'}
          </button>
        </form>
        
        {loading && (
             <button 
                type="button" 
                onClick={handleForceOffline}
                className="mt-4 w-full text-xs text-gray-500 hover:text-white underline"
             >
                ¿Tarda mucho? Entrar como Demo
             </button>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
           <p>Modo DB Cloud + Offline Fallback</p>
        </div>
      </div>

      {/* Console Logs for Debugging */}
      <div className="w-full max-w-md mt-6 bg-black border border-gray-800 rounded-lg p-4 font-mono text-xs max-h-48 overflow-y-auto">
          <p className="text-gray-500 mb-2 border-b border-gray-800 pb-1">Console Logs (Debug)</p>
          {logs.length === 0 && <span className="text-gray-700">Esperando acciones...</span>}
          {logs.map((log, i) => (
              <div key={i} className="text-green-400 mb-1">{log}</div>
          ))}
      </div>
    </div>
  );
};