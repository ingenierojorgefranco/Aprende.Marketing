import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { User, Plan } from '../../types';
////////// Adición de iconos HelpCircle, Send y CheckCircle para el sistema de ayuda - 05/06/2025 10:00 //////////
import { LayoutDashboard, PlusCircle, MessageSquare, Mail, LogOut, FileText, Menu, X, ChevronDown, ChevronRight, PenTool, Wrench, BookOpen, List, Briefcase, Plus, Database, Shield, GraduationCap, PlayCircle, Bot, Video, Users, Sparkles, Crown, CreditCard, Settings, Loader2, Activity, Wifi, WifiOff, Eye, ShoppingCart, HelpCircle, Send, CheckCircle, Newspaper, Layers, Rocket, Smartphone, Zap, Bell, User as UserIcon } from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { api } from '../../services/api';
import { UpgradeModal } from './UpgradeModal';
import { SubscriptionSuccessModal } from './SubscriptionSuccessModal';
import { NewsHistoryModal } from './NewsHistoryModal';
import { getCurrentUser } from '../../services/auth';
import { WaitlistView } from './WaitlistView';

// Lazy Load User Profile Modal
const UserProfileModal = React.lazy(() => import('./UserProfileModal'));

import { OnboardingWizard } from './wizard/OnboardingWizard';

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
  const [wizardEnabled, setWizardEnabled] = useState<boolean>(true);
  const [loadingMode, setLoadingMode] = useState(true);

  /* */ /* Actualización: Mejora de la lógica de detección de categoría activa y resaltado de sub-ítems para incluir rutas de asistentes (generator, content-creator) y editores, asegurando persistencia visual en el menú lateral - 22/05/2024 11:30 */
  const getActiveMenuId = (pathname: string) => {
    if (pathname === '/dashboard') return 'dashboard';
    
    // Categoría: Mis Proyectos
    if (pathname.startsWith('/dashboard/projects')) return 'projects';

    // Categoría: Contactos (CRM)
    if (pathname.startsWith('/dashboard/crm')) return 'crm';

    // Categoría: Academia / Entrenamiento
    if (pathname.startsWith('/dashboard/training')) return 'training';
    
    // Categoría: Administración
    if (pathname.startsWith('/dashboard/admin')) return 'admin';
    
    // Categoría: Tu Sistema
    const sistemaPrefixes = [
        '/dashboard/pages',
        '/dashboard/generator',
        '/dashboard/editor',
        '/dashboard/articles',
        '/dashboard/content-creator',
        '/dashboard/email',
        '/dashboard/whatsapp-launch',
        '/dashboard/hooks'
    ];
    if (sistemaPrefixes.some(prefix => pathname.startsWith(prefix))) return 'sistema';
    
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
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const [isWizardGenerating, setIsWizardGenerating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
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

  // --- Sincronización Silenciosa de Encuesta ---
  // Si el usuario en memoria no tiene encuesta, verificamos con el servidor 
  // por si es un error de caché o sesión no actualizada.
  useEffect(() => {
    const syncSurveyStatus = async () => {
        if (user.role !== 'admin' && !user.survey_json) {
            try {
                const latestUser = await getCurrentUser();
                if (latestUser && (latestUser as any).survey_json && onUpdateUser) {
                    // Convertir a tipo User para compatibilidad
                    const formattedUser: User = {
                        ...user, // Mantener lo que ya tenemos
                        id: latestUser.id.toString(),
                        survey_json: (latestUser as any).survey_json
                    };
                    onUpdateUser(formattedUser);
                }
            } catch (e) {
                console.error("Error en sincronización silenciosa de encuesta:", e);
            }
        }
    };
    syncSurveyStatus();
  }, [user.id]); // Solo se ejecuta si cambia el ID del usuario o al montar

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
              const [mode, list, summary, wizard] = await Promise.all([
                  api.getSystemMode(),
                  api.getCoursesList(),
                  api.getAnalyticsSummary(),
                  api.getWizardMode().catch(() => true)
              ]);
              
              setSystemMode(mode);
              setWizardEnabled(wizard);
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

  useEffect(() => {
    const activeId = getActiveMenuId(location.pathname);
    if (activeId && activeId !== expandedMenu) {
      setExpandedMenu(activeId);
    }
  }, [location.pathname]);

  const menuStructure: MenuItem[] = useMemo(() => {
    // Si estamos en modo lanzamiento y no es admin Y NO HA HECHO LA ENCUESTA, menú ultra simplificado
    if (systemMode === 'launch' && user.role !== 'admin' && !user.survey_json) {
        return [
            { id: 'waitlist', label: 'Lista de Espera', icon: Rocket, path: '/dashboard' }
        ];
    }

    const SHOW_TU_SISTEMA_MENU = false; // Ocultado según instrucción. Cambiar a true para reactivar.

    return [
        { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'projects', label: 'Mis Proyectos', icon: Briefcase, path: '/dashboard/projects' },
        { id: 'crm', label: 'Contactos', icon: Users, path: '/dashboard/crm' },
        { id: 'training', label: 'Academia', icon: GraduationCap, path: '/dashboard/training' },
        ...(SHOW_TU_SISTEMA_MENU ? [{ id: 'sistema', label: 'Tu Sistema', icon: Layers, subItems: [
            { label: 'Mis Proyectos', path: '/dashboard/projects', icon: Briefcase },
            { label: 'Hooks de Atracción', path: '/dashboard/hooks', icon: Zap },
            { label: 'Páginas de Captura', path: '/dashboard/pages', icon: FileText },
            { label: 'Contenidos SEO', path: '/dashboard/articles', icon: BookOpen },
            { label: 'Email Marketing', path: '/dashboard/email', icon: Mail },
            { label: 'WhatsApp Lanzamientos', path: '/dashboard/whatsapp-launch', icon: Smartphone }
          ]
        }] : []),
        { id: 'admin', label: 'Administración', icon: Shield, adminOnly: true, subItems: [
              { label: 'Usuarios', path: '/dashboard/admin', icon: Users },
              { label: 'Panel Hotmart', path: '/dashboard/admin/hotmart', icon: ShoppingCart },
              { label: 'Planes y Precios', path: '/dashboard/admin/plans', icon: CreditCard },
              { label: 'Gestionar Cursos', path: '/dashboard/admin/courses', icon: Video },
              { label: 'Gestionar Comentarios', path: '/dashboard/admin/comments', icon: MessageSquare },
              { label: 'Gestionar Novedades', path: '/dashboard/admin/news', icon: Newspaper },
              { label: 'Logs del Sistema', path: '/dashboard/admin/logs', icon: Activity }
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
      <div className="mb-1.5">
        <div
          onClick={() => {
            if (hasSubItems) {
              if (item.id === 'sistema') return;
              setExpandedMenu(isExpanded ? null : item.id);
            }
            else if (item.path) { navigate(item.path); setMobileMenuOpen(false); }
          }}
          className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border ${
            isActive 
              ? 'bg-gradient-to-r from-[#FF5A1F]/85 via-[#FF5A1F]/30 to-transparent border-[#FF5A1F]/50 text-white font-semibold shadow-lg shadow-[#FF5A1F]/20 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1.5 before:bg-[#FF5A1F] before:rounded-r-full before:shadow-[0_0_8px_#FF5A1F]' 
              : 'border-transparent text-[#B0B0B0] hover:bg-gradient-to-r hover:from-[#FF5A1F]/35 hover:via-[#FF5A1F]/10 hover:to-transparent hover:border-[#FF5A1F]/30 hover:text-white font-medium hover:before:absolute hover:before:left-0 hover:before:top-2 hover:before:bottom-2 hover:before:w-1 hover:before:bg-[#FF5A1F]/70 hover:before:rounded-r-full'
          }`}
        >
          <div className="flex items-center gap-3 relative z-10">
            <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#B0B0B0]'}`} />
            <span className="text-[14.5px] tracking-tight">{item.label}</span>
          </div>
          {hasSubItems && (isExpanded ? <ChevronDown className="w-4.5 h-4.5 opacity-50 shrink-0 relative z-10" /> : <ChevronRight className="w-4.5 h-4.5 opacity-50 shrink-0 relative z-10" />)}
        </div>
        {hasSubItems && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="ml-4 pl-3 border-l border-white/10 space-y-1 my-1">
              {item.subItems?.map((sub, idx) => (
                <Link key={idx} to={sub.path} onClick={() => setMobileMenuOpen(false)}
                  className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] transition-all duration-200 overflow-hidden border ${
                    isSubItemActive(sub.path, location.pathname) 
                      ? 'bg-gradient-to-r from-[#FF5A1F]/75 via-[#FF5A1F]/20 to-transparent border-[#FF5A1F]/40 text-white font-semibold before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-[#FF5A1F] before:rounded-r-full' 
                      : 'border-transparent text-[#B0B0B0] hover:bg-gradient-to-r hover:from-[#FF5A1F]/30 hover:via-[#FF5A1F]/08 hover:to-transparent hover:border-[#FF5A1F]/25 hover:text-white font-medium hover:before:absolute hover:before:left-0 hover:before:top-1.5 hover:before:bottom-1.5 hover:before:w-1 hover:before:bg-[#FF5A1F]/60 hover:before:rounded-r-full'
                  }`}
                >
                  {sub.icon && <sub.icon className="w-4 h-4 shrink-0 relative z-10" />}
                  <span className="truncate relative z-10">{sub.label}</span>
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

  const hasCompletedSurvey = useMemo(() => {
    if (user.role === 'admin') return true;
    const survey = user.survey_json;
    if (!survey) return false;
    
    // Si es un objeto, verificar que tenga datos
    if (typeof survey === 'object') {
        return Object.keys(survey).length > 0;
    }
    
    // Si es un string, verificar longitud y que no sea un JSON vacío "{}"
    if (typeof survey === 'string') {
        const trimmed = survey.trim();
        if (trimmed === '{}' || trimmed === '') return false;
        return trimmed.length > 2;
    }
    
    return !!survey;
  }, [user.survey_json, user.role]);

  const isLaunchRestricted = systemMode === 'launch' && user.role !== 'admin' && !hasCompletedSurvey;
  const isSurveyPending = !hasCompletedSurvey && user.role !== 'admin';
  const isWizardRoute = location.pathname.startsWith('/wizard');
  const showWizard = isWizardRoute || (wizardEnabled && !isSurveyPending && !isLaunchRestricted && user.role !== 'admin' && pageCount === 0) || (typeof window !== 'undefined' && (localStorage.getItem('force_wizard_step') === 'success' || localStorage.getItem('force_wizard_step') === 'welcome' || localStorage.getItem('force_wizard_step') === 'selection' || localStorage.getItem('force_wizard_step') === 'unlock'));

  useEffect(() => {
    if (showWizard && location.pathname === '/dashboard' && !isSurveyPending && !isLaunchRestricted) {
      const forced = typeof window !== 'undefined' ? localStorage.getItem('force_wizard_step') : null;
      if (forced === 'success' || forced === 'unlock') {
        navigate('/wizard/step-3', { replace: true });
      } else if (forced === 'selection') {
        navigate('/wizard/step-2', { replace: true });
      } else {
        navigate('/wizard/step-1', { replace: true });
      }
    }
  }, [showWizard, location.pathname, isSurveyPending, isLaunchRestricted, navigate]);

  if (loadingMode) {
      return (
          <div className="h-screen bg-black flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#FF5A1F] animate-spin" />
          </div>
      );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#030712] text-[#FFFFFF] flex font-sans">
      {(!isSurveyPending && !isLaunchRestricted && !showWizard) && (
        <aside className={`fixed md:relative top-0 left-0 h-full w-64 md:w-[17rem] shrink-0 bg-[#030712] border-r border-slate-800/60 shadow-2xl z-40 transition-all duration-300 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 pb-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#FF5A1F]/20 shrink-0">AM</div>
                <div className="leading-tight">
                    <h2 className="text-lg font-bold text-white tracking-tight">Aprende.<span className="text-[#FF5A1F]">Marketing</span></h2>
                    <p className="text-[10px] text-[#808080] uppercase tracking-widest mt-0.5 font-bold">Tu Panel de Control</p>
                </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-[#B0B0B0]"><X className="w-5 h-5" /></button>
          </div>
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">{menuStructure.map(item => <NavItemRender key={item.id} item={item} />)}</nav>
          
          {user.role === 'admin' && (
              <div className="mt-auto px-6 py-2">
                  <div className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/20 p-3 rounded-xl">
                      <label className="flex items-center gap-2 text-[10px] font-black text-[#FF5A1F] uppercase mb-2"><Eye className="w-3 h-3" /> Modo Pruebas</label>
                      <select value={simulatedPlanSlug || ''} onChange={(e) => setSimulatedPlanSlug(e.target.value || null)} className="w-full bg-[#0B1120] border border-slate-800 text-white text-xs rounded-lg p-2 outline-none">
                          <option value="">Admin (Real)</option>
                          {availablePlans.map(p => <option key={p.id} value={p.slug}>{p.name}</option>)}
                      </select>
                  </div>
              </div>
          )}

          {!isLaunchRestricted && (
              <div className="border-t border-slate-800/60 bg-[#030712] px-4 py-4 mt-auto">
                  <button 
                      onClick={() => setShowUpgradeModal(true)} 
                      className="relative overflow-hidden w-full flex items-center justify-between py-3 px-3.5 rounded-xl text-gray-300 hover:text-white transition-all duration-200 group cursor-pointer border border-transparent hover:bg-gradient-to-r hover:from-[#FF5A1F]/30 hover:via-[#FF5A1F]/10 hover:to-transparent hover:border-[#FF5A1F]/30 hover:before:absolute hover:before:left-0 hover:before:top-2 hover:before:bottom-2 hover:before:w-1 hover:before:bg-[#FF5A1F]/70 hover:before:rounded-r-full"
                  >
                      <div className="flex items-center gap-3 relative z-10">
                          <Settings className="w-5 h-5 text-gray-400 group-hover:text-[#FF5A1F] transition-colors" />
                          <span className="text-sm font-medium tracking-tight text-gray-200 group-hover:text-white">Plan y configuración</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all relative z-10" />
                  </button>
              </div>
          )}
        </aside>
      )}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {mobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>}
        <header className="h-20 bg-[#030712]/95 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-6 shrink-0 z-30">
             <div className={`flex items-center gap-4 ${isWizardGenerating ? 'w-full justify-center' : ''}`}>
                 {isSurveyPending || showWizard ? (
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-[#FF5A1F]/20 px-1">AM</div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Aprende.<span className="text-[#FF5A1F]">Marketing</span></h2>
                    </div>
                 ) : (
                    <>
                        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-[#B0B0B0]"><Menu className="w-6 h-6" /></button>
                        <h2 className="text-xl font-bold text-white hidden sm:block">Hola, {effectiveUser.name.split(' ')[0]} 👋</h2>
                    </>
                 )}
             </div>
             
             {!isWizardGenerating && (
                 <div className="flex items-center gap-2.5 sm:gap-4">
                     {(!isSurveyPending && !showWizard) && (
                        <>
                            {/* Botón Naranja + Crear nuevo proyecto */}
                            <button 
                                onClick={() => navigate('/dashboard/projects/create')}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#E04E1A] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#FF5A1F]/20 transition-all active:scale-95 cursor-pointer"
                            >
                                <Plus className="w-4 h-4 text-white shrink-0" />
                                <span>Crear nuevo proyecto</span>
                            </button>

                            {/* Botón Notificaciones / Novedades (Campana) */}
                            <button
                                onClick={() => setShowNewsModal(true)}
                                className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer"
                                title="Novedades y Notificaciones"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5A1F] ring-2 ring-[#030712] animate-pulse"></span>
                            </button>
                        </>
                     )}

                     {/* Botón de Perfil con Submenú desplegable que incluye Salir */}
                     <div className="relative" ref={userMenuRef}>
                         <button 
                             onClick={() => setUserMenuOpen(!userMenuOpen)} 
                             className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition cursor-pointer shadow-sm"
                         >
                             <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#FF5A1F] text-white font-black flex items-center justify-center text-sm shadow-md shadow-[#FF5A1F]/20 shrink-0">
                                 {effectiveUser.avatarUrl ? (
                                     <img src={effectiveUser.avatarUrl} alt={effectiveUser.name} className="w-full h-full object-cover" />
                                 ) : (
                                     effectiveUser.name.charAt(0).toUpperCase()
                                 )}
                             </div>
                             <span className="text-sm font-bold text-white hidden sm:block">
                                 {effectiveUser.name.split(' ')[0]}
                             </span>
                             <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                         </button>

                         {/* Menú Desplegable */}
                         {userMenuOpen && (
                             <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                 <div className="px-4 py-2.5 border-b border-slate-800/80 mb-1">
                                     <p className="text-xs font-bold text-white truncate">{effectiveUser.name}</p>
                                     <p className="text-[11px] text-slate-400 truncate">{effectiveUser.email}</p>
                                 </div>

                                 <button
                                     onClick={() => {
                                         setUserMenuOpen(false);
                                         setShowProfileModal(true);
                                     }}
                                     className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                                 >
                                     <UserIcon className="w-4 h-4 text-[#FF5A1F]" />
                                     <span>Mi Perfil / Configuración</span>
                                 </button>

                                 <a
                                     href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1"
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     onClick={() => setUserMenuOpen(false)}
                                     className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                                 >
                                     <Users className="w-4 h-4 text-[#FF5A1F]" />
                                     <span>Comunidad WhatsApp</span>
                                 </a>

                                 <button
                                     onClick={() => {
                                         setUserMenuOpen(false);
                                         setShowHelpModal(true);
                                     }}
                                     className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                                 >
                                     <HelpCircle className="w-4 h-4 text-[#FF5A1F]" />
                                     <span>Ayuda y Soporte</span>
                                 </button>

                                 <div className="my-1 border-t border-slate-800/80"></div>

                                 <button
                                     onClick={() => {
                                         setUserMenuOpen(false);
                                         onLogout();
                                     }}
                                     className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer"
                                 >
                                     <LogOut className="w-4 h-4" />
                                     <span>Cerrar sesión</span>
                                 </button>
                             </div>
                         )}
                     </div>
                 </div>
             )}
        </header>

        <div id="dashboard-scroll-container" className={`flex-1 overflow-y-auto bg-[#030712] p-4 sm:p-8 relative ${(isSurveyPending || isLaunchRestricted || showWizard) ? 'flex flex-col items-center' : ''} ${isWizardGenerating ? '!overflow-hidden' : ''}`}>
            <div className={`w-full max-w-[1600px] ${(isSurveyPending || isLaunchRestricted || showWizard) ? 'max-w-6xl mx-auto mt-0' : 'mx-auto'}`}>
                {(isLaunchRestricted || isSurveyPending) ? (
                    <WaitlistView 
                        user={effectiveUser} 
                        onUpdateUser={onUpdateUser}
                        onComplete={() => window.location.reload()} 
                    />
                ) : showWizard ? (
                    <OnboardingWizard 
                        user={effectiveUser} 
                        onComplete={(targetProjectId) => {
                            localStorage.removeItem('force_wizard_step');
                            if (typeof window !== 'undefined') {
                              sessionStorage.setItem('trigger_project_confetti', 'true');
                            }
                            if (targetProjectId) {
                                navigate(`/dashboard/projects/${targetProjectId}/strategy`);
                            } else {
                                navigate('/dashboard/projects');
                            }
                        }} 
                        onLogout={onLogout}
                        onGenerationStateChange={setIsWizardGenerating}
                        onUpdateUser={onUpdateUser}
                    />
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
                className="bg-[#0B1120] border border-slate-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
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
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        user={effectiveUser}
        userId={effectiveUser.id}
        currentPlan={effectiveUser.planLimits?.planName} 
      />
      {showSuccessModal && <SubscriptionSuccessModal onClose={() => setShowSuccessModal(false)} planName={effectiveUser.planLimits?.planName} />}
      <NewsHistoryModal isOpen={showNewsModal} onClose={() => setShowNewsModal(false)} />
    </div>
  );
};