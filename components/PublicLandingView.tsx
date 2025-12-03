import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LandingPage } from "../types";
import { Loader2, AlertTriangle } from "lucide-react";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "/api";

export const PublicLandingView: React.FC = () => {
  const { slug, userSlug } = useParams<{ slug: string; userSlug?: string }>();

  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setError("Slug no proporcionado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Si viene userSlug en la URL → usamos la ruta path-based:
        //   GET /api/public/pages/by-user/:userSlug/:slug
        //
        // Si NO viene userSlug → usamos la ruta antigua:
        //   GET /api/public/pages/:slug
        // que depende del subdominio (admin.aprende.marketing, etc.)
        const endpoint = userSlug
          ? `${API_BASE}/public/pages/by-user/${encodeURIComponent(
              userSlug
            )}/${encodeURIComponent(slug)}`
          : `${API_BASE}/public/pages/${encodeURIComponent(slug)}`;

        const res = await fetch(endpoint);

        if (!res.ok) {
          if (res.status === 404) {
            setError("Landing no encontrada o no publicada.");
          } else if (res.status === 400) {
            setError("Configuración de dominio o usuario inválida.");
          } else {
            setError(`Error cargando landing (HTTP ${res.status})`);
          }
          setLoading(false);
          return;
        }

        const data = await res.json();

        const normalized: LandingPage = {
          id: data.id?.toString() ?? slug,
          name: data.name || "Landing sin título",
          niche: data.niche || "",
          goal: data.goal || "",
          isPublished: !!data.is_published,
          subdomain: data.subdomain || slug,
          visits: data.visits ?? 0,
          conversions: data.conversions ?? 0,
          createdAt: data.created_at ? new Date(data.created_at) : new Date(),
          content:
            typeof data.content === "string"
              ? JSON.parse(data.content)
              : data.content,
        };

        setPage(normalized);
      } catch (e: any) {
        console.error("Error cargando landing pública:", e);
        setError("Error interno cargando la landing.");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, userSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p>Cargando landing...</p>
      </div>
    );
  }

  if (error || !page || !page.content) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center text-white px-4">
        <AlertTriangle className="w-10 h-10 text-yellow-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No se pudo cargar la página</h1>
        <p className="text-gray-400 mb-4">
          {error || "Landing no disponible."}
        </p>
      </div>
    );
  }

  const content: any = page.content;
  const hero = content.hero || {};
  const brandName = content.brandName || page.name;
  const testimonials = content.testimonials || [];
  const benefits = content.benefits?.items || [];
  const testimonialTitle =
    content.testimonialTitle || "Testimonios de clientes";
  const logoSvg: string | undefined = content.logoSvg;

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-16">
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              {logoSvg ? (
                <div
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: logoSvg }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                  {brandName?.charAt(0) || "P"}
                </div>
              )}
              <div>
                <h1 className="font-bold text-lg">{brandName}</h1>
                {page.niche && (
                  <p className="text-xs text-gray-400">{page.niche}</p>
                )}
              </div>
            </div>

            {hero?.spotsLeft && (
              <div className="px-3 py-1 rounded-full border border-amber-400/40 text-amber-200 text-xs bg-amber-500/10">
                {hero.spotsLeft}
              </div>
            )}
          </header>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs text-primary/70 mb-4">
                {page.goal || "Oferta Especial"}
              </p>
              <h2
                className="text-3xl md:text-5xl font-extrabold leading-tight mb-4"
                dangerouslySetInnerHTML={{
                  __html: hero.headline || page.name,
                }}
              />
              <p className="text-gray-300 mb-6 text-sm md:text-base">
                {hero.subheadline ||
                  "Descubre esta oportunidad única para transformar tu negocio digital."}
              </p>

              <a
                href={
                  content.destination?.type === "external"
                    ? content.destination.url
                    : "#lead-form"
                }
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary hover:bg-indigo-500 text-white font-semibold text-sm md:text-base shadow-lg shadow-indigo-500/30 transition"
              >
                {hero.ctaText || "Quiero acceder ahora"}
              </a>

              <div className="mt-6 flex gap-6 text-xs text-gray-500">
                <span>
                  👀 Visitas: <b className="text-gray-200">{page.visits}</b>
                </span>
                <span>
                  ✅ Registros:{" "}
                  <b className="text-gray-200">{page.conversions}</b>
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60 shadow-2xl">
                {hero.heroImage ? (
                  <img
                    src={hero.heroImage}
                    alt={page.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm px-6 text-center">
                    Vista previa de la landing generada. Configura una imagen
                    principal en el editor.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {benefits.length > 0 && (
        <section className="bg-black py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              {content.benefits?.title || "Lo que conseguirás"}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((b: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-900/70 border border-gray-800 rounded-xl p-5 hover:border-primary/60 transition"
                >
                  <h4 className="font-semibold mb-2 text-white">{b.title}</h4>
                  <p className="text-sm text-gray-300">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bg-gradient-to-b from-black via-gray-950 to-black py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              {testimonialTitle}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-900/70 border border-gray-800 rounded-xl p-5 text-sm text-gray-300"
                >
                  <p className="mb-3">&ldquo;{t.text}&rdquo;</p>
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold text-white">{t.name}</span>{" "}
                    {t.location ? `· ${t.location}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-gray-900 bg-black py-6 text-center text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()} {brandName}. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
};
