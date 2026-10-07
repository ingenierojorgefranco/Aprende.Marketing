import React, { useEffect, useState, useMemo } from 'react';
import { 
    ChevronRight, ArrowRight, Play, Users, PlayCircle, Clock, Award, 
    CreditCard, Folder, CheckCircle2, Bot,
    ShieldCheck, Smartphone, Zap, Sparkles, Image as ImageIcon,
    BookOpen, HelpCircle, Video, Compass, Crown, Lock, Unlock, Package,
    Globe, Mail, FileText, FileDown, Layers, Send, HeartHandshake, MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Project } from '../../types';
import { getCurrentUser } from '../../services/auth';
import { NewsHistoryModal } from './NewsHistoryModal';
import { UnlockProjectModal } from './UnlockProjectModal';

const getOnboardingCardImage = (project: Project) => {
    let mm: any = project.multimedia_json;
    if (typeof mm === 'string') {
        try { mm = JSON.parse(mm); } catch { mm = null; }
    }
    if (mm?.heroImages?.[0]) return mm.heroImages[0];
    if ((project as any).image) return (project as any).image;
    if (project.strategy_json?.visualIdentity?.logoUrl) return project.strategy_json.visualIdentity.logoUrl;
    const lower = (project.name || '').toLowerCase();
    if (lower.includes('microblading') || lower.includes('cejas')) {
        return 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('manicurista') || lower.includes('uñas') || lower.includes('maquillaje')) {
        return 'https://images.unsplash.com/photo-1596951053942-862d31980696?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('resina') || lower.includes('pisos')) {
        return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
    }
    return null;
};

const getOnboardingCardTitle = (project: Project) => {
    return project.productName || project.name || "Producto Digital";
};

const getOnboardingCardDesc = (project: Project) => {
    return project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Aprende una habilidad de alta demanda y conviértela en un negocio rentable.");
};

interface DashboardContext {
    user: User;
    pageCount: number;
    projectCount: number;
    articleCount: number;
    setShowProfileModal: (show: boolean) => void;
    setShowUpgradeModal?: (show: boolean) => void;
    onUpdateUser?: (updatedUser: User) => void;
}

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, setShowProfileModal, setShowUpgradeModal, projectCount, onUpdateUser } = useOutletContext() as DashboardContext;

  const [summaryData, setSummaryData] = useState({
      totalVisits: 0,
      totalConversions: 0,
      totalPages: 0,
      conversionRate: '0'
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [masterLibrary, setMasterLibrary] = useState<Project[]>([]);
  const [academyCourses, setAcademyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [unlockModalProject, setUnlockModalProject] = useState<Project | null>(null);

  const [realCounts, setRealCounts] = useState({
      projects: 0,
      pages: 0,
      domains: 0,
      hooks: 0,
      articles: 0,
      emailConversion: 0,
      emailNurturing: 0,
      whatsappLaunches: 0,
      leadmagnets: 0
  });

  const isRealAdmin = user?.role === 'admin';
  const isProPlan = user?.planSlug === 'pro' || user?.planId === 'pro' || user?.planLimits?.planName?.toLowerCase().includes('pro');
  const maxProjectsCalculated = user?.planLimits?.maxProjects || (isProPlan ? 3 : 1);
  const isAtLimit = (projects.length >= maxProjectsCalculated) && !isRealAdmin;

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [
                summary, 
                userProjects, 
                courses, 
                library,
                userPages,
                userArticles,
                emailSequences,
                whatsappLaunches,
                freshUser
            ] = await Promise.all([
                api.getAnalyticsSummary(),
                api.getProjects(),
                api.getCoursesList(),
                api.getMasterLibrary().catch(() => []),
                api.getPages().catch(() => []),
                api.getArticles().catch(() => []),
                api.getEmailSequences().catch(() => []),
                api.getWhatsAppLaunches().catch(() => []),
                getCurrentUser().catch(() => null)
            ]);

            if (freshUser && onUpdateUser) {
                const freshPlan = (freshUser as any).planLimits?.planName || (freshUser as any).planSlug;
                const currentPlan = user?.planLimits?.planName || user?.planSlug;
                if (freshPlan !== currentPlan || JSON.stringify((freshUser as any).planLimits) !== JSON.stringify(user?.planLimits)) {
                    onUpdateUser({
                        ...user,
                        ...freshUser,
                        id: freshUser.id.toString(),
                        role: (freshUser.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
                        planSlug: freshPlan || user?.planSlug,
                        planLimits: (freshUser as any).planLimits || user?.planLimits
                    });
                }
            }

            const projectsList = userProjects || [];
            setProjects(projectsList);
            setMasterLibrary(library || []);
            setAcademyCourses((courses || []).slice(0, 3));

            const rate = summary.totalVisits > 0 
                ? ((summary.totalConversions / summary.totalVisits) * 100).toFixed(1) 
                : '0';
                
            setSummaryData({
                totalVisits: summary.totalVisits,
                totalConversions: summary.totalConversions,
                totalPages: summary.totalPages,
                conversionRate: rate
            });

            // Calculate lead magnets count across all projects
            let leadMagnetsCount = 0;
            projectsList.forEach((p: Project) => {
                let mmObj: any = null;
                if (typeof p.multimedia_json === 'string') {
                    try { mmObj = JSON.parse(p.multimedia_json); } catch { mmObj = null; }
                } else {
                    mmObj = p.multimedia_json;
                }
                if (mmObj && Array.isArray(mmObj.leadMagnets)) {
                    leadMagnetsCount += mmObj.leadMagnets.filter((lm: any) => lm && lm.name).length;
                } else if (p.strategy_json?.multimedia_json && Array.isArray(p.strategy_json.multimedia_json.leadMagnets)) {
                    leadMagnetsCount += p.strategy_json.multimedia_json.leadMagnets.filter((lm: any) => lm && lm.name).length;
                } else if (p.strategy_json?.visualIdentity?.leadMagnetUrl || (p as any).leadMagnetUrl) {
                    leadMagnetsCount += 1;
                }
            });

            const pagesList = userPages || [];
            const domainsCount = pagesList.filter((p: any) => p.customDomain && p.customDomain.trim() !== '').length;
            const articlesList = userArticles || [];
            const emailsList = emailSequences || [];
            const launchesList = whatsappLaunches || [];

            const conversionEmailsCount = emailsList.filter((s: any) => s.type === 'conversion' || !s.type).length;
            const nurturingEmailsCount = emailsList.filter((s: any) => s.type === 'nurturing').length;

            setRealCounts({
                projects: projectsList.length,
                pages: pagesList.length,
                domains: domainsCount,
                hooks: summary?.totalHooks || 0,
                articles: articlesList.length,
                emailConversion: conversionEmailsCount,
                emailNurturing: nurturingEmailsCount,
                whatsappLaunches: launchesList.length,
                leadmagnets: leadMagnetsCount
            });

        } catch (error) {
            console.error("Error cargando dashboard", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const lockedLibraryProjects = useMemo(() => {
      const unlockedIds = new Set(
          projects.map(p => String(p.masterParentId || p.id))
      );

      const locked = masterLibrary.filter(p => {
          const isUnlocked = Boolean(p.isUnlocked) || unlockedIds.has(String(p.id));
          return !isUnlocked;
      });

      const listToSort = locked.length > 0 ? locked : masterLibrary;

      return [...listToSort].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
      });
  }, [masterLibrary, projects]);

  const planRawName = (user?.planLimits as any)?.planDisplayName || user?.planLimits?.planName || user?.planSlug || 'Gratuito';
  const isFree = ['starter', 'gratuito', 'free', 'gratis', 'basico', 'básico', 'plan free', 'plan starter'].includes(planRawName.toLowerCase());
  const planName = isFree 
    ? 'Plan Gratuito' 
    : (planRawName.toLowerCase() === 'pro' 
        ? 'Plan Pro' 
        : (planRawName.toLowerCase().startsWith('plan') ? planRawName : `Plan ${planRawName}`));
  const maxProjects = user?.planLimits?.maxProjects || 1;
  
  

  return (
    <div className="space-y-8 text-white animate-in fade-in slide-in-from-bottom-6 duration-700 bg-[#030712] min-h-screen pb-12">
      
      {/* 1. HEADER HERO */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#FF5A1F]/20 bg-gradient-to-r from-[#0F172A] via-[#0B1120] to-[#1A0C06] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FF5A1F]/10 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      ¡Hola, {user?.name ? user.name.split(' ')[0] : 'Equipo Aprende.Marketing'}! 👋
                  </h1>
                  <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
                      Aquí tienes un resumen claro de tu cuenta y el estado de tus proyectos.<br className="hidden sm:block"/>
                      Sigue implementando y convirtiendo más visitas en clientes.
                  </p>
              </div>
              
              {/* Star Graphic */}
              <div className="hidden md:flex shrink-0 relative w-32 h-32 items-center justify-center">
                  <div className="absolute inset-0 bg-radial from-[#FF5A1F]/20 via-transparent to-transparent rounded-full blur-xl"></div>
                  <svg width="100" height="100" viewBox="0 0 200 200" fill="none" className="relative z-10">
                      <path d="M100 10 C100 65, 135 100, 190 100 C135 100, 100 135, 100 190 C100 135, 65 100, 10 100 C65 100, 100 65, 100 10 Z" 
                            stroke="#FF5A1F" strokeWidth="3" fill="#FF5A1F" fillOpacity="0.1" />
                      <path d="M100 35 C100 75, 125 100, 165 100 C125 100, 100 125, 100 165 C100 125, 75 100, 35 100 C75 100, 100 75, 100 35 Z" 
                            stroke="#FF5A1F" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  </svg>
              </div>
          </div>
      </div>

      {/* 2. TU SUSCRIPCIÓN + COMUNIDAD WHATSAPP (BLOQUES LADO A LADO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* 1. TU SUSCRIPCIÓN (Espaciado natural y compacto sin huecos vacíos) */}
          <div className="bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#180D06] p-6 sm:p-7 rounded-[2rem] border border-[#FF5A1F]/30 hover:border-[#FF5A1F]/50 transition-all shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FF5A1F]/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-[#FF5A1F]">
                  <Crown className="w-28 h-28" />
              </div>
              
              <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30">
                              <Crown className="w-4 h-4 text-[#FF5A1F]" />
                          </div>
                          <h2 className="text-xs font-black text-white uppercase tracking-widest">Tu Suscripción</h2>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                          Activo
                      </span>
                  </div>
                  
                  <div>
                      <div className="flex items-baseline justify-between mb-3.5">
                          <div>
                              <h3 className="text-2xl sm:text-3xl font-black text-white capitalize">{planName}</h3>
                              <p className="text-xs text-gray-400 mt-1">{isFree ? 'Versión gratuita' : 'Plan Premium'}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider">
                              {isFree ? 'GRATUITO' : planName}
                          </span>
                      </div>
                      
                      {/* CARACTERÍSTICAS DISPONIBLES (Filas con espaciado equilibrado y compacto) */}
                      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                          {[
                              { label: 'Proyectos', key: 'projects', actual: realCounts.projects, max: user?.planLimits?.maxProjects || 1, icon: Folder },
                              { label: 'Páginas de Captura', key: 'pages', actual: realCounts.pages, max: user?.planLimits?.maxLandings || 1, icon: Layers },
                              { label: 'Dominios', key: 'domains', actual: realCounts.domains, max: user?.planLimits?.maxDomains ?? 0, icon: Globe },
                              { label: 'Video Hooks con IA', key: 'hooks', actual: realCounts.hooks, max: user?.planLimits?.maxHooks || 3, icon: Sparkles },
                              { label: 'Artículos SEO', key: 'articles', actual: realCounts.articles, max: user?.planLimits?.maxArticles || 1, icon: FileText },
                              { label: 'Secuencias Email Conversión', key: 'emailConversion', actual: realCounts.emailConversion, max: user?.planLimits?.maxEmailSequences || 0, icon: Send },
                              { label: 'Secuencias Email Nutrición', key: 'emailNurturing', actual: realCounts.emailNurturing, max: user?.planLimits?.maxEmailSequencesNurturing || 0, icon: HeartHandshake },
                              { label: 'Lanzamientos WhatsApp', key: 'whatsappLaunches', actual: realCounts.whatsappLaunches, max: user?.planLimits?.maxWhatsAppLaunches || 0, icon: MessageSquare },
                              { label: 'Leadmagnets via Whatsapp', key: 'leadmagnets', actual: realCounts.leadmagnets, max: isFree ? 1 : 9999, icon: FileDown }
                          ].map((item) => (
                              <div 
                                  key={item.key} 
                                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs hover:border-[#FF5A1F]/30 transition-colors"
                              >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                      <item.icon className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                                      <span className="text-gray-300 font-medium truncate">{item.label}</span>
                                  </div>
                                  <span className="font-bold text-white shrink-0 ml-2">
                                      {item.actual} / {item.max >= 9999 || isRealAdmin ? 'Ilimitado' : item.max}
                                  </span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* SECCIÓN INFERIOR: TEXTO MOTIVACIONAL + BOTÓN (Conectado sin gran espacio vacío) */}
              {isFree ? (
                  <div className="relative z-10 mt-4 space-y-3 animate-pulse">
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Mejora tu suscripción y obtén las mejores características para tener mejores resultados
                      </p>

                      <button 
                          onClick={() => {
                              if (setShowUpgradeModal) {
                                  setShowUpgradeModal(true);
                              } else {
                                  setShowProfileModal(true);
                              }
                          }} 
                          className="w-full py-3.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#FF5A1F] via-[#FF6E2B] to-[#FF853A] text-white hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(255,90,31,0.35)] cursor-pointer uppercase tracking-wider"
                      >
                          <Zap className="w-4 h-4 fill-current" /> Mejorar a Pro
                      </button>
                  </div>
              ) : (
                  <div className="relative z-10 mt-4">
                      <p className="text-xs sm:text-sm text-green-400 font-bold flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3.5 py-2.5 rounded-xl">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse animate-duration-1000"></span>
                          Suscripción Premium Activa: ¡Acceso ilimitado habilitado!
                      </p>
                  </div>
              )}
          </div>

          {/* 2. COMUNIDAD DE WHATSAPP (Aumentada en presencia y altura para equilibrio proporcional) */}
          <div className="bg-[#0B1120] p-6 sm:p-7 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                  <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                              <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                              <h2 className="text-xs font-black text-white uppercase tracking-wider leading-none">Comunidad WhatsApp</h2>
                              <p className="text-[11px] text-[#25D366] font-bold mt-1">Grupo Exclusivo VIP</p>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                          <div className="flex -space-x-1.5">
                              {[1,2,3].map(i => (
                                  <div key={i} className="w-5 h-5 rounded-full border border-[#0B1120] bg-slate-700 flex items-center justify-center text-[8px] text-gray-300">
                                      <Users className="w-2.5 h-2.5" />
                                  </div>
                              ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold">+236</span>
                      </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
                      Conecta con otros creadores, comparte tus lanzamientos y recibe soporte directo en tiempo real.
                  </p>
              </div>

              <div>
                  <a 
                      href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1?s=cl&p=a&mlu=4&ilr=4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.25)] cursor-pointer"
                  >
                      <Smartphone className="w-4 h-4" /> Unirme al grupo VIP
                  </a>
              </div>
          </div>

      </div>

      {/* 3. MAIN CONTENT GRID (8 + 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (Projects & Academy) */}
          <div className="xl:col-span-8 space-y-8">
              
              {/* BIBLIOTECA DE PROYECTOS */}
              <div className="bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                      <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Folder className="w-4 h-4 text-[#FF5A1F]" /> 
                          Biblioteca <span className="text-gray-500">/ Últimos cursos añadidos</span>
                      </h2>
                      <button onClick={() => navigate('/dashboard/projects')} className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:underline">
                          Ver todos los proyectos <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                  </div>

                  {lockedLibraryProjects.length === 0 && !loading ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                          <Folder className="w-16 h-16 text-slate-700 mb-4" />
                          <h3 className="text-lg font-bold text-white mb-2">No hay proyectos pendientes por desbloquear</h3>
                          <p className="text-gray-500 text-sm mb-6">Todos los proyectos de la biblioteca están desbloqueados.</p>
                          <button onClick={() => navigate('/dashboard/projects')} className="bg-[#FF5A1F] hover:bg-[#E04D1A] text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors">
                              Ver mis proyectos
                          </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {lockedLibraryProjects.slice(0, 3).map((project) => {
                              const isAlreadyUnlocked = Boolean(project.isUnlocked) || projects.some(p => String(p.masterParentId) === String(project.id));
                              const projectImg = getOnboardingCardImage(project);
                              const title = getOnboardingCardTitle(project);
                              const desc = getOnboardingCardDesc(project);

                              return (
                                  <div
                                      key={`library-card-${project.id}`}
                                      onClick={() => {
                                          if (isAlreadyUnlocked) {
                                              const userClone = projects.find(p => String(p.masterParentId) === String(project.id));
                                              navigate(`/dashboard/projects/${userClone?.id || project.id}/strategy`);
                                          } else {
                                              setUnlockModalProject(project);
                                          }
                                      }}
                                      className={`group rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full relative w-full cursor-pointer transition-all duration-300 space-y-4 ${
                                          isAlreadyUnlocked
                                              ? 'bg-gradient-to-b from-[#0c1a14]/90 to-[#07130e]/95 border-2 border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:border-emerald-400'
                                              : 'bg-gradient-to-b from-[#181409]/90 to-[#100e06]/95 border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.12)] hover:shadow-[0_0_40px_rgba(234,179,8,0.22)] hover:border-yellow-400'
                                      }`}
                                  >
                                      {/* Header Badge: Estado (sin categoría, como se solicitó) */}
                                      <div className="flex items-center justify-end">
                                          {isAlreadyUnlocked ? (
                                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 border border-emerald-500/50">
                                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Desbloqueado
                                              </span>
                                          ) : (
                                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 border border-yellow-500/50">
                                                  <Lock className="w-3.5 h-3.5 text-yellow-400" /> Bloqueado
                                              </span>
                                          )}
                                      </div>

                                      {/* Cover Image Container */}
                                      <div className="h-40 sm:h-44 bg-zinc-900 relative overflow-hidden rounded-2xl shrink-0 border border-zinc-800/60">
                                          {projectImg ? (
                                              <img
                                                  src={projectImg}
                                                  alt={title}
                                                  referrerPolicy="no-referrer"
                                                  onError={(e) => {
                                                      const target = e.currentTarget;
                                                      target.onerror = null;
                                                      const fallback = title.toLowerCase().includes('resina')
                                                          ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
                                                          : 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80';
                                                      target.src = fallback;
                                                  }}
                                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                              />
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                  <Package className="w-10 h-10 text-zinc-700" />
                                              </div>
                                          )}
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                                      </div>

                                      {/* Text Content */}
                                      <div className="flex-1 flex flex-col justify-between space-y-2">
                                          <div>
                                              <h3 className={`text-base sm:text-lg font-bold line-clamp-2 transition-colors duration-200 ${
                                                  isAlreadyUnlocked ? 'text-white group-hover:text-emerald-400' : 'text-white group-hover:text-yellow-400'
                                              }`}>
                                                  {title}
                                              </h3>
                                              <p className="text-zinc-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal line-clamp-3">
                                                  {desc}
                                              </p>
                                          </div>
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="pt-2">
                                          {isAlreadyUnlocked ? (
                                              <button
                                                  type="button"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      const userClone = projects.find(p => String(p.masterParentId) === String(project.id));
                                                      navigate(`/dashboard/projects/${userClone?.id || project.id}/strategy`);
                                                  }}
                                                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                                              >
                                                  <span>VER PROYECTO</span>
                                                  <ArrowRight className="w-4 h-4 shrink-0" />
                                              </button>
                                          ) : (
                                              <>
                                                  <button
                                                      type="button"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setUnlockModalProject(project);
                                                      }}
                                                      className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_20px_rgba(234,179,8,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                                                  >
                                                      <Unlock className="w-4 h-4 shrink-0" />
                                                      <span>DESBLOQUEAR PROYECTO</span>
                                                  </button>
                                                  <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest pt-2">
                                                      Consume 1 cupo de proyecto en tu plan
                                                  </p>
                                              </>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  )}
              </div>

              {/* NOVEDADES DE LA ACADEMIA */}
              <div className="bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                      <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#FF5A1F]" /> Novedades de la academia
                      </h2>
                      <button onClick={() => navigate('/dashboard/training')} className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:underline">
                          Ver todas <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {academyCourses.map((course) => {
                          const thumbnail = course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
                          return (
                              <div
                                  key={course.id || course.slug}
                                  onClick={() => navigate(`/dashboard/training/${course.slug}`)}
                                  className="group relative bg-slate-900/80 border border-slate-800 hover:border-[#FF5A1F]/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF5A1F]/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                              >
                                  {/* Image & Badge Header */}
                                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                                      <img
                                          src={thumbnail}
                                          alt={course.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                                      
                                      {/* Badge */}
                                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-[#FF5A1F] flex items-center gap-1.5 uppercase tracking-wider">
                                          <Award className="w-3.5 h-3.5" />
                                          <span>{course.badge_text || course.subtitle || "Curso"}</span>
                                      </div>

                                      {/* Play Overlay Icon */}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                                          <div className="w-14 h-14 bg-[#FF5A1F] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#FF5A1F]/40 transform group-hover:scale-110 transition-transform">
                                              <PlayCircle className="w-8 h-8 ml-0.5" />
                                          </div>
                                      </div>
                                  </div>

                                  {/* Content */}
                                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                      <div className="space-y-2">
                                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                              <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                                              <span>{course.subtitle || "Entrenamiento Paso a Paso"}</span>
                                          </div>
                                          <h2 className="text-xl font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors leading-snug">
                                              {course.title}
                                          </h2>
                                          {course.description && (
                                              <p className="text-slate-400 text-xs md:text-sm line-clamp-3 leading-relaxed font-normal">
                                                  {course.description}
                                              </p>
                                          )}
                                      </div>
                                      {/* Footer Action */}
                                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#FF5A1F] group-hover:text-white transition-colors">
                                          <span className="flex items-center gap-1.5">
                                              <PlayCircle className="w-4 h-4 text-[#FF5A1F]" /> Acceder al Curso
                                          </span>
                                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

          </div>

          {/* RIGHT COLUMN (Quick Resources & Support) */}
          <div className="xl:col-span-4 space-y-6">
              
              {/* ACCESOS RÁPIDOS & ACCIONES */}
              <div className="bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#FF5A1F]" />
                      Accesos Rápidos
                  </h2>

                  <div className="space-y-3">
                      <button 
                          onClick={() => navigate('/dashboard/projects')}
                          className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-[#FF5A1F]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-bold">
                                  <Folder className="w-4 h-4" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-white group-hover:text-[#FF5A1F] transition-colors">Crear Proyecto</p>
                                  <p className="text-[11px] text-gray-500">Nuevo embudo y contenidos</p>
                              </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#FF5A1F] group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                          onClick={() => navigate('/dashboard/training')}
                          className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-[#FF5A1F]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                                  <BookOpen className="w-4 h-4" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Ver Academia</p>
                                  <p className="text-[11px] text-gray-500">Clases y rutas de aprendizaje</p>
                              </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                          onClick={() => setShowProfileModal(true)}
                          className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-[#FF5A1F]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                                  <HelpCircle className="w-4 h-4" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Ayuda y Ajustes</p>
                                  <p className="text-[11px] text-gray-500">Perfil, planes y soporte</p>
                              </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                      </button>
                  </div>
              </div>



          </div>
      </div>

      {/* MODAL DE DESBLOQUEO MAESTRO TIPO PREMIUM */}
      <UnlockProjectModal
          isOpen={!!unlockModalProject}
          onClose={() => setUnlockModalProject(null)}
          project={unlockModalProject}
          isAtLimit={isAtLimit}
          onUnlockWithPro={(p) => {
              setUnlockModalProject(null);
              if (setShowUpgradeModal) {
                  setShowUpgradeModal(true);
              }
          }}
          onUnlockFree={(p) => {
              setUnlockModalProject(null);
              if (typeof window !== 'undefined') {
                  localStorage.setItem('preselect_wizard_project_id', p.id);
                  localStorage.setItem('selected_wizard_project_id', p.id);
                  localStorage.setItem('force_wizard_step', 'selection');
                  localStorage.removeItem('wizard_dismissed');
                  localStorage.removeItem('wizard_completed');
              }
              navigate(`/wizard/step-2?projectId=${p.id}`);
          }}
      />

    </div>
  );
};