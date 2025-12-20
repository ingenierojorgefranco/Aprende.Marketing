
import { LandingPage, Lead, GeneratedPageContent, Article, User, Project, PlanLimits, Course, Comment, CourseLesson, Plan, SystemLog, UserUsageStats, StrategyJSON, ProjectMasterStrategy, CRMContact, CRMActivity } from "../types";

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
    const res = await fetch(url, options);
    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP Error ${res.status}`);
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
    isUsingMockData: () => isMockMode,
    enableMockMode: () => { isMockMode = true; },
    disableMockMode: () => { isMockMode = false; },

    getActivePaymentProvider: async (): Promise<string> => {
        try {
            const data = await fetchWithFallback('/settings/payment-provider');
            return data.provider;
        } catch (e) {
            return 'stripe';
        }
    },

    getPublicPlans: async (): Promise<Plan[]> => {
        const plans = await fetchWithFallback('/public/plans');
        return plans.map((p: any) => ({
            ...p,
            id: p.id.toString(),
            priceMonthly: parseFloat(p.priceMonthly),
            stripePriceId: p.stripePriceId,
            hotmartUrl: p.hotmartUrl,
            limitsConfig: typeof p.limitsConfig === 'string' ? JSON.parse(p.limitsConfig) : p.limitsConfig,
            uiFeatures: typeof p.uiFeatures === 'string' ? JSON.parse(p.uiFeatures) : (p.uiFeatures || []),
            isActive: !!p.isActive,
            isRecommended: !!p.isRecommended
        }));
    },

    getPlans: async (): Promise<Plan[]> => {
        const plans = await fetchWithFallback('/admin/plans', { headers: getAuthHeaders() });
        return plans.map((p: any) => ({
            ...p,
            id: p.id.toString(),
            priceMonthly: parseFloat(p.priceMonthly),
            stripePriceId: p.stripePriceId,
            hotmartUrl: p.hotmartUrl,
            limitsConfig: typeof p.limitsConfig === 'string' ? JSON.parse(p.limitsConfig) : p.limitsConfig,
            uiFeatures: typeof p.uiFeatures === 'string' ? JSON.parse(p.uiFeatures) : (p.uiFeatures || []),
            isActive: !!p.isActive,
            isRecommended: !!p.isRecommended
        }));
    },

    savePlan: async (plan: Plan): Promise<void> => {
        const method = plan.id ? 'PUT' : 'POST';
        const endpoint = plan.id ? `/admin/plans/${plan.id}` : '/admin/plans';
        await fetchWithFallback(endpoint, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(plan)
        });
    },

    updateSystemSetting: async (key: string, value: string): Promise<void> => {
        await fetchWithFallback('/admin/settings', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ key, value })
        });
    },

    createCheckoutSession: async (planSlug: string): Promise<{ url: string }> => {
        return await fetchWithFallback('/stripe/create-checkout-session', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ planSlug })
        });
    },

    login: async (email: string, password: string) => {
        const user = await fetchWithFallback('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (user.token) localStorage.setItem('plataformadeventacom_token', user.token);
        return user.user;
    },
    getLoginRedirect: async () => {
        const data = await fetchWithFallback('/settings/redirect');
        return data.url;
    },
    /* Fix: Added missing logout method */
    logout: async () => {
        await fetchWithFallback('/auth/logout', { method: 'POST', headers: getAuthHeaders() }).catch(() => {});
    },
    getUsers: async () => await fetchWithFallback('/admin/users', { headers: getAuthHeaders() }),
    getPages: async () => {
        const pages = await fetchWithFallback('/pages', { headers: getAuthHeaders() });
        return pages.map((p: any) => ({
            ...p,
            id: String(p.id),
            content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
            createdAt: new Date(p.created_at || p.createdAt)
        }));
    },
    /* Fix: Added missing getPageById method */
    getPageById: async (id: string): Promise<LandingPage> => {
        const p = await fetchWithFallback(`/pages/${id}`, { headers: getAuthHeaders() });
        return {
            ...p,
            id: String(p.id),
            content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
            createdAt: new Date(p.created_at || p.createdAt)
        };
    },
    /* Fix: Added missing createPage method */
    createPage: async (page: LandingPage): Promise<LandingPage> => {
        const res = await fetchWithFallback('/pages', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(page)
        });
        return {
            ...res,
            id: String(res.id),
            content: typeof res.content === 'string' ? JSON.parse(res.content) : res.content,
            createdAt: new Date(res.created_at || res.createdAt)
        };
    },
    /* Fix: Added missing updatePage method */
    updatePage: async (page: LandingPage): Promise<void> => {
        await fetchWithFallback(`/pages/${page.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(page)
        });
    },
    /* Fix: Added missing deletePage method */
    deletePage: async (id: string): Promise<void> => {
        await fetchWithFallback(`/pages/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    },
    getProjects: async () => {
        const projects = await fetchWithFallback('/projects', { headers: getAuthHeaders() });
        return projects.map((p: any) => ({
            ...p,
            id: String(p.id),
            createdAt: new Date(p.created_at || p.createdAt)
        }));
    },
    /* Fix: Added missing getProjectById method */
    getProjectById: async (id: string): Promise<Project> => {
        const p = await fetchWithFallback(`/projects/${id}`, { headers: getAuthHeaders() });
        return {
            ...p,
            id: String(p.id),
            createdAt: new Date(p.created_at || p.createdAt)
        };
    },
    /* Fix: Added missing createProject method */
    createProject: async (data: any): Promise<Project> => {
        return await fetchWithFallback('/projects', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },
    /* Fix: Added missing updateProject method */
    updateProject: async (id: string, data: any): Promise<void> => {
        await fetchWithFallback(`/projects/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },
    /* Fix: Added missing deleteProject method */
    deleteProject: async (id: string): Promise<void> => {
        await fetchWithFallback(`/projects/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    },
    /* Fix: Added missing getProjectStrategy method */
    getProjectStrategy: async (id: string): Promise<ProjectMasterStrategy> => {
        const s = await fetchWithFallback(`/projects/${id}/strategy`, { headers: getAuthHeaders() });
        return typeof s === 'string' ? JSON.parse(s) : s;
    },
    getArticles: async () => await fetchWithFallback('/articles', { headers: getAuthHeaders() }),
    /* Fix: Added missing getArticleById method */
    getArticleById: async (id: string): Promise<Article> => {
        return await fetchWithFallback(`/articles/${id}`, { headers: getAuthHeaders() });
    },
    /* Fix: Added missing saveArticle method */
    saveArticle: async (data: any): Promise<void> => {
        await fetchWithFallback('/articles', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },
    /* Fix: Added missing updateArticle method */
    updateArticle: async (id: string, data: any): Promise<void> => {
        await fetchWithFallback(`/articles/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },
    /* Fix: Added missing deleteArticle method */
    deleteArticle: async (id: string): Promise<void> => {
        await fetchWithFallback(`/articles/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    },
    /* Fix: Added missing getPublicBlogArticles method */
    getPublicBlogArticles: async (pageId: string): Promise<Article[]> => {
        return await fetchWithFallback(`/public/pages/${pageId}/articles`);
    },
    /* Fix: Added missing getPublicArticle method */
    getPublicArticle: async (slug: string): Promise<Article> => {
        return await fetchWithFallback(`/public/articles/${slug}`);
    },
    /* Fix: Added missing submitLead method */
    submitLead: async (data: { pageId: string, name: string, email: string }): Promise<void> => {
        await fetchWithFallback('/public/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
    /* Fix: Added missing getAdminUserResources method */
    getAdminUserResources: async (userId: string, resource: string) => {
        return await fetchWithFallback(`/admin/users/${userId}/resources?type=${resource}`, { headers: getAuthHeaders() });
    },
    /* Fix: Added missing getWeeklyAnalytics method */
    getWeeklyAnalytics: async (): Promise<any[]> => {
        return await fetchWithFallback('/analytics/weekly', { headers: getAuthHeaders() });
    },
    /* Fix: Added missing getAnalyticsSummary method */
    getAnalyticsSummary: async (): Promise<any> => {
        return await fetchWithFallback('/analytics/summary', { headers: getAuthHeaders() });
    },
    getCoursesList: async () => await fetchWithFallback('/courses', { headers: getAuthHeaders() }),
    /* Fix: Added missing getCourseBySlug method */
    getCourseBySlug: async (slug: string): Promise<Course> => {
        return await fetchWithFallback(`/courses/by-slug/${slug}`, { headers: getAuthHeaders() });
    },
    /* Fix: Added missing getModuleLessons method */
    getModuleLessons: async (moduleId: string): Promise<CourseLesson[]> => {
        return await fetchWithFallback(`/courses/modules/${moduleId}/lessons`, { headers: getAuthHeaders() });
    },
    /* Fix: Added missing getComments method */
    getComments: async (lessonId: string): Promise<Comment[]> => {
        return await fetchWithFallback(`/courses/lessons/${lessonId}/comments`, { headers: getAuthHeaders() });
    },
    /* Fix: Added missing postComment method */
    postComment: async (lessonId: string, text: string, parentId?: string): Promise<void> => {
        await fetchWithFallback(`/courses/lessons/${lessonId}/comments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ text, parentId })
        });
    },
    /* Fix: Added missing likeComment method */
    likeComment: async (commentId: string): Promise<void> => {
        await fetchWithFallback(`/courses/comments/${commentId}/like`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
    },
    /* Fix: Added missing getAdminCourses method */
    getAdminCourses: async (): Promise<Course[]> => {
        return await fetchWithFallback('/admin/courses', { headers: getAuthHeaders() });
    },
    /* Fix: Added missing deleteCourse method */
    deleteCourse: async (id: string): Promise<void> => {
        await fetchWithFallback(`/admin/courses/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    },
    /* Fix: Added missing saveCourse method */
    saveCourse: async (course: Course): Promise<void> => {
        const method = course.id && !course.id.startsWith('new-') ? 'PUT' : 'POST';
        const endpoint = method === 'PUT' ? `/admin/courses/${course.id}` : '/admin/courses';
        await fetchWithFallback(endpoint, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(course)
        });
    },
    /* Fix: Added missing reorderCourses method */
    reorderCourses: async (orderedIds: string[]): Promise<void> => {
        await fetchWithFallback('/admin/courses/reorder', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ orderedIds })
        });
    },
    /* Fix: Added missing getAdminComments method */
    getAdminComments: async (): Promise<Comment[]> => {
        return await fetchWithFallback('/admin/comments', { headers: getAuthHeaders() });
    },
    /* Fix: Added missing moderateComment method */
    moderateComment: async (id: string, action: string): Promise<void> => {
        await fetchWithFallback(`/admin/comments/${id}/moderate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ action })
        });
    },
    /* Fix: Added missing updateProfile method */
    updateProfile: async (data: any): Promise<User> => {
        return await fetchWithFallback('/auth/profile', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },
    /* Fix: Added missing getContacts method */
    getContacts: async (): Promise<CRMContact[]> => {
        return await fetchWithFallback('/crm/contacts', { headers: getAuthHeaders() });
    },
    /* Fix: Added missing createContact method */
    createContact: async (data: any): Promise<CRMContact> => {
        return await fetchWithFallback('/crm/contacts', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },
    /* Fix: Added missing updateContact method */
    updateContact: async (contact: CRMContact): Promise<void> => {
        await fetchWithFallback(`/crm/contacts/${contact.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(contact)
        });
    },
    /* Fix: Added missing deleteContact method */
    deleteContact: async (id: string): Promise<void> => {
        await fetchWithFallback(`/crm/contacts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    },
    /* Fix: Added missing getContactHistory method */
    getContactHistory: async (id: string): Promise<CRMActivity[]> => {
        return await fetchWithFallback(`/crm/contacts/${id}/history`, { headers: getAuthHeaders() });
    },
    /* Fix: Added missing addContactNote method */
    addContactNote: async (contactId: string, content: string): Promise<void> => {
        await fetchWithFallback(`/crm/contacts/${contactId}/notes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content })
        });
    },
    getUserUsageStats: async (id: string) => await fetchWithFallback(`/admin/users/${id}/stats`, { headers: getAuthHeaders() }),
    getUserPayments: async (id: string) => await fetchWithFallback(`/admin/users/${id}/payments`, { headers: getAuthHeaders() }),
    getSystemLogs: async (p: number, f: any) => await fetchWithFallback(`/admin/logs?page=${p}`, { headers: getAuthHeaders() }),
};
