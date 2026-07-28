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
                { id: 'summary', label: '1. Tu Proyecto Digital', icon: LayoutDashboard, module: "FUNDAMENTOS", description: "Visión general del sistema" },
                { id: 'web', label: '2. Tu Página Web de Captura', icon: Globe, module: "SISTEMA DE VENTAS", description: "Páginas de captura" },
                { id: 'hotlinks', label: '3. Tus Enlaces de Afiliado', icon: LinkIcon, module: "FUNDAMENTOS", description: "Tus enlaces de afiliado" },
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
                { id: 'hooks', label: '8. Tus Ganchos de Venta (Hooks)', icon: Zap, module: "FUNDAMENTOS", description: "Ganchos magnéticos" },
                { id: 'content', label: '9. Tu Estrategia de Contenidos', icon: FileText, module: "SISTEMA DE VENTAS", description: "Artículos SEO" },
                { id: 'email', label: '10. Emails: Secuencia de Venta', icon: Mail, module: "SISTEMA DE VENTAS", description: "Nutrición inicial" },
                { id: 'evergreen', label: '11. Emails: Secuencia de Confianza', icon: Calendar, module: "SISTEMA DE VENTAS", description: "Autoridad a largo plazo" },
                { id: 'whatsapp', label: '12. Scripts de WhatsApp (Cierre)', icon: MessageCircle, module: "SISTEMA DE VENTAS", description: "Scripts de venta" },
            ]
        }
    ];

    // Encontrar la etapa correspondiente a la sección activa
    const initialGroupIdx = menuItems.findIndex(group => 
        group.items.some(item => item.id === activeSection)
    );
    const [openGroups, setOpenGroups] = useState<number[]>([initialGroupIdx !== -1 ? initialGroupIdx : 0]);

    const toggleGroup = (gIdx: number) => {
        if (openGroups.includes(gIdx)) {
            setOpenGroups(openGroups.filter(idx => idx !== gIdx));
        } else {
            // Abrir la etapa seleccionada y comprimir las demás
            setOpenGroups([gIdx]);
        }
    };

    useEffect(() => {
        const activeGroupIdx = menuItems.findIndex(group => 
            group.items.some(item => item.id === activeSection)
        );
        if (activeGroupIdx !== -1) {
            setOpenGroups([activeGroupIdx]);
        }
    }, [activeSection]);

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
                                <div className="bg-black/20 py-2 sm:py-2.5 px-1 space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = activeSection === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => onSectionChange && onSectionChange(item.id)}
                                                className={`w-full flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-3.5 sm:py-3 text-sm transition-all text-left border-l-4 rounded-r-xl group cursor-pointer ${
                                                    isActive 
                                                    ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white' 
                                                    : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                {/* Icono Circular/Cuadrado Lección */}
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                                                    isActive 
                                                    ? 'bg-[#FF5A1F] text-white scale-105 shadow-md shadow-[#FF5A1F]/30' 
                                                    : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-700/80 group-hover:text-slate-200'
                                                }`}>
                                                    <item.icon className="w-3.5 h-3.5" />
                                                </div>

                                                {/* Titulo del Menu */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs sm:text-[13.5px] leading-snug ${isActive ? 'text-white font-medium' : 'text-slate-200 font-normal group-hover:text-white'}`}>
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