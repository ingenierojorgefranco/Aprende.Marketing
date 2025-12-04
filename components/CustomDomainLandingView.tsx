import React, { useEffect, useState } from "react";
import { LandingPage } from "../types";
import { Loader2, AlertTriangle, RefreshCw, Terminal, Copy, Database } from "lucide-react";

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
  const [dbStatus, setDbStatus] = useState<string>("Comprobando...");
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      // PASO 1: Check de Conexión a BD
      let dbCheckPassed = false;
      const dbCheckUrl = `${API_BASE}/debug/db-status`;
      
      try {
          const dbRes = await fetch(dbCheckUrl);
          const dbData = await dbRes.json();
          if (dbData.db_connected) {
              setDbStatus("Conectada ✅");
              dbCheckPassed = true;
          } else {
              setDbStatus(`Error de conexión: ${dbData.error || 'Desconocido'}`);
          }
          setDebugInfo(prev => ({ ...prev, dbCheck: dbData }));
      } catch (e) {
          setDbStatus("Fallo al contactar endpoint de debug ❌");
          setDebugInfo(prev => ({ ...prev, dbCheckError: e.toString() }));
      }

      // PASO 2: Cargar Landing (Solo si DB respondió, aunque intentamos igual)
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      const endpoint = `${API_BASE}/public/pages/by-domain?domain=${encodeURIComponent(host)}`;
      console.log(`[CustomDomainLandingView] Buscando landing para: ${host}`);

      const startDebug = {
          host,
          endpoint,
          timestamp: new Date().toISOString()
      };
      setDebugInfo(prev => ({ ...prev, ...startDebug }));

      try {
        setError(null);
        setApiMissing(false);

        const res = await fetch(endpoint);
        
        let errorData = null;
        let successData = null;
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
             const json = await res.json();
             if (!res.ok) errorData = json;
             else successData = json;
        } else {
             const text = await res.text();
             if (!res.ok) errorData = { rawText: text.slice(0, 500) };
        }

        const debugPayload = {
            status: res.status,
            statusText: res.statusText,
            contentType,
            responseBody: errorData || successData
        };
        setDebugInfo(prev => ({ ...prev, mainRequest: debugPayload }));

        if (!res.ok) {
            let errorMsg = "Error cargando la página";
            
            if (errorData) {
                if (errorData.error && errorData.error.includes("Endpoint Not Found")) {
                    setApiMissing(true);
                    throw new Error(`El servidor backend NO reconoció la ruta. (Versión detectada: ${errorData.server_version || 'Desconocida'})`);
                }
                errorMsg = errorData.error || errorMsg;
            } else if (res.status === 404) {
                errorMsg = "Recurso no encontrado (404)";
            }
            throw new Error(errorMsg);
        }

        const data = successData;

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

    init();
  }, []);

  const copyDebug = () => {
      navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
      alert("Diagnóstico copiado al portapapeles");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="animate-pulse text-gray-400">Conectando al servidor...</p>
        <p className="text-xs text-gray-600 mt-2">Estado BD: {dbStatus}</p>
      </div>
    );
  }

  if (error || !page || !page.content) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center text-white px-6">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-lg w-full shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-6 mx-auto" />
            <h1 className="text-2xl font-bold mb-3 text-white">No se pudo cargar la página</h1>
            
            <p className="text-gray-400 mb-2 leading-relaxed font-bold">
               {error}
            </p>
            
            <div className={`text-xs mb-6 px-3 py-1 rounded-full inline-block ${dbStatus.includes('✅') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                Estado Base de Datos: {dbStatus}
            </div>

            {/* DEBUG PANEL */}
            <div className="bg-black/50 border border-gray-800 rounded p-4 text-left text-xs font-mono text-gray-300 mb-6 overflow-x-auto relative group">
                <div className="flex items-center justify-between gap-2 mb-2 text-gray-500 border-b border-gray-800 pb-1">
                    <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Diagnóstico Técnico</span>
                    <button onClick={copyDebug} className="hover:text-white"><Copy className="w-3 h-3"/></button>
                </div>
                
                <pre className="whitespace-pre-wrap break-all text-[10px] text-gray-400">
                    {JSON.stringify(debugInfo, null, 2)}
                </pre>
            </div>

            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition flex items-center gap-2 mx-auto"
            >
                <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
        </div>
      </div>
    );
  }

  // Renderizar contenido
  const content: any = page.content;
  const hero = content.hero || {};
  const brandName = content.brandName || page.name;

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