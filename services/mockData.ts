
import { User, Project, LandingPage, Article, Lead, Course, Comment, CRMContact, CRMActivity, DashboardNews, EmailSequence, EmailMessage } from "../types";
import { ProjectMasterStrategy } from "./strategySchema";
import { BookOpen, Sparkles, Users, MessageCircle, Target } from 'lucide-react';

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
      maxDomains: 5,
      maxArticles: 20,
      maxEmailSequences: 10,
      maxWhatsAppLaunches: 10, // Propiedad añadida para control de cuotas
      features: {
          whatsappBot: true,
          blogGenerator: true,
          emailMarketing: true,
          removeBranding: true,
          emailStrategy: true,
          evergreenStrategy: true
      }
  }
};

/* --- DATOS MOCK DE ESTRATEGIA MAESTRA --- */
export const MOCK_MASTER_STRATEGY: ProjectMasterStrategy = {
    meta: {
        projectName: "Masterclass Microblading Pro",
        createdAt: "14 Oct, 2023",
        niche: "Belleza y Estética",
        productType: "Curso Online (High Ticket)",
        objective: "Venta Directa (Crash Strategy)",
        price: 200,
        commissionRate: 0.65,
        projection: [0, 0, 0, 116.81, 233.62, 584.05, 817.67, 1168.10, 1401.72, 600, 2102.58, 2336.20],
        insights: {
            overview: {
                title: "Estrategia para vender en automático",
                items: [
                    { label: "Producto", value: "Curso de Microblading Profesional", icon: BookOpen, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
                    { label: "Nicho", value: "Belleza y estética", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                    { label: "Público Objetivo", value: "Mujeres entre 22 y 38 años", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { label: "Estrategia", value: "Contenido educativo + cierre por WhatsApp", icon: MessageCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                    { label: "Objetivo del Sistema", value: "Generar leads cualificados y convertirlos en ventas", icon: Target, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-400/20" }
                ]
            },
            niche: {
                title: "Potencial del Nicho: Belleza",
                description: "El nicho de belleza es un mercado 'Evergreen', resistente a crisis."
            },
            product: {
                title: "¿Cuánto vas a ganar?",
                description: "Este es un producto de $200 USD."
            },
            objective: {
                title: "¿Cómo vas a ganar?",
                description: "Implementando un ecosistema de venta directa."
            }
        }
    },
    avatars: [
        {
            id: 1,
            name: "Laura \"La Emprendedora\"",
            archetype: "Mujer entre 22 y 38 años",
            age: "22-38 años",
            quote: "Deseo generar ingresos propios ofreciendo servicios de alto valor.",
            interests: "Estética, belleza y autoempleo",
            behavior: "Consume contenido en Instagram y WhatsApp",
            pain: "Trabajas jornadas agotadoras de más de 10 horas.",
            daily_manifestation: "Se siente frustrada al final del mes.",
            desire: "Generar ingresos propios.",
            emotional_reason: "Sentirse libre financieramente.",
            objection: "Desconfía de promesas vacías.",
            motivations: { dinero: 90, tiempo: 80, estatus: 70, seguridad: 60 }
        }
    ],
    psychology: {
        pains: ["Jornadas agotadoras"],
        solutions: ["Técnica rentable"],
        awarenessStages: {
            stage1_pain: "Frustración",
            stage2_solution: "Sabe que el Microblading es la técnica mejor pagada",
            stage3_barrier: "Miedo a no tener acompañamiento"
        },
        buyingPsychology: {
            notBuyingReasons: [{ title: "Duda de la factibilidad", description: "Teme que su falta de experiencia sea un impedimento." }],
            buyingReasons: [{ title: "Siente Seguridad", description: "Percibe que el acompañamiento paso a paso minimiza cualquier riesgo." }],
            strategistConclusion: "El mensaje se enfocará en seguridad."
        }
    },
    modules: {
        web: {
            landingPageTabs: {
                hero: { label: "1. Encabezado", title: "Promesa de Valor", type: 'hero', h1: "Domina el Arte del Microblading", h2: "Independencia financiera sin trucos.", strategyText: "Este titular conecta con el deseo de generar ingresos propios." }
            },
            thankYouPageTabs: {
                header: { label: "1. Confirmación", title: "Mensaje de Éxito", type: 'header', content: { h1: "¡Bienvenida!", h2: "Has tomado la mejor decisión." }, strategyText: "Reforzamos la idea de independencia." }
            }
        },
        content: [{ id: 1, title: "¿Qué es el microblading?", traffic: 50, difficulty: 20, keyword: "que es microblading", searchVolume: "500 - 1K", objective: "Educación inicial", strategy: "Definimos la técnica." }],
        emails: {
            nurture: [{ id: 1, day: "Día 0", subject: "🎁 Tu regalo", type: "Entrega de Valor", objective: "Establecer reciprocidad.", bodyPreview: "Hola [Nombre]..." }],
            evergreen: []
        },
        whatsapp: [],
        whatsappLaunch: [{ id: "wl1", name: "Confirmación", moment: "Día -7", objective: "Agendar al lead", messages: [{ role: 'agent', text: "¡Hola! 🎉" }] }]
    }
};

// Exportación de miembros faltantes para corregir errores de compilación
export const MOCK_PROJECTS: Project[] = [];
export const MOCK_PAGES: LandingPage[] = [];
export const MOCK_ARTICLES: Article[] = [];
export const MOCK_LEADS: Lead[] = [];
export const MOCK_COURSES: Course[] = [];
export const MOCK_COMMENTS: Comment[] = [];
export const MOCK_CRM_CONTACTS: CRMContact[] = [];
export const MOCK_CRM_ACTIVITIES: CRMActivity[] = [];
export const MOCK_EMAIL_SEQUENCES: EmailSequence[] = [];
export const MOCK_EMAIL_MESSAGES: EmailMessage[] = [];
export const MOCK_TOP_PAGES: any[] = [];
export const MOCK_NEWS: DashboardNews[] = [
    {
        id: '1',
        title: 'Nueva Estructura VSL Optimizada',
        content: 'Hemos actualizado el motor de IA para generar guiones de video más persuasivos.',
        date: '07/06/2025',
        iconType: 'update'
    },
    {
        id: '2',
        title: 'Tip de la IA: Tasa de Rebote',
        content: 'Optimiza las imágenes para mejorar el posicionamiento SEO.',
        date: '06/06/2025',
        iconType: 'ia'
    }
];
