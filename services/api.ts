

import { LandingPage, Lead, GeneratedPageContent, Article, User, Project } from "../types";

// --- HELPER PARA OBTENER BASE URL ---
const getBaseUrl = () => {
    // 1. Prioridad: Variable de entorno VITE_API_URL
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
    
    // 2. Fallback: URL relativa si estamos en el mismo dominio
    return "/api";
};

const API_URL = getBaseUrl();

// --- CONFIGURACIÓN ---
const FORCE_MOCK_DATA = false;
let isOfflineMode = false;

// --- MOCK DATA ---
let mockPages: LandingPage[] = [];
let mockArticles: Article[] = [];
let mockProjects: Project[] = []; // Mock para proyectos

// --- FUNCIÓN FETCH CON TIMEOUT Y RETRY LOGIC ---
const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
    if (FORCE_MOCK_DATA) throw new Error("Force Mock Mode Enabled");
    
    // Normalize URL
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    try {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout: Servidor tardó demasiado")), 15000)
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
        
        if (isOfflineMode) console.log("🟢 Conexión con API restablecida");
        isOfflineMode = false;
        
        return await res.json();
    } catch (error: any) {
        if (!isOfflineMode) {
            console.warn(`⚠️ [API] Fallo conexión a ${url}: ${error.message}. Cambiando a Modo Offline.`);
        }
        isOfflineMode = true;
        throw error;
    }
};

// --- HELPER PARA HEADERS CON TOKEN ---
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

  login: async (email: string, password: string, logCallback?: (msg: string) => void): Promise<User> => {
      const log = (msg: string) => { if (logCallback) logCallback(msg); console.log(msg); };

      log(`[API] Iniciando login para ${email}...`);

      try {
          // Intentar conexión real
          log(`[API] Fetching: /api/login`);
          const user = await fetchWithFallback('/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
          
          log(`[API] Login exitoso. Usuario: ${user.user.name}`);
          
          if (user.token) {
              localStorage.setItem('plataformadeventacom_token', user.token);
          }
          
          return user.user;

      } catch (error: any) {
          log(`[API] Error de conexión: ${error.message}`);
          
          if (email === 'admin@plataformadeventa.com' && password === 'MiPasswordSuperSegura123') {
              log(`[OFFLINE] Credenciales demo detectadas. Activando modo offline de emergencia.`);
              isOfflineMode = true;
              return {
                  id: 'offline-admin',
                  name: 'Admin Offline',
                  email: 'admin@plataformadeventa.com'
              };
          }

          throw error;
      }
  },

  getPages: async (): Promise<LandingPage[]> => {
    try {
        const pages = await fetchWithFallback('/pages', {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return pages.map((p: any) => ({
            ...p,
            id: String(p.id),
            content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
            createdAt: new Date(p.created_at || p.createdAt)
        }));
    } catch (e) {
        return [...mockPages];
    }
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
        await fetchWithFallback(`/pages/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (e) {
        mockPages = mockPages.filter(p => p.id !== id);
    }
  },

  // --- MÉTODOS DE PROYECTOS ---
  getProjects: async (): Promise<Project[]> => {
      try {
          const projects = await fetchWithFallback('/projects', {
              method: 'GET',
              headers: getAuthHeaders()
          });
          return projects.map((p: any) => ({
              ...p,
              id: String(p.id),
              painPoints: typeof p.pain_points === 'string' ? JSON.parse(p.pain_points) : p.pain_points,
              keyBenefits: typeof p.key_benefits === 'string' ? JSON.parse(p.key_benefits) : p.key_benefits,
              affiliateLinks: typeof p.affiliate_links === 'string' ? JSON.parse(p.affiliate_links) : p.affiliate_links,
              targetAudience: p.target_audience,
              brandTone: p.brand_tone,
              productName: p.product_name,
              mainGoal: p.main_goal,
              createdAt: new Date(p.created_at || p.createdAt)
          }));
      } catch (e) {
          console.warn("Usando proyectos mock por error de red");
          return [...mockProjects];
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
      } catch (e) {
          const newProject: Project = { ...project, id: Date.now().toString(), createdAt: new Date() };
          mockProjects.push(newProject);
          return newProject;
      }
  },

  deleteProject: async (id: string): Promise<void> => {
      try {
          await fetchWithFallback(`/projects/${id}`, {
              method: 'DELETE',
              headers: getAuthHeaders()
          });
      } catch (e) {
          mockProjects = mockProjects.filter(p => p.id !== id);
      }
  },

  getLeads: async (): Promise<Lead[]> => {
      try {
          return await fetchWithFallback('/leads', {
              headers: getAuthHeaders()
          });
      } catch (e) {
          return [];
      }
  },

  captureLead: async (pageId: string, name: string, email: string): Promise<void> => {
     try {
        await fetchWithFallback('/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageId, name, email })
        });
     } catch (e) {
         console.log("Lead guardado en Mock:", { pageId, name, email });
     }
  },
  
  getWeeklyAnalytics: async (): Promise<{date: string, visits: number, conversions: number}[]> => {
      try {
          const data = await fetchWithFallback('/analytics/weekly', {
              headers: getAuthHeaders()
          });
          return data;
      } catch (e) {
          console.error("Error fetching analytics", e);
          return [];
      }
  },

  getArticles: async (): Promise<Article[]> => {
      try {
          const articles = await fetchWithFallback('/articles', {
              headers: getAuthHeaders()
          });
          return articles.map((a: any) => ({
              id: a.id.toString(),
              title: a.title,
              description: a.description,
              contentHtml: a.content_html,
              keyword: a.keyword,
              seoScore: a.seo_score,
              createdAt: new Date(a.created_at)
          }));
      } catch (e) {
          return [...mockArticles];
      }
  },

  saveArticle: async (article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> => {
      try {
          const saved = await fetchWithFallback('/articles', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                  title: article.title,
                  description: article.description,
                  content_html: article.contentHtml,
                  keyword: article.keyword,
                  seo_score: article.seoScore
              })
          });
          return { 
              ...article, 
              id: saved.id.toString(), 
              createdAt: new Date() 
          };
      } catch (e) {
          const newArticle: Article = {
              ...article,
              id: Date.now().toString(),
              createdAt: new Date()
          };
          mockArticles.push(newArticle);
          return newArticle;
      }
  },
  
  testConnection: async (): Promise<{ success: boolean; message: string }> => {
      try {
          const data = await fetchWithFallback('/test-db');
          return { success: true, message: data.message };
      } catch (error: any) {
          return { success: false, message: error.message || "Error desconocido" };
      }
  }
};
