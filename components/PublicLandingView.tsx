

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { LandingPage } from "../types";
import { Loader2, AlertTriangle } from "lucide-react";
import { LivePage } from "./LivePage"; // Importamos el motor de renderizado

// Forzamos API en el mismo dominio bajo /api
const API_BASE = "/api";

// CAMBIAR A TRUE SOLO PARA DESARROLLO / DEBUG VISUAL
const SHOW_DEBUG_UI = false;

type DebugInfo = {
  endpoint: string;
  status?: number;
  contentType?: string | null;
  rawBodySnippet?: string;
  userSlug?: string;
  slug?: string;
};

interface PublicLandingViewProps {
  forcedSlug?: string;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ forcedSlug }) => {
  const { slug: paramSlug, userSlug } = useParams<{ slug: string; userSlug?: string }>();
  const location = useLocation();
  
  // Prioritize passed prop (for custom domain root) over URL param
  const activeSlug = forcedSlug || paramSlug;

  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<DebugInfo | null>(null);

  // BLOG ROUTING LOGIC
  // Detect if we are in /blog or /blog/article-slug
  // We need to parse the URL relative to the landing base.
  // If custom domain: /blog -> blog list
  // If subdomain path: /lp/:slug/blog -> blog list
  let viewMode: 'home' | 'blog-list' | 'blog-post' = 'home';
  let articleSlug = '';

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const secondLastSegment = pathSegments[pathSegments.length - 2];

  if (lastSegment === 'blog') {
      viewMode = 'blog-list';
  } else if (secondLastSegment === 'blog') {
      viewMode = 'blog-post';
      articleSlug = lastSegment;
  }

  useEffect(() => {
    const fetchPage = async () => {
      if (!activeSlug) {
        setError("Slug no proporcionado.");
        setLoading(false);
        setDebug({
          endpoint: "(no se llamó API porque no hay slug)",
          userSlug,
          slug: activeSlug,
        });
        return;
      }

      // Construimos endpoint según si hay userSlug
      // OJO: Si es custom domain, usamos by-domain. Si es ruta path, usamos by-user o by-slug generic.
      let endpoint = '';
      
      if (forcedSlug) {
          // Es custom domain logic (forcedSlug viene del mapeo de dominio)
          // Pero la logica original usaba by-domain con el host.
          // Aqui reutilizamos el endpoint generico de slug para simplificar si ya tenemos el slug resuelto.
          endpoint = `${API_BASE}/public/pages/${encodeURIComponent(activeSlug)}`;
      } else if (userSlug) {
          endpoint = `${API_BASE}/public/pages/by-user/${encodeURIComponent(userSlug)}/${encodeURIComponent(activeSlug)}`;
      } else {
          endpoint = `${API_BASE}/public/pages/${encodeURIComponent(activeSlug)}`;
      }

      console.log("[PublicLandingView] Fetching:", endpoint);

      try {
        setLoading(true);
        setError(null);
        setDebug({
          endpoint,
          userSlug,
          slug: activeSlug,
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
        
        if (!res.ok) {
          setError(`Landing no encontrada (HTTP ${res.status}).`);
          setLoading(false);
          return;
        }

        const data = await res.json();

        const normalized: LandingPage = {
          id: data.id?.toString() ?? activeSlug,
          name: data.name || "Landing sin título",
          niche: data.niche || "",
          goal: data.goal || "",
          isPublished: !!data.is_published,
          subdomain: data.subdomain || activeSlug,
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
  }, [activeSlug, userSlug, forcedSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p>Cargando contenido...</p>
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

  // USAMOS EL MOTOR DE RENDERIZADO "LivePage"
  // Pasamos el viewMode y articleSlug para que LivePage sepa qué renderizar (Home, Lista Blog, Post Blog)
  return <LivePage 
            content={page.content} 
            pageId={page.id} 
            viewMode={viewMode} 
            articleSlug={articleSlug}
            basePath={userSlug ? `/lp/${userSlug}/${activeSlug}` : forcedSlug ? '' : `/lp/${activeSlug}`} // Base path for links
         />;
};