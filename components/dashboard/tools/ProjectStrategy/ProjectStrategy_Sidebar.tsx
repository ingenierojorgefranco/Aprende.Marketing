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
    const [openGroups, setOpenGroups] = useState<number[]>([0, 1, 2]);

    const toggleGroup = (gIdx: number) => {
        if (openGroups.includes(gIdx)) {
            setOpenGroups(openGroups.filter(idx => idx !== gIdx));
        } else {
            setOpenGroups([...openGroups, gIdx]);
        }
    };

    useEffect(() => {
        menuItems.forEach((group, gIdx) => {
            if (group.items.some(item => item.id === activeSection)) {
                setOpenGroups(prev => prev.includes(gIdx) ? prev : [...prev, gIdx]);
            }
        });
    }, [activeSection]);

    const menuItems: { module: string; items: SidebarItem[] }[] = [
        {
            module: "ETAPA 1: LOS CIMIENTOS (FUNDAMENTOS)",
            items: [
                { id: 'summary', label: '1. Tu Nuevo Negocio Digital', icon: LayoutDashboard, module: "FUNDAMENTOS", description: "Visión general del sistema" },
                { id: 'hotlinks', label: '2. Configura tus Enlaces de Afiliado', icon: LinkIcon, module: "FUNDAMENTOS", description: "Tus enlaces de afiliado" },
                { id: 'growth', label: '3. Proyección de tus Ganancias', icon: TrendingUp, module: "FUNDAMENTOS", description: "Proyección de Ingresos" },
                { id: 'blueprint', label: '4. Tu Mapa de Ruta (Blueprint)', icon: Map, module: "FUNDAMENTOS", description: "Ruta para Crecer y Ganar" },
            ]
        },
        {
            module: "ETAPA 2: TU MERCADO Y CLIENTE",
            items: [
                { id: 'avatar', label: '5. Conoce a tu Comprador Ideal', icon: UserSearch, module: "FUNDAMENTOS", description: "Llega al Público Correcto" },
                { id: 'psychology', label: '6. Entiende su Mentalidad', icon: Brain, module: "FUNDAMENTOS", description: "Dolores Vs Beneficios" },
                { id: 'testimonials', label: '7. Los Testimonios de tu Producto', icon: MessageSquare, module: "FUNDAMENTOS", description: "Testimonios de Éxito" },
            ]
        },
        {
            module: "ETAPA 3: TU SISTEMA DE VENTAS (LISTO PARA USAR)",
            items: [
                { id: 'web', label: '8. Mira tu Página de Captura', icon: Globe, module: "SISTEMA DE VENTAS", description: "Páginas de captura" },
                { id: 'hooks', label: '9. Tus Ganchos de Venta (Hooks)', icon: Zap, module: "FUNDAMENTOS", description: "Ganchos magnéticos" },
                { id: 'content', label: '10. Tu Estrategia de Contenidos', icon: FileText, module: "SISTEMA DE VENTAS", description: "Artículos SEO" },
                { id: 'email', label: '11. Emails: Secuencia de Venta', icon: Mail, module: "SISTEMA DE VENTAS", description: "Nutrición inicial" },
                { id: 'evergreen', label: '12. Emails: Secuencia de Confianza', icon: Calendar, module: "SISTEMA DE VENTAS", description: "Autoridad a largo plazo" },
                { id: 'whatsapp', label: '13. Scripts de WhatsApp (Cierre)', icon: MessageCircle, module: "SISTEMA DE VENTAS", description: "Scripts de venta" },
            ]
        }
    ];

    return (
        <div className="w-full bg-[#0B1120] border border-slate-800 rounded-2xl flex flex-col shadow-2xl transition-all duration-300 overflow-hidden">
            {/* --- HEADER MATCHING GUIA DE IMPLEMENTACION --- */}
            <div className="p-5 border-b border-slate-800 bg-[#0d1322] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                    <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-base font-black text-white tracking-tight uppercase leading-tight">
                        Índice Estratégico
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">Contenido de tu proyecto</span>
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
                                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/60 transition text-left bg-slate-900/50 group cursor-pointer"
                            >
                                <span className="font-extrabold text-slate-200 text-xs sm:text-sm uppercase tracking-tight pr-2">{group.module}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#FF5A1F]' : ''}`} />
                            </button>
                            
                            {isOpen && (
                                <div className="bg-black/20 divide-y divide-slate-900/60">
                                    {group.items.map((item) => {
                                        const isActive = activeSection === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => onSectionChange && onSectionChange(item.id)}
                                                className={`w-full flex items-center gap-3 p-3.5 text-xs sm:text-sm transition text-left border-l-4 group cursor-pointer ${
                                                    isActive 
                                                    ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white font-semibold' 
                                                    : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                                }`}
                                            >
                                                {/* Icono Circular Lección */}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                                    isActive 
                                                    ? 'bg-[#FF5A1F] text-white scale-105 shadow-lg shadow-[#FF5A1F]/30' 
                                                    : 'bg-slate-800/90 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                                                }`}>
                                                    <item.icon className="w-3.5 h-3.5" />
                                                </div>

                                                {/* Textos */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-semibold line-clamp-2 leading-snug ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                                        {item.label}
                                                    </p>
                                                    {item.description && (
                                                        <span className="text-[11px] text-slate-400 opacity-75 font-mono mt-0.5 block truncate">
                                                            {item.description}
                                                        </span>
                                                    )}
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