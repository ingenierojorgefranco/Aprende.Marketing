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
  Lock,
  X
} from "lucide-react";

interface Image1DashboardProps {
  projectName?: string;
  projectNiche?: string;
  projectPrice?: number;
  projectCommission?: number;
  projectUrl?: string;
  projectPublishedAt?: string | Date;
  projectVisits?: number;
  projectConversions?: number;
  onNavigateToSection?: (section: string) => void;
  onUpgradeClick?: () => void;
  hideHeader?: boolean;
}

export const Image1Dashboard: React.FC<Image1DashboardProps> = ({
  projectName = "Curso Profesional de Microblading de Cejas",
  projectNiche = "Belleza y estética",
  projectPrice = 200,
  projectCommission = 58,
  projectUrl = "https://microblading.aprende.marketing",
  projectPublishedAt = "2026-06-22",
  projectVisits = 487,
  projectConversions = 12,
  onNavigateToSection,
  onUpgradeClick,
  hideHeader = false,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const formatSpanishDate = (dateVal?: string | Date) => {
    if (!dateVal) return "22 de junio de 2026";
    try {
      const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
      if (isNaN(d.getTime())) return "22 de junio de 2026";
      const day = d.getDate();
      const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} de ${month} de ${year}`;
    } catch (e) {
      return "22 de junio de 2026";
    }
  };

  const getEarnings = (price: number, commission: number) => {
    if (!commission) return 0;
    const rate = (commission > 0 && commission < 1) ? commission : commission / 100;
    return Math.round(price * rate);
  };

  const displayDate = formatSpanishDate(projectPublishedAt);
  const calculatedEarnings = getEarnings(projectPrice, projectCommission);
  const displayCommission = projectCommission > 0 && projectCommission < 1 ? Math.round(projectCommission * 100) : projectCommission;

  const conversionRateNum = projectVisits && projectVisits > 0 ? (projectConversions / projectVisits) * 100 : 0;
  const conversionRateStr = conversionRateNum === 0 ? "0,00%" : conversionRateNum.toFixed(2).replace('.', ',') + "%";

  const visitsChange = projectVisits > 0 ? `↑ ${(projectVisits * 0.037).toFixed(1).replace('.', ',')}%` : "0%";
  const conversionsChange = projectConversions > 0 ? `↑ ${(projectConversions * 0.75).toFixed(1).replace('.', ',')}%` : "0%";
  const conversionRateChange = conversionRateNum > 0 ? `↑ ${(conversionRateNum * 0.3 + 0.1).toFixed(1).replace('.', ',')}%` : "0%";

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
                  Tu página está publicada y tus tres reels están listos para comenzar a atraer visitas.
                </span>
                <h1 className="text-white font-bold text-[48px] leading-[52px] tracking-[-0.02em]">
                  {projectName}
                </h1>
              </div>
              <p className="text-zinc-400 text-sm md:text-base font-semibold tracking-wide">
                {projectNiche} · Producto activo · Publicado el {displayDate}
              </p>
            </div>

            {/* Contenedor de Métricas en Línea y Página Publicada (Espaciado y alineación premium) */}
            <div className="space-y-5">

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
                      USD {projectPrice}
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
                      {displayCommission} %
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
                      USD {calculatedEarnings}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Página Publicada (Rediseñada estilo Imagen 3 con campo seleccionable y botón de copiar) */}
              <div className="bg-[#090B11] border border-[#10B981]/15 hover:border-[#10B981]/25 rounded-[20px] shadow-md p-6 flex flex-col gap-4 transition-all relative group w-full text-left">
                
                {/* Fila superior: Icono de Globo + Título y Estado "Publicada" */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Globe className="w-5.5 h-5.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 font-black text-[11px] tracking-wider uppercase block" style={{
                      fontSize: "1em",
                      color: "white",
                      paddingTop: "1em",
                      paddingBottom: "1em",
                    }}>
                      Página web de captura
                    </span>
                    <span className="inline-flex bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
                      Publicada
                    </span>
                  </div>
                </div>

                {/* Fila del medio: Input de URL a lo ancho + Botones alineados de la misma altura */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
                  {/* Campo de URL seleccionable con botón de copiar (Ocupa todo el espacio hasta los botones) */}
                  <div className="relative flex items-center flex-1 bg-[#0C0E14] border border-[#10B981]/15 hover:border-[#10B981]/30 focus-within:border-[#10B981]/50 rounded-xl px-4 h-11 transition-all">
                    <input
                      type="text"
                      readOnly
                      value={projectUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="w-full bg-transparent text-white focus:outline-none font-mono text-sm cursor-text select-all pr-12"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(projectUrl, "url");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.97] transition-all flex items-center justify-center gap-1 border border-white/5"
                      title="Copiar URL"
                    >
                      {copiedText === "url" ? (
                        <span className="text-emerald-400 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                          <span>✓ Copiado</span>
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Botonera con Ver Detalles y Abrir (Alineados exactamente a la par y con altura h-11) */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onNavigateToSection?.("landing")}
                      className="bg-[#12141A]/60 hover:bg-[#12141A]/90 border border-white/5 h-11 px-5 rounded-[12px] text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver detalles</span>
                    </button>

                    <a
                      href={projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-transparent hover:bg-emerald-500/5 border border-emerald-500/20 h-11 px-5 rounded-[12px] text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir página</span>
                    </a>
                  </div>
                </div>

                {/* Fila inferior: Descripción */}
                <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{
                  fontSize: "1em",
                  lineHeight: "1em",
                  paddingTop: "1em",
                  paddingBottom: "0.3em",
                }}>
                  Tu Página Web esta lista para recibir visitas y registrar nuevos contactos.
                </p>
              </div>

            </div>

            {/* Bloque: Siguiente Paso (Publica tu primer reel) + Tu Sistema Inicial */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
              
              {/* Tarjeta Siguiente paso recomendado (65% del ancho) */}
              <div 
                onClick={() => onNavigateToSection?.('reels')} 
                className="xl:col-span-8 bg-[#0F1117] border border-white/[0.04] hover:border-[#FF561E]/30 rounded-[24px] p-7 relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-stretch shadow-lg shadow-black/15 cursor-pointer hover:shadow-xl hover:shadow-[#FF5A1F]/5 transition-all group/card"
              >
                <div className="absolute top-0 left-0 w-44 h-44 bg-[#FF561E]/3 blur-2xl rounded-full"></div>
                
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-orange-500 font-bold text-[13px] uppercase tracking-[0.04em] block">
                      Siguiente paso recomendado
                    </span>
                    <h2 className="text-white font-extrabold text-[28px] leading-[34px] tracking-tight group-hover/card:text-[#FF5A1F] transition-colors">
                      Publica tu primer reel
                    </h2>
                    <div className="space-y-4 max-w-[500px] text-white/95 font-light text-[15px] md:text-[16px] leading-relaxed animate-fade-in-up">
                      <p>
                        Hemos generado 3 videos cortos de menos de 1 minuto (reels) estructurados estratégicamente para captar la atención de tu cliente ideal en los primeros segundos.
                      </p>
                      <p>
                        Puedes publicarlos en tus redes sociales favoritas (Instagram, TikTok o YouTube) para guiar a tus primeros visitantes directamente hacia tu página de captura y empezar a construir tu lista de prospectos.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex flex-col gap-2.5 w-full">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigateToSection?.('reels'); }} 
                        className="w-full h-[40px] rounded-xl bg-[#FF5A1F] px-5 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-[#E04E1A] transition-all cursor-pointer shadow-[0_4px_15px_rgba(255,90,31,0.2)] hover:shadow-[0_6px_20px_rgba(255,90,31,0.3)] active:scale-[0.98] shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span>Ver y Descargar mi primer Reel</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold select-none">
                      <Star className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-zinc-400 font-medium text-[11px]">
                        Ya tienes otros 2 reels listos dentro de tu proyecto.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Miniatura de Video a la derecha de la tarjeta (Aspecto vertical 9:16 expandido) */}
                <div className="w-full md:w-[140px] h-[248px] shrink-0 rounded-[20px] overflow-hidden relative group border border-white/[0.04] flex items-center justify-center bg-[#181820] select-none">
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
              <div className="xl:col-span-4 bg-[#0F1117] border border-white/[0.04] rounded-[24px] p-6 text-left flex flex-col justify-center items-stretch">
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
                  { label: "Visitas a la página", val: String(projectVisits), change: visitsChange, icon: Eye },
                  { label: "Registros (Leads)", val: String(projectConversions), change: conversionsChange, icon: Users },
                  { label: "Tasa de conversión", val: conversionRateStr, change: conversionRateChange, icon: Percent },
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

            {/* Sección: Esto hemos generado para ti (Colocado dentro de main para consistencia de ancho) */}
            <div className="space-y-6 pt-4">
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

              {/* Cuadrícula bento de 6 tarjetas de alta fidelidad */}
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

              {/* Bloque Premium: Comunidad de WhatsApp */}
              <div className="mt-8 bg-[#0F1117]/80 border-2 border-emerald-500/25 rounded-[24px] p-8 relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-center shadow-lg shadow-black/25">
                {/* Decorative emerald glows */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none"></div>
                
                <div className="flex-1 flex flex-col space-y-3 relative z-10 text-left">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="text-xl font-bold">💬</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Comunidad de Alta Fidelidad</span>
                  </div>
                  <h3 className="text-white font-extrabold text-[24px] leading-tight tracking-tight">
                    Únete a nuestra Comunidad de WhatsApp
                  </h3>
                  <p className="text-zinc-300 font-light text-[14px] md:text-[15px] leading-relaxed max-w-[720px]">
                    Aprende junto a otros emprendedores de nuestra comunidad a utilizar todas las herramientas del sistema, comparte tus avances, recibe retroalimentación de expertos y obtén un seguimiento/soporte personalizado para acelerar tus resultados.
                  </p>
                </div>

                <div className="shrink-0 relative z-10 w-full md:w-auto">
                  <a
                    href="https://chat.whatsapp.com/invite"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full md:w-auto h-[50px] rounded-full bg-emerald-500 px-8 text-white font-black text-sm uppercase tracking-wider items-center justify-center gap-2 hover:bg-emerald-600 transition-all cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 duration-200"
                  >
                    <span>Unirse a la Comunidad</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
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

      </div>

      {/* Modal interactiva de Video y Guía: ¿Cómo Publicar? */}
      {showPublishModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300"
          onClick={() => setShowPublishModal(false)}
        >
          <div 
            className="bg-[#0f111a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-black relative flex flex-col max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Botón Cerrar */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#141622]">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h3 className="text-white text-lg font-extrabold tracking-tight">
                  Guía de Publicación de Reels
                </h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left">
              
              {/* Reproductor de Video Simulado */}
              <div className="w-full aspect-video rounded-2xl bg-[#1a1c29] border border-white/5 relative overflow-hidden flex items-center justify-center group shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
                  alt="Tutorial de Publicación"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Botón de Play Central Gigante Simulado */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-2xl shadow-[#FF5A1F]/30 border border-white/20 group-hover:scale-110 group-hover:bg-[#ff6d3c] transition-all duration-300">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                  <span className="text-white text-xs font-black uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm select-none">
                    Ver Video Tutorial (2 min)
                  </span>
                </div>

                {/* Progress bar and controls bar below */}
                <div className="absolute bottom-0 inset-x-0 p-3 flex items-center gap-3 text-[10px] text-zinc-400 font-mono z-10 bg-black/40 backdrop-blur-xs">
                  <Play className="w-3.5 h-3.5 text-orange-500 fill-orange-500 shrink-0" />
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-[#FF5A1F]"></div>
                  </div>
                  <span>02:15</span>
                </div>
              </div>

              {/* Guía Rápida Paso a Paso */}
              <div className="space-y-4">
                <h4 className="text-white font-extrabold text-base uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  Paso a Paso para Publicar con Éxito
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-sm">
                      1
                    </div>
                    <h5 className="text-white font-bold text-sm">Descarga el Reel</h5>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      Navega a la sección de Reels, elige el video generado y descárgalo a tu celular o computadora.
                    </p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-sm">
                      2
                    </div>
                    <h5 className="text-white font-bold text-sm">Pon tu Link en la Bio</h5>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      Copia el enlace de tu página publicada y colócalo de forma visible en la biografía de Instagram, TikTok o Facebook.
                    </p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-sm">
                      3
                    </div>
                    <h5 className="text-white font-bold text-sm">Publica y Llama al Clic</h5>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      Sube el video como Reel con música en tendencia y escribe un copy que invite a la gente a hacer clic en el enlace de tu Bio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips de Rendimiento */}
              <div className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 rounded-2xl p-4.5 space-y-2">
                <h5 className="text-orange-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  💡 Consejos Pro para tener más alcance:
                </h5>
                <ul className="list-disc pl-4 text-zinc-300 text-xs space-y-1.5 font-light leading-relaxed">
                  <li><strong>Primeros 3 segundos:</strong> Es el momento crítico. La portada de tu Reel debe enganchar de inmediato.</li>
                  <li><strong>Consistencia:</strong> Publica tus 3 reels con una diferencia de 24 a 48 horas entre cada uno para mantener el algoritmo activo.</li>
                  <li><strong>Música en tendencia:</strong> Al subir el reel en Instagram o TikTok, selecciona un audio que tenga el ícono de la flecha hacia arriba (tendencia).</li>
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/5 bg-[#141622] flex justify-end">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cerrar Guía
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
