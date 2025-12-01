import React, { useState } from 'react';
import { ArrowLeft, Lock, Loader2, AlertCircle, Database, WifiOff } from 'lucide-react';
import { User } from '../types';
import { login as authLogin } from '../services/auth';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

type LoginMode = 'db' | 'offline';

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('admin@plataformadeventa.com');
  const [password, setPassword] = useState('MiPasswordSuperSegura123'); // la que usaste al registrar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<LoginMode>('db'); // 'db' | 'offline'

  // Consola visual para debug
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLogs([]);
    addLog(`Iniciando proceso de login en modo: ${mode === 'db' ? 'Base de Datos' : 'Offline Demo'}`);
    addLog(`Usuario: ${email}`);

    // 🟡 MODO OFFLINE: no llama a backend
    if (mode === 'offline') {
      addLog('Modo OFFLINE seleccionado, saltando petición al backend.');
      const offlineUser: User = {
        id: 'offline-demo',
        name: 'Usuario Demo (Offline)',
        email,
      };
      addLog('Usuario demo generado localmente.');
      onLogin(offlineUser);
      setLoading(false);
      return;
    }

    // 🔵 MODO BD: login real contra /api/auth/login
    try {
      addLog('Llamando a backend /api/auth/login...');
      const { user } = await authLogin({ email, password });

      addLog('Usuario autenticado correctamente en backend.');
      addLog(`ID: ${user.id} | Rol: ${user.role}`);

      const mappedUser: User = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      };

      onLogin(mappedUser);
    } catch (err: any) {
      console.error('Error de login:', err);
      addLog(`Error fatal: ${err.message || 'Error desconocido'}`);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForceOfflineClick = () => {
    // Botón extra por si el modo está en BD pero falla algo y quieres entrar rápido
    addLog('Botón de "Entrar como Demo" presionado.');
    const offlineUser: User = {
      id: 'force-off',
      name: 'Demo User (Forzado)',
      email,
    };
    onLogin(offlineUser);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
      <button
        onClick={onBack}
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
          <p className="mt-2 text-[11px] text-gray-500">
            • <span className="text-primary">BD</span>: usa la base de datos real en Cloud SQL.<br />
            • <span className="text-yellow-300">Offline</span>: entra con usuario demo sin tocar la BDD.
          </p>
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

        {/* Botón extra de "Entrar como Demo" por si algo se cuelga */}
        <button
          type="button"
          onClick={handleForceOfflineClick}
          className="mt-4 w-full text-xs text-gray-500 hover:text-white underline"
        >
          ¿Problemas de conexión? Entrar como Demo inmediato
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Modo actual:{' '}
            <span
              className={
                mode === 'db' ? 'text-primary font-semibold' : 'text-yellow-300 font-semibold'
              }
            >
              {mode === 'db' ? 'BD (Cloud SQL)' : 'Offline (demo)'}
            </span>
          </p>
        </div>
      </div>

      {/* Console Logs for Debugging */}
      <div className="w-full max-w-md mt-6 bg-black border border-gray-800 rounded-lg p-4 font-mono text-xs max-h-48 overflow-y-auto">
        <p className="text-gray-500 mb-2 border-b border-gray-800 pb-1">
          Console Logs (Debug)
        </p>
        {logs.length === 0 && (
          <span className="text-gray-700">Esperando acciones...</span>
        )}
        {logs.map((log, i) => (
          <div key={i} className="text-green-400 mb-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
