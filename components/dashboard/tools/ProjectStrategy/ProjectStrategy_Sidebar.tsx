import React from 'react';
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
    activeSection: string;
    onSectionChange: (id: string) => void;
}

export const ProjectStrategy_Sidebar: React.FC<ProjectStrategy_SidebarProps> = ({ activeSection, onSectionChange }) => {
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