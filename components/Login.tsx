
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Loader2, AlertCircle, Database, WifiOff } from 'lucide-react';
import { User } from '../types';
import { login as authLogin } from '../services/auth';
import { api } from '../services/api';
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

  const isProduction = typeof window !== "undefined" && 
    (window.location.hostname.includes("aprende.marketing") || 
     window.location.hostname.includes("bajardepeso.online"));

  const [logs, setLogs] = useState<string[]>([]);
  const navigate = useNavigate();

  ////////// Actualización: Verificación de System Mode al cargar - 28/05/2024 16:30 //////////
  useEffect(() => {
    const checkMode = async () => {
        try {
            const systemMode = await api.getSystemMode();
            if (systemMode === 'launch') {
                // Verificamos si ya hay un admin logueado (sesión persistente)
                const user = await api.getCurrentUser();
                if (!user || user.role !== 'admin') {
                    navigate('/lanzamiento');
                }
            }
        } catch (e) {
            console.error("Error checking system mode");
        }
    };
    checkMode();
  }, [navigate]);
  ////////// Fin de actualización - 28/05/2024 16:30 //////////

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLogs([]);
    addLog(`Iniciando login en modo: ${mode === 'db' ? 'Base de Datos' : 'Offline'}`);
    
    if (mode === 'offline') {
      api.enableMockMode();
      try {
          const mockUser = await api.login(email, password);
          onLogin(mockUser);
          navigate('/dashboard'); 
      } catch (err: any) {
          setError(err.message || 'Error de credenciales offline.');
      }
      setLoading(false);
      return;
    }

    try {
      api.disableMockMode();
      const { user } = await authLogin({ email, password });
      
      ////////// Lógica de bloqueo por Modo Lanzamiento tras autenticación - 28/05/2024 16:30 //////////
      const systemMode = await api.getSystemMode();
      if (systemMode === 'launch' && user.role !== 'admin') {
          setError("Plataforma en modo lanzamiento. Solo acceso administrativo.");
          setLoading(false);
          return;
      }
      ////////// Fin de actualización - 28/05/2024 16:30 //////////

      const mappedUser: User = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role as any, 
        planLimits: (user as any).planLimits,
        customRedirectUrl: (user as any).customRedirectUrl
      };
      onLogin(mappedUser);
      if (mappedUser.customRedirectUrl && mappedUser.customRedirectUrl.trim() !== '') {
          navigate(mappedUser.customRedirectUrl);
      } else {
          try {
              const redirectUrl = await api.getLoginRedirect();
              navigate(redirectUrl);
          } catch (e) {
              navigate('/dashboard');
          }
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center p-6 relative">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-[#B0B0B0] hover:text-white flex items-center gap-2 transition"><ArrowLeft className="w-5 h-5" /> Volver</button>

      <div className="w-full max-w-md bg-[#161616] border border-white/5 rounded-2xl p-8 shadow-2xl z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-xl flex items-center justify-center mx-auto mb-4"><Lock className="w-6 h-6" /></div>
          <h2 className="text-2xl font-bold text-white">Bienvenido de nuevo</h2>
          <p className="text-[#B0B0B0] mt-2">Ingresa a tu panel estratégico</p>
        </div>

        {!isProduction && (
          <div className="mb-6">
            <p className="text-[10px] text-[#B0B0B0] uppercase font-bold mb-2">Modo de acceso</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMode('db')} className={`px-3 py-2 rounded-lg border text-xs font-bold transition ${mode === 'db' ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]' : 'border-white/10 text-[#B0B0B0]'}`}>Base de Datos</button>
              <button type="button" onClick={() => setMode('offline')} className={`px-3 py-2 rounded-lg border text-xs font-bold transition ${mode === 'offline' ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]' : 'border-white/10 text-[#B0B0B0]'}`}>Offline (Demo)</button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 p-3 rounded-lg flex items-start gap-2 text-sm"><AlertCircle className="w-5 h-5 shrink-0" /><div><p className="font-bold">Error</p><p>{error}</p></div></div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#B0B0B0] uppercase mb-2">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF5A1F] outline-none transition" required disabled={loading} placeholder="admin@ejemplo.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#B0B0B0] uppercase mb-2">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF5A1F] outline-none transition" required disabled={loading} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black py-4 rounded-xl transition shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ingresar al Panel'}
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-white/5">
            <p className="text-[#B0B0B0] text-sm">¿No tienes cuenta? <button onClick={() => navigate('/register')} className="text-[#FF5A1F] font-bold hover:underline transition">Regístrate Gratis</button></p>
        </div>
      </div>
    </div>
  );
};
