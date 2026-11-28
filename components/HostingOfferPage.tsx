import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { User } from '../types';

interface HostingOfferPageProps {
  user: User | null;
}

const DREAMHOST_BASE_URL =
  'https://click.dreamhost.com/aff_c?offer_id=8&aff_id=3330&source=paginahosting';

const MAIN_VIDEO_EMBED_URL =
  'https://www.youtube.com/embed/BLsUomgV88c?rel=0&modestbranding=1';

const HOW_TO_BUY_VIDEO_EMBED_URL =
  'https://www.youtube.com/embed/_Tr7My6cYD0?autoplay=1&rel=0&modestbranding=1';

const BENEFITS: string[] = [
  'Tu propio hosting durante 2 años.',
  'Tu dominio propio (www.tunegocio.com)',
  'Una sesión personalizada conmigo para construir tu negocio digital.',
  'Tu página web creada y configurada.',
  'Selección de tu producto digital y configuración de tus enlaces de afiliado.',
  'Tu estrategia de marketing personalizada.',
  'Herramientas para crear reels, carruseles y artículos de blog durante un año',
  '12 meses de acceso al Plan PRO de Aprende.Marketing sin coste adicional.',
  'Formación y acompañamiento a través de nuestra comunidad.',
];

export const HostingOfferPage: React.FC<HostingOfferPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHowToBuyOpen, setIsHowToBuyOpen] = useState(false);

  const firstName = useMemo(() => {
    const raw = user?.name?.trim();
    if (!raw) return '';
    return raw.split(/\s+/)[0];
  }, [user?.name]);

  const affiliateEmail = useMemo(() => {
    if (user?.email?.trim()) return user.email.trim();
    const params = new URLSearchParams(location.search);
    return params.get('email')?.trim() || '';
  }, [user?.email, location.search]);

  const hostingUrl = useMemo(() => {
    if (!affiliateEmail) return DREAMHOST_BASE_URL;
    const encodedEmail = encodeURIComponent(affiliateEmail).replace(/%40/g, '@');
    return `${DREAMHOST_BASE_URL}&aff_sub=${encodedEmail}`;
  }, [affiliateEmail]);

  useEffect(() => {
    document.title = '¡Hagamos realidad tu negocio digital! | Aprende.Marketing';
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (!isHowToBuyOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHowToBuyOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHowToBuyOpen]);

  const handleGoToLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pre_login_redirect', '/hosting');
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Subtle top corporate glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[780px] h-[360px] bg-[#FF5A1F]/12 rounded-full blur-[150px]"
      />

      {/* Minimal Top Navigation */}
      <header className="relative z-20 border-b border-white/[0.06] bg-[#0B0B0B]/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-7 bg-[#FF5A1F] rounded-lg flex items-center justify-center font-black text-white text-xs tracking-tight shadow-md shadow-[#FF5A1F]/25 group-hover:brightness-110 transition">
              AM
            </div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
              Aprende<span className="text-[#FF5A1F]">.Marketing</span>
            </span>
          </button>

          {user ? (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF5A1F]" />
              <span>Volver al panel</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGoToLogin}
              className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full">
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#FF5A1F] mb-3">
              {firstName
                ? `Hola, ${firstName} — Beneficio exclusivo para miembros`
                : 'Beneficio exclusivo para miembros de Aprende.Marketing'}
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.1] text-white text-balance">
              🚀 ¡Hagamos realidad tu negocio digital!
            </h1>
          </div>

          {/* Primary Video */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-[#121318] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.65)] aspect-video">
              <iframe
                src={MAIN_VIDEO_EMBED_URL}
                title="¡Hagamos realidad tu negocio digital! - Aprende.Marketing"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* Primary & Secondary CTA Stack */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3.5 max-w-md mx-auto">
            <a
              href={hostingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 sm:py-[1.125rem] px-8 rounded-xl bg-[#FF5A1F] hover:bg-[#FF6D2E] active:scale-[0.99] text-white font-extrabold text-base sm:text-lg tracking-tight shadow-[0_14px_38px_rgba(255,90,31,0.35)] hover:shadow-[0_18px_46px_rgba(255,90,31,0.48)] transition-all duration-200 flex items-center justify-center gap-2.5 group"
            >
              <span>Quiero el Hosting</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            <button
              type="button"
              onClick={() => setIsHowToBuyOpen(true)}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-[#FF5A1F]" />
              <span>Cómo comprar</span>
            </button>
          </div>
        </section>

        {/* Hairline Section Divider */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        </div>

        {/* SALES LETTER */}
        <article className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16 space-y-12 sm:space-y-14">
          {/* Section 1: Opportunity Narrative */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.18] text-white text-balance">
              Una oportunidad especial para los miembros de{' '}
              <span className="text-[#FF5A1F]">Aprende.Marketing</span>
            </h2>

            <div className="space-y-5 text-base sm:text-[1.125rem] leading-[1.8] text-zinc-300">
              <p>
                Sabemos que uno de los principales obstáculos para comenzar un negocio digital es no
                contar con los conocimientos, las herramientas y la orientación necesaria.
              </p>

              <p>
                Por eso, gracias a nuestro programa de afiliación con{' '}
                <strong className="text-white font-semibold">DreamHost</strong>, hemos preparado un
                beneficio especial para los miembros de nuestra comunidad.
              </p>

              <p>
                Imagina tener tu propia página web, saber qué producto digital promocionar, contar
                con una estrategia de marketing y tener las herramientas necesarias para crear tus
                contenidos durante todo un año.
              </p>

              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
                Y lo mejor de todo: no tendrás que hacerlo solo.
              </p>

              <p>
                Quiero trabajar personalmente contigo para ayudarte a superar esas dificultades que
                hasta ahora te han impedido comenzar.
              </p>

              <p>
                <strong className="text-white font-semibold">DreamHost</strong> es una reconocida
                empresa internacional de hosting y dominios, y gracias a una alianza estratégica que
                hemos establecido podemos ofrecerte un beneficio único que te permitirá tener un
                plan de Hosting (Alojamiento para tu página web) y dominio (el nombre de tu negocio{' '}
                <span className="text-zinc-100 font-medium">www.tunegocio.com</span>) durante dos
                años.
              </p>
            </div>
          </section>

          {/* Section 2: Benefits Checklist */}
          <section className="bg-[#121318] border border-white/[0.08] rounded-2xl p-6 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5A1F] mb-2.5">
              Todo lo que incluye este beneficio
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-7 text-balance">
              Al contratar el alojamiento de tu página web con DreamHost, recibirás los siguientes
              beneficios:
            </h3>

            <ul className="divide-y divide-white/[0.06]">
              {BENEFITS.map((benefit, index) => (
                <li
                  key={index}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5 text-base sm:text-[1.0625rem] leading-relaxed text-zinc-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#FF5A1F] shrink-0 mt-1" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: What You Need to Start + Transparent Pricing Comparison */}
          <section className="space-y-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              ¿Qué necesitas para comenzar?
            </h2>

            {/* Clear Value Anchoring Strip */}
            <div className="grid sm:grid-cols-2 gap-4 tabular-nums">
              <div className="rounded-xl bg-[#121318] border border-white/[0.08] p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400 mb-2">
                  Precio habitual de Aprende.Marketing
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-zinc-400 line-through decoration-zinc-500">
                    $79 USD
                  </span>
                  <span className="text-sm text-zinc-500">/ mes</span>
                </div>
                <p className="text-sm text-zinc-400 mt-1.5">Equivale a $948 dólares al año</p>
              </div>

              <div className="rounded-xl bg-[#FF5A1F]/[0.07] border border-[#FF5A1F]/40 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#FF5A1F] mb-2">
                  Con tu alianza DreamHost
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">~$87 USD</span>
                  <span className="text-sm font-medium text-zinc-300">pago único · 2 años</span>
                </div>
                <p className="text-sm text-zinc-200 mt-1.5">
                  Solo $3,63/mes + 12 meses Plan PRO 100% Gratis
                </p>
              </div>
            </div>

            <div className="space-y-5 text-base sm:text-[1.125rem] leading-[1.8] text-zinc-300 tabular-nums">
              <p>
                Únicamente realizar la inversión inicial en el alojamiento de tu página web, que
                actualmente es de aproximadamente{' '}
                <strong className="text-white font-semibold">87 dólares por dos años</strong>. Esto
                equivale a tan solo{' '}
                <strong className="text-white font-semibold">3,63 dólares al mes</strong>, mediante
                un único pago.
              </p>

              <p>
                Normalmente Aprende.Marketing tiene un valor de $79 dólares mensuales ($948 dólares
                al año) pero con este beneficio tienes acceso durante{' '}
                <strong className="text-white font-semibold">12 meses 100% Gratis</strong> +
                Hosting y Dominio incluido durante dos años.
              </p>

              <p>
                No tendrás que realizar ningún pago adicional por la sesión personalizada, la
                implementación ni el acceso a Aprende.Marketing durante los primeros 12 meses.
              </p>

              <p>
                Antes de contratar, conocerás el precio definitivo, los impuestos aplicables y las
                condiciones de renovación del hosting y del dominio.
              </p>

              <p>Yo me encargaré de guiarte y ayudarte a poner en marcha tu proyecto.</p>

              <p>
                La sesión personalizada es gratuita y no tienes ninguna obligación de compra.
                Durante nuestra reunión podrás conocer cómo funcionaría tu negocio y decidir si esta
                oportunidad es adecuada para ti.
              </p>

              <p className="text-lg sm:text-xl font-bold text-white leading-relaxed pt-2">
                No necesitas experiencia, solo ganas de aprender, compromiso y deseos de construir
                algo propio.
              </p>
            </div>
          </section>

          {/* Section 4: Closing Conversion Block */}
          <section className="rounded-2xl bg-[#121318] border border-white/10 p-7 sm:p-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 text-balance">
              {firstName
                ? `${firstName}, empieza hoy tu negocio digital`
                : 'Empieza hoy tu negocio digital'}
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mb-7 leading-relaxed">
              Asegura tus 2 años de hosting y dominio propio con DreamHost y recibe 12 meses de
              acceso al Plan PRO de Aprende.Marketing más tu sesión personalizada.
            </p>

            <div className="flex flex-col items-center gap-3.5 max-w-md mx-auto">
              <a
                href={hostingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 sm:py-[1.125rem] px-8 rounded-xl bg-[#FF5A1F] hover:bg-[#FF6D2E] active:scale-[0.99] text-white font-extrabold text-base sm:text-lg tracking-tight shadow-[0_14px_38px_rgba(255,90,31,0.35)] hover:shadow-[0_18px_46px_rgba(255,90,31,0.48)] transition-all duration-200 flex items-center justify-center gap-2.5 group"
              >
                <span>Quiero el Hosting</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <button
                type="button"
                onClick={() => setIsHowToBuyOpen(true)}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-[#FF5A1F]" />
                <span>Cómo comprar</span>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-[#FF5A1F] shrink-0" />
              <span>Enlace oficial de la alianza Aprende.Marketing &amp; DreamHost</span>
            </div>
          </section>
        </article>
      </main>

      {/* Quiet Corporate Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-5 sm:px-8 text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-5 bg-[#FF5A1F] rounded flex items-center justify-center font-bold text-white text-[10px]">
              AM
            </div>
            <span className="font-bold text-zinc-400">
              Aprende<span className="text-[#FF5A1F]">.Marketing</span>
            </span>
          </div>

          <p>&copy; {new Date().getFullYear()} Aprende.Marketing. Todos los derechos reservados.</p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/terminos')}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Términos
            </button>
            <button
              type="button"
              onClick={() => navigate('/privacidad')}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Privacidad
            </button>
            <button
              type="button"
              onClick={() => navigate('/contacto')}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Contacto
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: Cómo comprar */}
      {isHowToBuyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-buy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsHowToBuyOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-[#121318] border border-white/12 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-white/[0.08]">
              <h2
                id="how-to-buy-modal-title"
                className="text-base sm:text-lg font-bold text-white tracking-tight"
              >
                Cómo comprar tu Hosting paso a paso
              </h2>
              <button
                type="button"
                onClick={() => setIsHowToBuyOpen(false)}
                aria-label="Cerrar video"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black aspect-video w-full">
              <iframe
                src={HOW_TO_BUY_VIDEO_EMBED_URL}
                title="Cómo comprar tu Hosting en DreamHost"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0E0F13]">
              <p className="text-xs sm:text-sm text-zinc-400 text-center sm:text-left">
                ¿Listo para activar tu hosting y dominio propio?
              </p>
              <a
                href={hostingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-[#FF5A1F] hover:bg-[#FF6D2E] text-white font-bold text-sm transition-colors"
              >
                <span>Quiero el Hosting</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
