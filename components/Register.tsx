import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  Star,
  Layout,
  Video,
  Youtube,
  MessageCircle,
  Search,
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onLogin: (user: User) => void;
}

export const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname.includes('ais-dev');

  const handleTestWizard = async () => {
    setLoading(true);
    setError(null);
    try {
      const testName = 'Pepe';
      const testEmail = 'prueba@ejemplo.com';
      const testPassword = 'password123';

      const user = await api.register({ name: testName, email: testEmail, password: testPassword });

      const mappedUser: User = {
        ...user,
        id: user.id.toString(),
        planLimits: user.planLimits || {
          planName: 'starter',
          maxProjects: 1,
          maxLandings: 3,
          maxDomains: 1,
          maxArticles: 2,
          maxEmailSequences: 1,
          maxEmailSequencesNurturing: 15,
          maxWhatsAppLaunches: 1,
          maxHooks: 10,
          features: {
            whatsappBot: false,
            blogGenerator: false,
            emailMarketing: false,
            removeBranding: false,
            emailStrategy: false,
            evergreenStrategy: false
          }
        }
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('force_wizard_step', 'welcome');
      }

      onLogin(mappedUser);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar modo wizard');
    } finally {
      setLoading(false);
    }
  };

  const handleTestDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const testName = 'Usuario de Prueba';
      const testEmail = 'prueba@ejemplo.com';
      const testPassword = 'password123';

      const user = await api.register({ name: testName, email: testEmail, password: testPassword });

      const mappedUser: User = {
        ...user,
        id: user.id.toString(),
        planLimits: user.planLimits || {
          planName: 'starter',
          maxProjects: 1,
          maxLandings: 3,
          maxDomains: 1,
          maxArticles: 2,
          maxEmailSequences: 1,
          maxEmailSequencesNurturing: 15,
          maxWhatsAppLaunches: 1,
          maxHooks: 10,
          features: {
            whatsappBot: false,
            blogGenerator: false,
            emailMarketing: false,
            removeBranding: false,
            emailStrategy: false,
            evergreenStrategy: false
          }
        }
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('force_wizard_step', 'success');
      }

      onLogin(mappedUser);
      navigate('/wizard/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar modo prueba');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLocal) {
      setName('Usuario de Prueba');
      setEmail('prueba@ejemplo.com');
      setPassword('password123');
    }
  }, [isLocal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('force_wizard_step');
    }

    try {
      const user = await api.register({ name, email, password });

      const mappedUser: User = {
        ...user,
        id: user.id.toString(),
        planLimits: user.planLimits || {
          planName: 'starter',
          maxProjects: 1,
          maxLandings: 3,
          maxDomains: 1,
          maxArticles: 2,
          maxEmailSequences: 1,
          maxEmailSequencesNurturing: 15,
          maxWhatsAppLaunches: 1,
          maxHooks: 10,
          features: {
            whatsappBot: false,
            blogGenerator: false,
            emailMarketing: false,
            removeBranding: false,
            emailStrategy: false,
            evergreenStrategy: false
          }
        }
      };

      onLogin(mappedUser);

      const preLoginRedirect = typeof window !== 'undefined' ? localStorage.getItem('pre_login_redirect') : null;
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect');
      const targetRedirect = preLoginRedirect || redirectParam;

      if (targetRedirect && targetRedirect.startsWith('/')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pre_login_redirect');
        }
        navigate(targetRedirect, { replace: true });
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

  const benefits = [
    'Productos de Hotmart analizados y listos para elegir',
    'Estrategia completa con IA (avatar, dolores y propuesta)',
    'Página de captura profesional creada en minutos',
    'Guiones para Reels, YouTube, carruseles y WhatsApp',
    'Secuencias de Email Marketing y artículos SEO',
    'Guía de implementación paso a paso y Academia VIP'
  ];

  const toolBadges = [
    { label: 'Estrategia IA', icon: <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />, bg: 'bg-[#FF5A1F]/15 border-[#FF5A1F]/30' },
    { label: 'Landing Pages', icon: <Layout className="w-3.5 h-3.5 text-blue-400" />, bg: 'bg-blue-500/15 border-blue-500/30' },
    { label: 'Reels', icon: <Video className="w-3.5 h-3.5 text-cyan-400" />, bg: 'bg-cyan-500/15 border-cyan-500/30' },
    { label: 'YouTube', icon: <Youtube className="w-3.5 h-3.5 text-red-400" />, bg: 'bg-red-500/15 border-red-500/30' },
    { label: 'Email', icon: <Mail className="w-3.5 h-3.5 text-amber-400" />, bg: 'bg-amber-500/15 border-amber-500/30' },
    { label: 'WhatsApp', icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />, bg: 'bg-emerald-500/15 border-emerald-500/30' },
    { label: 'SEO', icon: <Search className="w-3.5 h-3.5 text-indigo-400" />, bg: 'bg-indigo-500/15 border-indigo-500/30' }
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col lg:flex-row font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* COLUMNA IZQUIERDA: FORMULARIO DE REGISTRO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-[#07090E] relative z-10 border-b lg:border-b-0 lg:border-r border-white/10">
        {/* Botón Volver arriba */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* Contenedor central del formulario */}
        <div className="w-full max-w-md mx-auto my-8 lg:my-auto py-4">
          {/* Brand Logo */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="w-11 h-9 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg shadow-[#FF5A1F]/25 px-2">
              AM
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Aprende.<span className="text-[#FF5A1F]">Marketing</span>
            </span>
          </div>

          <div className="text-center mb-7">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Crea tu cuenta gratis
            </h1>
            <p className="text-zinc-400 mt-2.5 text-sm sm:text-base leading-relaxed">
              Empieza hoy y lanza tu estrategia en <span className="text-[#FF5A1F] font-semibold">Hotmart</span> paso a paso.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-800/80 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <UserIcon className="absolute top-3.5 left-4 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0D111A] border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm sm:text-base text-white placeholder-zinc-500 focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition"
                  required
                  disabled={loading}
                  placeholder="Ej. Laura Martínez"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-4 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D111A] border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm sm:text-base text-white placeholder-zinc-500 focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition"
                  required
                  disabled={loading}
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute top-3.5 left-4 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0D111A] border border-white/10 rounded-xl px-4 py-3 pl-11 pr-11 text-sm sm:text-base text-white placeholder-zinc-500 focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition"
                  required
                  disabled={loading}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3.5 p-1 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-black py-3.5 rounded-xl transition-all shadow-lg bg-[#FF5A1F] hover:bg-[#e04a14] text-white shadow-[#FF5A1F]/25 mt-2 transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrarme Gratis'}
            </button>

            <p className="text-center text-xs text-zinc-500 pt-1">
              Al registrarte aceptas nuestros{' '}
              <button
                type="button"
                onClick={() => navigate('/terminos')}
                className="text-zinc-300 underline hover:text-[#FF5A1F] transition-colors cursor-pointer"
              >
                Términos de Uso
              </button>{' '}
              y{' '}
              <button
                type="button"
                onClick={() => navigate('/privacidad')}
                className="text-zinc-300 underline hover:text-[#FF5A1F] transition-colors cursor-pointer"
              >
                Política de Privacidad
              </button>
              .
            </p>
          </form>

          {/* Separador y acceso a Login */}
          <div className="mt-7 pt-6 border-t border-white/10 space-y-3">
            <p className="text-center text-xs font-medium text-zinc-400">
              ¿Ya tienes una cuenta creada?
            </p>
            <button
              type="button"
              onClick={() => navigate('/login' + window.location.search)}
              className="w-full py-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Iniciar sesión
            </button>

            {isLocal && (
              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleTestDashboard}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 text-[#FF5A1F] hover:text-white border border-[#FF5A1F]/20 hover:border-[#FF5A1F]/40 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                >
                  🛠️ dashboard
                </button>
                <button
                  type="button"
                  onClick={handleTestWizard}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 text-[#FF5A1F] hover:text-white border border-[#FF5A1F]/20 hover:border-[#FF5A1F]/40 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                >
                  🛠️ wizard
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-[11px] text-zinc-600 hidden lg:block">
          © {new Date().getFullYear()} Aprende.Marketing • Sin tarjeta de crédito
        </div>
      </div>

      {/* COLUMNA DERECHA: PROPUESTA DE VALOR Y PRUEBA SOCIAL */}
      <div className="w-full lg:w-1/2 relative overflow-hidden bg-[#0B0F19] flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16">
        {/* Fondo decorativo sutil con tarjetas difuminadas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF5A1F]/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-8 opacity-[0.07]">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-44 rounded-2xl border border-white/20 bg-gradient-to-b from-white/10 to-transparent"
              />
            ))}
          </div>
        </div>

        {/* Contenido principal centrado */}
        <div className="relative z-10 my-auto max-w-lg mx-auto w-full space-y-9 py-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/25 text-[#FF5A1F] text-xs font-extrabold uppercase tracking-wider mb-5">
              <span>Todo incluido en tu cuenta gratuita</span>
            </div>

            <ul className="space-y-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#FF5A1F]" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-zinc-100 leading-snug">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bloque de Testimonio y Estrellas */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center space-y-3 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              alt="Carlos Mendoza"
              className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-[#FF5A1F]/50 shadow-md"
            />
            <div>
              <h3 className="font-extrabold text-white text-base">Carlos Mendoza</h3>
              <p className="text-xs sm:text-sm font-bold text-[#FF5A1F] mt-0.5">
                Me ahorró semanas de trabajo técnico
              </p>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
              “Tenía cero experiencia creando páginas ni escribiendo copys, pero con el paso a paso guiado ya tengo mi proyecto, página de captura y guiones funcionando.”
            </p>
            <div className="flex items-center justify-center gap-1 pt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#FF5A1F] fill-[#FF5A1F]" />
              ))}
            </div>
            <p className="text-xs text-zinc-400 pt-1">
              Únete a <span className="text-white font-bold">cientos de afiliados</span> lanzando su estrategia paso a paso
            </p>
          </div>
        </div>

        {/* Tira inferior de herramientas */}
        <div className="relative z-10 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {toolBadges.map((tool, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-bold text-zinc-300"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${tool.bg}`}>
                  {tool.icon}
                </span>
                <span>{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
