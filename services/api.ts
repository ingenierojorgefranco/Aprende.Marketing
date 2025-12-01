import { LandingPage, Lead, GeneratedPageContent, Article } from "../types";

// --- CONFIGURACIÓN ---
const FORCE_MOCK_DATA = false;

// 🔥 URL del Backend — AHORA SIEMPRE TOMA VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// --- MOCK DATA (CONTENIDO DEMO - ESPECIALISTA EN MICROBLADING 2.0) ---
let mockPages: LandingPage[] = [
    {
        id: 'demo-microblading-2',
        name: 'Especialista en Microblading 2.0',
        niche: 'Belleza y Estética',
        goal: 'Registro a Clase / Captación',
        isPublished: true,
        subdomain: 'especialista-cejas.plataformadeventa.com',
        visits: 1250,
        conversions: 315,
        createdAt: new Date(),
        content: {
            palette: 'elegant-purple',
            structure: 'classic-sales',
            targetAudience: 'Mujeres emprendedoras que buscan independencia financiera en el mundo de la belleza.',
            destination: { type: 'form' },
            brandName: 'Brow<b>Master</b> 2.0',
            brandIcon: 'Feather',
            topTagline: '🔥 Nueva Certificación 2024 - Cupos Limitados',
            navCta: 'Reservar Beca',
            navLinks: [
                { label: 'La Técnica 2.0', href: '#seccion-introduccion' },
                { label: 'Beneficios', href: '#seccion-beneficios' },
                { label: 'Resultados', href: '#seccion-testimonios' },
                { label: 'Tu Mentora', href: '#seccion-instructor' }
            ],
            testimonialTitle: 'Historias de éxito real:',
            testimonialSubtitle: 'Ellas pasaron de cero a expertas en menos de 30 días.',
            logoSvg: '<svg … />',
            hero: { 
                headline: 'Conviértete en <b>Especialista en Microblading</b> y Genera Altos Ingresos', 
                subheadline: 'Descubre la metodología exacta para dominar el diseño de cejas hiper-realistas. Sin necesidad de experiencia previa y con baja inversión inicial.', 
                ctaText: '¡Regístrate a la Clase Gratis!',
                heroImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?…',
                videoTitle: 'Técnica Pelo a Pelo 2.0',
                videoDuration: 'Ver Demo (12 Min)',
                spotsLeft: '¡Solo 4 Becas Disponibles!',
                socialProofCount: '3,102'
            },
            intro: { 
                title: '¿Por qué especializarte en Microblading ahora?', 
                description: 'La industria de la belleza permanente ha crecido un 300% este año…',
                items: [
                    { title: 'Acabado Natural', description: 'Trazos finos que imitan el vello real.' },
                    { title: 'Durabilidad', description: '12 a 18 meses.' },
                    { title: 'Seguridad', description: 'No invasiva.' }
                ]
            },
            benefits: { 
                title: 'Tu Camino al Éxito Profesional', 
                subtitle: 'Hemos diseñado este programa para darte todo lo que necesitas:',
                items: [
                    { title: 'Alta Rentabilidad', description: 'Genera entre $150 y $400 USD…', icon: 'DollarSign', color: 'green' },
                    { title: 'Técnica Actualizada', description: 'Aprende el patrón Hyper-Realism.', icon: 'Sparkles', color: 'purple' },
                    { title: 'Libertad Total', description: 'Tú decides cuándo trabajar.', icon: 'Target', color: 'orange' },
                    { title: 'Certificación Avalada', description: 'Diploma profesional.', icon: 'Award', color: 'blue' }
                ] 
            },
            whatYouWillLearn: { 
                title: 'Temario del Entrenamiento:',
                icon: 'BookOpen',
                items: [
                    'Introducción a la Piel',
                    'Visajismo',
                    'Colorimetría',
                    'Práctica',
                    'Procedimiento en Modelo Real',
                    'Cicatrización y Retoques',
                    'Marketing Instagram'
                ] 
            },
            testimonials: [
                { name: 'Camila Torres', location: 'México DF', text: 'Agenda llena.', rating: 5 },
                { name: 'Sofia R.', location: 'Medellín', text: 'Naturalidad.', rating: 5 },
                { name: 'Elena García', location: 'Madrid', text: 'Excelente inversión.', rating: 5 }
            ],
            faq: [
                { question: "¿Necesito saber dibujar?", answer: "No. Usamos herramientas de medición." },
                { question: "¿Cuánto puedo ganar?", answer: "$2,000 USD mensuales fácil." },
                { question: "¿Es online?", answer: "Sí." },
                { question: "¿Incluye certificación?", answer: "Sí, diploma digital." }
            ],
            instructor: { 
                name: 'Laura Sofía Méndez', 
                bio: 'Master Internacional en Micropigmentación…',
                badgeText: 'Master Trainer',
                badgeSubtext: '10 Años Exp.',
                statsStudents: '3.1k+ Alumnas',
                statsRating: '5.0 Calificación'
            },
            footer: { 
                copyright: '© 2024…',
                contact: 'soporte@browmaster.com',
                socials: {
                    instagram: 'https://instagram.com',
                    facebook: 'https://facebook.com'
                }
            },
            thankYouMessage: '¡Registro Exitoso!',
            redirectUrl: ''
        }
    }
];

let mockArticles: Article[] = [
    {
        id: 'demo-article-1',
        title: 'Microblading vs. Efecto Polvo',
        description: 'Guía completa.',
        keyword: 'Microblading',
        contentHtml: '<h1>Diferencias Clave</h1><p>…</p>',
        seoScore: 88,
        createdAt: new Date()
    }
];

let isOfflineMode = false;

const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
    if (FORCE_MOCK_DATA) throw new Error("Force Mock Mode Enabled");
    
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);

        if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        
        if (isOfflineMode) console.log("🟢 Conexión con API restablecida");
        isOfflineMode = false;
        
        return await res.json();
    } catch (error: any) {
        if (!isOfflineMode) {
            console.error(`❌ Error Conectando API en ${endpoint}:`, error);
            console.warn(`⚠️ Cambiando a MODO OFFLINE. Datos Mock.`);
        }
        isOfflineMode = true;
        throw error;
    }
};

export const api = {
  isUsingMockData: () => isOfflineMode || FORCE_MOCK_DATA,

  getPages: async (): Promise<LandingPage[]> => {
    try {
        const pages = await fetchWithFallback('/pages');
        return pages.map((p: any) => ({
            ...p,
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: page.name,
                niche: page.niche,
                goal: page.goal,
                subdomain: page.subdomain,
                content: page.content,
                userId: 1
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
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

  getLeads: async (): Promise<Lead[]> => {
      try {
          return await fetchWithFallback('/leads');
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

  getArticles: async (): Promise<Article[]> => {
      try {
          const articles = await fetchWithFallback('/articles');
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
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  title: article.title,
                  description: article.description,
                  content_html: article.contentHtml,
                  keyword: article.keyword,
                  seo_score: article.seoScore,
                  user_id: 1
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
