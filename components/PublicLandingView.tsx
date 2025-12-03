
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LandingPage } from "../types";
import { Loader2, AlertTriangle } from "lucide-react";
import { LivePage } from "./LivePage"; // Importamos el motor de renderizado

// Forzamos API en el mismo dominio bajo /api
const API_BASE = "/api";

type DebugInfo = {
  endpoint: string;
  status?: number;
  contentType?: string | null;
  rawBodySnippet?: string;
  userSlug?: string;
  slug?: string;
};

export const PublicLandingView: React.FC = () => {
  const { slug, userSlug } = useParams<{ slug: string; userSlug?: string }>();

  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<DebugInfo | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setError("Slug no proporcionado.");
        setLoading(false);
        setDebug({
          endpoint: "(no se llamó API porque no hay slug)",
          userSlug,
          slug,
        });
        return;
      }

      // Construimos endpoint según si hay userSlug
      const endpoint = userSlug
        ? `${API_BASE}/public/pages/by-user/${encodeURIComponent(
            userSlug
          )}/${encodeURIComponent(slug)}`
        : `${API_BASE}/public/pages/${encodeURIComponent(slug)}`;

      console.log("[PublicLandingView] userSlug:", userSlug, "slug:", slug);
      console.log("[PublicLandingView] Fetching:", endpoint);

      try {
        setLoading(true);
        setError(null);
        setDebug({
          endpoint,
          userSlug,
          slug,
        });

        // OBTENER TOKEN: Para no contar visita propia
        const token = localStorage.getItem("plataformadeventacom_token");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(endpoint, {
          method: "GET",
          headers: headers,
        });

        const contentType = res.headers.get("content-type");
        let rawSnippet = "";

        // Intentamos leer texto SI hay error o content-type sospechoso
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          try {
            const raw = await res.text();
            rawSnippet = raw.slice(0, 400); // solo los primeros 400 chars
          } catch {
            rawSnippet = "(no se pudo leer el cuerpo de la respuesta)";
          }

          const debugInfo: DebugInfo = {
            endpoint,
            status: res.status,
            contentType,
            rawBodySnippet: rawSnippet,
            userSlug,
            slug,
          };
          console.error("[PublicLandingView] Error response debug:", debugInfo);
          setDebug(debugInfo);
        }

        if (!res.ok) {
          if (res.status === 404) {
            setError("Landing no encontrada o no publicada.");
          } else if (res.status === 400) {
            setError("Configuración de dominio o usuario inválida.");
          } else {
            setError(`Error cargando landing (HTTP ${res.status}).`);
          }
          setLoading(false);
          return;
        }

        if (!contentType || !contentType.includes("application/json")) {
          setError("La API devolvió una respuesta no válida (no es JSON).");
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
        // Si todo salió bien, mantenemos algo de debug básico
        setDebug((prev) => ({
          ...(prev || {}),
          endpoint,
          status: res.status,
          contentType,
          userSlug,
          slug,
        }));
      } catch (e: any) {
        console.error("Error cargando landing pública:", e);
        setError("Error interno cargando la landing.");
        setDebug((prev) => ({
          ...(prev || {}),
          endpoint,
          userSlug,
          slug,
          rawBodySnippet:
            (prev && prev.rawBodySnippet) ||
            "Error de red o fallo inesperado en fetch.",
        }));
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

        {/* Bloque de debug visible para ti */}
        {debug && (
          <div className="mt-6 w-full max-w-3xl text-left">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              DEBUG TÉCNICO (solo para desarrollo)
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto text-xs font-mono text-gray-200">
              <p>
                <span className="text-gray-500">userSlug:</span>{" "}
                {debug.userSlug || "(sin userSlug en URL)"}
              </p>
              <p>
                <span className="text-gray-500">slug:</span>{" "}
                {debug.slug || "(sin slug en URL)"}
              </p>
              <p className="mt-2">
                <span className="text-gray-500">endpoint:</span>{" "}
                {debug.endpoint}
              </p>
              {typeof debug.status !== "undefined" && (
                <p>
                  <span className="text-gray-500">status:</span> {debug.status}
                </p>
              )}
              {typeof debug.contentType !== "undefined" && (
                <p>
                  <span className="text-gray-500">content-type:</span>{" "}
                  {debug.contentType || "(vacío)"}
                </p>
              )}
              {debug.rawBodySnippet && (
                <>
                  <p className="mt-3 text-gray-500">respuesta (snippet):</p>
                  <pre className="mt-1 whitespace-pre-wrap break-words">
                    {debug.rawBodySnippet}
                  </pre>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // USAMOS EL MOTOR DE RENDERIZADO "LivePage" PARA QUE SEA IDÉNTICO AL EDITOR
  return <LivePage content={page.content} />;
};
