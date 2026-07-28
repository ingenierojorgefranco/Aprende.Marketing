import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../services/api";
import { ProjectStrategy_Sidebar } from "../tools/ProjectStrategy/ProjectStrategy_Sidebar";
import { ProjectStrategy_Hotlinks } from "../tools/ProjectStrategy/ProjectStrategy_Hotlinks";
import { ProjectStrategy_BusinessGrowth } from "../tools/ProjectStrategy/ProjectStrategy_BusinessGrowth";
import { ProjectStrategy_Blueprint } from "../tools/ProjectStrategy/ProjectStrategy_Blueprint";
import { ProjectStrategy_AvatarDiagnosis } from "../tools/ProjectStrategy/ProjectStrategy_AvatarDiagnosis";
import { ProjectStrategy_Psychology } from "../tools/ProjectStrategy/ProjectStrategy_Psychology";
import { ProjectStrategy_Testimonials } from "../tools/ProjectStrategy/ProjectStrategy_Testimonials";
import { ProjectStrategy_WebSystem } from "../tools/ProjectStrategy/ProjectStrategy_WebSystem";
import { ProjectStrategy_Hooks } from "../tools/ProjectStrategy/ProjectStrategy_Hooks";
import { ProjectStrategy_Content } from "../tools/ProjectStrategy/ProjectStrategy_Content";
import { ProjectStrategy_Email } from "../tools/ProjectStrategy/ProjectStrategy_Email";
import { ProjectStrategy_Evergreen } from "../tools/ProjectStrategy/ProjectStrategy_Evergreen";
import { ProjectStrategy_WhatsApp } from "../tools/ProjectStrategy/ProjectStrategy_WhatsApp";
import { StepHeaderCard } from "./StepHeaderCard";
import { StepVideoContainer } from "./StepVideoContainer";
import { 
  CheckCircle, 
  ChevronRight, 
  ChevronDown,
  Globe, 
  Users, 
  UserCheck,
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
  Database,
  Home,
  MinusCircle,
  Rocket,
  MessageCircle,
  X,
  TrendingUp,
  Film,
  PlayCircle,
  ShoppingCart,
  ArrowUpRight,
  ArrowRight,
  AlertTriangle,
  Tag,
  DollarSign,
  Percent,
  Map
} from "lucide-react";

interface ImplementationGuideProps {
  projectId?: string;
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
  onBack?: () => void;
  activeStrategySection?: string;
  onStrategySectionChange?: (sectionId: string) => void;
}

const formatValue = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return "0";
    
    if (Number.isInteger(num)) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    const parts = num.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${parts[0]},${parts[1]}`;
};

export const ImplementationGuide: React.FC<ImplementationGuideProps> = ({
  projectId,
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
  onBack,
  activeStrategySection,
  onStrategySectionChange,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState<number>(1);
  const currentStrategySection = activeStrategySection || searchParams.get('section') || "summary";
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]); // Default 1 completed
  const [savedForLater, setSavedForLater] = useState<number[]>([]);
  const [strategyData, setStrategyData] = useState<any>(null);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [isAnalysisDrawerOpen, setIsAnalysisDrawerOpen] = useState<boolean>(false);
  const [isProjectionDrawerOpen, setIsProjectionDrawerOpen] = useState<boolean>(false);
  const [openGuideStages, setOpenGuideStages] = useState<number[]>([1]);

  useEffect(() => {
    const activeStageNum = stepsList.find(s => s.id === activeStep)?.stage || 1;
    setOpenGuideStages([activeStageNum]);
  }, [activeStep]);

  const toggleGuideStage = (stageNum: number) => {
    if (openGuideStages.includes(stageNum)) {
      setOpenGuideStages(openGuideStages.filter(s => s !== stageNum));
    } else {
      setOpenGuideStages([stageNum]);
    }
  };

  useEffect(() => {
    const pid = projectId || searchParams.get('id');
    if (pid) {
      api.getProjectStrategy(pid).then((data: any) => {
        if (data) setStrategyData(data);
      }).catch((err: any) => console.error("Error loading strategy in ImplementationGuide", err));

      api.getProjectById(pid).then((proj: any) => {
        if (proj && proj.description) {
          setProjectDescription(proj.description);
        }
      }).catch((err: any) => console.error("Error loading project in ImplementationGuide", err));
    }
  }, [projectId, searchParams]);

  const fullAnalysisText = projectDescription || 
    strategyData?.meta?.shortDescription || 
    strategyData?.meta?.insights?.niche?.description || 
    strategyData?.meta?.insights?.product?.description || 
    strategyData?.meta?.summary?.productDescription || 
    "Curso profesional de técnica de cejas pelo a pelo para principiantes y esteticistas.";

  const cleanAnalysisText = fullAnalysisText.replace(/<[^>]*>/g, '').trim();
  const analysisTextIsHtml = /<[a-z][\s\S]*>/i.test(fullAnalysisText);

  const stepToSectionMap: Record<number, string> = {
    1: 'summary',
    2: 'hotlinks',
    3: 'growth',
    4: 'blueprint',
    5: 'avatar',
    6: 'psychology',
    7: 'testimonials',
    8: 'web',
    9: 'hooks',
    10: 'content',
    11: 'email',
    12: 'evergreen',
    13: 'whatsapp'
  };

  const sectionToStepMap: Record<string, number> = {
    summary: 1,
    hotlinks: 2,
    growth: 3,
    blueprint: 4,
    avatar: 5,
    psychology: 6,
    testimonials: 7,
    web: 8,
    hooks: 9,
    content: 10,
    email: 11,
    evergreen: 12,
    whatsapp: 13
  };

  useEffect(() => {
    const step = sectionToStepMap[currentStrategySection] || 1;
    setActiveStep(step);
  }, [currentStrategySection]);

  const handleStrategySectionClick = (sectionId: string) => {
    setSearchParams({ section: sectionId });
    if (onStrategySectionChange) {
      onStrategySectionChange(sectionId);
    }
    const step = sectionToStepMap[sectionId] || 1;
    setActiveStep(step);
    const el = document.getElementById('project-strategy-index');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate earnings
  const earnings = Math.round(projectPrice * (projectCommission / 100));

  const stepsList = [
    { id: 1, title: "1. Tu Proyecto Digital", stage: 1, stageTitle: "ETAPA 1 — Activa tu sistema" },
    { id: 2, title: "2. Tus Enlaces de Afiliado", stage: 1 },
    { id: 3, title: "3. Proyección de tus Ganancias", stage: 1 },
    { id: 4, title: "4. Tu Mapa de Ruta (Blueprint)", stage: 1 },
    
    { id: 5, title: "5. Conoce a tu Comprador Ideal", stage: 2, stageTitle: "ETAPA 2 — Tu mercado y cliente" },
    { id: 6, title: "6. Entiende su Mentalidad", stage: 2 },
    { id: 7, title: "7. Los Testimonios de tu Producto", stage: 2 },
    
    { id: 8, title: "8. Tu Página Web de Captura", stage: 3, stageTitle: "ETAPA 3 — Tu sistema de ventas" },
    { id: 9, title: "9. Tus Ganchos de Venta (Hooks)", stage: 3 },
    { id: 10, title: "10. Tu Estrategia de Contenidos", stage: 3 },
    { id: 11, title: "11. Emails: Secuencia de Venta", stage: 3 },
    { id: 12, title: "12. Emails: Secuencia de Confianza", stage: 3 },
    { id: 13, title: "13. Scripts de WhatsApp (Cierre)", stage: 3 },
  ];

  const handleStepClick = (id: number) => {
    setActiveStep(id);
    const sectionId = stepToSectionMap[id];
    if (sectionId) {
      setSearchParams({ section: sectionId });
      if (onStrategySectionChange) {
        onStrategySectionChange(sectionId);
      }
    }
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
    <div className="w-full text-slate-200 font-sans min-h-screen bg-[#060913] border-b border-slate-800/60 pb-16 -mt-2 sm:-mt-4 -mx-1 sm:-mx-3">
      
      {/* Layout Grid */}
      <div className="w-full max-w-[1760px] mx-auto px-2 sm:px-3 md:px-4 pt-1 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)] 2xl:grid-cols-[350px_minmax(0,1fr)] gap-4 lg:gap-5 xl:gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: Menús Laterales (Índice Estratégico + Guía de implementación) */}
          <aside className="space-y-4 lg:sticky lg:top-3 max-h-[calc(100vh-20px)] overflow-y-auto custom-scrollbar pr-1.5">
            
            {/* 1. Menú Índice Estratégico (Imagen 1) */}
            <ProjectStrategy_Sidebar 
              activeSection={currentStrategySection}
              onSectionChange={handleStrategySectionClick}
            />

            {/* 2. Menú Guía de Implementación (Imagen 2) */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden space-y-5 shadow-2xl">
              
              {/* Header del Sidebar */}
              <div className="p-5 border-b border-slate-800 bg-[#0d1322] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight uppercase leading-tight">
                    Guía de implementación
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Paso a paso de tu proyecto</span>
                </div>
              </div>

            {/* Steps Navigation */}
            <div className="p-4 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
              {/* Etapa 1 */}
              <div className="space-y-2.5">
                <button 
                  onClick={() => toggleGuideStage(1)}
                  className="w-full px-4.5 py-3.5 bg-gradient-to-r from-slate-900/90 via-[#0e172a] to-slate-900/90 border border-slate-700/80 rounded-xl shadow-md flex items-center justify-between cursor-pointer group transition-all"
                >
                  <span className="text-xs sm:text-[13px] font-bold text-slate-200 group-hover:text-white tracking-wider uppercase flex items-center gap-2 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shrink-0 shadow-[0_0_8px_#FF5A1F]"></span>
                    ETAPA 1 — Activa tu sistema
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${openGuideStages.includes(1) ? 'rotate-180 text-[#FF5A1F]' : ''}`} />
                </button>
                {openGuideStages.includes(1) && (
                  <div className="space-y-2 py-1 pl-1 animate-in fade-in duration-200">
                    {stepsList.filter(s => s.stage === 1).map(s => {
                      const isActive = activeStep === s.id;
                      const isDone = completedSteps.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleStepClick(s.id)}
                          className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border text-left ${
                            isActive
                              ? 'bg-gradient-to-r from-[#FF5A1F]/85 via-[#FF5A1F]/30 to-transparent border-[#FF5A1F]/50 text-white font-medium shadow-lg shadow-[#FF5A1F]/20 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1.5 before:bg-[#FF5A1F] before:rounded-r-full before:shadow-[0_0_8px_#FF5A1F]'
                              : 'border-transparent text-[#CBD5E1] hover:bg-gradient-to-r hover:from-[#FF5A1F]/35 hover:via-[#FF5A1F]/10 hover:to-transparent hover:border-[#FF5A1F]/30 hover:text-white font-normal hover:before:absolute hover:before:left-0 hover:before:top-2 hover:before:bottom-2 hover:before:w-1 hover:before:bg-[#FF5A1F]/70 hover:before:rounded-r-full'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                            <div className={`w-5.5 h-5.5 rounded-full text-[11px] font-semibold flex items-center justify-center shrink-0 transition-all ${
                              isActive
                                ? "bg-white text-[#FF5A1F] shadow-sm font-extrabold"
                                : isDone
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800/90 text-slate-400 border border-slate-700/50"
                            }`}>
                              {isDone ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                s.id
                              )}
                            </div>
                            <span className={`text-sm sm:text-[14px] leading-snug truncate ${isActive ? "text-white font-medium" : "text-slate-200 font-normal"}`}>
                              {s.title.replace(/^\d+\.\s*/, '')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Etapa 2 */}
              <div className="space-y-2.5">
                <button 
                  onClick={() => toggleGuideStage(2)}
                  className="w-full px-4.5 py-3.5 bg-gradient-to-r from-slate-900/90 via-[#0e172a] to-slate-900/90 border border-slate-700/80 rounded-xl shadow-md flex items-center justify-between cursor-pointer group transition-all"
                >
                  <span className="text-xs sm:text-[13px] font-bold text-slate-200 group-hover:text-white tracking-wider uppercase flex items-center gap-2 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shrink-0 shadow-[0_0_8px_#FF5A1F]"></span>
                    ETAPA 2 — Tu mercado y cliente
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${openGuideStages.includes(2) ? 'rotate-180 text-[#FF5A1F]' : ''}`} />
                </button>
                {openGuideStages.includes(2) && (
                  <div className="space-y-2 py-1 pl-1 animate-in fade-in duration-200">
                    {stepsList.filter(s => s.stage === 2).map(s => {
                      const isActive = activeStep === s.id;
                      const isDone = completedSteps.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleStepClick(s.id)}
                          className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border text-left ${
                            isActive
                              ? 'bg-gradient-to-r from-[#FF5A1F]/85 via-[#FF5A1F]/30 to-transparent border-[#FF5A1F]/50 text-white font-medium shadow-lg shadow-[#FF5A1F]/20 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1.5 before:bg-[#FF5A1F] before:rounded-r-full before:shadow-[0_0_8px_#FF5A1F]'
                              : 'border-transparent text-[#CBD5E1] hover:bg-gradient-to-r hover:from-[#FF5A1F]/35 hover:via-[#FF5A1F]/10 hover:to-transparent hover:border-[#FF5A1F]/30 hover:text-white font-normal hover:before:absolute hover:before:left-0 hover:before:top-2 hover:before:bottom-2 hover:before:w-1 hover:before:bg-[#FF5A1F]/70 hover:before:rounded-r-full'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                            <div className={`w-5.5 h-5.5 rounded-full text-[11px] font-semibold flex items-center justify-center shrink-0 transition-all ${
                              isActive
                                ? "bg-white text-[#FF5A1F] shadow-sm font-extrabold"
                                : isDone
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800/90 text-slate-400 border border-slate-700/50"
                            }`}>
                              {isDone ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                s.id
                              )}
                            </div>
                            <span className={`text-sm sm:text-[14px] leading-snug truncate ${isActive ? "text-white font-medium" : "text-slate-200 font-normal"}`}>
                              {s.title.replace(/^\d+\.\s*/, '')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Etapa 3 */}
              <div className="space-y-2.5">
                <button 
                  onClick={() => toggleGuideStage(3)}
                  className="w-full px-4.5 py-3.5 bg-gradient-to-r from-slate-900/90 via-[#0e172a] to-slate-900/90 border border-slate-700/80 rounded-xl shadow-md flex items-center justify-between cursor-pointer group transition-all"
                >
                  <span className="text-xs sm:text-[13px] font-bold text-slate-200 group-hover:text-white tracking-wider uppercase flex items-center gap-2 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shrink-0 shadow-[0_0_8px_#FF5A1F]"></span>
                    ETAPA 3 — Tu sistema de ventas
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${openGuideStages.includes(3) ? 'rotate-180 text-[#FF5A1F]' : ''}`} />
                </button>
                {openGuideStages.includes(3) && (
                  <div className="space-y-2 py-1 pl-1 animate-in fade-in duration-200">
                    {stepsList.filter(s => s.stage === 3).map(s => {
                      const isActive = activeStep === s.id;
                      const isDone = completedSteps.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleStepClick(s.id)}
                          className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border text-left ${
                            isActive
                              ? 'bg-gradient-to-r from-[#FF5A1F]/85 via-[#FF5A1F]/30 to-transparent border-[#FF5A1F]/50 text-white font-medium shadow-lg shadow-[#FF5A1F]/20 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1.5 before:bg-[#FF5A1F] before:rounded-r-full before:shadow-[0_0_8px_#FF5A1F]'
                              : 'border-transparent text-[#CBD5E1] hover:bg-gradient-to-r hover:from-[#FF5A1F]/35 hover:via-[#FF5A1F]/10 hover:to-transparent hover:border-[#FF5A1F]/30 hover:text-white font-normal hover:before:absolute hover:before:left-0 hover:before:top-2 hover:before:bottom-2 hover:before:w-1 hover:before:bg-[#FF5A1F]/70 hover:before:rounded-r-full'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                            <div className={`w-5.5 h-5.5 rounded-full text-[11px] font-semibold flex items-center justify-center shrink-0 transition-all ${
                              isActive
                                ? "bg-white text-[#FF5A1F] shadow-sm font-extrabold"
                                : isDone
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800/90 text-slate-400 border border-slate-700/50"
                            }`}>
                              {isDone ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                s.id
                              )}
                            </div>
                            <span className={`text-sm sm:text-[14px] leading-snug truncate ${isActive ? "text-white font-medium" : "text-slate-200 font-normal"}`}>
                              {s.title.replace(/^\d+\.\s*/, '')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Direct Project Panel Access box */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-2xl relative overflow-hidden text-left mt-6">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FF5A1F]/10 blur-xl rounded-full"></div>
                <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] mb-3">
                  <HelpCircle className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">¿Prefieres ir directo al proyecto?</h4>
                <p className="text-slate-400 font-normal text-xs leading-relaxed mb-4">
                  Puedes volver a esta guía cuando quieras.
                </p>
                <button
                  onClick={onScrollToProjectPanel}
                  className="w-full h-11 px-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md"
                >
                  <span>Ir al panel del proyecto</span>
                  <ChevronRight className="w-4 h-4 text-[#FF5A1F]" />
                </button>
              </div>

            </div>

          </div>

        </aside>

          {/* COLUMNA DERECHA: Detalle del Paso Activo */}
          <main className="space-y-6">
            
            {/* Breadcrumb Navigation Bar */}
            <div className="pb-3 pt-1 px-1 border-b border-slate-800/80 flex items-center justify-between gap-4">
              <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 flex-wrap min-w-0">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 shrink-0"
                  title="Principal"
                >
                  <Home className="w-4 h-4 text-slate-400 hover:text-white" />
                  <span>Principal</span>
                </button>

                <span className="text-slate-600 select-none">/</span>

                <button 
                  onClick={() => onBack ? onBack() : navigate('/dashboard/projects')}
                  className="hover:text-white text-slate-300 transition-colors shrink-0"
                >
                  Mis proyectos
                </button>

                <span className="text-slate-600 select-none">/</span>

                <span className="text-[#FF5A1F] font-semibold tracking-wide truncate max-w-[220px] sm:max-w-xs md:max-w-md">
                  {projectName || "Proyecto"}
                </span>
              </nav>
            </div>
            
            {/* 1. Header del paso (Solo para pasos diferentes a los Pasos 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 y 13, ya que tienen su propio header) */}
            {activeStep !== 2 && activeStep !== 3 && activeStep !== 4 && activeStep !== 5 && activeStep !== 6 && activeStep !== 7 && activeStep !== 8 && activeStep !== 9 && activeStep !== 10 && activeStep !== 11 && activeStep !== 12 && activeStep !== 13 && (
              <StepHeaderCard 
                stepNumber={activeStep}
                totalSteps={13}
                title={stepsList[activeStep - 1]?.title.replace(/^\d+\.\s*/, '') || "Tu Proyecto Digital"}
                description="En este paso entenderás el producto que has seleccionado, cómo ganarás comisiones y cuál es el objetivo del sistema que hemos preparado para ti."
                completedSteps={1}
              />
            )}

            {/* Renderizar contenido dinámico según el paso activo */}
            {activeStep === 1 && (
              <div className="space-y-6">

                {/* Video Guía (Aparece arriba del todo en el Paso 1) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                  <StepVideoContainer 
                    posterImage="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=675"
                    videoUrl="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0"
                    title="Video Guía - Tu Proyecto Digital"
                  />
                </div>

                {/* Bloque con el nombre del proyecto (Fondo gris oscuro, sin bordes claros) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3 text-left shadow-xl">
                  <div>
                    <span className="inline-flex bg-[#102A1E] text-[#10B981] border border-[#10B981]/20 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider items-center gap-2 shrink-0 shadow-sm mb-3">
                      <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
                      TU PÁGINA ESTÁ PUBLICADA Y TUS TRES REELS ESTÁN LISTOS PARA COMENZAR A ATRAER VISITAS.
                    </span>
                    <h1 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight">
                      {projectName || strategyData?.meta?.projectName || strategyData?.meta?.insights?.overview?.items?.[0]?.value || "Masterclass Microblading Pro"}
                    </h1>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm md:text-base font-semibold tracking-wide">
                    Digital · Producto activo · Publicado el 22 de junio de 2026
                  </p>
                </div>

                {/* 3 Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Card 1: Precio público del producto */}
                  <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl flex items-center gap-4 text-left shadow-lg hover:border-emerald-500/30 transition-all">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 select-none shadow-sm shadow-emerald-500/10">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider leading-none">PRECIO PÚBLICO DEL PRODUCTO</h4>
                      <p className="text-base sm:text-xl font-black text-white">
                        USD {projectPrice || strategyData?.meta?.price || 200}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Tu ganancia por venta */}
                  <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl flex items-center gap-4 text-left shadow-lg hover:border-amber-500/30 transition-all">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 select-none shadow-sm shadow-amber-500/10">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-[11px] sm:text-xs font-bold text-amber-500 uppercase tracking-wider leading-none">TU GANANCIA POR VENTA</h4>
                      <p className="text-base sm:text-xl font-black text-white">
                        USD {earnings || Math.round((projectPrice || 200) * ((projectCommission || 80) / 100)) || 130}
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Tu % de comisión */}
                  <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl flex items-center gap-4 text-left shadow-lg hover:border-sky-500/30 transition-all">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 select-none shadow-sm shadow-sky-500/10">
                      <Percent className="w-5 h-5 text-sky-400" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-[11px] sm:text-xs font-bold text-sky-400 uppercase tracking-wider leading-none">TU % DE COMISIÓN</h4>
                      <p className="text-base sm:text-xl font-black text-white">
                        {projectCommission || (strategyData?.meta?.commissionRate ? Math.round(strategyData.meta.commissionRate * (strategyData.meta.commissionRate <= 1 ? 100 : 1)) : 80)}%
                      </p>
                    </div>
                  </div>

                </div>

                {/* Resumen del proyecto */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight text-left mb-6">
                    Resumen del proyecto
                  </h3>
                  
                  <div className="w-full">
                    <div className="divide-y divide-slate-800 text-sm sm:text-base">
                      
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-2 select-none">
                          <BookOpen className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Producto que vas a vender:</span>
                        </span>
                        <span className="font-extrabold text-white truncate sm:max-w-md">
                          {projectName || strategyData?.meta?.projectName || strategyData?.meta?.insights?.overview?.items?.[0]?.value || "Curso de Microblading Profesional"}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-2 select-none">
                          <Compass className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Sector:</span>
                        </span>
                        <span className="font-extrabold text-[#FF5A1F] uppercase tracking-wider text-xs sm:text-sm">
                          {projectNiche || strategyData?.meta?.niche || strategyData?.meta?.insights?.overview?.items?.[1]?.value || "Belleza y Estética"}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-2 select-none">
                          <Target className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Objetivo principal:</span>
                        </span>
                        <span className="font-semibold text-white text-sm sm:text-right leading-relaxed sm:max-w-md">
                          {strategyData?.meta?.summary?.primaryObjective || strategyData?.meta?.insights?.overview?.items?.[4]?.value || "Generar leads cualificados y convertirlos en ventas"}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-2 select-none">
                          <Users className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Para quién es:</span>
                        </span>
                        <span className="font-semibold text-white text-sm sm:text-right leading-relaxed sm:max-w-md">
                          {strategyData?.meta?.summary?.targetAudienceSummary || "Mujeres que quieren aprender microblading y generar ingresos"}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-2 select-none">
                          <Clock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Edades de tu público objetivo:</span>
                        </span>
                        <span className="font-semibold text-white text-sm sm:text-right leading-relaxed sm:max-w-md">
                          {strategyData?.meta?.summary?.targetAgeRange || "Mujeres de 22 a 45 años"}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-2 select-none">
                          <Star className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Precio del producto:</span>
                        </span>
                        <span className="font-black text-white">
                          USD {projectPrice || strategyData?.meta?.price || 147}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-2 select-none">
                          <CheckCircle className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Comisión que obtendrás:</span>
                        </span>
                        <span className="font-black text-white">
                          {projectCommission || (strategyData?.meta?.commissionRate ? Math.round(strategyData.meta.commissionRate * (strategyData.meta.commissionRate <= 1 ? 100 : 1)) : 80)}%
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-2 select-none">
                          <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                          <span>Tu ganancia por venta:</span>
                        </span>
                        <span className="font-black text-emerald-400 text-xl">
                          USD {earnings || Math.round((projectPrice || 147) * ((projectCommission || 80) / 100)) || 116}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Análisis del Producto Digital (Resumen con Ver Completo) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                        Análisis del Producto Digital que vas a promocionar <span className="text-slate-400 font-normal text-sm sm:text-base">(En base a tu página de ventas)</span>
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsAnalysisDrawerOpen(true)}
                      className="text-xs font-extrabold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500 hover:text-white px-4 py-2.5 rounded-xl border border-indigo-500/30 transition-all uppercase tracking-wider self-start sm:self-auto cursor-pointer shrink-0 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver completo</span>
                    </button>
                  </div>

                  <div className="relative border-l-4 border-indigo-500/80 pl-4 py-2.5 bg-indigo-500/5 rounded-r-xl">
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light line-clamp-4">
                      {cleanAnalysisText && cleanAnalysisText.length > 60 
                        ? cleanAnalysisText 
                        : "Curso profesional de técnica de cejas pelo a pelo para principiantes y esteticistas. Este programa de formación intensiva está diseñado paso a paso para dominar el diseño, la simetría y la pigmentación en el microblading, permitiendo crear un negocio propio altamente rentable en el sector de la estética con una demanda en constante crecimiento."}
                    </p>
                  </div>
                </div>

                {/* Grid de 2 columnas: Avatar recomendado y Tipo de público */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch text-left">
                  
                  {/* Avatar recomendado */}
                  <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-start space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-extrabold text-white tracking-wide">
                        Avatar recomendado
                      </h3>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-normal">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                        <span>Mujeres de 22 a 45 años</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                        <span>Interesadas en belleza, estética y generar ingresos</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                        <span>Buscan aprender una habilidad rentable</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                        <span>Valoran formación práctica y resultados rápidos</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tipo de público */}
                  <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-start space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-extrabold text-white tracking-wide">
                        Tipo de público
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Principiante", "Emprendedora", "Autoempleo", "Belleza y estética", "Busca ingresos extra"].map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:border-slate-700 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Puntos clave del proyecto (Reemplaza a "Lo que harás en este paso" - Imagen 7) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-left space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                      <Star className="w-6 h-6 text-orange-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                      PUNTOS CLAVE DEL PROYECTO
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-base text-slate-200 font-normal">
                    {[
                      "Producto validado",
                      "Enlace de afiliado preparado",
                      "Comisión alta",
                      "Mercado con alta demanda",
                      "Página y contenido se crearán para este producto"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-slate-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recorrido básico de tu sistema (Botones grandes y flujo visual mejorado) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-left space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-md shadow-indigo-500/20">
                        <Compass className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                          Recorrido básico de tu sistema
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400">
                          El flujo continuo que atrae prospectos y los convierte en clientes finales.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid de 5 botones/tarjetas grandes del recorrido */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
                    
                    {/* Paso 1: Reels / Contenido */}
                    <div className="bg-[#070D19] border border-slate-800 hover:border-fuchsia-500/50 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 hover:shadow-2xl hover:shadow-fuchsia-500/10 hover:scale-[1.03] transition-all duration-300 group cursor-default">
                      <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-[10px] font-black uppercase tracking-wider">
                        PASO 1
                      </span>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center shadow-xl shadow-fuchsia-500/10 group-hover:scale-110 transition-transform duration-300">
                        <Film className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-fuchsia-400 transition-colors">
                          Reels / Contenido
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          Atraemos atención
                        </p>
                      </div>
                    </div>

                    {/* Paso 2: Página de captación */}
                    <div className="bg-[#070D19] border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 hover:shadow-2xl hover:shadow-sky-500/10 hover:scale-[1.03] transition-all duration-300 group cursor-default">
                      <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-black uppercase tracking-wider">
                        PASO 2
                      </span>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-xl shadow-sky-500/10 group-hover:scale-110 transition-transform duration-300">
                        <Globe className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-sky-400 transition-colors">
                          Página de captación
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          Capturamos el interés
                        </p>
                      </div>
                    </div>

                    {/* Paso 3: Registro del usuario */}
                    <div className="bg-[#070D19] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-[1.03] transition-all duration-300 group cursor-default">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        PASO 3
                      </span>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                          Registro del usuario
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          Generamos confianza
                        </p>
                      </div>
                    </div>

                    {/* Paso 4: Clase u oferta principal */}
                    <div className="bg-[#070D19] border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-[1.03] transition-all duration-300 group cursor-default">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-wider">
                        PASO 4
                      </span>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-xl shadow-purple-500/10 group-hover:scale-110 transition-transform duration-300">
                        <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-purple-400 transition-colors">
                          Clase u oferta principal
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          Presentamos la solución
                        </p>
                      </div>
                    </div>

                    {/* Paso 5: Venta y comisión */}
                    <div className="bg-[#070D19] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-[1.03] transition-all duration-300 group cursor-default">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                        PASO 5
                      </span>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/10 group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                          Venta y comisión
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          Obtienes tu ganancia
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Proyección de ingresos basada en tu comisión (Linkeable: Abre ventana lateral desde la derecha) */}
                <div 
                  onClick={() => setIsProjectionDrawerOpen(true)}
                  className="bg-[#0B1120] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl text-left cursor-pointer group transition-all duration-300 relative hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  {/* Banner CTA superior para indicación de click */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Target className="w-3.5 h-3.5" /> Generación de Leads
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">• Clic para desplegar detalle completo</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProjectionDrawerOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-emerald-400 transition-all shadow-lg hover:scale-105 shrink-0 self-start sm:self-auto"
                    >
                      <span>Ver proyección completa y gráfica</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Columna Izquierda: Parámetros */}
                    <div className="lg:col-span-5 space-y-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                          Proyección de ingresos basada en tu comisión
                        </h3>
                      </div>

                      <div className="space-y-3 bg-[#070D19] border border-slate-800 p-5 rounded-2xl text-sm text-slate-300">
                        <div className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Ganancia neta por venta: <strong className="text-white">${formatValue(earnings || Math.round((projectPrice || 147) * ((projectCommission || 80) / 100)) || 130)} USD</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Tasa de cierre objetivo: <strong className="text-white">5% en WhatsApp</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Porcentaje de comisión: <strong className="text-white">{formatValue(projectCommission || 80)}%</strong></span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#070D19] border border-emerald-500/30 rounded-xl p-4 text-center">
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Ganancia / Venta</p>
                          <p className="text-emerald-400 font-extrabold text-2xl sm:text-3xl">${formatValue(earnings || Math.round((projectPrice || 147) * ((projectCommission || 80) / 100)) || 130)}</p>
                        </div>
                        <div className="bg-[#070D19] border border-slate-800 rounded-xl p-4 text-center">
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Cierre WA</p>
                          <p className="text-white font-extrabold text-2xl sm:text-3xl">5%</p>
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha: Escala de Leads */}
                    <div className="lg:col-span-7 bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4 text-emerald-400" /> 
                          Escala de ingresos según volumen de Leads
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                          Ver gráfico <ArrowRight className="w-3 h-3" />
                        </span>
                      </h4>
                      
                      <div className="space-y-2.5">
                        {[50, 100, 200, 500, 1000].map((leads, i) => {
                          const commVal = earnings || Math.round((projectPrice || 147) * ((projectCommission || 80) / 100)) || 130;
                          const sales = Math.floor(leads * 0.05);
                          const incomeValue = sales * commVal;
                          return (
                            <div key={i} className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#0B1120] border border-slate-800 group-hover:border-slate-700 transition-all">
                              <div className="text-left">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Atrayendo</p>
                                <p className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-sky-400" /> {formatValue(leads)} Leads
                                </p>
                              </div>
                              <div className="flex flex-col items-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{formatValue(sales)} {sales === 1 ? 'venta' : 'ventas'}</p>
                                <ArrowRight className="w-4 h-4 text-slate-500" />
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ganancia aprox.</p>
                                <p className="text-emerald-400 font-extrabold text-lg sm:text-xl">${formatValue(incomeValue)} USD</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-3 p-3.5 bg-[#0B1120] border-l-4 border-amber-500/50 rounded-r-xl text-left text-xs sm:text-sm text-slate-300">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p>Proyecciones basadas en un cierre conservador del 5%. Muestran el potencial de escala de tu activo digital.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* Paso 2: Configura tus enlaces de afiliado */}
            {activeStep === 2 && (
              <ProjectStrategy_Hotlinks projectId={projectId || searchParams.get('id') || ''} />
            )}

            {/* Paso 3: Proyección de tus Ganancias */}
            {activeStep === 3 && (
              <ProjectStrategy_BusinessGrowth 
                commissionValue={Math.round(projectPrice * (projectCommission / 100))} 
                commissionRate={projectCommission / 100} 
              />
            )}

            {/* Paso 4: Tu Mapa de Ruta (Blueprint) */}
            {activeStep === 4 && (
              <ProjectStrategy_Blueprint />
            )}

            {/* Paso 5: Conoce a tu Comprador Ideal */}
            {activeStep === 5 && (
              <ProjectStrategy_AvatarDiagnosis 
                avatars={strategyData?.avatars || []} 
                psychology={strategyData?.psychology || { 
                  pains: [], 
                  solutions: [], 
                  awarenessStages: { stage1_pain: '', stage2_solution: '', stage3_barrier: '' }, 
                  conversionStrategy: { mainFocus: [], tacticalNote: '' } 
                }} 
                benefitsItems={strategyData?.modules?.web?.landingPageTabs?.benefits?.items || []}
              />
            )}

            {/* Paso 6: Psicología de Compra y Objeciones */}
            {activeStep === 6 && (
              <ProjectStrategy_Psychology 
                strategy={strategyData} 
                benefitsItems={strategyData?.modules?.web?.landingPageTabs?.benefits?.items || []} 
              />
            )}

            {/* Paso 7: Los Testimonios de tu Producto */}
            {activeStep === 7 && (
              <ProjectStrategy_Testimonials strategyData={strategyData} />
            )}

            {/* Paso 8: Mira tu Página de Captura */}
            {activeStep === 8 && (
              <ProjectStrategy_WebSystem 
                projectId={projectId || searchParams.get('id') || ''} 
                lpTabsData={strategyData?.modules?.web?.landingPageTabs} 
                tyTabsData={strategyData?.modules?.web?.thankYouPageTabs} 
              />
            )}

            {/* Paso 9: Tus Ganchos de Venta (Hooks) */}
            {activeStep === 9 && (
              <ProjectStrategy_Hooks 
                strategyData={strategyData}
              />
            )}

            {/* Paso 10: Tu Estrategia de Contenidos */}
            {activeStep === 10 && (
              <ProjectStrategy_Content 
                contentData={strategyData?.modules?.content || []}
              />
            )}

            {/* Paso 11: Email Marketing */}
            {activeStep === 11 && (
              <ProjectStrategy_Email 
                projectId={projectId || searchParams.get('id') || undefined}
                emailData={strategyData?.modules?.emails?.nurture || []}
                avatars={strategyData?.avatars || []}
              />
            )}

            {/* Paso 12: Secuencia de Confianza (Evergreen) */}
            {activeStep === 12 && (
              <ProjectStrategy_Evergreen 
                projectId={projectId || searchParams.get('id') || ''}
                evergreenData={strategyData?.modules?.emails?.evergreen || []}
                avatars={strategyData?.avatars || []}
                linkedArticles={strategyData?.modules?.content || []}
                onUpgrade={onUpgradeClick || (() => {})}
              />
            )}

            {/* Paso 13: Scripts de WhatsApp (Cierre) */}
            {activeStep === 13 && (
              <ProjectStrategy_WhatsApp 
                projectId={projectId || searchParams.get('id') || ''}
                strategyData={strategyData}
                onUpgrade={onUpgradeClick || (() => {})}
              />
            )}

            {/* Dinámico para otros pasos (Paso 14+) */}
            {activeStep > 13 && (
              <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
                
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-md">
                    <Settings className="w-7 h-7 animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">Consola del Paso {activeStep}</h3>
                    <p className="text-slate-300 text-base font-normal leading-relaxed">
                      Este paso estratégico se encuentra totalmente configurado para tu nicho <strong className="text-white font-extrabold uppercase">{projectNiche}</strong>. A continuación puedes ver el estado del recurso y operarlo directamente.
                    </p>
                  </div>
                </div>

                <div className="max-w-3xl mx-auto pt-4 border-t border-slate-800">
                  {activeStep === 2 && (
                    <div className="space-y-4 text-left">
                      <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-orange-500 shrink-0" />
                          <div>
                            <h4 className="text-base font-bold text-white">Página de Captación / Registro</h4>
                            <p className="text-sm text-slate-400 truncate max-w-sm sm:max-w-md">{projectUrl}</p>
                          </div>
                        </div>
                        <a 
                          href={projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#FF5A1F]/15 hover:bg-[#FF5A1F]/25 text-[#FF5A1F] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all"
                        >
                          <span>Ver página</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-4 text-left">
                      <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <h4 className="text-base font-bold text-white">Página de Agradecimiento / Entrega</h4>
                            <p className="text-sm text-slate-400 truncate max-w-sm sm:max-w-md">{projectUrl}/gracias</p>
                          </div>
                        </div>
                        <a 
                          href={`${projectUrl}/gracias`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all"
                        >
                          <span>Ver página</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="space-y-4 text-left">
                      <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Video className="w-5 h-5 text-rose-400 shrink-0" />
                          <div>
                            <h4 className="text-base font-bold text-white">Reels y Videos para Tráfico</h4>
                            <p className="text-sm text-slate-400">3 ganchos y guiones de video generados con Inteligencia Artificial.</p>
                          </div>
                        </div>
                        <button 
                          onClick={onScrollToProjectPanel}
                          className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          Gestionar Videos
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep === 5 && (
                    <div className="space-y-4 text-left">
                      <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                          <div>
                            <h4 className="text-base font-bold text-white">Guión Persuasivo de Ventas</h4>
                            <p className="text-sm text-slate-400">Estructura del guion técnico validada por expertos en copywriting.</p>
                          </div>
                        </div>
                        <button 
                          onClick={onScrollToProjectPanel}
                          className="px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          Ver Guiones
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep === 6 && (
                    <div className="space-y-4 text-left">
                      <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Activo principal</span>
                      <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-indigo-400 shrink-0" />
                          <div>
                            <h4 className="text-base font-bold text-white">Checklist de Publicación</h4>
                            <p className="text-sm text-slate-400">Sube el video a Instagram / TikTok usando los hashtags de alta conversión.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleMarkAsCompleted(6)}
                          className="px-4 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          Marcar Publicado
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep === 7 && (
                    <div className="space-y-4 text-left">
                      <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Configuración del Pixel</span>
                      <div className="p-5 bg-slate-900 border border-slate-700/80 rounded-2xl space-y-4">
                        <p className="text-sm text-slate-300">Inserta tu ID de Pixel de Meta o Google Analytics para medir visitas e inscripciones automáticamente.</p>
                        <div className="flex gap-3">
                          <input 
                            type="text" 
                            placeholder="Ej. 182736451928" 
                            className="flex-1 bg-[#060913] border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF5A1F] text-white"
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
                      <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Flujo de pruebas</span>
                      <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl space-y-3">
                        <p className="text-sm text-slate-300">Ingresa a tu página de captura, pon un correo de prueba y verifica que te redirige a la página de gracias.</p>
                        <a 
                          href={projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#FF5A1F] uppercase tracking-wider hover:underline"
                        >
                          <span>Iniciar prueba de registro</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeStep === 9 && (
                    <div className="space-y-4 text-left">
                      <span className="text-xs font-black uppercase text-orange-500 tracking-wider">Base de datos</span>
                      <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-teal-400 shrink-0" />
                          <div>
                            <h4 className="text-base font-bold text-white">Gestor de Contactos CRM</h4>
                            <p className="text-sm text-slate-400">Visualiza las métricas y exporta los leads capturados en tiempo real.</p>
                          </div>
                        </div>
                        <button 
                          onClick={onScrollToProjectPanel}
                          className="px-4 py-2 bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          Ver Leads
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep >= 10 && (
                    <div className="p-6 bg-[#FFBF00]/10 border border-[#FFBF00]/30 rounded-2xl space-y-4 text-left max-w-xl mx-auto shadow-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-[#FFBF00] shrink-0" />
                        <h4 className="text-base font-black text-white uppercase tracking-tight">Acceso bloqueado (Función PRO)</h4>
                      </div>
                      <p className="text-sm text-slate-200 font-normal leading-relaxed">
                        Las etapas de automatización de correo electrónico avanzado y conexión de dominios propios de marca están reservadas para usuarios PRO.
                      </p>
                      <button 
                        onClick={onUpgradeClick}
                        className="px-5 py-2.5 bg-[#FFBF00] hover:bg-[#E5AC00] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                      >
                        Desbloquear con PRO
                      </button>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* Botonera de acciones inferior */}
            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleMarkAsCompleted(activeStep)}
                  className="px-6 py-3.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center gap-2 group cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>Marcar paso como completado y continuar</span>
                  <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => handleToggleSaveForLater(activeStep)}
                  className={`px-5 py-3.5 border rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    savedForLater.includes(activeStep)
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                      : "bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-200"
                  }`}
                >
                  <Bookmark className="w-4.5 h-4.5 shrink-0" />
                  <span>{savedForLater.includes(activeStep) ? "Guardado" : "Guardar para después"}</span>
                </button>
              </div>

              {activeStep < 11 && (
                <div className="flex items-center gap-3 text-left">
                  <div className="space-y-0.5 text-right hidden sm:block">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Siguiente paso:</span>
                    <span className="text-sm text-white font-bold block truncate max-w-xs">{stepsList[activeStep]?.title.substring(3)}</span>
                  </div>
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
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

      {/* Panel lateral / Drawer desde la derecha para el Análisis Completo */}
      {isAnalysisDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsAnalysisDrawerOpen(false)}
          />
          
          <div className="relative w-full max-w-2xl bg-[#0B1120] border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            
            {/* Header del Panel */}
            <div className="p-6 sm:p-8 border-b border-slate-800 flex items-center justify-between gap-4 bg-[#0d1322]">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                    Análisis del Producto Digital
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    (En base a tu página de ventas)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAnalysisDrawerOpen(false)}
                className="p-2.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all cursor-pointer"
                title="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Panel (Scrollable) */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6 text-left custom-scrollbar">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Producto Promocionado</span>
                <h4 className="text-lg font-extrabold text-white">{projectName || "Curso de Microblading Profesional"}</h4>
                <span className="inline-block text-xs font-semibold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  Nicho: {projectNiche || "Belleza y Estética"}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Análisis Completo del Producto</span>
                </h4>

                <div className="relative border-l-4 border-indigo-500 pl-6 py-4 bg-indigo-500/5 rounded-r-2xl text-slate-200 text-base leading-relaxed space-y-4 font-light">
                  {analysisTextIsHtml ? (
                    <div 
                      className="prose prose-invert max-w-none text-slate-200"
                      dangerouslySetInnerHTML={{ __html: fullAnalysisText }}
                    />
                  ) : (
                    <div className="whitespace-pre-line text-slate-200">
                      {fullAnalysisText}
                    </div>
                  )}
                </div>
              </div>

              {/* Resumen Estratégico */}
              <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Resumen Estratégico</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-medium block">Objetivo Principal</span>
                    <p className="font-semibold text-white">{strategyData?.meta?.summary?.primaryObjective || "Generar leads cualificados y convertirlos en ventas"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-medium block">Método de Venta</span>
                    <p className="font-semibold text-white">{strategyData?.meta?.summary?.salesMethod || "Embudo automático con página + guía PDF + WhatsApp"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-medium block">Acción del Sistema</span>
                    <p className="font-semibold text-white">{strategyData?.meta?.summary?.systemAction || "Crea las páginas, mensajes y contenidos necesarios"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-medium block">Público Objetivo</span>
                    <p className="font-semibold text-white">{strategyData?.meta?.summary?.targetAudienceSummary || "Mujeres que quieren aprender microblading y generar ingresos"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Panel */}
            <div className="p-6 border-t border-slate-800 bg-[#0d1322] flex items-center justify-end">
              <button
                onClick={() => setIsAnalysisDrawerOpen(false)}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 transition-all cursor-pointer text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Cerrar Panel</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Drawer deslizable desde la derecha para Proyección de tus ganancias */}
      {isProjectionDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Overlay de fondo */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer"
            onClick={() => setIsProjectionDrawerOpen(false)}
          />

          {/* Panel lateral deslizable desde la derecha */}
          <div className="relative w-full max-w-4xl bg-[#070D19] border-l border-slate-800 shadow-2xl z-50 flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header del Panel */}
            <div className="p-6 border-b border-slate-800 bg-[#0d1322] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                    Proyección de tus Ganancias
                  </h3>
                  <p className="text-xs text-slate-400">
                    Estrategia de ingresos a 12 meses, escala de leads y hoja de ruta paso a paso.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsProjectionDrawerOpen(false)}
                className="p-2.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all cursor-pointer"
                title="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Panel (Scrollable con todo el contenido de Proyección de tus ganancias, gráfica y roadmap) */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-8 text-left custom-scrollbar">
              <ProjectStrategy_BusinessGrowth 
                commissionValue={earnings || Math.round((projectPrice || 147) * ((projectCommission || 80) / 100)) || 116}
                commissionRate={(projectCommission || 80) / 100}
                hideHeader={true}
              />
            </div>

            {/* Footer del Panel */}
            <div className="p-6 border-t border-slate-800 bg-[#0d1322] flex items-center justify-end shrink-0">
              <button
                onClick={() => setIsProjectionDrawerOpen(false)}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 transition-all cursor-pointer text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Cerrar Panel</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
