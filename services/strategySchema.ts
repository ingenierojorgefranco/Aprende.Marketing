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
        buyingPsychology: {
            notBuyingReasons: [],
            buyingReasons: [],
            strategistConclusion: ""
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
        whatsapp: []
    }
};

/* */ /* Actualización: Enriquecimiento de MOCK_MASTER_STRATEGY con datos reales de profundidad psicológica (Manifestación diaria, Etapas de consciencia, etc.) - 15/06/2024 19:10 */
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
            daily_manifestation: "Se siente frustrada al final del mes cuando ve que sus ahorros no crecen a pesar de trabajar sin descanso.",
            desire: "Generar ingresos propios ofreciendo servicios de alto valor",
            emotional_reason: "Sentirse libre financieramente para no tener que dar explicaciones de sus gastos y tener estabilidad.",
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
            daily_manifestation: "Siente envidia sana al ver a colegas en redes sociales viajando gracias a sus servicios premium.",
            desire: "Rentabilidad y Escalar",
            emotional_reason: "Ser reconocida como la mejor experta en su zona y elevar su estatus social.",
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
            daily_manifestation: "Le duele tener que pedir dinero a su pareja para gastos personales básicos del hogar.",
            desire: "Seguridad y Flexibilidad",
            emotional_reason: "Recuperar su identidad profesional más allá de ser solo mamá.",
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
            "Técnica de alta rentabilidad que permite cobrar lo que realmente vales por menos tiempo de trabajo. Maximiza tu tiempo generando servicios de alto impacto económico.",
            "Certificación profesional y acompañamiento que eliminan todo temor a cometer errores técnicos.",
            "Metodología 100% práctica basada en resultados reales, con soporte paso a paso.",
            "Estrategia probada de captación de clientes en Instagram para llenar tu agenda con seguridad.",
            "Plan de negocio detallado para convertir tu talento en una empresa de estética rentable.",
            "Hoja de ruta para el autoempleo de alto valor, dándote la libertad de ser tu propia jefa.",
            "Formación técnica de primer nivel que cumple lo que promete y te prepara para el éxito real."
        ],
        awarenessStages: {
            stage1_pain: "Frustración por trabajar jornadas agotadoras sin estabilidad económica real.",
            stage2_solution: "Sabe que el Microblading Hiperrealista es la técnica mejor pagada y más demandada.",
            stage3_barrier: "Miedo a no tener acompañamiento práctico y desconfianza en la educación online básica."
        },
        buyingPsychology: {
            notBuyingReasons: [
                { title: "Duda de la factibilidad", description: "Teme que su falta de experiencia previa sea un impedimento real para aprender una técnica tan compleja.", detail: "Cree que necesita ser dibujante profesional para tener éxito." },
                { title: "Falta de claridad", description: "No visualiza cómo pasará de su situación actual a generar ingresos reales de forma segura.", detail: "Le preocupa no saber cómo montar el estudio físico." },
                { title: "Riesgo percibido", description: "Siente que puede perder la inversión en el curso si no logra dominar la pluma manual (tébori).", detail: "Teme arruinar la cara de alguien y enfrentar problemas legales." }
            ],
            buyingReasons: [
                { title: "Siente Seguridad", description: "Percibe que el acompañamiento paso a paso minimiza cualquier riesgo de error técnico." },
                { title: "Percibe Autoridad", description: "Nota que la metodología está avalada por years de práctica y miles de alumnas exitosas." },
                { title: "Visualiza el Éxito", description: "Se ve logrando independencia financiera y manejando su propio estudio de belleza." },
                { title: "Respaldo Total", description: "Siente que la comunidad and el soporte resolverán cualquier duda en tiempo real." }
            ],
            strategistConclusion: "El mensaje se enfocará en seguridad, respaldo, práctica real y resultados. Evitaremos promesas exageradas para generar confianza genuina atacando su principal miedo: la desconfianza en la formación online tradicional."
        },
        conversionStrategy: {
            mainFocus: [
                { label: "Mensaje Directo", description: "Empatía sin rodeos sobre la inestabilidad económica y el miedo técnico." },
                { label: "Autoridad Humana", description: "Liderazgo inspirador basado en resultados reales de alumnas, no solo teoría." },
                { label: "Énfasis Práctico", description: "Foco total en el acompañamiento y la técnica paso a paso para elminar el miedo." }
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
                        { title: "Certificación profesional and acompañamiento que eliminan todo temor a cometer errores técnicos.", desc: "Seguridad absoluta respaldada por expertos in micropigmentación." },
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
                title: "¿Qué es el microblading en cejas?",
                traffic: 50,
                difficulty: 20,
                keyword: "que es microblading cejas",
                searchVolume: "500 - 1K",
                objective: "Educación inicial para el futuro artista",
                strategy: "Definimos la técnica desde una perspectiva profesional para que el alumno entienda el potencial del negocio. Posicionamos el microblading como la habilidad mejor pagada en estética actualmente."
            },
            {
                id: 2,
                title: "¿Qué desventajas tiene el microblading?",
                traffic: 40,
                difficulty: 15,
                keyword: "desventajas de microblading",
                searchVolume: "100 - 500",
                objective: "Transparencia and profesionalismo",
                strategy: "Abordamos los retos y cuidados necesarios con honestidad. El objetivo es filtrar a alumnos comprometidos y demostrar que la formación adecuada elimina la mayoría de estos riesgos."
            },
            {
                id: 3,
                title: "Diferencia entre Microblading, Microshading y Micropigmentación",
                traffic: 65,
                difficulty: 30,
                keyword: "diferencia microblading microshading micropigmentacion",
                searchVolume: "800 - 2K",
                objective: "Claridad técnica y autoridad",
                strategy: "Desglosamos las terminologías para que el alumno aprenda a asesorar a sus futuros clientes. Esto establece una base de autoridad técnica indispensable para cobrar precios premium."
            },
            {
                id: 4,
                title: "¿Cuánto dura el microblading? Realidad y retoques",
                traffic: 75,
                difficulty: 40,
                keyword: "cuánto dura el microblading",
                searchVolume: "2K - 5K",
                objective: "Expectativas y rentabilidad",
                strategy: "Explicamos el ciclo de vida del servicio. Esto ayuda al alumno a entender la necesidad de retoques y cómo fidelizar clientes para generar ingresos recurrentes en su negocio."
            },
            {
                id: 5,
                title: "¿Cuánto suele costar el microblading de cejas?",
                traffic: 85,
                difficulty: 50,
                keyword: "microblading cejas precio",
                searchVolume: "1.5K - 3K",
                objective: "Análisis de mercado y viabilidad",
                strategy: "Mostramos el rango de precios del mercado para que el alumno visualice su retorno de inversión. Motivamos la profesionalización como vía para cobrar en el rango más alto."
            },
            {
                id: 6,
                title: "Microblading: El proceso de curación en los primeros 10 días",
                traffic: 30,
                difficulty: 10,
                keyword: "curacion microblading dia a dia",
                searchVolume: "300 - 600",
                objective: "Conocimiento del proceso de curación",
                strategy: "Es fundamental que el artista sepa qué esperar. Educamos sobre la fase de oscurecimiento y regeneración para que el alumno pueda dar seguridad total a sus clientes."
            },
            {
                id: 7,
                title: "¿Cuánto cuesta un microblading para cejas?",
                traffic: 80,
                difficulty: 45,
                keyword: "precio de micropigmentación de cejas",
                searchVolume: "1K - 2.5K",
                objective: "Posicionamiento High Ticket",
                strategy: "Comparamos el costo del servicio vs la rentabilidad para el artista. Enfocamos el contenido en cómo vender el valor del resultado final en lugar de competir por el precio más bajo."
            },
            {
                id: 8,
                title: "Guía de cuidados: ¿Cuántos días proteger el microblading?",
                traffic: 55,
                difficulty: 25,
                keyword: "cuidados microblading cejas",
                searchVolume: "500 - 1.2K",
                objective: "Bioseguridad y éxito del procedimiento",
                strategy: "Un artista profesional se diferencia por su protocolo post-venta. Establecemos los estándares de oro en cuidados para garantizar la máxima retención del pigmento."
            },
            {
                id: 9,
                title: "¿Qué opinan los dermatólogos del microblading?",
                traffic: 25,
                difficulty: 15,
                keyword: "seguridad microblading dermatologos",
                searchVolume: "200 - 400",
                objective: "Derribar miedos de salud",
                strategy: "Aportamos validación médica sobre la seguridad de la técnica cuando se realiza con pigmentos certificados y normas de higiene, calmando las dudas de seguridad del alumno."
            },
            {
                id: 10,
                title: "¿Por qué no deberías hacerte el microblading de cejas?",
                traffic: 20,
                difficulty: 5,
                keyword: "contraindicaciones microblading",
                searchVolume: "400 - 900",
                objective: "Filtro de clientes y ética profesional",
                strategy: "Utilizamos el 'marketing negativo' para explicar contraindicaciones reales. Esto enseña al alumno a ser un profesional ético que sabe cuándo decir 'no', aumentando su prestigio."
            },
            {
                id: 11,
                title: "¿Cuándo no se recomienda el microblading?",
                traffic: 15,
                difficulty: 5,
                keyword: "casos donde no hacer microblading",
                searchVolume: "150 - 300",
                objective: "Prevención y seguridad legal",
                strategy: "Listamos casos clínicos (embarazo, diabetes no controlada, etc.) donde se desaconseja la técnica. Vital para que el alumno opere con seguridad y evite complicaciones legales."
            },
            {
                id: 12,
                title: "¿Cuál es la ceja permanente de aspecto más natural?",
                traffic: 45,
                difficulty: 20,
                keyword: "cejas naturales permanentes",
                searchVolume: "500 - 1K",
                objective: "Venta del beneficio estético",
                strategy: "Enfatizamos el trazo hiperrealista del microblading frente a técnicas más pesadas. Orientamos al alumno a especializarse en la naturalidad, que es lo más demandado hoy."
            },
            {
                id: 13,
                title: "Comparativa: ¿Cejas pelo a pelo o Microblading?",
                traffic: 50,
                difficulty: 20,
                keyword: "cejas pelo a pelo vs microblading",
                searchVolume: "600 - 1.5K",
                objective: "Claridad en la oferta de servicios",
                strategy: "Aclara la confusión común entre extensiones de cejas y microblading. Help al alumno a definir su catálogo de servicios y a educar al mercado sobre la superioridad del microblading."
            }
        ],
        emails: {
            nurture: [
                {
                    id: 1,
                    day: "Día 0",
                    subject: "🎁 Tu regalo: Guía de Inicio Rápido en Microblading",
                    type: "Entrega de Valor",
                    objective: "Establecer reciprocidad y cumplir la promesa inmediata entregando el Lead Magnet.",
                    bodyPreview: "Hola [Nombre], tal como te prometí, aquí tienes el acceso directo a la guía..."
                },
                {
                    id: 2,
                    day: "Día 1",
                    subject: "😫 ¿Cansada de trabajar 10h y no ver frutos reales?",
                    type: "Agitación del Dolor",
                    objective: "Conectar emocionalmente con el cansancio sistémico del avatar.",
                    bodyPreview: "Hola [Nombre], entiendo perfectamente esa sensación de darlo todo..."
                },
                {
                    id: 3,
                    day: "Día 2",
                    subject: "📈 Cómo Maria pasó de 0 a $2,000/mes con cejas",
                    type: "Prueba Social",
                    objective: "Demostrar factibilidad mediante un caso de éxito real.",
                    bodyPreview: "Hola [Nombre], hoy quiero contarte la historia de una de mis alumnas..."
                },
                {
                    id: 4,
                    day: "Día 3",
                    subject: "💎 La verdad sobre el Microblading (y por qué otros fallan)",
                    type: "Mecanismo Único",
                    objective: "Explicar la diferenciación del Método Brows360.",
                    bodyPreview: "Hola [Nombre], ¿sabes por qué muchas esteticistas no logran resultados?"
                },
                {
                    id: 5,
                    day: "Día 4",
                    subject: "🚀 ¡INSCRIPCIONES ABIERTAS! Domina la Certificación Pro",
                    type: "Lanzamiento / Oferta",
                    objective: "Presentar oficialmente el programa completo con todos los beneficios.",
                    bodyPreview: "Hola [Nombre], llegó el momento. Las puertas están abiertas..."
                },
                {
                    id: 6,
                    day: "Día 5",
                    subject: "⏳ Tus 3 Bonos Exclusivos expiran en pocas horas...",
                    type: "Escasez / Valor",
                    objective: "Añadir presión positiva mediante la pérdida de bonos adicionales.",
                    bodyPreview: "Hola [Nombre], no quiero que te quedes fuera de los bonos..."
                },
                {
                    id: 7,
                    day: "Día 6",
                    subject: "⚠️ ÚLTIMA LLAMADA: Tu futuro profesional empieza hoy",
                    type: "Cierre / Urgencia",
                    objective: "Llamada final a la acción antes del cierre de inscripciones.",
                    bodyPreview: "Hola [Nombre], esta es mi última invitación. Mañana el precio subirá..."
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
/* Fin de actualización - 15/06/2024 19:10 */