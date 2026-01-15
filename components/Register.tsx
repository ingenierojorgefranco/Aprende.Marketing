
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
  const [launchReady] = useState(1); // 1 significa que debe ir a la lista de espera
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await register({ name, email, password, launchReady } as any);
      const mappedUser: User = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role as any,
        planLimits: {
            planName: 'starter',
            maxProjects: 1,
            maxLandings: 3,
            maxDomains: 1,
            features: { whatsappBot: false, blogGenerator: false, emailMarketing: false, removeBranding: false, emailStrategy: false, evergreenStrategy: false }
        },
        customRedirectUrl: (user as any).customRedirectUrl,
        launchReady: (user as any).launchReady ?? launchReady
      };
      onLogin(mappedUser);

      // Lógica de lanzamiento: si es 1 y no es admin, va a la lista de espera
      if (mappedUser.launchReady === 1 && mappedUser.role !== 'admin') {
          navigate('/waiting-list');
          return;
      }

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
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center p-6 relative">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-[#B0B0B0] hover:text-white flex items-center gap-2 transition"><ArrowLeft className="w-5 h-5" /> Volver</button>

      <div className="w-full max-w-md bg-[#161616] border border-white/5 rounded-2xl p-8 shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"><UserPlus className="w-7 h-7" /></div>
          <h2 className="text-2xl font-bold text-white">Crea tu cuenta gratis</h2>
          <p className="text-[#B0B0B0] mt-2 text-sm">Comienza a construir tu imperio digital hoy mismo.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm"><AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><div><p className="font-bold">Error</p><p>{error}</p></div></div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="launchReady" value={launchReady} />
          <div>
            <label className="block text-[10px] font-bold text-[#B0B0B0] uppercase mb-1.5">Nombre Completo</label>
            <div className="relative">
                <UserIcon className="absolute top-3.5 left-4 w-5 h-5 text-[#B0B0B0]" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-12 text-white focus:border-[#FF5A1F] outline-none transition" required disabled={loading} placeholder="Ej. Juan Pérez" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#B0B0B0] uppercase mb-1.5">Correo Electrónico</label>
            <div className="relative">
                <Mail className="absolute top-3.5 left-4 w-5 h-5 text-[#B0B0B0]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-12 text-white focus:border-[#FF5A1F] outline-none transition" required disabled={loading} placeholder="juan@ejemplo.com" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#B0B0B0] uppercase mb-1.5">Contraseña</label>
            <div className="relative">
                <Lock className="absolute top-3.5 left-4 w-5 h-5 text-[#B0B0B0]" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-12 text-white focus:border-[#FF5A1F] outline-none transition" required disabled={loading} placeholder="••••••••" minLength={6} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full font-black py-4 rounded-xl transition shadow-lg bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-[#FF5A1F]/20 mt-2 transform active:scale-[0.98]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrarme Gratis'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-[#B0B0B0] text-sm">¿Ya tienes cuenta? <button onClick={() => navigate('/login')} className="text-[#FF5A1F] font-bold hover:underline transition">Inicia Sesión</button></p>
        </div>
      </div>
    </div>
  );
};
