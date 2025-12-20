
import { LandingPage, Lead, GeneratedPageContent, Article, User, Project, PlanLimits, Course, Comment, CourseLesson, Plan, SystemLog, UserUsageStats, StrategyJSON, ProjectMasterStrategy, CRMContact, CRMActivity } from "../types";
import { MOCK_USER, MOCK_PROJECTS, MOCK_PAGES, MOCK_ARTICLES, MOCK_LEADS, MOCK_CREDENTIALS, MOCK_COURSES, MOCK_COMMENTS, MOCK_MASTER_STRATEGY, MOCK_CRM_CONTACTS, MOCK_CRM_ACTIVITIES } from "./mockData";

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
let isMockMode = false;

const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: Servidor tardó demasiado")), 90000)
    );
    const fetchPromise = fetch(url, options);
    const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    if (!res.ok) {
        let errorMsg = res.statusText;
        try {
            const errBody = await res.json();
            if (errBody.error) errorMsg = errBody.error;
        } catch(e) {}
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

export const api = {
  getBaseUrl: getBaseUrl,
  enableMockMode: () => { isMockMode = true; },
  disableMockMode: () => { isMockMode = false; },
  isUsingMockData: () => isMockMode,

  login: async (email: string, password: string): Promise<User> => {
      if (isMockMode) {
          if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) return MOCK_USER;
          throw new Error("Credenciales inválidas.");
      }
      const user = await fetchWithFallback('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });
      if (user.token) localStorage.setItem('plataformadeventacom_token', user.token);
      return user.user;
  },

  logout: async (): Promise<void> => {
      if (isMockMode) return;
      try { await fetchWithFallback('/auth/logout', { method: 'POST', headers: getAuthHeaders() }); } catch (e) {}
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
      if (isMockMode) return Promise.resolve({ ...MOCK_USER, ...data });
      return await fetchWithFallback('/auth/profile', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) });
  },

  // NEW: Get active payment provider (Stripe vs Hotmart)
  getActivePaymentProvider: async (): Promise<'stripe' | 'hotmart'> => {
      if (isMockMode) return 'stripe';
      try {
          const data = await fetchWithFallback('/settings/active-provider');
          return data.provider;
      } catch (e) {
          return 'stripe';
      }
  },

  updatePaymentProvider: async (provider: 'stripe' | 'hotmart'): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback('/admin/settings', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ key: 'active_payment_provider', value: provider })
      });
  },

  createCheckoutSession: async (planSlug: string): Promise<{ url: string }> => {
      if (isMockMode) return Promise.resolve({ url: '#' });
      return await fetchWithFallback('/stripe/create-checkout-session', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ planSlug })
      });
  },

  getPages: async (): Promise<LandingPage[]> => {
    if (isMockMode) return Promise.resolve([...MOCK_PAGES]);
    const pages = await fetchWithFallback('/pages', { method: 'GET', headers: getAuthHeaders() });
    return pages.map((p: any) => ({
        ...p,
        id: String(p.id),
        isPublished: !!(p.isPublished || p.is_published),
        content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
        createdAt: new Date(p.created_at || p.createdAt)
    }));
  },

  getPageById: async (id: string): Promise<LandingPage | null> => {
      if (isMockMode) return Promise.resolve(MOCK_PAGES.find(p => p.id === id) || null);
      const pages = await api.getPages();
      return pages.find(p => p.id === id) || null;
  },

  createPage: async (page: LandingPage): Promise<LandingPage> => {
    if (isMockMode) return Promise.resolve({ ...page, id: `mock-${Date.now()}` });
    const data = await fetchWithFallback('/pages', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(page) });
    return { ...page, id: data.id.toString() };
  },

  updatePage: async (page: LandingPage): Promise<LandingPage> => {
    if (isMockMode) return Promise.resolve(page);
    await fetchWithFallback(`/pages/${page.id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(page) });
    return page;
  },

  deletePage: async (id: string): Promise<void> => {
    if (isMockMode) return;
    await fetchWithFallback(`/pages/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getProjects: async (): Promise<Project[]> => {
      if (isMockMode) return Promise.resolve([...MOCK_PROJECTS]);
      const projects = await fetchWithFallback('/projects', { method: 'GET', headers: getAuthHeaders() });
      return projects.map((p: any) => ({ ...p, id: String(p.id), createdAt: new Date(p.created_at || p.createdAt) }));
  },

  getProjectById: async (id: string): Promise<Project | null> => {
      if (isMockMode) return Promise.resolve(MOCK_PROJECTS.find(p => p.id === id) || null);
      const p = await fetchWithFallback(`/projects/${id}`, { method: 'GET', headers: getAuthHeaders() });
      return { ...p, id: String(p.id), createdAt: new Date(p.created_at || p.createdAt) };
  },

  getProjectStrategy: async (id: string): Promise<ProjectMasterStrategy> => {
      if (isMockMode) return Promise.resolve(MOCK_MASTER_STRATEGY);
      const project = await api.getProjectById(id);
      return project?.strategy_json || MOCK_MASTER_STRATEGY;
  },

  createProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
      if (isMockMode) return Promise.resolve({ ...project, id: `mock-p-${Date.now()}`, createdAt: new Date() } as any);
      const data = await fetchWithFallback('/projects', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(project) });
      return { ...project, id: data.id.toString(), createdAt: new Date() } as any;
  },

  updateProject: async (id: string, project: Omit<Project, 'id' | 'createdAt'>): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/projects/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(project) });
  },

  deleteProject: async (id: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getLeads: async (): Promise<Lead[]> => {
      if (isMockMode) return Promise.resolve([...MOCK_LEADS]);
      return await fetchWithFallback('/leads', { headers: getAuthHeaders() });
  },

  getWeeklyAnalytics: async (): Promise<any[]> => {
      if (isMockMode) return Promise.resolve([]);
      return await fetchWithFallback('/analytics/weekly', { headers: getAuthHeaders() });
  },

  getAnalyticsSummary: async (): Promise<any> => {
      if (isMockMode) return Promise.resolve({ totalVisits: 0, totalConversions: 0 });
      return await fetchWithFallback('/analytics/summary', { headers: getAuthHeaders() });
  },

  getArticles: async (): Promise<Article[]> => {
      if (isMockMode) return Promise.resolve([...MOCK_ARTICLES]);
      const articles = await fetchWithFallback('/articles', { headers: getAuthHeaders() });
      return articles.map((a: any) => ({ ...a, id: a.id.toString(), createdAt: new Date(a.created_at) }));
  },

  getArticleById: async (id: string): Promise<Article | null> => {
    if (isMockMode) return Promise.resolve(MOCK_ARTICLES.find(a => a.id === id) || null);
    const a = await fetchWithFallback(`/articles/${id}`, { headers: getAuthHeaders() });
    return { ...a, id: a.id.toString(), createdAt: new Date(a.created_at) };
  },

  saveArticle: async (article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> => {
      if (isMockMode) return Promise.resolve({ ...article, id: `art-${Date.now()}` } as any);
      const saved = await fetchWithFallback('/articles', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(article) });
      return { ...article, id: saved.id.toString() } as any;
  },

  updateArticle: async (id: string, article: Partial<Article>): Promise<void> => {
    if (isMockMode) return;
    await fetchWithFallback(`/articles/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(article) });
  },

  deleteArticle: async (id: string): Promise<void> => {
    if (isMockMode) return;
    await fetchWithFallback(`/articles/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getPublicBlogArticles: async (pageId: string): Promise<Article[]> => {
      if (isMockMode) return Promise.resolve([]);
      return await fetchWithFallback(`/public/pages/${pageId}/blog`);
  },

  getPublicArticle: async (slug: string): Promise<Article | null> => {
      if (isMockMode) return Promise.resolve(null);
      return await fetchWithFallback(`/public/articles/${slug}`);
  },

  testConnection: async () => {
      if (isMockMode) return { success: true, message: "Mock" };
      try { const data = await fetchWithFallback('/debug/db-status'); return { success: data.status === 'online', message: data.server_version }; }
      catch (e: any) { return { success: false, message: e.message }; }
  },

  getUsers: async (): Promise<User[]> => {
      if (isMockMode) return Promise.resolve([MOCK_USER]);
      return await fetchWithFallback('/admin/users', { headers: getAuthHeaders() });
  },

  updateUser: async (id: string, data: any): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/users/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) });
  },

  deleteUser: async (id: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getAdminUserResources: async (userId: string, type: string): Promise<any[]> => {
      if (isMockMode) return Promise.resolve([]);
      return await fetchWithFallback(`/admin/users/${userId}/resources?type=${type}`, { headers: getAuthHeaders() });
  },

  getUserPayments: async (userId: string): Promise<any[]> => {
      if (isMockMode) return Promise.resolve([]);
      return await fetchWithFallback(`/admin/users/${userId}/payments`, { headers: getAuthHeaders() });
  },

  getSystemLogs: async (page: number, filters: any): Promise<SystemLog[]> => {
      if (isMockMode) return Promise.resolve([]);
      let query = `?page=${page}`;
      if (filters.action) query += `&action=${filters.action}`;
      if (filters.search) query += `&search=${filters.search}`;
      return await fetchWithFallback(`/admin/logs${query}`, { headers: getAuthHeaders() });
  },

  getUserUsageStats: async (userId: string): Promise<UserUsageStats> => {
      if (isMockMode) return Promise.resolve({ projects: 0, landings: 0, articles: 0 });
      return await fetchWithFallback(`/admin/users/${userId}/stats`, { headers: getAuthHeaders() });
  },

  getCoursesList: async () => {
      if (isMockMode) return Promise.resolve(MOCK_COURSES);
      return await fetchWithFallback('/courses', { headers: getAuthHeaders() });
  },

  getCourseBySlug: async (slug: string) => {
      if (isMockMode) return Promise.resolve(MOCK_COURSES.find(c => c.slug === slug));
      return await fetchWithFallback(`/courses/${slug}`, { headers: getAuthHeaders() });
  },

  getModuleLessons: async (id: string) => {
      if (isMockMode) return Promise.resolve([]);
      return await fetchWithFallback(`/modules/${id}/lessons`, { headers: getAuthHeaders() });
  },

  getAdminCourses: async (): Promise<Course[]> => {
      if (isMockMode) return Promise.resolve(MOCK_COURSES);
      return await fetchWithFallback('/admin/courses', { headers: getAuthHeaders() });
  },

  saveCourse: async (course: Course) => {
      if (isMockMode) return Promise.resolve(course);
      const method = course.id ? 'PUT' : 'POST';
      const endpoint = course.id ? `/admin/courses/${course.id}` : '/admin/courses';
      return await fetchWithFallback(endpoint, { method, headers: getAuthHeaders(), body: JSON.stringify(course) });
  },

  reorderCourses: async (orderedIds: string[]) => {
      if (isMockMode) return;
      await fetchWithFallback('/admin/courses/reorder', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ orderedIds }) });
  },

  deleteCourse: async (id: string) => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/courses/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getAdminComments: async (): Promise<Comment[]> => {
      if (isMockMode) return Promise.resolve(MOCK_COMMENTS);
      return await fetchWithFallback('/admin/comments', { headers: getAuthHeaders() });
  },

  moderateComment: async (id: string, action: string) => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/comments/${id}`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ action }) });
  },

  getComments: async (lessonId: string) => {
      if (isMockMode) return Promise.resolve(MOCK_COMMENTS.filter(c => c.lessonId === lessonId));
      return await fetchWithFallback(`/lessons/${lessonId}/comments`, { headers: getAuthHeaders() });
  },

  postComment: async (lessonId: string, content: string, parentId?: string) => {
      if (isMockMode) return;
      await fetchWithFallback('/comments', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ lessonId, content, parentId }) });
  },

  likeComment: async (id: string) => {
      if (isMockMode) return;
      await fetchWithFallback(`/comments/${id}/like`, { method: 'POST', headers: getAuthHeaders() });
  },

  getLoginRedirect: async () => {
      if (isMockMode) return "/dashboard";
      try { const data = await fetchWithFallback('/settings/redirect'); return data.url; } catch(e) { return "/dashboard"; }
  },

  updateLoginRedirect: async (url: string) => {
      if (isMockMode) return;
      await fetchWithFallback('/admin/settings', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ key: 'after_login_url', value: url }) });
  },

  getPlans: async (): Promise<Plan[]> => {
      if (isMockMode) return Promise.resolve([]);
      return await fetchWithFallback('/admin/plans', { headers: getAuthHeaders() });
  },

  getPublicPlans: async (): Promise<Plan[]> => {
      if (isMockMode) return Promise.resolve([]);
      return await fetchWithFallback('/public/plans');
  },

  savePlan: async (plan: Plan) => {
      if (isMockMode) return;
      const method = plan.id ? 'PUT' : 'POST';
      const endpoint = plan.id ? `/admin/plans/${plan.id}` : '/admin/plans';
      await fetchWithFallback(endpoint, { method, headers: getAuthHeaders(), body: JSON.stringify(plan) });
  },

  deletePlan: async (id: string) => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/plans/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getContacts: async (): Promise<CRMContact[]> => {
      if (isMockMode) return Promise.resolve(MOCK_CRM_CONTACTS);
      const data = await fetchWithFallback('/crm/contacts', { headers: getAuthHeaders() });
      return data.map((c: any) => ({ ...c, id: c.id.toString(), createdAt: new Date(c.created_at), updatedAt: new Date(c.updated_at) }));
  },

  createContact: async (contact: any) => {
      if (isMockMode) return Promise.resolve({ ...contact, id: 'mock', createdAt: new Date(), updatedAt: new Date() });
      const res = await fetchWithFallback('/crm/contacts', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(contact) });
      return { ...contact, id: res.id.toString(), createdAt: new Date(), updatedAt: new Date() };
  },

  updateContact: async (contact: CRMContact) => {
      if (isMockMode) return;
      await fetchWithFallback(`/crm/contacts/${contact.id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(contact) });
  },

  deleteContact: async (id: string) => {
      if (isMockMode) return;
      await fetchWithFallback(`/crm/contacts/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getContactHistory: async (id: string) => {
      if (isMockMode) return Promise.resolve(MOCK_CRM_ACTIVITIES.filter(a => a.contactId === id));
      const data = await fetchWithFallback(`/crm/contacts/${id}/history`, { headers: getAuthHeaders() });
      return data.map((a: any) => ({ ...a, id: a.id.toString(), contactId: a.contact_id.toString(), createdAt: new Date(a.created_at) }));
  },

  addContactNote: async (id: string, content: string) => {
      if (isMockMode) return;
      await fetchWithFallback(`/crm/contacts/${id}/notes`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ content }) });
  },

  submitLead: async (data: any) => {
      if (isMockMode) return;
      await fetchWithFallback('/public/leads/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  }
};