import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ChevronRight, Lock, Loader2, AlertCircle, X } from 'lucide-react';
import { api } from '../../services/api';

export interface CountryDialOption {
  code: string;
  dial: string;
  label: string;
  flag: string;
}

export const COUNTRY_DIAL_CODES: CountryDialOption[] = [
  { code: 'DE', dial: '+49', label: 'Alemania', flag: '🇩🇪' },
  { code: 'AD', dial: '+376', label: 'Andorra', flag: '🇦🇩' },
  { code: 'AR', dial: '+54', label: 'Argentina', flag: '🇦🇷' },
  { code: 'AW', dial: '+297', label: 'Aruba', flag: '🇦🇼' },
  { code: 'AU', dial: '+61', label: 'Australia', flag: '🇦🇺' },
  { code: 'AT', dial: '+43', label: 'Austria', flag: '🇦🇹' },
  { code: 'BE', dial: '+32', label: 'Bélgica', flag: '🇧🇪' },
  { code: 'BZ', dial: '+501', label: 'Belice', flag: '🇧🇿' },
  { code: 'BO', dial: '+591', label: 'Bolivia', flag: '🇧🇴' },
  { code: 'BR', dial: '+55', label: 'Brasil', flag: '🇧🇷' },
  { code: 'CA', dial: '+1', label: 'Canadá', flag: '🇨🇦' },
  { code: 'CL', dial: '+56', label: 'Chile', flag: '🇨🇱' },
  { code: 'CO', dial: '+57', label: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', dial: '+506', label: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', dial: '+53', label: 'Cuba', flag: '🇨🇺' },
  { code: 'CW', dial: '+599', label: 'Curazao', flag: '🇨🇼' },
  { code: 'DK', dial: '+45', label: 'Dinamarca', flag: '🇩🇰' },
  { code: 'EC', dial: '+593', label: 'Ecuador', flag: '🇪🇨' },
  { code: 'SV', dial: '+503', label: 'El Salvador', flag: '🇸🇻' },
  { code: 'AE', dial: '+971', label: 'Emiratos Árabes', flag: '🇦🇪' },
  { code: 'ES', dial: '+34', label: 'España', flag: '🇪🇸' },
  { code: 'US', dial: '+1', label: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'PH', dial: '+63', label: 'Filipinas', flag: '🇵🇭' },
  { code: 'FI', dial: '+358', label: 'Finlandia', flag: '🇫🇮' },
  { code: 'FR', dial: '+33', label: 'Francia', flag: '🇫🇷' },
  { code: 'GR', dial: '+30', label: 'Grecia', flag: '🇬🇷' },
  { code: 'GT', dial: '+502', label: 'Guatemala', flag: '🇬🇹' },
  { code: 'GQ', dial: '+240', label: 'Guinea Ecuatorial', flag: '🇬🇶' },
  { code: 'GY', dial: '+592', label: 'Guyana', flag: '🇬🇾' },
  { code: 'HT', dial: '+509', label: 'Haití', flag: '🇭🇹' },
  { code: 'HN', dial: '+504', label: 'Honduras', flag: '🇭🇳' },
  { code: 'IE', dial: '+353', label: 'Irlanda', flag: '🇮🇪' },
  { code: 'IL', dial: '+972', label: 'Israel', flag: '🇮🇱' },
  { code: 'IT', dial: '+39', label: 'Italia', flag: '🇮🇹' },
  { code: 'JM', dial: '+1', label: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', dial: '+81', label: 'Japón', flag: '🇯🇵' },
  { code: 'LU', dial: '+352', label: 'Luxemburgo', flag: '🇱🇺' },
  { code: 'MX', dial: '+52', label: 'México', flag: '🇲🇽' },
  { code: 'NI', dial: '+505', label: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NO', dial: '+47', label: 'Noruega', flag: '🇳🇴' },
  { code: 'NZ', dial: '+64', label: 'Nueva Zelanda', flag: '🇳🇿' },
  { code: 'NL', dial: '+31', label: 'Países Bajos', flag: '🇳🇱' },
  { code: 'PA', dial: '+507', label: 'Panamá', flag: '🇵🇦' },
  { code: 'PY', dial: '+595', label: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', dial: '+51', label: 'Perú', flag: '🇵🇪' },
  { code: 'PL', dial: '+48', label: 'Polonia', flag: '🇵🇱' },
  { code: 'PT', dial: '+351', label: 'Portugal', flag: '🇵🇹' },
  { code: 'PR', dial: '+1', label: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'GB', dial: '+44', label: 'Reino Unido', flag: '🇬🇧' },
  { code: 'DO', dial: '+1', label: 'Rep. Dominicana', flag: '🇩🇴' },
  { code: 'SE', dial: '+46', label: 'Suecia', flag: '🇸🇪' },
  { code: 'CH', dial: '+41', label: 'Suiza', flag: '🇨🇭' },
  { code: 'SR', dial: '+597', label: 'Surinam', flag: '🇸🇷' },
  { code: 'TT', dial: '+1', label: 'Trinidad y Tobago', flag: '🇹🇹' },
  { code: 'UY', dial: '+598', label: 'Uruguay', flag: '🇺🇾' },
  { code: 'VE', dial: '+58', label: 'Venezuela', flag: '🇻🇪' },
  { code: 'OTHER', dial: '+', label: 'Otro país', flag: '🌍' },
];

const buildNormalizedPhone = (dial: string, localInput: string): { fullPhone: string; digitsCount: number } => {
  const trimmed = localInput.trim();
  // Si el usuario ya pegó su número completo con '+', respetamos ese prefijo internacional
  if (trimmed.startsWith('+')) {
    const digits = trimmed.replace(/\D/g, '');
    return { fullPhone: digits ? `+${digits}` : '', digitsCount: digits.length };
  }
  const dialDigits = dial.replace(/\D/g, '');
  const localDigits = trimmed.replace(/\D/g, '');
  const combined = `${dialDigits}${localDigits}`;
  return { fullPhone: combined ? `+${combined}` : '', digitsCount: combined.length };
};

interface WhatsAppOnboardingStepProps {
  userName?: string;
  ctaLabel?: string;
  onSaved: (phone: string) => void;
  onSkip: () => void;
}

export const WhatsAppOnboardingStep: React.FC<WhatsAppOnboardingStepProps> = ({
  userName,
  ctaLabel = 'CONTINUAR A MI PROYECTO DIGITAL',
  onSaved,
  onSkip,
}) => {
  const firstName = userName?.split(' ')[0] || '';
  const [selectedCountry, setSelectedCountry] = useState<string>('CO');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCountry =
    COUNTRY_DIAL_CODES.find((c) => c.code === selectedCountry) || COUNTRY_DIAL_CODES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { fullPhone, digitsCount } = buildNormalizedPhone(activeCountry.dial, phoneInput);
    if (digitsCount < 7 || digitsCount > 15) {
      setError('Por favor ingresa un número de WhatsApp válido (entre 7 y 15 dígitos).');
      return;
    }

    setSaving(true);
    try {
      const res = await api.updateWhatsappPhone(fullPhone);
      onSaved(res.phone || fullPhone);
    } catch (err: any) {
      setError(err?.message || 'No pudimos guardar tu número. Inténtalo nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 max-w-3xl mx-auto px-4 font-sans py-8"
    >
      {/* Icono central con el mismo estilo de WelcomeStep */}
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-[#FF5A1F]/30 blur-3xl opacity-30 animate-pulse rounded-full" />
        <div className="w-16 h-16 bg-[#FF5A1F] rounded-2xl flex items-center justify-center mx-auto relative border border-white/15 shadow-2xl">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Textos principales */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          ¿Cuál es tu número de <span className="text-[#FF5A1F]">WhatsApp</span>
          {firstName ? `, ${firstName}` : ''}?
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-[#FF5A1F] tracking-tight pt-1 max-w-2xl mx-auto leading-snug">
          Como tu Asistente Personal, quiero enviarte acceso a nuestra comunidad privada, guías prácticas y apoyo directo para que lances tu primer negocio digital.
        </h2>

        <p className="max-w-xl mx-auto leading-relaxed text-zinc-300 font-light text-base md:text-lg pt-1">
          Solo te compartiremos contenido de valor, novedades de productos ganadores y avisos de sesiones en vivo para ayudarte a lograr tus primeras ventas.
        </p>
      </div>

      {/* Formulario minimalista de teléfono */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 pt-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative sm:w-52 shrink-0">
            <select
              aria-label="Indicativo de país"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                if (error) setError(null);
              }}
              className="w-full h-14 bg-zinc-950/90 border border-white/15 focus:border-[#FF5A1F] rounded-2xl px-4 text-white text-sm font-semibold outline-none transition-all cursor-pointer"
            >
              {COUNTRY_DIAL_CODES.map((c) => (
                <option key={c.code} value={c.code} className="bg-zinc-950 text-white">
                  {c.label} {c.dial}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <input
              type="tel"
              inputMode="tel"
              autoFocus
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder={activeCountry.code === 'OTHER' ? '+Código y número...' : 'Ej: 300 123 4567'}
              className="w-full h-14 bg-zinc-950/90 border border-white/15 focus:border-[#FF5A1F] rounded-2xl px-5 text-white text-base md:text-lg font-medium placeholder:text-zinc-600 outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-400 text-xs sm:text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 space-y-4">
          <button
            type="submit"
            disabled={saving}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] shadow-[0_12px_30px_-5px_rgba(255,90,31,0.4)] transform hover:-translate-y-0.5 active:scale-[0.98] text-white rounded-2xl font-black text-base md:text-lg tracking-wide transition-all mx-auto cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>GUARDANDO...</span>
              </>
            ) : (
              <>
                <span>{ctaLabel}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Tus datos están seguros. Cero spam.</span>
          </div>

          {/* Opción oculta temporalmente para requerir el registro de WhatsApp
          <div className="pt-1">
            <button
              type="button"
              onClick={onSkip}
              disabled={saving}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50"
            >
              Lo haré más tarde
            </button>
          </div>
          */}
        </div>
      </form>
    </motion.div>
  );
};

interface WhatsAppPromptModalProps {
  isOpen: boolean;
  userName?: string;
  onSaved: (phone: string) => void;
  onDismiss: () => void;
}

export const WhatsAppPromptModal: React.FC<WhatsAppPromptModalProps> = ({
  isOpen,
  userName,
  onSaved,
  onDismiss,
}) => {
  const firstName = userName?.split(' ')[0] || '';
  const [selectedCountry, setSelectedCountry] = useState<string>('CO');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeCountry =
    COUNTRY_DIAL_CODES.find((c) => c.code === selectedCountry) || COUNTRY_DIAL_CODES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { fullPhone, digitsCount } = buildNormalizedPhone(activeCountry.dial, phoneInput);
    if (digitsCount < 7 || digitsCount > 15) {
      setError('Por favor ingresa un número de WhatsApp válido (entre 7 y 15 dígitos).');
      return;
    }

    setSaving(true);
    try {
      const res = await api.updateWhatsappPhone(fullPhone);
      onSaved(res.phone || fullPhone);
    } catch (err: any) {
      setError(err?.message || 'No pudimos guardar tu número. Inténtalo nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-[#09090b] border border-white/10 rounded-[2rem] p-7 sm:p-10 shadow-2xl text-center overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#FF5A1F]/15 blur-3xl rounded-full pointer-events-none" />

        {/* Botón de cerrar oculto temporalmente para requerir el registro de WhatsApp
        <button
          type="button"
          onClick={onDismiss}
          disabled={saving}
          aria-label="Cerrar"
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-300 p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        */}

        <div className="relative space-y-6">
          <div className="w-14 h-14 bg-[#FF5A1F] rounded-2xl flex items-center justify-center mx-auto border border-white/15 shadow-xl shadow-[#FF5A1F]/25">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ¡Hola{firstName ? `, ${firstName}` : ''}! Completa tu{' '}
              <span className="text-[#FF5A1F]">WhatsApp</span>
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#FF5A1F] leading-snug max-w-md mx-auto">
              Recibe acceso a nuestra comunidad privada, guías paso a paso y avisos de sesiones en vivo para acelerar tus resultados.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Déjanos tu número una sola vez y te mantendremos al día con productos ganadores y soporte directo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="sm:w-52 shrink-0">
                <select
                  aria-label="Indicativo de país"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-12 bg-black border border-white/15 focus:border-[#FF5A1F] rounded-xl px-3 text-white text-sm font-semibold outline-none transition-all cursor-pointer"
                >
                  {COUNTRY_DIAL_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-zinc-950 text-white">
                      {c.label} {c.dial}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="tel"
                inputMode="tel"
                autoFocus
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={activeCountry.code === 'OTHER' ? '+Código y número...' : 'Ej: 300 123 4567'}
                className="flex-1 h-12 bg-black border border-white/15 focus:border-[#FF5A1F] rounded-xl px-4 text-white text-base font-medium placeholder:text-zinc-600 outline-none transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#FF5A1F] hover:bg-[#D94A1E] shadow-[0_10px_25px_-5px_rgba(255,90,31,0.4)] text-white rounded-xl font-black text-sm sm:text-base tracking-wide transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>GUARDANDO...</span>
                </>
              ) : (
                <>
                  <span>GUARDAR MI WHATSAPP Y CONTINUAR</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
              <Lock className="w-3 h-3 text-zinc-500" />
              <span>Tus datos están seguros. Cero spam.</span>
            </div>

            {/* Opción oculta temporalmente para requerir el registro de WhatsApp
            <div>
              <button
                type="button"
                onClick={onDismiss}
                disabled={saving}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50"
              >
                Lo haré más tarde
              </button>
            </div>
            */}
          </form>
        </div>
      </motion.div>
    </div>
  );
};
