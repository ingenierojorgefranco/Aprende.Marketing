import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { User, Plan } from '../../types';
import { LayoutDashboard, PlusCircle, MessageSquare, Mail, LogOut, FileText, Menu, X, ChevronDown, ChevronRight, PenTool, Wrench, BookOpen, List, Briefcase, Plus, Database, Shield, GraduationCap, PlayCircle, Bot, Video, Users, Sparkles, Crown, CreditCard, Settings, Loader2, Activity, Wifi, WifiOff, Eye } from 'lucide-react';
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
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to determine active menu ID based on current path
  const getActiveMenuId = (pathname: string) => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/dashboard/admin')) return 'admin';
    if (pathname.startsWith('/dashboard/training')) return 'training';
    if (pathname.startsWith('/dashboard/crm')) return 'crm';
    if (pathname.startsWith('/dashboard/projects')) return 'projects';
    // 'mid-landing' covers pages list, generator, and editor
    if (pathname.startsWith('/dashboard/pages') || pathname.startsWith('/dashboard/generator') || pathname.startsWith('/dashboard/editor')) return 'mid-landing';
    // 'content-gen' covers articles list and creator
    if (pathname.startsWith('/dashboard/articles') || pathname.startsWith('/dashboard/content-creator')) return 'content-gen';
    // 'tools' covers email, whatsapp, copy-pro
    if (pathname.startsWith('/dashboard/email') || pathname.startsWith('/dashboard/whatsapp') || pathname.startsWith('/dashboard/copy-pro')) return 'tools';
    
    return null;
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [courseItems, setCourseItems] = useState<{ label: string; path: string; icon: any }[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Context Data State
  const [projectCount, setProjectCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);

  // --- PLAN SIMULATION STATE (ADMIN ONLY) ---
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  
  // Initialize from localStorage if exists
  const [simulatedPlanSlug, setSimulatedPlanSlug] = useState<string | null>(() => {
      return localStorage.getItem('admin_simulated_plan') || null;
  });

  // Persist simulation choice
  useEffect(() => {
      if (simulatedPlanSlug) {
          localStorage.setItem('admin_simulated_plan', simulatedPlanSlug);
      } else {
          localStorage.removeItem('admin_simulated_plan');
      }
  }, [simulatedPlanSlug]);

  // Load dynamic courses menu & usage stats & plans
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
              const [projects, pages, articles] = await Promise.all([
                  api.getProjects(),
                  api.getPages(),
                  api.getArticles()
              ]);
              setProjectCount(projects.length);
              setPageCount(pages.length);
              setArticleCount(articles.length);

              // Load Plans if Admin
              if (user.role === 'admin') {
                  const plansData = await api.getPlans();
                  setAvailablePlans(plansData);
              }

          } catch (e) {
              console.error("Error loading dashboard data", e);
          }
      };
      loadData();
  }, [user.role]); // Re-run if role changes (unlikely but safe)

  // Auto-expand menu based on current route
  useEffect(() => {
    const activeId = getActiveMenuId(location.pathname);
    if (activeId) {
      setExpandedMenu(activeId);
    }
  }, [location.pathname]);

  // Check for Subscription Success
  useEffect(() => {
      const params = new URLSearchParams(location.search);
      if (params.get('success') === 'true') {
          setShowSuccessModal(true);
          window.history.replaceState({}, '', location.pathname);
          
          getCurrentUser().then(authUser => {
              if (authUser && onUpdateUser) {
                  api.getAdminUserResources(authUser.id.toString(), 'projects').then(() => {
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

  // --- EFFECTIVE USER CALCULATION ---
  // This overrides the user's planLimits if a simulation is active
  const effectiveUser = useMemo(() => {
      if (!simulatedPlanSlug || user.role !== 'admin') return user;
      
      const plan = availablePlans.find(p => p.slug === simulatedPlanSlug);
      if (!plan) return user;

      // Return a new user object with overridden limits
      return {
          ...user,
          planLimits: plan.limitsConfig
      };
  }, [user, simulatedPlanSlug, availablePlans]);

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
    // --- CRM ADDED HERE ---
    {
      id: 'crm',
      label: 'CRM Clientes',
      icon: Users,
      path: '/dashboard/crm'
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

  const NavItemRender: React.FC<{ item: MenuItem }> = ({ item }) => {
    if (item.adminOnly && user.role !== 'admin') return null;

    const hasSubItems = !!item.subItems && item.subItems.length > 0; 
    const isExpanded = expandedMenu === item.id;
    
    // Determine active state based on ID mapping
    const activeId = getActiveMenuId(location.pathname);
    const isActive = activeId === item.id;

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
            isActive
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

  // Plan Logic for Widget (Use effectiveUser to reflect simulation)
  const currentPlan = effectiveUser.planLimits?.planName || 'starter';
  const isMax = currentPlan === 'max';

  return (
    <div className={`h-screen overflow-hidden bg-black text-gray-200 flex font-sans ${simulatedPlanSlug ? 'ring-4 ring-yellow-500/20' : ''}`}>
      <aside className={`fixed md:relative top-0 left-0 h-full w-[25rem] bg-[#0a0a0a] border-r border-gray-800 shadow-2xl z-40 transition-transform duration-300 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 pb-6 flex justify-between items-center">
          <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Aprende.<span className="text-primary">Marketing</span></h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5 font-bold">Panel de Control</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-400">
              <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuStructure.map(item => (
            <NavItemRender key={item.id} item={item} />
          ))}
        </nav>

        {/* ADMIN SIMULATION WIDGET */}
        {user.role === 'admin' && (
            <div className="mt-auto px-6 py-2">
                <div className="bg-yellow-900/10 border border-yellow-500/20 p-3 rounded-xl">
                    <label className="flex items-center gap-2 text-xs font-bold text-yellow-500 uppercase mb-2">
                        <Eye className="w-3 h-3" /> 🛠️ Modo Pruebas (Ver Como)
                    </label>
                    <select
                        value={simulatedPlanSlug || ''}
                        onChange={(e) => setSimulatedPlanSlug(e.target.value || null)}
                        className="w-full bg-black border border-yellow-500/30 text-white text-xs rounded-lg p-2 outline-none focus:border-yellow-500 transition-colors cursor-pointer"
                    >
                        <option value="">Administrador (Real)</option>
                        {availablePlans.map(p => (
                            <option key={p.id} value={p.slug}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        )}

        {/* RE-DESIGNED UPGRADE WIDGET (MOD PURPLE GLASS) */}
        {!isMax && (
            <div className="border-t border-gray-800 bg-[#0a0a0a] p-4">
                <div className="p-5 rounded-3xl border border-purple-500/20 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.05)] relative overflow-hidden group">
                    {/* Visual Effects */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                    
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Sparkles className="w-5 h-5 fill-current" />
                        </div>
                        
                        <h3 className="font-bold text-white text-base leading-tight mb-1">
                            Lleva tu Negocio al siguiente Nivel
                        </h3>
                        
                        <p className="text-[10px] text-gray-400 mb-4 px-2 leading-normal">
                            Desbloquea funciones avanzadas para hacer crecer tu negocio.
                        </p>
                        
                        <button 
                            onClick={() => setShowUpgradeModal(true)}
                            className="w-full py-2.5 rounded-xl font-bold text-xs transition-all bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            Ver Planes
                        </button>
                    </div>
                </div>
            </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Overlay */}
        {mobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>}

        <header className="h-20 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-30">
             <div className="flex items-center gap-4">
                 <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-400 hover:text-white">
                     <Menu className="w-6 h-6" />
                 </button>
                 <div className="flex flex-col">
                     <h2 className="text-xl font-bold text-white hidden sm:block">
                         Hola, {effectiveUser.name.split(' ')[0]} 👋
                     </h2>
                     {user.role === 'admin' && simulatedPlanSlug && (
                         <span className="text-xs text-yellow-500 font-bold bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-500/20 w-fit">
                             Simulando: {simulatedPlanSlug.toUpperCase()}
                         </span>
                     )}
                 </div>
             </div>

             <div className="flex items-center gap-4">
                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${isOffline ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                     {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                     <span className="hidden sm:inline">{isOffline ? 'Modo Demo' : 'Conectado'}</span>
                 </div>

                 {/* LOGOUT BUTTON ADDED HERE */}
                 <button 
                     onClick={onLogout}
                     className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition group"
                     title="Cerrar Sesión"
                 >
                     <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
                     <span className="text-xs font-bold uppercase tracking-wider hidden lg:inline">Cerrar Sesión</span>
                 </button>

                 <button 
                     onClick={() => setShowProfileModal(true)}
                     className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition group"
                 >
                     <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg overflow-hidden border border-white/10">
                         {effectiveUser.avatarUrl ? (
                             <img src={effectiveUser.avatarUrl} alt={effectiveUser.name} className="w-full h-full object-cover" />
                         ) : (
                             effectiveUser.name.charAt(0).toUpperCase()
                         )}
                     </div>
                     <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden sm:block">{effectiveUser.name}</span>
                     <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white" />
                 </button>
             </div>
        </header>

        <div className="flex-1 overflow-auto bg-black p-4 sm:p-8 relative">
            <div className="max-w-[1600px] mx-auto">
                 {/* Pass Context to Outlet (effectiveUser, projectCount, pageCount, articleCount) */}
                 <Outlet context={{ user: effectiveUser, projectCount, pageCount, articleCount }} />
            </div>
        </div>
      </main>

      <Suspense fallback={null}>
          {showProfileModal && (
              <UserProfileModal 
                  user={effectiveUser} 
                  onClose={() => setShowProfileModal(false)}
                  onUpdateUser={(u) => {
                      if (onUpdateUser) onUpdateUser(u);
                  }}
              />
          )}
      </Suspense>

      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
          currentPlan={effectiveUser.planLimits?.planName}
      />

      {showSuccessModal && (
          <SubscriptionSuccessModal 
              onClose={() => setShowSuccessModal(false)} 
              planName={effectiveUser.planLimits?.planName}
          />
      )}
    </div>
  );
};