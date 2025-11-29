

import React, { useState, useEffect } from 'react';
import { ViewState, User } from '../types';
import { LayoutDashboard, PlusCircle, MessageSquare, Mail, LogOut, FileText, Menu, X, ChevronDown, ChevronRight, PenTool, Wrench, BookOpen, List } from 'lucide-react';

interface DashboardLayoutProps {
  user: User;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  view?: ViewState;
  subItems?: { label: string; view: ViewState; icon?: any }[];
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  currentView,
  onNavigate,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State to track which menu section is expanded.
  const [expandedMenu, setExpandedMenu] = useState<string | null>('mid-landing');

  const menuStructure: MenuItem[] = [
    { 
      id: 'dashboard', 
      label: 'Panel Principal', 
      icon: LayoutDashboard, 
      view: ViewState.DASHBOARD 
    },
    {
      id: 'mid-landing',
      label: 'Mis Páginas',
      icon: FileText,
      subItems: [
        { label: 'Ver Páginas', view: ViewState.MY_PAGES, icon: FileText },
        { label: 'Nueva Página', view: ViewState.GENERATOR, icon: PlusCircle }
      ]
    },
    {
      id: 'content-gen',
      label: 'Content Generator Pro',
      icon: BookOpen,
      subItems: [
        { label: 'Ver Artículos', view: ViewState.ARTICLES_LIST, icon: List },
        { label: 'Nuevo Artículo', view: ViewState.ARTICLE_CREATOR, icon: PlusCircle }
      ]
    },
    {
      id: 'tools',
      label: 'Mis Herramientas',
      icon: Wrench,
      subItems: [
        { label: 'Mail Pro', view: ViewState.EMAIL_MARKETING, icon: Mail },
        { label: 'WhatsApp Pro', view: ViewState.WHATSAPP, icon: MessageSquare },
        { label: 'CopySell Pro', view: ViewState.COPY_PRO, icon: PenTool }
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
        const isActive = item.subItems.some(sub => sub.view === currentView);
        if (isActive) {
          setExpandedMenu(item.id);
        }
      }
    });
  }, [currentView]);

  const NavItemRender: React.FC<{ item: MenuItem }> = ({ item }) => {
    const hasSubItems = !!item.subItems;
    const isExpanded = expandedMenu === item.id;
    const isActive = item.view === currentView || (hasSubItems && item.subItems?.some(sub => sub.view === currentView));

    return (
      <div className="mb-1">
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleSubMenu(item.id);
            } else if (item.view) {
              onNavigate(item.view);
              setMobileMenuOpen(false);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
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
        </button>

        {/* Sub Menu */}
        {hasSubItems && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="ml-4 pl-4 border-l border-gray-800 space-y-1">
              {item.subItems?.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(sub.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    currentView === sub.view
                      ? 'text-primary bg-primary/10 font-medium'
                      : 'text-gray-500 hover:text-gray-200'
                  }`}
                >
                  {sub.icon && <sub.icon className="w-4 h-4" />}
                  {sub.label}
                </button>
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Generator<span className="text-primary">AI</span></h2>
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
        <span className="font-bold text-lg text-white">GeneratorAI</span>
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
        {children}
      </main>
    </div>
  );
};