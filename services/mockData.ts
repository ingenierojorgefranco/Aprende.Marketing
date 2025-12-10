
import { User, Project, LandingPage, Article, Lead, GeneratedPageContent, Course, Comment } from "../types";

export const MOCK_CREDENTIALS = {
  email: "admin@plataformadeventa.com",
  password: "MiPasswordSuperSegura123"
};

export const MOCK_USER: User = {
  id: "mock-user-id",
  name: "Admin Microblading",
  email: MOCK_CREDENTIALS.email,
  role: 'admin', // Mock user is admin
  planLimits: {
      planName: 'pro',
      maxProjects: 10,
      maxLandings: 50,
      features: {
          whatsappBot: true,
          blogGenerator: true,
          emailMarketing: true,
          removeBranding: true
      }
  }
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-microblading-01",
    name: "Certificación Expert Microblading",
    niche: "Belleza y Estética",
    description: "Curso profesional de técnica de cejas pelo a pelo para principiantes y esteticistas.",
    targetAudience: "Mujeres emprendedoras de 20-45 años apasionadas por la belleza, esteticistas que desean ampliar su menú de servicios y aumentar sus ingresos.",
    brandTone: "Profesional, Inspirador, Premium, Cercano",
    productName: "Masterclass Microblading Pro",
    mainGoal: "Venta Directa",
    painPoints: [
      "Miedo a no tener estabilidad económica con trabajos tradicionales.",
      "Frustración por cursos anteriores que solo enseñan teoría y nada de práctica real.",
      "Dificultad para conseguir clientes nuevos en el mundo de la belleza.",
      "Falta de confianza para realizar procedimientos en rostros reales."
    ],
    keyBenefits: [
      "Aprende una habilidad de alta demanda con rentabilidad inmediata.",
      "Domina el visajismo perfecto para diseñar cejas simétricas.",
      "Acceso a comunidad exclusiva de soporte para siempre.",
      "Certificación Internacional que avala tus conocimientos."
    ],
    affiliateLinks: [
      { label: "Checkout Oferta", url: "https://pay.hotmart.com/DEMO123?checkoutMode=10" },
      { label: "Clase Gratuita", url: "https://go.hotmart.com/DEMO123?ap=5678" }
    ],
    createdAt: new Date("2024-01-15")
  }
];

const MICROBLADING_CONTENT: GeneratedPageContent = {
  palette: 'elegant-purple',
  structure: 'classic-sales',
  destination: { 
    type: 'whatsapp', 
    whatsappPhone: '+573001234567', 
    whatsappMessage: 'Hola, estoy interesada en el Curso de Microblading, quisiera más información.' 
  },
  brandName: "MicroBrows <b>Academy</b>",
  brandIcon: "Sparkles",
  topTagline: "🔥 La Profesión Mejor Pagada de la Belleza en 2024",
  navCta: "Ver Clase Gratis",
  navLinks: [
    { label: "La Técnica", href: "#seccion-introduccion" },
    { label: "Beneficios", href: "#seccion-beneficios" },
    { label: "Testimonios", href: "#seccion-testimonios" },
    { label: "Tu Mentora", href: "#seccion-instructor" }
  ],
  testimonialTitle: "Ellas ya viven de su pasión:",
  testimonialSubtitle: "Resultados reales de alumnas que empezaron desde cero.",
  logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#d946ef;stop-opacity:1" /><stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" /></linearGradient></defs><path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2zm0 56C17.664 58 6 46.336 6 32S17.664 6 32 6s26 11.664 26 26-11.664 26-26 26z" fill="url(#grad1)"/><path d="M42.5 24.5c-4.1-3.5-9.2-4.5-14.5-2.8-5.3 1.7-9.3 6.1-10.8 11.5-.3 1.1-.5 2.2-.5 3.3 0 1.9 1.6 3.5 3.5 3.5h.5c1.8-.2 3.2-1.6 3.4-3.4.1-.7.2-1.3.4-2 1-3.6 3.7-6.5 7.2-7.6 3.5-1.1 6.9-.5 9.6 1.8 1.4 1.2 3.5 1 4.7-.4 1.2-1.4 1-3.5-.4-4.7z" fill="#fff"/></svg>`,
  hero: {
    headline: "Domina el Arte del <b>Microblading 3D</b> y Triplica tus Ingresos en 30 Días",
    subheadline: "Descubre la técnica 'Pelo a Pelo' que está revolucionando la industria de la belleza. Sin experiencia previa y con baja inversión inicial.",
    ctaText: "¡Sí! Quiero Certificarme",
    heroImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    videoTitle: "Clase Exclusiva: Diseño de Cejas",
    videoDuration: "15 Min",
    spotsLeft: "¡Solo 5 cupos disponibles!",
    socialProofCount: "2,458 Alumnas"
  },
  testimonials: [
    { name: "Carla Mendez", location: "Madrid, España", text: "Recuperé la inversión en mi primera semana. La técnica es súper natural y mis clientas la aman.", rating: 5 },
    { name: "Sofia Ruiz", location: "Bogotá, Colombia", text: "Me daba miedo empezar de cero, pero el paso a paso es clarísimo. Ahora tengo mi propio estudio en casa.", rating: 5 },
    { name: "Ana Torres", location: "Lima, Perú", text: "Lo mejor es el soporte. Nunca te sientes sola en el proceso de aprendizaje. 100% recomendado.", rating: 5 }
  ],
  intro: {
    title: "¿Qué es el Microblading Hiperrealista?",
    description: "Es una técnica de maquillaje semipermanente que permite diseñar cejas perfectas, dibujando 'pelo por pelo' para un acabado 100% natural. Es el servicio más demandado en salones de belleza actualmente debido a su alto valor percibido.",
    items: [
        { title: "Visajismo Personalizado", description: "Aprende a diseñar la ceja perfecta según la estructura ósea del rostro de tu clienta." },
        { title: "Colorimetría Avanzada", description: "Domina la mezcla de pigmentos para evitar tonos rojos o azules con el tiempo." },
        { title: "Bioseguridad", description: "Protocolos de higiene para trabajar de forma segura y profesional." }
    ]
  },
  benefits: {
    title: "Tu Arsenal para el Éxito",
    subtitle: "No solo te enseñamos la técnica, te damos las herramientas para venderla.",
    items: [
      { title: "Kit Digital Completo", description: "Acceso a plantillas de práctica imprimibles y manuales en PDF de alta resolución.", icon: "FileText", color: "purple" },
      { title: "Certificado Internacional", description: "Diploma avalado para ejercer tu profesión en cualquier país de habla hispana.", icon: "Award", color: "yellow" },
      { title: "Comunidad Privada", description: "Acceso de por vida a nuestro grupo de soporte VIP en Telegram.", icon: "Users", color: "blue" },
      { title: "Marketing para Esteticistas", description: "Módulo exclusivo para conseguir tus primeros 10 clientes en Instagram.", icon: "Rocket", color: "green" }
    ]
  },
  whatYouWillLearn: {
    title: "Plan de Estudios",
    icon: "BookOpen",
    items: [
      "Módulo 1: Fundamentos de la piel y anatomía.",
      "Módulo 2: Diseño y perfilado avanzado (Brow Mapping).",
      "Módulo 3: Patrones de espina para efecto natural.",
      "Módulo 4: Práctica en látex y piel sintética.",
      "Módulo 5: Demostración en modelo real HD."
    ]
  },
  faq: [
    { question: "¿Necesito saber dibujar para aprender?", answer: "No, utilizamos herramientas de medición y plantillas que facilitan el diseño perfecto sin necesidad de ser una experta dibujante." },
    { question: "¿El curso incluye materiales?", answer: "Es un curso 100% online. Te entregamos la lista exacta de proveedores confiables y económicos en tu país para que armes tu kit." },
    { question: "¿Cuánto tiempo tengo de acceso?", answer: "El acceso es de por vida. Puedes ver las clases las veces que quieras y a tu propio ritmo." },
    { question: "¿Cómo obtengo mi certificado?", answer: "Al finalizar todas las clases y entregar tus prácticas finales aprobadas, podrás descargar tu certificado digital." }
  ],
  instructor: {
    name: "Valentina Ross",
    bio: "Master en Micropigmentación con más de 10 años de experiencia. Fundadora de VR Beauty Academy y creadora del método 'Brows that Speak'. Ha formado a más de 5000 artistas en Latinoamérica.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badgeText: "Master Artist",
    badgeSubtext: "PhiBrows Certified",
    statsStudents: "+5k Alumnas",
    statsRating: "4.9/5 Calif."
  },
  footer: {
    copyright: "© 2024 MicroBrows Academy. Todos los derechos reservados.",
    contact: "soporte@microbrows.demo",
    socials: { facebook: "https://facebook.com", instagram: "https://instagram.com", twitter: "https://twitter.com" }
  },
  thankYouMessage: "¡Felicidades por tu compra! Revisa tu correo electrónico para acceder al área de miembros.",
  redirectUrl: "https://www.google.com"
};

export const MOCK_PAGES: LandingPage[] = [
  {
    id: "page-micro-01",
    name: "Landing Principal Microblading",
    niche: "Belleza / Cejas",
    goal: "Venta Directa",
    isPublished: true,
    subdomain: "curso-cejas.generatorlanding.com",
    content: MICROBLADING_CONTENT,
    createdAt: new Date("2024-02-01"),
    visits: 1250,
    conversions: 85,
    user_id: "mock-user-id"
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: "art-micro-01",
    title: "Diferencia entre Microblading y Micropigmentación: Guía Definitiva",
    slug: "diferencia-microblading-micropigmentacion",
    description: "Muchas clientas confunden estas técnicas. Aprende a explicarlo correctamente y vende mejor tus servicios de cejas.",
    contentHtml: `
      <p>Cuando te adentras en el mundo de la belleza, es común escuchar estos términos de forma intercambiable, pero <strong>no son lo mismo</strong>.</p>
      <h2>1. La Herramienta</h2>
      <p>El <strong>Microblading</strong> se realiza con un tébori (pluma manual), lo que permite un control total sobre cada trazo. La <strong>Micropigmentación</strong> utiliza un demógrafo eléctrico.</p>
      <h2>2. La Profundidad</h2>
      <p>El microblading trabaja en la epidermis (capa superficial), por lo que es semipermanente. La micropigmentación puede llegar más profundo, durando más tiempo pero con un aspecto más "tatuado".</p>
      <h2>Conclusión</h2>
      <p>Si buscas un acabado natural y pelo a pelo, el Microblading es la opción ganadora en 2024.</p>
    `,
    metaTitle: "Microblading vs Micropigmentación: ¿Cuál es mejor?",
    metaDescription: "Descubre las diferencias clave entre Microblading y Micropigmentación para elegir la mejor técnica para tus cejas.",
    keyword: "microblading vs micropigmentacion",
    seoScore: 85,
    status: 'published',
    publishedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    pageId: "page-micro-01",
    featuredImage: "https://images.unsplash.com/photo-1599592237937-234b6b6c0780?auto=format&fit=crop&w=800",
    pageName: "Landing Principal Microblading",
    pageSubdomain: "curso-cejas.generatorlanding.com"
  },
  {
    id: "art-micro-02",
    title: "Cuánto cobrar por un servicio de cejas en 2024",
    slug: "cuanto-cobrar-cejas-2024",
    description: "Guía de precios para esteticistas principiantes. No regales tu trabajo y aprende a valorar tu arte.",
    contentHtml: "<p>El precio promedio varía según la zona, pero nunca deberías cobrar menos de $150 USD por una sesión inicial...</p>",
    keyword: "precio microblading",
    seoScore: 92,
    status: 'draft',
    publishedAt: new Date(),
    createdAt: new Date(),
    pageId: "page-micro-01",
    pageName: "Landing Principal Microblading",
    pageSubdomain: "curso-cejas.generatorlanding.com"
  }
];

export const MOCK_LEADS: Lead[] = [
  { id: "lead-1", name: "Maria Garcia", email: "maria@test.com", sourcePage: "Landing Principal Microblading", date: "2024-03-15", synced: false },
  { id: "lead-2", name: "Laura Lopez", email: "laura@test.com", sourcePage: "Landing Principal Microblading", date: "2024-03-14", synced: true },
  { id: "lead-3", name: "Carlos Perez", email: "carlos@demo.com", sourcePage: "Landing Principal Microblading", date: "2024-03-13", synced: true }
];

export const MOCK_COURSES: Course[] = [
    {
        id: "mock-course-1",
        title: "Productos Digitales",
        subtitle: "Curso Intensivo",
        description: "Aprende a crear, validar y vender tu primer infoproducto desde cero. Descubre las estrategias que usan los grandes productores para facturar miles de dólares en Hotmart.",
        slug: "digital-products",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        modules: [
            {
                id: "mod-1",
                title: "Módulo 1: Fundamentos y Mentalidad",
                order_index: 1,
                lessons: [
                    { id: "l-1", title: "Bienvenida al Curso", duration: "5:00", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Intro", learning_points: ["Punto 1"], order_index: 1 },
                    { id: "l-2", title: "Mentalidad de Productor", duration: "12:00", video_url: "", description: "Mindset", learning_points: ["Punto A"], order_index: 2 }
                ]
            },
            {
                id: "mod-2",
                title: "Módulo 2: Creación del Producto",
                order_index: 2,
                lessons: []
            }
        ],
        createdAt: new Date("2024-01-01")
    },
    {
        id: "mock-course-2",
        title: "Inteligencia Artificial",
        subtitle: "Masterclass",
        description: "Domina las herramientas de IA que están revolucionando el marketing.",
        slug: "ai",
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        modules: [],
        createdAt: new Date("2024-02-01")
    }
];

export const MOCK_COMMENTS: Comment[] = [
    {
        id: "c-1",
        lessonId: "l-1",
        lessonTitle: "Bienvenida al Curso",
        courseTitle: "Productos Digitales",
        user: "Juan Perez",
        userId: "u-2",
        date: new Date().toISOString(),
        text: "¡Excelente introducción! Estoy listo para aprender.",
        isApproved: true
    },
    {
        id: "c-3",
        parentId: "c-1", // Reply to Juan Perez
        lessonId: "l-1",
        lessonTitle: "Bienvenida al Curso",
        courseTitle: "Productos Digitales",
        user: "Maria Rodriguez",
        userId: "u-4",
        date: new Date().toISOString(),
        text: "Gracias Juan, espero que disfrutes el contenido. ¡Vamos con todo!",
        isApproved: true
    },
    {
        id: "c-2",
        lessonId: "l-2",
        lessonTitle: "Mentalidad de Productor",
        courseTitle: "Productos Digitales",
        user: "Ana Lopez",
        userId: "u-3",
        date: new Date(Date.now() - 86400000).toISOString(),
        text: "Tengo una duda sobre los nichos, ¿se hablará de eso más adelante?",
        isApproved: false // Pending
    }
];
