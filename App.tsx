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
import { PublicLandingView } from "./components/PublicLandingView";
import { ProjectWizard } from "./components/ProjectWizard";
import { ProjectsList } from "./components/ProjectsList";

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

// Componente 404 para Debug
const NotFoundPage = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">404 - Ruta no encontrada</h1>
      <p className="text-gray-400 mb-6">
        No se encontró contenido para esta dirección.
      </p>

      <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-300 border border-gray-800 mb-6 max-w-lg break-all">
        <p>
          <span className="text-blue-400">Path actual:</span>{" "}
          {location.pathname}
        </p>
      </div>

      <a
        href="/"
        className="px-6 py-3 bg-primary rounded-lg font-bold hover:bg-indigo-600 transition"
      >
        Ir al Inicio
      </a>
    </div>
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

  // --- DETECCIÓN DE DOMINIO PERSONALIZADO → SLUG DE LANDING ---
  const host =
    typeof window !== "undefined" ? window.location.hostname : "";
  const CUSTOM_DOMAIN_LANDING_MAP: Record<string, string> = {
    "bajardepeso.online": "especialista-cejas",
    "www.bajardepeso.online": "especialista-cejas",
  };
  const customLandingSlug = CUSTOM_DOMAIN_LANDING_MAP[host];

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
    articleData: any
  ) => {
    try {
      if (articleData.id) {
          // UPDATE
          await api.updateArticle(articleData.id, articleData);
          // Actualizar lista local
          setMyArticles((prev) => prev.map(a => a.id === articleData.id ? { ...a, ...articleData } : a));
      } else {
          // CREATE
          const savedArticle = await api.saveArticle(articleData);
          setMyArticles((prev) => [...prev, savedArticle]);
      }
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
        {/* RUTA PÚBLICA PARA LANDING: SOPORTA /admin/lp/:slug Y /lp/:slug */}
        <Route path="/admin/lp/:slug" element={<PublicLandingView />} />
        <Route path="/lp/:slug" element={<PublicLandingView />} />

        {/* RUTA PRINCIPAL:
            - Dominio principal → Home pública
            - Dominio personalizado (ej: bajardepeso.online) → renderiza la landing asignada directamente
        */}
        <Route
          path="/"
          element={
            customLandingSlug ? (
              <PublicLandingView forcedSlug={customLandingSlug} />
            ) : (
              <PublicHome user={user} onLogout={handleLogout} />
            )
          }
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

          {/* PROJECT ROUTES */}
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/create" element={<ProjectWizard />} />
          <Route path="projects/edit/:id" element={<ProjectWizard />} />

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
                    {myPages.map((page) => {
                      const baseSlug = page.subdomain
                        ? page.subdomain.split(".")[0]
                        : page.id;
                      const publicUrl = `/admin/lp/${baseSlug}`;

                      return (
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
                            {/* Etiqueta de Estado Mejorada */}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                page.isPublished
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              }`}
                            >
                              {page.isPublished ? "Publicada" : "En Borrador"}
                            </span>
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

                            {/* Botón para ver la Landing Page Publicada */}
                            <a
                              href={publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 flex items-center justify-center gap-2 hover:text-white transition text-sm"
                            >
                              <LayoutTemplate className="w-4 h-4" /> Ver Online
                            </a>

                            <button
                              onClick={() => setPageToDelete(page)}
                              className="w-full py-2 border border-red-900/30 rounded-lg text-red-500/70 hover:bg-red-900/10 hover:text-red-500 hover:border-red-900/50 flex items-center justify-center gap-2 transition text-sm"
                            >
                              <Trash2 className="w-4 h-4" /> Eliminar Página
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
            path="articles/edit/:id"
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

        {/* CUALQUIER OTRA RUTA → 404 (EVITA LOOPS) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <DeleteModal />
    </>
  );
};

export default App;