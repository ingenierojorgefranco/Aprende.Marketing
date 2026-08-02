import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, TrendingUp, Map, UserSearch, 
    Globe, FileText, Mail, Calendar, MessageCircle,
    ChevronRight, Zap, Target, PlayCircle, Play, ChevronDown, Brain, Activity, MessageSquare,
    Link as LinkIcon
} from 'lucide-react';

interface SidebarItem {
    id: string;
    label: string;
    icon: any;
    module: string;
    description?: string;
}

interface ProjectStrategy_SidebarProps {
    activeSection?: string;
    onSectionChange?: (id: string) => void;
}

export const ProjectStrategy_Sidebar: React.FC<ProjectStrategy_SidebarProps> = ({ 
    activeSection = 'summary', 
    onSectionChange 
}) => {
    const menuItems: { module: string; items: SidebarItem[] }[] = [
        {
            module: "ETAPA 1 — ACTIVA TU SISTEMA",
            items: [
                { id: 'summary', label: '1. Confirma tu proyecto', icon: LayoutDashboard, module: "FUNDAMENTOS", description: "Visión general del sistema" },
                { id: 'avatar', label: '2. Conoce a tu Comprador Ideal', icon: UserSearch, module: "FUNDAMENTOS", description: "Llega al Público Correcto" },
                { id: 'web', label: '3. Activa tu Página de Captura', icon: Globe, module: "SISTEMA DE VENTAS", description: "Páginas de captura" },
                { id: 'hotlinks', label: '4. Configura tus enlaces de afiliado', icon: LinkIcon, module: "FUNDAMENTOS", description: "Tus enlaces de afiliado" },
            ]
        },
        {
            module: "ETAPA 2: TU MERCADO Y CLIENTE",
            items: []
        },
        {
            module: "ETAPA 2: TU SISTEMA DE VENTAS (LISTO PARA USAR)",
            items: [
                { id: 'hooks', label: '5. Crea tus hooks de atracción', icon: Zap, module: "FUNDAMENTOS", description: "Ganchos magnéticos" },
                { id: 'content', label: '6. Prepara tu estrategia de contenidos', icon: FileText, module: "SISTEMA DE VENTAS", description: "Artículos SEO" },
                { id: 'email', label: '7. Activa tu secuencia de venta', icon: Mail, module: "SISTEMA DE VENTAS", description: "Nutrición inicial" },
                { id: 'evergreen', label: '8. Activa tu secuencia de confianza', icon: Calendar, module: "SISTEMA DE VENTAS", description: "Autoridad a largo plazo" },
                { id: 'whatsapp', label: '9. Configura tus mensajes de cierre', icon: MessageCircle, module: "SISTEMA DE VENTAS", description: "Scripts de venta" },
            ]
        }
    ].filter(group => group.items.length > 0);

    const sectionAliases: Record<string, string> = {
        '1': 'summary',
        '2': 'avatar',
        '3': 'web',
        '4': 'hotlinks',
        '5': 'hooks',
        '6': 'content',
        '7': 'email',
        '8': 'evergreen',
        '9': 'whatsapp',
        summary: 'summary',
        avatar: 'avatar',
        web: 'web',
        hotlinks: 'hotlinks',
        hooks: 'hooks',
        content: 'content',
        email: 'email',
        evergreen: 'evergreen',
        whatsapp: 'whatsapp',
    };

    const currentSectionId = sectionAliases[String(activeSection)] || String(activeSection);

    const [openGroups, setOpenGroups] = useState<number[]>(menuItems.map((_, i) => i));

    const toggleGroup = (gIdx: number) => {
        if (openGroups.includes(gIdx)) {
            setOpenGroups(openGroups.filter(idx => idx !== gIdx));
        } else {
            setOpenGroups([...openGroups, gIdx]);
        }
    };

    useEffect(() => {
        const activeGroupIdx = menuItems.findIndex(group => 
            group.items.some(item => item.id === currentSectionId || item.id === String(activeSection))
        );
        if (activeGroupIdx !== -1) {
            setOpenGroups(prev => prev.includes(activeGroupIdx) ? prev : [...prev, activeGroupIdx]);
        }
    }, [activeSection, currentSectionId]);

    return (
        <div className="w-full bg-[#0B1120] border border-slate-800 rounded-2xl flex flex-col shadow-2xl transition-all duration-300 overflow-hidden">
            {/* --- HEADER MATCHING GUIA DE IMPLEMENTACION --- */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0d1322] flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                    <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase leading-tight">
                        Guía de implementación
                    </h3>
                </div>
            </div>

            {/* --- LISTADO DE SECCIONES (LECCIONES) --- */}
            <div className="flex-1 divide-y divide-slate-800">
                {menuItems.map((group, gIdx) => {
                    const isOpen = openGroups.includes(gIdx);
                    return (
                        <div key={gIdx} className="border-b border-slate-800/80 last:border-0">
                            {/* Cabecera de Módulo */}
                            <button 
                                onClick={() => toggleGroup(gIdx)}
                                className="w-full flex items-center justify-between px-3.5 py-3 sm:px-4 sm:py-3.5 hover:bg-slate-800/60 transition-all text-left bg-slate-900/40 group cursor-pointer border-b border-slate-800/40"
                            >
                                <span className="font-bold text-slate-200 group-hover:text-white text-[11px] sm:text-xs uppercase tracking-wider pr-1.5 transition-colors leading-tight">
                                    {group.module}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#FF5A1F]' : ''}`} />
                            </button>
                            
                            {isOpen && (
                                <div className="bg-black/20 p-2 space-y-1.5">
                                    {group.items.map((item) => {
                                        const isActive = currentSectionId === item.id || activeSection === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => onSectionChange && onSectionChange(item.id)}
                                                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 text-left border group cursor-pointer ${
                                                    isActive 
                                                    ? 'bg-gradient-to-r from-[#FF5A1F]/85 via-[#FF5A1F]/30 to-transparent border-[#FF5A1F]/50 text-white font-semibold shadow-lg shadow-[#FF5A1F]/20' 
                                                    : 'border-transparent text-[#B0B0B0] hover:bg-gradient-to-r hover:from-[#FF5A1F]/35 hover:via-[#FF5A1F]/10 hover:to-transparent hover:border-[#FF5A1F]/30 hover:text-white font-medium'
                                                }`}
                                            >
                                                {/* Icono Lección */}
                                                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#B0B0B0] group-hover:text-white'}`} />

                                                {/* Titulo del Menu */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-[14.5px] tracking-tight leading-tight ${isActive ? 'text-white font-semibold' : 'text-[#B0B0B0] font-medium group-hover:text-white'}`}>
                                                        {item.label}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};