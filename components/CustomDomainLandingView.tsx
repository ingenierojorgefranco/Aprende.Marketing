import React, { useEffect, useState } from "react";
import { LandingPage } from "../types";
import { Loader2, AlertTriangle, RefreshCw, Terminal } from "lucide-react";

// Helper para obtener la URL base correcta de la API
const getApiBase = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && envUrl.trim() !== "") {
      const cleanUrl = envUrl.replace(/\/$/, '');
      if (cleanUrl.endsWith('/api')) return cleanUrl;
      return `${cleanUrl}/api`;
  }
  return "/api";
};

const API_BASE = getApiBase();

export const CustomDomainLandingView: React.FC = () => {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Variables de diagnóstico
  const [apiMissing, setApiMissing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const fetchPage = async () => {
      // Usar window.location.hostname para detectar el dominio personalizado (ej: bajardepeso.online)
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      
      // Llamamos al endpoint específico que busca por custom_domain
      const endpoint = `${API_BASE}/public/pages/by-domain?domain=${encodeURIComponent(host)}`;
      console.log(`[CustomDomainLandingView] Buscando landing para: ${host}`);

      setDebugInfo({
          host,
          endpoint,
          timestamp: new Date().toISOString()
      });

      try {
        setLoading(true);
        setError(null);
        setApiMissing(false);

        const res = await fetch(endpoint);
        
        setDebugInfo((prev: any) => ({
            ...prev,
            status: res.status,
            statusText: res.statusText
        }));

        // Manejo específico para el error 404 de API no encontrada vs Landing no encontrada
        if (!res.ok) {
            let errorMsg = "Error cargando la página";
            try {
                const errData = await res.json();
                
                // Si el backend devuelve "API Endpoint Not Found", significa que el servidor no tiene la ruta implementada
                if (errData.error === "API Endpoint Not Found") {
                    setApiMissing(true);
                    throw new Error("El servidor backend no tiene habilitada la ruta de dominios personalizados.");
                }
                
                errorMsg = errData.error || errorMsg;
                setDebugInfo((prev: any) => ({ ...prev, responseBody: errData }));
            } catch (jsonErr) {
                // Si no es JSON, probablemente sea el 404 de HTML del catch-all si algo está muy mal
                if (res.status === 404) errorMsg = "Página no encontrada";
            }
            throw new Error(errorMsg);
        }

        const data = await res.json();

        // Normalizar datos
        let parsedContent: any = data.content;
        if (typeof parsedContent === "string") {
          try { parsedContent = JSON.parse(parsedContent); } catch {}
        }

        const normalized: LandingPage = {
          id: data.id?.toString() ?? "custom",
          name: data.name || "Landing",
          niche: data.niche || "",
          goal: data.goal || "",
          isPublished: !!data.is_published,
          subdomain: data.subdomain || "",
          visits: data.visits ?? 0,
          conversions: data.conversions ?? 0,
          createdAt: data.created_at ? new Date(data.created_at) : new Date(),
          content: parsedContent,
        };

        setPage(normalized);
      } catch (e: any) {
        console.error("Error cargando landing:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="animate-pulse text-gray-400">Cargando contenido...</p>
      </div>
    );
  }

  if (error || !page || !page.content) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center text-white px-6">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-lg w-full shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-6 mx-auto" />
            <h1 className="text-2xl font-bold mb-3 text-white">No se pudo cargar la página</h1>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              {apiMissing 
                ? "Error de conexión con el Servidor."
                : (error || "No hay ninguna landing asociada a este dominio.")}
            </p>

            {/* DEBUG PANEL */}
            <div className="bg-black/50 border border-gray-800 rounded p-4 text-left text-xs font-mono text-gray-300 mb-6 overflow-x-auto">
                <div className="flex items-center gap-2 mb-2 text-gray-500 border-b border-gray-800 pb-1">
                    <Terminal className="w-3 h-3" /> Diagnóstico Técnico
                </div>
                <p><span className="text-blue-400">Host:</span> {debugInfo.host}</p>
                <p><span className="text-blue-400">Endpoint:</span> {debugInfo.endpoint}</p>
                <p><span className="text-blue-400">Status:</span> <span className={debugInfo.status === 200 ? 'text-green-400' : 'text-red-400'}>{debugInfo.status || 'N/A'}</span></p>
                {apiMissing && (
                     <p className="text-red-400 mt-2 font-bold">CAUSA: Ruta de API no encontrada en Backend.</p>
                )}
                {error === 'No hay landing asociada a este dominio' && (
                     <p className="text-yellow-400 mt-2">CAUSA: El dominio apunta al servidor, pero no hay registro en la tabla 'landing_pages' con custom_domain='{debugInfo.host}'.</p>
                )}
            </div>

            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition flex items-center gap-2 mx-auto"
            >
                <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
        </div>
        
        <div className="mt-8 text-xs text-gray-600">
            PlataformaDeVenta.com &copy; {new Date().getFullYear()}
        </div>
      </div>
    );
  }

  // Renderizar contenido
  // (Nota: Idealmente usaríamos <LivePage /> importado, pero para mantener la simplicidad y evitar errores de importación circular en este snippet, renderizamos el fallback robusto)
  
  const content: any = page.content;
  const hero = content.hero || {};
  const brandName = content.brandName || page.name;

  // Import dinámico visual si LivePage no está disponible en el scope inmediato del archivo.
  // En tu proyecto real, asegúrate de importar LivePage arriba.
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-black min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              {hero.headline || brandName}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-8 leading-relaxed">
              {hero.subheadline || "Bienvenido a nuestro sitio."}
          </p>
          {content.destination?.url && (
              <a 
                href={content.destination.url}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition shadow-lg hover:scale-105 transform duration-200"
              >
                  {hero.ctaText || "Comenzar Ahora"}
              </a>
          )}
      </section>
    </div>
  );
};