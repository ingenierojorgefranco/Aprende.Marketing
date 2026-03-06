
import { LandingPage, Lead, GeneratedPageContent, Article, User, Project, PlanLimits, Course, Comment, CourseLesson, Plan, SystemLog, UserUsageStats, StrategyJSON, CRMContact, CRMActivity, DashboardNews, EmailSequence, EmailMessage, WhatsAppLaunch, SupportTicket, ProjectHook } from "../types";
import { MOCK_USER, MOCK_PROJECTS, MOCK_PAGES, MOCK_ARTICLES, MOCK_LEADS, MOCK_CREDENTIALS, MOCK_COURSES, MOCK_COMMENTS, MOCK_CRM_CONTACTS, MOCK_CRM_ACTIVITIES, MOCK_NEWS, MOCK_EMAIL_SEQUENCES, MOCK_EMAIL_MESSAGES, MOCK_MASTER_STRATEGY, MOCK_PROJECT_HOOKS } from "./mockData";
import { ProjectMasterStrategy } from "./strategySchema";

// --- HELPER PARA OBTENER BASE URL ---
const getBaseUrl = () => {
    const anyImportMeta = import.meta as any;
    const envUrl = anyImportMeta?.env?.VITE_API_URL;

    if (envUrl) {
        const cleanUrl = envUrl.replace(/\/$/, '');
        if (cleanUrl.endsWith('/api')) return cleanUrl;
        return `${cleanUrl}/api`;
    }
    
    return "/api";
};

const API_URL = getBaseUrl();

// --- CONFIGURACIÓN ---
let isMockMode = false;

// --- IN-MEMORY DATA STORAGE FOR MOCK MODE ---
let localPages: LandingPage[] = [...MOCK_PAGES];
let localArticles: Article[] = [...MOCK_ARTICLES];
let localProjects: Project[] = [...MOCK_PROJECTS];
let localLeads: Lead[] = [...MOCK_LEADS];
let localCourses: Course[] = [...MOCK_COURSES];
let localComments: Comment[] = [...MOCK_COMMENTS];
let localCrmContacts: CRMContact[] = [...MOCK_CRM_CONTACTS];
let localCrmActivities: CRMActivity[] = [...MOCK_CRM_ACTIVITIES];

const apiCache: {
    pages: LandingPage[] | null;
    projects: Project[] | null;
    masterLibrary: Project[] | null;
    leads: Lead[] | null;
    articles: Article[] | null;
    contacts: CRMContact[] | null;
    summary: any | null;
    weekly: any[] | null;
    courses: any[] | null;
    plans: Plan[] | null;
    publicPlans: Plan[] | null;
    loginRedirect: string | null;
    activePaymentMethod: ('stripe' | 'hotmart') | null;
    systemMode: ('production' | 'launch') | null;
    hotmartData: any | null;
    usersList: User[] | null;
    currentUser: User[] | null;
    crmStats: any | null;
    newsFeed: DashboardNews[] | null;
    adminNews: DashboardNews[] | null;
    newsHistory: Record<string, DashboardNews[] | null>;
    integrationSettings: Record<string, any> | null;
    lastGeneratedTitles: any[] | null;
    pageDetails: Record<string, LandingPage | null>;
    projectDetails: Record<string, Project | null>;
    articleDetails: Record<string, Article | null>;
    courseDetails: Record<string, any | null>;
    moduleLessons: Record<string, CourseLesson[] | null>;
    lessonComments: Record<string, any[] | null>;
    adminUserResources: Record<string, any[] | null>;
    systemLogs: Record<string, any[] | null>;
    contactHistory: Record<string, CRMActivity[] | null>;
    publicBlogArticles: Record<string, Article[] | null>;
    publicArticleDetails: Record<string, Article | null>;
    userUsageStats: Record<string, UserUsageStats | null>;
    userPayments: Record<string, any[] | null>;
    siteAnalysis: Record<string, any | null>;
    publicPages: Record<string, LandingPage | null>;
    masterStrategies: Record<string, ProjectMasterStrategy | null>;
    emailSequences: EmailSequence[] | null;
    waLaunches: WhatsAppLaunch[] | null;
    supportTickets: SupportTicket[] | null;
} = {
    pages: null,
    projects: null,
    masterLibrary: null,
    leads: null,
    articles: null,
    contacts: null,
    summary: null,
    weekly: null,
    courses: null,
    plans: null,
    publicPlans: null,
    loginRedirect: null,
    activePaymentMethod: null,
    systemMode: null,
    hotmartData: null,
    usersList: null,
    currentUser: null,
    crmStats: null,
    newsFeed: null,
    adminNews: null,
    newsHistory: {},
    integrationSettings: null,
    lastGeneratedTitles: null,
    pageDetails: {},
    projectDetails: {},
    articleDetails: {},
    courseDetails: {},
    moduleLessons: {},
    lessonComments: {},
    adminUserResources: {},
    systemLogs: {},
    contactHistory: {},
    publicBlogArticles: {},
    publicArticleDetails: {},
    userUsageStats: {},
    userPayments: {},
    siteAnalysis: {},
    publicPages: {},
    masterStrategies: {},
    emailSequences: null,
    waLaunches: null,
    supportTickets: null
};

const clearCache = (key?: keyof typeof apiCache, id?: string) => {
    if (key) {
        if (id && (key === 'pageDetails' || key === 'projectDetails' || key === 'articleDetails' || key === 'courseDetails' || key === 'moduleLessons' || key === 'lessonComments' || key === 'adminUserResources' || key === 'systemLogs' || key === 'contactHistory' || key === 'publicBlogArticles' || key === 'publicArticleDetails' || key === 'userUsageStats' || key === 'userPayments' || key === 'siteAnalysis' || key === 'publicPages' || key === 'masterStrategies')) {
            delete (apiCache[key] as any)[id];
        } else {
            if (key === 'pageDetails' || key === 'projectDetails' || key === 'articleDetails' || key === 'courseDetails' || key === 'moduleLessons' || key === 'lessonComments' || key === 'adminUserResources' || key === 'systemLogs' || key === 'contactHistory' || key === 'publicBlogArticles' || key === 'publicArticleDetails' || key === 'userUsageStats' || key === 'userPayments' || key === 'siteAnalysis' || key === 'publicPages' || key === 'masterStrategies') {
                (apiCache[key] as any) = {};
            } else if (key === 'newsHistory') {
                apiCache.newsHistory = {};
            } else {
                (apiCache[key] as any) = null;
            }
        }
        
        if (key === 'pages' || key === 'projects' || key === 'articles') {
            apiCache.summary = null;
            apiCache.weekly = null;
            if (key === 'pages') apiCache.pageDetails = {};
            if (key === 'projects') apiCache.projectDetails = {};
            if (key === 'articles') apiCache.articleDetails = {};
        }

        if (key === 'contacts') {
            apiCache.crmStats = null;
        }
    } else {
        apiCache.pages = null;
        apiCache.projects = null;
        apiCache.masterLibrary = null;
        apiCache.leads = null;
        apiCache.articles = null;
        apiCache.contacts = null;
        apiCache.summary = null;
        apiCache.weekly = null;
        apiCache.courses = null;
        apiCache.plans = null;
        apiCache.publicPlans = null;
        apiCache.loginRedirect = null;
        apiCache.activePaymentMethod = null;
        apiCache.systemMode = null;
        apiCache.hotmartData = null;
        apiCache.usersList = null;
        apiCache.currentUser = null;
        apiCache.crmStats = null;
        apiCache.newsFeed = null;
        apiCache.adminNews = null;
        apiCache.newsHistory = {};
        apiCache.integrationSettings = null;
        apiCache.lastGeneratedTitles = null;
        apiCache.pageDetails = {};
        apiCache.projectDetails = {};
        apiCache.articleDetails = {};
        apiCache.courseDetails = {};
        apiCache.moduleLessons = {};
        apiCache.lessonComments = {};
        apiCache.adminUserResources = {};
        apiCache.systemLogs = {};
        apiCache.contactHistory = {};
        apiCache.publicBlogArticles = {};
        apiCache.publicArticleDetails = {};
        apiCache.userUsageStats = {};
        apiCache.userPayments = {};
        apiCache.siteAnalysis = {};
        apiCache.publicPages = {};
        apiCache.masterStrategies = {};
        apiCache.emailSequences = null;
        apiCache.waLaunches = null;
        apiCache.supportTickets = null;
    }
};

const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: Servidor tardó demasiado")), 180000)
    );

    const fetchPromise = fetch(url, options);
    const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;

    if (!res.ok) {
        let errorMsg = res.statusText;
        let errorBody = null;
        try {
            errorBody = await res.json();
            if (errorBody.error) errorMsg = errorBody.error;
        } catch(e) {}
        
        if (res.status >= 500) {
            console.error(`[API 500 ERROR] Endpoint: ${endpoint}`, {
                status: res.status,
                msg: errorMsg,
                body: errorBody
            });
        }

        throw new Error(`HTTP Error ${res.status}: ${errorMsg}`);
    }
    
    return await res.json();
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('plataformadeventacom_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const safeJsonParse = (data: any, fieldName: string = 'unknown') => {
    if (!data) return null;
    if (typeof data === 'object') return data;

    const tryParse = (str: string) => {
        try {
            let p = JSON.parse(str);
            if (typeof p === 'string') p = JSON.parse(p);
            return p;
        } catch (e) {
            return null;
        }
    };

    let result = tryParse(data);
    if (result) return result;

    try {
        console.warn(`[API Repair] Intentando reparar JSON malformado para: ${fieldName}`);
        let repaired = data.toString().trim();
        repaired = repaired.replace(/^```json/, "").replace(/```$/, "").trim();

        const suspiciousQuotesRegex = /([^:{\[,])"([^,}\]])/g;
        let iteration = 0;
        while (suspiciousQuotesRegex.test(repaired) && iteration < 10) {
            repaired = repaired.replace(suspiciousQuotesRegex, '$1\\InternalQuotePlaceholder$2');
            iteration++;
        }

        result = tryParse(repaired);
        if (result) {
            console.log(`[API Repair] Éxito reparando JSON de ${fieldName}`);
            return result;
        }
    } catch (e) {}

    console.error(`[API Error] safeJsonParse(${fieldName}) falló definitivamente:`, data);
    return data;
};

export const api = {
  getBaseUrl,

  enableMockMode: () => {
      isMockMode = true;
      console.log("🟡 MODO MOCK ACTIVADO: Usando datos locales de prueba.");
  },

  disableMockMode: () => {
      isMockMode = false;
      console.log("🔴 MODO MOCK DESACTIVADO: Usando Base de Datos real.");
  },
  
  isUsingMockData: () => isMockMode,

  login: async (email: string, password: string): Promise<User> => {
      if (isMockMode) {
          await new Promise(resolve => setTimeout(resolve, 800));
          if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
              return MOCK_USER;
          } else {
              throw new Error("Credenciales inválidas para el Modo Offline Demo.");
          }
      }

      const user = await fetchWithFallback('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });
      if (user.token) localStorage.setItem('plataformadeventacom_token', user.token);
      clearCache();
      return user.user;
  },

  logout: async (): Promise<void> => {
      clearCache();
      if (isMockMode) return;
      try {
          await fetchWithFallback('/auth/logout', { method: 'POST', headers: getAuthHeaders() });
      } catch (e) {
          console.warn("Server logout failed, clearing local session only.");
      }
  },

  getCurrentUser: async (): Promise<User | null> => {
      if (isMockMode) return MOCK_USER;
      try {
          const user = await fetchWithFallback('/auth/me', { headers: getAuthHeaders() });
          return user;
      } catch (e) {
          return null;
      }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
      if (isMockMode) {
          MOCK_USER.name = data.name || MOCK_USER.name;
          MOCK_USER.email = data.email || MOCK_USER.email;
          MOCK_USER.avatarUrl = data.avatarUrl || MOCK_USER.avatarUrl;
          MOCK_USER.birthDate = data.birthDate || MOCK_USER.birthDate;
          return Promise.resolve({ ...MOCK_USER });
      }
      clearCache('usersList');
      return await fetchWithFallback('/auth/profile', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },

  createCheckoutSession: async (planSlug: string): Promise<{ url: string }> => {
      if (isMockMode) {
          return Promise.resolve({ url: '#' });
      }
      return await fetchWithFallback('/stripe/create-checkout-session', {
          method: 'POST',
          headers: { ...getAuthHeaders() },
          body: JSON.stringify({ planSlug })
      });
  },

  submitLead: async (data: { pageId: string; name: string; email: string; phone?: string }): Promise<void> => {
      if (isMockMode) {
          console.log("Mock Lead Submitted:", data);
          return Promise.resolve();
      }
      await fetchWithFallback('/public/leads/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });
      clearCache('leads');
      clearCache('contacts');
      clearCache('summary');
      clearCache('weekly');
  },

  getPages: async (): Promise<LandingPage[]> => {
    if (isMockMode) return Promise.resolve([...localPages]);
    if (apiCache.pages) return apiCache.pages;

    const pages = await fetchWithFallback('/pages', { method: 'GET', headers: getAuthHeaders() });
    const mapped = pages.map((p: any) => {
        const content = safeJsonParse(p.content, 'page.content');
        if (p.thankyoupage_json && !content.thankYouPage) {
            content.thankYouPage = safeJsonParse(p.thankyoupage_json, 'page.thankyoupage');
        }
        return {
            ...p,
            id: String(p.id),
            isPublished: !!(p.isPublished || p.is_published),
            customDomain: p.custom_domain || p.customDomain,
            projectId: p.project_id ? String(p.project_id) : undefined,
            projectName: p.project_name,
            content: content,
            createdAt: new Date(p.created_at || p.createdAt)
        };
    });
    apiCache.pages = mapped;
    return mapped;
  },

  getPageById: async (id: string): Promise<LandingPage | null> => {
      if (isMockMode) {
          const page = localPages.find(p => p.id === id);
          return page ? Promise.resolve(page) : Promise.resolve(null);
      }
      if (apiCache.pageDetails[id]) return apiCache.pageDetails[id];
      const pages = await api.getPages();
      const page = pages.find(p => String(p.id) === String(id)) || null;
      if (page) apiCache.pageDetails[id] = page;
      return page;
  },

  getPublicPage: async (slug: string, userSlug?: string): Promise<LandingPage | null> => {
      if (isMockMode) return localPages.find(p => p.subdomain.includes(slug)) || null;
      const cacheKey = userSlug ? `${userSlug}_${slug}` : slug;
      if (apiCache.publicPages[cacheKey]) return apiCache.publicPages[cacheKey];

      let endpoint = userSlug 
          ? `/api/public/pages/by-user/${encodeURIComponent(userSlug)}/${encodeURIComponent(slug)}`
          : `/api/public/pages/${encodeURIComponent(slug)}`;

      try {
          const data = await fetchWithFallback(endpoint);
          const normalized: LandingPage = {
              id: data.id?.toString() ?? slug,
              name: data.name || "Landing no encontrada",
              niche: data.niche || "",
              goal: data.goal || "",
              isPublished: !!data.is_published,
              subdomain: data.subdomain || slug,
              visits: data.visits ?? 0,
              conversions: data.conversions ?? 0,
              createdAt: data.created_at ? new Date(data.created_at) : new Date(),
              content: typeof data.content === "string" ? JSON.parse(data.content) : data.content,
          };
          apiCache.publicPages[cacheKey] = normalized;
          return normalized;
      } catch (e) {
          return null;
      }
  },

  createPage: async (page: LandingPage): Promise<LandingPage> => {
    if (isMockMode) {
        const newPage = { ...page, id: `mock-page-${Date.now()}`, createdAt: new Date() };
        localPages.unshift(newPage);
        return Promise.resolve(newPage);
    }
    const data = await fetchWithFallback('/pages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            name: page.name,
            niche: page.niche,
            goal: page.goal,
            subdomain: page.subdomain,
            content: page.content,
            projectId: page.projectId
        })
    });
    clearCache('pages');
    clearCache('userUsageStats');
    return { ...page, id: data.id.toString(), subdomain: data.subdomain };
  },

  updatePage: async (page: LandingPage): Promise<LandingPage> => {
    if (isMockMode) {
        localPages = localPages.map(p => p.id === page.id ? page : p);
        return Promise.resolve(page);
    }
    await fetchWithFallback(`/pages/${page.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            name: page.name,
            niche: page.niche,
            content: page.content,
            isPublished: page.isPublished,
            projectId: page.projectId,
            subdomain: page.subdomain
        })
    });
    clearCache('pages');
    clearCache('pageDetails', page.id);
    clearCache('publicPages');
    return page;
  },

  deletePage: async (id: string): Promise<void> => {
    if (isMockMode) {
        localPages = localPages.filter(p => p.id !== id);
        return Promise.resolve();
    }
    await fetchWithFallback(`/pages/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    clearCache('pages');
    clearCache('pageDetails', id);
    clearCache('userUsageStats');
    clearCache('publicPages');
  },

  getProjects: async (): Promise<Project[]> => {
      if (isMockMode) return Promise.resolve([...localProjects]);
      if (apiCache.projects) return apiCache.projects;

      const projects = await fetchWithFallback('/projects', {
          method: 'GET',
          headers: { ...getAuthHeaders() }
      });
      const mapped = projects.map((p: any) => {
          const strategyObj = safeJsonParse(p.strategy_json, 'proj.strategyJson');
          return {
              ...p,
              id: String(p.id),
              painPoints: safeParseJsonList(p.pain_points),
              keyBenefits: safeParseJsonList(p.key_benefits),
              affiliateLinks: safeParseJsonList(p.affiliate_links),
              strategy_json: strategyObj, 
              multimedia_json: safeJsonParse(p.multimedia_json, 'proj.multimediaJson') || { heroImages: [], videoUrls: [], descriptiveImages: [] },
              targetAudience: p.target_audience || p.targetAudience,
              brandTone: p.brand_tone || p.brandTone,
              product_name: p.product_name || p.productName,
              shortDescription: strategyObj?.meta?.shortDescription || p.short_description,
              mainGoal: p.main_goal || p.mainGoal,
              salesPageUrl: p.sales_page_url || p.salesPageUrl,
              fullPrice: p.full_price ? parseFloat(p.full_price) : (p.fullPrice || 0),
              commissionRate: p.commission_rate ? parseFloat(p.commission_rate) : (p.commissionRate || 0),
              leadMagnetType: p.lead_magnet_type || p.leadMagnetType,
              leadMagnetUrl: p.lead_magnet_url || p.leadMagnetUrl,
              createdAt: new Date(p.created_at || p.createdAt),
              isMaster: !!p.is_master,
              isUnlocked: !!p.is_unlocked
          };
      });
      apiCache.projects = mapped;
      return mapped;
  },

  getMasterLibrary: async (): Promise<Project[]> => {
    if (isMockMode) return [];
    if (apiCache.masterLibrary) return apiCache.masterLibrary;

    const projects = await fetchWithFallback('/projects/master-library', {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const mapped = projects.map((p: any) => {
        const strategyObj = safeJsonParse(p.strategy_json, 'proj.masterStrategy');
        return {
            ...p,
            id: String(p.id),
            painPoints: safeParseJsonList(p.pain_points),
            keyBenefits: safeParseJsonList(p.key_benefits),
            affiliateLinks: safeParseJsonList(p.affiliate_links),
            strategy_json: strategyObj,
            multimedia_json: safeJsonParse(p.multimedia_json, 'proj.multimediaJson') || { heroImages: [], videoUrls: [], descriptiveImages: [] },
            shortDescription: strategyObj?.meta?.shortDescription || p.short_description,
            isMaster: true,
            leadMagnetUrl: p.lead_magnet_url || p.leadMagnetUrl,
            createdAt: new Date(p.created_at)
        };
    });
    apiCache.masterLibrary = mapped;
    return mapped;
  },

  unlockProject: async (projectId: string, userData: any): Promise<{ id: string }> => {
    if (isMockMode) return { id: 'mock-id' };
    const res = await fetchWithFallback(`/projects/unlock/${projectId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
    });
    clearCache('projects');
    clearCache('masterLibrary');
    return res;
  },

  getProjectById: async (id: string): Promise<Project | null> => {
      if (isMockMode) {
          const proj = localProjects.find(p => p.id === id);
          return proj ? Promise.resolve(proj) : Promise.resolve(null);
      }
      if (apiCache.projectDetails[id]) return apiCache.projectDetails[id];
      try {
          const p = await fetchWithFallback(`/projects/${id}`, {
              method: 'GET',
              headers: getAuthHeaders()
          });
          const strategyObj = safeJsonParse(p.strategy_json, 'proj.strategyJson');
          const mappedProject = {
              ...p,
              id: String(p.id),
              painPoints: safeParseJsonList(p.pain_points),
              keyBenefits: safeParseJsonList(p.key_benefits),
              affiliateLinks: safeParseJsonList(p.affiliate_links),
              strategy_json: strategyObj,
              multimedia_json: safeJsonParse(p.multimedia_json, 'proj.multimediaJson') || { heroImages: [], videoUrls: [], descriptiveImages: [] },
              targetAudience: p.target_audience || p.targetAudience,
              brandTone: p.brand_tone || p.brandTone,
              productName: p.product_name || p.productName,
              shortDescription: strategyObj?.meta?.shortDescription || p.short_description,
              mainGoal: p.main_goal || p.mainGoal,
              salesPageUrl: p.sales_page_url || p.salesPageUrl,
              fullPrice: p.full_price ? parseFloat(p.full_price) : (p.fullPrice || 0),
              commissionRate: p.commission_rate ? parseFloat(p.commission_rate) : (p.commissionRate || 0),
              leadMagnetType: p.lead_magnet_type || p.leadMagnetType,
              leadMagnetUrl: p.lead_magnet_url || p.leadMagnetUrl,
              createdAt: new Date(p.created_at || p.createdAt),
              isMaster: !!p.is_master
          };
          apiCache.projectDetails[id] = mappedProject;
          return mappedProject;
      } catch (e: any) {
          return null;
      }
  },

  getProjectStrategy: async (id: string): Promise<ProjectMasterStrategy | null> => {
      if (isMockMode) {
          const proj = localProjects.find(p => p.id === id);
          if (proj && proj.strategy_json) return Promise.resolve(proj.strategy_json as ProjectMasterStrategy);
          return Promise.resolve(MOCK_MASTER_STRATEGY);
      }
      if (apiCache.masterStrategies[id]) return apiCache.masterStrategies[id];
      try {
          const project = await api.getProjectById(id);
          if (project && project.strategy_json) {
              const strategy = project.strategy_json as ProjectMasterStrategy;
              apiCache.masterStrategies[id] = strategy;
              return strategy;
          }
          return null;
      } catch (e: any) {
          return null;
      }
  },

  createProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
      if (isMockMode) {
          const newProject: Project = { ...project, id: `mock-proj-${Date.now()}`, createdAt: new Date() };
          localProjects.unshift(newProject);
          return Promise.resolve(newProject);
      }
      const data = await fetchWithFallback('/projects', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(project)
        });
        clearCache('projects');
        clearCache('userUsageStats');
        return { ...project, id: data.id.toString(), createdAt: new Date() };
    },
  
    updateProject: async (id: string, project: Omit<Project, 'id' | 'createdAt'>): Promise<void> => {
        if (isMockMode) {
            localProjects = localProjects.map(p => p.id === id ? { ...project, id, createdAt: p.createdAt } : p);
            clearCache('projectDetails', id);
            clearCache('masterStrategies', id);
            return Promise.resolve();
        }
        await fetchWithFallback(`/projects/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(project)
        });
        clearCache('projects');
        clearCache('projectDetails', id);
        clearCache('masterStrategies', id);
    },
  
    deleteProject: async (id: string): Promise<void> => {
        if (isMockMode) {
            localProjects = localProjects.filter(p => p.id !== id);
            return Promise.resolve();
        }
        await fetchWithFallback(`/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        clearCache('projects');
        clearCache('projectDetails', id);
        clearCache('userUsageStats');
        clearCache('masterStrategies', id);
    },

    updateProjectTestimonials: async (projectId: string, testimonials: any[]): Promise<void> => {
        if (isMockMode) {
            const project = localProjects.find(p => p.id === projectId);
            if (!project) return;
            const strategy = project.strategy_json || { modules: { testimonials: [] } };
            if (!strategy.modules) strategy.modules = {};
            strategy.modules.testimonials = testimonials;
            project.strategy_json = strategy;
            
            localPages = localPages.map(page => {
                if (String(page.projectId) === String(projectId)) {
                    return { ...page, content: { ...page.content, testimonials: testimonials.map((t: any) => ({
                        name: t.name,
                        text: t.text,
                        rating: 5,
                        image: t.image
                    })) }};
                }
                return page;
            });
            clearCache('projectDetails', projectId);
            clearCache('masterStrategies', projectId);
            return;
        }

        const project = await api.getProjectById(projectId);
        if (!project) throw new Error("Proyecto no encontrado");
        
        const strategy = project.strategy_json || { modules: { testimonials: [] } };
        if (!strategy.modules) strategy.modules = {};
        strategy.modules.testimonials = testimonials;
        
        await api.updateProject(projectId, { ...project, strategy_json: strategy } as any);

        const allPages = await api.getPages();
        const linkedPages = allPages.filter(p => String(p.projectId) === String(projectId));
        
        for (const page of linkedPages) {
            const updatedContent = { ...page.content, testimonials: testimonials.map(t => ({
                name: t.name,
                text: t.text,
                rating: 5,
                image: t.image
            }))};
            await api.updatePage({ ...page, content: updatedContent });
        }
        clearCache('projectDetails', projectId);
        clearCache('masterStrategies', projectId);
    },
  
    analyzeSite: async (url: string): Promise<{ productName: string, description: string, niche: string }> => {
        if (isMockMode) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { productName: "Producto Demo Analizado", description: "Descripción...", niche: "Nicho de Prueba" };
        }
        if (apiCache.siteAnalysis[url]) return apiCache.siteAnalysis[url];
        const analysis = await fetchWithFallback('/projects/analyze-site', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ url })
        });
        apiCache.siteAnalysis[url] = analysis;
        return analysis;
    },
  
    generateProjectStrategyFull: async (projectId: string): Promise<StrategyJSON> => {
        if (isMockMode) {
            return Promise.resolve({
                avatar: { name: "Mock Avatar", age: "30", occupation: "Tester", story: "Fake story", frustrations: [], desires: [] } as any,
                psychology: { emotionalTriggers: [], objections: [], falseBeliefs: [] },
                funnel: { leadMagnetIdea: "Free Ebook", tripwireIdea: "Mini Course", coreOfferPitch: "Masterclass", funnelSteps: [] },
                assets: { emailSequence: [], whatsappScripts: [], adCopies: [] }
            });
        }
        const strategy = await fetchWithFallback(`/projects/${projectId}/generate-strategy`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        clearCache('projects');
        clearCache('projectDetails', projectId);
        clearCache('masterStrategies', projectId);
        return strategy;
    },
  
    getLeads: async (): Promise<Lead[]> => {
        if (isMockMode) return Promise.resolve([...localLeads]);
        if (apiCache.leads) return apiCache.leads;
        const leads = await fetchWithFallback('/leads', { headers: getAuthHeaders() });
        const mapped = leads.map((l: any) => ({
            id: String(l.id),
            name: l.name,
            email: l.email,
            sourcePage: l.page_name || 'Desconocida',
            date: new Date(l.captured_at).toLocaleDateString(),
            synced: !!l.synced
        }));
        apiCache.leads = mapped;
        return mapped;
    },
  
    getWeeklyAnalytics: async (): Promise<{date: string, visits: number, conversions: number}[]> => {
        if (isMockMode) {
            const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
            const today = new Date();
            const data = [];
            for(let i=6; i>=0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                data.push({
                    date: d.toISOString().split('T')[0],
                    visits: Math.floor(Math.random() * 50) + 10,
                    conversions: Math.floor(Math.random() * 5)
                });
            }
            return Promise.resolve(data);
        }
        if (apiCache.weekly) return apiCache.weekly;
        const data = await fetchWithFallback('/analytics/weekly', { headers: getAuthHeaders() });
        apiCache.weekly = data;
        return data;
    },
  
    getAnalyticsSummary: async (): Promise<{totalVisits: number, totalConversions: number, totalPages: number, totalArticles: number, totalProjects: number, totalHooks: number}> => {
        if (isMockMode) {
            const totalVisits = localPages.reduce((acc, p) => acc + p.visits, 0);
            const totalConversions = localPages.reduce((acc, p) => acc + p.conversions, 0);
            return Promise.resolve({ totalVisits, totalConversions, totalPages: localPages.length, totalArticles: localArticles.length, totalProjects: localProjects.length, totalHooks: 0 });
        }
        if (apiCache.summary) return apiCache.summary;
        const summary = await fetchWithFallback('/analytics/summary', { headers: getAuthHeaders() });
        apiCache.summary = summary;
        return summary;
    },
  
    getArticles: async (): Promise<Article[]> => {
        if (isMockMode) return Promise.resolve([...localArticles]);
        if (apiCache.articles) return apiCache.articles;

        const articles = await fetchWithFallback('/articles', { method: 'GET', headers: getAuthHeaders() });
        const mapped = articles.map((a: any) => ({
            id: a.id.toString(),
            projectId: (a.project_id || a.projectId) ? String(a.project_id || a.projectId) : undefined,
            pageId: a.page_id ? a.page_id.toString() : undefined,
            pageSubdomain: a.page_subdomain,
            pageName: a.page_name,
            title: a.title,
            slug: a.slug,
            description: a.description || '',
            contentHtml: a.content_html,
            featuredImage: a.featured_image,
            keyword: a.keyword,
            seoScore: a.seo_score,
            metaTitle: a.meta_title,
            metaDescription: a.meta_description || '',
            emailSubject: a.email_subject,
            emailBody: a.email_body,
            status: a.status || 'published',
            publishedAt: a.published_at ? new Date(a.published_at) : (a.created_at ? new Date(a.created_at) : new Date()),
            createdAt: a.created_at ? new Date(a.created_at) : new Date()
        }));
        apiCache.articles = mapped;
        return mapped;
    },
  
    getArticleById: async (id: string): Promise<Article | null> => {
      if (isMockMode) {
          const art = localArticles.find(a => a.id === id);
          return art ? Promise.resolve(art) : Promise.resolve(null);
      }
      if (apiCache.articleDetails[id]) return apiCache.articleDetails[id];
      try {
          const a = await fetchWithFallback(`/articles/${id}`, { headers: getAuthHeaders() });
          const mapped: Article = {
                id: a.id.toString(),
                projectId: (a.project_id || a.projectId) ? String(a.project_id || a.projectId) : undefined,
                pageId: a.page_id ? a.page_id.toString() : undefined,
                title: a.title,
                slug: a.slug,
                description: a.description || '',
                contentHtml: a.content_html,
                featuredImage: a.featured_image,
                keyword: a.keyword,
                seoScore: a.seo_score || 0,
                metaTitle: a.meta_title,
                metaDescription: a.meta_description || '',
                emailSubject: a.email_subject,
                emailBody: a.email_body,
                status: a.status || 'published',
                publishedAt: a.published_at ? new Date(a.published_at) : (a.created_at ? new Date(a.created_at) : new Date()),
                createdAt: a.created_at ? new Date(a.created_at) : new Date()
          };
          apiCache.articleDetails[id] = mapped;
          return mapped;
      } catch (e) { return null; }
    },
  
    saveArticle: async (article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> => {
        if (isMockMode) {
            const newArticle: Article = { ...article, id: `mock-art-${Date.now()}`, createdAt: new Date() } as any;
            localArticles.unshift(newArticle);
            return Promise.resolve(newArticle);
        }
        const saved = await fetchWithFallback('/articles', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                page_id: article.pageId,
                title: article.title,
                slug: article.slug,
                description: article.description,
                content_html: article.contentHtml,
                // Fixing snake_case keys correctly mapped to article's camelCase properties
                featured_image: article.featuredImage,
                keyword: article.keyword,
                seo_score: article.seoScore,
                meta_title: article.metaTitle,
                // Fixed: meta_description was incorrectly trying to access meta_description instead of metaDescription
                meta_description: article.metaDescription,
                email_subject: article.emailSubject,
                email_body: article.emailBody,
                status: article.status,
                published_at: article.publishedAt
            })
        });
        clearCache('articles');
        clearCache('userUsageStats');
        return { ...article, id: saved.id.toString(), createdAt: new Date() } as any;
    },
  
    updateArticle: async (id: string, article: Partial<Article>): Promise<void> => {
      if (isMockMode) {
          localArticles = localArticles.map(a => a.id === id ? { ...a, ...article } : a);
          return Promise.resolve();
      }
      await fetchWithFallback(`/articles/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
                page_id: article.pageId,
                title: article.title,
                slug: article.slug,
                description: article.description,
                // Fix: Access article.contentHtml instead of non-existent article.content_html
                content_html: article.contentHtml,
                // Fixing snake_case keys correctly mapped to article's camelCase properties
                featured_image: article.featuredImage,
                keyword: article.keyword,
                seo_score: article.seoScore,
                meta_title: article.metaTitle,
                meta_description: article.metaDescription,
                email_subject: article.emailSubject,
                email_body: article.emailBody,
                status: article.status,
                published_at: article.publishedAt
          })
      });
      clearCache('articles');
      clearCache('articleDetails', id);
    },
  
    deleteArticle: async (id: string): Promise<void> => {
      if (isMockMode) {
          localArticles = localArticles.filter(p => p.id !== id);
          return Promise.resolve();
      }
      await fetchWithFallback(`/articles/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      clearCache('articles');
      clearCache('articleDetails', id);
      clearCache('userUsageStats');
    },
  
    getPublicBlogArticles: async (pageId: string): Promise<Article[]> => {
        if (isMockMode) return Promise.resolve(localArticles.filter(a => a.pageId === pageId));
        if (apiCache.publicBlogArticles[pageId]) return apiCache.publicBlogArticles[pageId];
        const articles = await fetchWithFallback(`/public/pages/${pageId}/blog`);
        const mapped = articles.map((a: any) => ({
            id: a.id.toString(),
            title: a.title,
            slug: a.slug,
            description: a.description,
            metaDescription: a.meta_description, 
            featuredImage: a.featured_image,
            publishedAt: new Date(a.published_at),
            contentHtml: '' 
        } as Article));
        apiCache.publicBlogArticles[pageId] = mapped;
        return mapped;
    },
  
    getPublicArticle: async (slug: string): Promise<Article | null> => {
        if (isMockMode) {
            const art = localArticles.find(a => a.slug === slug);
            return art ? Promise.resolve(art) : Promise.resolve(null);
        }
        if (apiCache.publicArticleDetails[slug]) return apiCache.publicArticleDetails[slug];
        const article = await fetchWithFallback(`/public/articles/${slug}`);
        const mapped = {
            id: article.id.toString(),
            title: article.title,
            slug: article.slug,
            description: article.description,
            contentHtml: article.content_html,
            featuredImage: article.featured_image,
            metaTitle: article.meta_title,
            metaDescription: article.meta_description,
            publishedAt: new Date(article.published_at),
            status: article.status,
            createdAt: new Date(article.created_at),
            keyword: '',
            seoScore: 0
        };
        apiCache.publicArticleDetails[slug] = mapped;
        return mapped;
    },
    
    testConnection: async (): Promise<{ success: boolean; message: string }> => {
        if (isMockMode) return { success: true, message: "Mock Mode Active" };
        try {
            const data = await fetchWithFallback('/debug/db-status');
            return { success: data.status === 'online', message: data.server_version || 'OK' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },
  
    getUsers: async (): Promise<User[]> => {
        if (isMockMode) return Promise.resolve([MOCK_USER]);
        if (apiCache.usersList) return apiCache.usersList;
        const users = await fetchWithFallback('/admin/users', { headers: getAuthHeaders() });
        apiCache.usersList = users;
        return users;
    },
  
    updateUser: async (id: string, data: { role: string, planLimits: PlanLimits, isActive: boolean }) => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback(`/admin/users/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) });
        clearCache('adminUserResources');
        clearCache('usersList');
    },
  
    deleteUser: async (id: string) => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback(`/admin/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        clearCache('adminUserResources');
        clearCache('usersList');
    },
  
    getAdminUserResources: async (userId: string, type: 'projects' | 'pages' | 'articles' | 'emails' | 'whatsapp' | 'hooks'): Promise<any[]> => {
        if (isMockMode) {
            if (type === 'projects') return Promise.resolve([...localProjects]);
            if (type === 'pages') return Promise.resolve([...localPages]);
            if (type === 'articles') return Promise.resolve([...localArticles]);
            return Promise.resolve([]);
        }
        const cacheKey = `${userId}_${type}`;
        if (apiCache.adminUserResources[cacheKey]) return apiCache.adminUserResources[cacheKey];
        const resources = await fetchWithFallback(`/admin/users/${userId}/resources?type=${type}`, { headers: getAuthHeaders() });
        apiCache.adminUserResources[cacheKey] = resources;
        return resources;
    },
  
    getUserPayments: async (userId: string): Promise<any[]> => {
        if (isMockMode) return Promise.resolve([]);
        if (apiCache.userPayments[userId]) return apiCache.userPayments[userId];
        const payments = await fetchWithFallback(`/admin/users/${userId}/payments`, { headers: getAuthHeaders() });
        apiCache.userPayments[userId] = payments;
        return payments;
    },
  
    getSystemLogs: async (page: number, filters: { action?: string, search?: string }): Promise<SystemLog[]> => {
        if (isMockMode) return Promise.resolve([]);
        const cacheKey = `${page}_${JSON.stringify(filters)}`;
        if (apiCache.systemLogs[cacheKey]) return apiCache.systemLogs[cacheKey];
        let query = `?page=${page}`;
        if (filters.action) query += `&action=${filters.action}`;
        if (filters.search) query += `&search=${filters.search}`;
        const logs = await fetchWithFallback('/admin/logs' + query, { headers: getAuthHeaders() });
        apiCache.systemLogs[cacheKey] = logs;
        return logs;
    },
  
    getUserUsageStats: async (userId: string): Promise<UserUsageStats> => {
        if (isMockMode) return Promise.resolve({ projects: 5, landings: 2, articles: 1, hooks: 0 });
        if (apiCache.userUsageStats[userId]) return apiCache.userUsageStats[userId];
        const stats = await fetchWithFallback(`/admin/users/${userId}/stats`, { headers: getAuthHeaders() });
        apiCache.userUsageStats[userId] = stats;
        return stats;
    },

    getUserResources: async (type: string, params?: { projectId?: string, page?: number, limit?: number }): Promise<any> => {
        if (isMockMode) return Promise.resolve([]);
        let url = `/auth/me/resources?type=${type}`;
        if (params) {
            if (params.projectId) url += `&projectId=${params.projectId}`;
            if (params.page) url += `&page=${params.page}`;
            if (params.limit) url += `&limit=${params.limit}`;
        }
        return await fetchWithFallback(url, { headers: getAuthHeaders() });
    },
  
    getCoursesList: async (): Promise<{id: string, title: string, slug: string}[]> => {
        if (isMockMode) return Promise.resolve(localCourses.map(c => ({ id: c.id, title: c.title, slug: c.slug })));
        if (apiCache.courses) return apiCache.courses;
        const courses = await fetchWithFallback('/courses', { headers: getAuthHeaders() });
        apiCache.courses = courses;
        return courses;
    },
  
    getCourseBySlug: async (slug: string): Promise<any> => {
        if (isMockMode) {
            const course = localCourses.find(c => c.slug === slug);
            if (course) return Promise.resolve({ ...course, learningPoints: [], modules: course.modules?.map(m => ({...m, lessons: []})) || [] });
            return Promise.resolve({ id: 'mock-course', title: 'Curso Mock (Modo Offline)', modules: [] });
        }
        if (apiCache.courseDetails[slug]) return apiCache.courseDetails[slug];
        const course = await fetchWithFallback(`/courses/${slug}`, { headers: getAuthHeaders() });
        apiCache.courseDetails[slug] = course;
        return course;
    },
  
    getModuleLessons: async (moduleId: string): Promise<CourseLesson[]> => {
        if (isMockMode) {
            const module = localCourses.flatMap(c => c.modules).find(m => m.id === moduleId);
            return Promise.resolve(module?.lessons || []);
        }
        if (apiCache.moduleLessons[moduleId]) return apiCache.moduleLessons[moduleId];
        const lessons = await fetchWithFallback(`/modules/${moduleId}/lessons`, { headers: getAuthHeaders() });
        apiCache.moduleLessons[moduleId] = lessons;
        return lessons;
    },
  
    getAdminCourses: async (): Promise<Course[]> => {
        if (isMockMode) return Promise.resolve(localCourses);
        return await fetchWithFallback('/admin/courses', { headers: getAuthHeaders() });
    },
  
    saveCourse: async (course: Course): Promise<Course> => {
        if (isMockMode) {
            if (course.id) {
                localCourses = localCourses.map(c => c.id === course.id ? course : c);
                return Promise.resolve(course);
            } else {
                const newCourse = { ...course, id: `new-${Date.now()}` };
                localCourses.push(newCourse);
                return Promise.resolve(newCourse);
            }
        }
        const method = course.id ? 'PUT' : 'POST';
        const endpoint = course.id ? `/admin/courses/${course.id}` : '/admin/courses';
        const res = await fetchWithFallback(endpoint, { method: method, headers: getAuthHeaders(), body: JSON.stringify(course) });
        clearCache('courses');
        if (course.slug) clearCache('courseDetails', course.slug);
        return res;
    },
  
    reorderCourses: async (orderedIds: string[]): Promise<void> => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback('/admin/courses/reorder', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ orderedIds }) });
        clearCache('courses');
    },
  
    deleteCourse: async (id: string): Promise<void> => {
        if (isMockMode) {
            localCourses = localCourses.filter(c => c.id !== id);
            return Promise.resolve();
        }
        await fetchWithFallback(`/admin/courses/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        clearCache('courses');
    },
  
    getAdminComments: async (): Promise<Comment[]> => {
        if (isMockMode) return Promise.resolve(localComments);
        return await fetchWithFallback('/admin/comments', { headers: getAuthHeaders() });
    },
  
    moderateComment: async (id: string, action: 'toggle_publish' | 'delete'): Promise<void> => {
        if (isMockMode) {
            if (action === 'delete') localComments = localComments.filter(c => c.id !== id);
            else localComments = localComments.map(c => c.id === id ? { ...c, isApproved: !c.isApproved } : c);
            return Promise.resolve();
        }
        await fetchWithFallback(`/admin/comments/${id}`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ action }) });
        clearCache('lessonComments');
    },
  
    getComments: async (lessonId: string): Promise<any[]> => {
        if (isMockMode) return Promise.resolve(localComments.filter(c => c.lessonId === lessonId));
        if (apiCache.lessonComments[lessonId]) return apiCache.lessonComments[lessonId];
        const comments = await fetchWithFallback(`/lessons/${lessonId}/comments`, { headers: getAuthHeaders() });
        apiCache.lessonComments[lessonId] = comments;
        return comments;
    },
  
    postComment: async (lessonId: string, content: string, parentId?: string): Promise<void> => {
        if (isMockMode) {
            const newComment: any = { id: `c-${Date.now()}`, lessonId, text: content, user: MOCK_USER.name, userId: MOCK_USER.id, date: new Date().toISOString(), likes: 0, isApproved: false };
            if (parentId) newComment.parentId = parentId;
            localComments.unshift(newComment);
            return Promise.resolve();
        }
        await fetchWithFallback('/comments', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ lessonId, content, parentId }) });
        clearCache('lessonComments', lessonId);
    },
  
    likeComment: async (commentId: string): Promise<void> => {
        if (isMockMode) {
            const comment = localComments.find(c => c.id === commentId);
            if (comment) comment.likes = (comment.likes || 0) + 1;
            return Promise.resolve();
        }
        await fetchWithFallback(`/comments/${commentId}/like`, { method: 'POST', headers: getAuthHeaders() });
    },
  
    getLoginRedirect: async (): Promise<string> => {
        if (isMockMode) return "/dashboard/training/bienvenida";
        if (apiCache.loginRedirect) return apiCache.loginRedirect;
        try {
            const data = await fetchWithFallback('/settings/redirect');
            apiCache.loginRedirect = data.url;
            return data.url;
        } catch (e) { return "/dashboard"; }
    },

    getActivePaymentMethod: async (): Promise<'stripe' | 'hotmart'> => {
        if (isMockMode) return 'stripe';
        if (apiCache.activePaymentMethod) return apiCache.activePaymentMethod;
        try {
            const data = await fetchWithFallback('/settings/payment-method');
            apiCache.activePaymentMethod = data.method;
            return data.method;
        } catch (e) { return 'stripe'; }
    },

    getSystemMode: async (): Promise<'production' | 'launch'> => {
        if (isMockMode) return 'production';
        if (apiCache.systemMode) return apiCache.systemMode;
        try {
            const data = await fetchWithFallback('/system/mode');
            apiCache.systemMode = data.mode;
            return data.mode;
        } catch (e) { return 'production'; }
    },
  
    updateLoginRedirect: async (url: string) => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback('/admin/settings', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ key: 'after_login_url', value: url }) });
        clearCache('loginRedirect');
    },

    updateActivePaymentMethod: async (method: 'stripe' | 'hotmart') => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback('/admin/settings', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ key: 'active_payment_method', value: method }) });
        clearCache('activePaymentMethod');
    },

    updateSystemMode: async (mode: 'production' | 'launch') => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback('/admin/settings', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ key: 'system_mode', value: mode }) });
        clearCache('systemMode');
    },
  
    getPlans: async (): Promise<Plan[]> => {
        if (isMockMode) return Promise.resolve([]); 
        if (apiCache.plans) return apiCache.plans;
        const plans = await fetchWithFallback('/admin/plans', { headers: getAuthHeaders() });
        apiCache.plans = plans;
        return plans;
    },
  
    getPublicPlans: async (): Promise<Plan[]> => {
        if (isMockMode) {
            const mockPlans: Plan[] = [
                { 
                  id: 'starter', 
                  name: 'Plan 1 (Starter)', 
                  slug: 'starter', 
                  description: 'Plan base para todos los proyectos.', 
                  priceMonthly: 0, 
                  currency: 'EUR', 
                  limitsConfig: { 
                    planName: 'starter', 
                    maxProjects: 1, 
                    maxLandings: 2, 
                    maxArticles: 2, 
                    maxDomains: 0, 
                    maxEmailSequences: 1,
                    maxWhatsAppLaunches: 1, 
                    maxHooks: 10,
                    features: { whatsappBot: false, blogGenerator: false, emailMarketing: false, removeBranding: false, emailStrategy: false, evergreenStrategy: false } 
                  }, 
                  uiFeatures: ['1 Proyecto Activo', 'Contenidos Limitados', 'Sin Dominio Propio', 'Marca de Agua'], 
                  isActive: true, 
                  isRecommended: false 
                }
            ];

            for (let i = 2; i <= 10; i++) {
                mockPlans.push({
                    id: `plan-${i}`,
                    name: `Plan ${i} (Proyecto ${i})`,
                    slug: `plan-${i}`,
                    description: `Desbloquea el proyecto ${i} con todas las funciones profesionales.`,
                    priceMonthly: 19.99,
                    currency: 'EUR',
                    hotmartId: '2983743',
                    hotmartOffer: `OFF_PLAN_${i}`,
                    hotmartCheckoutMode: 'standard',
                    limitsConfig: {
                        planName: `plan-${i}`,
                        maxProjects: 1,
                        maxLandings: 20,
                        maxArticles: 20,
                        maxDomains: 3,
                        maxEmailSequences: 5,
                        maxWhatsAppLaunches: 5,
                        maxHooks: 50,
                        features: { whatsappBot: true, blogGenerator: true, emailMarketing: true, removeBranding: true, emailStrategy: true, evergreenStrategy: true }
                    },
                    uiFeatures: [`Proyecto ${i} Desbloqueado`, 'Dominios Personalizados', 'Sin Marca de Agua', 'IA Avanzada'],
                    isActive: true,
                    isRecommended: i === 2
                });
            }
            return Promise.resolve(mockPlans);
        }
        if (apiCache.publicPlans) return apiCache.publicPlans;
        const plans = await fetchWithFallback('/public/plans');
        const mappedPlans = (plans || []).map((p: any) => ({
            ...p,
            priceMonthly: Number(p.priceMonthly),
            limitsConfig: typeof (p.limits_config || p.limitsConfig) === 'string' ? JSON.parse(p.limits_config || p.limitsConfig) : (p.limits_config || p.limitsConfig),
            uiFeatures: typeof p.uiFeatures === 'string' ? JSON.parse(p.uiFeatures) : p.uiFeatures,
            hotmartId: p.hotmartId,
            hotmartOffer: p.hotmartOffer,
            hotmartCheckoutMode: p.hotmartCheckoutMode,
            isActive: p.isActive === 1 || p.isActive === true,
            isRecommended: p.isRecommended === 1 || p.isRecommended === true
        }));
        apiCache.publicPlans = mappedPlans;
        return mappedPlans;
    },
  
    savePlan: async (plan: Plan) => {
        if (isMockMode) return Promise.resolve();
        const method = plan.id ? 'PUT' : 'POST';
        const endpoint = plan.id ? `/admin/plans/${plan.id}` : '/admin/plans';
        const res = await fetchWithFallback(endpoint, { method: method, headers: getAuthHeaders(), body: JSON.stringify(plan) });
        clearCache('plans');
        clearCache('publicPlans');
    },
  
    deletePlan: async (id: string) => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback(`/admin/plans/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        clearCache('plans');
        clearCache('publicPlans');
    },
  
    getContacts: async (): Promise<CRMContact[]> => {
        if (isMockMode) return Promise.resolve([...localCrmContacts]);
        if (apiCache.contacts) return apiCache.contacts;
        const contacts = await fetchWithFallback('/crm/contacts', { headers: getAuthHeaders() });
        const mapped = contacts.map((c: any) => ({
            ...c,
            id: c.id.toString(),
            pageId: c.page_id ? c.page_id.toString() : undefined,
            pageSlug: c.page_slug, 
            lastContactedAt: c.last_contacted_at ? new Date(c.last_contacted_at) : undefined,
            createdAt: new Date(c.created_at),
            updatedAt: new Date(c.updated_at)
        }));
        apiCache.contacts = mapped;
        return mapped;
    },
  
  createContact: async (contact: Omit<CRMContact, 'id' | 'createdAt' | 'updatedAt' | 'lastContactedAt'>): Promise<CRMContact> => {
        if (isMockMode) {
            const newContact: CRMContact = { ...contact, id: `mock-crm-${Date.now()}`, lastContactedAt: undefined, createdAt: new Date(), updatedAt: new Date() };
            localCrmContacts.unshift(newContact);
            return Promise.resolve(newContact);
        }
        const res = await fetchWithFallback('/crm/contacts', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(contact) });
        clearCache('contacts');
        return { ...contact, id: res.id.toString(), createdAt: new Date(), updatedAt: new Date() };
    },
  
    updateContact: async (contact: CRMContact) => {
        if (isMockMode) {
            localCrmContacts = localCrmContacts.map(c => c.id === contact.id ? { ...contact, updatedAt: new Date() } : c);
            return Promise.resolve();
        }
        await fetchWithFallback(`/crm/contacts/${contact.id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(contact) });
        clearCache('contacts');
    },
  
    deleteContact: async (id: string) => {
        if (isMockMode) {
            localCrmContacts = localCrmContacts.filter(c => c.id !== id);
            return Promise.resolve();
        }
        await fetchWithFallback(`/crm/contacts/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        clearCache('contacts');
    },
  
    getContactHistory: async (contactId: string): Promise<CRMActivity[]> => {
        if (isMockMode) return Promise.resolve(localCrmActivities.filter(a => a.contactId === contactId));
        if (apiCache.contactHistory[contactId]) return apiCache.contactHistory[contactId];
        const activities = await fetchWithFallback(`/crm/contacts/${contactId}/history`, { headers: getAuthHeaders() });
        const mapped = activities.map((a: any) => ({
            id: a.id.toString(),
            contact_id: a.contact_id.toString(),
            type: a.type,
            content: a.content,
            createdAt: new Date(a.created_at)
        }));
        apiCache.contactHistory[contactId] = mapped;
        return mapped;
    },
  
    addContactNote: async (contactId: string, content: string) => {
        if (isMockMode) {
            localCrmActivities.unshift({ id: `act-${Date.now()}`, contactId, type: 'note', content, createdAt: new Date() });
            return Promise.resolve();
        }
        await fetchWithFallback(`/crm/contacts/${contactId}/notes`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ content }) });
        clearCache('contactHistory', contactId);
    },

    getHotmartData: async (): Promise<any> => {
        if (isMockMode) return Promise.resolve(null);
        if (apiCache.hotmartData) return apiCache.hotmartData;
        try {
            const data = await fetchWithFallback('/admin/hotmart/summary', { headers: getAuthHeaders() });
            apiCache.hotmartData = data;
            return data;
        } catch (e) {
            return null;
        }
    },

    getCRMStats: async (): Promise<any> => {
        if (isMockMode) return { newLeads: 5, contacted: 12, closed: 3 };
        if (apiCache.crmStats) return apiCache.crmStats;
        
        try {
            const stats = await fetchWithFallback('/crm/stats', { headers: getAuthHeaders() });
            apiCache.crmStats = stats;
            return stats;
        } catch (e) {
            return null;
        }
    },

    getNewsFeed: async (): Promise<DashboardNews[]> => {
        if (isMockMode) return MOCK_NEWS;
        if (apiCache.newsFeed) return apiCache.newsFeed;
        
        try {
            const news = await fetchWithFallback('/system/news', { headers: getAuthHeaders() });
            apiCache.newsFeed = news;
            return news;
        } catch (e) {
            return MOCK_NEWS;
        }
    },

    getAdminNews: async (): Promise<DashboardNews[]> => {
        if (isMockMode) return MOCK_NEWS;
        if (apiCache.adminNews) return apiCache.adminNews;
        const news = await fetchWithFallback('/admin/news', { headers: getAuthHeaders() });
        const mapped = news.map((n: any) => ({
            id: n.id.toString(),
            title: n.title,
            content: n.content,
            date: new Date(n.created_at).toLocaleDateString(),
            iconType: n.icon_type
        }));
        apiCache.adminNews = mapped;
        return mapped;
    },

    saveNews: async (news: Partial<DashboardNews>) => {
        if (isMockMode) return;
        const method = news.id ? 'PUT' : 'POST';
        const endpoint = news.id ? `/admin/news/${news.id}` : '/admin/news';
        await fetchWithFallback(endpoint, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title: news.title,
                content: news.content,
                icon_type: news.iconType
            })
        });
        clearCache('adminNews');
        clearCache('newsFeed');
        clearCache('newsHistory');
    },

    deleteNews: async (id: string) => {
        if (isMockMode) return;
        await fetchWithFallback(`/admin/news/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        clearCache('adminNews');
        clearCache('newsFeed');
        clearCache('newsHistory');
    },

    getNewsHistory: async (month?: number, year?: number): Promise<DashboardNews[]> => {
        const cacheKey = `${month || 'all'}_${year || 'all'}`;
        if (apiCache.newsHistory[cacheKey]) return apiCache.newsHistory[cacheKey]!;
        
        let query = '';
        if (month || year) {
            query = '?';
            if (month) query += `month=${month}&`;
            if (year) query += `year=${year}`;
        }
        
        const news = await fetchWithFallback(`/system/news/history${query}`, { headers: getAuthHeaders() });
        apiCache.newsHistory[cacheKey] = news;
        return news;
    },

    getIntegrationSettings: async (): Promise<Record<string, any>> => {
        if (isMockMode) return { getResponseKey: 'gr_mock_key', systemeIoKey: 'sys_mock_key', waWebhook: 'https://wa.mock' };
        if (apiCache.integrationSettings) return apiCache.integrationSettings;
        
        try {
            const settings = await fetchWithFallback('/system/integrations', { headers: getAuthHeaders() });
            apiCache.integrationSettings = settings;
            return settings;
        } catch (e) {
            return {};
        }
    },

    updateIntegrationSettings: async (settings: Record<string, any>) => {
        if (isMockMode) return;
        await fetchWithFallback('/system/integrations', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(settings) });
        clearCache('integrationSettings');
    },

    syncPendingLeads: async (tagId?: string): Promise<{ success: boolean; count: number; message: string }> => {
        if (isMockMode) {
            return Promise.resolve({ success: true, count: 2, message: "Sincronización simulada exitosa (Mock Mode)" });
        }
        const res = await fetchWithFallback('/system/integrations/sync-pending', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ tagId })
        });
        clearCache('leads');
        return res;
    },

    syncSingleLead: async (leadId: string, tagId?: string): Promise<{ success: boolean; message: string }> => {
        if (isMockMode) {
            return Promise.resolve({ success: true, message: "Sincronización individual simulada exitosa." });
        }
        return await fetchWithFallback('/system/integrations/sync-single', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ leadId, tagId })
        });
    },

    getSystemeIoTags: async (): Promise<any[]> => {
        if (isMockMode) return [{ id: 1, name: 'Tag Mock A' }, { id: 2, name: 'Tag Mock B' }];
        return await fetchWithFallback('/system/integrations/systemeio/tags', {
            headers: getAuthHeaders()
        });
    },

    createSystemeIoTag: async (name: string): Promise<any> => {
        if (isMockMode) return { id: Date.now(), name };
        return await fetchWithFallback('/system/integrations/systemeio/tags', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name })
        });
    },

    getEmailSequences: async (): Promise<EmailSequence[]> => {
        if (isMockMode) return Promise.resolve([...MOCK_EMAIL_SEQUENCES]);
        if (apiCache.emailSequences) return apiCache.emailSequences;
        const data = await fetchWithFallback('/email/sequences', { headers: getAuthHeaders() });
        const mapped = data.map((seq: any) => ({
            ...seq,
            id: String(seq.id),
            projectId: String(seq.project_id),
            projectName: seq.project_name,
            tagName: seq.tag_name || 'Sin etiqueta',
            createdAt: new Date(seq.created_at),
            generatedDays: seq.generatedDays || []
        }));
        apiCache.emailSequences = mapped;
        return mapped;
    },

    createEmailSequence: async (projectId: string, name?: string): Promise<{ id: string; isNew: boolean }> => {
        if (isMockMode) return Promise.resolve({ id: 'mock-seq-1', isNew: true });
        const res = await fetchWithFallback('/email/sequences', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ projectId, name })
        });
        clearCache('emailSequences');
        return res;
    },

    deleteEmailSequence: async (id: string) => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback(`/email/sequences/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        clearCache('emailSequences');
    },

    getSequenceMessages: async (sequenceId: string): Promise<EmailMessage[]> => {
        if (isMockMode) return Promise.resolve(MOCK_EMAIL_MESSAGES.filter(m => m.sequenceId === sequenceId));
        return await fetchWithFallback(`/email/sequences/${sequenceId}/messages`, { headers: getAuthHeaders() });
    },

    updateEmailMessage: async (messageId: string, data: Partial<EmailMessage>) => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback(`/email/messages/${messageId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        clearCache('emailSequences');
    },

    getWhatsAppLaunches: async (): Promise<WhatsAppLaunch[]> => {
        if (isMockMode) return [];
        if (apiCache.waLaunches) return apiCache.waLaunches;
        const data = await fetchWithFallback('/whatsapp-launch/launches', { headers: getAuthHeaders() });
        const mapped = data.map((l: any) => ({
            ...l,
            id: String(l.id),
            projectId: String(l.project_id),
            projectName: l.project_name,
            createdAt: new Date(l.created_at),
            messages: typeof l.data_json === 'string' ? JSON.parse(l.data_json) : (l.data_json || []),
            launchDate: l.launch_date ? new Date(l.launch_date) : undefined
        }));
        apiCache.waLaunches = mapped;
        return mapped;
    },

    getWhatsAppLaunchByProject: async (projectId: string): Promise<WhatsAppLaunch | null> => {
        if (isMockMode) return null;
        try {
            const l = await fetchWithFallback(`/whatsapp-launch/launches/by-project/${projectId}`, { headers: getAuthHeaders() });
            return {
                ...l,
                id: String(l.id),
                projectId: String(l.project_id),
                projectName: l.project_name,
                createdAt: new Date(l.created_at),
                messages: typeof l.data_json === 'string' ? JSON.parse(l.data_json) : (l.data_json || []),
                launchDate: l.launch_date ? new Date(l.launch_date) : undefined
            };
        } catch (e) {
            return null;
        }
    },

    createWhatsAppLaunch: async (projectId: string, name?: string): Promise<{ id: string }> => {
        if (isMockMode) return Promise.resolve({ id: 'mock-wa-1' });
        const res = await fetchWithFallback('/whatsapp-launch/launches', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ projectId, name })
        });
        clearCache('waLaunches');
        return res;
    },

    updateWhatsAppLaunch: async (launchId: string, data: Partial<WhatsAppLaunch>) => {
        if (isMockMode) return Promise.resolve();
        const payload = { ...data };
        if (payload.messages) {
            (payload as any).data_json = JSON.stringify(payload.messages);
            delete payload.messages;
        }
        if (payload.launchDate) {
            (payload as any).launch_date = typeof payload.launchDate === 'string' ? payload.launchDate : (payload.launchDate as Date).toISOString().split('T')[0];
            delete payload.launchDate;
        }
        await fetchWithFallback(`/whatsapp-launch/launches/${launchId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        clearCache('waLaunches');
    },

    deleteWhatsAppLaunch: async (id: string) => {
        if (isMockMode) return Promise.resolve();
        await fetchWithFallback(`/whatsapp-launch/launches/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        clearCache('waLaunches');
    },

    ////////// Actualización: Métodos para Tickets de Soporte - 12/06/2025 //////////
    submitSupportTicket: async (data: { itemName: string; reason: string }): Promise<void> => {
        if (isMockMode) {
            console.log("Mock Support Ticket Submitted:", data);
            return Promise.resolve();
        }
        await fetchWithFallback('/support/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        clearCache('supportTickets');
    },

    getAdminSupportTickets: async (): Promise<SupportTicket[]> => {
        if (isMockMode) return [];
        if (apiCache.supportTickets) return apiCache.supportTickets;
        const tickets = await fetchWithFallback('/admin/support/tickets', { headers: getAuthHeaders() });
        apiCache.supportTickets = tickets;
        return tickets;
    },
    ////////// Fin de actualización //////////

    /* Actualización: Métodos para el sistema dinámico de Hooks de Atracción - 01/01/2026 */
    getProjectHooks: async (projectId: string): Promise<ProjectHook[]> => {
        if (isMockMode) return MOCK_PROJECT_HOOKS;
        return await fetchWithFallback(`/hooks/project/${projectId}`, { headers: getAuthHeaders() });
    },

    unlockSingleHook: async (projectId: string, masterHookId: string): Promise<{ id: string }> => {
        if (isMockMode) return { id: `unlocked-${Date.now()}` };
        return await fetchWithFallback('/hooks/unlock-single', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ projectId, masterHookId })
        });
    },

    unlockMoreHooks: async (projectId: string): Promise<{ success: boolean; count: number; message: string }> => {
        if (isMockMode) return { success: true, count: 10, message: "10 nuevos ganchos añadidos a tu estrategia." };
        const res = await fetchWithFallback(`/hooks/unlock-more/${projectId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        return res;
    },

    updateProjectHook: async (hookId: string, data: Partial<ProjectHook>): Promise<void> => {
        if (isMockMode) return;
        await fetchWithFallback(`/hooks/${hookId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },
    
    createProjectHook: async (projectId: string, hookData: any): Promise<any> => {
        if (isMockMode) return { id: `manual-${Date.now()}`, ...hookData };
        const res = await fetchWithFallback('/hooks', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ projectId, ...hookData })
        });
        return res;
    },

    deleteProjectHook: async (hookId: string): Promise<void> => {
        if (isMockMode) return;
        await fetchWithFallback(`/hooks/${hookId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    },
    /* Fin de actualización */

    getLastGeneratedTitles: () => apiCache.lastGeneratedTitles,
    setLastGeneratedTitles: (titles: any[]) => { apiCache.lastGeneratedTitles = titles; },

    generateWithIA: async (prompt: string, config: any = {}): Promise<{ text: string }> => {
        if (isMockMode) {
            return { text: JSON.stringify({ subject: "Asunto Mock", body: "Cuerpo del correo mock." }) };
        }
        return await fetchWithFallback('/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: prompt,
                config: config
            })
        });
    },
};
  
function safeParseJsonList(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try { return typeof data === 'string' ? JSON.parse(data) : data; } catch (e) { return []; }
}
