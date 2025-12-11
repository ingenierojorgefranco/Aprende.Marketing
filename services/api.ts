import { LandingPage, Lead, GeneratedPageContent, Article, User, Project, PlanLimits, Course, Comment, CourseLesson, Plan } from "../types";
import { MOCK_USER, MOCK_PROJECTS, MOCK_PAGES, MOCK_ARTICLES, MOCK_LEADS, MOCK_CREDENTIALS, MOCK_COURSES, MOCK_COMMENTS } from "./mockData";

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

// --- FUNCIÓN FETCH CON TIMEOUT ---
const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

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
  
  // Activa el modo de pruebas con datos locales
  enableMockMode: () => {
      isMockMode = true;
      console.log("🟡 MODO MOCK ACTIVADO: Usando datos locales de prueba.");
  },

  // Desactiva el modo de pruebas
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
      return user.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
      if (isMockMode) {
          MOCK_USER.name = data.name || MOCK_USER.name;
          MOCK_USER.email = data.email || MOCK_USER.email;
          MOCK_USER.avatarUrl = data.avatarUrl || MOCK_USER.avatarUrl;
          MOCK_USER.birthDate = data.birthDate || MOCK_USER.birthDate;
          return Promise.resolve({ ...MOCK_USER });
      }
      return await fetchWithFallback('/auth/profile', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },

  getPages: async (): Promise<LandingPage[]> => {
    if (isMockMode) return Promise.resolve([...localPages]);
    
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
      if (isMockMode) {
          const page = localPages.find(p => p.id === id);
          return page ? Promise.resolve(page) : Promise.resolve(null);
      }
      const pages = await api.getPages();
      return pages.find(p => p.id === id) || null;
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
            content: page.content
        })
    });
    return { ...page, id: data.id.toString() };
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
            isPublished: page.isPublished
        })
    });
    return page;
  },

  deletePage: async (id: string): Promise<void> => {
    if (isMockMode) {
        localPages = localPages.filter(p => p.id !== id);
        return Promise.resolve();
    }
    await fetchWithFallback(`/pages/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getProjects: async (): Promise<Project[]> => {
      if (isMockMode) return Promise.resolve([...localProjects]);

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
  },

  getProjectById: async (id: string): Promise<Project | null> => {
      if (isMockMode) {
          const proj = localProjects.find(p => p.id === id);
          return proj ? Promise.resolve(proj) : Promise.resolve(null);
      }

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
      return { ...project, id: data.id.toString(), createdAt: new Date() };
  },

  updateProject: async (id: string, project: Omit<Project, 'id' | 'createdAt'>): Promise<void> => {
      if (isMockMode) {
          localProjects = localProjects.map(p => p.id === id ? { ...project, id, createdAt: p.createdAt } : p);
          return Promise.resolve();
      }

      await fetchWithFallback(`/projects/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(project)
      });
  },

  deleteProject: async (id: string): Promise<void> => {
      if (isMockMode) {
          localProjects = localProjects.filter(p => p.id !== id);
          return Promise.resolve();
      }
      await fetchWithFallback(`/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getLeads: async (): Promise<Lead[]> => {
      if (isMockMode) return Promise.resolve([...localLeads]);
      return await fetchWithFallback('/leads', { headers: getAuthHeaders() });
  },

  getWeeklyAnalytics: async (): Promise<{date: string, visits: number, conversions: number}[]> => {
      if (isMockMode) {
          // Generar datos dummy para la gráfica
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
      return await fetchWithFallback('/analytics/weekly', { headers: getAuthHeaders() });
  },

  getAnalyticsSummary: async (): Promise<{totalVisits: number, totalConversions: number, totalPages: number, totalArticles: number}> => {
      if (isMockMode) {
          // Calculate from local data
          const totalVisits = localPages.reduce((acc, p) => acc + p.visits, 0);
          const totalConversions = localPages.reduce((acc, p) => acc + p.conversions, 0);
          return Promise.resolve({
              totalVisits,
              totalConversions,
              totalPages: localPages.length,
              totalArticles: localArticles.length
          });
      }
      return await fetchWithFallback('/analytics/summary', { headers: getAuthHeaders() });
  },

  getArticles: async (): Promise<Article[]> => {
      if (isMockMode) return Promise.resolve([...localArticles]);

      const articles = await fetchWithFallback('/articles', { headers: getAuthHeaders() });
      return articles.map((a: any) => ({
          id: a.id.toString(),
          pageId: a.page_id ? a.page_id.toString() : undefined,
          pageSubdomain: a.page_subdomain,
          pageName: a.page_name,
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
  },

  getArticleById: async (id: string): Promise<Article | null> => {
    if (isMockMode) {
        const art = localArticles.find(a => a.id === id);
        return art ? Promise.resolve(art) : Promise.resolve(null);
    }

    try {
        const a = await fetchWithFallback(`/articles/${id}`, { headers: getAuthHeaders() });
        return {
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
        };
    } catch (e) { return null; }
  },

  saveArticle: async (article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> => {
      if (isMockMode) {
          const newArticle: Article = { ...article, id: `mock-art-${Date.now()}`, createdAt: new Date() };
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
  },

  deleteArticle: async (id: string): Promise<void> => {
    if (isMockMode) {
        localArticles = localArticles.filter(a => a.id !== id);
        return Promise.resolve();
    }
    await fetchWithFallback(`/articles/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  getPublicBlogArticles: async (pageId: string): Promise<Article[]> => {
      if (isMockMode) {
          return Promise.resolve(localArticles.filter(a => a.pageId === pageId));
      }
      const articles = await fetchWithFallback(`/public/pages/${pageId}/blog`);
      return articles.map((a: any) => ({
          id: a.id.toString(),
          title: a.title,
          slug: a.slug,
          description: a.description,
          metaDescription: a.meta_description, 
          featuredImage: a.featured_image,
          publishedAt: new Date(a.published_at),
          contentHtml: '' 
      } as Article));
  },

  getPublicArticle: async (slug: string): Promise<Article | null> => {
      if (isMockMode) {
          const art = localArticles.find(a => a.slug === slug);
          return art ? Promise.resolve(art) : Promise.resolve(null);
      }
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
      return await fetchWithFallback('/admin/users', { headers: getAuthHeaders() });
  },

  updateUser: async (id: string, data: { role: string, planLimits: PlanLimits, isActive: boolean }): Promise<void> => {
      if (isMockMode) return Promise.resolve();
      await fetchWithFallback(`/admin/users/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
      });
  },

  deleteUser: async (id: string): Promise<void> => {
      if (isMockMode) return Promise.resolve();
      await fetchWithFallback(`/admin/users/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
      });
  },

  getAdminUserResources: async (userId: string, type: 'projects' | 'pages' | 'articles'): Promise<any[]> => {
      if (isMockMode) {
          if (type === 'projects') return Promise.resolve([...localProjects]);
          if (type === 'pages') return Promise.resolve([...localPages]);
          if (type === 'articles') return Promise.resolve([...localArticles]);
          return Promise.resolve([]);
      }
      return await fetchWithFallback(`/admin/users/${userId}/resources?type=${type}`, { headers: getAuthHeaders() });
  },

  // --- LMS / COURSES ---
  
  getCoursesList: async (): Promise<{id: string, title: string, slug: string}[]> => {
      if (isMockMode) {
          return Promise.resolve(localCourses.map(c => ({ id: c.id, title: c.title, slug: c.slug })));
      }
      return await fetchWithFallback('/courses', { headers: getAuthHeaders() });
  },

  getCourseBySlug: async (slug: string): Promise<any> => {
      if (isMockMode) {
          const course = localCourses.find(c => c.slug === slug);
          if (course) {
              // Map to viewer format if needed, but structure should match DB
              return Promise.resolve({
                  ...course,
                  learningPoints: [], // Mock structure might need adjustment
                  modules: course.modules?.map(m => ({...m, lessons: []})) || [] // Ensure mock also returns empty lessons initially to test lazy load
              });
          }
          return Promise.resolve({
              id: 'mock-course',
              title: 'Curso Mock (Modo Offline)',
              modules: []
          });
      }
      return await fetchWithFallback(`/courses/${slug}`, { headers: getAuthHeaders() });
  },

  getModuleLessons: async (moduleId: string): Promise<CourseLesson[]> => {
      if (isMockMode) {
          // Find module in mock data
          const module = localCourses.flatMap(c => c.modules).find(m => m.id === moduleId);
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          return Promise.resolve(module?.lessons || []);
      }
      return await fetchWithFallback(`/modules/${moduleId}/lessons`, { headers: getAuthHeaders() });
  },

  // --- ADMIN COURSE MANAGEMENT ---
  
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
      
      const res = await fetchWithFallback(endpoint, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(course)
      });
      return res;
  },

  deleteCourse: async (id: string): Promise<void> => {
      if (isMockMode) {
          localCourses = localCourses.filter(c => c.id !== id);
          return Promise.resolve();
      }
      await fetchWithFallback(`/admin/courses/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  },

  // --- ADMIN COMMENTS MANAGEMENT ---

  getAdminComments: async (): Promise<Comment[]> => {
      if (isMockMode) return Promise.resolve(localComments);
      return await fetchWithFallback('/admin/comments', { headers: getAuthHeaders() });
  },

  moderateComment: async (id: string, action: 'toggle_publish' | 'delete'): Promise<void> => {
      if (isMockMode) {
          if (action === 'delete') {
              localComments = localComments.filter(c => c.id !== id);
          } else {
              localComments = localComments.map(c => c.id === id ? { ...c, isApproved: !c.isApproved } : c);
          }
          return Promise.resolve();
      }
      await fetchWithFallback(`/admin/comments/${id}`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ action })
      });
  },

  getComments: async (lessonId: string): Promise<any[]> => {
      if (isMockMode) {
          return Promise.resolve(localComments.filter(c => c.lessonId === lessonId));
      }
      return await fetchWithFallback(`/lessons/${lessonId}/comments`, { headers: getAuthHeaders() });
  },

  postComment: async (lessonId: string, content: string, parentId?: string): Promise<void> => {
      if (isMockMode) {
          const newComment: any = {
              id: `c-${Date.now()}`,
              lessonId,
              text: content,
              user: MOCK_USER.name,
              userId: MOCK_USER.id,
              date: new Date().toISOString(),
              likes: 0,
              isApproved: false // or true based on context
          };
          if (parentId) newComment.parentId = parentId;
          
          localComments.unshift(newComment);
          return Promise.resolve();
      }
      await fetchWithFallback('/comments', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ lessonId, content, parentId })
      });
  },

  likeComment: async (commentId: string): Promise<void> => {
      if (isMockMode) {
          // Update local mock data
          const comment = localComments.find(c => c.id === commentId);
          if (comment) {
              comment.likes = (comment.likes || 0) + 1;
          }
          return Promise.resolve();
      }
      await fetchWithFallback(`/comments/${commentId}/like`, {
          method: 'POST',
          headers: getAuthHeaders()
      });
  },

  // --- ADMIN PLANS MANAGEMENT ---
  getPlans: async (): Promise<Plan[]> => {
      if (isMockMode) return Promise.resolve([]); // Add mock plans if needed later
      return await fetchWithFallback('/admin/plans', { headers: getAuthHeaders() });
  },

  getPublicPlans: async (): Promise<Plan[]> => {
      if (isMockMode) {
          return Promise.resolve([
              {
                  id: 'starter',
                  name: 'Starter',
                  slug: 'starter',
                  description: 'Ideal para empezar sin riesgo.',
                  priceMonthly: 0,
                  currency: 'EUR',
                  limitsConfig: { planName: 'starter', maxProjects: 1, maxLandings: 3, features: { whatsappBot: false, blogGenerator: false, emailMarketing: false, removeBranding: false } },
                  uiFeatures: ['1 Proyecto / Nicho', '3 Landing Pages', 'IA Básica', 'Marca de Agua'],
                  isActive: true,
                  isRecommended: false
              },
              {
                  id: 'pro',
                  name: 'Pro',
                  slug: 'pro',
                  description: 'Para Productores y Afiliados serios.',
                  priceMonthly: 19.99,
                  currency: 'EUR',
                  limitsConfig: { planName: 'pro', maxProjects: 5, maxLandings: 20, features: { whatsappBot: true, blogGenerator: true, emailMarketing: true, removeBranding: true } },
                  uiFeatures: ['5 Proyectos', '20 Landing Pages', 'Bot WhatsApp', 'IA Avanzada', 'Sin Marca de Agua'],
                  isActive: true,
                  isRecommended: true
              }
          ]);
      }
      return await fetchWithFallback('/public/plans');
  },

  savePlan: async (plan: Plan): Promise<void> => {
      if (isMockMode) return Promise.resolve();
      const method = plan.id ? 'PUT' : 'POST';
      const endpoint = plan.id ? `/admin/plans/${plan.id}` : '/admin/plans';
      
      await fetchWithFallback(endpoint, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(plan)
      });
  },

  deletePlan: async (id: string): Promise<void> => {
      if (isMockMode) return Promise.resolve();
      await fetchWithFallback(`/admin/plans/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  }
};