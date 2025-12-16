
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
import { Register } from "./components/Register";
import { PublicLandingView } from "./components/PublicLandingView";

// Dashboard Core
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { DashboardHome } from "./components/dashboard/DashboardHome";

// Dashboard Admin
import { AdminPanel } from "./components/dashboard/admin/AdminPanel";
import { AdminCourses } from "./components/dashboard/admin/AdminCourses";
import { AdminComments } from "./components/dashboard/admin/AdminComments";
import { AdminPlans } from "./components/dashboard/admin/AdminPlans"; 
import { AdminLogs } from "./components/dashboard/admin/AdminLogs";

// Dashboard Training
import { TrainingViewer } from "./components/dashboard/training/TrainingViewer";

// Dashboard Editor
import { Editor } from "./components/dashboard/editor/Editor";

// Dashboard Tools
import { Generator } from "./components/dashboard/tools/Generator";
import { WhatsAppCRM } from "./components/dashboard/tools/WhatsAppCRM";
import { EmailMarketing } from "./components/dashboard/tools/EmailMarketing";
import { ContentGenerator } from "./components/dashboard/tools/ContentGenerator";
import { ArticlesList } from "./components/dashboard/tools/ArticlesList";
import { ProjectWizard } from "./components/dashboard/tools/ProjectWizard";
import { ProjectsList } from "./components/dashboard/tools/ProjectsList";
import { MyPages } from "./components/dashboard/tools/MyPages";
import { ProjectStrategyDashboard } from "./components/dashboard/tools/ProjectStrategyDashboard";

// Dashboard CRM (NUEVO)
import { CRM_Layout } from "./components/dashboard/crm/CRM_Layout";

import { User, LandingPage, Article } from "./types";
import {
  Loader2,
  PenTool,
  AlertTriangle,
} from "lucide-react";
import { api } from "./services/api";
import { getCurrentUser, logout } from "./services/auth";

// --- WRAPPER PARA EDITOR (Lazy Load by ID) ---
const EditorRouteWrapper = () => {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchPage = async () => {
          if (!id) return;
          try {
              const p = await api.getPageById(id);
              setPage(p);
          } catch (e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      };
      fetchPage();
  }, [id]);

  const handleSave = async (updatedPage: LandingPage) => {
      try {
          await api.updatePage(updatedPage);
          setPage(updatedPage); // Update local state
      } catch (e) {
          alert("Error actualizando la página");
      }
  };

  if (loading) {
      return <div className="text-white text-center p-20"><Loader2 className="animate-spin w-8 h-8 mx-auto" /> Cargando editor...</div>;
  }

  if (!page) {
      return (
        <div className="text-white text-center p-10">
          Página no encontrada o ID incorrecto.{" "}
          <button onClick={() => navigate("/dashboard/pages")} className="underline">Volver</button>
        </div>
      );
  }

  return (
    <Editor
      page={page}
      onSave={handleSave}
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
  const [isOffline, setIsOffline] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // --- DETECCIÓN DE DOMINIO PERSONALIZADO → SLUG DE LANDING ---
  const host = typeof window !== "undefined" ? window.location.hostname : "";
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
              role: (authUser as any).role,
              planLimits: (authUser as any).planLimits,
              avatarUrl: (authUser as any).avatarUrl,
              birthDate: (authUser as any).birthDate,
              createdAt: (authUser as any).createdAt
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

  // Check connection status lightly
  useEffect(() => {
      if (user && location.pathname.startsWith("/dashboard")) {
          if (api.isUsingMockData()) {
              setIsOffline(true);
          } else {
              setIsOffline(false); 
          }
      }
  }, [user, location.pathname]);

  const handleLoginSubmit = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try {
        await api.logout();
    } catch (e) {
        console.warn("Logout log failed", e);
    }
    logout();
    setUser(null);
    navigate("/");
  };

  // --- HANDLERS PÁGINAS ---
  const handlePageGenerated = async (page: LandingPage) => {
    try {
      const savedPage = await api.createPage(page);
      setIsOffline(api.isUsingMockData());
      navigate(`/dashboard/editor/${savedPage.id}`);
    } catch (e: any) {
      alert(`Error guardando la página: ${e.message}`);
    }
  };

  // --- HANDLERS ARTÍCULOS ---
  const handleArticleSave = async (articleData: any) => {
    try {
      if (articleData.id) {
          await api.updateArticle(articleData.id, articleData);
      } else {
          await api.saveArticle(articleData);
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

  // Ruta Admin
  const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  };

  return (
    <>
      <Routes>
        <Route path="/admin/lp/:slug/*" element={<PublicLandingView />} />
        <Route path="/lp/:slug/*" element={<PublicLandingView />} />

        {/* RUTAS ESPECÍFICAS PARA DOMINIO PERSONALIZADO (Evitar 404) */}
        {customLandingSlug && (
            <>
              <Route path="/blog" element={<PublicLandingView forcedSlug={customLandingSlug} />} />
              <Route path="/blog/*" element={<PublicLandingView forcedSlug={customLandingSlug} />} />
              <Route path="/gracias" element={<PublicLandingView forcedSlug={customLandingSlug} />} />
            </>
        )}

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

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register onLogin={handleLoginSubmit} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout
                user={user!}
                onLogout={handleLogout}
                isOffline={isOffline}
                onUpdateUser={setUser}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />

          {/* ADMIN ROUTES */}
          <Route path="admin" element={
              <AdminRoute>
                  <AdminPanel />
              </AdminRoute>
          } />
          <Route path="admin/courses" element={
              <AdminRoute>
                  <AdminCourses />
              </AdminRoute>
          } />
          <Route path="admin/comments" element={
              <AdminRoute>
                  <AdminComments />
              </AdminRoute>
          } />
          <Route path="admin/plans" element={
              <AdminRoute>
                  <AdminPlans />
              </AdminRoute>
          } />
          <Route path="admin/logs" element={
              <AdminRoute>
                  <AdminLogs />
              </AdminRoute>
          } />

          {/* TRAINING ROUTES */}
          <Route path="training/:moduleId" element={<TrainingViewer />} />

          {/* CRM ROUTE (NUEVO) */}
          <Route path="crm" element={<CRM_Layout />} />

          {/* PROJECT ROUTES */}
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/create" element={<ProjectWizard />} />
          <Route path="projects/edit/:id" element={<ProjectWizard />} />
          <Route path="projects/:id/strategy" element={<ProjectStrategyDashboard />} />

          {/* PAGES ROUTE */}
          <Route path="pages" element={<MyPages />} />

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

          {/* EDITOR ROUTE */}
          <Route
            path="editor/:id"
            element={<EditorRouteWrapper />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;