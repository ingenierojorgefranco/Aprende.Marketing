import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LayoutDashboard, PlusCircle, MessageSquare, Mail, LogOut, FileText, Menu, X, ChevronDown, ChevronRight, PenTool, Wrench, BookOpen, List } from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  isOffline?: boolean;
}

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  path?: string;
  subItems?: { label: string; path: string; icon?: any }[];
};

export const DashboardLayout = ({
  user,
  onLogout,
  isOffline,
}: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('mid-landing');
  const location = useLocation();
  const navigate = useNavigate();

  const menuStructure: MenuItem[] = [
    { 
      id: 'dashboard', 
      label: 'Panel Principal', 
      icon: LayoutDashboard, 
      path: '/dashboard'
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

  // Helper to check if a subitem is active to keep parent open
  useEffect(() => {
    menuStructure.forEach(item => {
      if (item.subItems) {
        const isActive = item.subItems.some(sub => location.pathname === sub.path);
        if (isActive) {
          setExpandedMenu(item.id);
        }
      }
    });
  }, [location.pathname]);

  const NavItemRender: React.FC<{ item: MenuItem }> = ({ item }) => {
    const hasSubItems = !!item.subItems;
    const isExpanded = expandedMenu === item.id;
    // Lógica para saber si está activo (coincidencia exacta o parcial para subitems)
    const isActive = item.path === location.pathname || (hasSubItems && item.subItems?.some(sub => sub.path === location.pathname));

    return (
      <div className="mb-1">
        <div
          onClick={() => {
            if (hasSubItems) {
              toggleSubMenu(item.id);
            } else if (item.path) {
              navigate(item.path);
              setMobileMenuOpen(false);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors cursor-pointer ${
            isActive && !hasSubItems
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          {hasSubItems && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </div>

        {/* Sub Menu */}
        {hasSubItems && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="ml-4 pl-4 border-l border-gray-800 space-y-1">
              {item.subItems?.map((sub, idx) => (
                <Link
                  key={idx}
                  to={sub.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    location.pathname === sub.path
                      ? 'text-primary bg-primary/10 font-medium'
                      : 'text-gray-500 hover:text-gray-200'
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

  return (
    <div className="min-h-screen bg-black text-gray-200 flex font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">PlataformaDe<span className="text-primary">Venta</span></h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Panel de Control</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuStructure.map(item => (
            <NavItemRender key={item.id} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-900 z-10">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="text-sm overflow-hidden">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition text-sm"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-gray-900 border-b border-gray-800 z-20 flex items-center justify-between p-4">
        <span className="font-bold text-lg text-white">PlataformaDeVenta</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 z-10 pt-20 px-4 overflow-y-auto">
           <nav className="space-y-2 pb-10">
            {menuStructure.map(item => (
              <NavItemRender key={item.id} item={item} />
            ))}
            <div className="border-t border-gray-800 my-4"></div>
            <button onClick={onLogout} className="text-red-400 flex gap-2 mt-4 px-4 w-full items-center">
              <LogOut className="w-5 h-5" /> Cerrar Sesión
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto mt-16 md:mt-0 bg-black">
        {isOffline && (
            <div className="mb-6 bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2">
               {/* @ts-ignore */}
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M8.56 2.69a10 10 0 0 1 8.13 13.54"/><path d="M10.83 17.17a6 6 0 0 1-5.66-3.87"/><path d="M13.62 2.11c.57.06 1.13.16 1.67.29"/><path d="M1.42 9a16 16 0 0 1 1.77-3.15"/></svg>
                <span><strong>Modo Offline:</strong> No se pudo conectar a la Base de Datos. Usando almacenamiento local temporal.</span>
            </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};