import React, { useState, useEffect, Suspense } from 'react';
import { User } from '../../types';
import { LayoutDashboard, PlusCircle, MessageSquare, Mail, LogOut, FileText, Menu, X, ChevronDown, ChevronRight, PenTool, Wrench, BookOpen, List, Briefcase, Plus, Database, Shield, GraduationCap, PlayCircle, Bot, Video, Users, Sparkles, Crown, CreditCard, Settings, Loader2, Activity } from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { api } from '../../services/api';
import { UpgradeModal } from './UpgradeModal';
import { SubscriptionSuccessModal } from './SubscriptionSuccessModal';
import { getCurrentUser } from '../../services/auth';

// Lazy Load User Profile Modal
const UserProfileModal = React.lazy(() => import('./UserProfileModal'));

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  isOffline?: boolean;
  onUpdateUser?: (updatedUser: User) => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  path?: string;
  subItems?: { label: string; path: string; icon?: any }[];
  adminOnly?: boolean;
};

export const DashboardLayout = ({
  user,
  onLogout,
  isOffline,
  onUpdateUser
}: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('mid-landing');
  const [courseItems, setCourseItems] = useState<{ label: string; path: string; icon: any }[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Context Data State
  const [projectCount, setProjectCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Load dynamic courses menu & usage stats
  useEffect(() => {
      const loadData = async () => {
          try {
              // Courses for menu
              const list = await api.getCoursesList();
              const items = list.map((c: any) => ({
                  label: c.title,
                  path: `/dashboard/training/${c.slug}`,
                  icon: PlayCircle 
              }));
              setCourseItems(items);

              // Usage Stats for Limits
              const [projects, pages] = await Promise.all([
                  api.getProjects(),
                  api.getPages()
              ]);
              setProjectCount(projects.length);
              setPageCount(pages.length);

          } catch (e) {
              console.error("Error loading dashboard data", e);
          }
      };
      loadData();
  }, []); // Run once on mount

  // Check for Subscription Success
  useEffect(() => {
      const params = new URLSearchParams(location.search);
      if (params.get('success') === 'true') {
          setShowSuccessModal(true);
          // Clean URL without reloading page
          window.history.replaceState({}, '', location.pathname);
          
          // Refresh User Data (Permissions/Plan) immediately
          getCurrentUser().then(authUser => {
              if (authUser && onUpdateUser) {
                  // Map AuthUser to User structure if needed, or rely on implicit compatibility
                  // Re-fetching full user from API to be safe about planLimits
                  api.getAdminUserResources(authUser.id.toString(), 'projects').then(() => {
                       // Trigger a full reload of user object from server logic if possible
                       // For now, we simulate update or rely on onUpdateUser if passed properly
                       // Since getCurrentUser hits /auth/me which returns full object:
                       const updatedUser: User = {
                           id: authUser.id.toString(),
                           name: authUser.name,
                           email: authUser.email,
                           role: (authUser as any).role,
                           planLimits: (authUser as any).planLimits,
                           avatarUrl: (authUser as any).avatarUrl,
                           birthDate: (authUser as any).birthDate
                       };
                       onUpdateUser(updatedUser);
                  });
              }
          }).catch(console.error);
      }
  }, [location.search, onUpdateUser]);

  const menuStructure: MenuItem[] = [
    { 
      id: 'dashboard', 
      label: 'Panel Principal', 
      icon: LayoutDashboard, 
      path: '/dashboard'
    },
    {
      id: 'admin',
      label: 'Administración',
      icon: Shield,
      adminOnly: true,
      subItems: [
          { label: 'Usuarios', path: '/dashboard/admin', icon: Users },
          { label: 'Planes y Precios', path: '/dashboard/admin/plans', icon: CreditCard },
          { label: 'Gestionar Cursos', path: '/dashboard/admin/courses', icon: Video },
          { label: 'Gestionar Comentarios', path: '/dashboard/admin/comments', icon: MessageSquare },
          { label: 'Logs del Sistema', path: '/dashboard/admin/logs', icon: Activity }
      ]
    },
    {
      id: 'training',
      label: 'Entrenamiento',
      icon: GraduationCap,
      subItems: courseItems
    },
    {
      id: 'projects',
      label: 'Mis Proyectos',
      icon: Briefcase,
      subItems: [
        { label: 'Ver Proyectos', path: '/dashboard/projects', icon: List },
        { label: 'Crear Proyecto', path: '/dashboard/projects/create', icon: Plus }
      ]
    },
    {
      id: 'mid-landing',
      label: 'Mis Páginas',
      icon: FileText,
      subItems: [
        { label: 'Ver Páginas', path: '/dashboard/pages', icon: FileText },
        { label: 'Nueva Página', path: '/dashboard/generator', icon: PlusCircle }
      ]
    },
    {
      id: 'content-gen',
      label: 'Generador de Contenido',
      icon: BookOpen,
      subItems: [
        { label: 'Artículos SEO', path: '/dashboard/articles', icon: List },
        { label: 'Redactar Nuevo', path: '/dashboard/content-creator', icon: PlusCircle }
      ]
    },
    {
      id: 'tools',
      label: 'Herramientas Pro',
      icon: Wrench,
      subItems: [
        { label: 'Email Marketing', path: '/dashboard/email', icon: Mail },
        { label: 'WhatsApp CRM', path: '/dashboard/whatsapp', icon: MessageSquare },
        { label: 'CopySell AI', path: '/dashboard/copy-pro', icon: PenTool }
      ]
    }
  ];

  const toggleSubMenu = (id: string) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  useEffect(() => {
    menuStructure.forEach(item => {
      if (item.subItems) {
        const isActive = item.subItems.some(sub => location.pathname === sub.path);
        if (isActive) {
          setExpandedMenu(item.id);
        }
      }
    });
  }, [location.pathname, courseItems]);

  const NavItemRender: React.FC<{ item: MenuItem }> = ({ item }) => {
    if (item.adminOnly && user.role !== 'admin') return null;

    const hasSubItems = !!item.subItems && item.subItems.length > 0; 
    const isExpanded = expandedMenu === item.id;
    const isActive = item.path === location.pathname || (hasSubItems && item.subItems?.some(sub => sub.path === location.pathname));

    return (
      <div className="mb-2">
        <div
          onClick={() => {
            if (hasSubItems) {
              toggleSubMenu(item.id);
            } else if (item.path) {
              navigate(item.path);
              setMobileMenuOpen(false);
            }
          }}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-colors cursor-pointer ${
            isActive && !hasSubItems
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-4">
            <item.icon className="w-6 h-6" />
            <span className="font-semibold text-base">{item.label}</span>
          </div>
          {hasSubItems && (
            isExpanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {hasSubItems && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="ml-6 pl-4 border-l-2 border-gray-800 space-y-1">
              {item.subItems?.map((sub, idx) => (
                <Link
                  key={idx}
                  to={sub.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                    location.pathname === sub.path
                      ? 'text-primary bg-primary/10 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {sub.icon && <sub.icon className="w-4 h-4" />}
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Plan Logic for Widget
  const currentPlan = user.planLimits?.planName || 'starter';
  const isMax = currentPlan === 'max';
  const isPro = currentPlan === 'pro';

  return (
    <div className="h-screen overflow-hidden bg-black text-gray-200 flex font-sans">
      <aside className="hidden md:flex flex-col w-[25rem] bg-[#0a0a0a] border-r border-gray-800 shadow-2xl z-20">
        <div className="p-8 pb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Aprende.<span className="text-primary">Marketing</span></h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5 font-bold">Panel de Control</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuStructure.map(item => (
            <NavItemRender key={item.id} item={item} />
          ))}
        </nav>

        {/* Upgrade Widget */}
        {!isMax && (
            <div className="px-6 pb-6 pt-4">
                <div className={`p-5 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group ${isPro ? 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40' : 'bg-gradient-to-br from-orange-900/40 to-red-900/40'}`}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className={`p-2 rounded-lg flex items-center justify-center shadow-lg ${isPro ? 'bg-purple-500 text-white' : 'bg-orange-500 text-white'}`}>
                            {isPro ? <Crown className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        </div>
                        <span className="font-bold text-white text-base tracking-wide">
                            {isPro ? 'Plan Negocios' : 'Plan Pro'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed font-light">
                        {isPro ? 'Para agencias que necesitan escalar sin límites.' : 'Desbloquea dominios, IA avanzada y WhatsApp.'}
                    </p>
                    <button 
                        onClick={() => setShowUpgradeModal(true)}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition shadow-lg transform hover:scale-[1.02] relative z-10 uppercase tracking-wider ${isPro ? 'bg-white text-purple-950 hover:bg-purple-50' : 'bg-white text-orange-950 hover:bg-orange-50'}`}
                    >
                        {isPro ? 'Actualizar a MAX ⚡' : 'Actualizar a PRO 🚀'}
                    </button>
                </div>
            </div>
        )}

        <div className="p-4 border-t border-gray-800 bg-[#0a0a0a] z-10">
          <div 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-3 px-4 py-3 mb-2 cursor-pointer hover:bg-gray-800 rounded-xl transition group relative border border-transparent hover:border-gray-700"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden shadow-lg">
              {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                  user.name.charAt(0)
              )}
            </div>
            <div className="flex-1 text-sm overflow-hidden">
              <p className="font-bold text-white truncate group-hover:text-primary transition-colors text-base">{user.name}</p>
              <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400 truncate">{user.role === 'admin' ? 'Administrador' : currentPlan.toUpperCase()}</p>
              </div>
            </div>
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-white transition opacity-0 group-hover:opacity-100" />
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-xl transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 w-full bg-gray-900 border-b border-gray-800 z-20 flex items-center justify-between p-4">
        <span className="font-bold text-lg text-white">Aprende.Marketing</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 z-10 pt-20 px-4 overflow-y-auto">
           <nav className="space-y-2 pb-10">
            {menuStructure.map(item => (
              <NavItemRender key={item.id} item={item} />
            ))}
            
            <div className="mt-4 mb-4">
                <button 
                    onClick={() => { setShowProfileModal(true); setMobileMenuOpen(false); }}
                    className="w-full p-4 rounded-xl border border-white/10 text-left bg-gray-800 flex items-center gap-3"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Mi Perfil</p>
                        <p className="text-xs text-gray-400">Editar datos y plan</p>
                    </div>
                </button>
            </div>

            <div className="border-t border-gray-800 my-4"></div>
            <button onClick={onLogout} className="text-red-400 flex gap-2 mt-4 px-4 w-full items-center">
              <LogOut className="w-5 h-5" /> Cerrar Sesión
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 p-6 md:p-10 overflow-y-auto mt-16 md:mt-0 bg-black">
        {isOffline && (
            <div className="mb-6 bg-yellow-900/20 border border-yellow-700/50 text-yellow-200 px-6 py-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-lg shadow-yellow-900/10">
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-yellow-500/20 rounded-full">
                       <Database className="w-5 h-5 text-yellow-400" />
                   </div>
                   <div>
                       <p className="font-bold text-sm md:text-base">MODO PRUEBAS (OFFLINE) - MICROBLADING DEMO</p>
                       <p className="text-xs text-yellow-300/70">Estás trabajando con datos simulados. Los cambios se perderán al recargar.</p>
                   </div>
               </div>
               <button onClick={onLogout} className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-1.5 rounded-lg border border-yellow-500/30 transition">
                   Salir
               </button>
            </div>
        )}
        {/* Pass user AND counts */}
        <Outlet context={{ user, projectCount, pageCount }} />
        
        {/* Global Modals */}
        <UpgradeModal 
            isOpen={showUpgradeModal} 
            onClose={() => setShowUpgradeModal(false)} 
            currentPlan={currentPlan}
        />

        {showSuccessModal && (
            <SubscriptionSuccessModal 
                onClose={() => setShowSuccessModal(false)} 
                planName={user.planLimits?.planName === 'max' ? 'Max' : 'Pro'} 
            />
        )}

        {/* User Profile Modal (Lazy) */}
        <Suspense fallback={null}>
            {showProfileModal && (
                <UserProfileModal 
                    user={user} 
                    onClose={() => setShowProfileModal(false)}
                    onUpdateUser={(updatedUser) => {
                        if (onUpdateUser) onUpdateUser(updatedUser);
                    }}
                />
            )}
        </Suspense>
      </main>
    </div>
  );
};