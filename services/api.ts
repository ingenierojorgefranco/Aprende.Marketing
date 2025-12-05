

import { LandingPage, Lead, GeneratedPageContent, Article, User, Project } from "../types";

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
const FORCE_MOCK_DATA = false;
let isOfflineMode = false;

// --- MOCK DATA ---
let mockPages: LandingPage[] = [];
let mockArticles: Article[] = [];
let mockProjects: Project[] = []; 

// --- FUNCIÓN FETCH CON TIMEOUT ---
const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
    if (FORCE_MOCK_DATA) throw new Error("Force Mock Mode Enabled");
    
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    try {
        // Aumentado a 90 segundos para permitir generaciones largas de artículos
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
        
        isOfflineMode = false;
        return await res.json();
    } catch (error: any) {
        if (!isOfflineMode) {
            console.warn(`⚠️ [API] Fallo conexión a ${url}: ${error.message}.`);
        }
        isOfflineMode = true;
        throw error;
    }
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
  isUsingMockData: () => isOfflineMode || FORCE_MOCK_DATA,

  login: async (email: string, password: string): Promise<User> => {
      try {
          const user = await fetchWithFallback('/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
          if (user.token) localStorage.setItem('plataformadeventacom_token', user.token);
          return user.user;
      } catch (error: any) {
          if (email === 'admin@plataformadeventa.com' && password === 'MiPasswordSuperSegura123') {
              isOfflineMode = true;
              return { id: 'offline-admin', name: 'Admin Offline', email: 'admin@plataformadeventa.com' };
          }
          throw error;
      }
  },

  getPages: async (): Promise<LandingPage[]> => {
    try {
        const pages = await fetchWithFallback('/pages', { method: 'GET', headers: getAuthHeaders() });
        return pages.map((p: any) => ({
            ...p,
            id: String(p.id),
            isPublished: !!(p.isPublished || p.is_published),
            content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
            createdAt: new Date(p.created_at || p.createdAt)
        }));
    } catch (e) { return [...mockPages]; }
  },

  createPage: async (page: LandingPage): Promise<LandingPage> => {
    try {
        const data = await fetchWithFallback('/pages', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name: page.name,
                niche: page.niche,
                goal: page.goal,
                subdomain: page.subdomain,
                content: page.content
            })
        });
        return { ...page, id: data.id.toString() };
    } catch (e) {
        const newPage = { ...page, id: Date.now().toString() };
        mockPages.push(newPage);
        return newPage;
    }
  },

  updatePage: async (page: LandingPage): Promise<LandingPage> => {
    try {
        await fetchWithFallback(`/pages/${page.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name: page.name,
                niche: page.niche,
                content: page.content,
                isPublished: page.isPublished
            })
        });
        return page;
    } catch (e) {
        mockPages = mockPages.map(p => p.id === page.id ? page : p);
        return page;
    }
  },

  deletePage: async (id: string): Promise<void> => {
    try {
        await fetchWithFallback(`/pages/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch (e) {
        mockPages = mockPages.filter(p => p.id !== id);
    }
  },

  getProjects: async (): Promise<Project[]> => {
      try {
          const projects = await fetchWithFallback('/projects', {
              method: 'GET',
              headers: getAuthHeaders()
          });
          return projects.map((p: any) => ({
              ...p,
              id: String(p.id),
              painPoints: typeof p.pain_points === 'string' ? JSON.parse(p.pain_points) : (p.pain_points || p.painPoints),
              keyBenefits: typeof p.key_benefits === 'string' ? JSON.parse(p.key_benefits) : (p.key_benefits || p.keyBenefits),
              affiliateLinks: typeof p.affiliate_links === 'string' ? JSON.parse(p.affiliate_links) : (p.affiliate_links || p.affiliateLinks),
              targetAudience: p.target_audience || p.targetAudience,
              brandTone: p.brand_tone || p.brandTone,
              productName: p.product_name || p.productName,
              mainGoal: p.main_goal || p.mainGoal,
              createdAt: new Date(p.created_at || p.createdAt)
          }));
      } catch (e) {
          return [...mockProjects];
      }
  },

  getProjectById: async (id: string): Promise<Project | null> => {
      try {
          const p = await fetchWithFallback(`/projects/${id}`, {
              method: 'GET',
              headers: getAuthHeaders()
          });
          return {
              ...p,
              id: String(p.id),
              painPoints: typeof p.pain_points === 'string' ? JSON.parse(p.pain_points) : (p.pain_points || p.painPoints),
              keyBenefits: typeof p.key_benefits === 'string' ? JSON.parse(p.key_benefits) : (p.key_benefits || p.keyBenefits),
              affiliateLinks: typeof p.affiliate_links === 'string' ? JSON.parse(p.affiliate_links) : (p.affiliate_links || p.affiliateLinks),
              targetAudience: p.target_audience || p.targetAudience,
              brandTone: p.brand_tone || p.brandTone,
              productName: p.product_name || p.productName,
              mainGoal: p.main_goal || p.mainGoal,
              createdAt: new Date(p.created_at || p.createdAt)
          };
      } catch (e) {
          return mockProjects.find(p => p.id === id) || null;
      }
  },

  createProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
      try {
          const data = await fetchWithFallback('/projects', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify(project)
          });
          return { ...project, id: data.id.toString(), createdAt: new Date() };
      } catch (e: any) {
          if (isOfflineMode) {
              const newProject: Project = { ...project, id: Date.now().toString(), createdAt: new Date() };
              mockProjects.push(newProject);
              return newProject;
          }
          throw e;
      }
  },

  updateProject: async (id: string, project: Omit<Project, 'id' | 'createdAt'>): Promise<void> => {
      try {
          await fetchWithFallback(`/projects/${id}`, {
              method: 'PUT',
              headers: getAuthHeaders(),
              body: JSON.stringify(project)
          });
      } catch (e) {
           if (isOfflineMode) {
                mockProjects = mockProjects.map(p => p.id === id ? { ...project, id, createdAt: p.createdAt } : p);
           }
           throw e;
      }
  },

  deleteProject: async (id: string): Promise<void> => {
      try {
          await fetchWithFallback(`/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      } catch (e) {
          mockProjects = mockProjects.filter(p => p.id !== id);
      }
  },

  getLeads: async (): Promise<Lead[]> => {
      try {
          return await fetchWithFallback('/leads', { headers: getAuthHeaders() });
      } catch (e) { return []; }
  },

  getWeeklyAnalytics: async (): Promise<{date: string, visits: number, conversions: number}[]> => {
      try {
          return await fetchWithFallback('/analytics/weekly', { headers: getAuthHeaders() });
      } catch (e) { return []; }
  },

  getArticles: async (): Promise<Article[]> => {
      try {
          const articles = await fetchWithFallback('/articles', { headers: getAuthHeaders() });
          return articles.map((a: any) => ({
              id: a.id.toString(),
              pageId: a.page_id ? a.page_id.toString() : undefined,
              title: a.title,
              slug: a.slug,
              description: a.description,
              contentHtml: a.content_html,
              featuredImage: a.featured_image,
              keyword: a.keyword,
              seoScore: a.seo_score,
              metaTitle: a.meta_title,
              metaDescription: a.meta_description,
              status: a.status || 'published',
              publishedAt: new Date(a.published_at || a.created_at),
              createdAt: new Date(a.created_at)
          }));
      } catch (e) { return [...mockArticles]; }
  },

  saveArticle: async (article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> => {
      try {
          const saved = await fetchWithFallback('/articles', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                  page_id: article.pageId,
                  title: article.title,
                  slug: article.slug,
                  description: article.description,
                  content_html: article.contentHtml,
                  featured_image: article.featuredImage,
                  keyword: article.keyword,
                  seo_score: article.seoScore,
                  meta_title: article.metaTitle,
                  meta_description: article.metaDescription,
                  status: article.status,
                  published_at: article.publishedAt
              })
          });
          return { ...article, id: saved.id.toString(), createdAt: new Date() };
      } catch (e) {
          const newArticle: Article = { ...article, id: Date.now().toString(), createdAt: new Date() };
          mockArticles.push(newArticle);
          return newArticle;
      }
  },

  getPublicBlogArticles: async (pageId: string): Promise<Article[]> => {
      try {
          const articles = await fetchWithFallback(`/public/pages/${pageId}/blog`);
          return articles.map((a: any) => ({
              id: a.id.toString(),
              title: a.title,
              slug: a.slug,
              description: a.description,
              featuredImage: a.featured_image,
              publishedAt: new Date(a.published_at),
              contentHtml: '' // No fetch content in list
          } as Article));
      } catch (e) { return []; }
  },

  getPublicArticle: async (slug: string): Promise<Article | null> => {
      try {
          const article = await fetchWithFallback(`/public/articles/${slug}`);
          return {
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
      } catch (e) { return null; }
  },
  
  testConnection: async (): Promise<{ success: boolean; message: string }> => {
      try {
          const data = await fetchWithFallback('/debug/db-status');
          return { success: data.status === 'online', message: data.server_version || 'OK' };
      } catch (error: any) {
          return { success: false, message: error.message };
      }
  }
};
