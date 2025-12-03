import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";

import { PublicHome } from "./components/PublicHome";
import { Login } from "./components/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";
import { Generator } from "./components/Generator";
import { Editor } from "./components/Editor";
import { WhatsAppCRM } from "./components/WhatsAppCRM";
import { EmailMarketing } from "./components/EmailMarketing";
import { ContentGenerator } from "./components/ContentGenerator";
import { ArticlesList } from "./components/ArticlesList";

import { User, LandingPage, Article } from "./types";
import {
  Loader2,
  PenTool,
  LayoutTemplate,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { api } from "./services/api";
import { getCurrentUser, logout } from "./services/auth";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "/api";

// ======================================================
//  VISTA PÚBLICA DE LANDING
//  - Soporta:
//      /lp/:slug                        (modo subdominio: admin.aprende.marketing)
//      /:userSlug/lp/:slug              (modo path: aprende.marketing/admin/lp/slug)
// ======================================================

const PublicLandingView: React.FC = () => {
  const { slug, userSlug } = useParams<{ slug: string; userSlug?: string }>();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setError("Slug no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Si viene userSlug en la URL → usamos la ruta by-user (path-based)
        // Si no, usamos la ruta clásica (subdominio)
        const url = userSlug
          ? `${API_BASE}/public/pages/by-user/${encodeURIComponent(
              userSlug
            )}/${encodeURIComponent(slug)}`
          : `${API_BASE}/public/pages/${encodeURIComponent(slug)}`;

        const res = await fetch(url);

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
        <p className="text-gray-400 mb-4">{error || "Landing no disponible."}</p>
      </div>
    );
  }

  const content: any = page.content;
  const hero = content.hero || {};
  const brandName = content.brandName || page.name;
  const testimonials = content.testimonials || [];
  const benefits = content.benefits?.items || [];
  const testimonialTitle = content.testimonialTitle || "Testimonios de clientes";
  const logoSvg: string | undefined = content.logoSvg;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
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

              <div className="flex flex-wrap items-center gap-4">
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
                {content.whatYouWillLearn?.items?.length > 0 && (
                  <p className="text-xs text-gray-400 max-w-xs">
                    {content.whatYouWillLearn.items[0]}
                  </p>
                )}
              </div>

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

      {/* BENEFICIOS */}
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

      {/* TESTIMONIOS */}
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
                    <span className="font-semibold text-white">
                      {t.name}
                    </span>{" "}
                    {t.location ? `· ${t.location}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER SIMPLE */}
      <footer className="border-t border-gray-900 bg-black py-6 text-center text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()}{" "}
          {brandName || "Plataforma de Venta"}. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

// --- WRAPPER PARA EDITOR (maneja :id en la URL) ---
const EditorRouteWrapper = ({
  pages,
  onSave,
}: {
  pages: LandingPage[];
  onSave: (p: LandingPage) => Promise<void>;
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const page = pages.find((p) => String(p.id) === id);

  if (!page) {
    if (pages.length === 0) {
      return (
        <div className="text-white text-center p-10">
          <Loader2 className="animate-spin w-8 h-8 mx-auto" /> Cargando datos...
        </div>
      );
    }
    return (
      <div className="text-white text-center p-10">
        Página no encontrada o ID incorrecto.{" "}
        <button
          onClick={() => navigate("/dashboard/pages")}
          className="underline"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <Editor
      page={page}
      onSave={onSave}
      onBack={() => navigate("/dashboard/pages")}
    />
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Estado de datos
  const [myPages, setMyPages] = useState<LandingPage[]>([]);
  const [myArticles, setMyArticles] = useState<Article[]>([]);

  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Modal de eliminación
  const [pageToDelete, setPageToDelete] = useState<LandingPage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Restaurar sesión al inicio
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("plataformadeventacom_token");

      if (token) {
        try {
          const authUser = await getCurrentUser();
          if (authUser) {
            setUser({
              id: authUser.id.toString(),
              name: authUser.name,
              email: authUser.email,
            });
          }
        } catch (error) {
          console.error("Sesión expirada o inválida");
          logout();
        }
      }

      setAuthLoading(false);
    };

    restoreSession();
  }, []);

  // Cargar datos cuando entramos a /dashboard
  useEffect(() => {
    if (user && location.pathname.startsWith("/dashboard")) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname]);

  const loadData = async () => {
    if (myPages.length > 0) return;

    try {
      setLoading(true);
      const [pages, articles] = await Promise.all([
        api.getPages(),
        api.getArticles(),
      ]);
      setMyPages(pages);
      setMyArticles(articles);

      if (api.isUsingMockData()) {
        const health = await api.testConnection();
        setIsOffline(!health.success);
      } else {
        setIsOffline(false);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setMyPages([]);
    setMyArticles([]);
    navigate("/");
  };

  // --- HANDLERS PÁGINAS ---
  const handlePageGenerated = async (page: LandingPage) => {
    try {
      setLoading(true);
      const savedPage = await api.createPage(page);
      setMyPages((prev) => [...prev, savedPage]);
      setIsOffline(api.isUsingMockData());
      navigate(`/dashboard/editor/${savedPage.id}`);
    } catch {
      alert("Error guardando la página");
    } finally {
      setLoading(false);
    }
  };

  const handlePageSave = async (updatedPage: LandingPage) => {
    try {
      await api.updatePage(updatedPage);
      setMyPages((prev) =>
        prev.map((p) => (p.id === updatedPage.id ? updatedPage : p))
      );
      setIsOffline(api.isUsingMockData());
    } catch {
      alert("Error actualizando la página");
    }
  };

  const confirmDeletePage = async () => {
    if (!pageToDelete) return;
    setDeleting(true);
    try {
      await api.deletePage(pageToDelete.id);
      setMyPages((prev) => prev.filter((p) => p.id !== pageToDelete.id));
      setPageToDelete(null);
    } catch {
      alert("Error eliminando la página.");
    } finally {
      setDeleting(false);
    }
  };

  // --- HANDLERS ARTÍCULOS ---
  const handleArticleSave = async (
    articleData: Omit<Article, "id" | "createdAt">
  ) => {
    try {
      const savedArticle = await api.saveArticle(articleData);
      setMyArticles((prev) => [...prev, savedArticle]);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Ruta protegida
  const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Modal eliminación
  const DeleteModal = () => {
    if (!pageToDelete) return null;
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 text-red-500 font-bold text-lg">
              <AlertTriangle className="w-6 h-6" /> Eliminar Página
            </div>
            <button
              onClick={() => setPageToDelete(null)}
              className="text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-300 mb-6">
            ¿Estás seguro de que quieres eliminar{" "}
            <b>"{pageToDelete.name}"</b>? <br />
            <br />
            Esta acción es irreversible y se perderán todos los datos
            asociados.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPageToDelete(null)}
              disabled={deleting}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-white transition"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDeletePage}
              disabled={deleting}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center gap-2"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Routes>
        {/* LANDINGS PÚBLICAS */}
        {/* Subdominio:   https://admin.aprende.marketing/lp/especialista-cejas */}
        <Route path="/lp/:slug" element={<PublicLandingView />} />
        {/* Path-based:   https://aprende.marketing/admin/lp/especialista-cejas */}
        <Route path="/:userSlug/lp/:slug" element={<PublicLandingView />} />

        {/* RUTAS PÚBLICAS */}
        <Route
          path="/"
          element={<PublicHome user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLoginSubmit} />
            )
          }
        />

        {/* RUTAS PROTEGIDAS (DASHBOARD) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout
                user={user!}
                onLogout={handleLogout}
                isOffline={isOffline}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome pages={myPages} />} />

          <Route
            path="pages"
            element={
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Mis Páginas</h2>
                  <button
                    onClick={() => navigate("/dashboard/generator")}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                  >
                    Crear Nueva
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-20 text-white flex flex-col items-center">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                    <p>Cargando tus proyectos...</p>
                  </div>
                ) : myPages.length === 0 ? (
                  <div className="text-center py-20 bg-gray-900 rounded-xl border border-dashed border-gray-700">
                    <LayoutTemplate className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Aún no has creado ninguna página.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPages.map((page) => (
                      <div
                        key={page.id}
                        className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 hover:border-primary transition group relative"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-white">
                              {page.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {page.niche}
                            </p>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              page.isPublished ? "bg-green-500" : "bg-orange-500"
                            }`}
                          />
                        </div>
                        <div className="text-sm text-gray-400 mb-6 space-y-1">
                          <p>Visitas: {page.visits}</p>
                          <p>Conversiones: {page.conversions}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/editor/${page.id}`)
                            }
                            className="w-full py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 flex items-center justify-center gap-2 group-hover:border-primary group-hover:text-primary transition"
                          >
                            <PenTool className="w-4 h-4" /> Editar Página
                          </button>
                          <button
                            onClick={() => setPageToDelete(page)}
                            className="w-full py-2 border border-red-900/30 rounded-lg text-red-500/70 hover:bg-red-900/10 hover:text-red-500 hover:border-red-900/50 flex items-center justify-center gap-2 transition text-sm"
                          >
                            <Trash2 className="w-4 h-4" /> Eliminar Página
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            }
          />

          <Route
            path="generator"
            element={<Generator onPageGenerated={handlePageGenerated} />}
          />
          <Route path="whatsapp" element={<WhatsAppCRM />} />
          <Route path="email" element={<EmailMarketing />} />
          <Route
            path="content-creator"
            element={<ContentGenerator onSave={handleArticleSave} />}
          />
          <Route
            path="articles"
            element={
              <ArticlesList
                articles={myArticles}
                onCreateNew={() => navigate("/dashboard/content-creator")}
              />
            }
          />

          <Route
            path="copy-pro"
            element={
              <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-xl border border-dashed border-gray-700 p-12 text-center">
                <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                  <PenTool className="w-10 h-10 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  CopySell Pro
                </h2>
                <p className="text-gray-400 max-w-md">Próximamente</p>
              </div>
            }
          />

          <Route
            path="editor/:id"
            element={
              <EditorRouteWrapper pages={myPages} onSave={handlePageSave} />
            }
          />
        </Route>

        {/* CUALQUIER OTRA RUTA → HOME */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <DeleteModal />
    </>
  );
};

export default App;
