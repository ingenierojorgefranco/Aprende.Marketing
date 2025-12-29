
import { BookOpen, Sparkles, Users, MessageCircle, Target } from 'lucide-react';

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
        desire: string;
        objection: string;
        interests: string; 
        behavior: string;  
        motivations: { dinero: number; tiempo: number; estatus: number; seguridad: number };
    }>;
    psychology: {
        pains: string[];
        solutions: string[];
        powerWords: string[];
        awarenessStages: {
            stage1_pain: string;
            stage2_solution: string;
            stage3_barrier: string;
        };
        buyingPsychology: {
            notBuyingReasons: Array<{ title: string; description: string }>;
            buyingReasons: Array<{ title: string; description: string }>;
            strategistConclusion: string;
        };
        // Nuevo objeto para estrategia de conversión independiente
        conversionStrategy: {
            mainFocus: Array<{ label: string; description: string }>;
            prioritizedChannels: Array<{ label: string; type: 'LP' | 'WA' | 'EM' | string }>;
            communicationStyle: Array<{ label: string; description: string }>;
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
            objective: string;
            strategy: string;
        }>;
        emails: {
            nurture: Array<any>;
            evergreen: Array<any>;
        };
        whatsapp: Array<any>;
    };
}

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
        powerWords: [],
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
        conversionStrategy: {
            mainFocus: [],
            prioritizedChannels: [],
            communicationStyle: [],
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
        whatsapp: []
    }
};

// --- DATOS MOCK CENTRALIZADOS (ACTUALIZADOS CON BENEFICIOS SINCRONIZADOS Y DESCRIPCIONES) ---
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
                description: "El nicho de belleza es un mercado 'Evergreen', resistente a crisis. La demanda de servicios estéticos semi-permanentes ha crecido un 40% anual."
            },
            product: {
                title: "¿Cuánto vas a ganar?",
                description: "Este es un producto de $200 USD. Tu ganancia por venta es de $116.81 (65% de comisión)."
            },
            objective: {
                title: "¿Cómo vas a ganar?",
                description: "Implementando un ecosistema de venta directa donde atraemos tráfico cualificado y lo convertimos mediante una oferta de alto valor."
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
            pain: "Trabajas jornadas agotadoras de más de 10 horas, pero al final del mes tu cuenta bancaria no refleja tu enorme esfuerzo.",
            desire: "Generar ingresos propios ofreciendo servicios de alto valor",
            objection: "Desconfía de promesas vacías en cursos online",
            motivations: { dinero: 90, tiempo: 80, estatus: 70, seguridad: 60 }
        },
        {
            id: 2,
            name: "Mónica \"La Profesional\"",
            archetype: "Esteticista Activa",
            age: "30-45 años",
            quote: "Necesito un servicio ticket alto para facturar más.",
            interests: "Marketing estético, técnicas avanzadas",
            behavior: "Facebook Groups, WhatsApp",
            pain: "Techo de cristal en ingresos",
            desire: "Rentabilidad y Escalar",
            objection: "No tengo tiempo para estudiar",
            motivations: { dinero: 95, tiempo: 60, estatus: 70, seguridad: 80 }
        },
        {
            id: 3,
            name: "Ana \"La Mamá Reinvitadora\"",
            archetype: "Madre Emprendedora",
            age: "28-38 años",
            quote: "Busco independencia financiera para estar con mis hijos.",
            interests: "Belleza, emprendimiento desde casa",
            behavior: "Instagram, TikTok",
            pain: "Dependencia económica",
            desire: "Seguridad y Flexibilidad",
            objection: "Miedo a la inversión inicial",
            motivations: { dinero: 70, tiempo: 100, estatus: 50, seguridad: 90 }
        }
    ],
    psychology: {
        pains: [
            "Trabajas jornadas agotadoras de más de 10 horas, pero al final del mes tu cuenta bancaria no refleja tu enorme esfuerzo.",
            "Sientes un nudo en el estómago por el miedo a cometer un error en el rostro de una clienta y arruinar tu reputación.",
            "Has gastado dinero en cursos que solo te dieron teoría aburrida, pero te dejaron sola a la hora de practicar.",
            "Ves pasar oportunidades de éxito en Instagram, pero te falta la guía técnica para dar el paso con seguridad.",
            "Te apasiona la estética pero no sabes cómo convertir esa pasión en un negocio de autoempleo rentable.",
            "Estás cansada de trabajar para otros y deseas fervientemente generar tus propios ingresos premium.",
            "Te detiene el miedo a las promesas vacías de internet que no enseñan nada realmente útil para tu futuro."
        ],
        solutions: [
            "Técnica de alta rentabilidad que permite cobrar lo que realmente vales por menos tiempo de trabajo.",
            "Certificación profesional y acompañamiento que eliminan todo temor a cometer errores técnicos.",
            "Metodología 100% práctica basada en resultados reales, con soporte paso a paso.",
            "Estrategia probada de captación de clientes en Instagram para llenar tu agenda con seguridad.",
            "Plan de negocio detallado para convertir tu talento en una empresa de estética rentable.",
            "Hoja de ruta para el autoempleo de alto valor, dándote la libertad de ser tu propia jefa.",
            "Formación técnica de primer nivel que cumple lo que promete y te prepara para el éxito real."
        ],
        powerWords: ["Ingresos Propios", "Alto Valor", "Confianza Real", "Autoempleo", "Garantizado", "Estética Profesional"],
        awarenessStages: {
            stage1_pain: "Frustración por trabajar jornadas agotadoras sin estabilidad económica real.",
            stage2_solution: "Sabe que el Microblading Hiperrealista es la técnica mejor pagada y más demandada.",
            stage3_barrier: "Miedo a no tener acompañamiento práctico y desconfianza en la educación online básica."
        },
        buyingPsychology: {
            notBuyingReasons: [
                { title: "Duda de la factibilidad", description: "Teme que su falta de experiencia previa sea un impedimento real para aprender una técnica tan compleja." },
                { title: "Falta de claridad", description: "No visualiza cómo pasará de su situación actual a generar ingresos reales de forma segura." },
                { title: "Riesgo percibido", description: "Siente que puede perder la inversión en el curso si no logra dominar la pluma manual (tébori)." }
            ],
            buyingReasons: [
                { title: "Siente Seguridad", description: "Percibe que el acompañamiento paso a paso minimiza cualquier riesgo de error técnico." },
                { title: "Percibe Autoridad", description: "Nota que la metodología está avalada por years de práctica y miles de alumnas exitosas." },
                { title: "Visualiza el Éxito", description: "Se ve logrando independencia financiera y manejando su propio estudio de belleza." },
                { title: "Respaldo Total", description: "Siente que la comunidad y el soporte resolverán cualquier duda en tiempo real." }
            ],
            strategistConclusion: "El mensaje se enfocará en seguridad, respaldo, práctica real y resultados. Evitaremos promesas exageradas para generar confianza genuina atacando su principal miedo: la desconfianza en la formación online tradicional."
        },
        conversionStrategy: {
            mainFocus: [
                { label: "Mensaje Directo", description: "Empatía sin rodeos sobre la inestabilidad económica y el miedo técnico." },
                { label: "Autoridad Humana", description: "Liderazgo inspirador basado en resultados reales de alumnas, no solo teoría." },
                { label: "Énfasis Práctico", description: "Foco total en el acompañamiento y la técnica paso a paso para elminar el miedo." }
            ],
            prioritizedChannels: [
                { label: "Landing Page (Captación)", type: "LP" },
                { label: "WhatsApp (Canal de Cierre)", type: "WA" },
                { label: "Email (Refuerzo & Seguimiento)", type: "EM" }
            ],
            communicationStyle: [
                { label: "Educativa + Emocional", description: "Enseñamos el potencial del negocio mientras conectamos con su deseo de independencia." },
                { label: "Lenguaje Cercano", description: "Claridad profesional sin tecnicismos para no intimidar a las principiantes." },
                { label: "Cercanía Total", description: "Hablar como una mentora que ya recorrió el camino y entiende sus miedos." }
            ],
            tacticalNote: "Este flujo está diseñado para calentar al prospecto en la Landing Page y llevarlo a WhatsApp, donde la tasa de cierre es 10 veces mayor para productos de alto valor. El sistema usará un lenguaje que evite tecnicismos para no intimidar al avatar Laura."
        },
        psychographicProfile: {
            ageRange: "Mujer entre 22 y 38 años",
            interests: "Interesada en estética, belleza y autoempleo",
            primaryDesire: "Desea generar ingresos propios ofreciendo servicios de alto valor",
            digitalBehavior: "Consume contenido en Instagram y WhatsApp",
            mainBarrier: "Ha considerado cursos online, pero desconfía de promesas vacías aaaa"
        }
    },
    modules: {
        web: {
            landingPageTabs: {
                hero: {
                    label: "1. Encabezado",
                    title: "Promesa de Valor (Hero Section)",
                    type: 'hero',
                    h1: "Domina el Arte del Microblading y Genera Ingresos Propios de Alto Valor",
                    h2: "La oportunidad perfecta para emprendedoras del sector belleza que buscan independencia financiera sin trucos ni promesas vacías.",
                    strategyText: "Este titular conecta directamente con el deseo de generar ingresos propios, filtrando a las personas que buscan resultados fáciles y atrayendo a las que valoran el autoempleo de calidad."
                },
                pain: {
                    label: "2. Dolores",
                    title: "Identificación del Problema",
                    type: 'pain',
                    items: [
                        "Trabajas jornadas agotadoras de más de 10 horas, pero al final del mes tu cuenta bancaria no refleja tu enorme esfuerzo.",
                        "Sientes un nudo en el estómago por el miedo a cometer un error en el rostro de una clienta y arruinar tu reputación.",
                        "Has gastado dinero en cursos que solo te dieron teoría aburrida, pero te dejaron sola a la hora de practicar.",
                        "Ves pasar oportunidades de éxito en Instagram, pero te falta la guía técnica para dar el paso con seguridad.",
                        "Te apasiona la estética pero no sabes cómo convertir esa pasión en un negocio de autoempleo rentable.",
                        "Estás cansada de trabajar para otros y deseas fervientemente generar tus propios ingresos premium.",
                        "Te detiene el miedo a las promesas vacías de internet que no enseñan nada realmente útil para tu futuro."
                    ],
                    strategyText: "Al mencionar detalladamente estos 7 dolores, validamos el sentimiento del usuario y nos diferenciamos como una opción seria que entiende su realidad."
                },
                benefits: {
                    label: "3. Beneficios",
                    title: "Oferta Irresistible",
                    type: 'benefits',
                    items: [
                        { title: "Técnica de alta rentabilidad que permite cobrar lo que realmente vales por menos tiempo de trabajo.", desc: "Maximiza tu tiempo generando servicios de alto impacto económico." },
                        { title: "Certificación profesional y acompañamiento que eliminan todo temor a cometer errores técnicos.", desc: "Seguridad absoluta respaldada por expertos en micropigmentación." },
                        { title: "Metodología 100% práctica basada en resultados reales, con soporte paso a paso.", desc: "No más teoría vacía; aprende haciendo con modelos reales." },
                        { title: "Estrategia probada de captación de clientes en Instagram para llenar tu agenda con seguridad.", desc: "Tu agenda llena desde la primera semana gracias a nuestro método de marketing." },
                        { title: "Plan de negocio detallado para convertir tu talento en una empresa de estética rentable.", desc: "Te enseñamos a escalar tu talento y construir un negocio sólido." },
                        { title: "Hoja de ruta para el autoempleo de alto valor, dándote la libertad de ser tu propia jefa.", desc: "Toma el control total de tu carrera profesional y financiera." },
                        { title: "Formación técnica de primer nivel que cumple lo que promete y te prepara para el éxito real.", desc: "Educación de élite diseñada para resultados inmediatos en el mercado." }
                    ],
                    strategyText: "Enfocamos los beneficios en la libertad y la calidad técnica para satisfacer la necesidad de autoempleo genuino del avatar."
                }
            },
            thankYouPageTabs: {
                header: {
                    label: "1. Confirmación",
                    title: "Mensaje de Éxito",
                    type: 'header',
                    content: {
                        h1: "¡Bienvenida al inicio de tu independencia financiera!",
                        h2: "Has tomado la mejor decisión para tu carrera en el sector de la belleza."
                    },
                    strategyText: "Reforzamos la idea de 'independencia' para mantener la motivación del avatar en su punto más alto."
                },
                action: {
                    label: "2. Siguiente Paso",
                    title: "Redirección a Comunidad",
                    type: 'action',
                    content: {
                        h1: "Conéctate a nuestro WhatsApp Estratégico",
                        h2: "Es el canal principal donde resolveremos tus dudas y entregaremos el material de estudio."
                    },
                    strategyText: "Aprovechamos que el usuario consume contenido en WhatsApp para asegurar la entrada a la comunidad."
                },
                magnet: {
                    label: "3. Lead Magnet",
                    title: "Guía de Inicio Rápido",
                    type: 'magnet',
                    content: {
                        h1: "Descarga tu Plan de Negocios en Estética",
                        h2: "El primer paso práctico para empezar a ofrecer servicios de alto valor."
                    },
                    strategyText: "Entregamos valor inmediato que ataca la parálisis por análisis del avatar principiante."
                }
            }
        },
        content: [
            {
                id: 1,
                title: "Cómo construir un negocio de belleza desde cero sin caer en promesas vacías",
                traffic: 85,
                difficulty: 30,
                keyword: "negocio belleza autoempleo",
                objective: "Generar confianza y autoridad.",
                strategy: "Atacamos frontalmente la desconfianza del avatar, educándolo sobre lo que realmente se necesita para emprender con éxito en estética."
            },
            {
                id: 2,
                title: "Microblading: La técnica de alto valor para generar ingresos propios in 2025",
                traffic: 95,
                difficulty: 60,
                keyword: "ingresos propios microblading",
                objective: "Mostrar la rentabilidad real.",
                strategy: "Desglosamos por qué esta técnica es la mejor opción para el autoempleo de alto valor comparado con otros servicios menores."
            }
        ],
        emails: {
            nurture: [
                {
                    id: 1,
                    day: "Día 0",
                    subject: "Lo prometido: Tu guía para generar ingresos en estética 💄",
                    type: "Entrega de Valor",
                    objective: "Establecer reciprocidad y cumplir la promesa inmediata.",
                    bodyPreview: "Hola [Nombre], aquí tienes el plan que estabas esperando para empezar tu camino hacia el autoempleo de alto valor..."
                }
            ],
            evergreen: [
                {
                    id: 8,
                    day: "Día 8",
                    subject: "¿Cansada de las promesas vacías en cursos online?",
                    type: "Educativo",
                    objective: "Empatizar con el miedo del cliente y posicionar el curso como la solución real.",
                    bodyPreview: "Hola [Nombre], sé que has visto muchos anuncios. Hoy quiero contarte qué hace diferente a nuestra formación técnica..."
                }
            ]
        },
        whatsapp: [
            {
                id: 1,
                title: "👋 Bienvenida e Interés",
                objective: "Conectar por el canal preferido del avatar.",
                messages: [
                    { role: "agent", text: "Hola, bienvenida. Vi que te interesa el autoempleo en estética. ¿Tienes experiencia previa o empiezas de cero?" }
                ]
            }
        ]
    }
};
