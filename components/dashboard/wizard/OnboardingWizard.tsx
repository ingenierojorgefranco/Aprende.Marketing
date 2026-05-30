import React, { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { User, Project, ColorPalette } from "../../../types";
import { api } from "../../../services/api";
import {
  Zap,
  Target,
  CheckCircle,
  LogOut,
  ChevronRight,
  Video,
  MessageSquare,
  Mail,
  Lock,
  Database,
  Rocket,
  AlertTriangle,
  FileText,
  Globe,
  Users,
  ShieldCheck,
  Crown,
  Shield,
  X,
  Copy,
  Check,
  Calendar,
  Plus,
} from "lucide-react";
import { generateLandingPageContent } from "../../../services/geminiService";
import { UpgradeModal } from "../UpgradeModal";
import {
  WelcomeStep,
  ProjectSelectionStep,
  UnlockProtocolStep,
  GenerationStep,
  AvatarRevealStep,
  StrategyReadyStep,
  LandingIntroStep,
  LandingSuccessStep,
  HooksRevealStep,
  SuccessStep,
} from "./WizardSteps";

const UserProfileModal = React.lazy(() => import("../UserProfileModal"));

interface OnboardingWizardProps {
  user: User;
  onComplete: () => void;
  onLogout?: () => void;
  onGenerationStateChange?: (isGenerating: boolean) => void;
  onUpdateUser?: (updatedUser: User) => void;
}

type WizardStep =
  | "welcome"
  | "selection"
  | "generating_strategy"
  | "strategy_ready"
  | "show_avatars"
  | "show_landing_prep"
  | "creating_web"
  | "landing_success"
  | "show_hooks"
  | "generating_hooks"
  | "success"
  | "limit_reached";

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  user,
  onComplete,
  onLogout,
  onGenerationStateChange,
  onUpdateUser,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(() => {
    if (typeof window !== "undefined") {
      const forced = localStorage.getItem("force_wizard_step");
      if (forced === "success") {
        return "success";
      }
    }
    return "welcome";
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userActiveProjects, setUserActiveProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("Iniciando...");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [unlockedProject, setUnlockedProject] = useState<any>(null);
  const [strategyData, setStrategyData] = useState<any>(null);
  const [isLandingCreated, setIsLandingCreated] = useState(false);
  const [createdPageSubdomain, setCreatedPageSubdomain] = useState<string>("");
  const [isHooksUnlocked, setIsHooksUnlocked] = useState(false);
  const [unlockedHooks, setUnlockedHooks] = useState<any[]>([]);
  const [activeDetailsDrawer, setActiveDetailsDrawer] = useState<
    | "avatar"
    | "testimonials"
    | "objections"
    | "benefits"
    | "hooks"
    | "blog"
    | "email"
    | "whatsapp"
    | null
  >(null);
  const [selectedHookForDrawer, setSelectedHookForDrawer] = useState<any>(null);
  const [selectedBlogForDrawer, setSelectedBlogForDrawer] = useState<any>(null);
  const [selectedEmailForDrawer, setSelectedEmailForDrawer] = useState<any>(null);
  const [selectedWhatsappForDrawer, setSelectedWhatsappForDrawer] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Modals de confirmación
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showCreateLandingConfirm, setShowCreateLandingConfirm] =
    useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [revealedSections, setRevealedSections] = useState<WizardStep[]>([
    "welcome",
  ]);

  const welcomeRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const unlockRef = useRef<HTMLDivElement>(null);
  const strategyRef = useRef<HTMLDivElement>(null);
  const strategyReadyRef = useRef<HTMLDivElement>(null);
  const avatarsRef = useRef<HTMLDivElement>(null);
  const landingPrepRef = useRef<HTMLDivElement>(null);
  const creationRef = useRef<HTMLDivElement>(null);
  const landingSuccessRef = useRef<HTMLDivElement>(null);
  const hooksRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const limitReachedRef = useRef<HTMLDivElement>(null);

  const isGenerating =
    step === "generating_strategy" ||
    step === "creating_web" ||
    step === "generating_hooks";

  // Notify parent about generation state
  useEffect(() => {
    if (onGenerationStateChange) {
      onGenerationStateChange(isGenerating);
    }
  }, [isGenerating, onGenerationStateChange]);

  // Timer para generación
  useEffect(() => {
    let interval: any;
    if (
      step === "generating_strategy" ||
      step === "creating_web" ||
      step === "generating_hooks"
    ) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setSecondsElapsed(0);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Gestión de secciones reveladas
  useEffect(() => {
    if (!revealedSections.includes(step)) {
      setRevealedSections((prev) => [...prev, step]);
    }
  }, [step]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (activeDetailsDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDetailsDrawer]);

  // Cargar proyectos recomendados al inicio o cuando sea necesario
  useEffect(() => {
    loadMasterProjects();
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 400);
  };

  useEffect(() => {
    if (selectedProject) {
      scrollTo(unlockRef);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (step === "success" || step === "limit_reached") {
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    if (step === "generating_strategy") scrollTo(strategyRef);
    if (step === "strategy_ready") scrollTo(strategyReadyRef);
    if (step === "show_avatars") scrollTo(avatarsRef);
    if (step === "show_landing_prep") scrollTo(landingPrepRef);
    if (step === "creating_web") scrollTo(creationRef);
    if (step === "landing_success") scrollTo(landingSuccessRef);
    if (step === "show_hooks") scrollTo(hooksRef);
    if (step === "success") scrollTo(successRef);
    if (step === "limit_reached") scrollTo(limitReachedRef);
  }, [step]);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadMasterProjects = async () => {
    if (projects.length > 0) return;
    setLoadingProjects(true);
    try {
      const masterLibrary = await api.getMasterLibrary();
      setProjects(masterLibrary.slice(0, 6));
    } catch (error) {
      console.error("Error cargando libreria maestra:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleProjectSelection = (project: Project) => {
    setSelectedProject(project);
    if (step !== "selection") setStep("selection");
  };

  const handleUnlockConfirm = async () => {
    setShowActivateConfirm(false);
    setStep("generating_strategy");
    await processStrategyUnlock();
  };

  const processStrategyUnlock = async () => {
    if (!selectedProject) return;

    try {
      setGenerationProgress(10);
      setGenerationStatus("Estoy creando tu estrategia de Ventas");

      // 1. Desbloquear proyecto
      const unlocked = await api.unlockProject(selectedProject.id, {
        registered_via: "wizard",
        initial_setup: true,
      });
      const fullUnlockedProject = await api.getProjectById(unlocked.id);
      setUnlockedProject(
        fullUnlockedProject || {
          ...unlocked,
          masterParentId: selectedProject.id,
        },
      );

      setGenerationProgress(40);
      setGenerationStatus("Extrayendo arquitectura psicológica...");

      // 2. Obtener estrategia real
      const strategy = await api.getProjectStrategy(unlocked.id);
      setStrategyData(strategy);

      setGenerationProgress(100);
      setGenerationStatus("¡Estrategia Lista!");

      setTimeout(() => {
        setStep("strategy_ready");
      }, 800);
    } catch (error: any) {
      console.error("Error en desbloqueo:", error);
      const errorMsg = error?.message || error?.toString() || "";
      const isLimitError =
        errorMsg.includes("403") ||
        errorMsg.includes("límite") ||
        errorMsg.includes("limite") ||
        errorMsg.includes("proyectos") ||
        errorMsg.includes("cupo");

      if (isLimitError) {
        try {
          const myProjects = await api.getProjects();
          setUserActiveProjects(myProjects);
        } catch (loadErr) {
          console.error("Error cargando proyectos del usuario:", loadErr);
        }
        setStep("limit_reached");
      } else {
        setGenerationStatus("Error. Reintentando...");
        setTimeout(() => setStep("selection"), 2000);
      }
    }
  };

  const handleCreateWeb = async () => {
    setShowCreateLandingConfirm(false);
    setStep("creating_web");
    setGenerationProgress(0);
    setGenerationStatus("Estoy creando tu Página Web Profesional");

    try {
      setGenerationProgress(20);
      setGenerationStatus("Configurando servidor de captación...");

      // Obtener datos reales de la estrategia para la landing (Contexto Psicológico Profundo)
      const niche = selectedProject?.niche || "Marketing Digital";

      let targetAudience = strategyData?.avatars?.[0]?.name || "Emprendedores";
      if (strategyData) {
        const s = strategyData;
        const avatarContext =
          s.avatars && Array.isArray(s.avatars) && s.avatars.length > 0
            ? s.avatars
                .map(
                  (a: any) => `${a.archetype}: ${a.pain}. Deseo: ${a.desire}`,
                )
                .join(" | ")
            : s.avatar?.story || "";

        const painsContext =
          s.psychology?.pains && Array.isArray(s.psychology.pains)
            ? `Dolores principales: ${s.psychology.pains.map((p: any) => (typeof p === "object" ? p.text || p.title || p.description || "" : String(p))).join(", ")}`
            : "";

        const solutionsContext =
          s.psychology?.solutions && Array.isArray(s.psychology.solutions)
            ? `Soluciones clave: ${s.psychology.solutions.map((sol: any) => (typeof sol === "object" ? sol.title || sol.text || "" : String(sol))).join(", ")}`
            : "";

        targetAudience = [avatarContext, painsContext, solutionsContext]
          .filter(Boolean)
          .join(". ");
      }

      setGenerationProgress(50);
      setGenerationStatus("Estoy creando tu Página Web Profesional");

      // Seleccionar paleta aleatoria profesional
      const palettes: ColorPalette[] = [
        "modern-blue",
        "elegant-purple",
        "energetic-orange",
        "nature-green",
        "dark-luxury",
        "ocean-teal",
        "crimson-red",
        "corporate-slate",
        "gold-prestige",
        "minimal-mono",
      ];
      const randomPalette =
        palettes[Math.floor(Math.random() * palettes.length)];

      // Generar contenido con todo el contexto estratégico y multimedia del proyecto maestro
      const projectWithStrategy = {
        ...(unlockedProject || {}),
        productName: selectedProject?.productName || selectedProject?.name,
        brandTone: selectedProject?.brandTone,
        description: selectedProject?.description,
        painPoints: selectedProject?.painPoints,
        keyBenefits: selectedProject?.keyBenefits,
        strategy_json: strategyData,
        multimedia_json:
          unlockedProject?.multimedia_json?.heroImages?.length > 0
            ? unlockedProject.multimedia_json
            : selectedProject?.multimedia_json || {
                heroImages: [],
                videoUrls: [],
                descriptiveImages: [],
              },
      };

      const content = await generateLandingPageContent(
        selectedProject?.productName ||
          selectedProject?.name ||
          "Producto Digital",
        "Registro a Webinar / Clase", // Forzamos objetivo de webinar
        targetAudience,
        "Registro", // Para que coincida con la otra sección exactamente
        randomPalette,
        "webinar-funnel", // Forzamos estructura de webinar
        {
          type: "form",
          url: "",
          whatsappPhone: "",
          whatsappMessage: "",
        },
        projectWithStrategy,
      );

      setGenerationProgress(80);
      setGenerationStatus("Publicando en nube segura...");

      const slugify = (text: string) =>
        text
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/--+/g, "-");
      const cleanProjectName = slugify(
        selectedProject?.productName || selectedProject?.name || "producto",
      );
      const randomCode = Math.floor(Math.random() * 1000);
      const generatedSubdomain = `${cleanProjectName}-${randomCode}.generatorlanding.com`;

      // Crear la página - Sincronizado exactamente con las especificaciones de generación estándar
      const newPage = {
        name: `Web Oficial - ${selectedProject?.productName || selectedProject?.name}`,
        niche: selectedProject?.productName || selectedProject?.name || niche,
        goal: "Registro a Webinar / Clase",
        subdomain: generatedSubdomain,
        content: content,
        projectId: unlockedProject.id,
        isPublished: true,
      };

      const savedPage = await api.createPage(
        newPage as any,
        projectWithStrategy as any,
      );
      if (savedPage && savedPage.subdomain) {
        setCreatedPageSubdomain(savedPage.subdomain);
      } else {
        setCreatedPageSubdomain(newPage.subdomain);
      }

      setGenerationProgress(100);
      setGenerationStatus("Página Publicada");
      setIsLandingCreated(true);

      setTimeout(() => {
        setStep("landing_success");
      }, 800);
    } catch (error) {
      console.error("Error en creación de web:", error);
      setStep("show_hooks"); // Fallback a hooks para no romper el flujo
    }
  };

  const handleUnlockHooks = async () => {
    setStep("generating_hooks");
    setGenerationProgress(0);
    setGenerationStatus("Obteniendo biblioteca de ganchos...");

    console.log(
      "🚀 Iniciando proceso de desbloqueo de hooks para el proyecto:",
      unlockedProject?.id,
    );

    try {
      setGenerationProgress(20);

      // 1. Obtener ganchos de la estrategia o de la librería maestra
      let allHooks = strategyData?.modules?.hooks || [];

      if (allHooks.length === 0 && selectedProject) {
        console.log(
          "📦 Estrategia sin hooks, consultando librería maestra para proyecto:",
          selectedProject.id,
        );
        const library = await api.getHooksLibrary(1, 50, selectedProject.id);
        allHooks = library.hooks || [];
      }

      // Filtrar para asegurar que solo escogemos ganchos activos (donde isActive !== false e is_active !== 0)
      allHooks = allHooks.filter(
        (h: any) =>
          h.isActive !== false && h.is_active !== 0 && h.is_active !== false,
      );

      console.log(`📊 Ganchos activos encontrados: ${allHooks.length}`);

      if (allHooks.length > 0) {
        setGenerationStatus("Seleccionando ganchos estratégicos...");
        setGenerationProgress(40);

        // Mezclar y seleccionar 3 aleatorios
        const shuffled = [...allHooks].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        const masterHookIds = selected.map((h: any) => h.id || h.masterHookId);

        console.log(
          "🎯 Ganchos seleccionados para desbloquear:",
          masterHookIds,
        );

        setGenerationStatus("Desbloqueando ganchos para tu proyecto...");
        setGenerationProgress(60);

        // 2. Desbloquear en lote en el backend (Pasamos true para que ya se creen marcados como generados)
        if (unlockedProject?.id && masterHookIds.length > 0) {
          const response = await api.unlockMultipleHooks(
            unlockedProject.id,
            masterHookIds,
            true,
          );
          console.log("✅ Resultado del desbloqueo masivo:", response);

          if (response && response.results) {
            // Mapear los resultados unlocked a la estructura que espera HooksRevealStep
            // El state unlockedHooks debe contener los IDs reales devueltos por el servidor
            const finalizedHooks = response.results.map(
              (h: any, idx: number) => ({
                ...selected[idx], // Mantenemos la data visual (título, copy, etc)
                id: h.id, // Usamos el ID real generado en DB (ahora retornado por el backend como id)
                isGenerated: true,
              }),
            );

            setUnlockedHooks(finalizedHooks);
          } else {
            setUnlockedHooks(selected);
          }
        }

        setGenerationProgress(90);
        setGenerationStatus("Configurando activos de video...");
      } else {
        console.warn("⚠️ No se encontraron hooks para desbloquear.");
      }

      // Simular un pequeño tiempo de carga para que el usuario perciba "trabajo" (UX)
      setTimeout(() => {
        setGenerationProgress(100);
        setGenerationStatus("¡Ganchos Listos!");
        setIsHooksUnlocked(true);
        setTimeout(() => {
          setStep("show_hooks");
        }, 800);
      }, 1000);
    } catch (error) {
      console.error("❌ Error en proceso de ganchos:", error);
      setIsHooksUnlocked(true); // Fallback
      setStep("show_hooks");
    }
  };

  const activeProjectName =
    selectedProject?.name ||
    unlockedProject?.name ||
    "Curso de Microblading de Cejas";
  const activeProjectImage =
    selectedProject?.multimedia_json?.heroImages?.[0] ||
    unlockedProject?.multimedia_json?.heroImages?.[0];
  const activeProjectNiche =
    selectedProject?.niche || unlockedProject?.niche || "Digital";

  const getPageUrl = () => {
    const subdomainPart = createdPageSubdomain
      ? createdPageSubdomain.split(".")[0]
      : "";
    if (subdomainPart) {
      const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname.includes("ais-dev"));
      return isLocal
        ? `/admin/lp/${subdomainPart}`
        : `https://aprende.marketing/admin/lp/${subdomainPart}`;
    } else if (unlockedProject) {
      return `/dashboard/projects/${unlockedProject.id}/strategy?section=web`;
    }
    return "https://www.mipagina.com";
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#020202] overflow-y-auto overflow-x-hidden snap-y snap-mandatory z-[45] scroll-smooth selection:bg-[#FF5A1F] selection:text-white"
    >
      {/* Header del Wizard */}
      <header
        className={`fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 md:px-12 z-50 transition-all duration-300 ${
          step === "success"
            ? "bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        {/* Logo a la izquierda */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-[#FF5A1F]/20 px-1">
            A.MKT
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Aprende.<span className="text-[#FF5A1F]">Marketing</span>
          </h2>
        </div>

        {/* Perfil y Salir a la derecha (sin fondo, flotando) */}
        <div className="flex items-center gap-2 sm:gap-4 z-10 font-sans">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 sm:gap-3 pl-2 pr-3 sm:pr-4 py-1.5 rounded-full bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10 transition shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center font-bold overflow-hidden shadow-lg shadow-[#FF5A1F]/20 flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-sm font-bold text-[#B0B0B0] hidden sm:block truncate max-w-[124px] hover:text-white transition-colors">
              {user.name}
            </span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 sm:gap-3 pl-2 pr-3 sm:pr-4 py-1.5 rounded-full bg-transparent border border-transparent text-[#B0B0B0] hover:text-red-400 hover:bg-red-900/10 hover:border-red-500/10 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] hover:bg-[#FF5A1F]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider hidden lg:inline">
                Salir
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Background Decorations - Fixed to viewport to cover everything consistently */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] -left-[10%] w-[70%] h-[70%] bg-[#FF5A1F]/10 blur-[130px] rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-[-10%] -right-[10%] w-[60%] h-[60%] bg-[#FF5A1F]/5 blur-[100px] rounded-full opacity-50"></div>
      </div>

      <div className="w-full relative z-10">
        {step === "limit_reached" ? (
          <div ref={limitReachedRef} className="w-full max-w-[1400px] mx-auto px-4 md:px-6 min-h-screen flex flex-col justify-center pt-28 pb-16 relative z-10 font-sans">
            <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-400 uppercase tracking-widest mb-4 animate-pulse">
                Plan Completo
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
                ¡Límite del Plan Alcanzado!
              </h1>
              <p className="text-white text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                Has alcanzado el límite máximo de proyectos disponibles en tu
                suscripción actual. Para continuar creando nuevas estrategias de
                marketing, necesitas liberar cupos o actualizar tu plan. Aquí
                tienes tus proyectos activos:
              </p>
            </div>

            {userActiveProjects.length === 0 ? (
              <div className="text-center py-10 bg-[#111]/50 rounded-[2.5rem] border border-white/5 max-w-xl mx-auto w-full px-6">
                <p className="text-gray-400 text-sm animate-pulse">
                  Cargando tus proyectos activos...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] mx-auto w-full mb-20 animate-in fade-in duration-500">
                {/* Visual Card: Create New Project to upgrade plan */}
                <div 
                  className="bg-[#0B0B0B] border-2 border-dashed border-white/20 rounded-[2.5rem] overflow-hidden hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-center group flex flex-col items-center justify-center p-10 shadow-2xl relative min-h-[520px] w-full cursor-pointer"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-all shadow-lg mb-6">
                    <Plus className="w-10 h-10" />
                  </div>
                  <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors uppercase tracking-tight">Crear Nuevo Proyecto</h4>
                  <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[11px] max-w-xs mx-auto">
                    Aumentar Plan para desbloquear cupos e iniciar un nuevo nicho
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUpgradeModal(true);
                    }}
                    className="mt-8 px-6 py-4 bg-gradient-to-r from-amber-400 to-[#FF5A1F] text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Aumentar Plan
                  </button>
                </div>

                {userActiveProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-[#FF5A1F]/50 transition-all flex flex-col h-full shadow-2xl relative min-h-[520px] w-full"
                  >
                    {/* Imagen del Proyecto */}
                    <div className="h-64 bg-gray-800 relative overflow-hidden">
                      {project.multimedia_json?.heroImages?.[0] ? (
                        <img
                          src={project.multimedia_json.heroImages[0]}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                          <Target className="w-12 h-12 text-[#FF5A1F] opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-60" />

                      {/* Nicho flotante */}
                      <div className="absolute bottom-4 left-6">
                        <span className="px-4 py-2 bg-white text-[#FF5A1F] text-[12px] font-black uppercase rounded-full shadow-lg">
                          {project.niche || "Digital"}
                        </span>
                      </div>
                    </div>

                    {/* Contenido (Idéntico a WizardSteps) */}
                    <div className="p-10 flex flex-col flex-1">
                      <h3 className="text-3xl font-black mb-4 text-white group-hover:text-[#FF5A1F] transition-colors line-clamp-2">
                        {project.name}
                      </h3>
                      <p className="text-white text-base leading-relaxed mb-8 flex-1 line-clamp-4">
                        {project.shortDescription ||
                          project.description ||
                          "Este proyecto no tiene cargada una descripción pero está activo en tu plan."}
                      </p>

                      {/* Botón Ver Proyecto */}
                      <div className="flex items-center justify-center pt-8 border-t border-white/5">
                        <button
                          onClick={() => {
                            navigate(
                              `/dashboard/projects/${project.id}/strategy`,
                            );
                            onComplete?.();
                          }}
                          className="w-full py-4 bg-[#FF5A1F] text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF5A1F]/20 hover:bg-[#D94A1E] transition-all flex items-center justify-center gap-2"
                        >
                          <Target className="w-4 h-4" />
                          Ver Proyecto
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botón de Regresar al Panel de Administración abajo del todo */}
            <div className="flex justify-center mt-4">
              <button
                onClick={onComplete}
                className="px-8 py-4 sm:px-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FF5A1F]/30 text-white font-black text-sm tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF5A1F]/5"
              >
                Regresar al panel de administración
              </button>
            </div>
          </div>
        ) : step === "success" ? (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 min-h-screen flex flex-col justify-center pt-36 md:pt-40 pb-16 relative z-10 font-sans">
            {/* Page Title */}
            <div className="text-center max-w-5xl mx-auto mb-8 space-y-6">
              <h1 className="text-4xl md:text-[3.75rem] md:leading-[1.1] font-black text-white tracking-tight uppercase font-sans">
                ¡PERFECTO!
                <br />
                <span className="text-white font-black">
                  YA ESTÁS A UN PASO DE{" "}
                </span>
                <span className="text-[#FF5A1F] font-black">
                  ATRAER CLIENTES Y GANAR ALTAS COMISIONES
                </span>
              </h1>

              {/* 85% Progress Container - Moved under Title and Styled elegantly */}
              <div className="w-full max-w-3xl mx-auto bg-black/40 border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF5A1F]/5 blur-2xl rounded-full"></div>
                <div className="relative z-10 space-y-4">
                  <p className="text-gray-200 text-[1.2rem] leading-[1.8rem] font-sans">
                    Tu máquina de ventas está al 85%. Activa tu plan mensual para completar el 15% restante y empezar a facturar hoy mismo.
                  </p>
                  
                  {/* Styled full-width progress bar with filling animation */}
                  <div className="w-full relative space-y-2">
                    <div className="w-full h-5 bg-white/5 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFBF00] to-[#FF5A1F] rounded-full shadow-[0_0_15px_rgba(255,90,31,0.8)] animate-pulse"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-end items-center px-1">
                      <span className="text-[#FFBF00] font-mono font-black text-xl tracking-wider select-none">
                        85%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Big Layout (Bento Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mb-12">
              {/* Columna Izquierda (El Proyecto) - 60% Width */}
              <div className="lg:col-span-7 flex">
                {/* Project Progress Bento */}
                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-start space-y-6 shadow-2xl relative overflow-hidden flex-1 w-full">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>

                  {/* Bento Header */}
                  <div className="mb-2 relative z-10 text-center w-full">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-full flex flex-col items-center justify-center py-4">
                        {/* Centered Project Name styled with attractive custom shapes, glowing backgrounds */}
                        <div className="relative inline-flex items-center z-10 mb-6">
                          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FFBF00] to-[#FF5A1F] rounded-2xl blur-md opacity-25 animate-pulse"></div>
                          <div className="relative bg-[#141415] border border-white/10 rounded-2xl px-6 py-3 shadow-inner font-sans text-center">
                            <h2 className="text-xl md:text-2xl font-black text-[#FFBF00] tracking-wider uppercase">
                              {activeProjectName}
                            </h2>
                          </div>
                        </div>

                        {/* Onboarding welcome message styled with elegant top-padding without lines */}
                        <div className="pt-6 w-full relative">
                          <p className="text-base md:text-lg lg:text-xl text-center text-white/95 font-normal leading-relaxed w-full max-w-2xl mx-auto px-6 py-2 tracking-wide font-sans relative z-10">
                            Tienes delante el negocio digital que otros tardan
                            meses en configurar. Tienes los guiones, tienes la
                            web y tienes la estrategia. Revisa tu material,
                            activa tu cuenta y dale al botón de encendido para
                            empezar a facturar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bento Body Container */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                    {/* Mobile iPhone Mockup Preview */}
                    <div className="md:col-span-5 flex justify-center">
                      <div className="relative w-48 h-[340px] bg-[#000] rounded-[2.2rem] border-[5px] border-zinc-800 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden cursor-pointer group hover:border-[#FFBF00]/40 transition-all duration-300">
                        {/* Camera notch / dynamic island */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full absolute left-3"></span>
                          <span className="w-1 h-1 bg-zinc-900 rounded-full absolute right-4"></span>
                        </div>

                        {/* Signal bar mockups */}
                        <div className="flex justify-between text-[7px] text-gray-500 font-bold px-3 pt-0.5 z-10 font-mono">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <span>📶</span>
                            <span>🔋</span>
                          </div>
                        </div>

                        {/* Inner Screen */}
                        <div className="relative h-full w-full rounded-[1.4rem] bg-[#0E0E0F] overflow-hidden flex flex-col mt-0.5 border border-white/5">
                          {/* Mock Browser URL tag */}
                          <div className="w-[90%] mx-auto mt-2 py-0.5 px-2 bg-white/5 rounded-md border border-white/5 text-[6px] text-zinc-500 font-mono flex items-center justify-between">
                            <span className="truncate">
                              🔒 mkt.
                              {activeProjectName
                                .toLowerCase()
                                .replace(/\s+/g, "")}
                              .com
                            </span>
                            <span>↻</span>
                          </div>

                          {/* Dynamic Template Content */}
                          <div className="flex-1 flex flex-col p-2.5 space-y-2 mt-1 select-none text-left">
                            {activeProjectImage ? (
                              <div className="w-full h-24 rounded-lg overflow-hidden border border-white/5 relative bg-zinc-900">
                                <img
                                  src={activeProjectImage}
                                  alt={activeProjectName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                              </div>
                            ) : (
                              <div className="w-full h-24 rounded-lg bg-gradient-to-tr from-[#111] to-[#FF5A1F]/20 border border-white/5 flex items-center justify-center">
                                <Target className="w-6 h-6 text-[#FF5A1F] opacity-40" />
                              </div>
                            )}

                            <div className="space-y-1">
                              <span className="px-1.5 py-0.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[5px] font-black uppercase text-[#FF5A1F] rounded">
                                {activeProjectNiche}
                              </span>
                              <h3 className="text-[9px] font-black text-white leading-tight uppercase tracking-tight block truncate mt-1">
                                {activeProjectName}
                              </h3>
                              <p className="text-[6px] text-zinc-400 font-medium leading-snug">
                                La estructura psicológica de alta conversión
                                está lista. Generando ingresos pasivos...
                              </p>
                            </div>

                            {/* Simulated Landing elements */}
                            <div className="space-y-1 mt-auto pt-2">
                              <div className="h-1 bg-white/5 rounded-full w-[80%]"></div>
                              <div className="h-1 bg-white/5 rounded-full w-[60%]"></div>
                              <div className="w-full py-1 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] rounded text-white font-black text-[5px] text-center uppercase tracking-wider shadow-sm">
                                ¡EMPEZAR AHORA!
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Checklist right side */}
                    <div
                      id="status-checklist-container"
                      className="md:col-span-7 space-y-4 px-2"
                    >
                      {/* Check 1 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                          <strong className="font-bold text-white font-sans">
                            Análisis de Cliente Ideal (Avatar):
                          </strong>{" "}
                          <span className="font-normal text-zinc-300">
                            ¡Generado con precisión!
                          </span>
                        </p>
                      </div>

                      {/* Check 2 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                          <strong className="font-bold text-white font-sans">
                            Guiones de Venta (Reels, TikTok, Shorts):
                          </strong>{" "}
                          <span className="font-normal text-zinc-300">
                            ¡Listos para grabar!
                          </span>
                        </p>
                      </div>

                      {/* Check 3 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                          <strong className="font-bold text-white font-sans">
                            Estructura de Página de Captura:
                          </strong>{" "}
                          <span className="font-normal text-zinc-300">
                            ¡Diseñada y optimizada!
                          </span>
                        </p>
                      </div>

                      {/* Warning Lock 1 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                          <Lock className="w-3 h-3 text-[#FFBF00]" />
                        </div>
                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                          <strong className="font-bold text-white font-sans">
                            Conexión de Dominio Personalizado:
                          </strong>{" "}
                          <span className="font-normal text-zinc-400">
                            Pendiente 👑
                          </span>
                        </p>
                      </div>

                      {/* Warning Lock 2 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                          <Lock className="w-3 h-3 text-[#FFBF00]" />
                        </div>
                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                          <strong className="font-bold text-white font-sans">
                            Activación de Embudos Automatizados:
                          </strong>{" "}
                          <span className="font-normal text-zinc-400">
                            Pausado 👑
                          </span>
                        </p>
                      </div>

                      {/* Warning Lock 3 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                          <Lock className="w-3 h-3 text-[#FFBF00]" />
                        </div>
                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                          <strong className="font-bold text-white font-sans">
                            Publicación en Hotmart:
                          </strong>{" "}
                          <span className="font-normal text-zinc-400">
                            Bloqueado 👑
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha (Desbloquea tu Máquina de Ventas - Premium Glowing Plan) - 40% Width */}
              <div className="lg:col-span-5 flex">
                <div className="bg-[#111] border-2 border-[#FFBF00]/30 rounded-[2.5rem] p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden font-sans w-full shadow-[0_0_25px_rgba(255,191,0,0.06)]">
                  {/* Ambient Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>

                  <div className="space-y-6">
                    {/* Main Heading Text */}
                    <div className="text-center space-y-3 relative z-10 w-full px-2">
                       <h4 className="text-lg md:text-xl font-black text-[#FFBF00] tracking-normal leading-tight font-sans text-center">
                        EL 85% TE TRAERÁ NUEVAS VISITAS. PERO SOLO EL 100% TE CERRARÁ VENTAS.
                      </h4>
                    </div>

                    {/* List of benefits PRO PLAN */}
                    <div className="space-y-4 relative z-10 text-left font-sans w-full px-2">
                      <div className="space-y-4">
                        {/* Benefit 1 */}
                        <div className="flex items-start gap-2">
                          <p className="text-base md:text-lg text-left text-white font-sans leading-relaxed">
                            <span className="font-bold text-white font-sans">
                              👑 3 Espacios de Negocio Activos:
                            </span>{" "}
                            <span className="text-white">
                              Lanza y mantén hasta 3 proyectos diferentes facturando al mismo tiempo por una única cuota. Si un nicho no funciona, borras el proyecto y ocupas ese slot con uno nuevo sin pagar de más.
                            </span>
                          </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="flex items-start gap-2">
                          <p className="text-base md:text-lg text-left text-white font-sans leading-relaxed">
                            <span className="font-bold text-white font-sans">
                              👑 Contenido en Piloto Automático:
                            </span>{" "}
                            <span className="text-white">
                              90 guiones virales y secuencias de email persuasivas para que no vuelvas a quedarte en blanco frente a la pantalla.
                            </span>
                          </p>
                        </div>

                        {/* Benefit 4 */}
                        <div className="flex items-start gap-2">
                          <p className="text-base md:text-lg text-left text-white font-sans leading-relaxed">
                            <span className="font-bold text-white font-sans">
                              👑 Soporte Directo de Cierre:
                            </span>{" "}
                            <span className="text-white">
                              No estás solo. Acceso a expertos por WhatsApp para lograr grandes resultados con tus embudos y escalar tus ingresos rápido.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing callout and Action Button at bottom */}
                    <div className="space-y-4 pt-4 relative z-10 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 pb-1">
                        {/* Orange highlighted line On Top - with margin bottom to add padding/spacing */}
                        <div className="w-11/12 h-[2px] bg-gradient-to-r from-transparent via-[#FF5A1F] to-transparent rounded-full shadow-[0_0_8px_rgba(255,90,31,0.6)] opacity-90 mb-4"></div>
                        <p
                          className="text-white font-black uppercase tracking-wider text-center"
                          style={{ fontSize: "1.2rem", lineHeight: "1.75rem" }}
                        >
                          VALOR TOTAL ESTIMADO DE LOS BENEFICIOS PRO:{" "}
                          <span className="text-[#FFBF00]">+$1,497</span>
                        </p>
                      </div>

                      <p className="text-white text-base md:text-lg font-normal tracking-wide text-center leading-relaxed">
                        Actualiza al Plan PRO por solo{" "}
                        <span className="text-[#FFBF00] font-black">
                          $39/mes
                        </span>
                      </p>

                      {/* Main Premium Red/Orange Button formatted and styled as the hand pointing button in screen */}
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black text-xs sm:text-sm uppercase tracking-wide rounded-2xl shadow-[0_0_20px_rgba(255,90,31,0.22)] hover:shadow-[0_0_30px_rgba(255,90,31,0.42)] transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 font-sans active:translate-y-0 text-center"
                        style={{ marginTop: "2em", marginBottom: "2em" }}
                      >
                        <span>COMIENZA A VENDER EN AUTOMÁTICO</span>
                      </button>

                      <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
                        <p className="text-base md:text-lg text-white font-black flex items-center justify-center gap-2 font-sans tracking-wide leading-relaxed">
                          <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />{" "}
                          14 Días de Garantía de Reembolso Total
                        </p>
                        <p className="text-sm md:text-base text-white font-normal tracking-normal text-center leading-relaxed">
                          Suscripción mensual, cancela cuando quieras.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Title for modules */}
            <div className="text-left mb-6 pl-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">
                Módulos de tu Centro de Operaciones
              </h4>
            </div>

            {/* List of 6 Operation Modules in a robust full-width stack layout */}
            <div className="flex flex-col gap-6 w-full mb-16">
              {/* Card 1: Estrategia de Ventas Completada */}
              <div className="bg-[#111] border border-[#FFBF00]/20 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>

                {/* Left Column: The Context and the Value */}
                <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-start">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">
                          Estrategia de Ventas
                        </h3>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider select-none leading-none flex items-center gap-1">
                        ✔ Completado y Activo
                      </span>
                    </div>

                    <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans pt-1 tracking-wide">
                      ¡He diseñado la mejor estrategia de ventas con la que
                      conseguirás altos ingresos recomendando el{" "}
                      <strong className="font-extrabold text-[#FFBF00] font-sans">
                        "{activeProjectName}"
                      </strong>
                      .<br />
                      <br />
                      Con la estrategia que he diseñado podrás:
                    </p>
                  </div>

                  {/* Bullets explaining why this is vital for the digital business */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm md:text-base mt-0.5">🎯</span>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Conectar con tu cliente ideal:
                        </strong>{" "}
                        <span className="text-white">
                          Entendiendo sus miedos más profundos para vender sin
                          fricción.
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm md:text-base mt-0.5">⚡</span>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Derribar objeciones automáticamente:
                        </strong>{" "}
                        <span className="text-white">
                          Usando historias y testimonios en el momento exacto.
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm md:text-base mt-0.5">💎</span>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Crear una oferta magnética:
                        </strong>{" "}
                        <span className="text-white">
                          Aplicando gatillos mentales que generan urgencia real
                          por comprar.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Resource Cards (Individual buttons) */}
                <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                  {/* Resource 1 */}
                  <div
                    onClick={() => {
                      setActiveDetailsDrawer("avatar");
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Avatares Psicológicos:
                        </strong>{" "}
                        <span className="text-white">
                          Tu comprador ideal totalmente perfilado con sus
                          dolores y motivaciones de compra.
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="w-full sm:w-auto px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm font-sans">
                        Ver Detalles
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Resource 2 */}
                  <div
                    onClick={() => {
                      setActiveDetailsDrawer("testimonials");
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Testimonios Persuasivos:
                        </strong>{" "}
                        <span className="text-white">
                          Historias y transformaciones humanas que derriban
                          dudas.
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="w-full sm:w-auto px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm font-sans">
                        Ver Detalles
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Resource 3 */}
                  <div
                    onClick={() => {
                      setActiveDetailsDrawer("objections");
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Dolores y Objeciones:
                        </strong>{" "}
                        <span className="text-white">
                          Los miedos de tu avatar mapeados para ser
                          neutralizados.
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="w-full sm:w-auto px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm font-sans">
                        Ver Detalles
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Resource 4 */}
                  <div
                    onClick={() => {
                      setActiveDetailsDrawer("benefits");
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-normal font-sans tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Beneficios Magnéticos:
                        </strong>{" "}
                        <span className="text-white">
                          La oferta irresistible redactada con gatillos
                          psicológicos de conversión.
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="w-full sm:w-auto px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm font-sans">
                        Ver Detalles
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Landing Page Oficial */}
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>

                {/* Left Column: The Context and the Value */}
                <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-start">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                          Página Web de Captura
                        </h3>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider select-none leading-none flex items-center gap-1">
                        ✔ Completado y Activo
                      </span>
                    </div>

                    <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide pt-1">
                      He creado para ti una página web que no solo se ve
                      increíble, sino que está diseñada estratégicamente para
                      ayudarte a conseguir clientes reales. Con tu página de
                      Captura podrás:
                    </p>
                  </div>

                  {/* Bullets explaining benefits */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm md:text-base mt-0.5">🎯</span>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Conseguir Contactos:
                        </strong>{" "}
                        <span className="text-white">
                          Guarda automáticamente los datos (como el email o
                          WhatsApp) de las personas interesadas.
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm md:text-base mt-0.5">⚡</span>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Generar Confianza Inmediata:
                        </strong>{" "}
                        <span className="text-white">
                          Un diseño profesional que hace que tu negocio destaque
                          desde el primer segundo.
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm md:text-base mt-0.5">💎</span>
                      <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                        <strong className="font-extrabold text-white font-sans">
                          Tecnología Inteligente (Pixel):
                        </strong>{" "}
                        <span className="text-white">
                          Tu página lista para conectar con anuncios de Facebook
                          e Instagram.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Resource Cards & Links */}
                <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                  {/* Resource 1: Capture page */}
                  <a
                    href={getPageUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                        <Globe className="w-5 h-5 text-[#FF5A1F]" />
                      </div>
                      <div>
                        <h4 className="text-sm md:text-base font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors text-left">
                          Página web con la que atraerás clientes
                        </h4>
                        <p className="text-base md:text-lg text-white mt-1 text-left leading-relaxed font-sans font-normal tracking-wide">
                          Haz clic para ver la página web profesional que he
                          creado para ti y con la que promoverás tu negocio
                          digital.
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1">
                        Ir al Sitio Web
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </a>

                  {/* Resource 2: Thank you page */}
                  <a
                    href={
                      getPageUrl() + (createdPageSubdomain ? "/gracias" : "")
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#FFBF00]/10 border border-[#FFBF00]/20 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                        <CheckCircle className="w-5 h-5 text-[#FFBF00]" />
                      </div>
                      <div>
                        <h4 className="text-sm md:text-base font-extrabold text-white group-hover:text-[#FFBF00] transition-colors text-left">
                          Página de Agradecimiento
                        </h4>
                        <p className="text-base md:text-lg text-white mt-1 text-left leading-relaxed font-sans font-normal tracking-wide">
                          Haz clic para ver la página de agradecimiento donde
                          serán dirigidos tus visitantes interesados al
                          registrarse.
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1">
                        Ver Gracias
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </a>

                  {/* Direct Enlace URL */}
                  <div className="bg-black/45 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 text-xs">
                    <span className="text-xs md:text-sm uppercase font-black tracking-wider text-white">
                      Enlace Web Directo (URL Temporal):
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <a
                        href={getPageUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FFBF00] font-mono font-medium hover:text-white transition-colors truncate underline block text-center flex-1 text-base md:text-lg"
                      >
                        {getPageUrl()}
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getPageUrl());
                          setCopiedUrl(true);
                          setTimeout(() => setCopiedUrl(false), 2000);
                        }}
                        className="shrink-0 px-3 py-1.5 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 border border-[#FF5A1F]/30 text-white rounded-xl text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        {copiedUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-extrabold">
                              ¡Copiado!
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Copiar URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Upgrade Opportunities Info Block */}
                  <div className="mt-4 bg-gradient-to-br from-[#FFBF00]/10 via-[#FF5A1F]/5 to-transparent border border-[#FFBF00]/20 rounded-2xl flex flex-col text-left overflow-hidden">
                    <div className="p-6 pb-4 space-y-3">
                      <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-wide font-sans leading-tight">
                        MULTIPLICA TUS VENTAS UN{" "}
                        <span className="text-[#FF5A1F] drop-shadow-[0_0_8px_rgba(255,90,31,0.4)]">
                          70%
                        </span>{" "}
                        USANDO UN ENLACE QUE INSPIRE CONFIANZA.
                      </h4>
                      <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed font-normal tracking-wide">
                        Es simple: los enlaces feos espantan a los compradores.
                        Activa el plan PRO, ponle un nombre real a tu negocio (
                        <strong className="text-white">www.tu-marca.com</strong>
                        ) y quítales la excusa para no comprarte.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black uppercase text-xs md:text-sm tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.99] border-t border-[#FF5A1F]/20 rounded-b-2xl shadow-[0_4px_20px_rgba(255,90,31,0.22)] shrink-0"
                    >
                      <Crown className="w-4 h-4 text-white shrink-0" />
                      SÍ, QUIERO UN DOMINIO PROFESIONAL
                    </button>
                  </div>
                </div>
              </div>
              {(() => {
                const isManicurista =
                  selectedProject?.name
                    ?.toLowerCase()
                    .includes("manicurista") ||
                  unlockedProject?.name
                    ?.toLowerCase()
                    .includes("manicurista") ||
                  selectedProject?.name?.toLowerCase().includes("uña") ||
                  unlockedProject?.name?.toLowerCase().includes("uña");
                const isMicroblading =
                  selectedProject?.name
                    ?.toLowerCase()
                    .includes("microblading") ||
                  unlockedProject?.name
                    ?.toLowerCase()
                    .includes("microblading") ||
                  selectedProject?.name?.toLowerCase().includes("ceja") ||
                  unlockedProject?.name?.toLowerCase().includes("ceja");

                const defaultHooksList = isManicurista
                  ? [
                      {
                        title:
                          "¿Sabías que dominar la técnica de uñas rusas es el camino más rápido para pasar de cobrar $10 a $50 por servicio?",
                        psychologicalStrategy:
                          "Conecta con el deseo de aumentar drásticamente los ingresos ofreciendo un servicio de alta especialización y precisión.",
                        contentJson: {
                          script:
                            "Gana más tiempo con tu familia y aumenta tus ingresos aprendiendo el sistema definitivo de manicura rusa.\nEs la técnica más demandada en los salones premium.\n\nPodrás agendar clientes de alto valor dispuestas a pagar tarifas de lujo.\n\nEscribe MANICURA en los comentarios y ingresa al link de nuestra biografía para registrarte en la masterclass gratis de hoy.",
                          ads: "🔥 ¿Sabías que dominar la técnica de uñas rusas es el camino más rápido para pasar de cobrar $10 a $50 por servicio?\n\nHe preparado una sesión en vivo donde te mostraré las bases paso a paso para profesionalizarte. 👇\n\n🔗 [LINK DE TU LANDING]",
                          thumbs: [
                            "Domina Uñas Rusas 💅",
                            "De Cobrar $10 a $50 💸",
                            "Preparación Profesional 🧪",
                          ],
                        },
                      },
                      {
                        title:
                          "El error secreto de las manicuristas novatas que arruina el set en 3 días y ahuyenta a las mejores clientas.",
                        psychologicalStrategy:
                          "Apela al temor de dar un mal servicio y perder clientes recurrentes por falta de conocimientos de adherencia.",
                        contentJson: {
                          script:
                            "Evita el desprendimiento prematuro con una preparación impecable de la placa de uña.\nLa mayoría usa limas inadecuadas o productos sin nivelar.\n\nAprende a sellar perfectamente la zona de cutícula para que tus sets duren más de 4 semanas intactos.\n\nEntra en el link de nuestro perfil para unirte a la masterclass gratuita de hoy.",
                          ads: "💅 ¿Estás cansada de que tus clientas se quejen de que sus uñas se rompen a los 3 días?\n\nTe enseño la preparación científica para evitar desprendimientos. Inscríbete a la masterclass sin costo hoy. 👇\n\n🔗 [LINK DE TU LANDING]",
                          thumbs: [
                            "¿Uñas Rotas a los 3 Días? ⚠️",
                            "El Error que Nadie Te Cuenta 🤫",
                            "Preparación Profesional 🧪",
                          ],
                        },
                      },
                      {
                        title:
                          "Cómo construir una agenda llena de clientas premium dispuestas a pagar tarifas de lujo por tus diseños avanzados.",
                        psychologicalStrategy:
                          "Estimula la visualización de libertad de negocio y atracción de personas que respetan y valoran las tarifas de arte.",
                        contentJson: {
                          script:
                            "Deja de competir por precio publicando fotos genéricas.\nLas mejores clientas buscan atención impecable y arte personalizado sobre la uña.\n\nDescubre el método de posicionamiento en redes sociales para atraer clientas de calidad.\n\nHaz clic en el enlace del perfil para registrarte hoy.",
                          ads: "🚀 Deja de rebajar tus precios para competir con salones masivos. Las clientas VIP pagan por arte y durabilidad.\n\nÚnete a nuestro taller gratuito donde te revelamos la ruta completa. 👇\n\n🔗 [LINK DE TU LANDING]",
                          thumbs: [
                            "Agenda Llena VIP 📅",
                            "Deja de Competir por Precio 💸",
                            "Sube Tus Tarifas Hoy 🌟",
                          ],
                        },
                      },
                    ]
                  : isMicroblading
                    ? [
                        {
                          title:
                            "¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de microblading de cejas?",
                          psychologicalStrategy:
                            "Conecta con el deseo de seguridad financiera inmediata y falta de riesgo en el nicho de cejas de alto ticket.",
                          contentJson: {
                            script:
                              "Aprende la técnica de microblading con el diseño hiperrealista más demandado del mercado.\nEs el servicio estético más rentable hoy en día.\n\nRecuperas tu inversión de materiales con tan solo tus primeras 2 o 3 clientas.\n\nEscribe CEJAS en los comentarios y entra al link en nuestro perfil para asegurar tu cupo gratis hoy mismo.",
                            ads: "🔥 ¿Te gustaría generar $1.000 extras al mes sin dejar tu trabajo actual?\n\nHe preparado una Masterclass gratuita donde te revelo el mapa exacto para lograr los mejores trazos. 👇\n\n🔗 [LINK DE TU LANDING]",
                            thumbs: [
                              "Triplica Tus Ingresos 💰",
                              "Técnica Hiperrealista Cejas 👩‍🎤",
                              "Recupera Inversión Rápido 📈",
                            ],
                          },
                        },
                        {
                          title:
                            "El secreto del diseño de miradas perfectas: El error que comete el 90% de las principiantes al trazar cejas.",
                          psychologicalStrategy:
                            "Apela al deseo de perfección técnica y el miedo a cometer errores estéticos faciales graves irreversibles.",
                          contentJson: {
                            script:
                              "Un trazo incorrecto puede desfigurar la expresión facial de tu clienta por meses.\nEl gran error es no usar el punto de anclaje correcto o presionar demasiado el inductor.\n\nDomina el visajismo simétrico antes de iniciar cualquier sesión real.\n\nÚnete a la capacitación en vivo gratis haciendo clic en nuestro enlace.",
                            ads: "🤫 El diseño facial requiere precisión milimétrica. Conoce el error que arruina el visajismo.\n\nAccede gratis a la lección en vivo de hoy aquí 👇\n\n🔗 [LINK DE TU LANDING]",
                            thumbs: [
                              "El Error de Trazado de Cejas ❌",
                              "Diseño Visajista Simétrico 📐",
                              "Trazos más Naturales ✨",
                            ],
                          },
                        },
                        {
                          title:
                            "La estrategia exacta de las artistas de microblading top para atraer clientas de alto valor sin competir por precio.",
                          psychologicalStrategy:
                            "Posicionamiento de marca y confianza para cobrar montos premium por encima del promedio del mercado.",
                          contentJson: {
                            script:
                              "Las profesionales exitosas no venden microblading, venden seguridad y rejuvenecimiento.\nEstablece tu autoridad con una consulta inicial especializada de alto valor percibido.\n\nDescubre el paso a paso terapéutico para conectar con tus prospectos.\n\nRegístrate ahora mismo a través del link en nuestro perfil.",
                            ads: "💎 Deja de regalar tu trabajo como si fuera un sticker. El microblading premium cura autoestima.\n\nTe enseño los secretos de venta estéticos de élite. Haz clic para unirte gratis. 👇\n\n🔗 [LINK DE TU LANDING]",
                            thumbs: [
                              "Clientes que pagan de verdad 💳",
                              "Vende Autoestima, no Cejas 💖",
                              "Secretos de Venta de Élite Directa 🚀",
                            ],
                          },
                        },
                      ]
                    : [
                        {
                          title:
                            "¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de belleza de alta demanda?",
                          psychologicalStrategy:
                            "Estimula el interés sobre el nicho de belleza enseñando rentabilidad y escalabilidad de servicios únicos.",
                          contentJson: {
                            script:
                              "El campo estético es el más resistente a las crisis globales.\nDomina una destreza puntual y cobra tres veces más por cada hora de servicio.\n\nToma el control de tu agenda y de tu facturación mensual de inmediato.\n\nEscribe BELLEZA e ingresa al link del perfil para apartar tu lugar en la sesión en vivo.",
                            ads: "💅 ¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de belleza de alta demanda?\n\nTe daremos el mapa exacto de negocio en la clase gratuita de hoy. 👇\n\n🔗 [LINK DE TU LANDING]",
                            thumbs: [
                              "Triplica tus Ingresos 💸",
                              "Belleza de Alta Demanda 🌟",
                              "Controla Tu Tiempo Mañana ⏰",
                            ],
                          },
                        },
                        {
                          title:
                            "El gran mito de la belleza revelado: Por qué las fórmulas tradicionales ya no funcionan y cómo solucionarlo hoy.",
                          psychologicalStrategy:
                            "Destruye falsas creencias tradicionales instalando la necesidad de adquirir metodologías modernas aceleradas.",
                          contentJson: {
                            script:
                              "No necesitas años de estudios teóricos para dar excelentes resultados.\nLas técnicas modernas buscan personalización y biomasa amigable.\n\nRegístrate gratis a la sesión práctica haciendo clic en nuestro perfil.",
                            ads: "🤫 Las escuelas tradicionales te ocultan que las técnicas modernas redujeron los tiempos de aprendizaje al 20%.\n\nDescubre cómo adaptarte al mercado digital ahora mismo aquí 👇\n\n🔗 [LINK DE TU LANDING]",
                            thumbs: [
                              "El Mito del Aprendizaje Lento ❌",
                              "Fórmulas Únicas Modernas ✨",
                              "Resultados en Tiempo Récord ⚡",
                            ],
                          },
                        },
                        {
                          title:
                            "La fórmula exacta que usan los líderes y salones de alta gama para cobrar 5 veces más sin perder un solo cliente.",
                          psychologicalStrategy:
                            "Apela a la exclusividad, estatus y escalamiento de margen con clientes que pagan de verdad.",
                          contentJson: {
                            script:
                              "Los salones de lujo fijan la tarifa según la experiencia, no la hora.\nEstablece protocolos de atención únicos que fidelicen al cliente desde el saludo.\n\nConoce este sistema gratis ingresando al enlace de nuestro perfil hoy.",
                            ads: "🚀 ¿Cómo cobran los salones más caros del mundo?\n\nNo es el material, es la experiencia presencial guiada por protocolo. Te lo enseñamos paso a paso. 👇\n\n🔗 [LINK DE TU LANDING]",
                            thumbs: [
                              "Cobra 5 Veces Más 💰",
                              "Secretos de Salones Premium 💎",
                              "Fidelización de Clientes VIP 👑",
                            ],
                          },
                        },
                      ];

                const displayHooks =
                  unlockedHooks.length > 0
                    ? unlockedHooks
                    : strategyData?.modules?.hooks || [];
                const hooksToRender =
                  displayHooks.length >= 3
                    ? displayHooks.slice(0, 3)
                    : defaultHooksList;

                return (
                  <div
                    className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full"
                    id="hooks-of-attraction-card"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>

                    {/* Left Column: The Context and the Value */}
                    <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                            Video Hooks de Atracción
                          </h3>
                        </div>

                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                          Tus videos no venden porque la gente sigue haciendo
                          scroll.
                        </p>

                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                          Hemos redactado los guiones exactos que retienen la
                          atención en los primeros 3 segundos y envían a los
                          curiosos directo a tu embudo de ventas.
                        </p>
                      </div>

                      {/* Bullets explaining benefits */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-2.5">
                          <span className="text-sm md:text-base mt-1 shrink-0">
                            🎯
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Ganchos que atrapan:
                            </strong>{" "}
                            <span className="text-white">
                              Diseñados psicológicamente para que tu cliente
                              ideal no pueda dejar de mirar.
                            </span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-sm md:text-base mt-1 shrink-0">
                            ⚡
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Llamados a la Acción (CTA) invisibles:
                            </strong>{" "}
                            <span className="text-white">
                              Transiciones naturales que obligan a tu audiencia
                              a escribirte por WhatsApp sin sentir que les estás
                              vendiendo.
                            </span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-sm md:text-base mt-1 shrink-0">
                            💎
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Estructura Viral:
                            </strong>{" "}
                            <span className="text-white">
                              Secuencias probadas que multiplican la retención,
                              los comentarios y el alcance orgánico.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Resource Cards & Links */}
                    <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                      <p className="text-xs font-extrabold text-[#FF5A1F] uppercase tracking-wider text-left mb-1 flex items-center gap-1.5 font-sans">
                        <span>👇</span> Aquí tienes 3 guiones de prueba
                        generados para tu negocio. Haz clic para leerlos.
                      </p>
                      <div
                        className="grid grid-cols-1 gap-3 w-full"
                        id="hooks-three-cards-grid"
                      >
                        {hooksToRender
                          .slice(0, 3)
                          .map((hook: any, hIdx: number) => {
                            const hookTitleStr =
                              hook.title ||
                              hook.hookText ||
                              hook.text ||
                              hook.question ||
                              `Video Hook #${hIdx + 1}`;
                            return (
                              <div
                                key={hIdx}
                                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)] text-left animate-fade-in"
                              >
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                  {/* Clean White Desk Calendar Sheet */}
                                  <div className="w-12 h-12 rounded-xl bg-white border border-white/10 flex flex-col overflow-hidden shrink-0 mt-1 shadow-md">
                                    {/* Calendar Top binder/header bar in orange */}
                                    <div className="bg-[#FF5A1F] text-[8px] font-black text-center text-white py-0.5 uppercase tracking-wider font-sans leading-none select-none">
                                      Día
                                    </div>
                                    {/* Calendar Day number */}
                                    <div className="flex-1 flex items-center justify-center bg-white text-zinc-950 font-black text-base leading-none font-sans select-none">
                                      {hIdx + 1}
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h4
                                      onClick={() => {
                                        setSelectedHookForDrawer(hook);
                                        setActiveDetailsDrawer("hooks");
                                      }}
                                      className="text-base md:text-lg font-normal text-white group-hover:text-[#FF5A1F] transition-colors text-left font-sans line-clamp-3 leading-relaxed mt-0.5 cursor-pointer hover:underline"
                                    >
                                      {hookTitleStr}
                                    </h4>
                                  </div>
                                </div>
                                <div className="shrink-0 font-sans">
                                  <button
                                    onClick={() => {
                                      setSelectedHookForDrawer(hook);
                                      setActiveDetailsDrawer("hooks");
                                    }}
                                    className="px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 font-sans active:scale-95"
                                  >
                                    Ver detalles
                                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* Plan Pro Block: 27 Pending Hooks */}
                      <div className="mt-4 bg-gradient-to-br from-[#FFBF00]/10 via-[#FF5A1F]/5 to-transparent border border-[#FFBF00]/20 rounded-2xl flex flex-col text-left overflow-hidden w-full animate-fade-in">
                        <div className="p-6 pb-4 space-y-3">
                          <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-wide font-sans leading-tight">
                            3 VÍDEOS LLAMAN LA ATENCIÓN. PERO{" "}
                            <span className="text-[#FF5A1F] drop-shadow-[0_0_8px_rgba(255,90,31,0.4)]">
                              LA CONSTANCIA
                            </span>{" "}
                            ES LO QUE PAGA LAS FACTURAS.
                          </h4>
                          <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed font-normal tracking-wide">
                            Un par de vídeos buenos no hacen un negocio. La
                            confianza (y el dinero) se generan publicando a
                            diario. Actualiza al Plan PRO, y recibe los 27
                            videos que te faltan para un mes entero de
                            visibilidad sin tener que pensar qué publicar hoy.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black uppercase text-xs md:text-sm tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.99] border-t border-[#FF5A1F]/20 rounded-b-2xl shadow-[0_4px_20px_rgba(255,90,31,0.22)] shrink-0"
                        >
                          <Crown className="w-4 h-4 text-white shrink-0" />
                          👑 DESBLOQUEAR MI MES COMPLETO
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Card 4: Artículos de Blog */}
              {(() => {
                const defaultBlogsList = [
                  {
                    title:
                      "Guía Definitiva de Autocuidado Diario: 7 Hábitos para Lucir una Piel Radiante y Saludable",
                    introduction:
                      "El verdadero secreto de una piel luminosa no reside en milagros de un solo día, sino en el poder de la consistencia. En esta guía completa de autocuidado, te enseñamos los pilares fundamentales para nutrir, proteger y revitalizar tu piel de forma natural y duradera.",
                    seoStructure: {
                      h1: "Guía Definitiva de Autocuidado Diario: Cómo lograr una piel radiante desde casa",
                      headings: [
                        {
                          type: "h2",
                          text: "La importancia de una rutina diaria adaptada a tu tipo de piel",
                        },
                        {
                          type: "h2",
                          text: "Los 3 pasos esenciales: Limpieza profunda, hidratación y protección solar",
                        },
                        {
                          type: "h3",
                          text: "Cómo elegir el limpiador facial adecuado según tu cutis",
                        },
                        {
                          type: "h3",
                          text: "El rol del protector solar en la prevención del envejecimiento prematuro",
                        },
                        {
                          type: "h3",
                          text: "Hábitos saludables de hidratación y nutrición celular",
                        },
                      ],
                      keywords:
                        "autocuidado de la piel, rutina de skincare diaria, piel radiante paso a paso, hábitos de belleza saludables",
                      cta: "Descubre el kit ideal para tu tipo de piel. Regístrate gratis y obtén una asesoría personalizada hoy mismo.",
                    },
                  },
                  {
                    title:
                      "Los 5 Errores Comunes de Skincare que están Dañando tu Barrera Cutánea Sin que lo Sepas",
                    introduction:
                      "A veces, el exceso de cuidado puede resultar contraproducente o irritante. Te revelamos cuáles son los errores más comunes al combinar activos y aplicar tratamientos que podrían estar afectando tu dermis de forma invisible.",
                    seoStructure: {
                      h1: "Los fallos típicos en tu rutina de belleza que debes corregir de inmediato",
                      headings: [
                        {
                          type: "h2",
                          text: "Qué es la barrera cutánea y por qué es vital mantenerla sana",
                        },
                        {
                          type: "h2",
                          text: "Los errores más frecuentes en la exfoliación y lavado excesivo",
                        },
                        {
                          type: "h3",
                          text: "Mezclas peligrosas de ácidos y activos incompatibles (ej. retinol y vitamina C)",
                        },
                        {
                          type: "h3",
                          text: "Usar productos inadecuados para tu fototipo de piel",
                        },
                        {
                          type: "h3",
                          text: "Cómo restaurar tu barrera protectora en sencillos pasos",
                        },
                      ],
                      keywords:
                        "errores de skincare, restaurar barrera cutánea, exfoliación segura, combinación de retinol y vitamina c",
                      cta: "Aprende a cuidar tu piel como una profesional. Únete a nuestro taller online gratuito haciendo clic aquí.",
                    },
                  },
                  {
                    title:
                      "Secretos de Cabina: Cómo Elegir el Tratamiento Facial Perfecto Según tu Tipo de Piel",
                    introduction:
                      "Entrar a un centro de estética puede ser abrumador frente a una carta de servicios tan variada. Aprende a descifrar las verdaderas necesidades de tu rostro y a elegir el procedimiento profesional óptimo para ti.",
                    seoStructure: {
                      h1: "Cómo seleccionar el tratamiento de cabina ideal para tu rostro",
                      headings: [
                        {
                          type: "h2",
                          text: "Diferencia entre limpieza facial profunda, hidratación y revitalización médica",
                        },
                        {
                          type: "h2",
                          text: "El diagnóstico estético personalizado como punto de partida clave",
                        },
                        {
                          type: "h3",
                          text: "Tratamientos ideales para pieles grasas o con tendencia acnéica",
                        },
                        {
                          type: "h3",
                          text: "La revolución del rejuvenecimiento y nutrición para pieles maduras",
                        },
                        {
                          type: "h3",
                          text: "Qué esperar durante y después de tu procedimiento profesional",
                        },
                      ],
                      keywords:
                        "tratamiento facial profesional, limpieza de cutis estética, elegir spa facial, rejuvenecimiento cabina",
                      cta: "Agenda hoy mismo tu cita de valoración sin costo y descubre el tratamiento ideal para tu piel.",
                    },
                  },
                ];

                const blogsToRender = defaultBlogsList.slice(0, 3);

                return (
                  <div
                    className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FFBF00]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full"
                    id="seo-blog-articles-card"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>

                    {/* Left Column: The Context and the Value */}
                    <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                            Artículos de Blog
                          </h3>
                        </div>

                        <p className="text-base md:text-lg text-left text-white font-bold font-sans leading-relaxed pt-1 tracking-wide">
                          Dejar de depender de los anuncios de pago para vender.
                          Ese es el objetivo.
                        </p>

                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans opacity-100 font-normal tracking-wide">
                          Tener una web sin visitas es como tener un negocio en
                          medio del desierto. Hemos redactado artículos
                          estratégicos listos para que Google los encuentre, te
                          envíe tráfico gratuito a diario y conviertas a esos
                          lectores en clientes.
                        </p>
                      </div>

                      {/* Bullets explaining benefits */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0">
                            🎯
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Tráfico que quiere comprar:
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Textos diseñados para aparecer justo cuando tu
                              cliente ideal busca una solución en Google, con la
                              tarjeta en la mano.
                            </span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0">
                            📈
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              A Google le vas a encantar:
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Olvídate de configuraciones técnicas aburridas.
                              Entregamos la estructura exacta que el algoritmo
                              premia con los primeros lugares.
                            </span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0">
                            💸
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Venta Silenciosa:
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Cada artículo incluye ganchos psicológicos que
                              llevan al lector de la mano hasta tu botón de
                              compra sin que sientan que les estás vendiendo.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Resource Cards & Links */}
                    <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                      <p className="text-xs font-extrabold text-[#FFBF00] uppercase tracking-wider text-left mb-1 flex items-center gap-1.5 font-sans">
                        <span>👇</span> Haz clic para ver todos los detalles del
                        artículo SEO
                      </p>
                      <div
                        className="grid grid-cols-1 gap-3 w-full"
                        id="blogs-three-cards-grid"
                      >
                        {blogsToRender.map((blog: any, bIdx: number) => {
                          const blogTitleStr = blog.title;
                          return (
                            <div
                              key={bIdx}
                              className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FFBF00]/30 rounded-2xl gap-4 transition-all duration-300 group shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,191,0,0.08)] text-left animate-fade-in"
                            >
                              <div className="flex items-start gap-4 flex-1 min-w-0">
                                {/* Clean White Desk Calendar Sheet */}
                                <div className="w-12 h-12 rounded-xl bg-white border border-white/10 flex flex-col overflow-hidden shrink-0 mt-1 shadow-md">
                                  {/* Calendar Top binder/header bar in gold */}
                                  <div className="bg-[#FFBF00] text-[8px] font-black text-center text-zinc-950 py-0.5 uppercase tracking-wider font-sans leading-none select-none">
                                    Post
                                  </div>
                                  {/* Calendar Day number */}
                                  <div className="flex-1 flex items-center justify-center bg-white text-zinc-950 font-black text-base leading-none font-sans select-none">
                                    {bIdx + 1}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4
                                    onClick={() => {
                                      setSelectedBlogForDrawer(blog);
                                      setActiveDetailsDrawer("blog");
                                    }}
                                    className="text-base md:text-lg font-normal text-white group-hover:text-[#FFBF00] transition-colors text-left font-sans line-clamp-3 leading-relaxed mt-0.5 cursor-pointer hover:underline"
                                  >
                                    {blogTitleStr}
                                  </h4>
                                </div>
                              </div>
                              <div className="shrink-0 font-sans">
                                <button
                                  onClick={() => {
                                    setSelectedBlogForDrawer(blog);
                                    setActiveDetailsDrawer("blog");
                                  }}
                                  className="px-4 py-2 bg-transparent border border-[#FFBF00]/40 group-hover:border-[#FFBF00] text-white group-hover:text-zinc-950 group-hover:bg-[#FFBF00] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 font-sans active:scale-95"
                                >
                                  Ver detalles
                                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Plan Pro Block: 27 Pending Articles */}
                      <div className="mt-4 bg-gradient-to-br from-[#FFBF00]/10 via-[#FF5A1F]/5 to-transparent border border-[#FFBF00]/20 rounded-2xl flex flex-col text-left overflow-hidden w-full animate-fade-in">
                        <div className="p-6 pb-4 space-y-3">
                          <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-wide font-sans leading-tight">
                            15 ARTÍCULOS AL MES. TU BLOG LISTO Y FUNCIONANDO EN{" "}
                            <span className="text-[#FF5A1F] drop-shadow-[0_0_8px_rgba(255,90,31,0.4)]">
                              PILOTO AUTOMÁTICO
                            </span>
                          </h4>

                          <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed font-normal tracking-wide">
                            Olvídate de instalar WordPress, pelear con plugins o
                            perder horas copiando y pegando textos. El sistema
                            crea tu propio blog integrado en tu página y te
                            entrega 15 artículos mensuales (uno cada dos días)
                            listos para atraer visitas. Activa tu plan PRO,
                            enciende tu máquina de tráfico gratuito y deja que
                            Google te consiga los clientes.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black uppercase text-xs md:text-sm tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.99] border-t border-[#FF5A1F]/20 rounded-b-2xl shadow-[0_4px_20px_rgba(255,90,31,0.22)] shrink-0"
                        >
                          <Crown className="w-4 h-4 text-white shrink-0" />
                          DESBLOQUEAR 15 ARTICULOS ESTE MES
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Card 5: EMAIL MARKETING AUTOMATIZADO */}
              {(() => {
                const defaultEmailsList = [
                  {
                    title: "Email 1: Bienvenida e Historia de Conexión Emocional",
                    introduction: "Consigue la primera impresión perfecta de forma automática y asienta tu autoridad desde el primer segundo. Rompe el hielo compartiendo tu misión de manera cercana y empática con tus nuevos suscriptores.",
                    structure: {
                      subject: "¡Bienvenida a [Nombre/Marca]! Consigue una piel luminosa sin milagros de un día",
                      focus: "Establecer autoridad, empatía, misión de marca y entregar incentivo de bienvenida.",
                      sections: [
                        { type: "Asunto Principal", text: "¡Bienvenida a [Nombre/Marca]! Consigue una piel luminosa sin milagros de un día" },
                        { type: "Gancho Inicial", text: "La mayoría de productos prometen milagros en 24 horas. La realidad es muy distinta (y dolorosa)." },
                        { type: "Historia de Dolor", text: "Yo también pasé años batallando con brotes y resequedad, gastando una fortuna en tónicos inútiles." },
                        { type: "El Descubrimiento", text: "Hasta que comprendí que una barrera cutánea sana vale más que cualquier activo químico abrasivo." },
                        { type: "CTA Suave", text: "Para ayudarte a empezar bien, te he preparado un mini-guía secreta. Haz clic aquí para verla." }
                      ],
                      tips: "Mantén un tono de tú a tú, sincero y honesto, alejado de la típica prosa corporativa fría.",
                      cta: "Descarga tu regalo de bienvenida exclusivo en formato PDF aquí."
                    }
                  },
                  {
                    title: "Email 2: El Secreto Técnico de Skincare Educativo",
                    introduction: "Demuestra tu experiencia clínica de forma didáctica. Desmonta mitos típicos de la industria y entrega valor puro para que tus suscriptores te reconozcan como la única autoridad en quien confiar.",
                    structure: {
                      subject: "Los 2 ingredientes que NUNCA debes mezclar (y los 3 que salvan tu piel)",
                      focus: "Aportar valor educativo masivo, posicionarte como experto técnico y derribar mitos comunes.",
                      sections: [
                        { type: "Asunto Principal", text: "Los 2 ingredientes que NUNCA debes mezclar (y los 3 que salvan tu piel)" },
                        { type: "Gancho Inicial", text: "Ojo: mezclar retinol y vitamina C en la misma aplicación puede destruir tu barrera protectora." },
                        { type: "La Explicación", text: "El pH de la vitamina C es muy ácido (3.5), mientras que el retinol requiere de un pH más neutro (5.5). Se anulan entre sí." },
                        { type: "La Solución Perfecta", text: "Usa vitamina C por la mañana para proteger del sol, y retinol por la noche para regenerar las células." },
                        { type: "CTA de Autoridad", text: "¿Quieres saber cuál es la rutina exacta libre de incompatibilidades para ti? Pulsa aquí abajo." }
                      ],
                      tips: "La educación genera reciprocidad. No intentes vender de forma agresiva en este correo.",
                      cta: "Consulta nuestra tabla interactiva de compatibilidad de activos sin costo aquí."
                    }
                  },
                  {
                    title: "Email 3: La Transición a la Oferta Irresistible",
                    introduction: "Presenta tu solución principal de manera natural. Conecta el problema educativo tratado en los emails de valor con tu producto o servicio para cosechar ventas orgánicas sin presión agresiva.",
                    structure: {
                      subject: "Tu piel se merece esto (Regalo interior de bienvenida incluido)",
                      focus: "Transición lógica del valor del email anterior hacia la oferta exclusiva del kit de tratamiento personalizado.",
                      sections: [
                        { type: "Asunto Principal", text: "Tu piel se merece esto (Regalo interior de bienvenida incluido)" },
                        { type: "Gancho Inicial", text: "Después de ver lo que destruye tu piel, hablemos de lo que verdaderamente la reconstruye y protege." },
                        { type: "Atribución", text: "Hemos diseñado una solución integral que equilibra el pH e hidrata de forma transdérmica." },
                        { type: "Oferta Beneficiosa", text: "Solo por ser parte de esta newsletter, tienes acceso prioritario con un 15% de descuento especial." },
                        { type: "Garantía", text: "Nuestra garantía te protege: si en 14 días no notas más luz, te devolvemos tu dinero de inmediato." }
                      ],
                      tips: "Incluye testimonios breves o una prueba de garantía blindada para disipar el miedo al riesgo del cliente.",
                      cta: "Haz clic aquí para reclamar tu Kit Personalizado con un 15% de Descuento de Bienvenida."
                    }
                  }
                ];

                const emailsToRender = defaultEmailsList.slice(0, 3);

                return (
                  <div
                    className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-blue-500/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full"
                    id="email-marketing-nutrition-card"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>

                    {/* Left Column: The Context and the Value */}
                    <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                            EMAIL MARKETING AUTOMATIZADO
                          </h3>
                        </div>

                        <p className="text-base md:text-lg text-left text-white font-bold font-sans leading-relaxed pt-1 tracking-wide">
                          Vender en piloto automático mientras duermes. Ese es el verdadero apalancamiento.
                        </p>

                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans opacity-100 font-normal tracking-wide">
                          Conseguir el email del prospecto es solo el primer paso. Si no les escribes de inmediato, se enfrían y le compran a tu competencia.
                        </p>
                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans opacity-100 font-normal tracking-wide font-bold">
                          Hemos configurado un sistema de doble impacto que persigue la venta por ti:
                        </p>
                      </div>

                      {/* Bullets explaining benefits */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0 bg-blue-500/10 p-1.5 rounded-lg text-blue-400">
                            ⚡
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Secuencia de Conversión (7 Días):
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Correos de venta directa y agresiva diseñados para derribar objeciones y cerrar a los indecisos en su primera semana.
                            </span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0 bg-blue-500/10 p-1.5 rounded-lg text-blue-400">
                            🌱
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Secuencia de Nutrición Continua:
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Correos automáticos que envían tus artículos de blog y contenido de valor para que los que no compraron hoy, te compren el mes que viene.
                            </span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0 bg-blue-500/10 p-1.5 rounded-lg text-blue-400">
                            🛒
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Recuperación de Carritos:
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Gatillos mentales que persiguen a los que estuvieron a un clic de pagar y los traen de vuelta a la pasarela.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Resource Cards & Links */}
                    <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                      <p className="text-xs font-extrabold text-[#3b82f6] uppercase tracking-wider text-left mb-1 flex items-center gap-1.5 font-sans">
                        <span>👇</span> Haz clic para ver todos los detalles de tu Email Marketing
                      </p>
                      <div className="grid grid-cols-1 gap-3 w-full">
                        {emailsToRender.map((email: any, eIdx: number) => {
                          const emailTitleStr = email.title;
                          return (
                            <div
                              key={eIdx}
                              className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-blue-500/30 rounded-2xl gap-4 transition-all duration-300 group shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.08)] text-left"
                            >
                              <div className="flex items-start gap-4 flex-1 min-w-0">
                                {/* Digital Mail Envelope style */}
                                <div className="w-12 h-12 rounded-xl bg-white border border-white/10 flex flex-col overflow-hidden shrink-0 mt-1 shadow-md">
                                  <div className="bg-blue-500 text-[8px] font-black text-center text-white py-0.5 uppercase tracking-wider font-sans leading-none select-none">
                                    Email
                                  </div>
                                  <div className="flex-1 flex items-center justify-center bg-white text-zinc-950 font-black text-base leading-none font-sans select-none">
                                    {eIdx + 1}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4
                                    onClick={() => {
                                      setSelectedEmailForDrawer(email);
                                      setActiveDetailsDrawer("email");
                                    }}
                                    className="text-base md:text-lg font-normal text-white group-hover:text-blue-400 transition-colors text-left font-sans line-clamp-3 leading-relaxed mt-0.5 cursor-pointer hover:underline"
                                  >
                                    {emailTitleStr}
                                  </h4>
                                </div>
                              </div>
                              <div className="shrink-0 font-sans">
                                <button
                                  onClick={() => {
                                    setSelectedEmailForDrawer(email);
                                    setActiveDetailsDrawer("email");
                                  }}
                                  className="px-4 py-2 bg-transparent border border-blue-500/40 group-hover:border-blue-500 text-white group-hover:text-zinc-950 group-hover:bg-blue-500 text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 font-sans active:scale-95"
                                >
                                  Ver detalles
                                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Plan Pro Block: Emails Pending */}
                      <div className="mt-4 bg-gradient-to-br from-[#3b82f6]/10 via-[#FF5A1F]/5 to-transparent border border-[#3b82f6]/20 rounded-2xl flex flex-col text-left overflow-hidden w-full animate-fade-in">
                        <div className="p-6 pb-4 space-y-3">
                          <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-wide font-sans leading-tight">
                            EL 80% DE TUS VISITAS SE IRÁ SIN COMPRAR. PERSÍGUELOS EN PILOTO AUTOMÁTICO.
                          </h4>

                          <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed font-normal tracking-wide">
                            Olvídate de configurar costosas plataformas de email, lidiar con integraciones o romperte la cabeza redactando correos persuasivos. Ponemos en marcha tu secuencia inteligente de correos electrónicos de nutrición y entrega para que captes y calientes tus prospectos de forma 100% automatizada. Activa tu plan PRO, enciende tu máquina de conversión y deja que el poder del correo electrónico te consiga las ventas.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black uppercase text-xs md:text-sm tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.99] border-t border-[#FF5A1F]/20 rounded-b-2xl shadow-[0_4px_20px_rgba(255,90,31,0.22)] shrink-0"
                        >
                          <Crown className="w-4 h-4 text-white shrink-0" />
                          DESBLOQUEAR TU SECUENCIA DE EMAIL PRO
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Card 6: Secuencia de Lanzamientos WhatsApp */}
              {(() => {
                const defaultWhatsappList = [
                  {
                    title: "Mensaje 1 (48h Antes) - El Disparador de Calentamiento",
                    introduction: "Genera expectación extrema en tus prospectos de WhatsApp. Envía este mensaje estratégico 48 horas antes del lanzamiento para crear intriga, anticipar los beneficios de la oferta y encender las alarmas de deseo.",
                    structure: {
                      title: "Mensaje 1: Calentamiento & Intriga (48 Horas Antes)",
                      focus: "Despertar curiosidad, presentar la gran revelación por venir y preparar el terreno del lanzamiento.",
                      sections: [
                        { type: "Gancho Principal", text: "🚨 ALERTA SKINCARE: Solo unas pocas personas saben cómo rejuvenecer la piel un 40% más rápido en casa. Y no tiene nada que ver con cremas milagrosas. En 48 horas cambiaremos el juego." },
                        { type: "El Problema de Fondo", text: "El mercado está lleno de remedios de botica que obstruyen tus poros. Hemos estado investigando en secreto con expertos de laboratorio..." },
                        { type: "Anticipación", text: "Estamos ultimando los detalles del Kit Revelación Definitivo. Las plazas del grupo selecto tendrán un beneficio gigante." },
                        { type: "Llamado a la Acción", text: "Mantén las notificaciones del grupo activadas. Pasado mañana abriremos el acceso prioritario al grupo VIP. No querrás perderte esto. 👇" }
                      ],
                      tips: "Utiliza emojis de forma estratégica para dinamizar la lectura, pero sin abusar de ellos para mantener la seriedad y elegancia.",
                      cta: "Asegúrate de tener este grupo activo para ser el primero en enterarte."
                    }
                  },
                  {
                    title: "Mensaje 2 (Día 1) - Apertura Oficial & Bonos VIP",
                    introduction: "El momento de la venta masiva. Presenta tu oferta irresistible e incentiva la acción inmediata de tus contactos apelando al sesgo de gratificación veloz y limitación severa de las piezas con bonos exclusivos.",
                    structure: {
                      title: "Mensaje 2: Apertura de Puertas / Lanzamiento Oficial (Día 1)",
                      focus: "Lanzar oficialmente el Kit, detallar el beneficio único, los bonos rápidos y habilitar el botón de pago.",
                      sections: [
                        { type: "Gran Titular", text: "💥 ¡OFICIALMENTE ABIERTO! Consigue el Kit de Reconstrucción de la Barrera Cutánea hoy." },
                        { type: "Qué incluye", text: "✔ Jabón Balanceador + ✔ Regenerador Transdérmico + ✔ Protector Mineral No Comedogénico + ✔ Regalo Sorpresa VIP" },
                        { type: "Bono de Velocidad", text: "🎁 REGALO EXTRA: A las primeras 15 personas que ordenen ahora les incluiremos una crema de contorno de ojos gratuita." },
                        { type: "Garantía", text: "Garantía clínica de 14 días. O de vuelta cada centavo de tu inversión." }
                      ],
                      tips: "El enlace de pago/reserva debe quedar extremadamente visible y fácil de copiar para acelerar la conversión móvil.",
                      cta: "👉 HAZ CLIC AQUÍ PARA COMPRAR TU KIT AHORA MISMO CON EL BONO VIP"
                    }
                  },
                  {
                    title: "Mensaje 3 (Día de Cierre) - Urgencia y FOMO de Últimas Horas",
                    introduction: "Activa el sesgo psicológico de aversión a la pérdida (FOMO). Informa del término del descuento inicial, la retirada del bono VIP gratuito y el cierre definitivo de puertas del carrito para captar de inmediato a los rezagados.",
                    structure: {
                      title: "Mensaje 3: Cierre de Carrito & Última Oportunidad",
                      focus: "Consolidar las ventas restantes utilizando la urgencia real del incremento de precio o de la pérdida de los bonos.",
                      sections: [
                        { type: "Urgencia Máxima", text: "⏳ ÚLTIMAS HORAS DISPONIBLES. En muy poco tiempo los bonos gratuitos y el 15% de descuento se desvanecerán para siempre." },
                        { type: "Recordatorio de Valor", text: "Tu piel merece lucir luminosa el resto del año. No dejes para mañana el cuidado que debiste iniciar hoy." },
                        { type: "Aviso de Retirada", text: "A medianoche cerramos oficialmente las órdenes de este lote especial. Los precios normales volverán a aplicarse." },
                        { type: "Llamado al Enlace", text: "Aún queda un pequeño cupo con el bono de contorno de ojos activo. Consigue el tuyo antes de que sea tarde. 👇" }
                      ],
                      tips: "La urgencia debe ser 100% honesta para mantener credibilidad duradera en el canal de comunicación.",
                      cta: "🚨 ÚLTIMA OPORTUNIDAD: TOCA AQUÍ PARA ADQUIRIR TU KIT ANTES DE LAS 23:59"
                    }
                  }
                ];

                const whatsappToRender = defaultWhatsappList.slice(0, 3);

                return (
                  <div
                    className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-emerald-500/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full"
                    id="whatsapp-launch-sequence-card"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>

                    {/* Left Column: The Context and the Value */}
                    <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                            Secuencias de WhatsApp
                          </h3>
                        </div>

                        <p className="text-base md:text-lg text-left text-white font-bold font-sans leading-relaxed pt-1 tracking-wide">
                          El canal más veloz y rentable para cerrar ventas directas. Esa es la conversión real.
                        </p>

                        <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans opacity-100 font-normal tracking-wide">
                          Guiones meticulosamente orquestados para despertar expectación máxima en tus listas o grupos de WhatsApp, calentar leads fríos mediante disparadores y abrir ventas de manera explosiva.
                        </p>
                      </div>

                      {/* Bullets explaining benefits */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0 bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
                            💬
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Disparadores de Deseo:
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Estructuras conversacionales naturales diseñadas para encender alarmas de curiosidad en las mentes de tus contactos de chat.
                            </span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0 bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
                            🚀
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              Aperturas de Venta Explosivas:
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Guiones con bonos rápidos de velocidad para acelerar la toma de decisiones y agotar stock en cuestión de minutos.
                            </span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg mt-1 shrink-0 bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
                            ⏳
                          </span>
                          <p className="text-base md:text-lg text-left text-white leading-relaxed font-sans font-normal tracking-wide">
                            <strong className="font-extrabold text-white">
                              FOMO y Escasez Real:
                            </strong>{" "}
                            <span className="text-white font-sans">
                              Notificaciones de cierre de carrito transparentes pero de alto impacto para captar de inmediato a los rezagados.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Resource Cards & Links */}
                    <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                      <p className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider text-left mb-1 flex items-center gap-1.5 font-sans">
                        <span>👇</span> Haz clic para ver todos los detalles de tu Secuencia de WhatsApp
                      </p>
                      <div className="grid grid-cols-1 gap-3 w-full">
                        {whatsappToRender.map((wa: any, waIdx: number) => {
                          const waTitleStr = wa.title;
                          return (
                            <div
                              key={waIdx}
                              className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-emerald-500/30 rounded-2xl gap-4 transition-all duration-300 group shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] text-left"
                            >
                              <div className="flex items-start gap-4 flex-1 min-w-0">
                                {/* Digital Mail Envelope style */}
                                <div className="w-12 h-12 rounded-xl bg-white border border-white/10 flex flex-col overflow-hidden shrink-0 mt-1 shadow-md">
                                  <div className="bg-emerald-500 text-[8px] font-black text-center text-white py-0.5 uppercase tracking-wider font-sans leading-none select-none">
                                    Chat
                                  </div>
                                  <div className="flex-1 flex items-center justify-center bg-white text-zinc-950 font-black text-base leading-none font-sans select-none">
                                    {waIdx + 1}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4
                                    onClick={() => {
                                      setSelectedWhatsappForDrawer(wa);
                                      setActiveDetailsDrawer("whatsapp");
                                    }}
                                    className="text-base md:text-lg font-normal text-white group-hover:text-emerald-400 transition-colors text-left font-sans line-clamp-3 leading-relaxed mt-0.5 cursor-pointer hover:underline"
                                  >
                                    {waTitleStr}
                                  </h4>
                                </div>
                              </div>
                              <div className="shrink-0 font-sans">
                                <button
                                  onClick={() => {
                                    setSelectedWhatsappForDrawer(wa);
                                    setActiveDetailsDrawer("whatsapp");
                                  }}
                                  className="px-4 py-2 bg-transparent border border-emerald-500/40 group-hover:border-emerald-500 text-white group-hover:text-zinc-950 group-hover:bg-emerald-500 text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 font-sans active:scale-95"
                                >
                                  Ver detalles
                                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Plan Pro Block: WhatsApp Pending */}
                      <div className="mt-4 bg-gradient-to-br from-emerald-500/10 via-[#FF5A1F]/5 to-transparent border border-emerald-500/20 rounded-2xl flex flex-col text-left overflow-hidden w-full animate-fade-in">
                        <div className="p-6 pb-4 space-y-3">
                          <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-wide font-sans leading-tight">
                            LANZAMIENTOS RÁPIDOS POR WHATSAPP. CONVIERTE TUS LISTAS EN UNA MÁQUINA DE VENTAS EN DIRECTO
                          </h4>

                          <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed font-normal tracking-wide">
                            Olvídate de crear eternas y frías secuencias de venta complejas. Creamos tus guiones exactos de calentamiento, expectación masiva, apertura de carrito y cierre con disparadores mentales para tus grupos o contactos de chat. Activa tu plan PRO, enciende la conversión directa número uno del mercado actual y duplica la rentabilidad de cada contacto conseguido.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black uppercase text-xs md:text-sm tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.99] border-t border-[#FF5A1F]/20 rounded-b-2xl shadow-[0_4px_20px_rgba(255,90,31,0.22)] shrink-0"
                        >
                          <Crown className="w-4 h-4 text-white shrink-0" />
                          DESBLOQUEAR TU SECUENCIA DE WHATSAPP PRO
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Final Central Call To Action Button to go to Dashboard */}
            <div className="flex flex-col items-center justify-center gap-4 border-t border-white/5 pt-12">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("force_wizard_step");
                  }
                  onComplete();
                }}
                className="px-12 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-base md:text-lg uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
              >
                Finalizar configuración ➔ Ir a mi Panel de Control
              </button>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Entrar al administrador completo de mi sistema
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* 1. BIENVENIDA */}
            <div
              ref={welcomeRef}
              className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
            >
              <WelcomeStep
                userData={user}
                onNext={() => {
                  setStep("selection");
                  scrollTo(selectionRef);
                }}
                disabled={!!strategyData}
              />
            </div>

            {/* 2. SELECCIÓN DE PROYECTO */}
            {revealedSections.includes("selection") && (
              <>
                <div
                  ref={selectionRef}
                  className="w-full max-w-[1400px] mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
                >
                  <ProjectSelectionStep
                    projects={projects}
                    loading={loadingProjects}
                    userData={user}
                    onNext={handleProjectSelection}
                    selectedProjectId={selectedProject?.id}
                    isLocked={!!strategyData}
                  />
                </div>

                {selectedProject && (
                  <motion.div
                    ref={unlockRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">
                        <CheckCircle className="w-4 h-4" />
                        Tu proyecto está listo para activarse
                      </div>
                    </div>

                    <UnlockProtocolStep
                      project={selectedProject}
                      userData={user}
                      onNext={() => setShowActivateConfirm(true)}
                      isStrategyGenerated={!!strategyData}
                      onBackToSelection={() => {
                        setSelectedProject(null);
                        setStep("selection");
                        setRevealedSections(["welcome", "selection"]);
                        scrollTo(selectionRef);
                      }}
                    />
                  </motion.div>
                )}
              </>
            )}

            {/* Modals de Confirmación */}
            <AnimatePresence>
              {showActivateConfirm && (
                <div
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in"
                  onClick={() => setShowActivateConfirm(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0B0B0B] border border-emerald-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden relative text-center"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <div className="p-10 space-y-8">
                      <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg">
                        <Zap className="w-10 h-10 fill-current" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">
                          ¿Estás seguro?
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                          ¿Estás seguro de que deseas desbloquear este proyecto
                          ahora mismo?
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={handleUnlockConfirm}
                          className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-95"
                        >
                          SÍ, DESBLOQUEAR AHORA
                        </button>
                        <button
                          onClick={() => setShowActivateConfirm(false)}
                          className="w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-all"
                        >
                          No, cancelar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {showCreateLandingConfirm && (
                <div
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in"
                  onClick={() => setShowCreateLandingConfirm(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0B0B0B] border border-[#FF5A1F]/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden relative text-center"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-500"></div>
                    <div className="p-10 space-y-8">
                      <div className="w-20 h-20 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-3xl flex items-center justify-center mx-auto border border-[#FF5A1F]/20 shadow-lg">
                        <Target className="w-10 h-10" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">
                          ¿Estás seguro?
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                          ¿Estás seguro de que deseas crear tu página de captura
                          ahora mismo?
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={handleCreateWeb}
                          className="w-full py-5 rounded-2xl bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-lg shadow-xl shadow-[#FF5A1F]/20 transition-all transform hover:scale-[1.02] active:scale-95"
                        >
                          SÍ, CREAR MI PÁGINA
                        </button>
                        <button
                          onClick={() => setShowCreateLandingConfirm(false)}
                          className="w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-all"
                        >
                          No, cancelar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* 3. GENERANDO ESTRATEGIA */}
            {revealedSections.includes("generating_strategy") &&
              step === "generating_strategy" && (
                <div
                  ref={strategyRef}
                  className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
                >
                  <GenerationStep
                    progress={generationProgress}
                    status={generationStatus}
                    secondsElapsed={secondsElapsed}
                  />
                </div>
              )}

            {/* 4. AVATARES */}
            {revealedSections.includes("strategy_ready") && (
              <div
                ref={strategyReadyRef}
                className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
              >
                <StrategyReadyStep
                  userData={user}
                  project={selectedProject}
                  onNext={() => setStep("show_landing_prep")}
                />
              </div>
            )}

            {revealedSections.includes("show_avatars") && (
              <div
                ref={avatarsRef}
                className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
              >
                <AvatarRevealStep
                  userData={user}
                  avatars={strategyData?.avatars || []}
                  onNext={() => setStep("show_landing_prep")}
                />
              </div>
            )}

            {/* 5. LANDING PREP */}
            {revealedSections.includes("show_landing_prep") && (
              <div
                ref={landingPrepRef}
                className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
              >
                <LandingIntroStep
                  userData={user}
                  onNext={() => setShowCreateLandingConfirm(true)}
                  isCreated={isLandingCreated}
                />
              </div>
            )}

            {/* 6. CREANDO WEB */}
            {revealedSections.includes("creating_web") &&
              step === "creating_web" && (
                <div
                  ref={creationRef}
                  className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
                >
                  <h1 className="text-center text-emerald-500 font-black uppercase tracking-widest mb-10">
                    Estoy creando tu Página Web Profesional
                  </h1>
                  <GenerationStep
                    progress={generationProgress}
                    status={generationStatus}
                    secondsElapsed={secondsElapsed}
                    message="Crearé tu página web profesional para capturar clientes interesados."
                  />
                </div>
              )}

            {revealedSections.includes("landing_success") && (
              <div
                ref={landingSuccessRef}
                className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
              >
                <LandingSuccessStep
                  userData={user}
                  onNext={() => setStep("show_hooks")}
                  onView={() => {
                    const subdomainPart = createdPageSubdomain
                      ? createdPageSubdomain.split(".")[0]
                      : "";
                    if (subdomainPart) {
                      const isLocal =
                        typeof window !== "undefined" &&
                        (window.location.hostname === "localhost" ||
                          window.location.hostname.includes("ais-dev"));
                      const url = isLocal
                        ? `/admin/lp/${subdomainPart}`
                        : `https://aprende.marketing/admin/lp/${subdomainPart}`;
                      window.open(url, "_blank");
                    } else if (unlockedProject) {
                      window.open(
                        `/dashboard/projects/${unlockedProject.id}/strategy?section=web`,
                        "_blank",
                      );
                    }
                  }}
                  onEdit={() => {
                    if (unlockedProject) {
                      window.open(
                        `/dashboard/projects/${unlockedProject.id}/strategy?section=web`,
                        "_blank",
                      );
                    }
                  }}
                />
              </div>
            )}

            {/* 6.5 GENERANDO HOOKS (LOADING) */}
            {step === "generating_hooks" && (
              <div className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                <h1 className="text-center text-purple-500 font-black uppercase tracking-widest mb-10">
                  Generando Activos de Atracción
                </h1>
                <GenerationStep
                  progress={generationProgress}
                  status={generationStatus}
                  secondsElapsed={secondsElapsed}
                  message="Estamos creando los videos para atraer tus potenciales clientes."
                />
              </div>
            )}

            {/* 7. HOOKS REVEAL */}
            {revealedSections.includes("show_hooks") &&
              step !== "generating_hooks" && (
                <div className="relative w-full pt-24 pb-12 px-4 md:px-6">
                  <HooksRevealStep
                    userData={user}
                    hooks={
                      unlockedHooks.length > 0
                        ? unlockedHooks
                        : strategyData?.modules?.hooks || []
                    }
                    isUnlocked={isHooksUnlocked}
                    projectId={unlockedProject?.id}
                    project={selectedProject || unlockedProject}
                    onNext={() => {
                      if (!isHooksUnlocked) {
                        handleUnlockHooks();
                      } else {
                        if (!revealedSections.includes("success")) {
                          setStep("success");
                        }
                      }
                    }}
                    hooksRef={hooksRef}
                  />
                </div>
              )}

            {/* 8. ÉXITO FINAL */}
            {revealedSections.includes("success") && (
              <div
                ref={successRef}
                className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
              >
                <SuccessStep onFinish={onComplete} />
              </div>
            )}
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        {showProfileModal && (
          <UserProfileModal
            user={user}
            onClose={() => setShowProfileModal(false)}
            onUpdateUser={onUpdateUser!}
          />
        )}
      </Suspense>

      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          user={user}
          currentPlan={user.planLimits?.planName || "Gratuito"}
        />
      )}

      {/* Sliding Drawer Side Panel */}
      <AnimatePresence>
        {activeDetailsDrawer && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveDetailsDrawer(null)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl h-full bg-[#111116] border-l border-white/5 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col z-10 overflow-hidden text-left"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#14141c]/80 backdrop-blur-md">
                <div className="text-left">
                  <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block mb-1">
                    {activeDetailsDrawer === "avatar" &&
                      "Conectar con tu cliente ideal"}
                    {activeDetailsDrawer === "testimonials" &&
                      "Derribar objeciones automáticamente"}
                    {activeDetailsDrawer === "objections" &&
                      "Neutralizar dolores y objeciones"}
                    {activeDetailsDrawer === "benefits" &&
                      "Crear una oferta magnética"}
                    {activeDetailsDrawer === "hooks" &&
                      "Guion Persuasivo de Video"}
                    {activeDetailsDrawer === "blog" &&
                      "Posicionamiento y Tráfico Orgánico"}
                    {activeDetailsDrawer === "email" &&
                      "Ventas sin presión técnica en piloto automático"}
                    {activeDetailsDrawer === "whatsapp" &&
                      "Conversión relámpago en canales de chat"}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                    {activeDetailsDrawer === "avatar" &&
                      "Avatares Psicológicos"}
                    {activeDetailsDrawer === "testimonials" &&
                      "Testimonios Persuasivos"}
                    {activeDetailsDrawer === "objections" &&
                      "Dolores y Objeciones"}
                    {activeDetailsDrawer === "benefits" &&
                      "Beneficios Magnéticos"}
                    {activeDetailsDrawer === "hooks" &&
                      "Detalles del Hook de Atracción"}
                    {activeDetailsDrawer === "blog" &&
                      "Estructura de Artículo de Blog SEO"}
                    {activeDetailsDrawer === "email" &&
                      "Secuencia Inteligente de Email"}
                    {activeDetailsDrawer === "whatsapp" &&
                      "Secuencia de Lanzamientos WhatsApp"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveDetailsDrawer(null)}
                  className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content Area with independent scroll */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {activeDetailsDrawer === "avatar" &&
                  (() => {
                    const rawAvatars = strategyData?.avatars || [];
                    const defaultAvs = [
                      {
                        name: "Laura Torres",
                        archetype: "Buscadora de Ingresos Rápidos",
                        quote:
                          "Deseo emprender seguro pero temo perder mi dinero o fracasar en el intento.",
                        pain: "Miedo a gastar dinero en cursos sin saber si podré recuperar la inversión de materiales.",
                        desire:
                          "Aprender una técnica pulida para dar servicios premium desde la primera semana.",
                      },
                      {
                        name: "Mónica Silva",
                        archetype: "Esteticista Tradicional Estancada",
                        quote:
                          "Siento que el mercado local está saturado y mis tarifas son cada vez más bajas.",
                        pain: "Frustración por trabajar largas horas ofreciendo manicura o depilación básica de baja rentabilidad.",
                        desire:
                          "Migrar a servicios de Micropigmentación de cejas de alto valor para triplicar su ticket base.",
                      },
                    ];
                    const avsToRender =
                      rawAvatars.length > 0 ? rawAvatars : defaultAvs;
                    return (
                      <div className="space-y-8 text-left">
                        <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                          Estos son los arquetipos de cliente ideales generados
                          de forma analítica para tu proyecto. Representan el
                          80% de tus ventas potenciales sugeridas.
                        </p>
                        {avsToRender.map((av: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden space-y-5"
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.02] blur-3xl rounded-full"></div>
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl font-bold text-orange-400 shrink-0">
                                {idx % 3 === 0
                                  ? "👩‍🎨"
                                  : idx % 3 === 1
                                    ? "👩‍💼"
                                    : "👩‍👧"}
                              </div>
                              <div>
                                <h4 className="text-xl font-extrabold text-white leading-tight font-sans text-left flex items-center flex-wrap gap-2">
                                  {av.name || "Avatar Especialista"}
                                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none">
                                    {av.ageRange || av.age || "25-34 años"}
                                  </span>
                                </h4>
                                <p className="text-xs md:text-sm text-orange-400 font-extrabold uppercase tracking-widest mt-1 text-left">
                                  {av.archetype || "Comprador Ideal"}
                                </p>
                              </div>
                            </div>
                            {av.quote && (
                              <p className="text-base md:text-lg italic text-[#FFBF00] bg-white/5 p-5 rounded-2xl border border-white/5 leading-relaxed text-left font-sans">
                                "{av.quote}"
                              </p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                              <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                                <p className="font-extrabold text-rose-400 uppercase tracking-widest text-xs mb-2">
                                  Dolor Crítico
                                </p>
                                <p className="text-sm md:text-base text-zinc-200 leading-normal font-normal">
                                  {av.pain ||
                                    "Incertidumbre financiera sobre el retorno"}
                                </p>
                              </div>
                              <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                <p className="font-extrabold text-emerald-400 uppercase tracking-widest text-xs mb-2">
                                  Transformación Deseada
                                </p>
                                <p className="text-sm md:text-base text-zinc-200 leading-normal font-normal">
                                  {av.desire ||
                                    av.transformation_title ||
                                    "Lanzar un servicio calificado y rentable"}
                                </p>
                              </div>

                              {/* Objeción / Barrera de venta */}
                              <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                                <p className="font-extrabold text-amber-400 uppercase tracking-widest text-xs mb-2">
                                  Barrera de Venta (Objeción)
                                </p>
                                <p className="text-sm md:text-base text-zinc-200 leading-normal font-normal">
                                  {av.objection || av.salesBarrier || "No saber si podrá conseguir clientas que paguen precios altos."}
                                </p>
                              </div>

                              {/* Para Qué Emocional */}
                              <div className="p-5 bg-[#FF5A1F]/5 rounded-2xl border border-[#FF5A1F]/10">
                                <p className="font-extrabold text-[#FF5A1F] uppercase tracking-widest text-xs mb-2">
                                  Para Qué Emocional
                                </p>
                                <p className="text-sm md:text-base text-zinc-200 leading-normal font-normal">
                                  {av.emotional_reason || av.emotionalReason || "Sentir el orgullo de ser una empresaria reconocida y exitosa."}
                                </p>
                              </div>

                              {/* Drivers de Decisión */}
                              <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 md:col-span-2">
                                <p className="font-extrabold text-blue-400 uppercase tracking-widest text-xs mb-2">
                                  Drivers de Decisión
                                </p>
                                <div className="space-y-1.5 mt-2">
                                  {((av.decisionDrivers || av.drivers || (av.motivations && typeof Object.values(av.motivations)[0] === 'string' ? Object.values(av.motivations) : [
                                    "Retorno de inversión garantizado con su primer set de clientas.",
                                    "Soporte uno a uno para resolver problemas reales en cabina.",
                                    "Certificación oficial de alta gama para destacar de la competencia."
                                  ])) as string[]).map((driver, dIdx) => (
                                    <div key={dIdx} className="flex items-start gap-2.5 text-sm md:text-[15px] text-zinc-300">
                                      <span className="text-blue-400 font-bold shrink-0 mt-0.5">✦</span>
                                      <span>{driver}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                {activeDetailsDrawer === "testimonials" &&
                  (() => {
                    const rawTestimonials =
                      strategyData?.modules?.testimonials ||
                      strategyData?.testimonials ||
                      [];
                    const specificExpertReplies = [
                      "¡Qué increíble resultado! 🎉 Cuando tienes una meta y vas por ella seguro logras grandes resultados. ¡A seguir escalando ese proyecto! 🚀",
                      "Nos encanta saber que estás aplicando lo aprendido. ¡Felicitaciones y sigue por más resultados! 💰",
                      "¡Esa es la meta! Estás en una de las mejores oportunidades de los últimos tiempos. Sigue así y la recompensa llegará. 💎"
                    ];
                    const defaultTestimonialsList = [
                      {
                        name: "Laura Torres",
                        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                        msg: `¡Hola! Solo quería contarles que estoy súper feliz. Con este proyecto logré mis primeras clientes esta semana y recuperé toda la inversión del material y del curso. ¡La metodología es súper clara!`,
                        reply: specificExpertReplies[0],
                      },
                      {
                        name: "Carlos Mendoza",
                        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                        msg: "Nunca pensé que se pudiera aprender de manera tan fácil y práctica de forma 100% online. Las lecciones de diseño tridimensional y visagismo son oro puro.",
                        reply: specificExpertReplies[1],
                      },
                      {
                        name: "Sofía Medina",
                        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
                        msg: "Mis clientas están fascinadas con los resultados y las cejas les quedan súper naturales. ¡Mil gracias por el excelente soporte y paciencia!",
                        reply: specificExpertReplies[2],
                      },
                    ];
                    const testimonialsToRender =
                      rawTestimonials.length > 0
                        ? rawTestimonials
                        : defaultTestimonialsList;
                    return (
                      <div className="space-y-8 font-sans text-left">
                        <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                          Testimonios optimizados para el embudo que demuestran
                          resultados contundentes y neutralizan el escepticismo
                          inicial del visitante.
                        </p>
                        {testimonialsToRender.map((t: any, idx: number) => {
                          const textMsg = t.text || t.msg || "";
                          const imageToUse =
                            t.image ||
                            t.img ||
                            (idx === 0
                              ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                              : idx === 1
                                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                                : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop");
                          
                          const replyToDeliver = t.reply || specificExpertReplies[idx % specificExpertReplies.length];
                          
                          return (
                            <div
                              key={idx}
                              className="p-6 bg-[#0d0d12] border border-white/5 rounded-3xl relative overflow-hidden space-y-5 hover:border-white/10 transition-all text-left"
                            >
                              {/* User Bubble */}
                              <div className="flex gap-4 items-start pr-6">
                                <img
                                  src={imageToUse}
                                  alt={t.name}
                                  referrerPolicy="no-referrer"
                                  className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0"
                                />
                                <div className="flex-1 bg-[#202c33] border border-[#202c33] rounded-2xl rounded-tl-none p-5 text-left shadow-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-extrabold text-[#53bdeb] text-sm uppercase tracking-wide">
                                      {t.name}
                                    </span>
                                  </div>
                                  <p className="text-sm md:text-base leading-relaxed text-zinc-100 font-normal">
                                    {textMsg}
                                  </p>
                                </div>
                              </div>

                              {/* Admin Reply */}
                              <div className="flex gap-4 items-start justify-end pl-6">
                                <div className="flex-1 bg-[#005c4b] border border-[#005c4b] rounded-2xl rounded-tr-none p-5 text-left shadow-lg">
                                  <div className="flex justify-between items-center mb-2 flex-row-reverse">
                                    <span className="font-extrabold text-[#25D366] text-sm uppercase tracking-wide">
                                      Instructor (Tú)
                                    </span>
                                    <span className="text-xs text-white/60 font-semibold">
                                      Expert Coach
                                    </span>
                                  </div>
                                  <p className="text-sm md:text-base leading-relaxed text-white font-normal">
                                    {replyToDeliver}
                                  </p>
                                </div>
                                <div className="w-11 h-11 rounded-full bg-[#005c4b]/20 border border-[#005c4b]/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 text-lg">
                                  🎓
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                {activeDetailsDrawer === "objections" &&
                  (() => {
                    const rawAvatars = strategyData?.avatars || [];
                    const defaultAvsWithDetailedPains = [
                      {
                        name: "Valeria Mendoza",
                        transformation_title: "Si buscas escalar tu negocio de belleza con el servicio más lucrativo del mercado actual...",
                        detailed_pains: [
                          "Si te frustra ver cómo tu agenda se llena de servicios que apenas cubren tus gastos básicos.",
                          "Si te agota sentirte invisible frente a competidores que cobran el triple que tú.",
                          "Si te duele sentir que tu talento está estancado por no tener una técnica de alto impacto."
                        ]
                      },
                      {
                        name: "Mónica Silva",
                        transformation_title: "Si sueñas con la libertad de manejar tu propio tiempo sin depender de un sueldo fijo...",
                        detailed_pains: [
                          "Si te frustra trabajar más de 10 horas al día sin ver un crecimiento real en tu cuenta bancaria.",
                          "Si te agota la inseguridad de depender de que tus clientas agenden citas de bajo costo.",
                          "Si te duele sentir que no pasas suficiente tiempo de calidad con tu familia por el cansancio."
                        ]
                      },
                      {
                        name: "Laura Torres",
                        transformation_title: "Si decides dar el salto al emprendimiento de alta rentabilidad reduciendo el riesgo al mínimo absoluto...",
                        detailed_pains: [
                          "Si te frustra el miedo constante de perder la inversión en materiales sin saber cómo conseguir clientas rápidas.",
                          "Si te agota buscar tutoriales gratuitos que solo te confunden con métodos contradictorios.",
                          "Si te duele sentir el estancamiento profesional por no tener un plan paso a paso y validado."
                        ]
                      }
                    ];

                    const avsToRender = rawAvatars.length > 0
                      ? rawAvatars.map((av: any, i: number) => {
                          const fallbackObj = defaultAvsWithDetailedPains[i % defaultAvsWithDetailedPains.length];
                          let painsList = av.detailed_pains;
                          if (!painsList || !Array.isArray(painsList) || painsList.length === 0) {
                            painsList = [
                              av.pain ? `Si te frustra ver que: ${av.pain}` : fallbackObj.detailed_pains[0],
                              av.daily_manifestation ? `Si te agota sentir que: ${av.daily_manifestation}` : fallbackObj.detailed_pains[1],
                              av.objection ? `Si te duele dudar sobre: ${av.objection}` : fallbackObj.detailed_pains[2]
                            ].filter(Boolean);
                          }
                          return {
                            name: av.name || fallbackObj.name,
                            transformation_title: av.transformation_title || av.archetype || fallbackObj.transformation_title,
                            detailed_pains: painsList
                          };
                        })
                      : defaultAvsWithDetailedPains;

                    return (
                      <div className="space-y-8 font-sans text-left">
                        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed tracking-wide">
                          Dolores y objeciones frecuentes que frenan la compra de tus prospectos, mapeados detalladamente en base a su perfil psicológico.
                        </p>

                        <div className="space-y-10">
                          {avsToRender.map((av: any, idx: number) => (
                            <div 
                              key={idx}
                              className="p-6 md:p-8 bg-[#0d0d12] border border-white/5 rounded-3xl relative overflow-hidden space-y-6 hover:border-white/10 transition-all duration-300"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-sm">
                                  👤
                                </div>
                                <h4 className="text-lg font-black text-[#FFBF00] tracking-wide uppercase">
                                  {av.name}
                                </h4>
                              </div>

                              {av.transformation_title && (
                                <p className="text-base md:text-lg italic text-zinc-100 bg-white/[0.02] border border-white/5 p-5 rounded-2xl leading-relaxed text-left font-sans">
                                  {av.transformation_title}
                                </p>
                              )}

                              <div className="space-y-3.5">
                                {av.detailed_pains.map((pain: string, pIdx: number) => (
                                  <div 
                                    key={pIdx}
                                    className="flex items-start gap-3 p-4 bg-rose-500/[0.02] border border-rose-500/5 hover:border-rose-500/10 rounded-2xl transition-all"
                                  >
                                    <span className="text-rose-500 font-bold shrink-0 mt-0.5 text-lg">✦</span>
                                    <p className="text-sm md:text-base text-zinc-350 leading-relaxed font-normal">
                                      {pain}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                {activeDetailsDrawer === "benefits" &&
                  (() => {
                    const rawBenefits =
                      strategyData?.modules?.web?.landingPageTabs?.benefits
                        ?.items ||
                      strategyData?.benefits ||
                      [];
                    const defaultBenefitsList = [
                      {
                        title: "El Mapa de la Especialista de Alto Valor",
                        description:
                          "Descubrirás el camino exacto para posicionarte como la opción preferida por clientas premium.",
                      },
                      {
                        title: "Ingeniería de Trazo Perfecto",
                        description:
                          "La clave definitiva para dejar de sentir inseguridad y realizar diseños que hipnotizan a tus clientas.",
                      },
                      {
                        title: "El Secreto del Flujo de Trabajo Élite",
                        description:
                          "Descubrirás cómo optimizar cada minuto en cabina para maximizar tu rentabilidad diaria.",
                      },
                      {
                        title: "Blindaje Técnico de Seguridad",
                        description:
                          "El mapa exacto para recuperar tu confianza y saber que cada trazo es seguro y profesional.",
                      },
                      {
                        title: "El Arte de la Simetría Garantizada",
                        description:
                          "Aprenderás a construir la perfección visual sin depender de un talento artístico innato.",
                      },
                      {
                        title: "Tu Red de Soporte Profesional",
                        description:
                          "La clave definitiva para dejar de sentir el miedo a emprender en soledad.",
                      },
                      {
                        title: "El Puente hacia tu Nueva Identidad",
                        description:
                          "Descubrirás el camino hacia la reinvención total de tu vida profesional y personal.",
                      },
                      {
                        title: "Diseño de Vida y Horarios Libres",
                        description:
                          "Aprenderás a construir la libertad que tus hijos merecen manejando tu propio estudio.",
                      },
                      {
                        title: "El Despertar de tu Pasión Creativa",
                        description:
                          "El mapa exacto para recuperar tu propósito y sentirte orgullosa de lo que haces cada día.",
                      },
                    ];
                    const benefitsToRenderList = (
                      rawBenefits.length > 0 ? rawBenefits : defaultBenefitsList
                    ).map((b: any) => ({
                      title: b.title || b.name || "Módulo de Valor",
                      description:
                        b.description ||
                        b.desc ||
                        "Módulo estructurado para detonar urgencia y persuasión de compra en tu oferta oficial.",
                    }));
                    return (
                      <div className="space-y-8 font-sans text-left">
                        <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed tracking-wide">
                          La oferta irresistible se crea empaquetando diversos entregables lógicos en ventajas magnéticas para disparar tu tasa de conversión.
                        </p>

                        <div className="p-6 bg-gradient-to-r from-emerald-500/5 to-amber-500/5 border border-white/5 rounded-3xl mb-4 text-left">
                          <div className="flex gap-3 items-center mb-3">
                            <span className="text-xl">✨</span>
                            <h4 className="text-base md:text-lg font-black text-[#FFBF00] tracking-tight">
                              Lo que aprenderás en nuestra clase
                            </h4>
                          </div>
                          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-normal">
                            Al estructurar el contenido bajo estos pilares de alto valor, derrumbas barreras de duda y transmites una ruta clara hacia la maestría.
                          </p>
                        </div>

                        <div className="space-y-4 text-left">
                          {benefitsToRenderList.map((b: any, i: number) => (
                            <div
                              key={i}
                              className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-all duration-300 text-left"
                            >
                              <div className="flex items-center gap-3.5 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-black">
                                  ✓
                                </div>
                                <h5 className="text-sm md:text-base font-extrabold text-white uppercase tracking-wider">
                                  {b.title}
                                </h5>
                              </div>
                              <p className="text-sm text-zinc-300 pl-10 leading-relaxed font-normal">
                                {b.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                {activeDetailsDrawer === "hooks" &&
                  selectedHookForDrawer &&
                  (() => {
                    const hook = selectedHookForDrawer;
                    const hTitle =
                      hook.title ||
                      hook.hookText ||
                      hook.text ||
                      hook.question ||
                      "Video Hook";
                    const hStrategy =
                      hook.psychologicalStrategy ||
                      hook.strategy ||
                      "Estrategia de persuasión enfocada en enganchar al avatar en los primeros 3 segundos.";
                    const cJson = hook.contentJson || {};
                    const scriptText = cJson.script || "";
                    const adsText = cJson.ads || "";
                    const thumbsList = cJson.thumbs || [];

                    return (
                      <div className="space-y-8 font-sans text-left">
                        <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                          Este es uno de tus guiones optimizados
                          psicológicamente. Úsalo para captar la atención
                          inmediata en tus contenidos orgánicos y anuncios de
                          tráfico pago.
                        </p>

                        {/* Section 1: El Gancho (The Hook Quote) */}
                        <div className="p-6 bg-gradient-to-r from-[#FF5A1F]/10 via-[#FF5A1F]/5 to-transparent border border-[#FF5A1F]/20 rounded-3xl relative overflow-hidden space-y-3">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>
                          <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest block">
                            Frase Gancho (Primeros 3 Segundos)
                          </span>
                          <p className="text-lg md:text-xl font-extrabold text-white leading-relaxed font-sans">
                            "{hTitle}"
                          </p>
                        </div>

                        {/* Section 2: Estrategia Psicológica */}
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block mb-2">
                            Estrategia Psicológica de Fondo
                          </span>
                          <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                            {hStrategy}
                          </p>
                        </div>

                        {/* Section 3: El Guión del Video (The Script) */}
                        {scriptText && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
                              Guión Completo Recomendado
                            </span>
                            <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                              <pre className="text-sm text-zinc-205 font-sans whitespace-pre-wrap leading-relaxed">
                                {scriptText}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Section 4: Copia de Anuncio / Caption */}
                        {adsText && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-indigo-400 tracking-widest block">
                              Copia del Anuncio / Descripción de Redes
                            </span>
                            <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                              <pre className="text-sm text-zinc-205 font-sans whitespace-pre-wrap leading-relaxed">
                                {adsText}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Section 5: Sugerencias de Miniatura (Thumbs) */}
                        {thumbsList && thumbsList.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-pink-400 tracking-widest block">
                              Textos para Portadas / Miniaturas
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {thumbsList.map((thumb: string, tIdx: number) => (
                                <div
                                  key={tIdx}
                                  className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-center"
                                >
                                  <p className="text-xs font-extrabold text-pink-300">
                                    OPCIÓN {tIdx + 1}
                                  </p>
                                  <p className="mt-1.5 text-xs text-white leading-normal font-sans font-medium">
                                    {thumb}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                {activeDetailsDrawer === "blog" &&
                  selectedBlogForDrawer &&
                  (() => {
                    const blog = selectedBlogForDrawer;
                    const bTitle = blog.title;
                    const bIntro = blog.introduction;
                    const seo = blog.seoStructure || {};
                    const h1Text = seo.h1 || bTitle;
                    const headings = seo.headings || [];
                    const keywordsStr = seo.keywords || "";
                    const keywordsList = keywordsStr
                      .split(",")
                      .map((k: string) => k.trim());
                    const ctaText = seo.cta || "";

                    return (
                      <div className="space-y-8 font-sans text-left">
                        <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                          Esta es la estructura estratégica para tu Artículo de
                          Blog SEO optimizado. Copia y utilízala en tu sitio web
                          para empezar a posicionar en Google de manera
                          totalmente orgánica.
                        </p>

                        {/* Section 1: H1 Title */}
                        <div className="p-6 bg-gradient-to-r from-[#FFBF00]/10 via-[#FFBF00]/5 to-transparent border border-[#FFBF00]/20 rounded-3xl relative overflow-hidden space-y-3">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>
                          <span className="text-[10px] font-black uppercase text-[#FFBF00] tracking-widest block">
                            Encabezado Principal (Tag H1)
                          </span>
                          <p className="text-xl md:text-2xl font-black text-white leading-relaxed font-sans">
                            "{h1Text}"
                          </p>
                        </div>

                        {/* Section 2: Introduccion / Resumen */}
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block mb-2 font-sans">
                            Introducción y Enfoque Persuasivo
                          </span>
                          <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-normal">
                            {bIntro}
                          </p>
                        </div>

                        {/* Section 3: Jerarquía SEO de Encabezados (H2 & H3) */}
                        {headings && headings.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block font-sans">
                              Estructura de Encabezados (H2 / H3)
                            </span>
                            <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative space-y-4">
                              {headings.map((heading: any, index: number) => {
                                const isH2 = heading.type === "h2";
                                return (
                                  <div
                                    key={index}
                                    className={`flex items-start gap-3 ${isH2 ? "pl-0 border-b border-white/5 pb-2 last:border-0 last:pb-0" : "pl-6"}`}
                                  >
                                    <span
                                      className={`text-[9px] font-black px-1.5 py-0.5 rounded leading-none font-sans shrink-0 ${isH2 ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-teal-500/15 text-teal-400 border border-teal-500/30"}`}
                                    >
                                      {heading.type.toUpperCase()}
                                    </span>
                                    <p
                                      className={`text-sm md:text-base font-sans ${isH2 ? "text-white font-black" : "text-zinc-300 font-medium"}`}
                                    >
                                      {heading.text}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Section 4: Palabras Clave */}
                        {keywordsList.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-[#FFBF00] tracking-widest block font-sans">
                              Palabras Clave Recomendadas (SEO Tags)
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {keywordsList.map(
                                (tag: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-[#FFBF00]/25 text-[#FFBF00] rounded-xl text-xs font-bold transition-all cursor-default font-sans"
                                  >
                                    🔑 {tag}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* Section 5: Llamacion a la Acción */}
                        {ctaText && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block font-sans">
                              Llamada a la Acción Estratégica (CTA)
                            </span>
                            <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                              <p className="text-base md:text-lg text-zinc-200 font-sans leading-relaxed font-normal">
                                {ctaText}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                {activeDetailsDrawer === "email" &&
                  selectedEmailForDrawer &&
                  (() => {
                    const email = selectedEmailForDrawer;
                    const struct = email.structure || {};
                    const sections = struct.sections || [];
                    return (
                      <div className="space-y-8 font-sans text-left">
                        <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                          Esta es la estructura persuasiva de tu correo de nutrición automatizado. Copia y pégala en tu autorespondedor favorito para empezar a calentar y cualificar a tus suscriptores en piloto automático.
                        </p>

                        {/* Asunto principal */}
                        <div className="p-6 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-3xl relative overflow-hidden space-y-3">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full"></div>
                          <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest block font-sans">
                            Línea de Asunto Recomendada
                          </span>
                          <p className="text-xl md:text-2xl font-black text-white leading-relaxed font-sans">
                            "{struct.subject}"
                          </p>
                        </div>

                        {/* Enfoque */}
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest block mb-2 font-sans">
                            Objetivo Analítico y Psicológico
                          </span>
                          <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-normal">
                            {struct.focus}
                          </p>
                        </div>

                        {/* Secuenciación */}
                        <div className="space-y-3">
                          <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block font-sans">
                            Estructura y Copia Paso a Paso
                          </span>
                          <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative space-y-4">
                            {sections.map((sec: any, idx: number) => (
                              <div
                                key={idx}
                                className="pl-0 border-b border-white/5 pb-4 last:border-0 last:pb-0 space-y-1"
                              >
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded leading-none font-sans bg-blue-500/15 text-blue-400 border border-blue-500/30 inline-block">
                                  {sec.type.toUpperCase()}
                                </span>
                                <p className="text-sm md:text-base font-sans text-white font-normal leading-relaxed">
                                  {sec.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tips */}
                        {struct.tips && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-[#FFBF00] tracking-widest block font-sans">
                              Instrucciones de Redacción (Copywriting)
                            </span>
                            <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                              <p className="text-base md:text-lg text-zinc-200 font-sans leading-relaxed font-normal">
                                {struct.tips}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        {struct.cta && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block font-sans">
                              Llamada a la Acción (CTA)
                            </span>
                            <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                              <p className="text-base md:text-lg text-zinc-200 font-sans leading-relaxed font-normal">
                                {struct.cta}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                {activeDetailsDrawer === "whatsapp" &&
                  selectedWhatsappForDrawer &&
                  (() => {
                    const wa = selectedWhatsappForDrawer;
                    const struct = wa.structure || {};
                    const sections = struct.sections || [];
                    return (
                      <div className="space-y-8 font-sans text-left">
                        <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                          Esta es la estructura y guiones de tu mensaje estratégico de WhatsApp. Utilízalos en tus grupos VIP, listas de difusión o chats directos para cerrar ventas con alta efectividad.
                        </p>

                        {/* Título de Campaña */}
                        <div className="p-6 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-3xl relative overflow-hidden space-y-3">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>
                          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block font-sans">
                            Fase de Lanzamiento
                          </span>
                          <p className="text-xl md:text-2xl font-black text-white leading-relaxed font-sans">
                            {struct.title}
                          </p>
                        </div>

                        {/* Enfoque */}
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block mb-2 font-sans">
                            Objetivo de Conversión
                          </span>
                          <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-normal">
                            {struct.focus}
                          </p>
                        </div>

                        {/* Copia */}
                        <div className="space-y-3">
                          <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block font-sans">
                            Estructura y Contenido del Mensaje
                          </span>
                          <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative space-y-4">
                            {sections.map((sec: any, idx: number) => (
                              <div
                                key={idx}
                                className="pl-0 border-b border-white/5 pb-4 last:border-0 last:pb-0 space-y-1"
                              >
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded leading-none font-sans bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-block">
                                  {sec.type.toUpperCase()}
                                </span>
                                <p className="text-sm md:text-base font-sans text-white font-normal leading-relaxed">
                                  {sec.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tips */}
                        {struct.tips && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-[#FFBF00] tracking-widest block font-sans">
                              Buenas Prácticas
                            </span>
                            <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                              <p className="text-base md:text-lg text-zinc-200 font-sans leading-relaxed font-normal">
                                {struct.tips}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        {struct.cta && (
                          <div className="space-y-3">
                            <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block font-sans">
                              Llamada a la Acción Recomendada (CTA)
                            </span>
                            <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                              <p className="text-base md:text-lg text-emerald-400 font-sans leading-relaxed font-normal font-mono">
                                {struct.cta}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-white/5 bg-[#14141c]/95 flex justify-end items-center relative z-10">
                <button
                  onClick={() => setActiveDetailsDrawer(null)}
                  className="px-6 py-3 bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_15px_rgba(255,90,31,0.25)]"
                >
                  Cerrar Vista
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Minimalist Top Progress Bar */}
      {step !== "success" &&
        !isGenerating &&
        (() => {
          const steps = [
            "welcome",
            "selection",
            "generating_strategy",
            "strategy_ready",
            "show_landing_prep",
            "creating_web",
            "landing_success",
            "show_hooks",
            "success",
          ];
          const currentStepStr = step as string;
          const activeIndex = steps.indexOf(
            currentStepStr === "generating_hooks"
              ? "show_hooks"
              : currentStepStr,
          );
          const progressPercent =
            activeIndex >= 0 ? ((activeIndex + 1) / steps.length) * 100 : 0;
          return (
            <div
              className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#FF5A1F] to-emerald-500 z-[55] transition-all duration-500 ease-out shadow-[0_1px_10px_rgba(255,90,31,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          );
        })()}
    </div>
  );
};
