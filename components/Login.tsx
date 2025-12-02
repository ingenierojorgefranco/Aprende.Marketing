
import React, { useState } from 'react';
import { ArrowLeft, Lock, Loader2, AlertCircle, Database, WifiOff } from 'lucide-react';
import { User } from '../types';
import { login as authLogin } from '../services/auth';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (user: User) => void;
}

type LoginMode = 'db' | 'offline';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<LoginMode>('db'); 

  // Consola visual para debug
  const [logs, setLogs] = useState<string[]>([]);
  const navigate = useNavigate();

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLogs([]);
    addLog(`Iniciando proceso de login en modo: ${mode === 'db' ? 'Base de Datos' : 'Offline Demo'}`);
    
    // 🟡 MODO OFFLINE: no llama a backend
    if (mode === 'offline') {
      addLog('Modo OFFLINE seleccionado.');
      const offlineUser: User = {
        id: 'offline-demo',
        name: 'Usuario Demo (Offline)',
        email: email || 'demo@offline.com',
      };
      
      onLogin(offlineUser);
      setLoading(false);
      navigate('/dashboard'); // Redirigir
      return;
    }

    // 🔵 MODO BD: login real
    try {
      addLog('Llamando a backend /api/auth/login...');
      const { user } = await authLogin({ email, password });

      addLog('Usuario autenticado correctamente.');
      
      const mappedUser: User = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      };

      onLogin(mappedUser);
      navigate('/dashboard'); // Redirigir

    } catch (err: any) {
      console.error('Error de login:', err);
      addLog(`Error fatal: ${err.message}`);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForceOfflineClick = () => {
    const offlineUser: User = {
      id: 'force-off',
      name: 'Demo User (Forzado)',
      email: email || 'forced@demo.com',
    };
    onLogin(offlineUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" /> Volver
      </button>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Bienvenido de nuevo</h2>
          <p className="text-gray-400 mt-2">Ingresa a tu panel de administración</p>
        </div>

        {/* Selector de modo de login */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2">Modo de autenticación</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setMode('db')}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg border ${
                mode === 'db'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
              disabled={loading}
            >
              <Database className="w-4 h-4" />
              BD (Cloud SQL)
            </button>
            <button
              type="button"
              onClick={() => setMode('offline')}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg border ${
                mode === 'offline'
                  ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
              disabled={loading}
            >
              <WifiOff className="w-4 h-4" />
              Offline (demo)
            </button>
          </div>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              required
              disabled={loading}
              placeholder="admin@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Conectando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={handleForceOfflineClick}
          className="mt-4 w-full text-xs text-gray-500 hover:text-white underline"
        >
          ¿Problemas de conexión? Entrar como Demo inmediato
        </button>
      </div>

      {/* Console Logs for Debugging */}
      <div className="w-full max-w-md mt-6 bg-black border border-gray-800 rounded-lg p-4 font-mono text-xs max-h-48 overflow-y-auto">
        <p className="text-gray-500 mb-2 border-b border-gray-800 pb-1">
          Console Logs (Debug)
        </p>
        {logs.map((log, i) => (
          <div key={i} className="text-green-400 mb-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
