import { BookOpen, Sparkles, Users, MessageCircle, Target } from 'lucide-react';

/* */ /* Actualización: Enriquecimiento de la interfaz ProjectMasterStrategy con campos de profundidad psicológica: manifestación diaria, razón emocional y etapas de consciencia - 15/06/2024 19:00 */
// --- INTERFAZ MAESTRA ---
export interface ProjectMasterStrategy {
    meta: {
        projectName: string;
        shortDescription?: string; // Nuevo: Descripción corta persuasiva para las tarjetas
        createdAt: string;
        niche: string;
        productType: string;
        objective: string;
        price: number;
        commissionRate: number;
        projection: number[];
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
        buyingPsychology: {
            notBuyingReasons: Array<{ title: string; description: string; detail?: string }>;
            buyingReasons: Array<{ title: string; description: string }>;
            strategistConclusion: string;
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
        ////////// Actualización: Nueva Secuencia de Lanzamiento de WhatsApp de 14 días - 01/01/2026 10:00 //////////
        whatsappLaunch?: Array<{
            id: string;
            name: string;
            moment: string;
            objective: string;
            messages: Array<{ role: 'agent' | 'user'; text: string }>;
        }>;
        ////////// Fin de actualización //////////
    };
}
/* Fin de actualización - 15/06/2024 19:00 */

// --- PLANTILLA POR DEFECTO ---
export const DEFAULT_STRATEGY_TEMPLATE: ProjectMasterStrategy = {
    meta: {
        projectName: "",
        shortDescription: "",
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
        buyingPsychology: {
            notBuyingReasons: [],
            buyingReasons: [],
            strategistConclusion: ""
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
        whatsappLaunch: []
    }
};