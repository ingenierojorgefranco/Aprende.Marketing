import React from 'react';
import { 
    LayoutDashboard, TrendingUp, Map, UserSearch, 
    Globe, FileText, Mail, Calendar, MessageCircle,
    ChevronRight, Zap, Target, PlayCircle, Play, ChevronDown, Brain, Activity, MessageSquare
} from 'lucide-react';

interface SidebarItem {
    id: string;
    label: string;
    icon: any;
    module: string;
    description?: string;
}

interface ProjectStrategy_SidebarProps {
    activeSection: string;
    onSectionChange: (id: string) => void;
}

export const ProjectStrategy_Sidebar: React.FC<ProjectStrategy_SidebarProps> = ({ activeSection, onSectionChange }) => {
    const menuItems: { module: string; items: SidebarItem[] }[] = [
        {
            module: "Analisis de tu Estrategia",
            items: [
                { id: 'summary', label: 'Resumen Estratégico', icon: LayoutDashboard, module: "FUNDAMENTOS", description: "Visión general del sistema" },
                { id: 'growth', label: 'Proyección de Ingresos', icon: TrendingUp, module: "FUNDAMENTOS", description: "Escalabilidad año 1" },
                { id: 'blueprint', label: 'Mapa de Ruta', icon: Map, module: "FUNDAMENTOS", description: "Flujo del cliente" },
                { id: 'avatar', label: 'Diagnóstico de Avatar', icon: UserSearch, module: "FUNDAMENTOS", description: "Perfil psicológico" },
                { id: 'psychology', label: 'Dolores vs Beneficios', icon: Brain, module: "FUNDAMENTOS", description: "Ingeniería de persuasión" },
                { id: 'testimonials', label: 'Testimonios de Éxito', icon: MessageSquare, module: "FUNDAMENTOS", description: "Prueba social validada" },
            ]
        },
        {
            module: "¿Qué creará nuestro sistema por ti?",
            items: [
                { id: 'web', label: 'Tu Página de Captura.', icon: Globe, module: "SISTEMA DE VENTAS", description: "Páginas de captura" },
                { id: 'hooks', label: 'Hooks de Atracción', icon: Zap, module: "FUNDAMENTOS", description: "Ganchos magnéticos" },
                { id: 'content', label: 'Tu Estrategia de Contenidos', icon: FileText, module: "SISTEMA DE VENTAS", description: "Artículos SEO" },
                { id: 'email', label: 'Email Marketing: Secuencia de Conversión', icon: Mail, module: "SISTEMA DE VENTAS", description: "Nutrición inicial" },
                { id: 'evergreen', label: 'Email Marketing: Secuencia de Nutrición', icon: Calendar, module: "SISTEMA DE VENTAS", description: "Autoridad a largo plazo" },
                { id: 'whatsapp', label: 'Lanzamientos: Estrategia Whatsapp', icon: MessageCircle, module: "SISTEMA DE VENTAS", description: "Scripts de venta" },
            ]
        }
    ];

    return (
        <aside className="w-full bg-[#0b0b0b] border border-gray-800 rounded-2xl flex flex-col sticky top-6 shadow-2xl transition-all duration-300 max-h-[calc(100vh-40px)] overflow-y-auto custom-scrollbar">
            {/* --- HEADER ESTILO ACADEMIA --- */}
            <div className="p-5 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
                <h3 className="text-white font-bold text-lg flex items-center gap-3">
                    <PlayCircle className="w-5 h-5 text-primary" /> Índice Estratégico
                </h3>
            </div>

            {/* --- LISTADO DE SECCIONES (LECCIONES) --- */}
            <div className="flex-1 pb-32">
                {menuItems.map((group, gIdx) => (
                    <div key={gIdx} className="border-b border-gray-800 last:border-0">
                        {/* Cabecera de Módulo (Estilo Botón LMS) */}
                        <button className="w-full flex items-center justify-between p-5 hover:bg-gray-800 transition text-left bg-gray-900/50">
                            <span className="font-bold text-gray-200 text-lg uppercase tracking-tight">{group.module}</span>
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        </button>
                        
                        <div className="bg-black/20">
                            {group.items.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onSectionChange(item.id)}
                                        className={`w-full flex items-center gap-4 p-5 text-base transition text-left border-l-4 group ${
                                            isActive 
                                            ? 'bg-primary/10 border-primary text-white' 
                                            : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                        }`}
                                    >
                                        {/* Icono Circular Lección */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                            isActive 
                                            ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' 
                                            : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700'
                                        }`}>
                                            <item.icon className="w-4 h-4" />
                                        </div>

                                        {/* Textos */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium line-clamp-2 leading-snug ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                {item.label}
                                            </p>
                                            <span className="text-sm opacity-60 font-mono mt-1.5 block">
                                                {item.description}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};