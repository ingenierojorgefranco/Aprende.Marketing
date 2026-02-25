import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { User, Plan } from '../../types';
////////// Adición de iconos HelpCircle, Send y CheckCircle para el sistema de ayuda - 05/06/2025 10:00 //////////
import { LayoutDashboard, PlusCircle, MessageSquare, Mail, LogOut, FileText, Menu, X, ChevronDown, ChevronRight, PenTool, Wrench, BookOpen, List, Briefcase, Plus, Database, Shield, GraduationCap, PlayCircle, Bot, Video, Users, Sparkles, Crown, CreditCard, Settings, Loader2, Activity, Wifi, WifiOff, Eye, ShoppingCart, HelpCircle, Send, CheckCircle, Newspaper, Layers, Rocket, Smartphone, Zap } from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { api } from '../../services/api';
import { UpgradeModal } from './UpgradeModal';
import { SubscriptionSuccessModal } from './SubscriptionSuccessModal';
import { getCurrentUser } from '../../services/auth';
import { WaitlistView } from './WaitlistView';

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

  const [systemMode, setSystemMode] = useState<'production' | 'launch'>('production');
  const [loadingMode, setLoadingMode] = useState(true);

  /* */ /* Actualización: Mejora de la lógica de detección de categoría activa y resaltado de sub-ítems para incluir rutas de asistentes (generator, content-creator) y editores, asegurando persistencia visual en el menú lateral - 22/05/2024 11:30 */
  const getActiveMenuId = (pathname: string) => {
    if (pathname === '/dashboard') return 'dashboard';
    
    // Categoría: Administración
    if (pathname.startsWith('/dashboard/admin')) return 'admin';
    
    // Categoría: Entrenamiento
    if (pathname.startsWith('/dashboard/training')) return 'training';
    
    // Categoría: Tu Sistema (Unifica flujos de creación y gestión)
    const sistemaPrefixes = [
        '/dashboard/projects',
        '/dashboard/pages',
        '/dashboard/generator',
        '/dashboard/editor',
        '/dashboard/articles',
        '/dashboard/content-creator',
        '/dashboard/email',
        '/dashboard/whatsapp-launch'
    ];
    if (sistemaPrefixes.some(prefix => pathname.startsWith(prefix))) return 'sistema';
    
    // Categoría: CRM
    if (pathname.startsWith('/dashboard/crm')) return 'crm';
    
    return null;
  };

  // Función auxiliar para determinar si un sub-ítem específico debe estar activo basándose en rutas relacionadas
  const isSubItemActive = (subPath: string, currentPath: string) => {
    if (currentPath === subPath) return true;
    
    // Lógica para Mis Proyectos
    if (subPath === '/dashboard/projects' && currentPath.startsWith('/dashboard/projects/')) return true;
    
    // Lógica para Páginas de Venta (incluye generador y editor)
    if (subPath === '/dashboard/pages' && (currentPath.startsWith('/dashboard/generator') || currentPath.startsWith('/dashboard/editor'))) return true;
    
    // Lógica para Contenidos Automáticos (incluye creador de contenido)
    if (subPath === '/dashboard/articles' && currentPath.startsWith('/dashboard/content-creator')) return true;

    // Lógica para WhatsApp Lanzamientos
    if (subPath === '/dashboard/whatsapp-launch' && currentPath.startsWith('/dashboard/whatsapp-launch/create')) return true;

    // Default: Empieza por el path
    return currentPath.startsWith(subPath);
  };
  /* Fin de actualización - 22/05/2024 11:30 */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('sistema');
  const [courseItems, setCourseItems] = useState<{ label: string; path: string; icon: any }[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  ////////// Estados para la ventana modal de ayuda - 05/06/2025 10:00 //////////
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [sendingHelp, setSendingHelp] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState(false);
  const [helpForm, setHelpForm] = useState({
    reason: 'Soporte Técnico',
    message: ''
  });
  ////////// Fin de actualización - 05/06/2025 10:00 //////////

  const [projectCount, setProjectCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [hookCount, setHookCount] = useState(0);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  
  const [simulatedPlanSlug, setSimulatedPlanSlug] = useState<string | null>(() => {
      return localStorage.getItem('admin_simulated_plan') || null;
  });

  useEffect(() => {
      if (simulatedPlanSlug) {
          localStorage.setItem('admin_simulated_plan', simulatedPlanSlug);
      } else {
          localStorage.removeItem('admin_simulated_plan');
      }
  }, [simulatedPlanSlug]);

  useEffect(() => {
      const loadData = async () => {
          try {
              const [mode, list, summary] = await Promise.all([
                  api.getSystemMode(),
                  api.getCoursesList(),
                  api.getAnalyticsSummary()
              ]);
              
              setSystemMode(mode);
              setLoadingMode(false);

              const items = list.map((c: any) => ({
                  label: c.title,
                  path: `/dashboard/training/${c.slug}`,
                  icon: PlayCircle 
              }));
              setCourseItems(items);

              setProjectCount(summary.totalProjects || 0);
              setPageCount(summary.totalPages || 0);
              setArticleCount(summary.totalArticles || 0);
              setHookCount(summary.totalHooks || 0);

              if (user.role === 'admin') {
                  const plansData = await api.getPlans();
                  setAvailablePlans(plansData);
              }
          } catch (e) {
              console.error("Error loading dashboard data", e);
              setLoadingMode(false);
          }
      };
      loadData();
  }, [user.role, location.pathname]);

  useEffect(() => {
    const activeId = getActiveMenuId(location.pathname);
    if (activeId) {
      setExpandedMenu(activeId);
    }
  }, [location.pathname]);

  const effectiveUser = useMemo(() => {
      if (!simulatedPlanSlug || user.role !== 'admin') return user;
      const plan = availablePlans.find(p => p.slug === simulatedPlanSlug);
      if (!plan) return user;
      
      // Aseguramos que los límites tengan el nombre del plan simulado
      const limitsWithPlanName = { 
          ...plan.limitsConfig, 
          planName: plan.slug 
      };
      
      return { 
          ...user, 
          role: 'user' as const, // Forzamos rol de usuario para simular la experiencia real
          planLimits: limitsWithPlanName 
      };
  }, [user, simulatedPlanSlug, availablePlans]);

  const menuStructure: MenuItem[] = useMemo(() => {
    // Si estamos en modo lanzamiento y no es admin, menú ultra simplificado
    if (systemMode === 'launch' && user.role !== 'admin') {
        return [
            { id: 'waitlist', label: 'Lista de Espera', icon: Rocket, path: '/dashboard' }
        ];
    }

    return [
        { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'admin', label: 'Administración', icon: Shield, adminOnly: true, subItems: [
              { label: 'Usuarios', path: '/dashboard/admin', icon: Users },
              { label: 'Panel Hotmart', path: '/dashboard/admin/hotmart', icon: ShoppingCart },
              { label: 'Planes y Precios', path: '/dashboard/admin/plans', icon: CreditCard },
              { label: 'Gestionar Cursos', path: '/dashboard/admin/courses', icon: Video },
              { label: 'Gestionar Comentarios', path: '/dashboard/admin/comments', icon: MessageSquare },
              ////////// Actualización: Opción de gestionar novedades para administradores - 07/06/2025 10:00 //////////
              { label: 'Gestionar Novedades', path: '/dashboard/admin/news', icon: Newspaper },
              ////////// Fin de actualización - 07/06/2025 10:00 //////////
              { label: 'Logs del Sistema', path: '/dashboard/admin/logs', icon: Activity }
          ]
        },
        /* */ /* Actualización: Reubicación del botón CRM Clientes por encima de Entrenamiento - 27/05/2025 16:30 */
        { id: 'crm', label: 'CRM Clientes', icon: Users, path: '/dashboard/crm' },
        { id: 'training', label: 'Entrenamiento', icon: GraduationCap, subItems: courseItems },
        { id: 'sistema', label: 'Tu Sistema', icon: Layers, subItems: [
            { label: 'Mis Proyectos', path: '/dashboard/projects', icon: Briefcase },
            { label: 'Mis Ganchos', path: '/dashboard/hooks', icon: Zap },
            { label: 'Páginas de Captura', path: '/dashboard/pages', icon: FileText },
            { label: 'Contenidos SEO', path: '/dashboard/articles', icon: BookOpen },
            { label: 'Email Marketing', path: '/dashboard/email', icon: Mail },
            ////////// Actualización: Opción de WhatsApp Lanzamientos en el menú lateral - 10/06/2025 10:00 //////////
            { label: 'WhatsApp Lanzamientos', path: '/dashboard/whatsapp-launch', icon: Smartphone }
          ]
        }
      ];
  }, [systemMode, user.role, courseItems]);

  const NavItemRender: React.FC<{ item: MenuItem }> = ({ item }) => {
    if (item.adminOnly && user.role !== 'admin') return null;
    const hasSubItems = !!item.subItems && item.subItems.length > 0; 
    const isExpanded = item.id === 'sistema' ? true : expandedMenu === item.id;
    const activeId = getActiveMenuId(location.pathname);
    const isActive = activeId === item.id || (item.id === 'waitlist' && location.pathname === '/dashboard');

    return (
      <div className="mb-2">
        <div
          onClick={() => {
            if (hasSubItems) {
              if (item.id === 'sistema') return;
              setExpandedMenu(isExpanded ? null : item.id);
            }
            else if (item.path) { navigate(item.path); setMobileMenuOpen(false); }
          }}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all cursor-pointer ${
            isActive ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-[#B0B0B0] hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-4">
            <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-[#B0B0B0]'}`} />
            <span className="font-semibold text-base">{item.label}</span>
          </div>
          {hasSubItems && (isExpanded ? <ChevronDown className="w-5 h-5 opacity-50" /> : <ChevronRight className="w-5 h-5 opacity-50" />)}
        </div>
        {hasSubItems && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="ml-6 pl-4 border-l border-white/10 space-y-1">
              {item.subItems?.map((sub, idx) => (
                <Link key={idx} to={sub.path} onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                    isSubItemActive(sub.path, location.pathname) ? 'text-[#FF5A1F] bg-[#FF5A1F]/10 font-bold' : 'text-[#B0B0B0] hover:text-white hover:bg-white/5'
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

  const currentPlan = effectiveUser.planLimits?.planName || 'starter';

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSendingHelp(true);
    setTimeout(() => {
        setSendingHelp(false);
        setHelpSuccess(true);
        setTimeout(() => {
            setHelpSuccess(false);
            setShowHelpModal(false);
            setHelpForm({ reason: 'Soporte Técnico', message: '' });
        }, 2000);
    }, 1500);
  };

  if (loadingMode) {
      return (
          <div className="h-screen bg-black flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#FF5A1F] animate-spin" />
          </div>
      );
  }

  const isLaunchRestricted = systemMode === 'launch' && user.role !== 'admin';

  return (
    <div className="h-screen overflow-hidden bg-black text-[#FFFFFF] flex font-sans">
      <aside className={`fixed md:relative top-0 left-0 h-full w-[25rem] bg-[#0B0B0B] border-r border-white/5 shadow-2xl z-40 transition-transform duration-300 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 pb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-12 h-10 bg-[#FF5A1F] rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[#FF5A1F]/20 px-1.5">AM</div>
              <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Aprende.<span className="text-[#FF5A1F]">Marketing</span></h2>
                  <p className="text-[10px] text-[#B0B0B0] uppercase tracking-widest mt-1 font-black">Tu Panel de Control</p>
              </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-[#B0B0B0]"><X className="w-6 h-6" /></button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">{menuStructure.map(item => <NavItemRender key={item.id} item={item} />)}</nav>
        
        {user.role === 'admin' && (
            <div className="mt-auto px-6 py-2">
                <div className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/20 p-3 rounded-xl">
                    <label className="flex items-center gap-2 text-[10px] font-black text-[#FF5A1F] uppercase mb-2"><Eye className="w-3 h-3" /> Modo Pruebas</label>
                    <select value={simulatedPlanSlug || ''} onChange={(e) => setSimulatedPlanSlug(e.target.value || null)} className="w-full bg-black border border-white/10 text-white text-xs rounded-lg p-2 outline-none">
                        <option value="">Admin (Real)</option>
                        {availablePlans.map(p => <option key={p.id} value={p.slug}>{p.name}</option>)}
                    </select>
                </div>
            </div>
        )}

        {!isLaunchRestricted && currentPlan !== 'max' && (
            <div className="border-t border-white/5 bg-[#0B0B0B] p-6">
                <div className="p-8 rounded-[2rem] border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex flex-col items-center text-center relative z-10">
                        <h3 className="font-black text-white text-xl leading-tight mb-2 tracking-tight">Mejora tu capacidad</h3>
                        <p className="text-sm text-[#B0B0B0] mb-6 px-4 font-medium leading-relaxed">Desbloquea generación ilimitada y dominios propios de inmediato.</p>
                        <button 
                            onClick={() => setShowUpgradeModal(true)} 
                            className="w-full py-4 rounded-2xl font-black text-sm bg-[#FF5A1F] hover:bg-[#D94A1E] text-white transition-all shadow-[0_15px_30px_-5px_rgba(255,90,31,0.5)] transform hover:-translate-y-1 active:scale-95"
                        >
                            Ver Planes PRO
                        </button>
                    </div>
                </div>
            </div>
        )}
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {mobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>}
        <header className="h-20 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-30">
             <div className="flex items-center gap-4">
                 <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-[#B0B0B0]"><Menu className="w-6 h-6" /></button>
                 <h2 className="text-xl font-bold text-white hidden sm:block">Hola, {effectiveUser.name.split(' ')[0]} 👋</h2>
             </div>
             
             <div className="flex items-center gap-2 sm:gap-4">
                 <a 
                    href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#B0B0B0] hover:text-white hover:bg-white/10 transition-all"
                    title="Comunidad WhatsApp"
                 >
                    <div className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-lg shadow-[#FF5A1F]/20 flex-shrink-0">
                        <Users className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider hidden lg:inline">Comunidad</span>
                 </a>

                 <button 
                    onClick={() => setShowHelpModal(true)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#B0B0B0] hover:text-white hover:bg-white/10 transition-all"
                 >
                    <div className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-lg shadow-[#FF5A1F]/20 flex-shrink-0">
                        <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider hidden lg:inline">Ayuda</span>
                 </button>

                 <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition shadow-sm">
                     <div className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center font-bold overflow-hidden shadow-lg shadow-[#FF5A1F]/20 flex-shrink-0">
                         {effectiveUser.avatarUrl ? <img src={effectiveUser.avatarUrl} alt={effectiveUser.name} className="w-full h-full object-cover" /> : effectiveUser.name.charAt(0).toUpperCase()}
                     </div>
                     <span className="text-sm font-bold text-[#B0B0B0] hidden sm:block">{effectiveUser.name}</span>
                 </button>

                 <button onClick={onLogout} className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#B0B0B0] hover:text-red-400 hover:bg-red-900/10 transition-all">
                     <div className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-lg shadow-[#FF5A1F]/20 flex-shrink-0">
                        <LogOut className="w-4 h-4" />
                     </div>
                     <span className="text-sm font-bold uppercase tracking-wider hidden lg:inline">Salir</span>
                 </button>
             </div>
        </header>

        <div className="flex-1 overflow-auto bg-black p-4 sm:p-8 relative">
            <div className="max-w-[1600px] mx-auto">
                {isLaunchRestricted ? (
                    <WaitlistView />
                ) : (
                    <Outlet context={{ 
                        user: effectiveUser, 
                        projectCount, 
                        pageCount, 
                        articleCount, 
                        hookCount,
                        isSimulating: !!simulatedPlanSlug,
                        setShowProfileModal 
                    }} />
                )}
            </div>
        </div>
      </main>

      {showHelpModal && (
        <div 
            onClick={() => !sendingHelp && setShowHelpModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
            >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#FF5A1F]/10 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FF5A1F]/20 rounded-2xl flex items-center justify-center text-[#FF5A1F]">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Centro de Soporte</h3>
                            <p className="text-xs text-[#B0B0B0] uppercase font-black tracking-widest mt-1">Estamos para apoyarte</p>
                        </div>
                    </div>
                    <button onClick={() => !sendingHelp && setShowHelpModal(false)} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8">
                    {helpSuccess ? (
                        <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg border border-green-500/20">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">¡Ticket Enviado!</h2>
                            <p className="text-[#B0B0B0] leading-relaxed">Tu solicitud ha sido recibida. Un experto de soporte te contactará vía email en menos de 24 horas hábiles.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleHelpSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Nombre</label>
                                    <div className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[#B0B0B0] text-sm font-medium">
                                        {effectiveUser.name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Email</label>
                                    <div className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[#B0B0B0] text-sm font-medium truncate">
                                        {effectiveUser.email}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Motivo del Contacto</label>
                                <select 
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF5A1F] text-white transition appearance-none cursor-pointer"
                                    value={helpForm.reason}
                                    onChange={(e) => setHelpForm({...helpForm, reason: e.target.value})}
                                    disabled={sendingHelp}
                                >
                                    <option value="Soporte Técnico">Soporte Técnico</option>
                                    <option value="Facturación">Facturación y Planes</option>
                                    <option value="Estrategia">Dudas de Estrategia</option>
                                    <option value="Sugerencia">Sugerencia de Mejora</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Descripción detallada</label>
                                <textarea 
                                    required rows={4}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF5A1F] text-white transition resize-none placeholder:text-gray-700"
                                    placeholder="Describe brevemente tu problema o duda para poder ayudarte mejor..."
                                    value={helpForm.message}
                                    onChange={(e) => setHelpForm({...helpForm, message: e.target.value})}
                                    disabled={sendingHelp}
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                disabled={sendingHelp || !helpForm.message.trim()}
                                className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-lg rounded-2xl transition shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                {sendingHelp ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                                {sendingHelp ? 'Enviando solicitud...' : 'Enviar mensaje al soporte'}
                            </button>
                        </form>
                    )}
                </div>
                
                <div className="p-6 bg-black/40 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Aprende.Marketing v2.9 — Sistema de Ayuda Directa</p>
                </div>
            </div>
        </div>
      )}

      <Suspense fallback={null}>{showProfileModal && <UserProfileModal user={effectiveUser} onClose={() => setShowProfileModal(false)} onUpdateUser={onUpdateUser!} />}</Suspense>
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} currentPlan={effectiveUser.planLimits?.planName} />
      {showSuccessModal && <SubscriptionSuccessModal onClose={() => setShowSuccessModal(false)} planName={effectiveUser.planLimits?.planName} />}
    </div>
  );
};