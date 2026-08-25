import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../services/api";
import { ProjectStrategy_Sidebar } from "../tools/ProjectStrategy/ProjectStrategy_Sidebar";
import { ProjectStrategy_Hotlinks } from "../tools/ProjectStrategy/ProjectStrategy_Hotlinks";
import { ProjectStrategy_BusinessGrowth } from "../tools/ProjectStrategy/ProjectStrategy_BusinessGrowth";
import { ProjectStrategy_Blueprint } from "../tools/ProjectStrategy/ProjectStrategy_Blueprint";
import { ProjectStrategy_AvatarDiagnosis } from "../tools/ProjectStrategy/ProjectStrategy_AvatarDiagnosis";
import { ProjectStrategy_WebSystem } from "../tools/ProjectStrategy/ProjectStrategy_WebSystem";
import { ProjectStrategy_Hooks } from "../tools/ProjectStrategy/ProjectStrategy_Hooks";
import { ProjectStrategy_Content } from "../tools/ProjectStrategy/ProjectStrategy_Content";
import { ProjectStrategy_Email } from "../tools/ProjectStrategy/ProjectStrategy_Email";
import { ProjectStrategy_Evergreen } from "../tools/ProjectStrategy/ProjectStrategy_Evergreen";
import { ProjectStrategy_WhatsApp } from "../tools/ProjectStrategy/ProjectStrategy_WhatsApp";
import { StepHeaderCard } from "./StepHeaderCard";
import { StepVideoContainer } from "./StepVideoContainer";
import { EstrategiaComercialDrawer, CommercialOptionId } from "./EstrategiaComercialDrawer";
import { ImplementationGuideContext } from './ImplementationGuideContext';
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
  Gift,
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
  user?: any;
  isAdmin?: boolean;
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
  user,
  isAdmin,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [fullProject, setFullProject] = useState<any>(null);
  const [savedForLater, setSavedForLater] = useState<number[]>([]);
  const [strategyData, setStrategyData] = useState<any>(null);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [isAnalysisDrawerOpen, setIsAnalysisDrawerOpen] = useState<boolean>(false);
  const [isProjectionDrawerOpen, setIsProjectionDrawerOpen] = useState<boolean>(false);
  const [isCommercialDrawerOpen, setIsCommercialDrawerOpen] = useState<boolean>(false);
  const [selectedCommercialOption, setSelectedCommercialOption] = useState<CommercialOptionId | null>(null);
  const [openGuideStages, setOpenGuideStages] = useState<number[]>([1]);

  useEffect(() => {
    const activeStageNum = stepsList.find(s => s.id === activeStep)?.stage || 1;
    setOpenGuideStages(prev => Array.from(new Set([...prev, activeStageNum])));
  }, [activeStep]);

  const toggleGuideStage = (stageNum: number) => {
    if (openGuideStages.includes(stageNum)) {
      setOpenGuideStages(openGuideStages.filter(s => s !== stageNum));
    } else {
      setOpenGuideStages([...openGuideStages, stageNum]);
    }
  };

  useEffect(() => {
    const pid = projectId || searchParams.get('id');
    if (pid) {
      api.getProjectStrategy(pid).then((data: any) => {
        if (data) setStrategyData(data);
      }).catch((err: any) => console.error("Error loading strategy in ImplementationGuide", err));

      api.getProjectById(pid).then((proj: any) => {
        if (proj) {
          setFullProject(proj);
          if (proj.description) setProjectDescription(proj.description);
          
          const storedCompletedSteps = proj.strategy_json?.completed_steps || [];
          setCompletedSteps(storedCompletedSteps);
          
          if (!searchParams.get('section') && !activeStrategySection && storedCompletedSteps.length < 9) {
            // Find first uncompleted step
            let firstUncompleted = 1;
            while(firstUncompleted <= 9 && storedCompletedSteps.includes(firstUncompleted)) {
              firstUncompleted++;
            }
            if (firstUncompleted <= 9) {
              setActiveStep(firstUncompleted);
            }
          }
        }
      }).catch((err: any) => console.error("Error loading project in ImplementationGuide", err));
    }
  }, [projectId, searchParams, activeStrategySection]);

  const handleCompleteStep = async (stepId: number) => {
    if (completedSteps.includes(stepId)) return;
    
    const newCompleted = [...completedSteps, stepId];
    setCompletedSteps(newCompleted);
    
    if (stepId < 9) {
      setActiveStep(stepId + 1);
    }
    
    const pid = projectId || searchParams.get('id');
    if (pid && fullProject) {
      try {
        const updatedStrategyJson = {
          ...(fullProject.strategy_json || {}),
          completed_steps: newCompleted
        };
        await api.updateProject(pid, { ...fullProject, strategy_json: updatedStrategyJson });
        setFullProject({ ...fullProject, strategy_json: updatedStrategyJson });
      } catch (e) {
        console.error("Error updating project completed steps", e);
      }
    }
  };

  const fullAnalysisText = projectDescription || 
    strategyData?.meta?.shortDescription || 
    strategyData?.meta?.insights?.niche?.description || 
    strategyData?.meta?.insights?.product?.description || 
    strategyData?.meta?.summary?.productDescription || 
    "Curso profesional de técnica de cejas pelo a pelo para principiantes y esteticistas.";

  const cleanAnalysisText = fullAnalysisText.replace(/<[^>]*>/g, '').trim();
  const analysisTextIsHtml = /<[a-z][\s\S]*>/i.test(fullAnalysisText);

  const stepToSectionMap: Record<number | string, string> = {
    1: 'summary',
    2: 'avatar',
    3: 'web',
    4: 'hotlinks',
    5: 'hooks',
    6: 'content',
    7: 'email',
    8: 'evergreen',
    9: 'whatsapp'
  };

  const sectionToStepMap: Record<string, number> = {
    summary: 1,
    avatar: 2,
    web: 3,
    hotlinks: 4,
    hooks: 5,
    content: 6,
    email: 7,
    evergreen: 8,
    whatsapp: 9,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9
  };

  const currentStrategySection = stepToSectionMap[activeStep] || activeStrategySection || searchParams.get('section') || "summary";

  useEffect(() => {
    const rawSection = activeStrategySection || searchParams.get('section');
    if (rawSection) {
      const step = sectionToStepMap[rawSection];
      if (step && step !== activeStep) {
        setActiveStep(step);
      }
    }
  }, [activeStrategySection, searchParams]);

  const handleStrategySectionClick = (sectionId: string) => {
    const step = sectionToStepMap[sectionId] || 1;
    setActiveStep(step);
    const normalizedSection = stepToSectionMap[step] || sectionId;
    setSearchParams({ section: normalizedSection });
    if (onStrategySectionChange) {
      onStrategySectionChange(normalizedSection);
    }
    const el = document.getElementById('project-strategy-index');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Confeti desde varios ángulos únicamente cuando se entra desde la pantalla de proyecto terminado
  useEffect(() => {
    if (typeof window !== "undefined") {
      const shouldFire = sessionStorage.getItem("trigger_project_confetti") === "true";
      if (shouldFire) {
        sessionStorage.removeItem("trigger_project_confetti");

        const fireMultiAngleConfetti = () => {
          // Ángulo 1: Cañón izquierdo
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 75,
            origin: { x: 0, y: 0.7 },
            colors: ['#FF5A1F', '#FF8B1F', '#10B981', '#3B82F6', '#EC4899', '#F59E0B']
          });

          // Ángulo 2: Cañón derecho
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 75,
            origin: { x: 1, y: 0.7 },
            colors: ['#FF5A1F', '#FF8B1F', '#10B981', '#3B82F6', '#EC4899', '#F59E0B']
          });

          // Ángulo 3: Explosión central
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.5, y: 0.55 },
            colors: ['#FF5A1F', '#FFFFFF', '#10B981', '#F59E0B']
          });

          // Ángulo 4: Lluvia diagonal centro-izquierda
          confetti({
            particleCount: 60,
            angle: 45,
            spread: 80,
            origin: { x: 0.25, y: 0.75 },
            colors: ['#FF5A1F', '#FF8B1F', '#3B82F6']
          });

          // Ángulo 5: Lluvia diagonal centro-derecha
          confetti({
            particleCount: 60,
            angle: 135,
            spread: 80,
            origin: { x: 0.75, y: 0.75 },
            colors: ['#FF5A1F', '#10B981', '#EC4899']
          });
        };

        fireMultiAngleConfetti();
        const t1 = setTimeout(fireMultiAngleConfetti, 400);
        const t2 = setTimeout(fireMultiAngleConfetti, 800);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    }
  }, []);

  // Calculate earnings
  const earnings = Math.round(projectPrice * (projectCommission / 100));

  const stepsList = [
    { id: 1, title: "1. Bienvenida e introducción", stage: 1, stageTitle: "ETAPA 1 — Activa tu sistema" },
    { id: 2, title: "2. Tu comprador ideal", stage: 1 },
    { id: 3, title: "3. Tu página de captura", stage: 1 },
    { id: 4, title: "4. Tus enlaces de afiliados", stage: 1 },
    
    { id: 5, title: "5. Tus hooks de atracción", stage: 2, stageTitle: "ETAPA 2: TU SISTEMA DE VENTAS (LISTO PARA USAR)" },
    { id: 6, title: "6. Tu estrategia de contenidos", stage: 2 },
    { id: 7, title: "7. Tu secuencia de ventas", stage: 2 },
    { id: 8, title: "8. Activa tu secuencia de confianza", stage: 2 },
    { id: 9, title: "9. Configura tus mensajes de cierre", stage: 2 },
  ];

  const handleStepClick = (id: number) => {
    setActiveStep(id);
    const sectionId = stepToSectionMap[id] || 'summary';
    setSearchParams({ section: sectionId });
    if (onStrategySectionChange) {
      onStrategySectionChange(sectionId);
    }
  };

  const handleMarkAsCompleted = (id: number) => {
    if (!completedSteps.includes(id)) {
      setCompletedSteps(prev => [...prev, id]);
    }
    // Automatically transition to next step if not last
    if (id < 9) {
      handleStepClick(id + 1);
    }
  };

  const handleToggleSaveForLater = (id: number) => {
    if (savedForLater.includes(id)) {
      setSavedForLater(prev => prev.filter(x => x !== id));
    } else {
      setSavedForLater(prev => [...prev, id]);
    }
  };

  const percentCompleted = Math.round((completedSteps.length / 9) * 100);

  return (
    <ImplementationGuideContext.Provider value={{ completedSteps, onCompleteStep: handleCompleteStep }}>
    <div className="w-full text-slate-200 font-sans min-h-screen bg-[#060913] -mt-2 sm:-mt-4 -mx-1 sm:-mx-3">
      
      {/* Layout Grid */}
      <div className="w-full max-w-[1760px] mx-auto px-2 sm:px-3 md:px-4 pt-1 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)] 2xl:grid-cols-[350px_minmax(0,1fr)] gap-4 lg:gap-5 xl:gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: Menús Laterales (Índice Estratégico + Guía de implementación) */}
          <aside className="space-y-4 lg:sticky lg:top-3 max-h-[calc(100vh-20px)] overflow-y-auto custom-scrollbar pr-1.5">
            
            {/* 1. Menú Índice Estratégico (Imagen 1) */}
            <ProjectStrategy_Sidebar 
              activeSection={currentStrategySection}
              onSectionChange={handleStrategySectionClick}
            />
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
            
            {/* 1. Header del paso (Solo para pasos diferentes a los Pasos 2 a 9 ya que tienen su propio header) */}
            {activeStep === 1 && (
              <div className="text-left mb-1">
                <span className="inline-flex bg-[#102A1E] text-[#10B981] border border-[#10B981]/20 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider items-center gap-2 shrink-0 shadow-sm">
                  <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
                  TU PÁGINA ESTÁ PUBLICADA Y TUS TRES REELS ESTÁN LISTOS PARA COMENZAR A ATRAER VISITAS.
                </span>
              </div>
            )}
            {activeStep !== 2 && activeStep !== 3 && activeStep !== 4 && activeStep !== 5 && activeStep !== 6 && activeStep !== 7 && activeStep !== 8 && activeStep !== 9 && (
              <StepHeaderCard 
                stepNumber={activeStep}
                totalSteps={stepsList.length}
                title={stepsList[activeStep - 1]?.title.replace(/^\d+\.\s*/, '') || "Tu Proyecto Digital"}
                description="Revisa el producto que vas a promocionar, cuánto puedes ganar por cada venta y cómo funcionará el sistema que hemos preparado para ti."
                completedSteps={1}
              />
            )}

            {/* Renderizar contenido dinámico según el paso activo */}
            {activeStep === 1 && (
              <div className="space-y-6">

                {/* Video Guía (Aparece arriba del todo en el Paso 1) */}
                <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <StepVideoContainer 
                    posterImage="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=675"
                    videoUrl="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0"
                    title="Entiende tu proyecto"
                    stepNumber={activeStep}
                    user={user}
                    isAdmin={isAdmin}
                  />
                </div>

                {/* Bloque con el nombre del proyecto (Transparente, sin fondo ni bordes) */}
                <div className="py-2 text-left space-y-1">
                  <h1 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight">
                    {projectName || strategyData?.meta?.projectName || strategyData?.meta?.insights?.overview?.items?.[0]?.value || "Masterclass Microblading Pro"}
                  </h1>
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
                      
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
                        <span className="text-slate-300 font-normal text-sm sm:text-base flex items-center gap-2 select-none">
                          <Compass className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Sector:</span>
                        </span>
                        <span className="font-medium text-white text-sm sm:text-base sm:text-right">
                          {projectNiche || strategyData?.meta?.niche || strategyData?.meta?.insights?.overview?.items?.[1]?.value || "Belleza y Estética"}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
                        <span className="text-slate-300 font-normal text-sm sm:text-base flex items-center gap-2 select-none">
                          <Target className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Objetivo principal:</span>
                        </span>
                        <span className="font-medium text-white text-sm sm:text-base sm:text-right leading-relaxed sm:max-w-md">
                          {strategyData?.meta?.summary?.primaryObjective || strategyData?.meta?.insights?.overview?.items?.[4]?.value || "Generar leads cualificados y convertirlos en ventas"}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
                        <span className="text-slate-300 font-normal text-sm sm:text-base flex items-center gap-2 select-none">
                          <Users className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Para quién es:</span>
                        </span>
                        <span className="font-medium text-white text-sm sm:text-base sm:text-right leading-relaxed sm:max-w-md">
                          {strategyData?.meta?.summary?.targetAudienceSummary || "Mujeres que quieren aprender microblading y generar ingresos"}
                        </span>
                      </div>

                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
                        <span className="text-slate-300 font-normal text-sm sm:text-base flex items-center gap-2 select-none">
                          <Clock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span>Edades de tu público objetivo:</span>
                        </span>
                        <span className="font-medium text-white text-sm sm:text-base sm:text-right leading-relaxed sm:max-w-md">
                          {strategyData?.meta?.summary?.targetAgeRange || "Mujeres de 22 a 45 años"}
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

                  <div className="relative border-l-4 border-indigo-500/80 pl-5 pr-6 py-3 bg-indigo-500/5 rounded-r-xl max-w-3xl">
                    <p className="text-white text-base sm:text-lg leading-relaxed sm:leading-8 font-normal line-clamp-2">
                      {cleanAnalysisText && cleanAnalysisText.length > 60 
                        ? cleanAnalysisText 
                        : "Curso profesional de técnica de cejas pelo a pelo para principiantes y esteticistas. Este programa de formación intensiva está diseñado paso a paso para dominar el diseño, la simetría y la pigmentación en el microblading, permitiendo crear un negocio propio altamente rentable en el sector de la estética con una demanda en constante crecimiento."}
                    </p>
                  </div>
                </div>



                {/* Recorrido básico de tu sistema (Linkeable: Abre mapa de ruta en drawer derecho) */}
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

                  {/* Grid de tarjetas grandes del recorrido (Pasos 1 al 11 distribuidos en filas de máximo 5 tarjetas con conectores fluidos) */}
                  <div className="relative pt-2 space-y-2">
                    
                    {/* FILA 1: Pasos 1 a 5 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 relative">
                      
                      {/* Paso 1: Reels / Contenido */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 1
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center shadow-xl shadow-fuchsia-500/10">
                          <Film className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Reels / Contenido
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Atraemos atención
                          </p>
                        </div>
                      </div>

                      {/* Paso 2: Página de captación */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 2
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-xl shadow-sky-500/10">
                          <Globe className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Página de captación
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Capturamos el interés
                          </p>
                        </div>
                      </div>

                      {/* Paso 3: Registro del usuario */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 3
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/10">
                          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Registro del usuario
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Generamos confianza
                          </p>
                        </div>
                      </div>

                      {/* Paso 4: Página de gracias */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 4
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-xl shadow-teal-500/10">
                          <Gift className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Página de gracias
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Confirmación y guía
                          </p>
                        </div>
                      </div>

                      {/* Paso 5: Grupo de WhatsApp */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 5
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-400 flex items-center justify-center shadow-xl shadow-green-500/10">
                          <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Grupo de WhatsApp
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Comunidad y avisos
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* CONECTOR SVG 1 (Desktop lg): De Paso 5 (Col 5) a Paso 6 (Col 1) */}
                    <div className="hidden lg:block relative h-16 w-full my-1 pointer-events-none">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="flow-line-gradient-1" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22C55E" />
                            <stop offset="50%" stopColor="#38BDF8" />
                            <stop offset="100%" stopColor="#A855F7" />
                          </linearGradient>
                          <filter id="glow-line-1" x="-10%" y="-10%" width="120%" height="120%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Línea fluorescente con resplandor */}
                        <path 
                          d="M 908,0 L 908,38 Q 908,48 893,48 L 107,48 Q 92,48 92,58 L 92,78" 
                          fill="none" 
                          stroke="url(#flow-line-gradient-1)" 
                          strokeWidth="6" 
                          strokeLinecap="round"
                          filter="url(#glow-line-1)"
                          className="opacity-40"
                        />
                        {/* Línea principal limpia punteada */}
                        <path 
                          d="M 908,0 L 908,38 Q 908,48 893,48 L 107,48 Q 92,48 92,58 L 92,78" 
                          fill="none" 
                          stroke="url(#flow-line-gradient-1)" 
                          strokeWidth="3" 
                          strokeLinecap="round"
                          strokeDasharray="6 4"
                        />

                        {/* Nodo de origen (salida del Paso 5) */}
                        <circle cx="908" cy="0" r="6" fill="#22C55E" />
                        <circle cx="908" cy="0" r="2.5" fill="#FFFFFF" />

                        {/* Flecha pequeña elegante señalando hacia abajo */}
                        <g>
                          <polygon points="86,76 92,88 98,76" fill="#A855F7" />
                          <polygon points="88,76 92,85 96,76" fill="#FFFFFF" />
                        </g>

                        {/* Nodo de destino (llegada al Paso 6) */}
                        <circle cx="92" cy="96" r="6" fill="#A855F7" />
                        <circle cx="92" cy="96" r="2.5" fill="#FFFFFF" />
                      </svg>
                    </div>

                    {/* FILA 2: Pasos 6 a 10 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 relative">
                      
                      {/* Paso 6: Clase u oferta principal */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 6
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-xl shadow-purple-500/10">
                          <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Clase u oferta principal
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Presentamos la solución
                          </p>
                        </div>
                      </div>

                      {/* Paso 7: Lanzamiento y Checkout Full */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 7
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/10">
                          <Rocket className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Lanzamiento & Checkout
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Oferta oficial full
                          </p>
                        </div>
                      </div>

                      {/* Paso 8: Secuencia de Venta Email Marketing */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 8
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-xl shadow-rose-500/10">
                          <Mail className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Secuencia de Ventas
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Email marketing directo
                          </p>
                        </div>
                      </div>

                      {/* Paso 9: Nutrición Evergreen & Blog */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 9
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-xl shadow-indigo-500/10">
                          <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Nutrición & Blog
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Emails y artículos de valor
                          </p>
                        </div>
                      </div>

                      {/* Paso 10: Checkout con descuento */}
                      <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between space-y-4 transition-all duration-300 relative z-10">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          PASO 10
                        </span>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/10">
                          <Tag className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            Checkout con Descuento
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Cierre con incentivo
                          </p>
                        </div>
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
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-400 transition-all shadow-lg hover:scale-105 shrink-0 self-start sm:self-auto"
                    >
                      <span>Ver proyección completa y gráfica</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Columna Izquierda: Parámetros */}
                    <div className="lg:col-span-5 space-y-6">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors leading-tight">
                          Proyección de ingresos basada en tu comisión
                        </h3>
                      </div>

                      <div className="space-y-3.5 bg-[#070D19] border border-slate-800 p-6 rounded-2xl text-base text-slate-200 font-medium">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>Ganancia neta por venta: <strong className="text-white font-bold">${formatValue(earnings || Math.round((projectPrice || 147) * ((projectCommission || 80) / 100)) || 130)} USD</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>Tasa de cierre objetivo: <strong className="text-white font-bold">5% en WhatsApp</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>Porcentaje de comisión: <strong className="text-white font-bold">{formatValue(projectCommission || 80)}%</strong></span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#070D19] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 text-center">
                          <p className="text-xs sm:text-sm text-slate-400 font-extrabold uppercase tracking-wider mb-1.5">Ganancia / Venta</p>
                          <p className="text-emerald-400 font-black text-3xl sm:text-4xl">${formatValue(earnings || Math.round((projectPrice || 147) * ((projectCommission || 80) / 100)) || 130)}</p>
                        </div>
                        <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
                          <p className="text-xs sm:text-sm text-slate-400 font-extrabold uppercase tracking-wider mb-1.5">Cierre WA</p>
                          <p className="text-white font-black text-3xl sm:text-4xl">5%</p>
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha: Escala de Leads */}
                    <div className="lg:col-span-7 bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
                      <h4 className="text-base sm:text-lg font-extrabold text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ArrowUpRight className="w-5 h-5 text-emerald-400" /> 
                          Escala de ingresos según volumen de Leads
                        </span>
                        <span className="text-xs sm:text-sm text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                          Ver gráfico <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </h4>
                      
                      <div className="space-y-3">
                        {[50, 100, 200, 500, 1000].map((leads, i) => {
                          const commVal = earnings || Math.round((projectPrice || 147) * ((projectCommission || 80) / 100)) || 130;
                          const sales = Math.floor(leads * 0.05);
                          const incomeValue = sales * commVal;
                          return (
                            <div key={i} className="flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-[#0B1120] border border-slate-800 group-hover:border-slate-700 transition-all">
                              <div className="text-left">
                                <p className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-0.5">Atrayendo</p>
                                <p className="text-white font-black text-base sm:text-lg flex items-center gap-2">
                                  <Users className="w-4.5 h-4.5 text-sky-400" /> {formatValue(leads)} Leads
                                </p>
                              </div>
                              <div className="flex flex-col items-center">
                                <p className="text-xs sm:text-sm text-slate-300 font-extrabold uppercase">{formatValue(sales)} {sales === 1 ? 'venta' : 'ventas'}</p>
                                <ArrowRight className="w-4 h-4 text-slate-500" />
                              </div>
                              <div className="text-right">
                                <p className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ganancia aprox.</p>
                                <p className="text-emerald-400 font-black text-xl sm:text-2xl">${formatValue(incomeValue)} USD</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-[#0B1120] border-l-4 border-amber-500/50 rounded-r-2xl text-left text-xs sm:text-sm text-slate-200 font-medium">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p>Proyecciones basadas en un cierre conservador del 5%. Muestran el potencial de escala de tu activo digital.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* Paso 2: Conoce a tu Comprador Ideal */}
            {activeStep === 2 && (
              <ProjectStrategy_AvatarDiagnosis 
                totalSteps={stepsList.length}
                avatars={strategyData?.avatars || []} 
                psychology={strategyData?.psychology || { 
                  pains: [], 
                  solutions: [], 
                  awarenessStages: { stage1_pain: '', stage2_solution: '', stage3_barrier: '' }, 
                  conversionStrategy: { mainFocus: [], tacticalNote: '' } 
                }} 
                benefitsItems={strategyData?.modules?.web?.landingPageTabs?.benefits?.items || []}
                strategyData={strategyData}
              />
            )}

            {/* Paso 3: Tu Página Web de Captura */}
            {activeStep === 3 && (
              <ProjectStrategy_WebSystem 
                totalSteps={stepsList.length}
                projectId={projectId || searchParams.get('id') || ''} 
                lpTabsData={strategyData?.modules?.web?.landingPageTabs} 
                tyTabsData={strategyData?.modules?.web?.thankYouPageTabs} 
              />
            )}

            {/* Paso 4: Configura tus enlaces de afiliado */}
            {activeStep === 4 && (
              <ProjectStrategy_Hotlinks totalSteps={stepsList.length} projectId={projectId || searchParams.get('id') || ''} />
            )}

            {/* Paso 5: Tus Ganchos de Venta (Hooks) */}
            {activeStep === 5 && (
              <ProjectStrategy_Hooks 
                totalSteps={stepsList.length}
                strategyData={strategyData}
              />
            )}

            {/* Paso 6: Tu Estrategia de Contenidos */}
            {activeStep === 6 && (
              <ProjectStrategy_Content 
                totalSteps={stepsList.length}
                contentData={strategyData?.modules?.content || []}
              />
            )}

            {/* Paso 7: Email Marketing */}
            {activeStep === 7 && (
              <ProjectStrategy_Email 
                totalSteps={stepsList.length}
                projectId={projectId || searchParams.get('id') || undefined}
                emailData={strategyData?.modules?.emails?.nurture || []}
                avatars={strategyData?.avatars || []}
              />
            )}

            {/* Paso 8: Secuencia de Confianza (Evergreen) */}
            {activeStep === 8 && (
              <ProjectStrategy_Evergreen 
                totalSteps={stepsList.length}
                projectId={projectId || searchParams.get('id') || ''}
                evergreenData={strategyData?.modules?.emails?.evergreen || []}
                avatars={strategyData?.avatars || []}
                linkedArticles={strategyData?.modules?.content || []}
                onUpgrade={onUpgradeClick || (() => {})}
              />
            )}

            {/* Paso 9: Scripts de WhatsApp (Cierre) */}
            {activeStep === 9 && (
              <ProjectStrategy_WhatsApp 
                totalSteps={stepsList.length}
                projectId={projectId || searchParams.get('id') || ''}
                strategyData={strategyData}
                onUpgrade={onUpgradeClick || (() => {})}
              />
            )}

            {/* Dinámico para otros pasos (Paso 10+) */}
            {activeStep > 9 && (
              <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
                
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-md">
                    <Settings className="w-7 h-7 animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">Consola del Paso {activeStep}</h3>
                    <p className="text-slate-200 text-base sm:text-lg font-normal leading-relaxed">
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



            {/* BOTÓN NAVEGACIÓN "SIGUIENTE PASO" AL FINAL DE CADA PÁGINA */}
            <div className="pt-8 pb-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="text-left space-y-1">
                <p className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">
                  {activeStep < stepsList.length ? `PASO SIGUIENTE EN TU RUTA DE IMPLEMENTACIÓN` : `¡HAS LLEGADO AL ÚLTIMO PASO DE TU GUÍA!`}
                </p>
                <p className="text-sm sm:text-base font-bold text-white">
                  {activeStep < stepsList.length 
                    ? `Paso ${activeStep + 1}: ${stepsList[activeStep]?.title.replace(/^\d+\.\s*/, '')}`
                    : `Has completado la revisión de todos los pasos del sistema.`}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {activeStep > 1 && (
                  <button
                    onClick={() => handleStepClick(activeStep - 1)}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700/80 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Paso anterior</span>
                  </button>
                )}

                {activeStep < stepsList.length ? (
                  <button
                    onClick={() => handleStepClick(activeStep + 1)}
                    className="px-6 py-3.5 rounded-xl bg-[#FF5A1F] hover:bg-[#ff6c37] text-white font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-[#FF5A1F]/20 hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto"
                  >
                    <span>Siguiente paso</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStepClick(1)}
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto"
                  >
                    <span>Volver al inicio</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
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
          
          <div className="relative w-full md:w-1/2 lg:w-[800px] max-w-full bg-[#0B1120] border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            
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
      <AnimatePresence>
        {isProjectionDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Overlay de fondo */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
              onClick={() => setIsProjectionDrawerOpen(false)}
            />

            {/* Panel lateral deslizable desde la derecha */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[95vw] lg:max-w-[85vw] xl:max-w-[1400px] bg-[#070D19] border-l border-slate-800 shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            >
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

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Drawer para Estrategia Comercial (Mapa de Ruta, Avatares, Objeciones, Oferta, etc.) */}
      <EstrategiaComercialDrawer
        isOpen={isCommercialDrawerOpen}
        onClose={() => setIsCommercialDrawerOpen(false)}
        activeOption={selectedCommercialOption}
        setActiveOption={setSelectedCommercialOption}
        strategyData={strategyData}
      />

    </div>
    </ImplementationGuideContext.Provider>
  );
};
