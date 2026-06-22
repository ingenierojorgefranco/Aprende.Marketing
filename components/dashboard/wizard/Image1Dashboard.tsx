import React, { useState } from "react";
import { 
  Home, 
  Target, 
  FileText, 
  Play, 
  Users, 
  BarChart3, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Bell, 
  ChevronDown, 
  Tag, 
  Percent, 
  TrendingUp, 
  Globe, 
  Copy, 
  ExternalLink, 
  Rocket, 
  Download, 
  Eye, 
  Crown, 
  CheckCircle2, 
  DollarSign,
  ChevronRight,
  Sparkles,
  Mail,
  MessageSquare,
  Calendar,
  Folder,
  Gift,
  Star,
  Lock
} from "lucide-react";

interface Image1DashboardProps {
  projectName?: string;
  onNavigateToSection?: (section: string) => void;
  onUpgradeClick?: () => void;
  hideHeader?: boolean;
}

export const Image1Dashboard: React.FC<Image1DashboardProps> = ({
  projectName = "Curso Profesional de Microblading de Cejas",
  onNavigateToSection,
  onUpgradeClick,
  hideHeader = false,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyLink = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="w-full text-gray-100 font-sans relative">
      {/* 1. Cabecera Premium */}
      {!hideHeader && (
        <header className="h-20 bg-[#0B0C10] border-b border-white/[0.055] px-6 md:px-8 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF5A1F] h-9 w-[38px] rounded-lg flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#FF5A1F]/20 select-none">
              AM
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Aprende.<span className="text-[#FF5A1F]">Marketing</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <button className="relative w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] transition-all group">
              <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#FF5A1F] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#101218]">
                3
              </span>
            </button>

            {/* Menú de cuenta */}
            <div className="flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-full py-1.5 pl-2 pr-4 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-[#FF5A1F] text-white font-black text-sm flex items-center justify-center shadow-md">
                B
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-300">Mi cuenta</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Container Principal de Ancho Máximo Controlado (1760px) */}
      <div className="w-full max-w-[1760px] mx-auto px-8 py-8 relative z-10">
        
        {/* Layout Principal en Grid de 3 Columnas: Sidebar (280px) + Contenido Central (Flexible) + Sidebar Derecha (320px) */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px] gap-6 items-start">
          
          {/* Columna 1: Navegación Lateral Izquierda (Ancho Fijo 280px) */}
          <aside className="w-full lg:w-[280px] p-6 flex flex-col justify-between space-y-8 text-left shrink-0">
            <div className="space-y-8">
              
              {/* Botón Activo Principal con Acabado Premium */}
              <button className="w-full min-h-[48px] bg-[#18110D] py-3 px-4 rounded-[14px] flex items-center gap-3 text-[#FF5A1F] font-medium text-[14px] text-left transition-all">
                <Home className="w-5 h-5 text-[#FF5A1F]" />
                <span>Resumen del proyecto</span>
              </button>

              {/* Grupo MI PROYECTO (Separación con space-y-3/space-y-2) */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase px-4 block">
                  MI PROYECTO
                </span>
                <nav className="space-y-2">
                  {[
                    { name: "Estrategia de ventas", icon: Target, key: "strategy" },
                    { name: "Página de captura", icon: Globe, key: "landing" },
                    { name: "Videos de atracción", icon: Play, key: "reels" },
                    { name: "Artículos de Blog", icon: FileText, key: "blog" },
                    { name: "Email Marketing", icon: Mail, key: "email" },
                    { name: "Secuencias de WhatsApp", icon: MessageSquare, key: "avatar" },
                  ].map((item) => (
                    <button
                      key={item.name}
                      onClick={() => onNavigateToSection?.(item.key)}
                      className="w-full hover:bg-white/[0.02] text-zinc-300 hover:text-white h-12 px-4 rounded-[14px] flex items-center gap-3 text-[14px] font-medium text-left transition-all group"
                    >
                      <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-[#FF5A1F] transition-colors shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Grupo RECURSOS */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase px-4 block">
                  RECURSOS
                </span>
                <nav className="space-y-2">
                  {[
                    { name: "Blog y artículos", icon: FileText, key: "blog" },
                    { name: "Plantillas y guías", icon: Layers, key: "templates" },
                  ].map((item) => (
                    <button
                      key={item.name}
                      className="w-full hover:bg-white/[0.02] text-zinc-300 hover:text-white h-12 px-4 rounded-[14px] flex items-center gap-3 text-[14px] font-medium text-left transition-all group"
                    >
                      <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-[#FF5A1F] transition-colors shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

            </div>

            {/* Caja Inferior de Ayuda */}
            <div className="bg-[#13151D]/30 p-5 rounded-[20px] relative overflow-hidden text-left">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FF5A1F]/5 blur-xl rounded-full"></div>
              <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="text-[14px] font-bold text-white mb-1">¿Necesitas ayuda?</h4>
              <p 
                style={{ fontSize: "1em" }}
                className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up mb-4"
              >
                Accede a nuestras guías y preguntas frecuentes.
              </p>
              <button className="w-full bg-white/[0.02] hover:bg-white/[0.05] text-zinc-300 hover:text-white py-2 px-3 rounded-lg border border-white/10 text-xs font-bold flex items-center justify-between transition-all group">
                <span>Ir a ayuda</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </aside>

          {/* Columna 2: Contenido Principal Central (Flexible) */}
          <main className="flex-1 space-y-8 text-left">
            
            {/* Título de Proyecto y Status con Jerarquía y Tamaños Premium */}
            <div className="space-y-3">
              <div>
                <span className="inline-flex bg-[#102A1E] text-[#10B981] border border-[#10B981]/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider items-center gap-1.5 shrink-0 shadow-sm mb-3">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse"></span>
                  Proyecto activo
                </span>
                <h1 className="text-white font-bold text-[48px] leading-[52px] tracking-[-0.02em]">
                  {projectName}
                </h1>
              </div>
              <p className="text-white/90 font-medium text-[18px] leading-7 max-w-[720px]">
                Tu página está publicada y tus tres reels están listos para comenzar a atraer visitas.
              </p>
            </div>

            {/* Contenedor de Métricas en Línea y Página Publicada (Espaciado y alineación premium) */}
            <div className="space-y-5">
              
              {/* Bloque de 3 Tarjetas de Información del Producto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Tarjeta 1 - Categoría (Violeta) */}
                <div className="flex items-center gap-5 p-6 rounded-[20px] border border-violet-500/[0.12] bg-[#150F1E]/20 hover:bg-[#150F1E]/35 transition-all group min-h-[96px]">
                  <div className="w-12 h-12 rounded-[14px] border border-violet-500/20 bg-violet-950/20 flex items-center justify-center text-violet-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-left py-0.5">
                    <span className="text-violet-400 text-[11px] font-bold tracking-wider uppercase block">
                      Categoría
                    </span>
                    <span className="text-white text-[18px] font-bold block leading-tight mt-1">
                      Belleza y Estética
                    </span>
                  </div>
                </div>

                {/* Tarjeta 2 - Estado (Esmeralda) */}
                <div className="flex items-center gap-5 p-6 rounded-[20px] border border-emerald-500/[0.12] bg-[#0C1713]/20 hover:bg-[#0C1713]/35 transition-all group min-h-[96px]">
                  <div className="w-12 h-12 rounded-[14px] border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-left py-0.5">
                    <span className="text-emerald-400 text-[11px] font-bold tracking-wider uppercase block">
                      Estado del Producto
                    </span>
                    <span className="text-white text-[18px] font-bold block leading-tight mt-1">
                      Activo
                    </span>
                  </div>
                </div>

                {/* Tarjeta 3 - Fecha de Publicación (Amber) */}
                <div className="flex items-center gap-5 p-6 rounded-[20px] border border-amber-500/[0.12] bg-[#1C1710]/20 hover:bg-[#1C1710]/35 transition-all group min-h-[96px]">
                  <div className="w-12 h-12 rounded-[14px] border border-amber-500/20 bg-amber-950/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-left py-0.5">
                    <span className="text-amber-400 text-[11px] font-bold tracking-wider uppercase block">
                      Fecha de publicación
                    </span>
                    <span className="text-white text-[18px] font-bold block leading-tight mt-1">
                      22 de Junio, 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloque de 3 Métricas en Fila Horizontal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Tarjeta 1 - Precio (Cian) */}
                <div className="flex items-center gap-5 p-6 rounded-[20px] border border-cyan-500/[0.12] bg-[#0D151B]/20 hover:bg-[#0D151B]/35 transition-all group min-h-[96px]">
                  <div className="w-12 h-12 rounded-[14px] border border-cyan-500/20 bg-cyan-950/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div className="text-left py-0.5">
                    <span className="text-cyan-400 text-[11px] font-bold tracking-wider uppercase block">
                      Precio del producto
                    </span>
                    <span className="text-white text-[20px] font-bold block leading-tight mt-1">
                      USD 200
                    </span>
                  </div>
                </div>

                {/* Tarjeta 2 - Comisión (Verde) */}
                <div className="flex items-center gap-5 p-6 rounded-[20px] border border-emerald-500/[0.12] bg-[#0C1713]/20 hover:bg-[#0C1713]/35 transition-all group min-h-[96px]">
                  <div className="w-12 h-12 rounded-[14px] border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div className="text-left py-0.5">
                    <span className="text-emerald-400 text-[11px] font-bold tracking-wider uppercase block">
                      Comisión que obtendrás
                    </span>
                    <span className="text-white text-[20px] font-bold block leading-tight mt-1">
                      58 %
                    </span>
                  </div>
                </div>

                {/* Tarjeta 3 - Ganancia (Naranja) */}
                <div className="flex items-center gap-5 p-6 rounded-[20px] border border-[#FF5A1F]/[0.12] bg-[#17110E]/20 hover:bg-[#17110E]/35 transition-all group min-h-[96px]">
                  <div className="w-12 h-12 rounded-[14px] border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 flex items-center justify-center text-[#FF5A1F] shrink-0 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-left py-0.5">
                    <span className="text-[#FF5A1F] text-[11px] font-bold tracking-wider uppercase block">
                      Tu ganancia por venta
                    </span>
                    <span className="text-white text-[20px] font-bold block leading-tight mt-1">
                      USD 116
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Página Publicada (Ancho Completo y diseño fluido premium con altura y campo de texto) */}
              <div className="bg-[#0F1117]/30 border border-white/[0.04] p-7 md:p-8 rounded-[24px] flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-[#0F1117]/50 transition-colors relative group w-full">
                
                {/* Lado izquierdo: Icono de Globo + Título y Estado "En línea" */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/5 border border-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] shrink-0">
                    <Globe className="w-5.5 h-5.5" />
                  </div>
                  <div className="text-left space-y-1.5">
                    <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-[0.06em] block">
                      Página publicada
                    </span>
                    <span className="inline-flex bg-[#102A1E]/80 text-[#10B981] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider items-center gap-1.5 border border-[#10B981]/10">
                      <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse"></span>
                      En línea
                    </span>
                  </div>
                </div>

                {/* Centro: El Campo de texto estilo Input de alta fidelidad, interactivo */}
                <div className="flex-1 max-w-xl w-full">
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="https://microblading.aprende.marketing"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="w-full bg-[#08090C] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#FF5A1F]/30 focus:outline-none rounded-xl px-4 py-3 font-mono text-[14px] text-zinc-300 cursor-text select-all transition-colors shadow-inner"
                    />
                  </div>
                </div>
                
                {/* Lado derecho: Botonera con Ver Detalles y Abrir */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onNavigateToSection?.("landing")}
                    className="bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-zinc-700 h-11 px-4 rounded-[12px] text-zinc-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-zinc-400" />
                    <span>Ver detalles</span>
                  </button>

                  <a
                    href="https://microblading.aprende.marketing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-zinc-700 h-11 px-4 rounded-[12px] text-zinc-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                    <span>Abrir</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Bloque: Siguiente Paso (Publica tu primer reel) + Tu Sistema Inicial */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
              
              {/* Tarjeta Siguiente paso recomendado (65% del ancho) */}
              <div 
                onClick={() => onNavigateToSection?.('reels')} 
                className="xl:col-span-8 bg-[#0F1117] border border-white/[0.04] hover:border-[#FF561E]/30 rounded-[24px] p-7 relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-stretch shadow-lg shadow-black/15 min-h-[300px] cursor-pointer hover:shadow-xl hover:shadow-[#FF5A1F]/5 transition-all group/card"
              >
                <div className="absolute top-0 left-0 w-44 h-44 bg-[#FF561E]/3 blur-2xl rounded-full"></div>
                
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-orange-500 font-bold text-[13px] uppercase tracking-[0.04em] block">
                      Siguiente paso recomendado
                    </span>
                    <h2 className="text-white font-extrabold text-[34px] leading-[40px] tracking-tight group-hover/card:text-[#FF5A1F] transition-colors">
                      Publica tu primer reel
                    </h2>
                    <p 
                      style={{ fontSize: "1em" }}
                      className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up max-w-[500px]"
                    >
                      Descarga tu primer reel y compártelo junto con el enlace de tu página para empezar a atraer tus primeros registros.
                    </p>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigateToSection?.('reels'); }} 
                        className="w-full sm:w-auto h-[52px] rounded-[14px] bg-[#FF5A1F] px-6 text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#E04E1A] transition-all cursor-pointer shadow-[0_4px_20px_rgba(255,90,31,0.25)] hover:shadow-[0_6px_24px_rgba(255,90,31,0.35)] shrink-0"
                      >
                        <Download className="w-4.5 h-4.5" />
                        <span>Ver y descargar mi primer reel</span>
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigateToSection?.('reels'); }} 
                        className="w-full sm:w-auto h-[52px] rounded-[14px] bg-[#111217] hover:bg-[#161720] border border-white/[0.08] hover:border-white/20 px-6 text-zinc-300 hover:text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                      >
                        <Play className="w-4.5 h-4.5 text-zinc-400 group-hover:text-white" />
                        <span>Ver mis 3 reels</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-505 text-xs font-semibold select-none">
                      <Star className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span 
                        style={{ fontSize: "1em" }}
                        className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up"
                      >
                        Ya tienes otros 2 reels listos dentro de tu proyecto.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Miniatura de Video a la derecha de la tarjeta (Aspecto vertical 9:16 expandido) */}
                <div className="w-full md:w-[180px] h-[280px] md:h-auto shrink-0 rounded-[20px] overflow-hidden relative group border border-white/[0.04] aspect-[9/16] flex items-center justify-center bg-[#181820] select-none">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=350&auto=format&fit=crop&q=80"
                    alt="Video preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors"></div>
                  
                  {/* Central Play Badge with integrated duration */}
                  <div className="relative z-10 flex items-center bg-black/60 backdrop-blur-md rounded-full pl-2 pr-4 py-2 border border-white/10 gap-2.5 group-hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/40">
                    <div className="w-10 h-10 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <span className="text-white font-extrabold text-xs tracking-wider">
                      0:35
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta Derecha: Tu sistema inicial está listo (35% del ancho) con sección PRO y candados */}
              <div className="xl:col-span-4 bg-[#0F1117] border border-white/[0.04] rounded-[24px] p-6 text-left flex flex-col justify-between items-stretch min-h-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white text-[18px] font-extrabold tracking-tight">
                      Tu sistema inicial está listo
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    <li 
                      className="flex items-center gap-3 cursor-pointer hover:text-orange-500 transition-all group"
                      onClick={() => onNavigateToSection?.('strategy')}
                    >
                      <div className="w-[18px] h-[18px] rounded-full bg-[#102A1E] border border-[#10B981]/15 flex items-center justify-center text-[#10B981] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span 
                        style={{ fontSize: "1em" }} 
                        className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up group-hover:text-orange-500 transition-colors"
                      >
                        Estrategia de Ventas Lista
                      </span>
                    </li>

                    <li 
                      className="flex items-center gap-3 cursor-pointer hover:text-orange-500 transition-all group"
                      onClick={() => onNavigateToSection?.('landing')}
                    >
                      <div className="w-[18px] h-[18px] rounded-full bg-[#102A1E] border border-[#10B981]/15 flex items-center justify-center text-[#10B981] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span 
                        style={{ fontSize: "1em" }} 
                        className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up group-hover:text-orange-500 transition-colors"
                      >
                        Página de captura publicada
                      </span>
                    </li>

                    <li 
                      className="flex items-center gap-3 cursor-pointer hover:text-orange-500 transition-all group"
                      onClick={() => onNavigateToSection?.('reels')}
                    >
                      <div className="w-[18px] h-[18px] rounded-full bg-[#102A1E] border border-[#10B981]/15 flex items-center justify-center text-[#10B981] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span 
                        style={{ fontSize: "1em" }} 
                        className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up group-hover:text-orange-500 transition-colors"
                      >
                        3 reels listos para publicar
                      </span>
                    </li>
                  </ul>

                  <div className="bg-[#102A1E]/20 border border-[#10B981]/15 px-3.5 h-9 rounded-xl flex items-center gap-2 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span 
                      className="text-[#10B981] text-xs font-bold tracking-wide text-lg md:text-xl md:leading-relaxed animate-fade-in-up" 
                      style={{ fontSize: "0.90em" }}
                    >
                      3 de 3 elementos completados
                    </span>
                  </div>

                  {/* Divisor visual limpio */}
                  <div className="border-t border-white/[0.06] my-4" />

                  {/* Nueva Sección de Candados: Desbloquea con Pro */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 text-[#FF5A1F]">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span className="font-extrabold text-[15px] tracking-tight">
                        Actualiza a PRO y Recibe
                      </span>
                    </div>

                    <ul className="grid grid-cols-1 gap-3">
                      {[
                        "Email marketing automatizado",
                        "Secuencias de WhatsApp",
                        "Hasta 30 reels al mes",
                        "Hasta 15 artículos de blog",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-zinc-400">
                          <Lock className="w-3.5 h-3.5 text-[#FF5A1F]/70 shrink-0" />
                          <span 
                            style={{ fontSize: "1em" }}
                            className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up"
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Botón CTA Actualizar a Pro */}
                <div className="pt-5">
                  <button
                    onClick={onUpgradeClick}
                    className="w-full h-[46px] rounded-xl bg-transparent hover:bg-[#FF5A1F]/5 border border-[#FF5A1F] text-[#FF5A1F] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#FF5A1F]/5"
                  >
                    <Crown className="w-4 h-4 text-[#FF5A1F] fill-[#FF5A1F]/10" />
                    <span>Actualizar a Pro</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Sección: Resumen de rendimiento (Métricas de conversión y visitas generadas para tu negocio en tiempo real) */}
            <div className="bg-[#0F1117] border border-white/[0.04] rounded-[20px] p-6 text-left space-y-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  <h3 className="text-white font-bold text-[22px] leading-[28px]">
                    Resumen de rendimiento
                  </h3>
                </div>
                <p 
                  style={{ fontSize: "1em" }}
                  className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up"
                >
                  Métricas de conversión y visitas generadas para tu negocio en tiempo real
                </p>
              </div>

              {/* Grilla estadística unificada (3 elegantes columnas) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Visitas a la página", val: "487", change: "↑ 18%", icon: Eye },
                  { label: "Registros (Leads)", val: "12", change: "↑ 9%", icon: Users },
                  { label: "Tasa de conversión", val: "2,46%", change: "↑ 0,8%", icon: Percent },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-[#13131a]/60 border border-white/[0.04] p-6 h-[142px] rounded-[20px] flex flex-col justify-between hover:bg-[#151522] transition-all relative overflow-hidden group">
                    {/* El degradado sutil de fondo inferior (onda suave naranja/rojo) */}
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-orange-500/10 to-transparent group-hover:from-orange-500/20 transition-all pointer-events-none" />
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full pointer-events-none group-hover:bg-orange-500/10 transition-all" />
                    
                    <div className="flex items-center justify-between w-full relative z-10">
                      <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-[0.06em] block">
                        {stat.label}
                      </span>
                      <stat.icon className="w-4.5 h-4.5 text-zinc-550 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="flex items-end justify-between relative z-10">
                      <span className="text-white font-extrabold text-[36px] leading-none tracking-tight block">
                        {stat.val}
                      </span>
                      
                      {/* Píldora de badge verde sutil de alta fidelidad style */}
                      <span className="inline-flex items-center gap-1 bg-[#102A1E]/80 text-[#10B981] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider border border-[#10B981]/15 leading-none shadow-sm shadow-black/20">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>

          {/* Columna 3: Sidebar Fijo de la Derecha (320px) */}
          <div className="w-full xl:w-[320px] shrink-0 space-y-6 self-start">
            
            {/* Tarjeta de Upsell PRO (Aprende Marketing Pro - Premium Dorada en el tope) */}
            <div className="bg-[#0F1117] border border-[#E2B05E]/15 hover:border-[#E2B05E]/35 rounded-[24px] p-6 text-left relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E2B05E]/5 blur-3xl rounded-full"></div>
              
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#E2B05E]">
                    <Crown className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Aprende Marketing Pro
                    </span>
                  </div>
                  
                  <h3 className="text-white text-[19px] font-extrabold tracking-tight leading-snug">
                    Escala tu proyecto y mantén tu contenido activo cada mes.
                  </h3>
                </div>

                <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{
                    fontSize: "1em",
                    lineHeight: "1.5em",
                }}>
                  Tu plan gratuito ya te permitió lanzar tu primera página y tus primeros reels. Con Pro podrás seguir creando contenido, activar automatizaciones y crecer sin frenar tu sistema.
                </p>

                {/* Lista de Beneficios del Plan Pro con iconos temáticos específicos */}
                <ul className="space-y-3.5 pt-2">
                  {[
                    { label: "Hasta 30 reels al mes", icon: Globe },
                    { label: "Hasta 15 artículos de blog al mes", icon: FileText },
                    { label: "Email marketing automatizado", icon: Mail },
                    { label: "Secuencias de WhatsApp", icon: MessageSquare },
                    { label: "Hasta 3 proyectos activos", icon: Folder },
                    { label: "Nuevos hooks, ángulos y formatos", icon: Sparkles },
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="text-[#E2B05E] shrink-0">
                        <benefit.icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{
                          fontSize: "0.90em",
                          lineHeight: "1em",
                      }}>
                        {benefit.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón CTA Dorado y descripción reducida */}
              <div className="space-y-4 pt-6">
                <button
                  onClick={onUpgradeClick}
                  className="w-full bg-gradient-to-r from-[#F5C061] to-[#AD7229] hover:brightness-110 active:scale-98 text-zinc-950 rounded-[12px] py-3 flex flex-col items-center justify-center gap-0.5 shadow-[0_6px_20px_rgba(226,176,94,0.15)] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest leading-none">
                    <span>Mejorar a Pro</span>
                    <Crown className="w-3.5 h-3.5 fill-current text-zinc-950" />
                  </div>
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider leading-none">
                    USD 39/mes
                  </span>
                </button>
                
                <span 
                  style={{ fontSize: "1em" }}
                  className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up block text-center"
                >
                  Cancela cuando quieras · Sin permanencia · Activación inmediata
                </span>
              </div>
            </div>

            {/* Tarjeta Plan Gratuito (Ahora en la parte inferior) */}
            <div className="bg-[#0F1117] border border-white/[0.04] rounded-[24px] p-6 text-left relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="space-y-0.5">
                  <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider block">
                    Tu plan actual
                  </span>
                  <h4 className="text-white text-lg font-black tracking-tight">
                    Plan gratuito
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-450 text-zinc-500">
                  <Gift className="w-4.5 h-4.5" />
                </div>
              </div>

              {/* Lista de Recursos Usados */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.03]">
                  <div className="flex items-center gap-2 w-max">
                    <Folder className="w-4 h-4 text-zinc-500" />
                    <span 
                      style={{ fontSize: "1em" }}
                      className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up"
                    >
                      1 proyecto activo
                    </span>
                  </div>
                </div>

                <div className="pb-3 border-b border-white/[0.03]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-zinc-500 animate-pulse" />
                      <span 
                        style={{ fontSize: "1em" }}
                        className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up"
                      >
                        3/3 reels utilizados este mes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <span 
                      style={{ fontSize: "1em" }}
                      className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up"
                    >
                      1 artículo disponible este mes
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón Ver límites del plan (rounded-12px, h-12) */}
              <button 
                onClick={onUpgradeClick}
                className="w-full mt-6 bg-[#13131a] hover:bg-[#FF5A1F]/5 active:scale-98 text-orange-500 border border-orange-500/20 h-11 rounded-[12px] text-[12px] font-bold flex items-center justify-between px-5 transition-all cursor-pointer"
              >
                <span>Logra Mejores Resultados</span>
                <ChevronRight className="w-4 h-4 text-orange-500" />
              </button>
            </div>

          </div>

        </div>

        {/* Sección: Esto hemos generado para ti (Diseño alineado a max-w-1400px de alta fidelidad) */}
        <div className="max-w-[1400px] mx-auto w-full mt-12 md:mt-16 space-y-6 text-left px-4 md:px-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-lg">✦</span>
              <h3 className="text-white font-bold text-[22px] leading-[28px] tracking-tight">
                Esto hemos <span className="text-orange-500">generado</span> para ti
              </h3>
            </div>
            <p 
              style={{ fontSize: "1em" }}
              className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up"
            >
              Previsualiza cada parte de tu sistema. Haz clic en cualquier tarjeta para ver el contenido completo.
            </p>
          </div>

          {/* Cuadrícula bento de 6 tarjetas de alta fidelidad, idénticas a la Imagen 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Estrategia de Ventas",
                badge: "PLAN DE ATRACCIÓN",
                badgeColor: "text-orange-500/90 bg-orange-500/5 border-orange-500/10",
                desc: "Tu plan de ruta estratégico para posicionar tu marca en el mercado y escalar tus ventas de forma óptima.",
                info: "8 componentes creados",
                infoIcon: Target,
                btnText: "Explorar",
                btnColor: "bg-[#FF5A1F] hover:bg-orange-600 shadow-[0_4px_12px_rgba(255,90,31,0.15)]",
                key: "strategy",
              },
              {
                title: "Pagina Web de Captura",
                badge: "GENERADOR DE PROSPECTOS",
                badgeColor: "text-blue-400 bg-blue-500/5 border-blue-500/10",
                desc: "Embudo de captación optimizado para dispositivos móviles que convierte visitas en registros en segundos.",
                info: "2 páginas optimizadas",
                infoIcon: Globe,
                btnText: "Explorar",
                btnColor: "bg-[#1E5AF3] hover:bg-blue-600 shadow-[0_4px_12px_rgba(30,90,243,0.15)]",
                key: "landing",
              },
              {
                title: "Video Hooks de Atraccion",
                badge: "GUIONES DE ALTO IMPACTO",
                badgeColor: "text-orange-400 bg-orange-500/5 border-orange-500/10",
                desc: "Estructuras magnéticas y guiones persuasivos diseñados para atrapar la atención en los primeros 3 segundos.",
                info: "20 ganchos persuasivos",
                infoIcon: Play,
                btnText: "Explorar",
                btnColor: "bg-[#FF5A1F] hover:bg-orange-600 shadow-[0_4px_12px_rgba(255,90,31,0.15)]",
                key: "reels",
              },
              {
                title: "Artículos de Blog (SEO)",
                badge: "TRÁFICO ORGÁNICO CONSTANTE",
                badgeColor: "text-purple-400 bg-purple-500/5 border-purple-500/10",
                desc: "Contenido de alto valor optimizado para dominar los buscadores y captar la demanda real de tu audiencia.",
                info: "12 artículos de blog",
                infoIcon: FileText,
                btnText: "Explorar",
                btnColor: "bg-[#7C3AED] hover:bg-purple-600 shadow-[0_4px_12px_rgba(124,58,237,0.15)]",
                key: "blog",
              },
              {
                title: "Email Marketing Automatizado",
                badge: "NUTRICIÓN Y AUTOMATIZACIÓN",
                badgeColor: "text-amber-400 bg-amber-500/5 border-amber-500/10",
                desc: "Flujos de correo estratégico que nutren la confianza del cliente y cierran ventas en piloto automático.",
                info: "3 emails de secuencia",
                infoIcon: Mail,
                btnText: "Explorar",
                btnColor: "bg-[#D97706] hover:bg-amber-650 shadow-[0_4px_12px_rgba(217,119,6,0.15)]",
                key: "email",
              },
              {
                title: "Secuencias de WhatsApp",
                badge: "MENSAJERÍA CONVERSACIONAL",
                badgeColor: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
                desc: "Secuencia automatizada de respuestas interactivas y guiones persuasivos en tus canales de chat para resolver objeciones y cerrar ventas.",
                info: "1 secuencia estructurada",
                infoIcon: MessageSquare,
                btnText: "Explorar",
                btnColor: "bg-[#10B981] hover:bg-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.15)]",
                key: "avatar",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateToSection?.(card.key)}
                className="bg-[#0F1117] border border-white/[0.04] p-6 rounded-[24px] flex flex-col justify-between hover:bg-[#13151D] hover:border-white/[0.08] transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Watermark / Icono de background gigante */}
                <div className="absolute -bottom-6 -right-6 text-white/[0.02] group-hover:text-white/[0.04]/70 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0">
                  <card.infoIcon className="w-32 h-32" />
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Cabecera de la tarjeta: Icono estilizado circular de color sutil + Textos */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-450 group-hover:scale-105 transition-transform shrink-0">
                      <card.infoIcon className="w-5 h-5 text-zinc-350" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h4 className="text-white text-[15px] font-bold tracking-tight">
                        {card.title}
                      </h4>
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p 
                    style={{ fontSize: "1em", lineHeight: "1.5em" }}
                    className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up text-left min-h-[44px]"
                  >
                    {card.desc}
                  </p>
                </div>

                {/* Fila inferior de estado + Botón Explorar */}
                <div className="flex items-center justify-between pt-5 mt-4 border-t border-white/[0.04] w-full relative z-10">
                  <div className="flex items-center gap-1.5 text-zinc-550 font-semibold text-[12px]">
                    <card.infoIcon className="w-4 h-4 text-zinc-500" />
                    <span>{card.info}</span>
                  </div>
                  
                  <button className={`h-9 px-4 rounded-full text-white font-bold text-xs flex items-center gap-1.5 transition-all ${card.btnColor}`}>
                    <span>{card.btnText}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
