import { 
  LandingPage, User, Plan, Article, Project, CRMContact, CRMActivity, 
  Course, Comment, SystemLog, UserUsageStats, GeneratedPageContent
} from '../types';
import { 
  MOCK_USER, MOCK_PAGES, MOCK_PROJECTS, MOCK_ARTICLES, 
  MOCK_COURSES, MOCK_COMMENTS, MOCK_CRM_CONTACTS, MOCK_CRM_ACTIVITIES,
  MOCK_MASTER_STRATEGY, MOCK_LEADS
} from './mockData';
import { authStorage } from './auth';

let isMockMode = false;

// Helper robusto para obtener la URL base del backend
const getBaseUrl = (): string => {
  // import.meta puede no estar definido en algunos entornos
  const anyImportMeta = import.meta as any;
  const envUrl = anyImportMeta?.env?.VITE_API_URL;

  if (envUrl) {
    // Asegurar que no termine en slash
    const cleanUrl = envUrl.replace(/\/$/, '');
    // Si ya termina en /api, devolverlo tal cual
    if (cleanUrl.endsWith('/api')) return cleanUrl;
    // Si no, agregar /api
    return `${cleanUrl}/api`;
  }

  // fallback razonable: mismo host + /api
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }

  return '/api';
};

const getAuthHeaders = () => {
  const token = authStorage.getToken();
  return token ? { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

const fetchWithFallback = async (endpoint: string, options: RequestInit = {}) => {
  if (isMockMode) {
    throw new Error("Mock mode active");
  }
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url, options);
  return handleResponse(response);
};

export const api = {
  enableMockMode: () => { isMockMode = true; },
  disableMockMode: () => { isMockMode = false; },
  isUsingMockData: () => isMockMode,
  getBaseUrl,

  // --- AUTH ---
  login: async (email, password) => {
    if (isMockMode) {
      if (email === 'admin@plataformadeventa.com' && password === 'MiPasswordSuperSegura123') {
         return Promise.resolve(MOCK_USER);
      }
      return Promise.reject(new Error("Credenciales inválidas (Mock)"));
    }
    return Promise.reject(new Error("Use services/auth.ts for real login"));
  },
  
  logout: async () => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback('/auth/logout', { method: 'POST', headers: getAuthHeaders() });
  },

  getLoginRedirect: async () => {
      if (isMockMode) return Promise.resolve('/dashboard');
      const data = await fetchWithFallback('/settings/redirect');
      return data.url;
  },
  
  updateLoginRedirect: async (url: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback('/admin/settings', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ key: 'after_login_url', value: url })
      });
  },

  updateProfile: async (data: any) => {
      if (isMockMode) return Promise.resolve({ ...MOCK_USER, ...data });
      return fetchWithFallback('/auth/profile', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },

  // --- PLANS ---
  getPublicPlans: async () => {
      if (isMockMode) return Promise.resolve([]); 
      return fetchWithFallback('/public/plans');
  },
  
  getPlans: async () => {
      if (isMockMode) return Promise.resolve([]);
      return fetchWithFallback('/admin/plans', { headers: getAuthHeaders() });
  },
  
  savePlan: async (plan: Plan) => {
      if (isMockMode) return Promise.resolve();
      const method = plan.id ? 'PUT' : 'POST';
      const url = plan.id ? `/admin/plans/${plan.id}` : '/admin/plans';
      return fetchWithFallback(url, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(plan)
      });
  },
  
  deletePlan: async (id: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/admin/plans/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
      });
  },

  createCheckoutSession: async (planSlug: string) => {
      if (isMockMode) return Promise.resolve({ url: '#' });
      return fetchWithFallback('/stripe/create-checkout-session', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ planSlug })
      });
  },

  // --- USERS (Admin) ---
  getUsers: async () => {
      if (isMockMode) return Promise.resolve([MOCK_USER]);
      return fetchWithFallback('/admin/users', { headers: getAuthHeaders() });
  },
  
  updateUser: async (id: string, data: any) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/admin/users/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },
  
  deleteUser: async (id: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/admin/users/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
      });
  },
  
  getUserUsageStats: async (id: string) => {
      if (isMockMode) return Promise.resolve({ projects: 1, landings: 1, articles: 1 });
      return fetchWithFallback(`/admin/users/${id}/stats`, { headers: getAuthHeaders() });
  },
  
  getUserPayments: async (id: string) => {
      if (isMockMode) return Promise.resolve([]);
      return fetchWithFallback(`/admin/users/${id}/payments`, { headers: getAuthHeaders() });
  },
  
  getAdminUserResources: async (id: string, type: string) => {
      if (isMockMode) return Promise.resolve([]);
      return fetchWithFallback(`/admin/users/${id}/resources?type=${type}`, { headers: getAuthHeaders() });
  },

  // --- LOGS ---
  getSystemLogs: async (page = 1, filters: any = {}) => {
      if (isMockMode) return Promise.resolve([]);
      const params = new URLSearchParams({ page: page.toString(), ...filters });
      return fetchWithFallback(`/admin/logs?${params.toString()}`, { headers: getAuthHeaders() });
  },

  // --- PROJECTS ---
  getProjects: async () => {
      if (isMockMode) return Promise.resolve(MOCK_PROJECTS);
      return fetchWithFallback('/projects', { headers: getAuthHeaders() });
  },
  
  getProjectById: async (id: string) => {
      if (isMockMode) return Promise.resolve(MOCK_PROJECTS.find(p => p.id === id));
      return fetchWithFallback(`/projects/${id}`, { headers: getAuthHeaders() });
  },
  
  createProject: async (data: any) => {
      if (isMockMode) {
          const newProj = { ...data, id: Date.now().toString(), createdAt: new Date() };
          MOCK_PROJECTS.push(newProj);
          return Promise.resolve(newProj);
      }
      return fetchWithFallback('/projects', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },
  
  updateProject: async (id: string, data: any) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/projects/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },
  
  deleteProject: async (id: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/projects/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
      });
  },
  
  getProjectStrategy: async (id: string) => {
      if (isMockMode) return Promise.resolve(MOCK_MASTER_STRATEGY);
      const project = await api.getProjectById(id);
      if (project && project.strategy_json) return project.strategy_json;
      return null; 
  },

  // --- PAGES ---
  getPages: async (): Promise<LandingPage[]> => {
    if (isMockMode) return Promise.resolve(MOCK_PAGES);
    const pages = await fetchWithFallback('/pages', { method: 'GET', headers: getAuthHeaders() });
    return pages.map((p: any) => {
        let content = p.content;
        if (typeof content === 'string') {
            try { content = JSON.parse(content); } catch (e) {}
        }
        
        if (p.thankyoupage_json && !content.thankYouPage) {
             const ty = typeof p.thankyoupage_json === 'string' ? JSON.parse(p.thankyoupage_json) : p.thankyoupage_json;
             content.thankYouPage = ty;
        }

        return {
            ...p,
            id: String(p.id),
            isPublished: !!(p.isPublished || p.is_published),
            customDomain: p.custom_domain || p.customDomain,
            content: content,
            createdAt: new Date(p.created_at || p.createdAt)
        };
    });
  },

  getPageById: async (id: string) => {
      if (isMockMode) return Promise.resolve(MOCK_PAGES.find(p => p.id === id));
      const pages = await api.getPages();
      return pages.find(p => p.id === id);
  },

  createPage: async (page: LandingPage) => {
      if (isMockMode) return Promise.resolve({ ...page, id: Date.now().toString() });
      return fetchWithFallback('/pages', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(page)
      });
  },

  updatePage: async (page: LandingPage) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/pages/${page.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(page)
      });
  },

  deletePage: async (id: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/pages/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
      });
  },

  // --- ARTICLES ---
  getArticles: async () => {
      if (isMockMode) return Promise.resolve(MOCK_ARTICLES);
      return fetchWithFallback('/articles', { headers: getAuthHeaders() });
  },
  
  getArticleById: async (id: string) => {
      if (isMockMode) return Promise.resolve(MOCK_ARTICLES.find(a => a.id === id));
      return fetchWithFallback(`/articles/${id}`, { headers: getAuthHeaders() });
  },
  
  saveArticle: async (article: any) => {
      if (isMockMode) return Promise.resolve({ id: Date.now().toString() });
      return fetchWithFallback('/articles', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(article)
      });
  },
  
  updateArticle: async (id: string, article: any) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/articles/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(article)
      });
  },
  
  deleteArticle: async (id: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/articles/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
      });
  },
  
  getPublicArticle: async (slug: string) => {
      if (isMockMode) return Promise.resolve(MOCK_ARTICLES.find(a => a.slug === slug));
      return fetchWithFallback(`/public/articles/${slug}`);
  },
  
  getPublicBlogArticles: async (pageId: string) => {
      if (isMockMode) return Promise.resolve(MOCK_ARTICLES.filter(a => a.pageId === pageId));
      return fetchWithFallback(`/public/pages/${pageId}/blog`);
  },

  // --- CRM ---
  getContacts: async () => {
      if (isMockMode) return Promise.resolve(MOCK_CRM_CONTACTS);
      return fetchWithFallback('/crm/contacts', { headers: getAuthHeaders() });
  },
  
  createContact: async (data: any) => {
      if (isMockMode) return Promise.resolve({ ...data, id: Date.now().toString() });
      return fetchWithFallback('/crm/contacts', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },
  
  updateContact: async (data: any) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/crm/contacts/${data.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },
  
  deleteContact: async (id: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/crm/contacts/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
      });
  },
  
  getContactHistory: async (id: string) => {
      if (isMockMode) return Promise.resolve(MOCK_CRM_ACTIVITIES.filter(a => a.contactId === id));
      return fetchWithFallback(`/crm/contacts/${id}/history`, { headers: getAuthHeaders() });
  },
  
  addContactNote: async (id: string, content: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/crm/contacts/${id}/notes`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ content })
      });
  },
  
  submitLead: async (data: any) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback('/public/leads/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });
  },

  // --- COURSES ---
  getCoursesList: async () => {
      if (isMockMode) return Promise.resolve(MOCK_COURSES);
      return fetchWithFallback('/courses', { headers: getAuthHeaders() });
  },
  
  getCourseBySlug: async (slug: string) => {
      if (isMockMode) return Promise.resolve(MOCK_COURSES.find(c => c.slug === slug));
      return fetchWithFallback(`/courses/${slug}`, { headers: getAuthHeaders() });
  },
  
  getModuleLessons: async (moduleId: string) => {
      if (isMockMode) {
          const course = MOCK_COURSES.find(c => c.modules.some(m => m.id === moduleId));
          const mod = course?.modules.find(m => m.id === moduleId);
          return Promise.resolve(mod?.lessons || []);
      }
      return fetchWithFallback(`/modules/${moduleId}/lessons`, { headers: getAuthHeaders() });
  },
  
  getComments: async (lessonId: string) => {
      if (isMockMode) return Promise.resolve(MOCK_COMMENTS.filter(c => c.lessonId === lessonId));
      return fetchWithFallback(`/lessons/${lessonId}/comments`, { headers: getAuthHeaders() });
  },
  
  postComment: async (lessonId: string, content: string, parentId?: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback('/comments', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ lessonId, content, parentId })
      });
  },
  
  likeComment: async (commentId: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/comments/${commentId}/like`, {
          method: 'POST',
          headers: getAuthHeaders()
      });
  },

  // --- ADMIN COURSES ---
  getAdminCourses: async () => {
      if (isMockMode) return Promise.resolve(MOCK_COURSES);
      return fetchWithFallback('/admin/courses', { headers: getAuthHeaders() });
  },
  
  saveCourse: async (course: any) => {
      if (isMockMode) return Promise.resolve();
      const method = course.id ? 'PUT' : 'POST';
      const url = course.id ? `/admin/courses/${course.id}` : '/admin/courses';
      return fetchWithFallback(url, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(course)
      });
  },
  
  deleteCourse: async (id: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/admin/courses/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
      });
  },
  
  reorderCourses: async (ids: string[]) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback('/admin/courses/reorder', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ orderedIds: ids })
      });
  },
  
  getAdminComments: async () => {
      if (isMockMode) return Promise.resolve(MOCK_COMMENTS);
      return fetchWithFallback('/admin/comments', { headers: getAuthHeaders() });
  },
  
  moderateComment: async (id: string, action: string) => {
      if (isMockMode) return Promise.resolve();
      return fetchWithFallback(`/admin/comments/${id}`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ action })
      });
  },

  // --- ANALYTICS ---
  getWeeklyAnalytics: async () => {
      if (isMockMode) return Promise.resolve([]);
      return fetchWithFallback('/analytics/weekly', { headers: getAuthHeaders() });
  },
  
  getAnalyticsSummary: async () => {
      if (isMockMode) return Promise.resolve({ totalVisits: 0, totalConversions: 0, totalPages: 0 });
      return fetchWithFallback('/analytics/summary', { headers: getAuthHeaders() });
  }
};
