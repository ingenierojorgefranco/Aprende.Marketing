import { LandingPage, Lead, GeneratedPageContent, Article, User, Project, PlanLimits, Course, Comment, CourseLesson, Plan, SystemLog, UserUsageStats, StrategyJSON, ProjectMasterStrategy, CRMContact, CRMActivity } from "../types";
import { MOCK_USER, MOCK_PROJECTS, MOCK_PAGES, MOCK_ARTICLES, MOCK_LEADS, MOCK_CREDENTIALS, MOCK_COURSES, MOCK_COMMENTS, MOCK_MASTER_STRATEGY, MOCK_CRM_CONTACTS, MOCK_CRM_ACTIVITIES } from "./mockData";

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

let localPages: LandingPage[] = [...MOCK_PAGES];
let localArticles: Article[] = [...MOCK_ARTICLES];
let localProjects: Project[] = [...MOCK_PROJECTS];
let localCrmContacts: CRMContact[] = [...MOCK_CRM_CONTACTS];
let localCrmActivities: CRMActivity[] = [...MOCK_CRM_ACTIVITIES];
// Added missing localCourses variable to support course methods in mock mode
let localCourses: Course[] = [...MOCK_COURSES];

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
  getBaseUrl,
  enableMockMode: () => { isMockMode = true; },
  disableMockMode: () => { isMockMode = false; },
  isUsingMockData: () => isMockMode,

  login: async (email: string, password: string): Promise<User> => {
      if (isMockMode) {
          await new Promise(resolve => setTimeout(resolve, 800));
          if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) return MOCK_USER;
          else throw new Error("Credenciales inválidas para el Modo Offline Demo.");
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
      if (isMockMode) return { ...MOCK_USER, ...data };
      return await fetchWithFallback('/auth/profile', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },

  createCheckoutSession: async (planSlug: string): Promise<{ url: string }> => {
      if (isMockMode) return { url: '#' };
      return await fetchWithFallback('/stripe/create-checkout-session', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ planSlug })
      });
  },

  getPages: async (): Promise<LandingPage[]> => {
    if (isMockMode) return [...localPages];
    const pages = await fetchWithFallback('/pages', { method: 'GET', headers: getAuthHeaders() });
    return pages.map((p: any) => ({
        ...p,
        id: String(p.id),
        isPublished: !!(p.isPublished || p.is_published),
        content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
        createdAt: new Date(p.created_at || p.createdAt)
    }));
  },

  // Added missing getPageById method to fix error in App.tsx
  getPageById: async (id: string): Promise<LandingPage | null> => {
    if (isMockMode) return localPages.find(p => p.id === id) || null;
    try {
        const p = await fetchWithFallback(`/pages/${id}`, { method: 'GET', headers: getAuthHeaders() });
        return {
            ...p,
            id: String(p.id),
            isPublished: !!(p.isPublished || p.is_published),
            content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
            createdAt: new Date(p.created_at || p.createdAt)
        };
    } catch (e) { return null; }
  },

  createPage: async (page: LandingPage): Promise<LandingPage> => {
    if (isMockMode) {
        const newPage = { ...page, id: `mock-page-${Date.now()}`, createdAt: new Date() };
        localPages.unshift(newPage);
        return newPage;
    }
    const data = await fetchWithFallback('/pages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...page, projectId: page.projectId })
    });
    return { ...page, id: data.id.toString() };
  },

  updatePage: async (page: LandingPage): Promise<LandingPage> => {
    if (isMockMode) {
        localPages = localPages.map(p => p.id === page.id ? page : p);
        return page;
    }
    await fetchWithFallback(`/pages/${page.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(page)
    });
    return page;
  },

  deletePage: async (id: string): Promise<void> => {
    if (isMockMode) { localPages = localPages.filter(p => p.id !== id); return; }
    await fetchWithFallback(`/pages/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getProjects: async (): Promise<Project[]> => {
      if (isMockMode) return [...localProjects];
      const projects = await fetchWithFallback('/projects', { method: 'GET', headers: getAuthHeaders() });
      return projects.map((p: any) => ({
          ...p,
          id: String(p.id),
          painPoints: typeof p.pain_points === 'string' ? JSON.parse(p.pain_points) : p.pain_points,
          keyBenefits: typeof p.key_benefits === 'string' ? JSON.parse(p.key_benefits) : p.key_benefits,
          affiliateLinks: typeof p.affiliate_links === 'string' ? JSON.parse(p.affiliate_links) : p.affiliate_links,
          strategy_json: typeof p.strategy_json === 'string' ? JSON.parse(p.strategy_json) : p.strategy_json,
          createdAt: new Date(p.created_at || p.createdAt)
      }));
  },

  getProjectById: async (id: string): Promise<Project | null> => {
      if (isMockMode) return localProjects.find(p => p.id === id) || null;
      try {
          const p = await fetchWithFallback(`/projects/${id}`, { method: 'GET', headers: getAuthHeaders() });
          return {
              ...p,
              id: String(p.id),
              painPoints: typeof p.pain_points === 'string' ? JSON.parse(p.pain_points) : p.pain_points,
              keyBenefits: typeof p.key_benefits === 'string' ? JSON.parse(p.key_benefits) : p.key_benefits,
              affiliateLinks: typeof p.affiliate_links === 'string' ? JSON.parse(p.affiliate_links) : p.affiliate_links,
              strategy_json: typeof p.strategy_json === 'string' ? JSON.parse(p.strategy_json) : p.strategy_json,
              createdAt: new Date(p.created_at || p.createdAt)
          };
      } catch (e) { return null; }
  },

  previewProjectStrategy: async (projectData: any): Promise<ProjectMasterStrategy> => {
      if (isMockMode) return MOCK_MASTER_STRATEGY;
      return await fetchWithFallback('/projects/generate-strategy-preview', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(projectData)
      });
  },

  getProjectStrategy: async (id: string): Promise<ProjectMasterStrategy> => {
      // Prioridad 1: Sesión temporal (Previsualización Wizard)
      const preview = sessionStorage.getItem(`preview_strategy_${id}`);
      if (preview) return JSON.parse(preview);

      if (isMockMode) return MOCK_MASTER_STRATEGY;
      const project = await api.getProjectById(id);
      return project?.strategy_json || MOCK_MASTER_STRATEGY;
  },

  createProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
      if (isMockMode) {
          const newProject: Project = { ...project, id: `mock-proj-${Date.now()}`, createdAt: new Date() };
          localProjects.unshift(newProject);
          return newProject;
      }
      const data = await fetchWithFallback('/projects', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(project)
      });
      return { ...project, id: data.id.toString(), createdAt: new Date() };
  },

  updateProject: async (id: string, project: Omit<Project, 'id' | 'createdAt'>): Promise<void> => {
      if (isMockMode) {
          localProjects = localProjects.map(p => p.id === id ? { ...project, id, createdAt: p.createdAt } : p);
          return;
      }
      await fetchWithFallback(`/projects/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(project)
      });
  },

  deleteProject: async (id: string): Promise<void> => {
      if (isMockMode) { localProjects = localProjects.filter(p => p.id !== id); return; }
      await fetchWithFallback(`/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getWeeklyAnalytics: async (): Promise<any[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback('/analytics/weekly', { headers: getAuthHeaders() });
  },

  getAnalyticsSummary: async (): Promise<any> => {
      if (isMockMode) return { totalVisits: 0, totalConversions: 0, totalPages: 0, totalArticles: 0 };
      return await fetchWithFallback('/analytics/summary', { headers: getAuthHeaders() });
  },

  getArticles: async (): Promise<Article[]> => {
      if (isMockMode) return [...localArticles];
      const articles = await fetchWithFallback('/articles', { headers: getAuthHeaders() });
      return articles.map((a: any) => ({ ...a, id: String(a.id), createdAt: new Date(a.created_at) }));
  },

  getArticleById: async (id: string): Promise<Article | null> => {
      if (isMockMode) return localArticles.find(a => a.id === id) || null;
      try {
          const a = await fetchWithFallback(`/articles/${id}`, { headers: getAuthHeaders() });
          return { ...a, id: String(a.id), createdAt: new Date(a.created_at) };
      } catch (e) { return null; }
  },

  saveArticle: async (article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> => {
      if (isMockMode) {
          const newArticle = { ...article, id: `mock-art-${Date.now()}`, createdAt: new Date() };
          localArticles.unshift(newArticle as any);
          return newArticle as any;
      }
      const saved = await fetchWithFallback('/articles', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(article)
      });
      return { ...article, id: saved.id.toString(), createdAt: new Date() } as any;
  },

  // Added missing updateArticle method to fix error in App.tsx
  updateArticle: async (id: string, article: any): Promise<void> => {
      if (isMockMode) {
          localArticles = localArticles.map(a => a.id === id ? { ...a, ...article } : a);
          return;
      }
      await fetchWithFallback(`/articles/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(article)
      });
  },

  // Added missing deleteArticle method to fix error in ArticlesList.tsx
  deleteArticle: async (id: string): Promise<void> => {
      if (isMockMode) { localArticles = localArticles.filter(a => a.id !== id); return; }
      await fetchWithFallback(`/articles/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getUsers: async (): Promise<User[]> => {
      if (isMockMode) return [MOCK_USER];
      return await fetchWithFallback('/admin/users', { headers: getAuthHeaders() });
  },

  updateUser: async (id: string, data: any): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/users/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },

  deleteUser: async (id: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getAdminUserResources: async (userId: string, type: string): Promise<any[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback(`/admin/users/${userId}/resources?type=${type}`, { headers: getAuthHeaders() });
  },

  getUserUsageStats: async (userId: string): Promise<UserUsageStats> => {
      if (isMockMode) return { projects: 0, landings: 0, articles: 0 };
      return await fetchWithFallback(`/admin/users/${userId}/stats`, { headers: getAuthHeaders() });
  },

  getUserPayments: async (userId: string): Promise<any[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback(`/admin/users/${userId}/payments`, { headers: getAuthHeaders() });
  },

  getSystemLogs: async (page: number, filters: any): Promise<SystemLog[]> => {
      if (isMockMode) return [];
      let query = `?page=${page}`;
      if (filters.action) query += `&action=${filters.action}`;
      if (filters.search) query += `&search=${filters.search}`;
      return await fetchWithFallback(`/admin/logs${query}`, { headers: getAuthHeaders() });
  },

  getCoursesList: async (): Promise<any[]> => {
      if (isMockMode) return localCourses.map(c => ({ id: c.id, title: c.title, slug: c.slug }));
      return await fetchWithFallback('/courses', { headers: getAuthHeaders() });
  },

  getCourseBySlug: async (slug: string): Promise<any> => {
      if (isMockMode) return localCourses.find(c => c.slug === slug) || null;
      return await fetchWithFallback(`/courses/${slug}`, { headers: getAuthHeaders() });
  },

  getModuleLessons: async (moduleId: string): Promise<CourseLesson[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback(`/modules/${moduleId}/lessons`, { headers: getAuthHeaders() });
  },

  getAdminCourses: async (): Promise<Course[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback('/admin/courses', { headers: getAuthHeaders() });
  },

  saveCourse: async (course: Course): Promise<Course> => {
      if (isMockMode) return course;
      const method = course.id ? 'PUT' : 'POST';
      const endpoint = course.id ? `/admin/courses/${course.id}` : '/admin/courses';
      return await fetchWithFallback(endpoint, { method, headers: getAuthHeaders(), body: JSON.stringify(course) });
  },

  reorderCourses: async (orderedIds: string[]): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback('/admin/courses/reorder', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ orderedIds }) });
  },

  deleteCourse: async (id: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/courses/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getAdminComments: async (): Promise<Comment[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback('/admin/comments', { headers: getAuthHeaders() });
  },

  moderateComment: async (id: string, action: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/comments/${id}`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ action }) });
  },

  getComments: async (lessonId: string): Promise<any[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback(`/lessons/${lessonId}/comments`, { headers: getAuthHeaders() });
  },

  postComment: async (lessonId: string, content: string, parentId?: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback('/comments', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ lessonId, content, parentId }) });
  },

  likeComment: async (commentId: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/comments/${commentId}/like`, { method: 'POST', headers: getAuthHeaders() });
  },

  getLoginRedirect: async (): Promise<string> => {
      if (isMockMode) return "/dashboard";
      try {
          const data = await fetchWithFallback('/settings/redirect');
          return data.url;
      } catch (e) { return "/dashboard"; }
  },

  updateLoginRedirect: async (url: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback('/admin/settings', { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ key: 'after_login_url', value: url }) });
  },

  getPlans: async (): Promise<Plan[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback('/admin/plans', { headers: getAuthHeaders() });
  },

  getPublicPlans: async (): Promise<Plan[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback('/public/plans');
  },

  savePlan: async (plan: Plan): Promise<void> => {
      if (isMockMode) return;
      const method = plan.id ? 'PUT' : 'POST';
      const endpoint = plan.id ? `/admin/plans/${plan.id}` : '/admin/plans';
      await fetchWithFallback(endpoint, { method, headers: getAuthHeaders(), body: JSON.stringify(plan) });
  },

  deletePlan: async (id: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/admin/plans/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getContacts: async (): Promise<CRMContact[]> => {
      if (isMockMode) return [...localCrmContacts];
      return await fetchWithFallback('/crm/contacts', { headers: getAuthHeaders() });
  },

  createContact: async (contact: any): Promise<CRMContact> => {
      if (isMockMode) return { ...contact, id: 'mock-' + Date.now(), createdAt: new Date(), updatedAt: new Date() };
      const res = await fetchWithFallback('/crm/contacts', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(contact) });
      return { ...contact, id: res.id.toString(), createdAt: new Date(), updatedAt: new Date() };
  },

  updateContact: async (contact: CRMContact): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/crm/contacts/${contact.id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(contact) });
  },

  deleteContact: async (id: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/crm/contacts/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getContactHistory: async (contactId: string): Promise<CRMActivity[]> => {
      if (isMockMode) return [];
      return await fetchWithFallback(`/crm/contacts/${contactId}/history`, { headers: getAuthHeaders() });
  },

  addContactNote: async (contactId: string, content: string): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback(`/crm/contacts/${contactId}/notes`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ content }) });
  },

  // Added missing getPublicBlogArticles method to fix errors in LivePage.tsx and SingleBlog.tsx
  getPublicBlogArticles: async (pageId: string): Promise<Article[]> => {
      if (isMockMode) return localArticles.filter(a => a.pageId === pageId && a.status === 'published');
      const articles = await fetchWithFallback(`/public/pages/${pageId}/articles`, { method: 'GET' });
      return articles.map((a: any) => ({ ...a, id: String(a.id), createdAt: new Date(a.created_at) }));
  },

  // Added missing getPublicArticle method to fix error in SingleBlog.tsx
  getPublicArticle: async (slug: string): Promise<Article | null> => {
      if (isMockMode) return localArticles.find(a => a.slug === slug) || null;
      try {
          const a = await fetchWithFallback(`/public/articles/${slug}`, { method: 'GET' });
          return { ...a, id: String(a.id), createdAt: new Date(a.created_at) };
      } catch (e) { return null; }
  },

  submitLead: async (data: any): Promise<void> => {
      if (isMockMode) return;
      await fetchWithFallback('/public/leads/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  }
};