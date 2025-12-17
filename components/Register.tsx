


import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Loader2, AlertCircle, Mail, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { register } from '../services/auth';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onLogin: (user: User) => void;
}

export const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await register({ name, email, password });
      
      const mappedUser: User = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role as any,
        // El backend asigna planLimits por defecto, aquí asumimos starter para la UI inmediata
        planLimits: {
            planName: 'starter',
            maxProjects: 1,
            maxLandings: 3,
            maxDomains: 1,
            features: {
                whatsappBot: false,
                blogGenerator: false,
                emailMarketing: false,
                removeBranding: false,
                emailStrategy: false,
                evergreenStrategy: false
            }
        },
        customRedirectUrl: (user as any).customRedirectUrl // Might be null for new users but good to map
      };

      onLogin(mappedUser);
      
      // LOGIC: Check custom URL > Global URL > Default
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
      console.error('Error de registro:', err);
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" /> Volver al Inicio
      </button>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white">Crea tu cuenta gratis</h2>
          <p className="text-gray-400 mt-2 text-sm">Comienza a construir tu imperio digital hoy mismo.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error de Registro</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
              Nombre Completo
            </label>
            <div className="relative">
                <UserIcon className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 pl-12 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder-gray-600"
                required
                disabled={loading}
                placeholder="Ej. Juan Pérez"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
              Correo Electrónico
            </label>
            <div className="relative">
                <Mail className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 pl-12 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder-gray-600"
                required
                disabled={loading}
                placeholder="juan@ejemplo.com"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
              Contraseña
            </label>
            <div className="relative">
                <Lock className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 pl-12 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder-gray-600"
                required
                disabled={loading}
                placeholder="••••••••"
                minLength={6}
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-500 hover:to-primary text-white shadow-primary/20 mt-2 transform active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Creando Cuenta...
              </>
            ) : (
              'Registrarme Gratis'
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <button onClick={() => navigate('/login')} className="text-primary hover:text-white font-bold transition hover:underline">
                    Inicia Sesión
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};