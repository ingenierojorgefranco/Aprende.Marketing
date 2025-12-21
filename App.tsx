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

// Dashboard CRM
import { CRM_Layout } from "./components/dashboard/crm/CRM_Layout";

import { User, LandingPage } from "./types";
import {
  Loader2,
  PenTool,
  AlertTriangle,
} from "lucide-react";
import { api } from "./services/api";
import { getCurrentUser, logout } from "./services/auth";

// --- WRAPPER PARA EDITOR (Carga de datos por ID desde API) ---
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
              console.error("Error cargando página en editor:", e);
          } finally {
              setLoading(false);
          }
      };
      fetchPage();
  }, [id]);

  const handleSave = async (updatedPage: LandingPage) => {
      try {
          await api.updatePage(updatedPage);
          setPage(updatedPage);
      } catch (e) {
          alert("Error actualizando la página");
      }
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
          <Loader2 className="animate-spin w-10 h-10 text-primary mb-4" />
          <p>Iniciando Editor Pro...</p>
        </div>
      );
  }

  if (!page) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-10 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Página no encontrada</h2>
          <p className="text-gray-400 mb-6">El ID especificado no existe o no tienes permisos.</p>
          <button onClick={() => navigate("/dashboard/pages")} className="px-6 py-2 bg-primary rounded-lg font-bold">Volver a Mis Páginas</button>
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

// Componente 404
const NotFoundPage = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">404 - Ruta no encontrada</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        Lo sentimos, la dirección que buscas no existe o ha sido movida.
      </p>

      <div className="bg-gray-900 p-4 rounded-lg font-mono text-xs text-gray-300 border border-gray-800 mb-8 max-w-lg break-all">
        <p><span className="text-blue-400">Path:</span> {location.pathname}</p>
      </div>

      <button
        onClick={() => window.location.href = '/'}
        className="px-8 py-3 bg-primary rounded-xl font-bold hover:bg-indigo-600 transition shadow-lg shadow-primary/20"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [domainSlug, setDomainSlug] = useState<string | null>(null);
  const [domainLoading, setDomainLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // --- DETECCIÓN DINÁMICA DE DOMINIO PERSONALIZADO ---
  useEffect(() => {
    const resolveDomain = async () => {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      const systemDomains = ["localhost", "127.0.0.1", "aprende.marketing", "plataformadeventa.com", "generatorlanding.com"];
      const isSystem = systemDomains.some(d => hostname.includes(d));

      if (!isSystem) {
        try {
          const res = await fetch(`/api/public/pages/by-domain?domain=${hostname}`);
          if (res.ok) {
            const data = await res.json();
            // Asumimos que el backend retorna el objeto de la página y usamos su subdomain/slug
            setDomainSlug(data.subdomain);
          }
        } catch (e) {
          console.error("Error resolviendo dominio dinámico:", e);
        }
      }
      setDomainLoading(false);
    };
    resolveDomain();
  }, []);

  // Restaurar sesión
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
          logout();
        }
      }
      setAuthLoading(false);
    };
    restoreSession();
  }, []);

  // Check Modo Offline
  useEffect(() => {
      if (user && location.pathname.startsWith("/dashboard")) {
          setIsOffline(api.isUsingMockData());
      }
  }, [user, location.pathname]);

  const handleLoginSubmit = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch (e) {}
    logout();
    setUser(null);
    navigate("/");
  };

  const handlePageGenerated = async (page: LandingPage) => {
    try {
      const savedPage = await api.createPage(page);
      navigate(`/dashboard/editor/${savedPage.id}`);
    } catch (e: any) {
      alert(`Error guardando la página: ${e.message}`);
    }
  };

  const handleArticleSave = async (articleData: any) => {
    try {
      if (articleData.id) {
          await api.updateArticle(articleData.id, articleData);
      } else {
          await api.saveArticle(articleData);
      }
    } catch (e) {
      throw e; 
    }
  };

  if (authLoading || domainLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
    if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
  };

  return (
    <>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/admin/lp/:slug/*" element={<PublicLandingView />} />
        <Route path="/lp/:slug/*" element={<PublicLandingView />} />

        {/* DOMINIOS PERSONALIZADOS DINÁMICOS */}
        {domainSlug && (
            <>
              <Route path="/blog/*" element={<PublicLandingView forcedSlug={domainSlug} />} />
              <Route path="/gracias" element={<PublicLandingView forcedSlug={domainSlug} />} />
            </>
        )}

        <Route
          path="/"
          element={
            domainSlug ? (
              <PublicLandingView forcedSlug={domainSlug} />
            ) : (
              <PublicHome user={user} onLogout={handleLogout} />
            )
          }
        />

        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLoginSubmit} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLoginSubmit} />} />

        {/* RUTAS DEL DASHBOARD (PROTEGIDAS) */}
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

          {/* ADMIN */}
          <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
          <Route path="admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />
          <Route path="admin/plans" element={<AdminRoute><AdminPlans /></AdminRoute>} />
          <Route path="admin/logs" element={<AdminRoute><AdminLogs /></AdminRoute>} />

          {/* ACADEMIA */}
          <Route path="training/:moduleId" element={<TrainingViewer />} />

          {/* CRM */}
          <Route path="crm" element={<CRM_Layout />} />

          {/* PROYECTOS */}
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/create" element={<ProjectWizard />} />
          <Route path="projects/edit/:id" element={<ProjectWizard />} />
          <Route path="projects/:id/strategy" element={<ProjectStrategyDashboard />} />

          {/* PÁGINAS */}
          <Route path="pages" element={<MyPages />} />
          <Route path="generator" element={<Generator onPageGenerated={handlePageGenerated} />} />
          <Route path="editor/:id" element={<EditorRouteWrapper />} />

          {/* CONTENIDO SEO */}
          <Route path="articles" element={<ArticlesList onCreateNew={() => navigate("/dashboard/content-creator")} />} />
          <Route path="content-creator" element={<ContentGenerator onSave={handleArticleSave} />} />
          <Route path="articles/edit/:id" element={<ContentGenerator onSave={handleArticleSave} />} />

          {/* HERRAMIENTAS ADICIONALES */}
          <Route path="whatsapp" element={<WhatsAppCRM />} />
          <Route path="email" element={<EmailMarketing />} />
          <Route path="copy-pro" element={
              <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-xl border border-dashed border-gray-700 p-12 text-center">
                <PenTool className="w-16 h-16 text-purple-400 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-2">CopySell Pro</h2>
                <p className="text-gray-400 max-w-md">Próximamente: El generador de guiones de ventas más avanzado del mercado.</p>
              </div>
          } />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;