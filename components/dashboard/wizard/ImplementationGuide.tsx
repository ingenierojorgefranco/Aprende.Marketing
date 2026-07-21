import React, { useState } from "react";
import { 
  CheckCircle, 
  ChevronRight, 
  Globe, 
  Users, 
  Target, 
  Clock, 
  Play, 
  ExternalLink, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  Lock, 
  Compass, 
  Check, 
  Star, 
  Bookmark, 
  AlertCircle,
  Eye,
  Settings,
  Mail,
  Smartphone,
  Video,
  Database
} from "lucide-react";

interface ImplementationGuideProps {
  projectName: string;
  projectNiche: string;
  projectPrice: number;
  projectCommission: number;
  projectUrl: string;
  projectPublishedAt: string | Date;
  projectVisits?: number;
  projectConversions?: number;
  onScrollToProjectPanel: () => void;
  onUpgradeClick?: () => void;
}

export const ImplementationGuide: React.FC<ImplementationGuideProps> = ({
  projectName,
  projectNiche,
  projectPrice,
  projectCommission,
  projectUrl,
  projectPublishedAt,
  projectVisits = 487,
  projectConversions = 12,
  onScrollToProjectPanel,
  onUpgradeClick,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]); // Default 1 completed
  const [savedForLater, setSavedForLater] = useState<number[]>([]);

  // Calculate earnings
  const earnings = Math.round(projectPrice * (projectCommission / 100));

  const stepsList = [
    { id: 1, title: "1. Conoce tu proyecto", stage: 1, stageTitle: "ETAPA 1 — Prepara tu sistema" },
    { id: 2, title: "2. Revisa tu página de captación", stage: 1 },
    { id: 3, title: "3. Comprueba la página de gracias", stage: 1 },
    
    { id: 4, title: "4. Elige tu primer reel", stage: 2, stageTitle: "ETAPA 2 — Prepara tu contenido" },
    { id: 5, title: "5. Revisa el guion y el texto", stage: 2 },
    { id: 6, title: "6. Publica tu primer reel", stage: 2 },
    
    { id: 7, title: "7. Instala tu píxel", stage: 3, stageTitle: "ETAPA 3 — Mide y valida" },
    { id: 8, title: "8. Realiza un registro de prueba", stage: 3 },
    
    { id: 9, title: "9. Conoce tu CRM", stage: 4, stageTitle: "ETAPA 4 — Gestiona tus contactos" },
    
    { id: 10, title: "10. Activa Email Marketing", stage: 5, stageTitle: "ETAPA 5 — Automatiza y escala", isPro: true },
    { id: 11, title: "11. Conecta tu dominio", stage: 5, isPro: true },
  ];

  const handleStepClick = (id: number) => {
    setActiveStep(id);
  };

  const handleMarkAsCompleted = (id: number) => {
    if (!completedSteps.includes(id)) {
      setCompletedSteps(prev => [...prev, id]);
    }
    // Automatically transition to next step if not last
    if (id < 11) {
      setActiveStep(id + 1);
    }
  };

  const handleToggleSaveForLater = (id: number) => {
    if (savedForLater.includes(id)) {
      setSavedForLater(prev => prev.filter(x => x !== id));
    } else {
      setSavedForLater(prev => [...prev, id]);
    }
  };

  const percentCompleted = Math.round((completedSteps.length / 11) * 100);

  return (
    <div className="w-full text-gray-200 font-sans min-h-screen bg-[#06070a] border-b border-white/5 pb-16">
      
      {/* Layout Grid */}
      <div className="w-full max-w-[1760px] mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Guía de implementación (Sidebar) */}
          <aside className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.04]">
              <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white tracking-tight uppercase">
                Guía de implementación
              </h3>
            </div>

            {/* Steps Navigation */}
            <div className="space-y-5">
              {/* Etapa 1 */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block select-none">
                  ETAPA 1 — Prepara tu sistema
                </span>
                <div className="space-y-1">
                  {stepsList.filter(s => s.stage === 1).map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      className={`w-full text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between transition-all group ${
                        activeStep === s.id
                          ? "bg-[#18110D] border border-[#FF5A1F]/30 text-[#FF5A1F]"
                          : "border border-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 border transition-all ${
                          activeStep === s.id
                            ? "bg-[#FF5A1F] text-white border-[#FF5A1F]"
                            : completedSteps.includes(s.id)
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-white/[0.03] text-zinc-500 border-white/[0.08] group-hover:border-zinc-500"
                        }`}>
                          {completedSteps.includes(s.id) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            s.id
                          )}
                        </div>
                        <span className="text-[13px] font-semibold truncate leading-none">
                          {s.title.substring(3)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Etapa 2 */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block select-none">
                  ETAPA 2 — Prepara tu contenido
                </span>
                <div className="space-y-1">
                  {stepsList.filter(s => s.stage === 2).map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      className={`w-full text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between transition-all group ${
                        activeStep === s.id
                          ? "bg-[#18110D] border border-[#FF5A1F]/30 text-[#FF5A1F]"
                          : "border border-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 border transition-all ${
                          activeStep === s.id
                            ? "bg-[#FF5A1F] text-white border-[#FF5A1F]"
                            : completedSteps.includes(s.id)
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-white/[0.03] text-zinc-500 border-white/[0.08] group-hover:border-zinc-500"
                        }`}>
                          {completedSteps.includes(s.id) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            s.id
                          )}
                        </div>
                        <span className="text-[13px] font-semibold truncate leading-none">
                          {s.title.substring(3)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Etapa 3 */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block select-none">
                  ETAPA 3 — Mide y valida
                </span>
                <div className="space-y-1">
                  {stepsList.filter(s => s.stage === 3).map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      className={`w-full text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between transition-all group ${
                        activeStep === s.id
                          ? "bg-[#18110D] border border-[#FF5A1F]/30 text-[#FF5A1F]"
                          : "border border-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 border transition-all ${
                          activeStep === s.id
                            ? "bg-[#FF5A1F] text-white border-[#FF5A1F]"
                            : completedSteps.includes(s.id)
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-white/[0.03] text-zinc-500 border-white/[0.08] group-hover:border-zinc-500"
                        }`}>
                          {completedSteps.includes(s.id) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            s.id
                          )}
                        </div>
                        <span className="text-[13px] font-semibold truncate leading-none">
                          {s.title.substring(3)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Etapa 4 */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block select-none">
                  ETAPA 4 — Gestiona tus contactos
                </span>
                <div className="space-y-1">
                  {stepsList.filter(s => s.stage === 4).map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      className={`w-full text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between transition-all group ${
                        activeStep === s.id
                          ? "bg-[#18110D] border border-[#FF5A1F]/30 text-[#FF5A1F]"
                          : "border border-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 border transition-all ${
                          activeStep === s.id
                            ? "bg-[#FF5A1F] text-white border-[#FF5A1F]"
                            : completedSteps.includes(s.id)
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-white/[0.03] text-zinc-500 border-white/[0.08] group-hover:border-zinc-500"
                        }`}>
                          {completedSteps.includes(s.id) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            s.id
                          )}
                        </div>
                        <span className="text-[13px] font-semibold truncate leading-none">
                          {s.title.substring(3)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Etapa 5 */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase block select-none">
                  ETAPA 5 — Automatiza y escala
                </span>
                <div className="space-y-1">
                  {stepsList.filter(s => s.stage === 5).map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      className={`w-full text-left py-2.5 px-3.5 rounded-xl flex items-center justify-between transition-all group ${
                        activeStep === s.id
                          ? "bg-[#18110D] border border-[#FF5A1F]/30 text-[#FF5A1F]"
                          : "border border-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 border transition-all ${
                          activeStep === s.id
                            ? "bg-[#FF5A1F] text-white border-[#FF5A1F]"
                            : completedSteps.includes(s.id)
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-white/[0.03] text-zinc-500 border-white/[0.08] group-hover:border-zinc-500"
                        }`}>
                          {completedSteps.includes(s.id) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            s.id
                          )}
                        </div>
                        <span className="text-[13px] font-semibold truncate leading-none">
                          {s.title.substring(4)}
                        </span>
                      </div>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-500 uppercase tracking-widest shrink-0">
                        PRO
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Project Panel Access box */}
            <div className="bg-[#101217]/50 border border-white/[0.03] p-4 rounded-2xl relative overflow-hidden text-left mt-6">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FF5A1F]/5 blur-xl rounded-full"></div>
              <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/25 flex items-center justify-center text-[#FF5A1F] mb-3">
                <HelpCircle className="w-4 h-4 animate-pulse" />
              </div>
              <h4 className="text-[13px] font-bold text-white mb-0.5">¿Prefieres ir directo al proyecto?</h4>
              <p className="text-zinc-400 font-light text-[11px] leading-relaxed mb-4">
                Puedes volver a esta guía cuando quieras.
              </p>
              <button
                onClick={onScrollToProjectPanel}
                className="w-full h-11 px-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300"
              >
                <span>Ir al panel del proyecto</span>
                <ChevronRight className="w-4 h-4 text-[#FF5A1F]" />
              </button>
            </div>

          </aside>

          {/* COLUMNA DERECHA: Detalle del Paso Activo */}
          <main className="space-y-6">
            
            {/* 1. Header del paso y barra de progreso */}
            <div className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-1 text-left">
                <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider block">
                  Paso {activeStep} de 11 · {stepsList[activeStep - 1]?.title.substring(3)}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stepsList[activeStep - 1]?.title.substring(3)}
                </h2>
              </div>
              
              {/* Progreso */}
              <div className="w-full md:w-60 text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-medium">{completedSteps.length} de 11 pasos completados</span>
                  <span className="text-[#FF5A1F] font-black">{percentCompleted}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-[#FF5A1F] transition-all duration-500" 
                    style={{ width: `${percentCompleted}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Renderizar contenido dinámico según el paso activo */}
            {activeStep === 1 && (
              <div className="space-y-6">
                
                {/* Breve descripción */}
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed text-left font-light bg-[#0b0c11]/20 p-4 border-l-2 border-[#FF5A1F] rounded-r-xl">
                  En este paso entenderás el producto que has seleccionado, cómo ganarás comisiones y cuál es el objetivo del sistema que hemos preparado para ti.
                </p>

                {/* 3 Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#0b0c11]/60 border border-white/[0.04] p-5 rounded-2xl flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 select-none">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Producto seleccionado</h4>
                      <p className="text-xs font-black text-emerald-400">Listo para promocionar</p>
                    </div>
                  </div>
                  <div className="bg-[#0b0c11]/60 border border-white/[0.04] p-5 rounded-2xl flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 select-none">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Comisión configurada</h4>
                      <p className="text-xs font-black text-emerald-400">Tu ganancia definida</p>
                    </div>
                  </div>
                  <div className="bg-[#0b0c11]/60 border border-white/[0.04] p-5 rounded-2xl flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 select-none">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Estrategia creada</h4>
                      <p className="text-xs font-black text-emerald-400">Ruta inicial lista</p>
                    </div>
                  </div>
                </div>

                {/* Video Guía */}
                <div className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    {/* Text info (span 5) */}
                    <div className="md:col-span-5 text-left space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-zinc-500 tracking-widest uppercase block">Video guía</span>
                        <h3 className="text-3xl font-black text-white leading-tight">
                          Conoce <br />
                          <span className="text-[#FF5A1F]">tu proyecto</span>
                        </h3>
                      </div>
                      <p className="text-zinc-400 text-sm font-light leading-relaxed">
                        Mira este video y entiende qué producto elegiste, cuánto puedes ganar por venta y cómo utilizarás este sistema para comenzar.
                      </p>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-xl text-xs text-zinc-300 font-bold">
                        <Clock className="w-4 h-4 text-[#FF5A1F]" />
                        <span>2:06 minutos</span>
                      </div>
                    </div>

                    {/* Thumbnail video (span 7) */}
                    <div className="md:col-span-7 relative group cursor-pointer aspect-video rounded-2xl overflow-hidden border border-white/[0.04] shadow-2xl">
                      {/* Background styled thumbnail representing a warm, professional studio */}
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=350"
                        alt="Video Guía Thumbnail"
                        className="w-full h-full object-cover grayscale-[15%] group-hover:scale-102 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white text-[#FF5A1F] flex items-center justify-center shadow-2xl group-hover:bg-[#FF5A1F] group-hover:text-white transition-all transform group-hover:scale-110 duration-300">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Resumen del proyecto (Dos columnas) */}
                <div className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-6 sm:p-8">
                  <h3 className="text-base font-black text-white uppercase tracking-tight text-left mb-6">
                    Resumen del proyecto
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Left book column (span 4) */}
                    <div className="md:col-span-4 flex flex-col items-center gap-5">
                      {/* Beautiful mockup of the ebook/course */}
                      <div className="w-full max-w-[200px] aspect-[3/4] rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#1b1c23] to-[#0d0e12] border border-white/[0.08] p-5 shadow-2xl flex flex-col justify-between text-left group">
                        {/* Golden spine line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FFBF00] to-orange-600"></div>
                        {/* Subtle decorative circles */}
                        <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#FF5A1F]/10 blur-2xl rounded-full"></div>
                        
                        <div className="space-y-1.5 pl-2">
                          <span className="text-[8px] font-black tracking-widest text-[#FFBF00] uppercase block">Curso Profesional</span>
                          <h4 className="text-base font-black text-white leading-tight uppercase font-serif tracking-tight pt-1">
                            Microblading <br />
                            <span className="text-[#FFBF00]">de Cejas</span>
                          </h4>
                        </div>

                        {/* Hand holding eyebrows sketch or similar illustrative visual */}
                        <div className="my-auto h-20 w-full opacity-60 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-white/[0.03] flex items-center justify-center overflow-hidden">
                          <span className="text-4xl text-[#FFBF00] select-none opacity-40">👁️</span>
                        </div>

                        <div className="pl-2 space-y-1">
                          <div className="h-[2px] w-8 bg-[#FFBF00] rounded"></div>
                          <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest">Aprende.Marketing</span>
                        </div>
                      </div>

                      {/* Button */}
                      <a 
                        href="https://drive.google.com/file/d/1neROWIk7FfUgKqkNbTkEAbChTnbeJljI/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full max-w-[200px] py-3 px-4 bg-[#101217]/50 border border-white/[0.05] hover:border-white/[0.12] rounded-xl text-center text-xs font-bold uppercase tracking-wider text-[#FF5A1F] flex items-center justify-center gap-2 transition-all hover:bg-white/[0.02]"
                      >
                        <span>Ver ficha del producto</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Right details column (span 8) */}
                    <div className="md:col-span-8 w-full border-t border-white/[0.04] md:border-t-0 md:pt-0 pt-6">
                      <div className="divide-y divide-white/[0.04] text-sm">
                        
                        <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                          <span className="text-zinc-400 font-light flex items-center gap-2 select-none">
                            <BookOpen className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span>Proyecto seleccionado:</span>
                          </span>
                          <span className="font-extrabold text-white truncate sm:max-w-xs">{projectName}</span>
                        </div>

                        <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                          <span className="text-zinc-400 font-light flex items-center gap-2 select-none">
                            <Compass className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span>Categoría:</span>
                          </span>
                          <span className="font-extrabold text-[#FF5A1F] uppercase tracking-wider text-xs">{projectNiche}</span>
                        </div>

                        <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                          <span className="text-zinc-400 font-light flex items-center gap-2 select-none">
                            <Star className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span>Precio del producto:</span>
                          </span>
                          <span className="font-black text-white">USD {projectPrice}</span>
                        </div>

                        <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                          <span className="text-zinc-400 font-light flex items-center gap-2 select-none">
                            <CheckCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span>Comisión que obtendrás:</span>
                          </span>
                          <span className="font-black text-white">{projectCommission}%</span>
                        </div>

                        <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                          <span className="text-zinc-400 font-light flex items-center gap-2 select-none">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Tu ganancia por venta:</span>
                          </span>
                          <span className="font-black text-emerald-400 text-lg">USD {earnings}</span>
                        </div>

                        <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                          <span className="text-zinc-400 font-light flex items-center gap-2 select-none">
                            <Target className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span>Objetivo:</span>
                          </span>
                          <span className="font-medium text-white text-xs sm:text-right leading-relaxed sm:max-w-xs">
                            atraer personas interesadas a una clase gratuita
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Avatar recomendado */}
                <div className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      Avatar recomendado
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-zinc-300 font-light">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold select-none">•</span>
                        <span>Mujeres de 22 a 45 años</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold select-none">•</span>
                        <span>Interesadas en belleza, estética y generar ingresos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold select-none">•</span>
                        <span>Buscan aprender una habilidad rentable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold select-none">•</span>
                        <span>Valoran formación práctica y resultados rápidos</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Tipo de público */}
                <div className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#0c62e6]/10 border border-[#0c62e6]/20 flex items-center justify-center text-[#0c62e6] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      Tipo de público
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["Principiante", "Emprendedora", "Autoempleo", "Belleza y estética", "Busca ingresos extra"].map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-3.5 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl text-xs font-semibold text-zinc-300 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Puntos clave del proyecto */}
                <div className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      Puntos clave del proyecto
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-zinc-300 font-light">
                      {[
                        "Producto validado",
                        "Enlace de afiliado preparado",
                        "Comisión alta",
                        "Mercado con alta demanda",
                        "Página y contenido se crearán para este producto"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lo que harás en este paso */}
                <div className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      Lo que harás en este paso
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-zinc-300 font-light">
                      {[
                        "Comprender el producto y su promesa",
                        "Confirmar cuánto ganarás por venta",
                        "Entender a quién va dirigido",
                        "Revisar el recorrido inicial del sistema"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-4.5 h-4.5 text-[#FF5A1F] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Dinámico para otros pasos */}
            {activeStep > 1 && (
              <div className="bg-[#0b0c11]/80 border border-white/[0.04] rounded-3xl p-8 text-center space-y-6">
                
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex items-center justify-center text-zinc-400 mx-auto">
                    <Settings className="w-7 h-7 animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white">Consola del Paso {activeStep}</h3>
                    <p className="text-zinc-400 text-sm font-light leading-relaxed">
                      Este paso estratégico se encuentra totalmente configurado para tu nicho <strong className="text-white font-extrabold uppercase">{projectNiche}</strong>. A continuación puedes ver el estado del recurso y operarlo directamente.
                    </p>
                  </div>
                </div>

                <div className="max-w-3xl mx-auto pt-4 border-t border-white/[0.03]">
                  {activeStep === 2 && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-orange-500 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Página de Captación / Registro</h4>
                            <p className="text-xs text-zinc-400 truncate max-w-sm sm:max-w-md">{projectUrl}</p>
                          </div>
                        </div>
                        <a 
                          href={projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 text-[#FF5A1F] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all"
                        >
                          <span>Ver página</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Página de Agradecimiento / Entrega</h4>
                            <p className="text-xs text-zinc-400 truncate max-w-sm sm:max-w-md">{projectUrl}/gracias</p>
                          </div>
                        </div>
                        <a 
                          href={`${projectUrl}/gracias`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all"
                        >
                          <span>Ver página</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Video className="w-5 h-5 text-rose-500 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Reels y Videos para Tráfico</h4>
                            <p className="text-xs text-zinc-400">3 ganchos y guiones de video generados con Inteligencia Artificial.</p>
                          </div>
                        </div>
                        <button 
                          onClick={onScrollToProjectPanel}
                          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          Gestionar Videos
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep === 5 && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Guión Persuasivo de Ventas</h4>
                            <p className="text-xs text-zinc-400">Estructura del guion técnico validada por expertos en copywriting.</p>
                          </div>
                        </div>
                        <button 
                          onClick={onScrollToProjectPanel}
                          className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          Ver Guiones
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep === 6 && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Checklist de Publicación</h4>
                            <p className="text-xs text-zinc-400">Sube el video a Instagram / TikTok usando los hashtags de alta conversión.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleMarkAsCompleted(6)}
                          className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          Marcar Publicado
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep === 7 && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Configuración del Pixel</span>
                      <div className="p-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl space-y-4">
                        <p className="text-xs text-zinc-400">Inserta tu ID de Pixel de Meta o Google Analytics para medir visitas e inscripciones automáticamente.</p>
                        <div className="flex gap-3">
                          <input 
                            type="text" 
                            placeholder="Ej. 182736451928" 
                            className="flex-1 bg-[#101217] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF5A1F]"
                          />
                          <button 
                            onClick={() => alert("Píxel guardado con éxito. Se ha integrado en tus landing pages.")}
                            className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 8 && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Flujo de pruebas</span>
                      <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-3">
                        <p className="text-xs text-zinc-400">Ingresa a tu página de captura, pon un correo de prueba y verifica que te redirige a la página de gracias.</p>
                        <a 
                          href={projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] uppercase tracking-wider hover:underline"
                        >
                          <span>Iniciar prueba de registro</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeStep === 9 && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Base de datos</span>
                      <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-teal-400 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Gestor de Contactos CRM</h4>
                            <p className="text-xs text-zinc-400">Visualiza las métricas y exporta los leads capturados en tiempo real.</p>
                          </div>
                        </div>
                        <button 
                          onClick={onScrollToProjectPanel}
                          className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          Ver Leads
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep >= 10 && (
                    <div className="p-6 bg-[#FFBF00]/5 border border-[#FFBF00]/20 rounded-2xl space-y-4 text-left max-w-xl mx-auto">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-[#FFBF00] shrink-0" />
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">Acceso bloqueado (Función PRO)</h4>
                      </div>
                      <p className="text-xs text-zinc-300 font-light leading-relaxed">
                        Las etapas de automatización de correo electrónico avanzado y conexión de dominios propios de marca están reservadas para usuarios PRO.
                      </p>
                      <button 
                        onClick={onUpgradeClick}
                        className="px-5 py-2.5 bg-[#FFBF00] hover:bg-[#E5AC00] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        Desbloquear con PRO
                      </button>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* Botonera de acciones inferior */}
            <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleMarkAsCompleted(activeStep)}
                  className="px-6 py-3.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/15 flex items-center gap-2 group cursor-pointer"
                >
                  <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>Marcar paso como completado y continuar</span>
                  <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => handleToggleSaveForLater(activeStep)}
                  className={`px-5 py-3.5 border rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    savedForLater.includes(activeStep)
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                      : "bg-transparent border-white/10 hover:border-white/20 text-zinc-300"
                  }`}
                >
                  <Bookmark className="w-4 h-4 shrink-0" />
                  <span>{savedForLater.includes(activeStep) ? "Guardado" : "Guardar para después"}</span>
                </button>
              </div>

              {activeStep < 11 && (
                <div className="flex items-center gap-3 text-left">
                  <div className="space-y-0.5 text-right hidden sm:block">
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block">Siguiente paso:</span>
                    <span className="text-xs text-white font-bold block truncate max-w-xs">{stepsList[activeStep]?.title.substring(3)}</span>
                  </div>
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.1] rounded-xl text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Continuar</span>
                    <ChevronRight className="w-4 h-4 text-[#FF5A1F]" />
                  </button>
                </div>
              )}

            </div>

          </main>

        </div>
      </div>

    </div>
  );
};
