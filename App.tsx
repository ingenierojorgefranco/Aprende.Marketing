

import React, { useState, useEffect } from 'react';
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
import { ViewState, User, LandingPage, Article } from './types';
import { LayoutTemplate, Pencil, Loader2, PenTool, WifiOff, BookOpen } from 'lucide-react';
import { api } from './services/api';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.PUBLIC_HOME);
  const [user, setUser] = useState<User | null>(null);
  
  // Data State
  const [myPages, setMyPages] = useState<LandingPage[]>([]);
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Cargar datos al iniciar sesión
  useEffect(() => {
    if (user && view !== ViewState.PUBLIC_HOME && view !== ViewState.LOGIN) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
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

  const handleLoginClick = () => {
    setView(ViewState.LOGIN);
  };

  const handleLoginSubmit = () => {
    const demoUser: User = {
      id: '1',
      name: 'Admin User',
      email: 'admin@generatorlanding.com'
    };
    setUser(demoUser);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setView(ViewState.PUBLIC_HOME);
  };

  // --- PAGE HANDLERS ---
  const handlePageGenerated = async (page: LandingPage) => {
    try {
        setLoading(true);
        const savedPage = await api.createPage(page);
        setMyPages([...myPages, savedPage]);
        setSelectedPageId(savedPage.id);
        setView(ViewState.EDITOR);
        setIsOffline(api.isUsingMockData());
    } catch (e) {
        alert("Error guardando la página");
    } finally {
        setLoading(false);
    }
  };

  const handlePageSave = async (updatedPage: LandingPage) => {
    try {
        await api.updatePage(updatedPage);
        setMyPages(myPages.map(p => p.id === updatedPage.id ? updatedPage : p));
        setIsOffline(api.isUsingMockData());
    } catch (e) {
        alert("Error actualizando la página");
    }
  };

  // --- ARTICLE HANDLERS ---
  const handleArticleSave = async (articleData: Omit<Article, 'id' | 'createdAt'>) => {
     try {
         const savedArticle = await api.saveArticle(articleData);
         setMyArticles([...myArticles, savedArticle]);
     } catch(e) {
         console.error(e);
         throw e;
     }
  };

  const renderContent = () => {
    if (view === ViewState.PUBLIC_HOME) {
      return <PublicHome onLoginClick={handleLoginClick} />;
    }

    if (view === ViewState.LOGIN) {
      return <Login onLogin={handleLoginSubmit} onBack={() => setView(ViewState.PUBLIC_HOME)} />;
    }

    // Require User for other views
    if (!user) {
      return <PublicHome onLoginClick={handleLoginClick} />;
    }

    if (view === ViewState.EDITOR && selectedPageId) {
      const page = myPages.find(p => p.id === selectedPageId);
      if (page) {
        return (
          <Editor 
            page={page} 
            onSave={handlePageSave} 
            onBack={() => setView(ViewState.MY_PAGES)} 
          />
        );
      }
    }

    return (
      <DashboardLayout
        user={user}
        currentView={view}
        onNavigate={setView}
        onLogout={handleLogout}
      >
        {isOffline && (
            <div className="mb-4 bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2">
                <WifiOff className="w-4 h-4" />
                <span><strong>Modo Offline:</strong> No se pudo conectar a la Base de Datos. Usando almacenamiento local temporal.</span>
            </div>
        )}

        {view === ViewState.DASHBOARD && <DashboardHome pages={myPages} />}
        
        {view === ViewState.GENERATOR && <Generator onPageGenerated={handlePageGenerated} />}
        
        {view === ViewState.WHATSAPP && <WhatsAppCRM />}
        
        {view === ViewState.EMAIL_MARKETING && <EmailMarketing />}

        {/* --- ARTICLES SECTION --- */}
        {view === ViewState.ARTICLE_CREATOR && <ContentGenerator onSave={handleArticleSave} />}
        {view === ViewState.ARTICLES_LIST && (
            <ArticlesList 
                articles={myArticles} 
                onCreateNew={() => setView(ViewState.ARTICLE_CREATOR)} 
            />
        )}

        {view === ViewState.COPY_PRO && (
          <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-xl border border-dashed border-gray-700 p-12 text-center">
             <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <PenTool className="w-10 h-10 text-purple-400" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">CopySell Pro</h2>
             <p className="text-gray-400 max-w-md">
               Generador avanzado de textos publicitarios, correos y anuncios.
               <br/> <span className="text-primary text-sm font-bold uppercase tracking-wider mt-2 inline-block">Próximamente</span>
             </p>
          </div>
        )}

        {view === ViewState.MY_PAGES && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Mis Páginas</h2>
              <button 
                onClick={() => setView(ViewState.GENERATOR)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
              >
                Crear Nueva
              </button>
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
                        <div>
                          <h3 className="font-bold text-lg text-white">{page.name}</h3>
                          <p className="text-xs text-gray-500">{page.niche}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${page.isPublished ? 'bg-green-500' : 'bg-orange-500'}`} />
                      </div>
                      <div className="text-sm text-gray-400 mb-6 space-y-1">
                        <p>Visitas: {page.visits}</p>
                        <p>Conversiones: {page.conversions}</p>
                        <p className="truncate text-xs text-blue-400">{page.subdomain}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPageId(page.id);
                          setView(ViewState.EDITOR);
                        }}
                        className="w-full py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 flex items-center justify-center gap-2 group-hover:border-primary group-hover:text-primary transition"
                      >
                        <Pencil className="w-4 h-4" /> Editar Página
                      </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </DashboardLayout>
    );
  };

  return renderContent();
};

export default App;