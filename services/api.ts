import { LandingPage, Lead, GeneratedPageContent, Article } from "../types";

// --- CONFIGURACIÓN ---
// FALSE: Intenta conectar a la API. Si falla, usa los datos Mock.
// TRUE: Ignora la API y usa siempre datos locales.
const FORCE_MOCK_DATA = false; 

// URL del Backend
const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

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
            destination: { 
                type: 'form', // Configurado para abrir formulario de registro
            },
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
            logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
            hero: { 
                headline: 'Conviértete en <b>Especialista en Microblading</b> y Genera Altos Ingresos', 
                subheadline: 'Descubre la metodología exacta para dominar el diseño de cejas hiper-realistas. Sin necesidad de experiencia previa y con baja inversión inicial.', 
                ctaText: '¡Regístrate a la Clase Gratis!',
                heroImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                videoTitle: 'Técnica Pelo a Pelo 2.0',
                videoDuration: 'Ver Demo (12 Min)',
                spotsLeft: '¡Solo 4 Becas Disponibles!',
                socialProofCount: '3,102'
            },
            intro: { 
                title: '¿Por qué especializarte en Microblading ahora?', 
                description: 'La industria de la belleza permanente ha crecido un 300% este año. Las clientas ya no buscan cejas tatuadas y oscuras, buscan la naturalidad que solo nuestra técnica <b>Microblading 2.0</b> puede ofrecer.',
                items: [
                    { title: 'Acabado Natural', description: 'Trazos finos que imitan el vello real.' },
                    { title: 'Durabilidad', description: 'Resultados perfectos de 12 a 18 meses.' },
                    { title: 'Seguridad', description: 'Técnica no invasiva y de rápida cicatrización.' }
                ]
            },
            benefits: { 
                title: 'Tu Camino al Éxito Profesional', 
                subtitle: 'Hemos diseñado este programa para darte todo lo que necesitas:',
                items: [
                    { 
                        title: 'Alta Rentabilidad', 
                        description: 'Genera entre $150 y $400 USD por una sesión de solo 2 horas. Recupera tu inversión con tus primeras 3 clientas.', 
                        icon: 'DollarSign', 
                        color: 'green' 
                    },
                    { 
                        title: 'Técnica Actualizada', 
                        description: 'Olvídate de las cejas compactas antiguas. Aprende el patrón "Hyper-Realism" que es tendencia mundial.', 
                        icon: 'Sparkles', 
                        color: 'purple' 
                    },
                    { 
                        title: 'Libertad Total', 
                        description: 'Sé dueña de tu tiempo. Tú decides cuándo trabajar y cuánto ganar sin depender de un jefe.', 
                        icon: 'Target', 
                        color: 'orange' 
                    },
                    { 
                        title: 'Certificación Avalada', 
                        description: 'Recibe tu diploma profesional y credencial para ejercer legalmente como especialista.', 
                        icon: 'Award', 
                        color: 'blue' 
                    }
                ] 
            },
            whatYouWillLearn: { 
                title: 'Temario del Entrenamiento:', 
                icon: 'BookOpen',
                items: [
                    'Introducción a la Piel y Bioseguridad.', 
                    'Visajismo: Diseño perfecto según el rostro.',
                    'Colorimetría: Cómo elegir el pigmento ideal.',
                    'Práctica en Papel y Látex (Patrones de inicio).',
                    'Procedimiento en Modelo Real (Video HD).',
                    'Cuidados posteriores y Retoques.',
                    'Marketing: Cómo conseguir clientas por Instagram.'
                ] 
            },
            testimonials: [
                { name: 'Camila Torres', location: 'México DF', text: 'Tenía miedo de emprender, pero este curso me dio la seguridad. Hoy tengo mi agenda llena.', rating: 5 },
                { name: 'Sofia R.', location: 'Medellín, CO', text: 'La técnica 2.0 es otro nivel. Mis clientas aman lo naturales que quedan sus cejas.', rating: 5 },
                { name: 'Elena García', location: 'Madrid, ES', text: 'Excelente inversión. Los videos se ven perfectos y la profesora explica con mucha paciencia.', rating: 5 }
            ],
            faq: [
                { question: "¿Necesito saber dibujar para aprender?", answer: "¡Para nada! Te enseñamos a usar herramientas de medición (compás áureo) y plantillas para que el diseño siempre quede simétrico y perfecto." },
                { question: "¿Cuánto puedo ganar iniciando?", answer: "El promedio por servicio es de $200 USD. Atendiendo solo a 3 clientas a la semana, puedes superar los $2,000 USD mensuales fácilmente." },
                { question: "¿El curso es totalmente online?", answer: "Sí, puedes ver las lecciones desde tu celular o computadora, a tu propio ritmo y repetir los videos las veces que necesites." },
                { question: "¿Qué incluye la certificación?", answer: "Incluye acceso de por vida, soporte por WhatsApp, corrección de prácticas y tu Diploma Digital de finalización." }
            ],
            instructor: { 
                name: 'Laura Sofía Méndez', 
                bio: 'Master Internacional en Micropigmentación y fundadora de "BrowMaster Academy". Galardonada como Mejor Instructora Online 2023. Ha ayudado a más de 3,000 mujeres a vivir de su pasión por la belleza.',
                badgeText: 'Master Trainer',
                badgeSubtext: '10 Años Exp.',
                statsStudents: '3.1k+ Alumnas',
                statsRating: '5.0 Calificación'
            },
            footer: { 
                copyright: '© 2024 BrowMaster Academy. Todos los derechos reservados.', 
                contact: 'soporte@browmaster.com',
                socials: {
                    instagram: 'https://instagram.com',
                    facebook: 'https://facebook.com'
                }
            },
            thankYouMessage: '¡Registro Exitoso! Revisa tu correo electrónico para acceder a la clase.',
            redirectUrl: ''
        }
    }
];

let mockArticles: Article[] = [
    {
        id: 'demo-article-1',
        title: 'Microblading vs. Efecto Polvo: ¿Cuál elegir?',
        description: 'Una guía completa para asesorar a tus clientas y elegir la técnica correcta.',
        keyword: 'Microblading',
        contentHtml: '<h1>Diferencias Clave</h1><p>Entender la piel de tu clienta es fundamental...</p>',
        seoScore: 88,
        createdAt: new Date()
    }
];

// Variable para rastrear el estado de la conexión
let isOfflineMode = false;

// Helper: Intenta fetch, si falla, lanza error para que el catch use Mock
const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
    if (FORCE_MOCK_DATA) throw new Error("Force Mock Mode Enabled");
    
    try {
        // Aumentado el timeout a 5s por si el backend está 'despertando'
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);

        if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
        
        // Si tiene éxito, marcamos online
        if (isOfflineMode) console.log("🟢 Conexión con API restablecida");
        isOfflineMode = false;
        
        return await res.json();
    } catch (error: any) {
        if (!isOfflineMode) {
            // Log detallado del error real (NO esconder)
            console.error(`❌ Error Conectando API en ${endpoint}:`, error);
            console.warn(`⚠️ Sistema cambiando a MODO OFFLINE debido al error anterior. Datos simulados activados.`);
        }
        isOfflineMode = true;
        throw error;
    }
};

export const api = {
  isUsingMockData: () => isOfflineMode || FORCE_MOCK_DATA,

  // --- LANDING PAGES ---
  getPages: async (): Promise<LandingPage[]> => {
    try {
        const pages = await fetchWithFallback('/pages');
        // Asegurar fechas son objetos Date y parsear contenido JSON
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

  // --- LEADS ---
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
         console.log("Lead guardado localmente (Mock):", { pageId, name, email });
     }
  },

  // --- ARTICLES ---
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