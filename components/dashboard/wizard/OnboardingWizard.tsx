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
  User as UserIcon,
  ShieldCheck,
  Crown,
  Shield,
  X,
  Copy,
  ArrowLeft,
  Check,
  Calendar,
  Plus,
  ChevronDown,
  Search,
  BookOpen,
  PenTool,
  Lightbulb,
  Sparkles,
  PlayCircle,
  TrendingUp,
  Clock,
  Trophy,
  Brain,
  Folder,
  Info,
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
  isStandaloneDashboard?: boolean;
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

const getSystemAvatars = (strategyData: any) => {
  const hasSavedAvatars = !!(strategyData?.avatars && strategyData.avatars.length > 0);
  const defaultAvs = [
    {
      name: "María Fernanda",
      priority: "PRINCIPAL",
      priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
      audiencePct: "68% DE TU AUDIENCIA",
      audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
      age: "28 - 35 años",
      occupation: "Emprendedora",
      income: "Ingresos variables",
    },
    {
      name: "Valeria Mendoza",
      priority: "SECUNDARIO",
      priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
      audiencePct: "22% DE TU AUDIENCIA",
      audienceClass: "bg-amber-500/10 border-amber-500/30 text-amber-500 border",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
      age: "22 - 27 años",
      occupation: "Cosmetóloga Junior",
      income: "Ingreso fijo bajo",
    },
    {
      name: "Mónica Silva",
      priority: "COMPLEMENTARIO",
      priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
      audiencePct: "10% DE TU AUDIENCIA",
      audienceClass: "bg-violet-500/10 border-violet-500/30 text-violet-500 border",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
      age: "36 - 45 años",
      occupation: "Emprendedora desde cero",
      income: "Sin ingresos estables",
    },
  ];

  return [0, 1, 2].map((idx) => {
    const defaultAv = defaultAvs[idx];
    const realAv = strategyData?.avatars?.[idx];
    if (!realAv) {
      if (hasSavedAvatars) {
        return {
          name: "(no definido)",
          priority: idx === 0 ? "PRINCIPAL" : idx === 1 ? "SECUNDARIO" : "COMPLEMENTARIO",
          priorityClass: idx === 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border" : idx === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-400 border" : "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
          audiencePct: idx === 0 ? "68% DE TU AUDIENCIA" : idx === 1 ? "22% DE TU AUDIENCIA" : "10% DE TU AUDIENCIA",
          audienceClass: idx === 0 ? "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border" : idx === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-550 border" : "bg-violet-500/10 border-violet-500/30 text-violet-550 border",
          img: idx === 0 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300" : idx === 1 ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
          age: "(no definido)",
          occupation: "(no definido)",
          income: "(no definido)",
        };
      }
      return defaultAv;
    }

    const name = realAv.name || (hasSavedAvatars ? "(no definido)" : defaultAv.name);
    const age = realAv.ageRange || realAv.age || realAv.age_range || (hasSavedAvatars ? "(no definido)" : defaultAv.age);
    const occupation = realAv.archetype || realAv.occupation || realAv.profession || realAv.profession_title || realAv.job || realAv.role || (hasSavedAvatars ? "(no definido)" : defaultAv.occupation);
    const income = realAv.incomeRange || realAv.income || (hasSavedAvatars ? "(no definido)" : defaultAv.income);
    const img = realAv.image || realAv.img || defaultAv.img;

    const rawPriority = (realAv.priority || realAv.role || realAv.type || defaultAv.priority || "").toUpperCase();
    const priority = rawPriority;
    let priorityClass = defaultAv.priorityClass;

    if (rawPriority.includes("PRINCIPAL")) {
      priorityClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border";
    } else if (rawPriority.includes("SECUNDARIO")) {
      priorityClass = "bg-amber-500/10 border-amber-500/30 text-amber-400 border";
    } else if (rawPriority.includes("COMPLEMENTARIO")) {
      priorityClass = "bg-violet-500/10 border-violet-500/30 text-violet-400 border";
    }

    return {
      ...defaultAv,
      name,
      img,
      age,
      occupation,
      income,
      priority,
      priorityClass,
    };
  });
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  user,
  onComplete,
  onLogout,
  onGenerationStateChange,
  onUpdateUser,
  isStandaloneDashboard = false,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(() => {
    if (isStandaloneDashboard) {
      return "success";
    }
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
  const [unlockedArticles, setUnlockedArticles] = useState<any[]>([]);
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
    | "landing"
    | null
  >(null);
  const [selectedHookForDrawer, setSelectedHookForDrawer] = useState<any>(null);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState<number>(-1);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);
  const [editingTestimonialText, setEditingTestimonialText] = useState<string>("");
  const [isSavingTestimonial, setIsSavingTestimonial] = useState<boolean>(false);

  const handleStartEditTestimonial = (idx: number, currentText: string) => {
    setEditingTestimonialIndex(idx);
    setEditingTestimonialText(currentText);
  };

  const handleCancelEditTestimonial = () => {
    setEditingTestimonialIndex(null);
    setEditingTestimonialText("");
  };

  const handleSaveTestimonial = async (idx: number) => {
    if (!editingTestimonialText.trim()) return;
    setIsSavingTestimonial(true);
    try {
      const projectId = unlockedProject?.id || selectedProject?.id;
      if (!projectId) {
        console.error("No project loaded");
        return;
      }
      const rawTestimonials = [
        ...(strategyData?.modules?.testimonials ||
          strategyData?.testimonials ||
          [])
      ];
      
      if (rawTestimonials[idx]) {
        if (typeof rawTestimonials[idx] === 'string') {
          rawTestimonials[idx] = editingTestimonialText;
        } else {
          rawTestimonials[idx] = {
            ...rawTestimonials[idx],
            text: editingTestimonialText,
            msg: editingTestimonialText,
            quote: editingTestimonialText
          };
        }
      } else {
        rawTestimonials[idx] = { text: editingTestimonialText, msg: editingTestimonialText };
      }

      await api.updateProjectTestimonials(projectId, rawTestimonials);

      setStrategyData((prev: any) => {
        if (!prev) return prev;
        const updated = { ...prev };
        if (!updated.modules) updated.modules = {};
        updated.modules.testimonials = rawTestimonials;
        updated.testimonials = rawTestimonials;
        return updated;
      });

      setEditingTestimonialIndex(null);
    } catch (error) {
      console.error("Error saving testimonial:", error);
    } finally {
      setIsSavingTestimonial(false);
    }
  };

  const [activeHookTab, setActiveHookTab] = useState<string>("Gancho");
  const [hookSearchSearchText, setHookSearchSearchText] = useState<string>("");

  // Lifted helper variables for grid cards clicks
  const isManicurista = !!(
    selectedProject?.name?.toLowerCase().includes("manicurista") ||
    unlockedProject?.name?.toLowerCase().includes("manicurista") ||
    selectedProject?.name?.toLowerCase().includes("uña") ||
    unlockedProject?.name?.toLowerCase().includes("uña")
  );

  const isMicroblading = !!(
    selectedProject?.name?.toLowerCase().includes("microblading") ||
    unlockedProject?.name?.toLowerCase().includes("microblading") ||
    selectedProject?.name?.toLowerCase().includes("ceja") ||
    unlockedProject?.name?.toLowerCase().includes("ceja")
  );

  const topDefaultHooksList = isManicurista
    ? [
        {
          title: "¿Sabías que dominar la técnica de uñas rusas es el camino más rápido para pasar de cobrar $10 a $50 por servicio?",
          psychologicalStrategy: "Conecta con el deseo de aumentar drásticamente los ingresos ofreciendo un servicio de alta especialización y precisión.",
          contentJson: {
            script: "Gana más tiempo con tu familia y aumenta tus ingresos aprendiendo el sistema definitivo de manicura rusa...\n",
            ads: "🔥 ¿Sabías que dominar la técnica de uñas rusas es el camino más rápido para pasar de cobrar $10 a $50 por servicio?\n\n",
            thumbs: ["Domina Uñas Rusas 💅", "De Cobrar $10 a $50 💸", "Preparación Profesional 🧪"]
          }
        }
      ]
    : isMicroblading
      ? [
          {
            title: "¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de microblading de cejas?",
            psychologicalStrategy: "Conecta con el deseo de seguridad financiera inmediata y falta de riesgo en el nicho de cejas de alto ticket.",
            contentJson: {
              script: "Aprende la técnica de microblading con el diseño hiperrealista más demandado del mercado...\n",
              ads: "🔥 ¿Te gustaría generar $1.000 extras al mes sin dejar tu trabajo actual?\n\n",
              thumbs: ["Triplica Tus Ingresos 💰", "Técnica Hiperrealista Cejas 👩‍🎤", "Recupera Inversión Rápido 📈"]
            }
          }
        ]
      : [
          {
            title: "¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de belleza de alta demanda?",
            psychologicalStrategy: "Estimula el interés sobre el nicho de belleza enseñando rentabilidad y escalabilidad de servicios únicos.",
            contentJson: {
              script: "El campo estético es el más resistente a las crisis globales...\n",
              ads: "💅 ¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de belleza de alta demanda?\n\n",
              thumbs: ["Triplica tus Ingresos 💸", "Belleza de Alta Demanda 🌟", "Controla Tu Tiempo Mañana ⏰"]
            }
          }
        ];

  const topLibraryContentList = unlockedArticles.length > 0
    ? unlockedArticles
    : (strategyData?.modules?.content || strategyData?.content || []);

  const topBlogsToRender = topLibraryContentList.length > 0
    ? topLibraryContentList.slice(0, 3).map((item: any) => ({
        id: item.id || item.jsonIndex,
        title: item.title,
        introduction: item.description || item.objective || item.strategy || "Artículo estratégico diseñado para captar tráfico altamente cualificado y derivarlo a la compra del producto.",
        enfoqueEstrategico: item.objective || item.psychologicalStrategy?.focus || item.psychologicalStrategy?.objective || "Enfoque y posicionamiento estratégico para captar clientes.",
        intencionBusqueda: item.strategy || item.psychologicalStrategy?.target || item.psychologicalStrategy?.intent || "Intención de búsqueda de los clientes.",
        keywordSeo: item.keyword || item.psychologicalStrategy?.keyword || "negocio, servicios",
        volumenBusqueda: item.searchVolume || item.search_volume || "100 - 1K"
      }))
    : [
        {
          id: 0,
          title: "El Secreto Oculto Detrás de los Servicios de Alta Gama que Nadie Te Cuenta",
          introduction: "Un análisis profundo de la psicología de consumo.",
          enfoqueEstrategico: "Despertar la curiosidad sobre tarifas premium.",
          intencionBusqueda: "Aspiracional",
          keywordSeo: "servicios premium",
          volumenBusqueda: "1K - 10K"
        }
      ];

  const topEmailsToRender = (strategyData?.modules?.emails || []).length > 0
    ? strategyData.modules.emails
    : [
        {
          title: "Email 1: Bienvenida e Historia de Conexión Emocional",
          introduction: "Consigue la primera impresión perfecta de forma automática y asienta tu autoridad desde el primer segundo. Rompe el hielo compartiendo tu misión de manera cercana y empática con tus nuevos suscriptores.",
          structure: {
            subject: "Bienvenido a bordo (y una confesión sincera...)",
            focus: "Establecer empatía instantánea presentando el propósito real detrás del proyecto.",
            sections: [
              { type: "Asunto Principal", text: "Bienvenido a bordo (y una confesión sincera...)" }
            ],
            tips: "No trates de vender nada en este primer contacto...",
            cta: "Haz clic aquí para leer nuestra carta de bienvenida sin costo."
          }
        }
      ];

  // Estados para el flujo de la nueva "Estrategia Comercial" interactiva (Imagen 1 e Imagen 2)
  const [isEstrategiaDrawerOpen, setIsEstrategiaDrawerOpen] = useState(false);
  const [activeComercialOption, setActiveComercialOption] = useState<
    | "avatar"
    | "testimonials"
    | "objections"
    | "benefits"
    | "proposition"
    | "offer"
    | "funnel"
    | "cta"
    | null
  >(null);
  const [avatarSubTab, setAvatarSubTab] = useState<
    "resumen" | "demografico" | "dolores" | "deseos" | "comportamiento"
  >("resumen");
  const [activeAvatarIndex, setActiveAvatarIndex] = useState<number | null>(null);
  const [selectedBlogForDrawer, setSelectedBlogForDrawer] = useState<any>(null);
  const [selectedEmailForDrawer, setSelectedEmailForDrawer] = useState<any>(null);
  const [selectedWhatsappForDrawer, setSelectedWhatsappForDrawer] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Modals de confirmación
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showCreateLandingConfirm, setShowCreateLandingConfirm] =
    useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [successSearchQuery, setSuccessSearchQuery] = useState("");

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
    if (activeDetailsDrawer || isEstrategiaDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDetailsDrawer, isEstrategiaDrawerOpen]);

  // Cargar proyectos recomendados al inicio o cuando sea necesario, o hidratar el dashboard si es modo standalone
  useEffect(() => {
    if (isStandaloneDashboard) {
      const initDashboard = async () => {
        setLoadingProjects(true);
        try {
          // 1. Obtener proyectos del usuario en tiempo real
          const myProjects = await api.getProjects();
          setUserActiveProjects(myProjects);
          
          // 2. Encontrar el primer proyecto del wizard o el más reciente
          const wizardProj = myProjects.find((p: any) => p.registered_via === "wizard" || p.name?.toLowerCase().includes("microblading") || p.name?.toLowerCase().includes("cejas")) || myProjects[0];
          
          if (wizardProj) {
            setSelectedProject(wizardProj);
            setUnlockedProject(wizardProj);
            
            // 3. Cargar estrategia psicologica profunda
            const strategy = await api.getProjectStrategy(wizardProj.id);
            setStrategyData(strategy);
            
            // 4. Buscar landing pages para extraer de forma dinamica el subdominio
            try {
              const pages = await api.getPages();
              const projPage = pages.find((pg: any) => pg.projectId === wizardProj.id);
              if (projPage && projPage.subdomain) {
                setCreatedPageSubdomain(projPage.subdomain);
                setIsLandingCreated(true);
              }
            } catch (err) {
              console.error("Error cargando páginas para el subdomain del wizard:", err);
            }
            
            // 5. Cargar guiones/hooks generados
            try {
              const library = await api.getHooksLibrary(1, 50, undefined, wizardProj.id);
              if (library && library.hooks) {
                setUnlockedHooks(library.hooks);
                setIsHooksUnlocked(true);
              }
            } catch (err) {
              console.error("Error cargando hooks para el wizard standalone:", err);
            }
            
            setStep("success");
          } else {
            setStep("welcome");
          }
        } catch (error) {
          console.error("Error en inicializacion de wizard standalone:", error);
        } finally {
          setLoadingProjects(false);
        }
      };
      initDashboard();
    } else {
      loadMasterProjects();
    }
  }, [isStandaloneDashboard]);

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

  // Cargar artículos reales de la estrategia maestra/proyecto cuando se desbloquee
  useEffect(() => {
    const fetchArticles = async () => {
      if (unlockedProject?.id) {
        console.log("🔍 [PROYECTO DESBLOQUEADO] Cargando artículos desde el backend para proyecto ID:", unlockedProject.id);
        try {
          const articles = await api.getArticlesByProject(unlockedProject.id);
          console.log("📊 [ARTÍCULOS ENCONTRADOS] Éxito al consultar artículos para el Wizard:", articles);
          setUnlockedArticles(articles);
        } catch (error) {
          console.error("❌ [ERROR ARTÍCULOS] Error al cargar artículos del proyecto en el Wizard:", error);
        }
      }
    };
    fetchArticles();
  }, [unlockedProject?.id]);

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
    setGenerationStatus("Estoy creando tu Página Web de Captura");

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
    setGenerationStatus("Creando video 1...");

    // 1. Iniciar la carga/generación en segundo plano de inmediato para no perder tiempo técnico
    const apiPromise = (async () => {
      try {
        let allHooks = strategyData?.modules?.hooks || [];

        if (allHooks.length === 0 && selectedProject) {
          const library = await api.getHooksLibrary(1, 50, selectedProject.id);
          allHooks = library.hooks || [];
        }

        allHooks = allHooks.filter(
          (h: any) =>
            h.isActive !== false && h.is_active !== 0 && h.is_active !== false,
        );

        if (allHooks.length > 0) {
          const shuffled = [...allHooks].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 3);
          const masterHookIds = selected.map((h: any) => h.id || h.masterHookId);

          if (unlockedProject?.id && masterHookIds.length > 0) {
            const response = await api.unlockMultipleHooks(
              unlockedProject.id,
              masterHookIds,
              true,
            );

            if (response && response.results) {
              return response.results.map((h: any, idx: number) => ({
                ...selected[idx],
                id: h.id,
                isGenerated: true,
              }));
            } else {
              return selected.map(h => ({ ...h, isGenerated: true }));
            }
          }
          return selected.map(h => ({ ...h, isGenerated: true }));
        }
        return [];
      } catch (err) {
        console.error("Error en segundo plano al cargar hooks:", err);
        return [];
      }
    })();

    // 2. Temporizador de cuenta progresiva artificial de exactamente 15 segundos
    const startTime = Date.now();
    const duration = 15000;

    const timer = setInterval(() => {
      const elapsedMs = Date.now() - startTime;

      if (elapsedMs < 5000) {
        // Segundos 0 al 5: "Creando video 1..." y avanzará uniformemente hasta 33%
        setGenerationStatus("Creando video 1...");
        const ratio = elapsedMs / 5000;
        setGenerationProgress(Math.min(33, Math.round(ratio * 33)));
      } else if (elapsedMs < 10000) {
        // Segundos 5 al 10: "Creando video 2..." y avanzará del 33% al 66%
        setGenerationStatus("Creando video 2...");
        const ratio = (elapsedMs - 5000) / 5000;
        setGenerationProgress(Math.min(66, 33 + Math.round(ratio * 33)));
      } else if (elapsedMs < 14000) {
        // Segundos 10 al 14: "Creando video 3..." y avanzará del 66% al 93%
        setGenerationStatus("Creando video 3...");
        const ratio = (elapsedMs - 10000) / 4000;
        setGenerationProgress(Math.min(93, 66 + Math.round(ratio * 27)));
      } else if (elapsedMs < duration) {
        // Último segundo (14 al 15): "Configurando activos de video..."
        setGenerationStatus("Configurando activos de video...");
        const ratio = (elapsedMs - 14000) / 1000;
        setGenerationProgress(Math.min(98, 93 + Math.round(ratio * 5)));
      } else {
        // Cumplidos los 15 segundos, esperamos a que el API resolve
        clearInterval(timer);

        apiPromise.then((finalizedHooks) => {
          if (finalizedHooks && finalizedHooks.length > 0) {
            setUnlockedHooks(finalizedHooks);
          }
          setGenerationProgress(100);
          setGenerationStatus("¡Videos Listos!");
          setIsHooksUnlocked(true);

          setTimeout(() => {
            setStep("show_hooks");
          }, 800);
        }).catch((error) => {
          console.error("❌ Error en proceso de ganchos:", error);
          setIsHooksUnlocked(true);
          setStep("show_hooks");
        });
      }
    }, 100);
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

  if (isStandaloneDashboard && (loadingProjects || !strategyData)) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-sans z-[60]">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-2 border-t-2 border-t-[#FF5A1F] border-white/10 rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-400 text-sm font-semibold">Cargando tu Centro de Operaciones estratégico...</p>
        </div>
      </div>
    );
  }

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
          <div className="bg-[#FF5A1F] rounded-lg flex items-center justify-center font-black text-white text-[11px] shadow-lg shadow-[#FF5A1F]/20 px-2 py-1 select-none">
            A.MKT
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Aprende.<span className="text-[#FF5A1F]">Marketing</span>
          </h2>
        </div>

        {/* Perfil del Usuario en Cabecera (sin fondo, flotando) */}
        <div className="flex items-center gap-3 sm:gap-4 z-10 font-sans">
          <div
            className="flex items-center gap-2 sm:gap-3 pl-2 pr-1 py-1.5 rounded-full select-none"
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
            <span className="text-sm font-bold text-[#B0B0B0] hidden sm:inline-flex">
              {user.name}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#B0B0B0] hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
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
                onClick={() => {
                  if (isStandaloneDashboard) {
                    navigate("/dashboard");
                  } else {
                    onComplete();
                  }
                }}
                className="px-8 py-4 sm:px-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FF5A1F]/30 text-white font-black text-sm tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF5A1F]/5"
              >
                Regresar al panel de administración
              </button>
            </div>
          </div>
        ) : step === "success" ? (
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 min-h-screen flex flex-col justify-center pt-36 md:pt-40 pb-16 relative z-10 font-sans">

            {/* Ambient Background Glows & Organic Design Patterns */}
            <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
              {/* Soft Radial Ambient Lights */}
              <div className="absolute top-[25%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#FF5A1F]/10 to-transparent blur-[140px] rounded-full"></div>
              <div className="absolute top-[40%] right-[15%] w-[600px] h-[600px] bg-radial from-[#FF5A1F]/8 to-transparent blur-[160px] rounded-full"></div>
              <div className="absolute bottom-[20%] left-[40%] w-[800px] h-[800px] bg-radial from-[#FF5A1F]/5 to-transparent blur-[180px] rounded-full"></div>
              
              {/* Polished Grid or Dot Overlays for Tridimentional Feeling */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#FF5A1F 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
              <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "repeating-radial-gradient(circle at 50% 30%, #FF5A1F 0px, transparent 100px, transparent 200px)" }}></div>
            </div>

            {/* NUEVA SECCIÓN: CABECERA E INTEGRACIÓN CON ALINEACIÓN LATERAL (MÁQUINA DE VENTAS LISTA) */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 text-left z-10 relative">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h1 className="text-white text-3xl md:text-4.5xl font-extrabold tracking-tight flex items-center gap-2">
                    ¡Tu Máquina de Ventas está lista! <span className="text-2xl md:text-3.5xl">🎉</span>
                  </h1>
                  <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                    Hemos creado tu sistema personalizado con IA basado en tus respuestas. <br className="hidden md:inline" />
                    Todo está preparado, solo falta activarlo para empezar a recibir clientes.
                  </p>
                </div>
                
                {/* Nuevo Bloque de Estatus de la Imagen 2 */}
                <div className="flex items-start gap-4 bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 rounded-3xl p-5 max-w-3xl shadow-lg shadow-black/20">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5 shadow-md">
                    <Sparkles className="w-5.5 h-5.5 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-white text-base md:text-lg font-extrabold tracking-tight">Tu primer proyecto está publicado</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                      Ya tienes una estrategia inicial, una página activa y 3 reels preparados para comenzar a atraer visitas.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isStandaloneDashboard) {
                    navigate("/dashboard");
                  } else {
                    onComplete();
                  }
                }}
                className="bg-[#0b0b0e]/80 text-[#ccc2bc] hover:text-white border border-white/5 hover:border-white/10 font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-300 cursor-pointer shrink-0 self-start md:self-auto flex items-center gap-2 mt-2"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al listado
              </button>
            </div>

            {/* GRID PRINCIPAL DE SISTEMA LISTO - DE DOS COLUMNAS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative overflow-hidden mb-8 font-sans bg-transparent z-10 text-left"
            >
              {/* COLUMNA IZQUIERDA: Tarjeta Principal del Producto + Métricas + Acceso Rápido (lg:col-span-8) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Tarjeta Principal del Producto */}
                <div className="bg-[#070709] border border-white/[0.04] p-6 md:p-8 rounded-[2rem] shadow-[0_0_50px_rgba(255,90,31,0.015)] relative overflow-hidden backdrop-blur-xl flex flex-col justify-between min-h-[500px]">
                  <div className="absolute top-0 left-0 w-80 h-80 bg-[#FF5A1F]/3 blur-[120px] rounded-full pointer-events-none"></div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch relative z-10 w-full mb-6">
                    {/* Banner Vertical Premium del Producto */}
                    <div className="md:col-span-4 min-h-[300px] md:min-h-auto flex">
                      <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-[#FF561E]/20 shadow-[0_0_25px_rgba(255,90,31,0.12)] bg-[#111113] group flex flex-col justify-between p-5">
                        <img 
                          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80" 
                          alt="Microblading Cover" 
                          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/40 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

                        {/* Top floating badge */}
                        <div className="bg-[#FF5A1F] px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md shrink-0 w-fit relative z-20">
                          <span className="text-white text-[9px] font-black uppercase tracking-wider">
                            PRODUCTO SELECCIONADO
                          </span>
                        </div>
                        
                        {/* Textos superpuestos en la zona inferior */}
                        <div className="text-left mt-auto relative z-20">
                          <span className="text-stone-300 text-[9px] font-bold tracking-widest block uppercase">
                            CURSO PROFESIONAL DE
                          </span>
                          <span className="text-[#FF5A1F] text-xl font-black tracking-normal uppercase block mt-1 leading-tight">
                            MICROBLADING
                          </span>
                          <span className="text-white text-base font-black tracking-normal uppercase block mt-0.5">
                            DE CEJAS
                          </span>

                          {/* Corona + ALTA DEMANDA */}
                          <div className="flex items-center gap-1.5 border-t border-white/10 pt-3 mt-3">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[9px] text-[#22C55E] font-black tracking-widest uppercase">
                              ALTA DEMANDA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contenido derecho del producto seleccionado */}
                    <div className="md:col-span-8 flex flex-col justify-between py-1 text-left space-y-6">
                      <div className="space-y-4">
                        {/* Título principal con la etiqueta brillante de publicado */}
                        <div className="flex flex-wrap items-center gap-3">
                          <h1 className="text-white text-2xl sm:text-3.5xl font-extrabold tracking-tight leading-snug">
                            Curso Profesional de Microblading de Cejas
                          </h1>
                          <span className="inline-flex items-center gap-1.5 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm select-none">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                            ● Publicado
                          </span>
                        </div>

                        {/* Texto explicativo */}
                        <p className="text-zinc-400 text-sm md:text-[15px] leading-relaxed max-w-xl font-medium">
                          Has elegido este producto en el wizard y hemos creado todo tu sistema para que empieces a venderlo con éxito.
                        </p>
                      </div>

                      {/* Tabla de Características Comerciales (Imagen 2 style) */}
                      <div className="bg-[#0b0b0e]/90 border border-zinc-900 rounded-2xl p-5 w-full">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-zinc-800/40">
                          {/* Categoría */}
                          <div className="flex flex-col text-left space-y-1">
                            <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 select-none">
                              <Crown className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                              Categoría
                            </span>
                            <span className="text-white font-extrabold text-xs sm:text-sm truncate">
                              Belleza y Estética
                            </span>
                          </div>

                          {/* Comisión de referencia */}
                          <div className="flex flex-col text-left space-y-1 pt-3 md:pt-0 md:pl-4">
                            <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 select-none">
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              Comisión ref.
                            </span>
                            <span className="text-emerald-400 font-black text-xs sm:text-sm leading-tight block">
                              USD 116 / $420
                            </span>
                          </div>

                          {/* Estado del proyecto */}
                          <div className="flex flex-col text-left space-y-1 pt-3 md:pt-0 md:pl-4">
                            <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 select-none">
                              <Check className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                              Estado proyecto
                            </span>
                            <span className="text-white font-extrabold text-xs sm:text-sm">
                              Activo
                            </span>
                          </div>

                          {/* Publicado el */}
                          <div className="flex flex-col text-left space-y-1 pt-3 md:pt-0 md:pl-4">
                            <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 select-none">
                              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              Publicado el
                            </span>
                            <span className="text-zinc-300 font-extrabold text-xs sm:text-sm">
                              15 may 2025
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Aviso oficial al pie */}
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold select-none">
                        <Info className="w-4 h-4 text-zinc-500" />
                        <span>Datos comerciales sujetos a cambios del productor.</span>
                      </div>

                      {/* Tres Sub-Tarjeta Informaciones a lo Ancho */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1">
                        {/* Item 1 */}
                        <div className="bg-[#040406]/20 border border-white/[0.02] p-3 rounded-2xl flex items-start gap-2.5 text-left">
                          <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-xs">Producto validado</span>
                            <span className="text-zinc-500 text-[10px] font-medium leading-snug mt-0.5">Alta calidad y excelente demanda en el mercado</span>
                          </div>
                        </div>

                        {/* Item 2 */}
                        <div className="bg-[#040406]/20 border border-white/[0.02] p-3 rounded-2xl flex items-start gap-2.5 text-left">
                          <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                            <Users className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-xs">Alta demanda</span>
                            <span className="text-zinc-500 text-[10px] font-medium leading-snug mt-0.5">Miles de búsquedas mensuales</span>
                          </div>
                        </div>

                        {/* Item 3 */}
                        <div className="bg-[#040406]/20 border border-white/[0.02] p-3 rounded-2xl flex items-start gap-2.5 text-left">
                          <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                            <Zap className="w-3.5 h-3.5 text-purple-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-xs">Sistema listo</span>
                            <span className="text-zinc-500 text-[10px] font-medium leading-snug mt-0.5">Todo generado y optimizado para vender</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fila Inferior (Barra de Elementos Generados) - Ancho completo con gradiente violeta sutil */}
                  <div className="bg-[#0f0e13]/55 border border-purple-500/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full mt-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <div className="flex items-baseline gap-1">
                          <span className="text-white text-2xl font-black">127</span>
                          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">elementos generados</span>
                        </div>
                        <span className="text-zinc-400 text-[9px] uppercase font-bold tracking-widest leading-none mt-0.5">para tu negocio</span>
                      </div>
                    </div>
                    
                    <p className="text-zinc-300 text-xs font-medium max-w-sm text-left leading-normal sm:mx-4 flex-1">
                      Todo lo que necesitas para captar, convertir y vender de forma automática.
                    </p>
                    
                    <button
                      onClick={() => {
                        document.getElementById("success-estrategia-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="sm:ml-auto bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 text-white border border-[#FF5A1F]/30 hover:border-[#FF5A1F]/50 font-bold text-xs py-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      Ver guía rápida <ChevronRight className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    </button>
                  </div>
                </div>

                {/* NUEVA SECCIÓN: Resumen de rendimiento (Sección de métricas con ondas de gráfico) */}
                <div className="bg-[#070709] border border-white/[0.04] p-6 md:p-8 rounded-[2rem] shadow-[0_0_50px_rgba(255,90,31,0.015)] relative overflow-hidden backdrop-blur-xl flex flex-col text-left space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-white text-lg font-extrabold tracking-tight">Resumen de rendimiento</h2>
                    <p className="text-zinc-500 text-xs font-semibold">Métricas de conversión y visitas generadas para tu negocio en tiempo real</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    {/* Visitas a la página */}
                    <div className="bg-[#0b0b0e] border border-zinc-900/60 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#FF5A1F]/30 transition-all duration-300 min-h-[145px]">
                      {/* Wave graph in background */}
                      <div className="absolute inset-x-0 bottom-0 h-10 opacity-15 pointer-events-none">
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,25 Q15,10 30,22 T60,8 T90,18 T100,6 L100,30 L0,30 Z" fill="url(#orange-grad-gp1)" stroke="#FF5A1F" strokeWidth="1.5" />
                          <defs>
                            <linearGradient id="orange-grad-gp1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="space-y-1.5 relative z-10 text-left">
                        <span className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-wider block">Visitas a la página</span>
                        <span className="text-white text-2xl md:text-3xl font-black block">487</span>
                      </div>
                      <span className="text-emerald-400 font-extrabold text-[10px] inline-flex items-center gap-1 relative z-10 self-start bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-2">
                        ↑ 18%
                      </span>
                    </div>

                    {/* Registros (leads) */}
                    <div className="bg-[#0b0b0e] border border-zinc-900/60 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#FF5A1F]/30 transition-all duration-300 min-h-[145px]">
                      <div className="absolute inset-x-0 bottom-0 h-10 opacity-15 pointer-events-none">
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,28 Q20,8 40,24 T70,12 T100,16 L100,30 L0,30 Z" fill="url(#orange-grad-gp2)" stroke="#FF5A1F" strokeWidth="1.5" />
                          <defs>
                            <linearGradient id="orange-grad-gp2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="space-y-1.5 relative z-10 text-left">
                        <span className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-wider block">Registros (leads)</span>
                        <span className="text-white text-2xl md:text-3xl font-black block">12</span>
                      </div>
                      <span className="text-emerald-400 font-extrabold text-[10px] inline-flex items-center gap-1 relative z-10 self-start bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-2">
                        ↑ 9%
                      </span>
                    </div>

                    {/* Tasa de conversión */}
                    <div className="bg-[#0b0b0e] border border-zinc-900/60 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#FF5A1F]/30 transition-all duration-300 min-h-[145px]">
                      <div className="absolute inset-x-0 bottom-0 h-10 opacity-15 pointer-events-none">
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,20 Q18,24 35,14 T72,22 T100,10 L100,30 L0,30 Z" fill="url(#orange-grad-gp3)" stroke="#FF5A1F" strokeWidth="1.5" />
                          <defs>
                            <linearGradient id="orange-grad-gp3" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="space-y-1.5 relative z-10 text-left">
                        <span className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-wider block">Tasa de conversión</span>
                        <span className="text-white text-2xl md:text-3xl font-black block">2,46%</span>
                      </div>
                      <span className="text-emerald-400 font-extrabold text-[10px] inline-flex items-center gap-1 relative z-10 self-start bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-2">
                        ↑ 0,8%
                      </span>
                    </div>

                    {/* Comisión estimada */}
                    <div className="bg-[#0b0b0e] border border-zinc-900/60 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#FF5A1F]/30 transition-all duration-300 min-h-[145px]">
                      <div className="absolute inset-x-0 bottom-0 h-10 opacity-15 pointer-events-none">
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,15 Q25,28 50,12 T82,6 T100,22 L100,30 L0,30 Z" fill="url(#orange-grad-gp4)" stroke="#FF5A1F" strokeWidth="1.5" />
                          <defs>
                            <linearGradient id="orange-grad-gp4" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="space-y-1.5 relative z-10 text-left">
                        <span className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-wider block">Comisión estimada</span>
                        <span className="text-white text-xl md:text-2xl lg:text-3xl font-black block">USD 1,392</span>
                      </div>
                      <span className="text-emerald-400 font-extrabold text-[10px] inline-flex items-center gap-1 relative z-10 self-start bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-2">
                        ↑ 12%
                      </span>
                    </div>
                  </div>
                </div>

                {/* NUEVA SECCIÓN: Acceso rápido */}
                <div className="bg-[#070709] border border-white/[0.04] p-6 md:p-8 rounded-[2rem] shadow-[0_0_50px_rgba(255,90,31,0.015)] relative overflow-hidden backdrop-blur-xl flex flex-col text-left space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-white text-lg font-extrabold tracking-tight">Acceso rápido</h2>
                    <p className="text-zinc-500 text-xs font-semibold">Navega libremente y previsualiza los diferentes módulos listos de tu sistema</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                    {/* Estrategia */}
                    <button
                      onClick={() => setIsEstrategiaDrawerOpen(true)}
                      className="bg-[#0b0b0e] border border-zinc-900 hover:border-[#FF5A1F]/40 p-4.5 rounded-2xl flex flex-col text-left space-y-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/25 flex items-center justify-center text-[#FF5A1F] transition-all group-hover:bg-[#FF5A1F]/20">
                        <Target className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider block leading-none">Estrategia</span>
                        <span className="text-white text-xs sm:text-xs md:text-sm font-extrabold group-hover:text-[#FF5A1F] transition-colors flex items-center gap-0.5 mt-1">
                          Ver estrategia <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </button>

                    {/* Página de captación */}
                    <button
                      onClick={() => setActiveDetailsDrawer("landing")}
                      className="bg-[#0b0b0e] border border-zinc-900 hover:border-blue-500/40 p-4.5 rounded-2xl flex flex-col text-left space-y-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 transition-all group-hover:bg-blue-500/20">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider block leading-none">Página de captación</span>
                        <span className="text-white text-xs sm:text-xs md:text-sm font-extrabold group-hover:text-blue-400 transition-colors flex items-center gap-0.5 mt-1">
                          Ver página <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </button>

                    {/* Reels de atracción */}
                    <button
                      onClick={() => {
                        setSelectedHookForDrawer(null);
                        setActiveDetailsDrawer("hooks");
                      }}
                      className="bg-[#0b0b0e] border border-zinc-900 hover:border-purple-500/40 p-4.5 rounded-2xl flex flex-col text-left space-y-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 transition-all group-hover:bg-purple-500/20">
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider block leading-none">Reels de atracción</span>
                        <span className="text-white text-xs sm:text-xs md:text-sm font-extrabold group-hover:text-purple-400 transition-colors flex items-center gap-0.5 mt-1">
                          Ver 3 reels listos <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </button>

                    {/* Blog */}
                    <button
                      onClick={() => {
                        setSelectedBlogForDrawer(topBlogsToRender[0]);
                        setActiveDetailsDrawer("blog");
                      }}
                      className="bg-[#0b0b0e] border border-zinc-900 hover:border-emerald-500/40 p-4.5 rounded-2xl flex flex-col text-left space-y-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 transition-all group-hover:bg-emerald-500/20">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider block leading-none">Blog</span>
                        <span className="text-white text-xs sm:text-xs md:text-sm font-extrabold group-hover:text-emerald-400 transition-colors flex items-center gap-0.5 mt-1">
                          1 artículo <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: Progreso del Sistema completo y Suscripciones (lg:col-span-4) */}
              <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                
                {/* 1. Progreso de tu sistema */}
                <div className="bg-[#070709] border border-white/[0.04] p-6 rounded-[2rem] shadow-[0_0_50px_rgba(255,90,31,0.015)] relative overflow-hidden backdrop-blur-xl flex flex-col">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5A1F]/3 blur-[120px] rounded-full pointer-events-none"></div>

                  <div className="space-y-5 relative z-10 w-full flex-1 flex flex-col justify-between">
                    {/* Header */}
                    <h3 className="text-white text-lg font-bold text-left tracking-tight border-b border-white/[0.03] pb-3 select-none">
                      Progreso de tu sistema
                    </h3>

                    {/* Círculo Gráfico Completo */}
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-[140px] h-[140px] transform -rotate-90">
                          {/* Círculo de fondo oscuro */}
                          <circle
                            cx="70"
                            cy="70"
                            r="55"
                            className="stroke-[#1C1C1E]"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          {/* Círculo de progreso animado al 85% */}
                          <motion.circle
                            cx="70"
                            cy="70"
                            r="55"
                            className="stroke-[#FF5A1F]"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray="345.6" /* 2 * PI * r (55) ≈ 345.6 */
                            initial={{ strokeDashoffset: 345.6 }}
                            animate={{ 
                              strokeDashoffset: 345.6 * (1 - 0.85)
                            }}
                            transition={{ 
                              strokeDashoffset: { duration: 1.5, ease: "easeOut", delay: 0.2 }
                            }}
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Textos centrales */}
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-white tracking-tighter leading-none mt-1">85%</span>
                          <span className="text-[8px] tracking-[0.2em] text-zinc-400 font-extrabold mt-1.5 uppercase">COMPLETADO</span>
                        </div>
                      </div>
                      <span className="text-zinc-400 font-bold text-xs text-center max-w-[220px] mt-4 leading-normal select-none">
                        Solo faltan 3 elementos para activar el sistema completo.
                      </span>
                    </div>

                    {/* Listado de Bloqueados PRO */}
                    <div className="bg-[#040406]/60 border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-3">
                      {/* WhatsApp */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.03]">
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="text-xs font-bold text-zinc-300">WhatsApp Automatizado</span>
                        </div>
                        <span className="px-2 py-0.5 border border-[#FF5A1F]/30 rounded text-[9px] font-black text-[#FF5A1F] tracking-wide bg-[#FF5A1F]/5 shrink-0 select-none">PRO</span>
                      </div>

                      {/* Automatizaciones */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.03]">
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="text-xs font-bold text-zinc-300">Automatizaciones Avanzadas</span>
                        </div>
                        <span className="px-2 py-0.5 border border-[#FF5A1F]/30 rounded text-[9px] font-black text-[#FF5A1F] tracking-wide bg-[#FF5A1F]/5 shrink-0 select-none">PRO</span>
                      </div>

                      {/* Artículos */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="text-xs font-bold text-zinc-300">15 Artículos SEO adicionales</span>
                        </div>
                        <span className="px-2 py-0.5 border border-[#FF5A1F]/30 rounded text-[9px] font-black text-[#FF5A1F] tracking-wide bg-[#FF5A1F]/5 shrink-0 select-none">PRO</span>
                      </div>
                    </div>

                    {/* Botón CTA Ver Plan PRO */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Crown className="w-4 h-4 stroke-[2.5]" />
                        Ver plan PRO
                      </button>
                      <span className="text-[10px] text-zinc-500 font-semibold text-center block leading-none select-none">
                        y desbloquea todo el potencial
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Tarjeta del Plan Gratuito (Imagen 2 style) */}
                <div className="bg-[#070709] border border-white/[0.04] p-5.5 rounded-[2rem] shadow-[0_0_50px_rgba(255,90,31,0.015)] relative overflow-hidden backdrop-blur-xl flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-bold text-xs flex items-center gap-1.5 uppercase tracking-widest select-none">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Plan gratuito activo
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#040406]/60 border border-zinc-900 rounded-xl p-3 text-center">
                    <div className="flex flex-col">
                      <span className="text-white font-extrabold text-xs sm:text-sm">1</span>
                      <span className="text-zinc-500 text-[8px] font-semibold mt-0.5">Proyecto activo</span>
                    </div>
                    <div className="flex flex-col border-x border-zinc-900">
                      <span className="text-[#FF5A1F] font-extrabold text-xs sm:text-sm">3/3</span>
                      <span className="text-zinc-500 text-[8px] font-semibold mt-0.5">Reels utilizados</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-extrabold text-xs sm:text-sm">1/1</span>
                      <span className="text-zinc-500 text-[8px] font-semibold mt-0.5">Artículo mes</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-3 bg-[#FF5A1F] hover:bg-[#E54E15] text-white font-[#FF5A1F] font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md cursor-pointer select-none"
                  >
                    Mejorar a Pro
                  </button>
                </div>

                {/* 3. Tarjeta Lleva tu proyecto al siguiente nivel (Imagen 2 style) */}
                <div className="bg-[#070709] border border-white/[0.04] p-6 rounded-[2rem] shadow-[0_0_50px_rgba(255,90,31,0.015)] relative overflow-hidden backdrop-blur-xl flex flex-col space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-white text-base font-extrabold tracking-tight">Lleva tu proyecto al siguiente nivel</h4>
                    <p className="text-zinc-500 text-xs font-semibold leading-relaxed">
                      Automatiza el seguimiento, crea más contenido y escala tu estrategia para generar más ventas.
                    </p>
                  </div>

                  {/* Lista de ventajas con iconos de check naranja */}
                  <div className="space-y-2.5 pt-1">
                    {[
                      "Email marketing automatizado",
                      "Secuencias de WhatsApp",
                      "Hasta 30 reels al mes",
                      "Hasta 15 artículos al mes",
                      "Hasta 3 proyectos activos",
                      "Automatizaciones avanzadas"
                    ].map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="text-zinc-300 text-xs font-bold">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#E54E15] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-[#FF5A1F]/15 active:scale-98 relative overflow-hidden flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <span>Mejorar a Pro — $39 USD/mes</span>
                  </button>
                  <p className="text-[10px] text-zinc-500 font-semibold text-center select-none">
                    Cancela cuando quieras. Sin compromiso de permanencia.
                  </p>
                </div>

                {/* 4. Tarjeta Siguiente paso recomendado */}
                <div className="bg-[#10B981]/5 border border-[#10B981]/20 p-5.5 rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.015)] relative overflow-hidden flex flex-col space-y-4 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center text-[#10B981]">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[#10B981] text-[9px] uppercase font-black tracking-widest block leading-none">Siguiente paso recomendado</span>
                      <span className="text-white text-xs font-bold mt-1 block">Seguimiento automático</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-zinc-200 text-xs font-extrabold">Activar el seguimiento automático</h5>
                    <p className="text-zinc-400 text-[11px] font-medium leading-relaxed">
                      Conecta tu página con una secuencia de correos para convertir tus registros en clientes de forma automática.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/15"
                  >
                    <span>Activar email marketing</span>
                    <span className="bg-black/20 text-white font-black text-[8px] px-1.5 py-0.5 rounded leading-none">PRO</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* NUEVA SECCIÓN: Esto hemos generado para ti (Diseño Elegante de 6 Tarjetas) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full bg-transparent p-0 relative overflow-hidden mb-12 font-sans text-left"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5A1F]/3 blur-3xl rounded-full pointer-events-none"></div>
              
              {/* Cabecera del Nuevo Bloque */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/[0.04] gap-4">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF5A1F] animate-pulse shrink-0" />
                    <h2 className="text-white text-xl md:text-2xl font-extrabold tracking-tight font-sans">
                      Esto hemos <span className="text-[#FF5D1E]">generado</span> para ti
                    </h2>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm font-medium block">
                    Previsualiza cada parte de tu sistema. Haz clic en cualquier tarjeta para ver el contenido completo.
                  </p>
                </div>
              </div>

              {/* Grid de las 6 Tarjetas (Ancho Completo, 3 Columnas) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
                
                {/* TARJETA 1: Estrategia de Ventas */}
                <div 
                  onClick={() => {
                    setIsEstrategiaDrawerOpen(true);
                  }}
                  className="bg-[#0b0b0e] border border-white/[0.04] hover:border-[#FF5D1E]/40 rounded-3xl p-6 md:p-7 flex flex-col justify-between min-h-[320px] relative group transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer select-none shadow-[0_10px_30px_rgba(0,0,0,0.55)] md:hover:shadow-[0_0_30px_rgba(255,93,30,0.06)]"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/25 flex items-center justify-center text-[#FF5D1E] shrink-0 shadow-lg shadow-[#FF5A1F]/5 group-hover:bg-[#FF5A1F]/20 group-hover:border-[#FF5A1F]/40 transition-all duration-300">
                        <Target className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="text-white text-base md:text-[17px] font-extrabold tracking-tight leading-none">Estrategia de Ventas</h3>
                        <span className="text-[#FF5D1E] text-[10px] uppercase font-black tracking-wider mt-1.5 leading-none select-none">
                          PLAN DE ATRACCIÓN
                        </span>
                      </div>
                    </div>
                    {/* Desc */}
                    <p className="text-[#f3efec] text-xs sm:text-[13px] leading-relaxed text-left font-medium min-h-[72px] mt-2">
                      La hoja de ruta maestra para escalar tu facturación. Diseñada con ingeniería persuasiva y psicología de consumo para posicionarte como líder indiscutible en el nicho de belleza.
                    </p>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2 text-white">
                      <FileText className="w-[18px] h-[18px] text-white shrink-0" />
                      <span className="text-white text-xs sm:text-[13px] font-medium tracking-tight select-none">
                        8 componentes creados
                      </span>
                    </div>
                    <div className="bg-[#FF5D1E] hover:bg-[#FF6E33] text-white text-xs sm:text-sm font-extrabold py-2 md:py-2.5 px-5 md:px-6 rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 hover:shadow-[#FF5D1E]/25 select-none">
                      Explorar <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* TARJETA 2: Pagina Web de Captura */}
                <div 
                  onClick={() => {
                    setActiveDetailsDrawer("landing");
                  }}
                  className="bg-[#0b0b0e] border border-white/[0.04] hover:border-[#0C62E6]/40 rounded-3xl p-6 md:p-7 flex flex-col justify-between min-h-[320px] relative group transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer select-none shadow-[0_10px_30px_rgba(0,0,0,0.55)] md:hover:shadow-[0_0_30px_rgba(12,98,230,0.06)]"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#0C62E6]/10 border border-[#0C62E6]/25 flex items-center justify-center text-[#0c62e6] shrink-0 shadow-lg shadow-[#0c62e6]/5 group-hover:bg-[#0C62E6]/20 group-hover:border-[#0C62E6]/40 transition-all duration-300">
                        <Globe className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="text-white text-base md:text-[17px] font-extrabold tracking-tight leading-none">Pagina Web de Captura</h3>
                        <span className="text-[#0C62E6] text-[10px] uppercase font-black tracking-wider mt-1.5 leading-none select-none">
                          GENERADOR DE PROSPECTOS
                        </span>
                      </div>
                    </div>
                    {/* Desc */}
                    <p className="text-[#f3efec] text-xs sm:text-[13px] leading-relaxed text-left font-medium min-h-[72px] mt-2">
                      Tu máquina digital de captación 24/7. Diseños ultra-veloces optimizados para dispositivos móviles que convierten visitas frígidas en registros de alta calidad de forma instantánea.
                    </p>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2 text-white">
                      <FileText className="w-[18px] h-[18px] text-white shrink-0" />
                      <span className="text-white text-xs sm:text-[13px] font-medium tracking-tight select-none">
                        2 páginas optimizadas
                      </span>
                    </div>
                    <div className="bg-[#0C62E6] hover:bg-[#2075F3] text-white text-xs sm:text-sm font-extrabold py-2 md:py-2.5 px-5 md:px-6 rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 hover:shadow-[#0C62E6]/25 select-none">
                      Explorar <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* TARJETA 3: Video Hooks de Atraccion */}
                <div 
                  onClick={() => {
                    setSelectedHookForDrawer(null);
                    setActiveDetailsDrawer("hooks");
                  }}
                  className="bg-[#0b0b0e] border border-white/[0.04] hover:border-[#FF5D1E]/40 rounded-3xl p-6 md:p-7 flex flex-col justify-between min-h-[320px] relative group transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer select-none shadow-[0_10px_30px_rgba(0,0,0,0.55)] md:hover:shadow-[0_0_30px_rgba(255,93,30,0.06)]"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#FF5D1E]/10 border border-[#FF5D1E]/25 flex items-center justify-center text-[#FF5D1E] shrink-0 shadow-lg shadow-[#FF5D1E]/5 group-hover:bg-[#FF5D1E]/20 group-hover:border-[#FF5D1E]/40 transition-all duration-300">
                        <Video className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="text-white text-base md:text-[17px] font-extrabold tracking-tight leading-none">Video Hooks de Atraccion</h3>
                        <span className="text-[#FF5D1E] text-[10px] uppercase font-black tracking-wider mt-1.5 leading-none select-none">
                          GUIONES DE ALTO IMPACTO
                        </span>
                      </div>
                    </div>
                    {/* Desc */}
                    <p className="text-[#f3efec] text-xs sm:text-[13px] leading-relaxed text-left font-medium min-h-[72px] mt-2">
                      Secuestra la atención en los primeros 3 segundos. Guiones magnéticos estructurados bajo la psicología de retención para disparar el algoritmo de Reels y TikTok.
                    </p>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2 text-white">
                      <PlayCircle className="w-[18px] h-[18px] text-white shrink-0" />
                      <span className="text-white text-xs sm:text-[13px] font-medium tracking-tight select-none">
                        20 ganchos persuasivos
                      </span>
                    </div>
                    <div className="bg-[#FF5D1E] hover:bg-[#FF6E33] text-white text-xs sm:text-sm font-extrabold py-2 md:py-2.5 px-5 md:px-6 rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 hover:shadow-[#FF5D1E]/25 select-none">
                      Explorar <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* TARJETA 4: Artículos de Blog (SEO) */}
                <div 
                  onClick={() => {
                    setSelectedBlogForDrawer(topBlogsToRender[0]);
                    setActiveDetailsDrawer("blog");
                  }}
                  className="bg-[#0b0b0e] border border-white/[0.04] hover:border-[#8B5CF6]/40 rounded-3xl p-6 md:p-7 flex flex-col justify-between min-h-[320px] relative group transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer select-none shadow-[0_10px_30px_rgba(0,0,0,0.55)] md:hover:shadow-[0_0_30px_rgba(139,92,246,0.06)]"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#5D32A1]/10 border border-[#5D32A1]/25 flex items-center justify-center text-[#8d54f7] shrink-0 shadow-lg shadow-[#5D32A1]/5 group-hover:bg-[#5D32A1]/20 group-hover:border-[#5D32A1]/40 transition-all duration-300">
                        <FileText className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="text-white text-base md:text-[17px] font-extrabold tracking-tight leading-none">Artículos de Blog (SEO)</h3>
                        <span className="text-[#8B5CF6] text-[10px] uppercase font-black tracking-wider mt-1.5 leading-none select-none">
                          TRÁFICO ORGÁNICO CONSTANTE
                        </span>
                      </div>
                    </div>
                    {/* Desc */}
                    <p className="text-[#f3efec] text-xs sm:text-[13px] leading-relaxed text-left font-medium min-h-[72px] mt-2">
                      Domina los motores de búsqueda de forma gratuita. Contenido editorial optimizado para responder con precisión milimétrica a la intención de compra real de tu audiencia.
                    </p>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2 text-white">
                      <FileText className="w-[18px] h-[18px] text-white shrink-0" />
                      <span className="text-white text-xs sm:text-[13px] font-medium tracking-tight select-none">
                        12 artículos de blog
                      </span>
                    </div>
                    <div className="bg-[#5D32A1] hover:bg-[#7241C2] text-white text-xs sm:text-sm font-extrabold py-2 md:py-2.5 px-5 md:px-6 rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 hover:shadow-[#5D32A1]/25 select-none">
                      Explorar <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* TARJETA 5: Email Marketing Automatizado */}
                <div 
                  onClick={() => {
                    setSelectedEmailForDrawer(topEmailsToRender[0]);
                    setActiveDetailsDrawer("email");
                  }}
                  className="bg-[#0b0b0e] border border-white/[0.04] hover:border-[#F59E0B]/40 rounded-3xl p-6 md:p-7 flex flex-col justify-between min-h-[320px] relative group transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer select-none shadow-[0_10px_30px_rgba(0,0,0,0.55)] md:hover:shadow-[0_0_30px_rgba(245,158,11,0.06)]"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#C68307]/10 border border-[#C68307]/25 flex items-center justify-center text-[#ffad16] shrink-0 shadow-lg shadow-[#C68307]/5 group-hover:bg-[#C68307]/20 group-hover:border-[#C68307]/40 transition-all duration-300">
                        <Mail className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="text-white text-base md:text-[17px] font-extrabold tracking-tight leading-none">Email Marketing Automatizado</h3>
                        <span className="text-[#F59E0B] text-[10px] uppercase font-black tracking-wider mt-1.5 leading-none select-none">
                          NUTRICIÓN Y AUTOMATIZACIÓN
                        </span>
                      </div>
                    </div>
                    {/* Desc */}
                    <p className="text-[#f3efec] text-xs sm:text-[13px] leading-relaxed text-left font-medium min-h-[72px] mt-2">
                      Automatiza tu confianza y multiplica tus ventas de forma pasiva. Flujos inteligentes con storytelling cautivador que derrumban objeciones de costo.
                    </p>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2 text-white">
                      <Mail className="w-[18px] h-[18px] text-white shrink-0" />
                      <span className="text-white text-xs sm:text-[13px] font-medium tracking-tight select-none">
                        3 emails de secuencia
                      </span>
                    </div>
                    <div className="bg-[#C68307] hover:bg-[#E39812] text-white text-xs sm:text-sm font-extrabold py-2 md:py-2.5 px-5 md:px-6 rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 hover:shadow-[#C68307]/25 select-none">
                      Explorar <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* TARJETA 6: Secuencias de WhatsApp */}
                <div 
                  onClick={() => {
                    setActiveDetailsDrawer("avatar");
                  }}
                  className="bg-[#0b0b0e] border border-white/[0.04] hover:border-[#03B86F]/40 rounded-3xl p-6 md:p-7 flex flex-col justify-between min-h-[320px] relative group transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer select-none shadow-[0_10px_30px_rgba(0,0,0,0.55)] md:hover:shadow-[0_0_30px_rgba(3,184,111,0.06)]"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#039E5F]/10 border border-[#039E5F]/25 flex items-center justify-center text-[#03b86f] shrink-0 shadow-lg shadow-[#039E5F]/5 group-hover:bg-[#039E5F]/20 group-hover:border-[#039E5F]/40 transition-all duration-300">
                        <Users className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="text-white text-base md:text-[17px] font-extrabold tracking-tight leading-none">Secuencias de WhatsApp</h3>
                        <span className="text-[#34D399] text-[10px] uppercase font-black tracking-wider mt-1.5 leading-none select-none">
                          AVATAR PSICOGRÁFICO
                        </span>
                      </div>
                    </div>
                    {/* Desc */}
                    <p className="text-[#f3efec] text-xs sm:text-[13px] leading-relaxed text-left font-medium min-h-[72px] mt-2">
                      El mapa de empatía psicográfico definitivo de tu prospecto ideal. Identifica sus anhelos más profundos, miedos y frenos secretos para comunicar con precisión quirúrgica.
                    </p>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2 text-white">
                      <Users className="w-[18px] h-[18px] text-white shrink-0" />
                      <span className="text-white text-xs sm:text-[13px] font-medium tracking-tight select-none">
                        1 perfil psicográfico
                      </span>
                    </div>
                    <div className="bg-[#039E5F] hover:bg-[#04BE73] text-white text-xs sm:text-sm font-extrabold py-2 md:py-2.5 px-5 md:px-6 rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 hover:shadow-[#039E5F]/25 select-none">
                      Explorar <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Pie de Sección de Acción Directa */}
              <div className="bg-[#0b0b0e] border border-white/[0.04] p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 w-full mt-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#FFAD16] shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <Lightbulb className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-white font-extrabold text-base sm:text-lg leading-snug">
                      Todo listo para impulsar tu negocio
                    </h4>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 font-medium leading-relaxed">
                      Contenido creado, optimizado y estructurado para que obtengas resultados.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("success-estrategia-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="border border-[#FF5A1F]/30 hover:border-[#FF5A1F]/60 bg-transparent hover:bg-[#FF5A1F]/5 text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-full transition-all duration-300 w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-md select-none"
                >
                  Ver guía rápida <ChevronRight className="w-4 h-4 text-[#FF5A1F]" />
                </button>
              </div>
            </motion.div>

            {/* NUEVA SECCIÓN DE BENEFICIOS PRO - DISEÑO EXACTO A LA IMAGEN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
              className="w-full bg-[#0D0D0F] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden backdrop-blur-md mb-8 font-sans text-left animate-fade-in"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5A1F]/5 blur-3xl rounded-full pointer-events-none"></div>

              {/* Cabecera de la Sección */}
              <div className="mb-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF5A1F] text-xl">⚡</span>
                  <h2 className="text-white text-lg md:text-xl font-bold tracking-tight text-left">
                    Con PRO desbloqueas el poder completo de tu sistema
                  </h2>
                </div>
                <p className="text-gray-400 text-sm max-w-4xl leading-relaxed">
                  Activa tu plan PRO y obtén acceso a todas las herramientas, automatizaciones y funciones avanzadas para que tu sistema trabaje por ti 24/7.
                </p>
              </div>

              {/* Grid de 6 Tarjetas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {/* 1. Publicar y conectar tu landing page */}
                <div className="bg-[#111113]/55 border border-white/5 rounded-2xl p-5 flex gap-4 hover:border-[#FF5A1F]/20 hover:bg-[#111113] transition-all duration-300 group/card">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 group-hover/card:scale-110 transition-transform">
                    <Globe className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-sm md:text-base font-bold tracking-tight">
                      Publicar y conectar tu landing page
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Publica tu página de captura en un dominio profesional y comienza a recibir leads.
                    </p>
                  </div>
                </div>

                {/* 2. Automatizaciones completas */}
                <div className="bg-[#111113]/55 border border-white/5 rounded-2xl p-5 flex gap-4 hover:border-[#FF5A1F]/20 hover:bg-[#111113] transition-all duration-300 group/card">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 group-hover/card:scale-110 transition-transform">
                    <Zap className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-sm md:text-base font-bold tracking-tight">
                      Automatizaciones completas
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Activa funnels, seguimientos automáticos y flujos que venden por ti.
                    </p>
                  </div>
                </div>

                {/* 3. WhatsApp Automatizado */}
                <div className="bg-[#111113]/55 border border-white/5 rounded-2xl p-5 flex gap-4 hover:border-[#FF5A1F]/20 hover:bg-[#111113] transition-all duration-300 group/card">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 group-hover/card:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-sm md:text-base font-bold tracking-tight">
                      WhatsApp Automatizado
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Responde, cualifica y convierte leads desde WhatsApp en automático.
                    </p>
                  </div>
                </div>

                {/* 4. 15 Artículos SEO al mes */}
                <div className="bg-[#111113]/55 border border-white/5 rounded-2xl p-5 flex gap-4 hover:border-[#FF5A1F]/20 hover:bg-[#111113] transition-all duration-300 group/card">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 group-hover/card:scale-110 transition-transform">
                    <FileText className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-sm md:text-base font-bold tracking-tight">
                      15 Artículos SEO al mes
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Contenido optimizado cada mes para posicionar tu negocio en Google.
                    </p>
                  </div>
                </div>

                {/* 5. Dominio Profesional */}
                <div className="bg-[#111113]/55 border border-white/5 rounded-2xl p-5 flex gap-4 hover:border-[#FF5A1F]/20 hover:bg-[#111113] transition-all duration-300 group/card">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 group-hover/card:scale-110 transition-transform">
                    <Copy className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-sm md:text-base font-bold tracking-tight">
                      Dominio Profesional
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Conecta tu propio dominio y proyecta una imagen profesional y confiable.
                    </p>
                  </div>
                </div>

                {/* 6. Acceso al panel completo */}
                <div className="bg-[#111113]/55 border border-white/5 rounded-2xl p-5 flex gap-4 hover:border-[#FF5A1F]/20 hover:bg-[#111113] transition-all duration-300 group/card">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 group-hover/card:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-sm md:text-base font-bold tracking-tight">
                      Acceso al panel completo
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Gestiona todo tu sistema desde un dashboard profesional y centralizado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra inferior de Características de confianza */}
              <div className="border-t border-white/5 pt-5 flex flex-wrap items-center justify-between gap-5 text-gray-400 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[9px] font-bold">✓</div>
                  <span>Soporte prioritario</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[9px] font-bold">✓</div>
                  <span>Plantillas premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[#22c55e] flex items-center justify-center text-[9px] font-bold">✓</div>
                  <span>Actualizaciones constantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[#22c55e] flex items-center justify-center text-[9px] font-bold">✓</div>
                  <span>Reportes y analíticas avanzadas</span>
                </div>
              </div>
            </motion.div>

            {/* NUEVA SECCIÓN: PRÓXIMOS PASOS RECOMENDADOS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="w-full bg-[#0D0D0D]/90 border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden backdrop-blur-md mb-8 font-sans text-left"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
              
              <h3 className="text-white text-[11px] font-black tracking-[0.25em] mb-6 uppercase pl-1 opacity-90">
                PRÓXIMOS PASOS RECOMENDADOS
              </h3>

              {/* 3 Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Passo 1 */}
                <div className="bg-[#141415]/80 border border-white/5 hover:border-[#FF5A1F]/20 rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="space-y-4">
                    {/* Badge y Titulo */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0">
                        1
                      </div>
                      <h4 className="text-white text-base font-bold tracking-tight">
                        Revisa tu estrategia
                      </h4>
                    </div>

                    {/* Descrip y Visual */}
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed max-w-[65%]">
                        Alinea tu estrategia con tus objetivos y tu mercado.
                      </p>
                      
                      {/* Floating illustration */}
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                        <Target className="w-8 h-8 text-white/90 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Accion Link */}
                  <button
                    onClick={() => {
                      document.getElementById("success-estrategia-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="text-[#FF5A1F] hover:text-white font-black text-xs uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 self-start cursor-pointer bg-transparent border-none py-0 px-0"
                  >
                    Abrir estrategia <span className="group-hover:translate-x-1 transition-transform duration-300">➔</span>
                  </button>
                </div>

                {/* Passo 2 */}
                <div className="bg-[#141415]/80 border border-white/5 hover:border-[#FF5A1F]/20 rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="space-y-4">
                    {/* Badge y Titulo */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0">
                        2
                      </div>
                      <h4 className="text-white text-base font-bold tracking-tight">
                        Personaliza tu contenido
                      </h4>
                    </div>

                    {/* Descrip y Visual */}
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed max-w-[65%]">
                        Edita y adapta el contenido a tu estilo y oferta.
                      </p>
                      
                      {/* Floating illustration */}
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                        <PenTool className="w-8 h-8 text-white/90 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Accion Link */}
                  <button
                    onClick={() => {
                      document.getElementById("status-checklist-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="text-[#FF5A1F] hover:text-white font-black text-xs uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 self-start cursor-pointer bg-transparent border-none py-0 px-0"
                  >
                    Editar contenido <span className="group-hover:translate-x-1 transition-transform duration-300">➔</span>
                  </button>
                </div>

                {/* Passo 3 */}
                <div className="bg-[#141415]/80 border border-white/5 hover:border-[#FF5A1F]/20 rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="space-y-4">
                    {/* Badge y Titulo */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0">
                        3
                      </div>
                      <h4 className="text-white text-base font-bold tracking-tight">
                        Lanza tu sistema
                      </h4>
                    </div>

                    {/* Descrip y Visual */}
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed max-w-[65%]">
                        Pon en marcha tu Máquina de Ventas y empieza a vender.
                      </p>
                      
                      {/* Floating illustration */}
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                        <Rocket className="w-8 h-8 text-white/90 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Accion Link */}
                  <button
                    onClick={() => {
                      document.getElementById("status-checklist-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="text-[#FF5A1F] hover:text-white font-black text-xs uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 self-start cursor-pointer bg-transparent border-none py-0 px-0"
                  >
                    Ver guía de lanzamiento <span className="group-hover:translate-x-1 transition-transform duration-300">➔</span>
                  </button>
                </div>
              </div>

              {/* Banner de Consejo */}
              <div className="mt-8 bg-[#141415]/60 hover:bg-[#141415]/80 border border-white/5 rounded-2xl md:rounded-[1.5rem] p-4 flex items-center gap-4 transition-colors relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] shrink-0">
                  <Lightbulb className="w-5 h-5 animate-pulse" />
                </div>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed text-left">
                  <span className="text-[#FF5A1F] font-bold">Consejo:</span> Dedica de 30 a 60 minutos esta semana para revisar y personalizar tu sistema. La acción es la clave para ver resultados.
                </p>
              </div>
            </motion.div>

            {/* NUEVA SECCIÓN DE PRUEBA SOCIAL Y ACTIVACIÓN (AJUSTADA EXACTAMENTE COMO LA IMAGEN) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="w-full space-y-4 font-sans mt-8"
            >
              {/* Fila superior: Estadísticas de Confianza */}
              <div className="w-full bg-[#0D0D0F] border border-white/5 rounded-2xl md:rounded-[1.5rem] p-5 grid grid-cols-1 md:grid-cols-4 gap-6 items-center shadow-2xl relative overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* 1. Rating */}
                <div className="flex flex-col gap-1.5 p-1 md:p-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 text-amber-500 text-sm">
                      ★ ★ ★ ★ ★
                    </div>
                    <span className="text-white font-bold text-sm">4.9/5</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Más de 2,500 emprendedores ya usan Aprende Marketing
                  </p>
                </div>

                {/* 2. Sistemas */}
                <div className="flex items-center gap-3.5 p-1 md:p-3 pt-4 md:pt-1 text-left md:pl-6">
                  <div className="w-10 h-10 rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 flex items-center justify-center text-[#FF5A1F] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-white font-bold text-sm block tracking-tight">+30,000</span>
                    <p className="text-gray-400 text-[11px] leading-tight">
                      Sistemas generados con éxito
                    </p>
                  </div>
                </div>

                {/* 3. Resultados */}
                <div className="flex items-center gap-3.5 p-1 md:p-3 pt-4 md:pt-1 text-left md:pl-6">
                  <div className="w-10 h-10 rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 flex items-center justify-center text-[#FF5A1F] shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-white font-bold text-sm block tracking-tight">Resultados reales</span>
                    <p className="text-gray-400 text-[11px] leading-tight">
                      Negocios que están creciendo gracias a sus sistemas.
                    </p>
                  </div>
                </div>

                {/* 4. Comunidad */}
                <div className="flex items-center gap-3.5 p-1 md:p-3 pt-4 md:pt-1 text-left md:pl-6">
                  <div className="w-10 h-10 rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 flex items-center justify-center text-[#FF5A1F] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-white font-bold text-sm block tracking-tight">Comunidad activa</span>
                    <p className="text-gray-400 text-[11px] leading-tight">
                      Únete a miles de emprendedores que ya están escalando.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fila inferior: Llamado a la acción (CTA Bar) */}
              <div className="w-full bg-[#0D0D0F] border border-white/5 p-5 md:p-6 rounded-2xl md:rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 text-left self-start md:self-auto">
                  <div className="w-12 h-12 rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] shrink-0">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white text-base md:text-lg font-bold tracking-tight">
                      No dejes tu sistema a medio activar
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">
                      Actívalo ahora y empieza a ver resultados reales.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-full md:w-auto md:min-w-[280px]">
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-3.5 px-8 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-[#FF5A1F]/20 flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4 shrink-0" />
                    Activar mi sistema ahora
                  </button>
                  <span className="text-gray-400 text-[11px] font-medium tracking-wide">
                    Solo $39/mes – Cancela cuando quieras
                  </span>
                </div>
              </div>
            </motion.div>

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
              <div id="success-estrategia-card" className="bg-[#111] border border-[#FFBF00]/20 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
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
              <div id="success-pagina-captura-card" className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
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

                const libraryContentList = unlockedArticles.length > 0
                  ? unlockedArticles
                  : (strategyData?.modules?.content || strategyData?.content || []);

                console.log("📝 [WIZARD ARTÍCULOS] Renderizando artículos en el wizard:", {
                  hasUnlockedArticles: unlockedArticles.length > 0,
                  unlockedArticlesCount: unlockedArticles.length,
                  strategyContentCount: (strategyData?.modules?.content || strategyData?.content || []).length,
                  finalListCount: libraryContentList.length
                });

                const blogsToRender = libraryContentList.length > 0
                  ? libraryContentList.slice(0, 3).map((item: any) => {
                      return {
                        id: item.id || item.jsonIndex,
                        title: item.title,
                        introduction: item.description || item.objective || item.strategy || "Artículo estratégico diseñado para captar tráfico altamente cualificado y derivarlo a la compra del producto.",
                        enfoqueEstrategico: item.objective || item.psychologicalStrategy?.focus || item.psychologicalStrategy?.objective || "Enfoque y posicionamiento estratégico para captar clientes.",
                        intencionBusqueda: item.strategy || item.psychologicalStrategy?.target || item.psychologicalStrategy?.intent || item.psychologicalStrategy?.strategy || "Intención de búsqueda de los clientes.",
                        keywordSeo: item.keyword || item.psychologicalStrategy?.keyword || "negocio, servicios, captacion de clientes",
                        volumenBusqueda: item.searchVolume || item.search_volume || item.psychologicalStrategy?.searchVolume || "100 - 1K"
                      };
                    })
                  : defaultBlogsList.slice(0, 3).map((item: any) => {
                      const seo = item.seoStructure || {};
                      const headings = seo.headings || [];
                      return {
                        id: item.id,
                        title: item.title,
                        introduction: item.introduction,
                        enfoqueEstrategico: headings[1]?.text || "Educación inicial para el futuro artista",
                        intencionBusqueda: headings[3]?.text || "Gancho psicológico y derivación hacia la compra",
                        keywordSeo: seo.keywords || "negocio, servicios, captacion de clientes",
                        volumenBusqueda: item.searchVolume || "500 - 1K"
                      };
                    });

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
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0A0A0A] border border-[#FF5A1F]/30 rounded-[2rem] w-full max-w-lg shadow-[0_25px_60px_-15px_rgba(255,90,31,0.2)] overflow-hidden relative text-center p-8 md:p-10 space-y-6 font-sans"
                  >
                    {/* Header stylized icon */}
                    <div className="w-16 h-16 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] rounded-2xl flex items-center justify-center mx-auto relative">
                      <Folder className="w-8 h-8 text-[#FF5A1F]" />
                      <span className="absolute bottom-3 right-3 bg-[#FF5A1F] text-black text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">+</span>
                    </div>

                    {/* Titles */}
                    <div className="space-y-2">
                      <p className="text-[#FF5A1F]/90 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                        CONFIRMAR PROYECTO
                      </p>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                        ¿Creamos tu primer proyecto?
                      </h3>
                      <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up">
                        Vas a crear una estrategia para:
                      </p>
                    </div>

                    {/* Dynamic Integrated Product Card */}
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl flex items-center gap-4 text-left w-full">
                      {selectedProject?.multimedia_json?.heroImages?.[0] ? (
                        <img 
                          src={selectedProject.multimedia_json.heroImages[0]} 
                          alt={selectedProject.name} 
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] shrink-0 border border-white/5">
                          <Folder className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <p className="text-white font-extrabold text-sm md:text-base leading-snug line-clamp-2">
                          {selectedProject?.name}
                        </p>
                      </div>
                    </div>

                    {/* Value generation paragraph */}
                    <p className="text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{ fontSize: "1.1em", lineHeight: "1.3em" }}>
                      A continuación generaremos la audiencia, los principales dolores y los ángulos de venta que utilizarás en tu proyecto.
                    </p>

                    {/* Project Consumption Info Box */}
                    {(() => {
                      const maxProjects = user?.planLimits?.maxProjects || 1;
                      const currentCount = userActiveProjects?.length || 0;
                      const remainingProjects = Math.max(0, maxProjects - currentCount - 1);
                      return (
                        <div className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/15 rounded-xl px-4 py-3.5 flex items-center justify-center gap-2.5 text-zinc-300 text-xs">
                          <Info className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                          <span className="leading-tight text-white font-light text-lg md:text-xl md:leading-relaxed animate-fade-in-up" style={{ fontSize: "1.3em" }}>
                            Utilizarás <strong className="text-[#FF5A1F] font-bold">1 proyecto</strong> · Te quedarán <strong className="text-amber-500 font-bold">{remainingProjects} disponibles</strong>
                          </span>
                        </div>
                      );
                    })()}

                    {/* Actions and cancellation buttons row */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowActivateConfirm(false)}
                        className="flex-1 py-3 px-4 bg-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-white border border-white/10 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Volver
                      </button>
                      <button
                        type="button"
                        onClick={handleUnlockConfirm}
                        className="flex-[2] py-3.5 px-6 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-extrabold text-xs md:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                      >
                        <span>Confirmar y crear proyecto</span>
                      </button>
                    </div>

                    {/* Footer security proof badge */}
                    <div className="flex items-center justify-center gap-2 text-zinc-500 pt-2 border-t border-white/5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <p className="text-[10px] md:text-xs font-medium text-left leading-normal">
                        Podrás revisar y personalizar la estrategia antes de publicar cualquier contenido.
                      </p>
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
                    project={selectedProject || unlockedProject}
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
                  onNext={handleCreateWeb}
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
                  <GenerationStep
                    progress={generationProgress}
                    status={generationStatus}
                    secondsElapsed={secondsElapsed}
                    message="Crearé tu página web profesional para capturar clientes interesados."
                    project={selectedProject || unlockedProject}
                  />
                </div>
              )}

            {revealedSections.includes("landing_success") && (
              <div
                ref={landingSuccessRef}
                className="w-full max-w-[1440px] mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
              >
                <LandingSuccessStep
                  userData={user}
                  project={selectedProject || unlockedProject}
                  createdPageSubdomain={createdPageSubdomain}
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
                <GenerationStep
                  progress={generationProgress}
                  status={generationStatus}
                  secondsElapsed={secondsElapsed}
                  message="Estamos creando los videos para atraer tus potenciales clientes."
                  project={selectedProject || unlockedProject}
                />
              </div>
            )}

            {/* 7. HOOKS REVEAL */}
            {revealedSections.includes("show_hooks") &&
              step !== "generating_hooks" && (
                <div className="w-full max-w-[1440px] mx-auto pt-24 pb-12 px-4 md:px-6 relative">
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
              className={`relative w-full h-full bg-[#0a0a0e] border-l border-white/5 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col z-10 overflow-hidden text-left transition-all duration-300 ${
                (activeDetailsDrawer === "hooks" || activeDetailsDrawer === "landing") ? "max-w-5xl md:max-w-6xl xl:max-w-[85vw]" : "max-w-2xl md:max-w-4xl xl:max-w-5xl"
              }`}
            >
              {/* Drawer Header */}
              {activeDetailsDrawer !== "hooks" && (
                activeDetailsDrawer === "landing" ? (
                  <div className="p-6 border-b border-white/5 bg-[#14141c]/80 backdrop-blur-md space-y-4">
                    {/* Top Row: Back button and Close button */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setActiveDetailsDrawer(null)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all duration-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Volver al listado</span>
                      </button>
                      <button
                        onClick={() => setActiveDetailsDrawer(null)}
                        className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Title Row with Globe Icon and Status */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] mt-1 shrink-0">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5 text-left flex-1">
                        <div className="flex items-center flex-wrap gap-2.5">
                          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                            Embudos de Conversión Web
                          </h3>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">
                            <Check className="w-3 h-3 text-emerald-400" />
                            COMPLETADO Y ACTIVO
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                          Tu máquina digital de captación 24/7 diseñada para convertir visitantes en clientes potenciales de forma automática.
                        </p>
                        
                        {/* Interactive badges */}
                        <div className="flex items-center gap-4 pt-1 flex-wrap text-xs text-zinc-300">
                          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-lg">
                            <FileText className="w-3.5 h-3.5 text-zinc-400" />
                            <span><strong>2</strong> páginas generadas</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-lg">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Conversión estimada: <strong className="text-emerald-400 font-extrabold">Alta</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
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
                )
              )}

              {/* Drawer Content Area with independent scroll */}
              <div className={`flex-1 overflow-y-auto ${activeDetailsDrawer === "hooks" ? "p-0" : "p-6 md:p-8 space-y-8"}`}>
                {activeDetailsDrawer === "landing" && (
                  <div className="space-y-8 font-sans text-left">
                    {/* Alerta Premium Rocket Card */}
                    <div className="p-4.5 bg-gradient-to-r from-purple-900/30 via-[#131122] to-[#0a0a14] border border-purple-500/15 rounded-2xl flex items-start gap-4 shadow-[0_8px_30px_rgba(147,51,234,0.08)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full pointer-events-none" />
                      <div className="p-2 bg-purple-500/15 border border-purple-500/25 rounded-xl text-purple-400 shrink-0">
                        <Rocket className="w-5 h-5 text-purple-300 animate-pulse" />
                      </div>
                      <div className="text-left space-y-1">
                        <p className="text-zinc-200 text-xs sm:text-sm font-medium leading-relaxed">
                          Tu embudo está listo, pero aún puedes multiplicar tus resultados. <span className="font-extrabold text-white">Activa el plan PRO</span> y lleva tu conversión al siguiente nivel.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
                      {/* Left Column: Interactive Landing Preview & utilities */}
                      <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-2.5">
                            <h4 className="text-sm sm:text-base font-extrabold text-white">
                              Vista previa de tu Landing Principal
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-black text-purple-400 uppercase tracking-widest leading-none">
                              Página de captura optimizada
                            </span>
                          </div>

                          {/* Interactive browser mockup */}
                          <div className="bg-[#0b0c10] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                            {/* Browser header macOS style dots */}
                            <div className="bg-[#14151f] px-4 py-3 border-b border-white/5 flex items-center gap-2">
                              <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30"></span>
                              </div>
                              <div className="bg-zinc-950/80 text-[10px] text-zinc-500 px-3 py-1 rounded-md mx-auto w-48 sm:w-64 truncate text-center font-mono">
                                mi-landing-page.com/captura-pro
                              </div>
                            </div>

                            {/* Mockup Navbar */}
                            <div className="px-4 py-3.5 bg-[#12131a] border-b border-white/[0.02] flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2/3 md:w-auto flex items-center gap-1.5">
                                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                                  <span className="text-xs font-black tracking-tight text-white">
                                    Microbrow <span className="text-purple-400">Academy</span>
                                  </span>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center gap-3.5 text-zinc-400 text-[10px] font-bold">
                                <span className="text-white">Inicio</span>
                                <span>Beneficios</span>
                                <span>Testimonios</span>
                                <span>Programa</span>
                                <span>FAQ</span>
                              </div>
                              <button className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors cursor-pointer shrink-0">
                                QUIERO APRENDER
                              </button>
                            </div>

                            {/* Hero Main Content */}
                            <div className="p-6 sm:p-8 space-y-6 relative overflow-hidden bg-gradient-to-b from-[#12131b] to-[#0a0a0f]">
                              {/* Decorative background flare */}
                              <div className="absolute top-12 left-12 w-32 h-32 bg-purple-500/5 blur-3xl pointer-events-none rounded-full" />
                              <div className="absolute bottom-12 right-12 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full" />

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                                {/* Left Text */}
                                <div className="md:col-span-7 space-y-4 text-left">
                                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-black text-purple-400 uppercase tracking-widest leading-none">
                                    APRENDE DESDE CERO
                                  </span>
                                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans">
                                    Domina el <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Microblading</span> y transforma tu vida
                                  </h2>
                                  <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                                    Conviértete en una experta y empieza a generar más ingresos haciendo lo que amas.
                                  </p>

                                  {/* Checkmarks Dual Layout */}
                                  <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] sm:text-xs">
                                    <div className="flex items-center gap-1.5 text-zinc-300">
                                      <span className="text-emerald-400 font-extrabold flex items-center justify-center bg-emerald-500/10 w-4 h-4 rounded-full border border-emerald-500/20 text-[8px] shrink-0">✓</span>
                                      <span>Certificación</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-300">
                                      <span className="text-emerald-400 font-extrabold flex items-center justify-center bg-emerald-500/10 w-4 h-4 rounded-full border border-emerald-500/20 text-[8px] shrink-0">✓</span>
                                      <span>Acceso inmediato</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-300">
                                      <span className="text-emerald-400 font-extrabold flex items-center justify-center bg-emerald-500/10 w-4 h-4 rounded-full border border-emerald-500/20 text-[8px] shrink-0">✓</span>
                                      <span>Soporte 24/7</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-300">
                                      <span className="text-emerald-400 font-extrabold flex items-center justify-center bg-emerald-500/10 w-4 h-4 rounded-full border border-emerald-500/20 text-[8px] shrink-0">✓</span>
                                      <span>Satisfacción</span>
                                    </div>
                                  </div>

                                  {/* Custom Violet Action Button */}
                                  <button className="w-full sm:w-auto px-5 py-3 bg-[#6366f1] hover:bg-[#5a5df0] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 hover:scale-[1.02] transform active:scale-95 cursor-pointer">
                                    <span>QUIERO MI GUÍA GRATIS</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Right Portrait / Video Layout block */}
                                <div className="md:col-span-5">
                                  <div className="relative aspect-[4/5] rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden shadow-xl flex flex-col justify-between p-4">
                                    {/* Aesthetic background image or face placeholder preview */}
                                    <div className="absolute inset-0 bg-cover bg-center opacity-40 select-none pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400")' }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-zinc-950/60" />
                                    
                                    {/* Score indicator badge in header mockup */}
                                    <div className="relative z-10 flex justify-end">
                                      <span className="px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-mono text-amber-400 font-extrabold">94/100 IA SCORE</span>
                                    </div>

                                    {/* Floating media play action circles */}
                                    <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-4">
                                      <button className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer">
                                        <PlayCircle className="w-6 h-6 text-white" />
                                      </button>
                                      <span className="text-[10px] font-mono text-white/90 font-black tracking-widest uppercase mt-3 filter drop-shadow">
                                        Ver Video
                                      </span>
                                    </div>

                                    {/* Fine print caption */}
                                    <div className="relative z-10">
                                      <span className="text-[8px] text-zinc-400 font-medium tracking-tight truncate block">Lección 1: Microblading Pro</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Mockup footer check */}
                            <div className="text-center py-2.5 bg-[#0e0e15] border-t border-white/[0.04] text-[9px] text-zinc-650 flex items-center justify-center gap-1.5 font-medium">
                              <Lock className="w-3 h-3 text-[#FFBF00] shrink-0" />
                              <span>Esta es una vista previa. Tu página completa incluye más secciones optimizadas.</span>
                            </div>
                          </div>

                          {/* ORIGINAL UTILITIES: "Seguridad y preservación" card enclosing original items */}
                          <div className="mt-8 space-y-4 pt-4 border-t border-white/5">
                            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider text-left">
                              Enlaces y Archivos de Acceso Directo:
                            </h4>
                            
                            {/* Wrap original Página de captura, Página de gracias & copy link box */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Captura original block */}
                              <div className="p-5 bg-[#121217] border border-white/5 rounded-2xl relative overflow-hidden space-y-3.5 text-left">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                                    <Globe className="w-4 h-4 text-[#FF5A1F]" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-extrabold text-white leading-none">Página de Captura</h4>
                                    <span className="text-[8px] text-[#FF5A1F] uppercase font-black tracking-wider block mt-1.5 leading-none">GENERADA Y ACTIVA</span>
                                  </div>
                                </div>
                                <p className="text-stone-400 text-xs leading-relaxed">
                                  Diseñada bajo la psicología de escasez y persuasión para captar leads.
                                </p>
                                <a
                                  href={getPageUrl()}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full py-2 bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
                                >
                                  IR AL SITIO WEB <ChevronRight className="w-3 h-3" />
                                </a>
                              </div>

                              {/* Gracias original block */}
                              <div className="p-5 bg-[#121217] border border-white/5 rounded-2xl relative overflow-hidden space-y-3.5 text-left">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-[#FFBF00]/10 border border-[#FFBF00]/20 flex items-center justify-center text-[#FFBF00] shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-extrabold text-white leading-none">Página de Gracias</h4>
                                    <span className="text-[8px] text-[#FFBF00] uppercase font-black tracking-wider block mt-1.5 leading-none">GENERADA Y ACTIVA</span>
                                  </div>
                                </div>
                                <p className="text-stone-400 text-xs leading-relaxed">
                                  Página donde terminan los prospectos que se acaban de registrar.
                                </p>
                                <a
                                  href={getPageUrl() + (createdPageSubdomain ? "/gracias" : "")}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full py-2 bg-[#0d0d12] border border-white/10 hover:border-[#FFBB00]/30 text-white hover:text-[#FFBB00] font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                                >
                                  VER GRACIAS <ChevronRight className="w-3 h-3" />
                                </a>
                              </div>
                            </div>

                            {/* Original temporal URL input button */}
                            <div className="p-4 bg-black/45 border border-white/5 rounded-xl flex flex-col gap-2 text-left">
                              <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400">
                                Enlace Web Directo (URL Temporal):
                              </span>
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full overflow-hidden">
                                <a
                                  href={getPageUrl()}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#FFBF00] font-mono text-xs hover:text-white transition-colors truncate underline block text-center sm:text-left flex-1"
                                >
                                  {getPageUrl()}
                                </a>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(getPageUrl());
                                    setCopiedUrl(true);
                                    setTimeout(() => setCopiedUrl(false), 2000);
                                  }}
                                  className="shrink-0 px-3 py-1.5 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 border border-[#FF5A1F]/30 text-white rounded-lg text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                  {copiedUrl ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-400 font-extrabold">¡Copiado!</span>
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
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Potencial and Analytical Dashboard */}
                      <div className="lg:col-span-5 space-y-6">
                        {/* Potencial de Conversión card */}
                        <div className="bg-gradient-to-b from-[#111116] to-[#08080c] border border-white/5 p-6 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center shadow-xl space-y-4">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] blur-2xl pointer-events-none rounded-full" />
                          <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                            Potencial de Conversión
                          </h4>

                          {/* Gauge semicircular meter */}
                          <div className="relative flex items-center justify-center w-40 h-40">
                            {/* Semicircle trail background */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#1F2937"
                                strokeWidth="8"
                                strokeDasharray="251.2"
                                strokeDashoffset="62.8"
                                strokeLinecap="round"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="url(#goldGradient)"
                                strokeWidth="8"
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 - (251.2 * 0.75 * 72) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                              />
                              <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#F59E0B" />
                                  <stop offset="100%" stopColor="#EF4444" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col justify-center items-center">
                              <span className="text-3xl font-black text-white leading-none tracking-tight">72</span>
                              <span className="text-zinc-500 font-bold text-[10px] tracking-wider uppercase mt-1">/ 100</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[11px] text-zinc-400 font-bold block">Tu página actual</span>
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-black text-xs">
                              <span>Con PRO puede llegar a 94/100</span>
                              <span className="animate-pulse">↑</span>
                            </div>
                          </div>
                        </div>

                        {/* Análisis IA Opportunities module */}
                        <div className="bg-gradient-to-b from-[#111116] to-[#08080c] border border-white/5 p-6 rounded-3xl relative overflow-hidden space-y-5">
                          <div className="text-left">
                            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider block mb-1">
                              Análisis IA de tu Landing
                            </h4>
                            <p className="text-zinc-500 text-xs leading-normal">
                              Hemos detectado oportunidades para aumentar tu conversión de inmediato.
                            </p>
                          </div>

                          {/* List of optimization criteria with secure status */}
                          <div className="space-y-3">
                            {[
                              { label: "Dominio profesional", sub: "Aumenta la confianza de tus clientes." },
                              { label: "Píxel de Meta avanzado", sub: "Mejor seguimiento de eventos y conversiones." },
                              { label: "Analytics y eventos", sub: "Datos precisos y auditoría para escalar." },
                              { label: "Test A/B automático", sub: "Prueba variantes de copia y mejora continua." },
                              { label: "Automatización CRM", sub: "Nutre y convierte leads automáticamente." },
                              { label: "Remarketing de precisión", sub: "Recupera más clientes potenciales rezagados." }
                            ].map((opt, i) => (
                              <div key={i} className="flex items-center justify-between p-3.5 bg-black/40 border border-white/[0.03] rounded-2xl hover:border-amber-500/20 transition-all group">
                                <div className="space-y-0.5 text-left flex-1 min-w-0 pr-2">
                                  <h5 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                    {opt.label}
                                  </h5>
                                  <p className="text-[10px] text-zinc-550 truncate leading-normal">{opt.sub}</p>
                                </div>
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                  <Lock className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            ))}
                          </div>

                          <button 
                            onClick={() => setShowUpgradeModal(true)}
                            className="w-full text-center text-purple-400 hover:text-purple-300 text-xs font-extrabold focus:outline-none flex items-center justify-center gap-1 pt-1.5 cursor-pointer"
                          >
                            <span>Ver todas las mejoras</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>

                      {/* Banner Premium Inferior Completo: VERSIÓN PRO */}
                      <div className="col-span-1 lg:col-span-12 p-6 sm:p-8 bg-gradient-to-r from-[#17130a] via-[#090805] to-[#141008] border border-amber-500/25 rounded-3xl relative overflow-hidden flex flex-col gap-6 md:gap-7 shadow-[0_15px_50px_rgba(245,158,11,0.12)]">
                        {/* Backlit Aura decoration inside */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-36 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                          <div className="text-left space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black rounded-lg uppercase tracking-wider">
                              <Crown className="w-3.5 h-3.5" />
                              <span>VERSIÓN PRO</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 leading-tight">
                              Multiplica tus ventas hasta un 70%
                            </h3>
                            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                              Activa el plan PRO y desbloquea todas las herramientas avanzadas para convertir visitantes fríos en clientes leales de forma automática y con soporte premium prioritario.
                            </p>
                          </div>

                          <div className="flex flex-col items-center gap-2 shrink-0 w-full md:w-auto">
                            <button
                              onClick={() => setShowUpgradeModal(true)}
                              className="w-full md:w-auto px-6 py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-yellow-500/40 hover:scale-[1.03] transform active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 border border-yellow-300/30 font-sans"
                            >
                              <Zap className="w-4 h-4 fill-black text-black" />
                              <span>Actualizar a PRO</span>
                            </button>
                            <span className="text-[10px] text-zinc-500 font-semibold italic text-center">
                              Cancela cuando quieras. Sin permanencias.
                            </span>
                          </div>
                        </div>

                        {/* Modular integration items list connected by + icons */}
                        <div className="border-t border-white/[0.05] pt-5 relative z-10">
                          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[10px] sm:text-xs font-bold text-zinc-300">
                            {[
                              { icon: "🌐", text: "Dominio profesional" },
                              { icon: "📊", text: "Píxel & Tracking" },
                              { icon: "📈", text: "Analytics avanzado" },
                              { icon: "💬", text: "Automatización CRM" },
                              { icon: "⚔️", text: "Test A/B ilimitados" },
                              { icon: "👑", text: "Soporte prioritario" }
                            ].map((item, idx) => (
                              <React.Fragment key={idx}>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-xl">
                                  <span>{item.icon}</span>
                                  <span className="text-white">{item.text}</span>
                                </div>
                                {idx < 5 && (
                                  <span className="text-amber-500 font-extrabold text-[10px] sm:text-xs">+</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                          const textMsg = t.text || t.msg || t.quote || "";
                          const imageToUse =
                            t.image ||
                            t.img ||
                            (idx === 0
                              ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                              : idx === 1
                                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                                : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop");
                          
                          const ageToUse = t.age || (idx === 0 ? "28 - 35 años" : idx === 1 ? "24 - 30 años" : "32 - 40 años");
                          const occupationToUse = t.occupation || t.role || (idx === 0 ? "Emprendedora" : idx === 1 ? "Esteticista independiente" : "Dueña de Studio");

                          return (
                            <div
                              key={idx}
                              className="p-6 bg-[#0d0d12] border border-white/5 rounded-3xl relative overflow-hidden space-y-5 hover:border-white/10 transition-all text-left shadow-md"
                            >
                              {/* Header with clean identity */}
                              <div className="flex items-center gap-4 pb-4 border-b border-white/[0.04]">
                                <img
                                  src={imageToUse}
                                  alt={t.name}
                                  referrerPolicy="no-referrer"
                                  className="w-[54px] h-[54px] rounded-full object-cover border-2 border-[#FF5D1E]/40"
                                />
                                <div className="text-left space-y-1">
                                  <h4 className="text-sm md:text-base font-black text-white leading-none">
                                    {t.name}
                                  </h4>
                                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-normal">
                                    <span>{ageToUse}</span>
                                    <span>•</span>
                                    <span>{occupationToUse}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Testimonial text only */}
                              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <p className="text-xs md:text-sm leading-relaxed text-zinc-200 font-sans italic">
                                  "{textMsg}"
                                </p>
                              </div>

                              {/* Action buttons: Ver en la Web & Editar */}
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <button
                                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#FF5D1E] hover:text-[#ff743c] bg-[#FF5D1E]/5 hover:bg-[#FF5D1E]/10 border border-[#FF5D1E]/30 hover:border-[#FF5D1E]/50 rounded-xl transition-all font-bold cursor-pointer"
                                >
                                  <Globe className="w-3.5 h-3.5" /> Ver en la web
                                </button>
                                <button
                                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 rounded-xl transition-all font-bold cursor-pointer"
                                >
                                  <PenTool className="w-3.5 h-3.5" /> Editar
                                </button>
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
                        archetype: "Especialista Estancada",
                        transformation_title: "Si buscas escalar tu negocio de belleza con el servicio más lucrativo del mercado actual...",
                        detailed_pains: [
                          "Si te frustra ver cómo tu agenda se llena de servicios que apenas cubren tus gastos básicos.",
                          "Si te agota sentirte invisible frente a competidores que cobran el triple que tú.",
                          "Si te duele sentir que tu talento está estancado por no tener una técnica de alto impacto."
                        ]
                      },
                      {
                        name: "Mónica Silva",
                        archetype: "Esteticista Principiante",
                        transformation_title: "Si sueñas con la libertad de manejar tu propio tiempo sin depender de un sueldo fijo...",
                        detailed_pains: [
                          "Si te frustra trabajar más de 10 horas al día sin ver un crecimiento real en tu cuenta bancaria.",
                          "Si te agota la inseguridad de depender de que tus clientas agenden citas de bajo costo.",
                          "Si te duele sentir que no pasas suficiente tiempo de calidad con tu familia por el cansancio."
                        ]
                      },
                      {
                        name: "Laura Torres",
                        archetype: "Emprendedora desde Cero",
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
                            archetype: av.archetype || fallbackObj.archetype,
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
                                  Avatar {idx + 1}: {av.archetype} ({av.name})
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
                    const rawLearningModules = strategyData?.psychology?.learningModules || [];
                    const rawWebBenefits = strategyData?.modules?.web?.landingPageTabs?.benefits?.items || [];
                    const rawBenefits = strategyData?.benefits || [];
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

                    let selectedSourceList = defaultBenefitsList;
                    if (rawLearningModules.length > 0) {
                      selectedSourceList = rawLearningModules;
                    } else if (rawWebBenefits.length > 0) {
                      selectedSourceList = rawWebBenefits;
                    } else if (rawBenefits.length > 0) {
                      selectedSourceList = rawBenefits;
                    }

                    const benefitsToRenderList = selectedSourceList.map((b: any) => ({
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
                              className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-[#FF5D1E]/20 transition-all duration-300 text-left"
                            >
                              <div className="flex items-center gap-3.5 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-[#FF5D1E]/10 border border-[#FF5D1E]/20 flex items-center justify-center text-[#FF5D1E] text-xs font-black">
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
                  (() => {
                    const displayHooks =
                      unlockedHooks.length > 0
                        ? unlockedHooks
                        : strategyData?.modules?.hooks || [];
                    const initialHooks =
                      displayHooks.length >= 3
                        ? displayHooks
                        : topDefaultHooksList;

                    // Amplify hooks list to have exactly 5 or more hooks, ensuring a rich layout
                    const amplifiedHooksList = initialHooks.map((h: any, idx: number) => ({
                      ...h,
                      uniqueId: `hook-${idx}`
                    }));
                    const defaultAdditions = isManicurista
                      ? [
                          {
                            title: "La técnica de nivelación con gel de construcción que reduce tu tiempo de limado a la mitad sin perder resistencia.",
                            psychologicalStrategy: "Apela al deseo de eficiencia laboral, reducción del cansancio físico de la manicurista y mejora de la durabilidad.",
                            contentJson: {
                              script: "Saca más citas al día sin terminar con dolor de espalda. La nivelación perfecta se logra con gravedad...\nEvita el limado excesivo y asegura sets de uña resistentes por más de 4 semanas.\n\nEscribe GEL en comentarios y te paso el link de registro gratuito a la masterclass de hoy.\n",
                              ads: "💅 ¿Sigues limando por horas hasta que te duelen las manos? Te enseño el truco magnético del gel autonivelante. 👇\n\n🔗 [LINK DE TU LANDING]",
                              thumbs: ["Nivelación en un Paso 💅", "Adiós al Limado Eterno ⏳", "Estructura Fina y Fuerte 💪"]
                            }
                          },
                          {
                            title: "Uñas Esculpidas Modernas: El paso a paso para pasar de principiante a artista cotizada en menos de 30 días.",
                            psychologicalStrategy: "Propone un camino claro de auto-superación y escalabilidad técnica para captar clientes que aprecian el valor artístico.",
                            contentJson: {
                              script: "El secreto de la simetría perfecta no es el talento, es la fórmula de proporciones geométricas.\nAprende a modelar moldes perfectos en tiempo récord.\n\nToca el link para reclamar tu mentoría gratuita de hoy misma.\n",
                              ads: "🚀 De aficionada a artista de uñas de élite. Accede hoy al taller interactivo de esculpido profesional gratis. 👇\n\n🔗 [LINK DE TU LANDING]",
                              thumbs: ["Uñas Esculpidas Pro 💎", "Ruta de 30 Días 📈", "Sé una manicurista Top 👑"]
                            }
                          }
                        ]
                      : isMicroblading
                        ? [
                            {
                              title: "El secreto para retener el pigmento en pieles grasas hasta por 18 meses sin retoques constantes.",
                              psychologicalStrategy: "Neutraliza la objeción técnica más común en microblading (durabilidad en piel grasa) demostrando autoridad clínica.",
                              contentJson: {
                                script: "Si tus clientas con piel grasa pierden el color a los 3 meses, estás cometiendo este error crucial en la profundidad.\nNo presiones de más, regula de acuerdo con la agudeza epidérmica.\n\nEscribe TRAZO en comentarios para ver la clase práctica en alta definición hoy mismo.\n",
                                ads: "🤫 Retención perfecta de pigmento en pieles grasas. Te revelo el secreto de ángulo y profundidad sin costo. 👇\n\n🔗 [LINK DE TU LANDING]",
                                thumbs: ["Retención de 18 Meses ⏳", "Piel Grasa Sin Problemas 🌟", "Ciencia del Pigmento 🔬"]
                              }
                            },
                            {
                              title: "De la camilla casera al Studio de Cejas: Cómo escalar tu negocio estético sin requerir grandes inversiones iniciales.",
                              psychologicalStrategy: "Impulsa el escalamiento, la mentalidad empresarial y la transición a un espacio profesional seguro y rentable.",
                              contentJson: {
                                script: "Montar un estudio de cejas de alto ticket no requiere miles de dólares, lo que requiere es posicionamiento.\nAtiende clientes selectivos en lugar de regalar promociones baratas.\n\nToca el enlace destacado para conocer la hoja de ruta gratuita.\n",
                                ads: "💼 Deja de atender a pérdida en tu sala. Te muestro el plano de escalamiento para estudios de cejas. Cupos limitados. 👇\n\n🔗 [LINK DE TU LANDING]",
                                thumbs: ["Escala tu Studio de Cejas 🏢", "De Camilla a Negocio 📈", "Atrae Clientes VIP Hoy 💰"]
                              }
                            }
                          ]
                        : [
                            {
                              title: "El método de diagnóstico personalizado de piel que incrementa un 40% la venta de productos adicionales.",
                              psychologicalStrategy: "Combina autoridad clínica con incremento del margen de facturación secundaria en el consultorio estético.",
                              contentJson: {
                                script: "No vendas cremas, vende tratamientos basados en la lectura dactilar de lípidos epidérmicos.\nUna vez que demuestres el estado clínico del rostro, la conversión de productos es automática.\n\nÚnete a nuestra masterclass gratis tocando el enlace de la bío hoy.\n",
                                ads: "💅 ¿Quieres incrementar tu ticket promedio sin esfuerzo? Implementa el diagnóstico dactilar. Te enseño cómo gratis. 👇\n\n🔗 [LINK DE TU LANDING]",
                                thumbs: ["Diagnóstico que Vende 🔬", "Aumenta 40% Tu Facturación 📈", "Consultoría Inteligente 💡"]
                              }
                            },
                            {
                              title: "Belleza y Redes Sociales: Cómo crear videos magnéticos con tu celular que llenen tu agenda de consultorio.",
                              psychologicalStrategy: "Elimina la barrera técnica de cámaras costosas enseñando producción ágil con teléfono móvil enfocado en el cliente ideal.",
                              contentJson: {
                                script: "No necesitas una cámara de cine para grabar videos virales de belleza, necesitas iluminación lateral y claridad.\nHabla de lo que tu cliente siente en el espejo y no de tecnicismos complejos.\n\nEscribe VIDEO para enviarte el tutorial directo gratis hoy.\n",
                                ads: "🚀 Graba videos de impacto con el celular que ya tienes. Te revelo la iluminación dorada estética gratuita hoy. 👇\n\n🔗 [LINK DE TU LANDING]",
                                thumbs: ["Videos Virales con Celular 📱", "Iluminación Dorada 💡", "Agenda Llena Hoy 📅"]
                              }
                            }
                          ];

                    // Ensure we have at least 5 items
                    let addIdx = amplifiedHooksList.length;
                    while (amplifiedHooksList.length < 5) {
                      const nextAddition = defaultAdditions[amplifiedHooksList.length % defaultAdditions.length];
                      amplifiedHooksList.push({
                        ...nextAddition,
                        uniqueId: `hook-${addIdx++}`
                      });
                    }

                    // Apply search filter
                    const filteredHooks = amplifiedHooksList.filter((h: any) => {
                      const titleText = (h.title || h.hookText || h.text || h.question || "").toLowerCase();
                      return titleText.includes(hookSearchSearchText.toLowerCase());
                    });

                    // Select active hook
                    const activeHook = selectedHookForDrawer || filteredHooks[0] || amplifiedHooksList[0];

                    if (!activeHook) return null;

                    const activeHookIdx = amplifiedHooksList.findIndex((h: any) => h.uniqueId === activeHook?.uniqueId);
                    const isActiveHookLocked = activeHookIdx >= 3;

                    const hTitle =
                      activeHook.title ||
                      activeHook.hookText ||
                      activeHook.text ||
                      activeHook.question ||
                      "Video Hook";
                    const hStrategy =
                      activeHook.psychologicalStrategy ||
                      activeHook.strategy ||
                      "Estrategia de persuasión enfocada en enganchar al avatar en los primeros 3 segundos.";
                    const cJson = activeHook.contentJson || {};
                    const scriptText = cJson.script || "";
                    const adsText = cJson.ads || "";
                    const thumbsList = cJson.thumbs || [];

                    return (
                      <div className="flex flex-col lg:flex-row h-full min-h-[85vh] text-left relative overflow-hidden bg-[#040406] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.04] animate-fade-in font-sans">
                        {/* COLUMNA IZQUIERDA (Lista de Ganchos) */}
                        <div className="w-full lg:w-[32%] flex flex-col justify-between bg-[#07070a] relative overflow-hidden shrink-0">
                          <div>
                            {/* Left Column Header Info */}
                            <div className="p-6 pb-4 space-y-4 border-b border-white/[0.04]">
                              {/* Volver al listado link */}
                              <button
                                onClick={() => {
                                  setSelectedHookForDrawer(null);
                                  setActiveDetailsDrawer(null);
                                }}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors tracking-wider cursor-pointer"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" /> Volver al listado
                              </button>

                              {/* Section Title premium */}
                              <div className="flex items-start gap-3 mt-2">
                                <div className="w-9 h-9 rounded-xl bg-[#FF5D1E]/10 border border-[#FF5D1E]/20 flex items-center justify-center text-[#FF5D1E] shrink-0">
                                  <svg className="w-4 h-4 fill-current stroke-none" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tight">
                                    Ganchos de Atracción
                                  </h3>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
                                    Diseñados para captar la atención en los primeros 3 segundos y aumentar el alcance orgánico en Reels y TikTok.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Controls and Stats under Header */}
                            <div className="p-6 pb-4">
                              {/* Header Label and counter */}
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">
                                  Lista de hooks generados
                                </span>
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-400">
                                  3/30 Hooks Generados
                                </span>
                              </div>
                            </div>

                            {/* Scrollable list of hook cards */}
                            <div className="p-6 pt-0 space-y-2.5 max-h-[460px] overflow-y-auto custom-scrollbar">
                              {amplifiedHooksList.length > 0 ? (
                                amplifiedHooksList.map((hItem: any, hIdx: number) => {
                                  const isSelected = hItem.uniqueId === activeHook?.uniqueId;
                                  const hookTitleStr = hItem.title || hItem.hookText || hItem.text || hItem.question || `Video Hook #${hIdx + 1}`;
                                  
                                  const hIdxActive = hIdx < 3;
                                  const cardStyle = hIdxActive
                                    ? (isSelected
                                        ? "bg-[#0d2216]/90 border-emerald-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_0_15px_rgba(16,185,129,0.25)] hover:border-emerald-400"
                                        : "bg-emerald-500/[0.02] border-emerald-500/10 hover:bg-emerald-500/5 hover:border-emerald-500/20")
                                    : (isSelected
                                        ? "bg-[#241b0a] border-amber-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_0_15px_rgba(245,158,11,0.25)] hover:border-amber-400"
                                        : "bg-amber-500/[0.01] border-amber-500/10 hover:bg-amber-500/[0.03] hover:border-amber-500/20");

                                  return (
                                    <div
                                      key={hIdx}
                                      onClick={() => {
                                        setSelectedHookForDrawer(hItem);
                                        setActiveHookTab("Gancho");
                                      }}
                                      className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative group flex gap-3.5 ${cardStyle}`}
                                    >
                                      {/* Clean White Desk Calendar Sheet */}
                                      <div className="w-11 h-11 rounded-lg bg-white border border-white/10 flex flex-col overflow-hidden shrink-0 shadow-md">
                                        <div className={`${hIdxActive ? "bg-emerald-500" : "bg-amber-500"} text-[8px] font-black text-center text-white py-0.5 leading-none uppercase tracking-wider font-sans select-none`}>
                                          DÍA
                                        </div>
                                        <div className="flex-1 flex items-center justify-center bg-white text-zinc-950 font-black text-xs leading-none font-sans select-none">
                                          {hIdx + 1}
                                        </div>
                                      </div>

                                      {/* Text block */}
                                      <div className="flex-1 min-w-0 space-y-1.5">
                                        <h4 className={`text-xs md:text-sm leading-snug transition-colors duration-200 break-words whitespace-normal line-clamp-none ${
                                          isSelected ? "text-white font-extrabold" : "text-zinc-300 font-normal group-hover:text-white"
                                        }`}>
                                          {hookTitleStr}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          {hIdxActive ? (
                                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-extrabold text-emerald-400 tracking-wider uppercase select-none">
                                              ACTIVO
                                            </span>
                                          ) : (
                                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] font-extrabold text-amber-500 tracking-wider uppercase select-none">
                                              BLOQUEADO
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Chevron right */}
                                      <ChevronRight className={`w-4 h-4 my-auto shrink-0 transition-all ${
                                        isSelected 
                                          ? (hIdxActive ? "text-emerald-400 translate-x-0.5" : "text-amber-400 translate-x-0.5") 
                                          : (hIdxActive ? "text-zinc-500 group-hover:text-emerald-400" : "text-zinc-500 group-hover:text-amber-500")
                                      }`} />
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-xs text-zinc-500 text-center py-6">No se encontraron hooks...</p>
                              )}
                            </div>
                          </div>

                          {/* Truncated bottom row "Ver 15 remaining" */}
                          <div className="p-6 pt-2 border-t border-white/[0.04] bg-[#09090c]/40">
                            <div className="p-4 bg-gradient-to-r from-red-500/5 to-transparent border border-red-500/10 rounded-2xl flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center text-red-400 shrink-0">
                                  <Lock className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                  <h5 className="text-xs font-black text-white uppercase tracking-wider">
                                    Ver 15 hooks restantes
                                  </h5>
                                  <p className="text-[10px] text-zinc-400 font-normal mt-0.5 leading-snug">
                                    Desbloquea todos los ganchos generados este mes.
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-500" />
                            </div>
                          </div>
                        </div>

                        {/* COLUMNA DERECHA (Pestañas de control y Ficha Técnica Detallada) */}
                        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                          <div>
                            {/* Floating Top Stats Widgets */}
                            <div className="flex items-center justify-between gap-4 p-6 border-b border-white/[0.04] bg-[#0c0c10]/30 backdrop-blur-md flex-wrap">
                              {/* Unified Premium Subscription Widget - Aligned right */}
                              <div className="flex items-center gap-5 bg-gradient-to-r from-amber-500/5 to-[#FF5D1E]/5 border border-white/10 rounded-2xl py-2 px-5 shadow-[0_4px_30px_rgba(255,93,30,0.05)] backdrop-blur-sm ml-auto">
                                <div className="flex items-center gap-3">
                                  {/* Gold/Orange Glowing Crown */}
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)] select-none">
                                    <Crown className="w-4.5 h-4.5 active:scale-95" />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="text-xs font-bold text-white tracking-wide leading-none">
                                      Estás usando el Plan <span className="text-amber-400 font-extrabold uppercase">GRATIS</span>
                                    </h4>
                                    <p className="text-[10px] text-zinc-400 mt-1 font-normal leading-none">
                                      Tienes acceso a <span className="text-zinc-200 font-semibold">3 de 30 hooks mensuales</span>
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setShowUpgradeModal(true)}
                                  className="px-4 py-1.5 border border-[#FF5D1E] text-[#FF5D1E] hover:bg-[#FF5D1E]/10 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 shadow-[0_0_10px_rgba(255,93,30,0.05)] active:scale-95 cursor-pointer"
                                >
                                  Ver planes
                                </button>
                              </div>
                            </div>

                            {/* Hook Title Card Container */}
                            <div className="p-6 md:p-8 pb-3">
                              <div className="p-6 md:p-8 bg-[#14141c]/50 border border-white/5 rounded-[2.5rem] relative overflow-hidden space-y-4">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5D1E]/5 blur-3xl rounded-full"></div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-[9px] font-black uppercase text-[#FF5A1F] tracking-widest bg-[#FF5A1F]/10 px-2 py-0.5 rounded select-none">
                                    HOOK SELECCIONADO
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(hTitle);
                                      alert("¡Hook copiado al portapapeles!");
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-zinc-300 hover:text-white tracking-wide uppercase transition-colors cursor-pointer select-none"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-zinc-400" /> Copiar hook
                                  </button>
                                </div>
                                <h2 className="text-lg md:text-xl xl:text-2xl font-black text-white tracking-tight leading-snug font-sans">
                                  ¿{hTitle.replace(/^¿+|^\?+|^"/g, "").replace(/¿+|\?+$/g, "")}?
                                </h2>
                              </div>
                            </div>

                            {/* Horizontal Tabs Row */}
                            {!isActiveHookLocked && (
                              <div className="px-6 md:px-8">
                                <div className="flex items-center gap-1 overflow-x-auto pb-1.5 border-b border-white/[0.04] custom-scrollbar">
                                  {["Gancho", "Psicología", "Guión de Video", "Copy para Anuncio", "CTA Sugerido", "Variaciones"].map((tab) => {
                                    const isActive = activeHookTab === tab;
                                    return (
                                      <button
                                        key={tab}
                                        onClick={() => setActiveHookTab(tab)}
                                        className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap rounded-xl transition-all cursor-pointer ${
                                          isActive
                                            ? "bg-[#FF5D1E] text-white shadow-md shadow-[#FF5D1E]/20"
                                            : "bg-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-white"
                                        }`}
                                      >
                                        {tab}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Active Tab Content renders */}
                            {isActiveHookLocked ? (
                              <div className="p-6 md:p-8 pt-5 text-center relative min-h-[380px] flex flex-col items-center justify-center rounded-3xl overflow-hidden border border-amber-500/25 bg-gradient-to-b from-[#16130c] via-[#0a0805] to-[#040402] mx-6 md:mx-8 mb-6 md:mb-8 mt-2 md:mt-3 shadow-[0_12px_45px_rgba(245,158,11,0.14)] hover:scale-[1.02] transition-all duration-300">
                                {/* Backlit Aura */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-amber-500/15 to-transparent blur-2xl rounded-full pointer-events-none" />

                                {/* Blurred background content to trigger desire */}
                                <div className="absolute inset-0 filter blur-[6px] opacity-10 pointer-events-none select-none p-6 md:p-8 space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-8 p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4 text-left">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-4 h-4 bg-white/20 rounded-full" />
                                        <div className="h-3 bg-white/20 rounded w-24" />
                                      </div>
                                      <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                                        <div className="w-[124px] h-[164px] rounded-2xl bg-zinc-900 border border-white/10 shrink-0" />
                                        <div className="flex-1 space-y-2 py-1">
                                          <div className="h-3 bg-white/20 rounded w-1/3" />
                                          <div className="h-3.5 bg-white/20 rounded w-full" />
                                          <div className="h-3 bg-white/10 rounded w-2/3" />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="md:col-span-4 p-6 bg-[#111116]/80 border border-white/5 rounded-3xl space-y-4 flex flex-col justify-center text-left">
                                      <div className="h-3 bg-white/20 rounded w-2/3" />
                                      <div className="space-y-2">
                                        <div className="h-3.5 bg-white/20 rounded w-16" />
                                        <div className="h-3 bg-white/10 rounded w-24" />
                                      </div>
                                    </div>
                                  </div>
                                  {/* Second row of dummy blurred blocks */}
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-8 p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-3 text-left">
                                      <div className="h-4 bg-white/20 rounded w-1/3" />
                                      <div className="h-3 bg-white/10 rounded w-full" />
                                      <div className="h-3 bg-white/10 rounded w-5/6" />
                                    </div>
                                    <div className="md:col-span-4 p-6 bg-[#111116]/80 border border-white/5 rounded-3xl space-y-3 text-left">
                                      <div className="h-4 bg-white/20 rounded w-1/2" />
                                      <div className="h-3 bg-white/10 rounded w-full" />
                                    </div>
                                  </div>
                                </div>
 
                                {/* Glowing content overlay */}
                                <div className="relative z-10 max-w-md mx-auto space-y-6 flex flex-col items-center">
                                  {/* Gold Lock Icon badge - Double border deluxe design */}
                                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse">
                                    <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center text-amber-400">
                                      <Lock className="w-6 h-6" />
                                    </div>
                                  </div>
 
                                  <div className="space-y-2.5 px-4">
                                    <h3 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 tracking-tight uppercase font-sans">
                                      Contenido Exclusivo Pro
                                    </h3>
                                    <p className="text-sm sm:text-base text-white font-medium leading-relaxed max-w-md">
                                      Este video hook de alta conversión, sus estrategias psicológicas, guión listo para grabar y copies de publicidad están reservados para miembros premium.
                                    </p>
                                  </div>
 
                                  {/* Sparkly Yellow CTA Button */}
                                  <button
                                    onClick={() => {
                                      setShowUpgradeModal(true);
                                    }}
                                    className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-yellow-500/40 hover:scale-[1.02] transform active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center gap-2 border border-yellow-300/30 font-sans"
                                  >
                                    <span>Actualiza a pro para desbloquear 27 videos este mes</span>
                                    <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {activeHookTab === "Gancho" && (
                              <div className="p-6 md:p-8 pt-5 space-y-6">
                                {/* Section: Ejemplo en Contexto & Resultados Esperados */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                  {/* Mock Video Player */}
                                  <div className="md:col-span-8 p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-2.5">
                                      <PlayCircle className="w-4 h-4 text-rose-500" />
                                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                                        Ejemplo en contexto
                                      </h4>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                                      {/* Simulated Video Thumbnail */}
                                      <div className="w-[124px] h-[164px] rounded-2xl bg-zinc-900 border border-white/10 relative overflow-hidden group shrink-0 shadow-lg select-none">
                                        <img
                                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop"
                                          alt="Video representation model"
                                          className="w-full h-full object-cover opacity-80"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="w-10 h-10 rounded-full bg-[#FF5D1E]/90 flex items-center justify-center text-white shadow-md active:scale-95 transition-transform cursor-pointer">
                                            <svg className="w-5 h-5 fill-white stroke-none ml-0.5" viewBox="0 0 24 24">
                                              <path d="M8 5v14l11-7z" />
                                            </svg>
                                          </div>
                                        </div>
                                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[8px] font-bold text-white bg-black/70 rounded">
                                          00:28
                                        </span>
                                      </div>

                                      {/* Script Timeline lines */}
                                      <div className="flex-1 text-left space-y-2 text-xs text-zinc-300 flex flex-col justify-center">
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">(Primeros 3 segundos del video)</p>
                                        <p className="italic text-zinc-200 pl-2.5 border-l-2 border-[#FF5D1E] py-1">
                                          "¿{hTitle.replace(/^¿+|^\?+|^"/g, "").replace(/¿+|\?+$/g, "")}?"
                                        </p>
                                        <p className="text-[10px] font-bold text-[#FF5D1E]/60 uppercase tracking-widest mt-1 leading-none">(Continúa con el contenido de valor...)</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stats esperado right side */}
                                  <div className="md:col-span-4 p-6 bg-[#111116]/80 border border-white/5 rounded-3xl space-y-4 flex flex-col justify-center">
                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block mb-2 text-left">
                                      Resultados Esperados
                                    </h4>
                                    <div className="space-y-4">
                                      {[
                                        { val: "+38%", l: "Más retención promedio" },
                                        { val: "+52%", l: "Más interacción activa" },
                                        { val: "+29%", l: "Más clics de enlace" }
                                      ].map((stat, sIdx) => (
                                        <div key={sIdx} className="text-left border-l border-emerald-500/30 pl-2.5 py-0.5">
                                          <h5 className="text-base font-black text-emerald-400 leading-none">{stat.val}</h5>
                                          <p className="text-[10px] text-zinc-400 font-normal mt-0.5 leading-snug">{stat.l}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                  {/* Por qué funciona */}
                                  <div className="md:col-span-8 p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-lg bg-[#FF5D1E]/10 flex items-center justify-center text-[#FF5D1E]">
                                        <Lightbulb className="w-4 h-4" />
                                      </div>
                                      <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-wider">
                                        Por qué este gancho funciona
                                      </h4>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                                      Este gancho combina curiosidad + deseo + oportunidad para secuestrar el foco de atención del visitante de forma instantánea.
                                    </p>
                                    <ul className="space-y-3 pt-1">
                                      <li className="flex items-start gap-2.5 text-xs text-zinc-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5D1E] shrink-0 mt-1.5" />
                                        <span>
                                          <strong className="text-white font-bold">Curiosidad:</strong> Plantea una pregunta intrigante que reta creencias directas y desafía al lector a buscar la respuesta.
                                        </span>
                                      </li>
                                      <li className="flex items-start gap-2.5 text-xs text-zinc-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5D1E] shrink-0 mt-1.5" />
                                        <span>
                                          <strong className="text-white font-bold">Deseo:</strong> Apela a un incremento exponencial de ingresos o estabilidad financiera, lo cual es altamente aspiracional.
                                        </span>
                                      </li>
                                      <li className="flex items-start gap-2.5 text-xs text-zinc-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5D1E] shrink-0 mt-1.5" />
                                        <span>
                                          <strong className="text-white font-bold">Oportunidad:</strong> Introduce el concepto de que dominar una sola destreza basta para lograrlo, lo que hace el camino simple y motivador.
                                        </span>
                                      </li>
                                    </ul>
                                  </div>

                                  {/* Disparadores psicológicos card */}
                                  <div className="md:col-span-4 p-6 bg-[#111116]/80 border border-white/5 rounded-3xl space-y-4 flex flex-col justify-between">
                                    <div>
                                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block mb-4">
                                        Disparadores Psicológicos
                                      </h4>
                                      <div className="space-y-3.5">
                                        {[
                                          { label: "Curiosidad", desc: "Altamente estimula la intriga" },
                                          { label: "Ambición", desc: "Despierta metas financieras" },
                                          { label: "Oportunidad", desc: "Ruta de aprendizaje simple" }
                                        ].map((d, i) => (
                                          <div key={i} className="flex items-center justify-between gap-1">
                                            <div className="text-left">
                                              <p className="text-xs font-black text-white leading-none">{d.label}</p>
                                              <p className="text-[9px] text-zinc-500 mt-0.5">{d.desc}</p>
                                            </div>
                                            {/* Green check circle */}
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                              <Check className="w-3.5 h-3.5" />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Section: Cuándo y Dónde Usarlo & Ideal Para */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                  {/* Cuándo usar */}
                                  <div className="md:col-span-8 p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-3">
                                    <div className="flex items-center gap-2.5">
                                      <Calendar className="w-4 h-4 text-indigo-400" />
                                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                                        Cuándo y dónde usarlo
                                      </h4>
                                    </div>
                                    <p className="text-xs text-zinc-300 leading-relaxed font-normal pt-1">
                                      Úsalo estrictamente en los primeros <strong className="text-white font-extrabold">3 segundos</strong> de tus videos cortos y anuncios de conversión directa. Formatos ideales: Reels, TikTok, Shorts, Stories y campaigns de pauta publicitaria.
                                    </p>
                                  </div>

                                  {/* Ideal para */}
                                  <div className="md:col-span-4 p-6 bg-[#111116]/80 border border-white/5 rounded-3xl space-y-3 flex flex-col justify-start">
                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                                      Ideal para
                                    </h4>
                                    <div className="flex flex-wrap gap-2 pt-1.5">
                                      {["Nuevos seguidores", "Tráfico frío", "Audiencias amplias"].map((tag, i) => (
                                        <span
                                          key={i}
                                          className="px-2.5 py-1 rounded-lg bg-zinc-800/40 border border-zinc-700/30 text-[10px] font-bold text-zinc-300 block select-none"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeHookTab === "Psicología" && (
                              <div className="p-6 md:p-8 pt-5 space-y-6">
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] space-y-4">
                                  <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-black uppercase w-fit">
                                    Estrategia Psicológica de Fondo
                                  </div>
                                  <p className="text-sm md:text-base text-zinc-100 leading-relaxed font-normal italic">
                                    "{hStrategy}"
                                  </p>
                                  
                                  <div className="border-t border-white/5 pt-4 space-y-3">
                                    <h5 className="text-xs font-black text-white uppercase tracking-wider">
                                      ¿Cómo influye este gancho en el prospecto ideal?
                                    </h5>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                      Al atacar de frente una creencia tradicional limitante o la insatisfacción por las ganancias actuales, obligas al cerebro reptiliano de tu espectador a pausar el deslizamiento de pantalla por mero instinto de supervivencia profesional. Una vez ganados esos 3 segundos iniciales, la curiosidad se transfiere directamente al resto del guion estético de conversión.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeHookTab === "Guión de Video" && (
                              <div className="p-6 md:p-8 pt-5 space-y-6">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-black uppercase w-fit select-none">
                                      Guión de Video Completo
                                    </div>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(scriptText);
                                        alert("¡Guión copiado al portapapeles!");
                                      }}
                                      className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg font-bold transition-all cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5" /> Copiar Guión
                                    </button>
                                  </div>
                                  
                                  <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-[2rem] relative">
                                    <pre className="text-xs sm:text-sm text-zinc-350 font-mono whitespace-pre-wrap leading-relaxed select-all">
                                      {scriptText || "No hay guión guardado para este hook."}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeHookTab === "Copy para Anuncio" && (
                              <div className="p-6 md:p-8 pt-5 space-y-6">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-black uppercase w-fit select-none">
                                      Texto para Caption / Pauta en Redes
                                    </div>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(adsText);
                                        alert("¡Texto de pauta copiado al portapapeles!");
                                      }}
                                      className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg font-bold transition-all cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5" /> Copiar Copy
                                    </button>
                                  </div>
                                  
                                  <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-[2rem] relative">
                                    <pre className="text-xs sm:text-sm text-zinc-350 font-sans whitespace-pre-wrap leading-relaxed select-all">
                                      {adsText || "No hay copy publicitario redactado para este gancho."}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeHookTab === "CTA Sugerido" && (
                              <div className="p-6 md:p-8 pt-5 space-y-6">
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] space-y-4 text-left">
                                  <div className="flex items-center gap-2 px-2.5 py-1 bg-[#FF5D1E]/10 border border-[#FF5D1E]/20 text-[#FF5D1E] rounded-lg text-xs font-black uppercase w-fit select-none">
                                    Llamados a la Acción Invisibles
                                  </div>
                                  <p className="text-xs md:text-sm text-zinc-350 leading-relaxed font-normal">
                                    Evita vender directamente en tus videos cortos. En su lugar, usa ganchos con "palabras mágicas" en comentarios para derivar tráfico en piloto automático:
                                  </p>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                                      <strong className="text-white text-xs font-bold block uppercase text-emerald-400 select-none font-sans">Mensajería Directa</strong>
                                      <p className="text-xs text-zinc-300 leading-relaxed">
                                        "Comenta la palabra <span className="text-[#FF5D1E] font-black">'{isManicurista ? "MANICURA" : isMicroblading ? "CEJAS" : "BELLEZA"}'</span> aquí abajo y te enviaré tus credenciales de acceso gratuito a la masterclass de hoy mismo por DM."
                                      </p>
                                    </div>
                                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                                      <strong className="text-white text-xs font-bold block uppercase text-sky-400 select-none font-sans">Enlace en el Perfil</strong>
                                      <p className="text-xs text-zinc-300 leading-relaxed">
                                        "Toca el enlace de mi perfil ahora mismo para unirte a nuestro taller y descargar la guía práctica de conversión sin demoras."
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeHookTab === "Variaciones" && (
                              <div className="p-6 md:p-8 pt-5 space-y-6 text-left">
                                <div className="space-y-4">
                                  <span className="text-[10px] font-black uppercase text-pink-400 tracking-widest bg-pink-500/10 px-2.5 py-1 rounded-md select-none">
                                    Variaciones de Miniaturas / Portadas
                                  </span>
                                  <p className="text-xs text-zinc-400">
                                    Recomendamos ensayar estas variaciones en tus portadas de video fijas para duplicar tus CTR de visualización:
                                  </p>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                                    {thumbsList.length > 0 ? (
                                      thumbsList.map((thumb: string, tIdx: number) => (
                                        <div
                                          key={tIdx}
                                          className="p-5 bg-[#14141c]/50 border border-white/5 hover:border-pink-500/20 rounded-2xl transition-all"
                                        >
                                          <p className="text-[9px] font-extrabold text-pink-300 uppercase tracking-widest select-none">
                                            VARIACIÓN {tIdx + 1}
                                          </p>
                                          <p className="mt-2 text-xs md:text-sm text-white leading-normal font-sans font-bold">
                                            {thumb}
                                          </p>
                                        </div>
                                      ))
                                    ) : (
                                      ["Prueba Gratis Hoy 💸", "Logra el Éxito Estético 📈", "Controla Tu Tiempo Mañana ⏰"].map((thumb, tIdx) => (
                                        <div
                                          key={tIdx}
                                          className="p-5 bg-[#14141c]/50 border border-white/5 rounded-2xl"
                                        >
                                          <p className="text-[9px] font-extrabold text-pink-300 uppercase tracking-widest select-none">
                                            VARIACIÓN {tIdx + 1}
                                          </p>
                                          <p className="mt-2 text-xs md:text-sm text-white leading-normal font-sans font-bold text-left">
                                            {thumb}
                                          </p>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                              </>
                            )}
                          </div>

                          {/* Persistent Plan PRO Bottom Conversion Banner */}
                          {!isActiveHookLocked && (
                            <div className="p-6 md:p-8 pt-3 border-t border-white/[0.04] bg-[#08080c]/30 mt-auto">
                            <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 via-[#FF5D1E]/5 to-[#0c0c11] border border-amber-500/20 space-y-6 text-left relative overflow-hidden">
                              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF5D1E]/5 blur-3xl rounded-full" />
                              <div className="flex items-start gap-3.5">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 select-none font-sans">
                                  <Crown className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-sm md:text-base font-black text-white uppercase tracking-tight">
                                    Desbloquea todo el poder de tus ganchos de atracción
                                  </h4>
                                  <p className="text-xs text-zinc-300 leading-normal font-normal">
                                    Accede a los 27 hooks restantes + plantillas de guiones técnicos + análisis de rendimiento completo.
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2.5 border-y border-white/[0.03]">
                                {[
                                  { v: "30 Ganchos", l: "al mes directos" },
                                  { v: "Guiones", l: "completos listos" },
                                  { v: "Análisis de", l: "rendimiento estético" },
                                  { v: "Variaciones", l: "ilimitadas de portada" }
                                ].map((feat, i) => (
                                  <div key={i} className="text-left space-y-0.5">
                                    <p className="text-xs font-black text-white uppercase tracking-wide leading-none">{feat.v}</p>
                                    <p className="text-[9px] text-zinc-400 leading-tight mt-1">{feat.l}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="space-y-2.5">
                                <button
                                  onClick={() => setShowUpgradeModal(true)}
                                  className="w-full py-3.5 bg-gradient-to-r from-[#FF5D1E] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black uppercase text-xs tracking-widest transition-all rounded-[18px] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,90,31,0.22)] active:scale-[0.99] cursor-pointer"
                                >
                                  <Crown className="w-4 h-4 text-white" /> Desbloquear Plan PRO
                                </button>
                                <p className="text-[9px] text-center text-zinc-500 uppercase tracking-widest font-black leading-none">
                                  Cancela cuando quieras • Acceso inmediato y seguro
                                </p>
                              </div>
                            </div>
                          </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                {activeDetailsDrawer === "blog" &&
                  selectedBlogForDrawer &&
                  (() => {
                    const blog = selectedBlogForDrawer;
                    const bTitle = blog.title;
                    
                    const enfoque = blog.enfoqueEstrategico || "Enfoque y posicionamiento estratégico para captar tráfico altamente cualificado.";
                    const intencion = blog.intencionBusqueda || "Gancho psicológico y derivación hacia la compra del producto.";
                    const keyword = blog.keywordSeo || "negocio, servicios, captacion de clientes";
                    const volumen = blog.volumenBusqueda || "500 - 1K";

                    const keywordsList = keyword
                      .split(",")
                      .map((k: string) => k.trim())
                      .filter(Boolean);

                    return (
                      <div className="space-y-8 font-sans text-left">
                        <p className="text-white text-sm md:text-base font-normal leading-relaxed tracking-wide opacity-80">
                          Esta es la estructura estratégica de posicionamiento para tu Artículo de
                          Blog SEO optimizado. Diseñado para atraer prospectos calificados y derivar tráfico orgánico de alto valor.
                        </p>

                        {/* Título */}
                        <div className="p-6 bg-gradient-to-r from-[#FFBF00]/10 via-[#FFBF00]/5 to-transparent border border-[#FFBF00]/20 rounded-3xl relative overflow-hidden space-y-2">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>
                          <span className="text-[10px] font-black uppercase text-[#FFBF00] tracking-widest block">
                            Título del Artículo de Blog
                          </span>
                          <p className="text-xl md:text-2xl font-black text-white leading-relaxed font-sans">
                            {bTitle}
                          </p>
                        </div>

                        {/* Enfoque Estratégico */}
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5 hover:border-[#FFBF00]/20 transition-all duration-300">
                          <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block font-sans">
                            Enfoque Estratégico
                          </span>
                          <p className="text-sm md:text-base text-zinc-100 leading-relaxed font-normal">
                            {enfoque}
                          </p>
                        </div>

                        {/* Intención de Búsqueda */}
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5 hover:border-[#FFBF00]/20 transition-all duration-300">
                          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block font-sans">
                            Intención de Búsqueda / Compra
                          </span>
                          <p className="text-sm md:text-base text-zinc-100 leading-relaxed font-normal">
                            {intencion}
                          </p>
                        </div>

                        {/* Keyword SEO & Volumen de Búsqueda (Grid Layout) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-normal">
                          {/* Keyword SEO Column */}
                          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#FFBF00]/20 transition-all duration-300">
                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block mb-3 font-sans">
                              Keyword SEO
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {keywordsList.map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold font-mono"
                                >
                                  🔑 {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Volumen de Búsqueda Column */}
                          <div className="p-5 bg-[#111116] border border-white/5 rounded-2xl hover:border-[#FFBF00]/20 transition-all duration-300">
                            <span className="text-[10px] font-black uppercase text-pink-400 tracking-widest block mb-2 font-sans">
                              Volumen de Búsqueda
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">📈</span>
                              <p className="text-lg font-black text-white font-mono tracking-tight leading-none">
                                {volumen}
                              </p>
                            </div>
                          </div>
                        </div>

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

      {/* DRAWER INTERACTIVO DE ESTRATEGIA COMERCIAL (Imagen 1 e Imagen 2) */}
      <AnimatePresence>
        {isEstrategiaDrawerOpen && (
          <div className="fixed inset-0 z-[155] overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                setIsEstrategiaDrawerOpen(false);
                setActiveComercialOption(null);
              }}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className={`relative h-full bg-[#0b0b0f] border-l border-white/5 shadow-[-15px_0_50px_rgba(0,0,0,0.9)] flex flex-col z-10 overflow-hidden text-left transition-all duration-300 ${
                activeComercialOption ? "w-full max-w-[1300px]" : "w-full max-w-lg md:max-w-xl"
              }`}
            >
              {/* VISTA BÁSICA (Imagen 1: Solo Drawer) */}
              {!activeComercialOption ? (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b border-white/[0.04] bg-[#0e0e14]/80 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5D1E] shrink-0">
                        <Target className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg md:text-xl font-extrabold text-white">Estrategia Comercial</h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-wider">
                            ✓ COMPLETADO Y ACTIVO
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1">
                          Planes de atracción y optimización
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEstrategiaDrawerOpen(false)}
                      className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="text-left space-y-2">
                      <p className="text-zinc-100 text-sm sm:text-base font-semibold leading-relaxed">
                        La hoja de ruta principal para vender tu <span className="text-white font-extrabold text-sm sm:text-base">Planes de atracción y optimización</span> con éxito.
                      </p>
                      <div className="flex items-center gap-2 text-[#FF5D1E] pt-1">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">8 componentes generados</span>
                      </div>
                    </div>

                    {/* Las 8 Opciones (Imagen 1 Layout) */}
                    <div className="space-y-3.5">
                      {[
                        { id: "avatar", title: "Avatares Psicológicos" },
                        { id: "testimonials", title: "Testimonios Persuasivos" },
                        { id: "objections", title: "Frustraciones del Avatar" },
                        { id: "benefits", title: "Beneficios Magnéticos" },
                        { id: "proposition", title: "Propuesta de Valor" },
                        { id: "offer", title: "Oferta Principal" },
                        { id: "funnel", title: "Embudo de Conversión" },
                        { id: "cta", title: "CTA Principal" },
                      ].map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setActiveComercialOption(opt.id as any);
                            setAvatarSubTab("resumen");
                          }}
                          className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] hover:border-[#FF5D1E]/40 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-[#FF5D1E]/[0.02] group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-[18px] h-[18px] rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-bold text-white group-hover:text-[#FF5D1E] transition-colors leading-snug">
                                {opt.title}
                              </h4>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:text-[#FF5D1E] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* VISTA EXPANDIDA COMPLETA (Imagen 2: Split Layout Dual) */
                <div className="flex flex-col h-full bg-[#0b0b0f]">
                  {/* Top Header */}
                  <div className="p-4 md:p-6 border-b border-white/[0.04] bg-[#0e0e14]/80 backdrop-blur-md flex items-center justify-between">
                    <button
                      onClick={() => setActiveComercialOption(null)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all text-xs font-bold"
                    >
                      <span>← Volver al listado</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEstrategiaDrawerOpen(false);
                        setActiveComercialOption(null);
                      }}
                      className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none shrink-0"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>

                  {/* Main Grid Wrapper */}
                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left Column (35-40%): Sidebar menu inside split */}
                    <div className="w-full md:w-[320px] lg:w-[350px] bg-[#0d0d12] border-r border-white/[0.04] p-5 flex flex-col gap-5 overflow-y-auto shrink-0">
                      {/* Comercial strategy resume header */}
                      <div className="p-4 bg-white/[0.01]/50 border border-white/5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5D1E]">
                            <Target className="w-4.5 h-4.5" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-sm font-semibold text-white leading-normal">Estrategia Comercial</h3>
                            <span className="inline-block mt-0.5 text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-black tracking-wide leading-none select-none">
                              ✓ COMPLETADO Y ACTIVO
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                          <FileText className="w-3.5 h-3.5 text-[#FF5D1E]" />
                          <span>8 componentes generados</span>
                        </div>
                      </div>

                      {/* 8 Selected / Unselected list items */}
                      <div className="space-y-2">
                        {[
                          { id: "avatar", title: "Avatares Psicológicos" },
                          { id: "testimonials", title: "Testimonios Persuasivos" },
                          { id: "objections", title: "Frustraciones del Avatar" },
                          { id: "benefits", title: "Beneficios Magnéticos" },
                          { id: "proposition", title: "Propuesta de Valor" },
                          { id: "offer", title: "Oferta Principal" },
                          { id: "funnel", title: "Embudo de Conversión" },
                          { id: "cta", title: "CTA Principal" },
                        ].map((opt) => {
                          const isActive = activeComercialOption === opt.id;
                          return (
                            <div
                              key={opt.id}
                              onClick={() => {
                                setActiveComercialOption(opt.id as any);
                                setAvatarSubTab("resumen");
                              }}
                              className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
                                isActive
                                  ? "bg-[#FF5D1E]/[0.04] border-[#FF5D1E]/40 text-white font-extrabold shadow-sm shadow-[#FF5D1E]/5"
                                  : "bg-white/[0.01] border-white/[0.03] text-zinc-400 hover:bg-white/[0.03] hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                                  isActive
                                    ? "bg-emerald-500/10 border-emerald-500/45 text-emerald-400"
                                    : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
                                }`}>
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <span className="text-xs sm:text-[13px] tracking-tight">{opt.title}</span>
                              </div>
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                                isActive ? "text-[#FF5D1E]" : "text-zinc-650"
                              }`} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column (60-65%): Content details pane with scroll-y */}
                    <div className="flex-1 bg-[#0b0b0f] p-5 md:p-8 overflow-y-auto space-y-6">

                      {/* 1. COMPONENTE: AVATARES PSICOLÓGICOS */}
                      {activeComercialOption === "avatar" && (
                        <div className="space-y-6 text-left">
                          {/* Inner Header */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/5">
                              <Users className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Avatares Psicológicos</h2>
                              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1">
                                Tus compradores ideales totalmente perfilados con sus dolores, deseos y motivaciones de compra. Haz clic en cualquiera de ellos para ver su análisis detallado.
                              </p>
                            </div>
                          </div>

                          {/* Accordion List for 3 Avatars */}
                          <div className="space-y-5 mt-4">
                            {(() => {
                              const defaultAvs = [
                                {
                                  name: "María Fernanda",
                                  priority: "PRINCIPAL",
                                  priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
                                  audiencePct: "68% DE TU AUDIENCIA",
                                  audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                                  img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
                                  age: "28 - 35 años",
                                  occupation: "Emprendedora",
                                  income: "Ingresos variables",
                                  // Resumen Tab
                                  dolores_principales: [
                                    "No tiene suficientes clientes estables.",
                                    "Siente que su trabajo no es valorado como debería.",
                                    "Le cuesta diferenciarse en un mercado saturado.",
                                    "Miedo a invertir en formación y no ver resultados.",
                                  ],
                                  deseos_principales: [
                                    "Tener más clientes y agenda llena.",
                                    "Ser reconocida como experta en su área.",
                                    "Lograr independencia financiera.",
                                    "Tener flexibilidad de tiempo y ubicación.",
                                  ],
                                  quote: "Aprende una técnica profesional, con acompañamiento real, para que consigas más clientes, mejores ingresos y la libertad que mereces.",
                                  // Demográfico Tab
                                  demographics: [
                                    { label: "Nivel de Estudios", val: "Universitario o Técnico Superior" },
                                    { label: "Ocupación de Preferencia", val: "Cosmetóloga independiente o Esteticista" },
                                    { label: "Rango de Ingresos", val: "Ingreso base inestable ($600 - $1,200 USD/mes)" },
                                    { label: "Ubicación Geográfica", val: "Zonas semi-urbanas y urbanas" },
                                    { label: "Estado Civil", val: "Soltera o casada con hijos pequeños" },
                                    { label: "Dispositivos de uso", val: "Smartphone de gama media-alta, Instagram, WhatsApp" },
                                  ],
                                  // Dolores y miedos ocultos Tab
                                  dolores_ocultos: [
                                    { title: "CLIENTELA INESTABLE", text: "No tiene suficientes clientes estables, lo que le genera una alta incertidumbre mensual sobre la facturación de su negocio." },
                                    { title: "TRABAJO DESVALORADO", text: "Siente que su trabajo no es valorado como debería y que las clientas siempre buscan la opción más barata regateando precios." },
                                    { title: "MARKETING INVISIBLE", text: "Le cuesta diferenciarse en un mercado saturado de profesionales independientes ofreciendo lo mismo a precios muy bajos." },
                                    { title: "INVERSIÓN SIN RETORNO", text: "Miedo a invertir en formación y no ver resultados, perdiendo sus recursos en teoría aburrida que no puede aplicar en la práctica real." },
                                  ],
                                  // Deseos y motivaciones Tab
                                  deseos_motivaciones: [
                                    { title: "AGENDA LLENA", text: "Tener más clientes y la agenda completamente llena con meses de anticipación sin tener que regatear tarifas." },
                                    { title: "EXPERTA RECONOCIDA", text: "Ser reconocida formalmente como una de las mejores expertas referentes en su área y ciudad." },
                                    { title: "INDEPENDENCIA FINANCIERA", text: "Lograr verdadera estabilidad e independencia económica para tomar decisiones con libertad." },
                                    { title: "FLEXIBILIDAD ABSOLUTA", text: "Tener control total de sus propios horarios de atención y la flexibilidad de tiempo y ubicación que siempre soñó." },
                                  ],
                                  // Comportamientos Tab
                                  comportamientos: [
                                    "Sigue activamente cuentas de gurús de belleza y marketing estético en Instagram y TikTok.",
                                    "Paga pequeños talleres o webinars rápidos de $20 a $50 USD buscando secretos aplicables.",
                                    "Pregunta constantemente en grupos de Facebook qué marcas de pigmentos o inductores son mejores.",
                                    "Consume video tutoriales rápidos por las noches antes de dormir buscando perfeccionar trazo de cejas.",
                                  ]
                                },
                                {
                                  name: "Valeria Mendoza",
                                  priority: "SECUNDARIO",
                                  priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
                                  audiencePct: "22% DE TU AUDIENCIA",
                                  audienceClass: "bg-amber-500/10 border-amber-500/30 text-amber-500 border",
                                  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
                                  age: "22 - 27 años",
                                  occupation: "Cosmetóloga Junior",
                                  income: "Ingreso fijo bajo",
                                  // Resumen Tab
                                  dolores_principales: [
                                    "Siente estancamiento profesional por falta de especialización.",
                                    "Su sueldo actual en un centro de estética no compensa su esfuerzo.",
                                    "Temor a estropear el rostro de un cliente con técnicas dudosas.",
                                    "Falta de contactos y red de clientes para iniciar sola.",
                                  ],
                                  deseos_principales: [
                                    "Especializarse en la técnica más demandada del rubro.",
                                    "Abrir su propio centro o cabina privada el próximo año.",
                                    "Cobrar el dible o triple por hora de servicio certificado.",
                                    "Desarrollar un portafolio de cejas impactante.",
                                  ],
                                  quote: "Especialízate con un método paso a paso garantizado para que dupliques tus tarifas actuales y obtengas la acreditación que tus clientes valoran.",
                                  // Demográfico Tab
                                  demographics: [
                                    { label: "Nivel de Estudios", val: "Técnico medio o Curso comercial avanzado" },
                                    { label: "Ocupación de Preferencia", val: "Ayudante de cabina o Lashista junior" },
                                    { label: "Rango de Ingresos", val: "Sueldo fijo base ($400 - $700 USD/mes)" },
                                    { label: "Ubicación Geográfica", val: "Zonas urbanas y residenciales" },
                                    { label: "Estado Civil", val: "Soltera sin hijos" },
                                    { label: "Dispositivos de uso", val: "iPhone/Android de última generación, TikTok, Pinterest" },
                                  ],
                                  // Dolores y miedos ocultos Tab
                                  dolores_ocultos: [
                                    { title: "El miedo al estancamiento profesional", text: "Teme trabajar como empleada toda su vida sin ver su propio crecimiento financiero." },
                                    { title: "Falta de credibilidad", text: "Le preocupa que las clientas no confíen en ella por verse muy joven o no tener certificación reconocida de alta gama." },
                                    { title: "Inestabilidad emocional", text: "La baja remuneración genera que dude de su propia pasión por la belleza y estética profesional." },
                                  ],
                                  // Deseos y motivaciones Tab
                                  deseos_motivaciones: [
                                    { title: "Reconocimiento y Estatus", text: "Ser la especialista de referencia a la que las clientas agendan con semanas de anticipación corporativa." },
                                    { title: "Aumentar Tarifas", text: "Pasar de cobrar servicios baratos de $15 a tratamientos premium de más de $150 de forma segura." },
                                    { title: "Estilo de Vida Independiente", text: "Crear una marca personal respetada con identidad visual propia en redes sociales." },
                                  ],
                                  // Comportamientos Tab
                                  comportamientos: [
                                    "Guarda tableros de fotos de cejas perfectas y estética minimalista en Pinterest.",
                                    "Sigue tendencias de micropigmentación internacionales de Europa y Brasil.",
                                    "Compara activamente los precios de academias en línea para decidir su inversión.",
                                    "Práctica exhaustivamente en látex para perfeccionar la precisión de sus trazos.",
                                  ]
                                },
                                {
                                  name: "Mónica Silva",
                                  priority: "COMPLEMENTARIO",
                                  priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
                                  audiencePct: "10% DE TU AUDIENCIA",
                                  audienceClass: "bg-violet-500/10 border-violet-500/30 text-violet-500 border",
                                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
                                  age: "36 - 45 años",
                                  occupation: "Emprendedora desde cero",
                                  income: "Sin ingresos estables",
                                  // Resumen Tab
                                  dolores_principales: [
                                    "Miedo extremo a comenzar en un rubro totalmente desconocido.",
                                    "Creer que ya 'pasó su momento' o es muy mayor para aprender tecnologías de belleza.",
                                    "Dudas sobre su pulso y coordinación motora fina.",
                                    "Inseguridad al vender o hacer marketing en su nueva etapa.",
                                  ],
                                  deseos_principales: [
                                    "Reinventarse profesionalmente con un negocio moderno.",
                                    "Generar una fuente confiable de ingresos para el hogar.",
                                    "Demostrar a su entorno que puede liderar su propio proyecto.",
                                    "Tener el control total de sus finanzas corporativas.",
                                  ],
                                  quote: "No necesitas experiencia previa para triunfar. Nuestro programa te acompaña desde cero, cuidando tu técnica y enseñándote a vender sin esfuerzo.",
                                  // Demográfico Tab
                                  demographics: [
                                    { label: "Nivel de Estudios", val: "Educación técnica o administrativa" },
                                    { label: "Ocupación de Preferencia", val: "Ama de casa o Ex-empleada administrativa" },
                                    { label: "Rango de Ingresos", val: "Dependiente de ahorros familiares o pareja" },
                                    { label: "Ubicación Geográfica", val: "Zonas residenciales y capitales de provincia" },
                                    { label: "Estado Civil", val: "Casada con hijos adolescentes" },
                                    { label: "Dispositivos de uso", val: "Tablet, Facebook, canales de YouTube educativos" },
                                  ],
                                  // Dolores y miedos ocultos Tab
                                  dolores_ocultos: [
                                    { title: "La barrera del aprendizaje técnico", text: "Duda de su capacidad para asimilar conceptos modernos o dominar herramientas de alta precisión." },
                                    { title: "Miedo al rechazo comercial", text: "Le aterra el proceso de vender o hablar con clientas desconocidas sobre precios y retornos." },
                                    { title: "El síndrome de la impostora tardía", text: "Siente que el mercado es para jóvenes influencers de belleza y le cuesta encajar visualmente." },
                                  ],
                                  // Deseos y motivaciones Tab
                                  deseos_motivaciones: [
                                    { title: "Seguridad Financiera Post-Jubilación", text: "Construir un activo rentable y duradero que le dé tranquilidad a mediano-largo plazo." },
                                    { title: "Empoderamiento Familiar", text: "Aportar económicamente al hogar disminuyendo la presión financiera sobre su cónyuge." },
                                    { title: "Autorealización Personal", text: "Desarrollar un oficio creativo e inspirador que llene su tiempo de valor y orgullo propio." },
                                  ],
                                  // Comportamientos Tab
                                  comportamientos: [
                                    "Sigue grupos comunitarios locales de emprendedores locales y negocios pymes.",
                                    "Prefiere cursos con soporte personalizado, llamadas en vivo o grupos cerrados de ayuda.",
                                    "Busca recomendaciones de boca en boca para evaluar la seriedad de una propuesta.",
                                    "Toma notas escritas detalladas en cuadernos físicos durante las clases teóricas.",
                                  ]
                                }
                              ];

                              const hasSavedAvatars = !!(strategyData?.avatars && strategyData.avatars.length > 0);
                              const baseAvs = getSystemAvatars(strategyData);

                              const avatarsToRender = [0, 1, 2].map((idx) => {
                                const defaultAv = defaultAvs[idx];
                                const baseAv = baseAvs[idx];
                                const realAv = strategyData?.avatars?.[idx];

                                const name = realAv?.name || (hasSavedAvatars ? "(no definido)" : baseAv.name);
                                const age = realAv?.ageRange || realAv?.age || realAv?.age_range || (hasSavedAvatars ? "(no definido)" : baseAv.age);
                                const occupation = realAv?.occupation || realAv?.archetype || realAv?.profession || realAv?.profession_title || realAv?.job || realAv?.role || (hasSavedAvatars ? "(no definido)" : baseAv.occupation);
                                const income = realAv?.income || realAv?.incomeRange || (hasSavedAvatars ? "(no definido)" : baseAv.income);
                                const img = realAv?.image || realAv?.img || baseAv.img;
                                const quote = realAv?.quote || realAv?.message || (hasSavedAvatars ? "(no definido)" : defaultAv.quote);
                                
                                let dolores_principales = hasSavedAvatars ? [] : defaultAv.dolores_principales;
                                if (realAv?.dolores_principales && Array.isArray(realAv.dolores_principales)) {
                                  dolores_principales = realAv.dolores_principales;
                                } else if (realAv?.pain_points && Array.isArray(realAv.pain_points)) {
                                  dolores_principales = realAv.pain_points;
                                } else if (realAv?.pain) {
                                  dolores_principales = [
                                    realAv.pain,
                                    ...(hasSavedAvatars ? [] : defaultAv.dolores_principales.slice(1))
                                  ];
                                }

                                let deseos_principales = hasSavedAvatars ? [] : defaultAv.deseos_principales;
                                if (realAv?.deseos_principales && Array.isArray(realAv.deseos_principales)) {
                                  deseos_principales = realAv.deseos_principales;
                                } else if (realAv?.desires && Array.isArray(realAv.desires)) {
                                  deseos_principales = realAv.desires;
                                } else if (realAv?.desire || realAv?.transformation_title) {
                                  deseos_principales = [
                                    realAv.desire || realAv.transformation_title,
                                    ...(hasSavedAvatars ? [] : defaultAv.deseos_principales.slice(1))
                                  ];
                                }

                                const demographics = [
                                  { label: "Nivel de Estudios", val: realAv?.education || realAv?.studies || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[0].val) },
                                  { label: "Ocupación de Preferencia", val: realAv?.occupation || realAv?.archetype || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[1].val) },
                                  { label: "Rango de Ingresos", val: realAv?.income || realAv?.incomeRange || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[2].val) },
                                  { label: "Ubicación Geográfica", val: realAv?.location || realAv?.geographic || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[3].val) },
                                  { label: "Estado Civil", val: realAv?.civilStatus || realAv?.marital_status || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[4].val) },
                                  { label: "Dispositivos de uso", val: realAv?.devices || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[5].val) },
                                ];

                                let dolores_ocultos = hasSavedAvatars ? [] : defaultAv.dolores_ocultos;
                                if (realAv?.dolores_ocultos && Array.isArray(realAv.dolores_ocultos)) {
                                  dolores_ocultos = realAv.dolores_ocultos;
                                } else if (realAv?.pain || realAv?.detailed_pains) {
                                  const list = Array.isArray(realAv.detailed_pains) ? realAv.detailed_pains : (realAv.pain ? [realAv.pain] : []);
                                  if (list.length > 0) {
                                    dolores_ocultos = list.map((p: any, i: number) => ({
                                      title: defaultAv.dolores_ocultos[i % defaultAv.dolores_ocultos.length]?.title || "Dolor Identificado",
                                      text: typeof p === 'string' ? p : p.text || p.title || ""
                                    }));
                                  }
                                }

                                let deseos_motivaciones = hasSavedAvatars ? [] : defaultAv.deseos_motivaciones;
                                if (realAv?.deseos_motivaciones && Array.isArray(realAv.deseos_motivaciones)) {
                                  deseos_motivaciones = realAv.deseos_motivaciones;
                                } else if (realAv?.desire || realAv?.motivations || realAv?.decisionDrivers || realAv?.drivers) {
                                  const list = Array.isArray(realAv.drivers) ? realAv.drivers : (Array.isArray(realAv.decisionDrivers) ? realAv.decisionDrivers : (realAv.desire ? [realAv.desire] : []));
                                  if (list.length > 0) {
                                    deseos_motivaciones = list.map((d: any, i: number) => ({
                                      title: defaultAv.deseos_motivaciones[i % defaultAv.deseos_motivaciones.length]?.title || "Motivador Clave",
                                      text: typeof d === 'string' ? d : d.text || d.title || ""
                                    }));
                                  }
                                }

                                let comportamientos = hasSavedAvatars ? [] : defaultAv.comportamientos;
                                if (realAv?.comportamientos && Array.isArray(realAv.comportamientos)) {
                                  comportamientos = realAv.comportamientos;
                                } else if (realAv?.behaviors && Array.isArray(realAv.behaviors)) {
                                  comportamientos = realAv.behaviors;
                                }

                                const defaultMotivationsForIdx = {
                                  dinero: idx === 0 ? "Retorno de inversión garantizado con su primer set de clientas." : idx === 1 ? "Garantía de reembolso o método blindado para proteger su capital y no desperdiciar ni un dólar más." : "Generar ingresos estables desde casa para lograr libertad financiera real.",
                                  tiempo: idx === 0 ? "Establecer un flujo de trabajo optimizado para atender en menos de 90 minutes." : idx === 1 ? "Ir al grano con un sistema probado sin rodeos teóricos innecesarios." : "Flexibilidad horaria absoluta para pasar más tiempo con tus hijos o seres queridos.",
                                  estatus: idx === 0 ? "Certificación oficial de alta gama para destacar de la competencia convencional." : idx === 1 ? "Validación por expertos que la posiciona como una profesional seria ante sus clientes." : "Sentir la satisfacción and el orgullo de transicionar hacia una profesión propia.",
                                  seguridad: idx === 0 ? "Soporte uno a uno para resolver problemas reales en el inicio del negocio." : idx === 1 ? "Acompañamiento cercano anticaídas para asegurar sus primeros pasos prácticos." : "Guía paso a paso adaptada para principiantes absolutos sin experiencia previa."
                                };

                                const motivations = {
                                  ...defaultMotivationsForIdx,
                                  ...(realAv?.motivations || {})
                                };

                                return {
                                  ...defaultAv,
                                  name,
                                  img,
                                  age,
                                  occupation,
                                  income,
                                  quote,
                                  dolores_principales,
                                  deseos_principales,
                                  demographics,
                                  dolores_ocultos,
                                  deseos_motivaciones,
                                  comportamientos,
                                  motivations
                                };
                              });

                              return (
                                <div className="space-y-4">
                                  {/* Banner instructivo elegante */}
                                  <div className="flex items-center gap-2 px-1 mb-1 text-xs text-zinc-400 select-none animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5D1E]"></span>
                                    <span>Haz clic en cualquiera de los avatares para expandir y ver su análisis detallado.</span>
                                  </div>

                                  {avatarsToRender.map((av, idx) => {
                                    const isOpen = activeAvatarIndex === idx;
                                    return (
                                      <div
                                        key={idx}
                                        className={`border rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer hover:border-[#FF5D1E]/60 hover:shadow-[0_0_20px_rgba(255,93,30,0.12)] hover:bg-[#121216]/50 ${
                                          isOpen
                                            ? "bg-[#0c0c11] border-[#FF5D1E]/40 shadow-[0_10px_30px_rgba(255,100,30,0.06)]"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                        }`}
                                      >
                                        {/* Header clickable bar */}
                                        <div
                                          onClick={() => {
                                            setActiveAvatarIndex(isOpen ? null : idx);
                                          }}
                                          className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer select-none"
                                        >
                                          <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-left">
                                            {/* Avatar Picture with satinized custom border */}
                                            <div className="relative shrink-0 flex justify-center">
                                              <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-full border-2 border-[#FF5D1E] p-0.5 bg-zinc-950 shadow-[0_0_15px_rgba(255,93,30,0.25)] flex items-center justify-center overflow-hidden">
                                                <img
                                                  src={av.img}
                                                  alt={av.name}
                                                  referrerPolicy="no-referrer"
                                                  className="w-full h-full rounded-full object-cover"
                                                />
                                              </div>
                                            </div>

                                            <div className="space-y-2">
                                              <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-sans">
                                                  {av.name}
                                                </h3>
                                                {/* Badges */}
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none ${av.priorityClass}`}>
                                                  {av.priority}
                                                </span>
                                              </div>

                                              {/* demographic line with icon */}
                                              <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-[13px] font-medium flex-wrap">
                                                <Calendar className="w-4 h-4 text-[#FF5D1E] shrink-0" />
                                                <span>{av.age}</span>
                                                <span>•</span>
                                                <span>{av.occupation}</span>
                                                <span>•</span>
                                                <span>{av.income}</span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Chevron status */}
                                          <div className="flex justify-end items-center md:pl-4">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                            </div>
                                          </div>
                                        </div>

                                        {/* Accordion expandable body */}
                                        <AnimatePresence initial={false}>
                                          {isOpen && (
                                            <motion.div
                                              key="content"
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: "auto", opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.25, ease: "easeInOut" }}
                                              className="border-t border-white/[0.04]"
                                            >
                                              <div className="p-5 md:p-8 space-y-6 bg-gradient-to-b from-[#0c0c11]/80 to-[#08080c]/95">
                                                {/* Internal Tab Navigation per Expanded Avatar */}
                                                <div className="flex items-center gap-1 border-b border-white/[0.04] overflow-x-auto overflow-y-hidden pb-1 px-1 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                  {[
                                                    { id: "resumen", label: "Resumen" },
                                                    { id: "demografico", label: "Perfil Demográfico" },
                                                    { id: "dolores", label: "Dolores y Miedos" },
                                                    { id: "deseos", label: "Deseos y Motivaciones" },
                                                    { id: "comportamiento", label: "Comportamientos" },
                                                  ].map((tab) => (
                                                    <button
                                                      key={tab.id}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAvatarSubTab(tab.id as any);
                                                      }}
                                                      className={`px-2 sm:px-3.5 py-2 text-[11px] sm:text-[13px] font-bold uppercase transition-all duration-300 relative whitespace-nowrap shrink-0 border-b-2 -mb-[5px] ${
                                                        avatarSubTab === tab.id
                                                          ? "text-[#FF5D1E] border-[#FF5D1E]"
                                                          : "text-zinc-500 border-transparent hover:text-zinc-300"
                                                      }`}
                                                    >
                                                      {tab.label}
                                                    </button>
                                                  ))}
                                                </div>

                                                {/* Tab: Resumen */}
                                                {avatarSubTab === "resumen" && (
                                                  <div className="space-y-6 pt-2">

                                                    {/* Tarjetas de la Imagen 2 (Distribución de 2 por Fila) */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                      {/* Dolor Crítico */}
                                                      <div className="p-5 bg-red-500/[0.02] border border-red-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-red-500/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                        <div>
                                                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wide border border-red-500/20">Dolor Crítico</span>
                                                        </div>
                                                        <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                                          {av.dolores_principales?.[0] || "(no definido)"}
                                                        </p>
                                                      </div>

                                                      {/* Transformación Deseada */}
                                                      <div className="p-5 bg-[#10b981]/[0.02] border border-[#10b981]/10 rounded-2xl flex flex-col gap-3.5 hover:border-[#10b981]/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                        <div>
                                                          <span className="px-2 py-0.5 rounded bg-[#10b981]/10 text-[#34d399] text-[10px] font-black uppercase tracking-wide border border-[#10b981]/20">Transformación Deseada</span>
                                                        </div>
                                                        <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                                          {av.deseos_principales?.[0] || "(no definido)"}
                                                        </p>
                                                      </div>

                                                      {/* Barrera de Venta */}
                                                      <div className="p-5 bg-amber-500/[0.02] border border-amber-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-amber-500/25 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                        <div>
                                                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-wide border border-amber-500/20">Barrera de Venta</span>
                                                        </div>
                                                        <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                                          {av.dolores_principales?.[1] || "(no definido)"}
                                                        </p>
                                                      </div>

                                                      {/* Para qué Emocional */}
                                                      <div className="p-5 bg-pink-500/[0.02] border border-pink-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-pink-500/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                        <div>
                                                          <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 text-[10px] font-black uppercase tracking-wide border border-pink-500/20">Para qué Emocional</span>
                                                        </div>
                                                        <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                                          {av.deseos_principales?.[1] || "(no definido)"}
                                                        </p>
                                                      </div>
                                                    </div>

                                                    {/* Drivers de decisión */}
                                                    <div className="pt-6 border-t border-white/[0.04] text-left">
                                                      <p className="text-[#FFBF00] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <span className="text-[#FFBF00]">⚡</span> DRIVERS DE DECISIÓN
                                                      </p>
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {Object.entries(av.motivations || {}).map(([key, value]: any) => {
                                                          const isStringValue = typeof value === 'string';
                                                          if (!isStringValue) return null;
                                                          return (
                                                            <div key={key} className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-yellow-500/10 transition-all shadow-md">
                                                              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 mt-0.5">
                                                                <span className="text-[#FFBF00] font-bold text-sm">✦</span>
                                                              </div>
                                                              <div className="space-y-0.5">
                                                                <p className="text-[10px] text-[#FFBF00] font-black uppercase tracking-widest">{key.toUpperCase()}</p>
                                                                <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed font-normal text-left">{value}</p>
                                                              </div>
                                                            </div>
                                                          );
                                                        })}
                                                      </div>
                                                    </div>

                                                    {/* Quote / Hook message box (Mensaje que Más Conecta con Este Avatar) */}
                                                    <div className="space-y-3 pt-6 border-t border-white/[0.04] text-left">
                                                      <span className="text-xs font-black uppercase text-[#FFBF00] tracking-widest block font-sans">
                                                        Mensaje que Más Conecta con Este Avatar
                                                      </span>
                                                      <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl relative overflow-hidden">
                                                        <span className="absolute top-1 left-2.5 text-5xl font-serif text-[#FFBF00]/15 select-none">“</span>
                                                        <p className="text-sm md:text-base text-zinc-200 leading-relaxed font-semibold italic pl-4 text-left">
                                                          {av.quote}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}

                                                {/* Tab: Demográfico */}
                                                {avatarSubTab === "demografico" && (
                                                  <div className="space-y-5 pt-2 text-left">
                                                    <div className="flex items-center gap-2">
                                                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5D1E]"></span>
                                                      <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                        Perfil demográfico y tecnológico detallado de {av.name}
                                                      </p>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                      {av.demographics.map((item: any, dIdx: number) => (
                                                        <div key={dIdx} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex flex-col gap-1 justify-between hover:border-white/10 transition-colors">
                                                          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">{item.label}</span>
                                                          <span className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">{item.val}</span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* Tab: Dolores */}
                                                {avatarSubTab === "dolores" && (
                                                  <div className="space-y-5 pt-2 text-left">
                                                    <div className="flex items-center gap-2">
                                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                      <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                        Miedos latentes y barreras que frenan su decisión de compra
                                                      </p>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                                      {av.dolores_ocultos.map((item: any, dIdx: number) => (
                                                        <div key={dIdx} className="p-5 bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-rose-500/25 hover:bg-rose-500/[0.04] transition-all duration-300 shadow-lg shadow-black/20 text-left group">
                                                          <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 group-hover:scale-125 transition-transform duration-300" />
                                                            <h4 className="text-xs sm:text-sm font-extrabold text-rose-400 leading-snug uppercase tracking-wider">{item.title}</h4>
                                                          </div>
                                                          <p className="text-xs sm:text-[13px] text-zinc-300 font-semibold leading-relaxed mt-1">{item.text}</p>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* Tab: Deseos */}
                                                {avatarSubTab === "deseos" && (
                                                  <div className="space-y-5 pt-2 text-left">
                                                    <div className="flex items-center gap-2">
                                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                      <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                        Aspiraciones profundas y disparadores de decisión validados
                                                      </p>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                                      {av.deseos_motivaciones.map((item: any, dIdx: number) => (
                                                        <div key={dIdx} className="p-5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-emerald-500/25 hover:bg-emerald-500/[0.04] transition-all duration-300 shadow-lg shadow-black/20 text-left group">
                                                          <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform duration-300" />
                                                            <h4 className="text-xs sm:text-sm font-extrabold text-emerald-400 leading-snug uppercase tracking-wider">{item.title}</h4>
                                                          </div>
                                                          <p className="text-xs sm:text-[13px] text-zinc-300 font-semibold leading-relaxed mt-1">{item.text}</p>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* Tab: Comportamiento */}
                                                {avatarSubTab === "comportamiento" && (
                                                  <div className="space-y-4 pt-2 text-left">
                                                    <div className="flex items-center gap-2 mb-1">
                                                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFBB00]"></span>
                                                      <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                        Hábitos de consumo diario y canales donde captar su atención
                                                      </p>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                      {av.comportamientos.map((item: string, dIdx: number) => (
                                                        <div key={dIdx} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex gap-3 text-xs sm:text-[13px] text-zinc-400 hover:text-zinc-200 transition-colors font-medium font-sans leading-relaxed items-start">
                                                          <span className="text-[#FF5D1E] font-extrabold shrink-0">✓</span>
                                                          <span>{item}</span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* 2. COMPONENTE: TESTIMONIOS PERSUASIVOS */}
                      {activeComercialOption === "testimonials" && (
                        <div className="space-y-6 text-left">
                          {/* Inner Header */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-lg shadow-amber-500/5">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Testimonios Persuasivos</h2>
                              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1">
                                Historias optimizadas de conversión que derriban el escepticismo y generan confianza ciega en tu oferta.
                              </p>
                            </div>
                          </div>

                          {(() => {
                            const baseAvs = getSystemAvatars(strategyData);
                            const rawTestimonials =
                              strategyData?.modules?.testimonials ||
                              strategyData?.testimonials ||
                              [];

                            if (rawTestimonials.length === 0) {
                              return (
                                <div className="text-zinc-500 text-center py-12 px-6 border border-white/5 bg-black/20 rounded-2xl font-sans mt-4">
                                  No existen testimonios guardados en la base de datos para este proyecto.
                                </div>
                              );
                            }

                            return (
                              <div className="space-y-4 pt-2">
                                {/* Banner instructivo elegante */}
                                <div className="flex items-center gap-2 px-1 mb-1 text-xs text-zinc-400 select-none animate-pulse font-sans">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                  <span>Haz clic en cualquiera de los testimonios para expandir y ver sus detalles de conversión.</span>
                                </div>
                                {rawTestimonials.map((t: any, idx: number) => {
                                  const textMsg = t.text || t.msg || t.quote || "";
                                  const assocAv = baseAvs[idx % 3];

                                  const nameToUse = assocAv.name;
                                  const imageToUse = assocAv.img;
                                  const ageToUse = assocAv.age;
                                  const occupationToUse = assocAv.occupation;
                                  const incomeToUse = assocAv.income;
                                  const badgeTypeToUse = assocAv.priority;

                                  const isOpen = activeTestimonialIndex === idx;
                                  const isCurrentlyEditing = editingTestimonialIndex === idx;

                                  return (
                                    <div
                                      key={idx}
                                      className={`bg-black/40 border rounded-[32px] relative overflow-hidden transition-all text-left shadow-lg ${
                                        isOpen ? "border-[#FF5D1E]/20" : "border-white/5 hover:border-white/10"
                                      }`}
                                    >
                                      {/* Cabecera de Identidad del Avatar (Interactiva y Clickeable) */}
                                      <div
                                        onClick={() => {
                                          if (!isCurrentlyEditing) {
                                            setActiveTestimonialIndex(isOpen ? -1 : idx);
                                          }
                                        }}
                                        className="p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                          <div className="relative shrink-0 flex justify-center">
                                            <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-full border-2 border-[#FF5D1E] p-0.5 bg-zinc-950 shadow-[0_0_15px_rgba(255,93,30,0.25)] flex items-center justify-center overflow-hidden">
                                              <img
                                                src={imageToUse}
                                                alt={nameToUse}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full rounded-full object-cover"
                                              />
                                            </div>
                                          </div>
                                          <div className="text-left space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <h4 className="text-base md:text-lg font-black text-white leading-none">
                                                {nameToUse}
                                              </h4>
                                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none ${assocAv.priorityClass}`}>
                                                {badgeTypeToUse}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-[13px] font-medium flex-wrap leading-none">
                                              <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-[#FF5D1E]" />
                                                <span>{ageToUse}</span>
                                              </div>
                                              <span>•</span>
                                              <span>{occupationToUse}</span>
                                              <span>•</span>
                                              <span>{incomeToUse}</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Chevron status */}
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0">
                                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                        </div>
                                      </div>

                                      {/* Accordion expandable body */}
                                      <AnimatePresence initial={false}>
                                        {isOpen && (
                                          <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="border-t border-white/[0.04]"
                                          >
                                            <div className="p-6 space-y-5 bg-[#0d0d12]/20">
                                              {/* Testimonial text edit/view */}
                                              {isCurrentlyEditing ? (
                                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative">
                                                  <textarea
                                                    value={editingTestimonialText}
                                                    onChange={(e) => setEditingTestimonialText(e.target.value)}
                                                    className="w-full text-zinc-200 bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FF5D1E] focus:ring-1 focus:ring-[#FF5D1E]"
                                                    rows={4}
                                                    placeholder="Escribe el testimonio aquí..."
                                                  />
                                                </div>
                                              ) : (
                                                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative">
                                                  <p className="text-sm md:text-base leading-relaxed text-zinc-200 font-sans italic selection:bg-[#FF5D1E]/30">
                                                    "{textMsg}"
                                                  </p>
                                                </div>
                                              )}

                                              {/* Action buttons: Ver en la Web & Editar */}
                                              {isCurrentlyEditing ? (
                                                <div className="flex items-center gap-3 flex-wrap">
                                                  <button
                                                    onClick={() => handleSaveTestimonial(idx)}
                                                    disabled={isSavingTestimonial || !editingTestimonialText.trim()}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm text-white bg-[#FF5D1E] hover:bg-[#ff743c] disabled:opacity-50 border border-transparent rounded-xl transition-all font-bold cursor-pointer"
                                                  >
                                                    {isSavingTestimonial ? "Guardando..." : "Guardar"}
                                                  </button>
                                                  <button
                                                    onClick={handleCancelEditTestimonial}
                                                    disabled={isSavingTestimonial}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-50 border border-white/5 rounded-xl transition-all font-bold cursor-pointer"
                                                  >
                                                    Cancelar
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="flex items-center gap-3 flex-wrap">
                                                  <a
                                                    href={`${getPageUrl()}#testimonios`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm text-[#FF5D1E] hover:text-[#ff743c] bg-[#FF5D1E]/5 hover:bg-[#FF5D1E]/10 border border-[#FF5D1E]/30 hover:border-[#FF5D1E]/50 rounded-xl transition-all font-bold cursor-pointer"
                                                  >
                                                    <Globe className="w-4 h-4" /> Ver en la web
                                                  </a>
                                                  <button
                                                    onClick={() => handleStartEditTestimonial(idx, textMsg)}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 rounded-xl transition-all font-bold cursor-pointer"
                                                  >
                                                    <PenTool className="w-4 h-4" /> Editar
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {activeComercialOption === "objections" && (
                        <div className="space-y-6 text-left">
                          {/* Inner Header */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/5">
                              <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-sans">Frustraciones del Avatar</h2>
                              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1 font-sans">
                                Retos emocionales, miedos ocultos e insatisfacciones profundas que impulsan a tu cliente a buscar una solución de inmediato. Mapeado detalladamente por avatar.
                              </p>
                            </div>
                          </div>

                          {/* Accordion List for 3 Avatars Pains */}
                          <div className="space-y-4 mt-4">
                            {(() => {
                              const objectionsAvsData = [
                                {
                                  name: "María Fernanda",
                                  priority: "PRINCIPAL",
                                  priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
                                  audiencePct: "68% DE TU AUDIENCIA",
                                  audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                                  img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
                                  age: "28 - 35 años",
                                  occupation: "Emprendedora",
                                  income: "Ingresos variables",
                                  transformation_title: "Si buscas escalar tu negocio con el servicio más rentable del sector estética...",
                                  detailed_pains: [
                                    "Si te frustra ver tu agenda vacía mientras la competencia cobra fortunas por servicios que tú aún no dominas.",
                                    "Si te agota trabajar largas jornadas por un ingreso que no refleja tu esfuerzo ni tu talento.",
                                    "Si te duele sentirte invisible en un mercado saturado de servicios baratos que nadie valora."
                                  ]
                                },
                                {
                                  name: "Valeria Mendoza",
                                  priority: "SECUNDARIO",
                                  priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
                                  audiencePct: "22% DE TU AUDIENCIA",
                                  audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                                  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
                                  age: "22 - 27 años",
                                  occupation: "Cosmetóloga Junior",
                                  income: "Ingreso fijo bajo",
                                  transformation_title: "Si buscas escalar tu negocio de belleza con el servicio más lucrativo del mercado actual...",
                                  detailed_pains: [
                                    "Si te frustra ver cómo tu agenda se llena de servicios que apenas cubren tus gastos básicos.",
                                    "Si te agota sentirte invisible frente a competidores que cobran el triple que tú.",
                                    "Si te duele sentir que tu talento está estancado por no tener una técnica de alto impacto."
                                  ]
                                },
                                {
                                  name: "Mónica Silva",
                                  priority: "COMPLEMENTARIO",
                                  priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
                                  audiencePct: "10% DE TU AUDIENCIA",
                                  audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
                                  age: "36 - 45 años",
                                  occupation: "Emprendedora desde cero",
                                  income: "Sin ingresos estables",
                                  transformation_title: "Si sueñas con la libertad de manejar tu propio tiempo sin depender de un sueldo fijo...",
                                  detailed_pains: [
                                    "Si te frustra trabajar más de 10 horas al día sin ver un crecimiento real en tu cuenta bancaria.",
                                    "Si te agota la inseguridad de depender de que tus clientas agenden citas de bajo costo.",
                                    "Si te duele sentir que no pasas suficiente tiempo de calidad con tu familia por el cansancio."
                                  ]
                                }
                              ];

                              const baseAvs = getSystemAvatars(strategyData);

                              const objectionsAvsToRender = [0, 1, 2].map((idx) => {
                                const defaultAv = objectionsAvsData[idx];
                                const baseAv = baseAvs[idx];
                                const realAv = strategyData?.avatars?.[idx];

                                const name = baseAv.name;
                                const img = baseAv.img;
                                const age = baseAv.age;
                                const occupation = baseAv.occupation;
                                const income = baseAv.income;
                                
                                const id = realAv?.id || idx + 1;

                                let transformation_title = realAv?.transformation_title || realAv?.learning_hook || defaultAv.transformation_title;
                                let detailed_pains = defaultAv.detailed_pains;

                                // 1. Buscamos dolores altamente persuasivos en la base de datos (psychology.pains) para este avatar
                                const customPains = strategyData?.psychology?.pains && Array.isArray(strategyData.psychology.pains)
                                  ? strategyData.psychology.pains.filter((p: any) => 
                                      p && typeof p !== 'string' && 
                                      (String(p.avatarId) === String(id) || String(p.avatarId) === String(idx + 1))
                                    )
                                  : [];

                                // 2. Si existen, los asignamos directamente, si no, se muestra el mensaje de diagnóstico de base de datos
                                if (customPains.length > 0) {
                                  detailed_pains = customPains.map((p: any) => typeof p === 'string' ? p : p.text);
                                } else {
                                  detailed_pains = ["El contenido de la frustración del avatar no existe o no ha sido encontrado en la base de datos."];
                                }

                                return {
                                  ...defaultAv,
                                  name,
                                  img,
                                  age,
                                  occupation,
                                  income,
                                  transformation_title,
                                  detailed_pains
                                };
                              });

                              return (
                                <div className="space-y-4">
                                  {/* Banner instructivo elegante */}
                                  <div className="flex items-center gap-2 px-1 mb-1 text-xs text-zinc-400 select-none animate-pulse font-sans">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    <span>Haz clic en cualquiera de los avatares para expandir y ver sus frustraciones específicas.</span>
                                  </div>

                                  {objectionsAvsToRender.map((av, idx) => {
                                    const isOpen = activeAvatarIndex === idx;
                                    return (
                                      <div
                                        key={idx}
                                        className={`border rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] hover:bg-[#121216]/50 ${
                                          isOpen
                                            ? "bg-[#0c0c11] border-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.06)]"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                        }`}
                                      >
                                        {/* Header clickable bar */}
                                        <div
                                          onClick={() => {
                                            setActiveAvatarIndex(isOpen ? null : idx);
                                          }}
                                          className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer select-none"
                                        >
                                          <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-left">
                                            {/* Avatar Picture with custom border */}
                                            <div className="relative shrink-0 flex justify-center">
                                              <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-full border-2 border-blue-500 p-0.5 bg-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.25)] flex items-center justify-center overflow-hidden">
                                                <img
                                                  src={av.img}
                                                  alt={av.name}
                                                  referrerPolicy="no-referrer"
                                                  className="w-full h-full rounded-full object-cover"
                                                />
                                              </div>
                                            </div>

                                            <div className="space-y-2">
                                              <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-sans">
                                                  {av.name}
                                                </h3>
                                                {/* Badges */}
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none ${av.priorityClass}`}>
                                                  {av.priority}
                                                </span>
                                              </div>

                                              {/* demographic line with icon */}
                                              <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-[13px] font-medium flex-wrap">
                                                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                                                <span>{av.age}</span>
                                                <span>•</span>
                                                <span>{av.occupation}</span>
                                                <span>•</span>
                                                <span>{av.income}</span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Chevron status */}
                                          <div className="flex justify-end items-center md:pl-4">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                            </div>
                                          </div>
                                        </div>

                                        {/* Accordion expandable body */}
                                        <AnimatePresence initial={false}>
                                          {isOpen && (
                                            <motion.div
                                              key="content"
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: "auto", opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.25, ease: "easeInOut" }}
                                            >
                                              <div className="p-5 md:p-8 space-y-6 bg-gradient-to-b from-[#0c0c11]/80 to-[#08080c]/95 border-t border-white/[0.04]">
                                                {/* Content block inside active view */}
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                                                  {/* Left column hook */}
                                                  <div className="lg:col-span-5 space-y-6 text-left">
                                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/5">
                                                      <TrendingUp className="w-6 h-6" />
                                                    </div>
                                                    <h4 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans">
                                                      {av.transformation_title}
                                                    </h4>
                                                  </div>

                                                  {/* Line element separator */}
                                                  <div className="hidden lg:block lg:col-span-1 h-32 w-px bg-white/[0.06] mx-auto" />

                                                  {/* Right column with 3 pains details */}
                                                  <div className="lg:col-span-6 space-y-5 text-left">
                                                    {av.detailed_pains.map((dolor, pIdx) => (
                                                      <div key={pIdx} className="flex gap-4 items-start text-left">
                                                        {/* High contrast custom glowing dot element */}
                                                        <div className="relative shrink-0 mt-1.5">
                                                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                                          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-70" />
                                                        </div>
                                                        <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-semibold">
                                                          {dolor}
                                                        </p>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* 4. COMPONENTE: BENEFICIOS MAGNÉTICOS */}
                      {activeComercialOption === "benefits" && (
                        <div className="space-y-6 text-left">
                          {/* Inner Header */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-lg shadow-purple-500/5">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Beneficios Magnéticos</h2>
                              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1">
                                Los argumentos de alto valor presentados en formato de impacto irresistible para enamorar al prospecto.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                            {(() => {
                              const rawLearningModulesSource = (strategyData?.psychology?.learningModules && strategyData.psychology.learningModules.length > 0)
                                ? strategyData.psychology.learningModules
                                : (strategyData?.psychology?.solutions && strategyData.psychology.solutions.length > 0)
                                ? strategyData.psychology.solutions.map((sol: any, idx: number) => ({
                                    title: typeof sol === 'object' ? sol.title : "Módulo de aprendizaje",
                                    description: typeof sol === 'object' ? sol.description : sol,
                                    icon: idx % 3 === 0 ? 'Brain' : idx % 3 === 1 ? 'Target' : 'Zap',
                                    color: idx < 3 ? 'text-blue-400' : idx < 6 ? 'text-emerald-400' : 'text-purple-400',
                                    bgIcon: idx < 3 ? 'bg-blue-500/10 border-blue-500/20' : idx < 6 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-purple-500/10 border-purple-500/20'
                                  }))
                                : [];
                              const rawWebBenefits = strategyData?.modules?.web?.landingPageTabs?.benefits?.items || [];
                              const rawBenefits = strategyData?.benefits || [];
                              
                              const defaultBenefitsList = [
                                { title: "EL MAPA DEL ÉXITO PREMIUM", description: "Descubrirás el camino exacto para posicionarte como la opción de lujo que las clientas desean.", icon: "Target", color: "text-blue-400", bgIcon: "bg-blue-500/10 border-blue-500/20" },
                                { title: "ARQUITECTURA DE LA MIRADA", description: "Dominarás el arte de diseñar rostros que generen recomendaciones automáticas y ventas masivas.", icon: "BookOpen", color: "text-purple-400", bgIcon: "bg-purple-500/10 border-purple-500/20" },
                                { title: "INGRESOS DE ALTO IMPACTO", description: "La clave definitiva para dejar de competir por precio y empezar a cobrar por tu maestría.", icon: "TrendingUp", color: "text-emerald-400", bgIcon: "bg-emerald-500/10 border-emerald-500/20" },
                                { title: "EL ESCUDO DE SEGURIDAD", description: "Aprende los protocolos clínicos que protegen tu trabajo y te brindan confianza absoluta.", icon: "Shield", color: "text-rose-400", bgIcon: "bg-rose-500/10 border-rose-500/20" },
                                { title: "PROTOCOLO DE ATENCIÓN ÉLITE", description: "Cómo estructurar citas de alta gama completas que fidelicen a tus clientes desde la primera sesión.", icon: "Crown", color: "text-amber-400", bgIcon: "bg-amber-500/10 border-amber-500/20" },
                                { title: "LA COMUNIDAD PRIVADA VIP", description: "Soporte constante las 24 horas para guiarte en tus prácticas reales con modelos.", icon: "Users", color: "text-indigo-400", bgIcon: "bg-indigo-500/10 border-indigo-500/20" }
                              ];

                              let selectedSourceList = [];
                              if (rawLearningModulesSource.length > 0) {
                                selectedSourceList = rawLearningModulesSource;
                              } else if (rawWebBenefits.length > 0) {
                                selectedSourceList = rawWebBenefits;
                              } else if (rawBenefits.length > 0) {
                                selectedSourceList = rawBenefits;
                              } else {
                                selectedSourceList = defaultBenefitsList;
                              }

                              // Helper para mapear iconos dinámicamente
                              const renderBenefitIcon = (iconName: string, customColorClass: string) => {
                                const classes = `w-5 h-5 ${customColorClass || 'text-purple-400'}`;
                                switch (iconName) {
                                  case "Target": return <Target className={classes} />;
                                  case "BookOpen": return <BookOpen className={classes} />;
                                  case "TrendingUp": return <TrendingUp className={classes} />;
                                  case "Shield": return <Shield className={classes} />;
                                  case "Crown": return <Crown className={classes} />;
                                  case "Users": return <Users className={classes} />;
                                  case "Brain": return <Brain className={classes} />;
                                  default: return <Sparkles className={classes} />;
                                }
                              };

                              return selectedSourceList.map((item: any, idx: number) => {
                                const title = item.title || item.name || "Módulo de Valor";
                                const text = item.description || item.desc || item.text || "Módulo estructurado para detonar urgencia y persuasión de compra en tu oferta oficial.";
                                const iconName = item.icon || "Sparkles";
                                const customColor = item.color || "text-purple-400";
                                const bgIconClass = item.bgIcon || "bg-purple-500/10 border-purple-500/20";

                                return (
                                  <div key={idx} className="p-6 bg-[#0a0d14]/60 border border-white/[0.04] rounded-3xl relative space-y-4 hover:border-purple-500/25 transition-all duration-300 text-left flex flex-col justify-between">
                                    <div className="space-y-4">
                                      {/* Contenedor de Icono Redondeado Estilo Imagen 2 */}
                                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${bgIconClass}`}>
                                        {renderBenefitIcon(iconName, customColor)}
                                      </div>
                                      <div className="space-y-2 text-left">
                                        <h4 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase font-sans text-left">
                                          {title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold text-left">
                                          {text}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )}
                      {activeComercialOption === "proposition" && (() => {
                        const comm = strategyData?.commercial || {};
                        const positioningStatement = comm.proposition?.positioningStatement || "Ayudamos a esteticistas y emprendedoras de belleza a dominar la técnica de micropigmentación hiperrealista en 30 días con certificación oficial, logrando multiplicar por 5 sus ingresos por servicio sin depender de las marcas tradicionales o manuales complejos.";
                        const traditionalMarketDescription = comm.proposition?.traditionalMarketDescription || "Enfoque teórico aburrido, soporte ausente, sin orientación comercial, guerra de precios e insumos genéricos.";
                        const ourAlternativeDescription = comm.proposition?.ourAlternativeDescription || "Trazos hiperrealistas milimétricos garantizados, acompañamiento clínico activo, kit premium y tutoría para captar sus primeras 5 clientas estables.";
                        return (
                          <div className="space-y-6 text-left">
                            {/* Inner Header */}
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5D1E] shrink-0 shadow-lg shadow-orange-500/5">
                                <Target className="w-6 h-6" />
                              </div>
                              <div className="text-left">
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Propuesta de Valor</h2>
                                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1">
                                  Tu factor de diferenciación definitiva para salirte de la competencia destructiva de precios bajos.
                                </p>
                              </div>
                            </div>

                            <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-3xl relative space-y-6 pt-5">
                              <div className="text-left space-y-2">
                                <h3 className="text-base sm:text-lg font-extrabold text-white">Declaración de Posicionamiento Único</h3>
                                <p className="text-[#FFBF00] text-sm md:text-base font-medium leading-relaxed italic border-l-2 border-[#FF5A1F] pl-4 text-left">
                                  "{positioningStatement}"
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-5 bg-rose-500/[0.015] border border-rose-500/10 rounded-2xl space-y-2 text-left">
                                  <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">El mercado tradicional</span>
                                  <p className="text-xs sm:text-sm text-zinc-400 font-semibold leading-relaxed">
                                    {traditionalMarketDescription}
                                  </p>
                                </div>
                                <div className="p-5 bg-emerald-500/[0.015] border border-emerald-500/10 rounded-2xl space-y-2 text-left">
                                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Nuestra Alternativa Única</span>
                                  <p className="text-xs sm:text-sm text-zinc-300 font-semibold leading-relaxed">
                                    {ourAlternativeDescription}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 6. COMPONENTE: OFERTA PRINCIPAL */}
                      {activeComercialOption === "offer" && (() => {
                        const comm = strategyData?.commercial || {};
                        const recommendedPrice = comm.offer?.recommendedPrice || "297";
                        const originalPrice = comm.offer?.originalPrice || "597";
                        const packageItems = comm.offer?.packageItems || [
                          { concept: "Acceso Completo al Entrenamiento en Alta Definición", cost: "Valor de $197 USD" },
                          { concept: "Kit Integral de Micropigmentación (Zonas autorizadas)", cost: "Valor de $150 USD" },
                          { concept: "Sesiones de Consultas Clínicas de zoom 1-a-1", cost: "Cupo Limitado ($100 USD)" },
                          { concept: "Acceso Vitalicio + Diploma Especialización", cost: "Bono Exclusivo (Gratuito)" }
                        ];
                        const guaranteeTitle = comm.offer?.guaranteeTitle || "Garantía Incondicional de Satisfacción";
                        const guaranteeDescription = comm.offer?.guaranteeDescription || "Si durante los primeros 7 días aplicas los trazos prácticos iniciales del kit y sientes que no es para ti, te devolvemos el 100% de tu dinero sin preguntas. Riesgo Cero.";
                        
                        return (
                          <div className="space-y-6 text-left">
                            {/* Inner Header */}
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-lg shadow-amber-500/5">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div className="text-left">
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Oferta Principal</h2>
                                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1">
                                  Estructuración exacta del paquete para que la decisión de compra sea una obviedad irresistible para tu avatar.
                                </p>
                              </div>
                            </div>

                            <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-3xl relative space-y-6 pt-5">
                              <div className="flex justify-between items-center bg-[#FF5D1E]/10 p-5 rounded-2xl border border-[#FF5D1E]/30 flex-wrap gap-4 text-left">
                                <div className="text-left space-y-1">
                                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Producto Recomendado</span>
                                  <h3 className="text-base sm:text-lg font-black text-white">{comm.offer?.productName || activeProjectName}</h3>
                                </div>
                                <div className="text-left sm:text-right">
                                  <span className="text-[10px] text-[#FF5D1E] uppercase font-black tracking-wider block">Precio Recomendado</span>
                                  <p className="text-lg sm:text-2xl font-black text-[#FF5D1E]">${recommendedPrice}.00 USD <span className="text-xs text-zinc-350 line-through">${originalPrice}.00</span></p>
                                </div>
                              </div>

                              <div className="space-y-3.5 text-left">
                                <span className="text-xs font-black uppercase text-amber-400 tracking-widest block font-sans">
                                  Desglose del Paquete Irresistible
                                </span>
                                <div className="space-y-2.5">
                                  {packageItems.map((pack: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center p-3.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-left gap-4 flex-wrap">
                                      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold select-none text-zinc-350">
                                        <span className="text-amber-500 font-bold">✦</span>
                                        <span>{pack.concept || pack.item}</span>
                                      </div>
                                      <span className="text-[11px] font-extrabold uppercase text-amber-500 font-mono tracking-tight">{pack.cost || pack.val}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 bg-emerald-500/[0.01] border border-emerald-500/10 rounded-2xl flex gap-3 text-left">
                                <CheckCircle className="w-5.5 h-5.5 text-emerald-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <h4 className="text-sm font-bold text-emerald-400">{guaranteeTitle}</h4>
                                  <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed font-sans">
                                    {guaranteeDescription}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 7. COMPONENTE: EMBUDO DE CONVERSIÓN */}
                      {activeComercialOption === "funnel" && (() => {
                        const comm = strategyData?.commercial || {};
                        const funnelSteps = comm.funnel?.funnelSteps || [
                          { stage: "Atracción Orgánica / Pauta", idea: "Anuncios y Reels hipersegmentados basados en el dolor del estancamiento financiero laboral tradicional de las esteticistas." },
                          { stage: "Captura de Datos", idea: "Landing de registro optimizada donde el prospecto se inscribe para ver una clase práctica express de Micropigmentación." },
                          { stage: "Nutrición con Persuasión", idea: "Secuencia automatizada de emails y recordatorios por WhatsApp calentando el escepticismo inicial y demostrando viabilidad." },
                          { stage: "Presentación de la Oferta / Cierre", idea: "Clase definitiva de 25 minutos con simulación guiada donde se abre la inscripción exclusiva al entrenamiento máster con su precio promocional." }
                        ];
                        
                        return (
                          <div className="space-y-6 text-left">
                            {/* Inner Header */}
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/5">
                                <Globe className="w-6 h-6" />
                              </div>
                              <div className="text-left">
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Embudo de Conversión</h2>
                                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1">
                                  El recorrido optimizado del usuario para calentar prospectos frios y convertirlos en clientes calificados de forma predecible.
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4 pt-2">
                              {funnelSteps.map((fun: any, fIdx: number) => {
                                const stepNum = String(fIdx + 1).padStart(2, '0');
                                return (
                                  <div key={fIdx} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-start gap-4 relative">
                                    <div className="w-9 h-9 rounded-xl bg-[#0c62e6]/10 border border-[#0c62e6]/20 flex items-center justify-center text-[#0c62e6] font-extrabold font-mono text-xs shrink-0">{stepNum}</div>
                                    <div className="space-y-1 text-left">
                                      <h4 className="text-sm font-bold text-white uppercase tracking-tight text-left">{fun.stage}</h4>
                                      <p className="text-xs sm:text-sm text-zinc-400 font-semibold leading-relaxed text-left">{fun.idea || fun.desc}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* 8. COMPONENTE: CTA PRINCIPAL */}
                      {activeComercialOption === "cta" && (() => {
                        const comm = strategyData?.commercial || {};
                        const buttonText = comm.cta?.buttonText || "¡Quiero Especializarme e Incrementar mis Ingresos Ahora!";
                        const safetyMicrocopy = comm.cta?.safetyMicrocopy || "Inscripción 100% segura. Accede de inmediato al kit premium de micropigmentación.";
                        const scarcityTrigger = comm.cta?.scarcityTrigger || "Solo quedan 7 cupos con precio promocional en este lote de soporte.";
                        const urgencyTrigger = comm.cta?.urgencyTrigger || "Oferta válida únicamente por las próximas 48 horas de calentamiento.";
                        
                        return (
                          <div className="space-y-6 text-left">
                            {/* Inner Header */}
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 shadow-lg shadow-rose-500/5">
                                <Target className="w-6 h-6 animate-pulse" />
                              </div>
                              <div className="text-left">
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">CTA Principal</h2>
                                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1">
                                  Los llamados a la acción definitivos de alta conversión configurados para incentivar decisiones de compra impulsivas.
                                </p>
                              </div>
                            </div>

                            <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-3xl relative space-y-6 pt-5 text-center">
                              <div className="max-w-md mx-auto space-y-4">
                                <span className="text-[10px] text-[#FF5D1E] font-black uppercase tracking-widest leading-none block">DISEÑO DE BOTÓN DE ALTO IMPACTO</span>
                                
                                {/* CTA Demo Button */}
                                <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5 shadow-2xl flex justify-center">
                                  <button className="w-full bg-[#FF5D1E] hover:bg-[#FF6E33] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-[#FF5D1E]/20 flex items-center justify-center gap-2 select-none">
                                    {buttonText} <ChevronRight className="w-5 h-5 shrink-0" />
                                  </button>
                                </div>

                                <div className="text-zinc-500 text-xs sm:text-[13px] font-semibold leading-relaxed pt-2 flex flex-col gap-1.5 list-none text-left">
                                  <li className="text-left">✦ <span className="font-bold text-zinc-400">Microcopia persuasiva inferior:</span> "{safetyMicrocopy}"</li>
                                  <li className="text-left">✦ <span className="font-bold text-zinc-400">Gatillo de escasez:</span> "{scarcityTrigger}"</li>
                                  <li className="text-left">✦ <span className="font-bold text-zinc-400">Gatillo de urgencia:</span> "{urgencyTrigger}"</li>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                    </div>
                  </div>
                </div>
              )}
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
