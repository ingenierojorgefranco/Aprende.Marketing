import { BookOpen, Sparkles, Users, MessageCircle, Target } from 'lucide-react';

/* */ /* Actualización: Enriquecimiento de la interfaz ProjectMasterStrategy con campos de profundidad psicológica: manifestación diaria, razón emocional y etapas de consciencia - 15/06/2024 19:00 */
// --- INTERFAZ MAESTRA ---
export interface ProjectMasterStrategy {
    meta: {
        projectName: string;
        createdAt: string;
        niche: string;
        productType: string;
        objective: string;
        price: number;
        commissionRate: number;
        projection: number[];
        shortDescription?: string;
        summary?: {
            primaryObjective: string;
            systemAction: string;
            salesMethod: string;
            targetAudienceSummary: string;
            targetAgeRange: string;
        };
        insights: {
            overview: { title: string; items: any[] };
            niche: { title: string; description: string };
            product: { title: string; description: string };
            objective: { title: string; description: string };
        };
    };
    avatars: Array<{
        id: number;
        name: string;
        archetype: string;
        age: string;
        quote: string;
        pain: string;
        daily_manifestation: string; // Nuevo: Manifestación diaria del dolor
        desire: string;
        emotional_reason: string;    // Nuevo: El para qué emocional del deseo
        objection: string;
        interests: string; 
        behavior: string;  
        motivations: { dinero: number; tiempo: number; estatus: number; seguridad: number };
    }>;
    psychology: {
        pains: string[];
        solutions: string[];
        awarenessStages: {
            stage1_pain: string;
            stage2_solution: string;
            stage3_barrier: string;
        };
        // Nuevo objeto para estrategia de conversión independiente
        conversionStrategy: {
            mainFocus: Array<{ label: string; description: string }>;
            tacticalNote: string;
        };
        psychographicProfile?: {
            ageRange: string;
            interests: string;
            primaryDesire: string;
            digitalBehavior: string;
            mainBarrier: string;
        };
    };
    modules: {
        web: {
            landingPageTabs: any;
            thankYouPageTabs: any;
        };
        content: Array<{
            id: number;
            title: string;
            traffic: number;
            difficulty: number;
            keyword: string;
            searchVolume: string | number;
            objective: string;
            strategy: string;
        }>;
        emails: {
            nurture: Array<any>;
            evergreen: Array<any>;
        };
        whatsapp: Array<any>;
        whatsappLaunch?: Array<any>;
        ////////// Actualización: Integración de testimonios dinámicos en la estrategia - 08/01/2026 //////////
        testimonials?: Array<{
            name: string;
            text: string;
        }>;
        ////////// Fin de actualización //////////
    };
}
/* Fin de actualización - 15/06/2024 19:00 */

// --- PLANTILLA POR DEFECTO ---
export const DEFAULT_STRATEGY_TEMPLATE: ProjectMasterStrategy = {
    meta: {
        projectName: "",
        createdAt: new Date().toLocaleDateString(),
        niche: "",
        productType: "",
        objective: "",
        price: 0,
        commissionRate: 0,
        projection: Array(12).fill(0),
        insights: {
            overview: { title: "Estrategia General", items: [] },
            niche: { title: "Análisis de Nicho", description: "" },
            product: { title: "Rentabilidad", description: "" },
            objective: { title: "Método de Cierre", description: "" }
        }
    },
    avatars: [],
    psychology: {
        pains: [],
        solutions: [],
        awarenessStages: {
            stage1_pain: "",
            stage2_solution: "",
            stage3_barrier: ""
        },
        conversionStrategy: {
            mainFocus: [],
            tacticalNote: ""
        },
        psychographicProfile: {
            ageRange: "",
            interests: "",
            primaryDesire: "",
            digitalBehavior: "",
            mainBarrier: ""
        }
    },
    modules: {
        web: {
            landingPageTabs: {},
            thankYouPageTabs: {}
        },
        content: [],
        emails: { nurture: [], evergreen: [] },
        whatsapp: [],
        testimonials: []
    }
};