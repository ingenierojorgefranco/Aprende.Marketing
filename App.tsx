import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { PublicHome } from './components/PublicHome';
import { Login } from './components/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardHome } from './components/DashboardHome';
import { Generator } from './components/Generator';
import { Editor } from './components/Editor';
import { WhatsAppCRM } from './components/WhatsAppCRM';
import { EmailMarketing } from './components/EmailMarketing';
import { ContentGenerator } from './components/ContentGenerator';
import { ArticlesList } from './components/ArticlesList';
import { User, LandingPage, Article } from './types';
import { Loader2, PenTool, LayoutTemplate } from 'lucide-react';
import { api } from './services/api';
import { getCurrentUser, logout } from './services/auth';

// --- WRAPPER FOR EDITOR TO HANDLE URL PARAMS ---
// Using regular function instead of React.FC to avoid implicit children requirement in some TS configs
const EditorRouteWrapper = ({ 
  pages, 
  onSave 
}: { 
  pages: LandingPage[], 
  onSave: (p: LandingPage) => Promise<void> 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Ensure pages are loaded before finding
  const page = pages.find(p => p.id === id);

  if (!page) {
     if (pages.length === 0) {
        return <div className="text-white text-center p-10"><Loader2 className="animate-spin w-8 h-8 mx-auto"/> Cargando datos...</div>;
     }
    return <div className="text-white text-center p-10">Página no encontrada o ID incorrecto. <button onClick={() => navigate('/dashboard/pages')} className="underline">Volver</button></div>;
  }

  return (
    <Editor 
      page={page} 
      onSave={onSave} 
      onBack={() => navigate('/dashboard/pages')} 
    />
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  // Data State
  const [myPages, setMyPages] = useState<LandingPage[]>([]);
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Restaurar sesión al cargar la app
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('plataformadeventacom_token');
      
      if (token) {
        try {
          const authUser = await getCurrentUser();
          if (authUser) {
             setUser({
               id: authUser.id.toString(),
               name: authUser.name,
               email: authUser.email
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

  // 2. Cargar datos si estamos en una ruta protegida (dashboard)
  useEffect(() => {
    if (user && location.pathname.startsWith('/dashboard')) {
      loadData();
    }
  }, [user, location.pathname]);

  const loadData = async () => {
    // Si ya cargamos datos, no recargamos agresivamente a menos que sea necesario
    // Pero si myPages está vacío, intentamos cargar
    if (myPages.length > 0) return;

    try {
      setLoading(true);
      const [pages, articles] = await Promise.all([
          api.getPages(),
          api.getArticles()
      ]);
      setMyPages(pages);
      setMyArticles(articles);
      setIsOffline(api.isUsingMockData());
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (loggedInUser: User) => {
    setUser(loggedInUser);
    // La redirección ahora se maneja en el componente Login o aquí si fuese necesario
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setMyPages([]);
    setMyArticles([]);
    navigate('/');
  };

  // --- PAGE HANDLERS ----
  const handlePageGenerated = async (page: LandingPage) => {
    try {
        setLoading(true);
        const savedPage = await api.createPage(page);
        setMyPages(prev => [...prev, savedPage]);
        setIsOffline(api.isUsingMockData());
        // Navegar al editor con la nueva ID
        navigate(`/dashboard/editor/${savedPage.id}`);
    } catch (e) {
        alert("Error guardando la página");
    } finally {
        setLoading(false);
    }
  };

  const handlePageSave = async (updatedPage: LandingPage) => {
    try {
        await api.updatePage(updatedPage);
        setMyPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
        setIsOffline(api.isUsingMockData());
    } catch (e) {
        alert("Error actualizando la página");
    }
  };

  // --- ARTICLE HANDLERS ---
  const handleArticleSave = async (articleData: Omit<Article, 'id' | 'createdAt'>) => {
     try {
         const savedArticle = await api.saveArticle(articleData);
         setMyArticles(prev => [...prev, savedArticle]);
     } catch(e) {
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

  // --- PROTECTED ROUTE COMPONENT ---
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<PublicHome user={user} onLogout={handleLogout} />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLoginSubmit} />} />

      {/* RUTAS PROTEGIDAS (DASHBOARD) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout user={user!} onLogout={handleLogout} isOffline={isOffline} />
        </ProtectedRoute>
      }>
          <Route index element={<DashboardHome pages={myPages} />} />
          
          <Route path="pages" element={
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Mis Páginas</h2>
                  <button onClick={() => navigate('/dashboard/generator')} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition">Crear Nueva</button>
                </div>
                {loading ? (
                    <div className="text-center py-20 text-white flex flex-col items-center">
                      <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary"/>
                      <p>Cargando tus proyectos...</p>
                    </div>
                ) : myPages.length === 0 ? (
                  <div className="text-center py-20 bg-gray-900 rounded-xl border border-dashed border-gray-700">
                    <LayoutTemplate className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aún no has creado ninguna página.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPages.map(page => (
                      <div key={page.id} className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 hover:border-primary transition group">
                          <div className="flex justify-between items-start mb-4">
                            <div><h3 className="font-bold text-lg text-white">{page.name}</h3><p className="text-xs text-gray-500">{page.niche}</p></div>
                            <div className={`w-3 h-3 rounded-full ${page.isPublished ? 'bg-green-500' : 'bg-orange-500'}`} />
                          </div>
                          <div className="text-sm text-gray-400 mb-6 space-y-1">
                            <p>Visitas: {page.visits}</p>
                            <p>Conversiones: {page.conversions}</p>
                          </div>
                          <button onClick={() => navigate(`/dashboard/editor/${page.id}`)} className="w-full py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 flex items-center justify-center gap-2 group-hover:border-primary group-hover:text-primary transition">
                            <PenTool className="w-4 h-4" /> Editar Página
                          </button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          } />
          
          <Route path="generator" element={<Generator onPageGenerated={handlePageGenerated} />} />
          <Route path="whatsapp" element={<WhatsAppCRM />} />
          <Route path="email" element={<EmailMarketing />} />
          <Route path="content-creator" element={<ContentGenerator onSave={handleArticleSave} />} />
          <Route path="articles" element={<ArticlesList articles={myArticles} onCreateNew={() => navigate('/dashboard/content-creator')} />} />
          
          <Route path="copy-pro" element={
            <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-xl border border-dashed border-gray-700 p-12 text-center">
               <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mb-6"><PenTool className="w-10 h-10 text-purple-400" /></div>
               <h2 className="text-3xl font-bold text-white mb-2">CopySell Pro</h2>
               <p className="text-gray-400 max-w-md">Próximamente</p>
            </div>
          } />
          
          {/* El Editor puede estar dentro del layout, pero ocupando todo el espacio disponible */}
          <Route path="editor/:id" element={<EditorRouteWrapper pages={myPages} onSave={handlePageSave} />} />
      </Route>

      {/* CUALQUIER OTRA RUTA -> REDIRIGIR */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;