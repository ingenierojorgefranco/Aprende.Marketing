import { LandingPage, Lead, GeneratedPageContent, Article, User } from "../types";

// --- HELPER PARA OBTENER BASE URL ---
const getBaseUrl = () => {
    let url = '/api';
    try {
        // En Vite
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
            url = import.meta.env.VITE_API_URL;
        }
    } catch (e) {
        // Fallback seguro
    }
    
    // Limpiar trailing slash si existe
    url = url.replace(/\/+$/, '');
    
    // Si la URL no termina en /api, añadimos /api
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }
    
    return url;
};

const API_URL = getBaseUrl();

// --- CONFIGURACIÓN ---
const FORCE_MOCK_DATA = false;
let isOfflineMode = false;

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
            logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#d8b4fe;stop-opacity:1" /><stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" /></linearGradient></defs><path d="M32 2C15.4 2 2 15.4 2 32s13.4 30 30 30 30-13.4 30-30S48.6 2 32 2zm0 56C17.6 58 6 46.4 6 32S17.6 6 32 6s26 11.6 26 26-11.6 26-26 26z" fill="url(#grad1)"/><path d="M32 14c-6.6 0-12 5.4-12 12 0 4.8 2.8 9 7 11v9c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-9c4.2-2 7-6.2 7-11 0-6.6-5.4-12-12-12zm0 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="#fff"/></svg>',
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
                description: 'La industria de la belleza permanente ha crecido un 300% este año, convirtiéndose en una de las profesiones mejor pagadas del sector estético. Nuestra técnica 2.0 se enfoca en la naturalidad extrema, lo que los clientes realmente buscan hoy.',
                items: [
                    { title: 'Acabado Natural', description: 'Trazos finos que imitan el vello real a la perfección.' },
                    { title: 'Durabilidad', description: 'Resultados perfectos por 12 a 18 meses.' },
                    { title: 'Seguridad', description: 'Técnica no invasiva que protege la piel del cliente.' }
                ]
            },
            benefits: { 
                title: 'Tu Camino al Éxito Profesional', 
                subtitle: 'Hemos diseñado este programa para darte todo lo que necesitas para triunfar:',
                items: [
                    { title: 'Alta Rentabilidad', description: 'Genera entre $150 y $400 USD por cada cliente atendido.', icon: 'DollarSign', color: 'green' },
                    { title: 'Técnica Actualizada', description: 'Aprende el patrón Hyper-Realism que es tendencia mundial.', icon: 'Sparkles', color: 'purple' },
                    { title: 'Libertad Total', description: 'Tú decides cuándo trabajar y cuánto ganar.', icon: 'Target', color: 'orange' },
                    { title: 'Certificación Avalada', description: 'Diploma profesional con validez internacional.', icon: 'Award', color: 'blue' }
                ] 
            },
            whatYouWillLearn: { 
                title: 'Temario del Entrenamiento:',
                icon: 'BookOpen',
                items: [
                    'Introducción a la Piel y Anatomía',
                    'Visajismo y Diseño de Cejas',
                    'Colorimetría Aplicada (Tonos y Pigmentos)',
                    'Práctica en Látex (Patrones)',
                    'Procedimiento en Modelo Real',
                    'Cuidados, Cicatrización y Retoques',
                    'Marketing para Conseguir Clientes en Instagram'
                ] 
            },
            testimonials: [
                { name: 'Camila Torres', location: 'México DF', text: 'En solo 2 meses ya tengo mi agenda llena. El curso pagó mi inversión en la primera semana.', rating: 5 },
                { name: 'Sofia R.', location: 'Medellín', text: 'Me encantó la pedagogía. Laura explica todo con mucha paciencia y detalle. La naturalidad es increíble.', rating: 5 },
                { name: 'Elena García', location: 'Madrid', text: 'Había tomado otros cursos pero ninguno como este. Ahora me siento segura trabajando con clientes reales.', rating: 5 }
            ],
            faq: [
                { question: "¿Necesito saber dibujar para aprender?", answer: "No. Usamos herramientas de medición y plantillas de diseño que facilitan el proceso para cualquier persona." },
                { question: "¿Cuánto puedo ganar como especialista?", answer: "Una sesión promedio cuesta $200 USD. Con solo 3 clientes a la semana, superas los $2,000 USD mensuales fácilmente." },
                { question: "¿El curso es 100% online?", answer: "Sí, tienes acceso de por vida a las lecciones en video HD para verlas a tu ritmo y repetir las veces que quieras." },
                { question: "¿Incluye certificación?", answer: "Sí, al finalizar y aprobar tus prácticas recibirás tu diploma digital listo para imprimir." }
            ],
            instructor: { 
                name: 'Laura Sofía Méndez', 
                bio: 'Master Internacional en Micropigmentación con más de 10 años de experiencia. Ha formado a más de 3,000 alumnas en Latinoamérica y Europa. Fundadora de BrowMaster Academy y creadora de la técnica "Natural Flow".',
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
            thankYouMessage: '¡Registro Exitoso! Revisa tu correo para acceder a la clase.',
            redirectUrl: ''
        }
    }
];

let mockArticles: Article[] = [
    {
        id: 'demo-article-1',
        title: 'Microblading vs. Efecto Polvo: ¿Cuál elegir?',
        description: 'Guía completa para entender las diferencias y asesorar a tus clientas.',
        keyword: 'Microblading',
        contentHtml: '<h1>Diferencias Clave</h1><p>El microblading simula pelos, mientras que el efecto polvo simula maquillaje...</p>',
        seoScore: 88,
        createdAt: new Date()
    }
];

// --- FUNCIÓN FETCH CON TIMEOUT Y RETRY LOGIC ---
const fetchWithFallback = async (endpoint: string, options?: RequestInit) => {
    if (FORCE_MOCK_DATA) throw new Error("Force Mock Mode Enabled");
    
    // Normalize URL
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    try {
        // Implementar Promise.race para timeout efectivo de 3 segundos
        // Si el backend se cuelga, esto cortará la conexión y forzará el catch
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout: Servidor tardó demasiado")), 3000)
        );

        const fetchPromise = fetch(url, options);

        const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (!res.ok) {
            // Intentar leer el error
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

export const api = {
  getBaseUrl: getBaseUrl,
  isUsingMockData: () => isOfflineMode || FORCE_MOCK_DATA,

  // --- NUEVA FUNCIÓN LOGIN ---
  login: async (email: string, password: string, logCallback?: (msg: string) => void): Promise<User> => {
      const log = (msg: string) => { if (logCallback) logCallback(msg); console.log(msg); };

      log(`[API] Iniciando login para ${email}...`);

      try {
          // Intentar conexión real
          log(`[API] Fetching: /api/login`);
          const user = await fetchWithFallback('/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
          
          log(`[API] Login exitoso. Usuario: ${user.name}`);
          return user;

      } catch (error: any) {
          log(`[API] Error de conexión: ${error.message}`);
          
          // FALLBACK OFFLINE DURO
          // Si el usuario es el demo, permitimos entrar aunque no haya BD
          if (email === 'admin@plataformadeventa.com' && password === 'password123') {
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