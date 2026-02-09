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
  const { slug: paramSlug, userSlug, "*": wildCard } = useParams() as { slug: string; userSlug?: string; "*": string };
  const location = useLocation();
  
  // Prioritize passed prop (for custom domain root) over URL param
  const activeSlug = forcedSlug || paramSlug;

  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<DebugInfo | null>(null);

  // BLOG & THANK YOU ROUTING LOGIC
  // Detect if we are in /blog, /blog/article-slug, /gracias, /privacidad or /terminos
  let viewMode: 'home' | 'blog-list' | 'blog-post' | 'thank-you' | 'privacy' | 'terms' = 'home';
  let articleSlug = '';

  // 1. CUSTOM DOMAIN LOGIC (Prioritize explicit path parsing when forcedSlug is present)
  // This handles routes like /blog/my-article where the router might pass 'my-article' as wildcard
  if (forcedSlug) {
      if (location.pathname.includes('/gracias')) {
          viewMode = 'thank-you';
      } else if (location.pathname.includes('/privacidad')) {
          viewMode = 'privacy';
      } else if (location.pathname.includes('/terminos')) {
          viewMode = 'terms';
      } else if (location.pathname.includes('/blog')) {
          // Remove trailing slash for consistency
          const cleanPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
          
          if (cleanPath.endsWith('/blog')) {
              viewMode = 'blog-list';
          } else {
              // Extract slug after /blog/
              const parts = cleanPath.split('/blog/');
              if (parts.length > 1 && parts[1].trim() !== '') {
                  viewMode = 'blog-post';
                  articleSlug = parts[1];
              } else {
                  viewMode = 'blog-list';
              }
          }
      }
  } 
  // 2. STANDARD ROUTING LOGIC (Wildcard based for /lp/:slug/* where wildcard contains the sub-path)
  else if (wildCard) {
      if (wildCard === 'blog' || wildCard === 'blog/') {
          viewMode = 'blog-list';
      } else if (wildCard.startsWith('blog/')) {
          viewMode = 'blog-post';
          articleSlug = wildCard.replace('blog/', '');
      } else if (wildCard === 'gracias' || wildCard === 'gracias/') {
          viewMode = 'thank-you';
      } else if (wildCard === 'privacidad' || wildCard === 'privacidad/') {
          viewMode = 'privacy';
      } else if (wildCard === 'terminos' || wildCard === 'terminos/') {
          viewMode = 'terms';
      }
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
          // Usamos endpoint generico de slug para simplificar
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

  // Construct base path for navigation
  const basePath = userSlug 
    ? `/lp/${userSlug}/${activeSlug}` 
    : forcedSlug 
        ? '' // Root if forced (custom domain) 
        : `/admin/lp/${activeSlug}`; // or /lp/slug

  // USAMOS EL MOTOR DE RENDERIZADO "LivePage"
  return <LivePage 
            content={page.content} 
            pageId={page.id} 
            viewMode={viewMode} 
            articleSlug={articleSlug}
            basePath={basePath} 
         />;
};