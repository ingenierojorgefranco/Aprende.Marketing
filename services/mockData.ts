



import { User, Project, LandingPage, Article, Lead, GeneratedPageContent, Course, Comment, ProjectMasterStrategy, CRMContact, CRMActivity } from "../types";
import { BookOpen, Sparkles, Users, MessageCircle, Target, Zap, MousePointerClick } from 'lucide-react';

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

// --- MOCK CRM DATA ---
export const MOCK_CRM_CONTACTS: CRMContact[] = [
    {
        id: "crm-1",
        name: "María Garcia",
        email: "maria@example.com",
        phone: "+57 300 123 4567",
        country: "Colombia",
        address: "Calle 100 #15-20, Bogotá",
        source: "Landing Principal Microblading",
        status: "new",
        interestLevel: "warm",
        lastContactedAt: new Date(Date.now() - 86400000), // 1 day ago
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date()
    },
    {
        id: "crm-2",
        name: "Carlos Pérez",
        email: "carlos@example.com",
        phone: "+52 55 9876 5432",
        country: "México",
        address: "",
        source: "Webinar Registro",
        status: "contacted",
        interestLevel: "hot",
        lastContactedAt: new Date(),
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        updatedAt: new Date()
    },
    {
        id: "crm-3",
        name: "Ana López",
        email: "ana@example.com",
        phone: "+34 600 123 123",
        country: "España",
        source: "Manual",
        status: "closed",
        interestLevel: "hot",
        createdAt: new Date(Date.now() - 604800000), // 7 days ago
        updatedAt: new Date()
    },
    {
        id: "crm-4",
        name: "Laura Martínez",
        email: "laura.martinez@test.com",
        phone: "+1 305 123 4567",
        country: "USA",
        source: "Instagram Ads",
        status: "interested",
        interestLevel: "warm",
        createdAt: new Date(Date.now() - 432000000), // 5 days ago
        updatedAt: new Date()
    }
];

export const MOCK_CRM_ACTIVITIES: CRMActivity[] = [
    { id: "act-1", contactId: "crm-1", type: "lead_submission", content: "Se registró en la Landing Page 'Landing Principal Microblading'", createdAt: new Date(Date.now() - 172800000) },
    { id: "act-2", contactId: "crm-1", type: "note", content: "Nota: Dice que le interesa pagar en cuotas. Volver a contactar mañana.", createdAt: new Date(Date.now() - 86400000) },
    { id: "act-3", contactId: "crm-2", type: "lead_submission", content: "Se registró en Webinar", createdAt: new Date(Date.now() - 259200000) },
    { id: "act-4", contactId: "crm-2", type: "status_change", content: "Cambio de estado: Nuevo -> Contactado", createdAt: new Date() },
    { id: "act-5", contactId: "crm-3", type: "lead_submission", content: "Ingresado Manualmente", createdAt: new Date(Date.now() - 604800000) },
    { id: "act-6", contactId: "crm-3", type: "status_change", content: "Cambio de estado: Interesado -> Cliente", createdAt: new Date() },
    { id: "act-7", contactId: "crm-3", type: "note", content: "Cliente VIP. Compró el paquete completo.", createdAt: new Date() }
];

// --- MOCK MASTER STRATEGY (Datos Centralizados del Dashboard) ---
export const MOCK_MASTER_STRATEGY: ProjectMasterStrategy = {
    meta: {
        projectName: "Masterclass Microblading Pro",
        createdAt: "14 Oct, 2023",
        niche: "Belleza y Estética",
        productType: "Curso Online (High Ticket)",
        objective: "Venta Directa (Crash Strategy)",
        insights: {
            overview: {
                title: "Estrategia para vender en automático",
                items: [
                    { label: "Producto", value: "Curso de Microblading Profesional para Principiantes", icon: BookOpen, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
                    { label: "Nicho", value: "Belleza y estética", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                    { label: "Público Objetivo", value: "Mujeres entre 22 y 45 años", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { label: "Estrategia", value: "Contenido educativo + cierre por WhatsApp", icon: MessageCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                    { label: "Objetivo del Sistema", value: "Generar leads cualificados y convertirlos en ventas de forma conversacional", icon: Target, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }
                ]
            },
            niche: {
                title: "Potencial del Nicho: Belleza",
                description: "El nicho de belleza es un mercado 'Evergreen' (siempre verde), resistente a crisis. Específicamente, el microblading tiene una barrera de entrada técnica que justifica precios altos. La demanda de servicios estéticos semi-permanentes ha crecido un 40% anual. Tu oportunidad está en enseñar 'negocio' además de 'técnica', algo que la competencia ignora."
            },
            product: {
                title: "¿Cuánto vas a ganar?",
                description: "Este es un producto de $200 USD. Tu ganancia por venta a precio full es de $116.81 (65% de comisión). Nuestra estrategia principal es vender a este precio para maximizar tu margen. Usaremos descuentos (ganancia de $47) solo esporádicamente para recuperar carritos abandonados, pero tu objetivo es facturar en grande."
            },
            objective: {
                title: "¿Cómo vas a ganar?",
                description: "Vas a ganar implementando un ecosistema de venta directa matemáticamente probado. No dependerás de la suerte ni de perseguir clientes, sino de una estructura lógica donde atraemos tráfico cualificado del nicho de belleza y lo convertimos mediante una oferta irresistible de alto valor percibido, diseñada específicamente para resolver los dolores urgentes de tu avatar."
            }
        }
    },
    avatars: [
        {
            id: 1,
            name: "Laura \"La Soñadora\"",
            archetype: "La Emprendedora Joven",
            age: "22-28 años",
            quote: "Quiero ser mi propia jefa y dejar mi trabajo de oficina, pero me da miedo no tener clientes.",
            pain: "Miedo al fracaso financiero",
            desire: "Libertad y Reconocimiento",
            objection: "¿Seré capaz de aprender esto online?",
            motivations: { dinero: 80, tiempo: 90, estatus: 85, seguridad: 40 }
        },
        {
            id: 2,
            name: "Mónica \"La Profesional\"",
            archetype: "La Esteticista Estancada",
            age: "30-45 años",
            quote: "Ya hago uñas y pestañas, pero necesito un servicio ticket alto para facturar más trabajando menos.",
            pain: "Techo de cristal en ingresos",
            desire: "Rentabilidad y Escalar",
            objection: "No tengo tiempo para estudiar",
            motivations: { dinero: 95, tiempo: 60, estatus: 70, seguridad: 80 }
        },
        {
            id: 3,
            name: "Ana \"La Mamá Reinventada\"",
            archetype: "Buscadora de Ingresos Extra",
            age: "28-38 años",
            quote: "Necesito aportar a la casa sin descuidar a mis hijos. Busco algo flexible.",
            pain: "Dependencia económica",
            desire: "Seguridad y Flexibilidad",
            objection: "¿Es muy cara la inversión inicial?",
            motivations: { dinero: 70, tiempo: 100, estatus: 50, seguridad: 90 }
        }
    ],
    psychology: {
        pains: [
            "Sentir que trabajan mucho por poco dinero (Servicios low-ticket)",
            "Miedo a no ser lo suficientemente buenas o dañar a una clienta",
            "Frustración por cursos anteriores que solo enseñan teoría",
            "Incertidumbre total sobre cómo conseguir las primeras clientes"
        ],
        solutions: [
            "Técnica de alta rentabilidad (Cobras $150/hora vs $15 en uñas)",
            "Certificación Internacional que avala calidad y da seguridad",
            "Método práctico con plantillas de látex (sin riesgo inicial)",
            "Módulo exclusivo de Marketing para Esteticistas (Instagram)"
        ],
        powerWords: ["Rentabilidad", "Libertad", "Experta", "Certificada", "Garantizado", "Exclusivo", "Tendencia", "Alta Demanda"]
    },
    modules: {
        web: {
            landingPageTabs: {
                hero: {
                    label: "1. Encabezado",
                    title: "Promesa de Valor (Hero Section)",
                    type: 'hero',
                    h1: "Domina el Arte del Microblading 3D y Triplica tus Ingresos en 30 Días",
                    h2: "Descubre la técnica 'Pelo a Pelo' que está revolucionando la industria de la belleza. Sin experiencia previa y con baja inversión inicial.",
                    strategyText: "Nuestra inteligencia artificial ha analizado tu nicho y ha definido este titular como la opción más potente. Está diseñado psicológicamente para detener el scroll, atacar el deseo principal de tu avatar y filtrar a los curiosos, atrayendo solo a compradores potenciales."
                },
                pain: {
                    label: "2. Dolores",
                    title: "Identificación del Problema",
                    type: 'pain',
                    items: [
                        "Trabajas jornadas agotadoras de más de 10 horas, pero al final del mes tu cuenta bancaria no refleja el enorme esfuerzo que realizas.",
                        "Sientes un nudo en el estómago por el miedo a cometer un error en el rostro de una clienta y arruinar tu reputación para siempre.",
                        "Has gastado dinero en cursos que solo te dieron teoría aburrida, pero te dejaron sola y con manos temblorosas a la hora de practicar.",
                        "Eres excelente en lo que haces, pero no sabes cómo atraer clientas nuevas y dependes solo del 'boca a boca' que no paga las facturas.",
                        "Te frustra ver cómo otras con menos talento cobran el doble que tú, solo porque tienen más confianza en su diseño y técnica."
                    ],
                    strategyText: "Hemos identificado los dolores más agudos de tu cliente ideal. Al mencionarlos explícitamente, creamos una conexión empática inmediata ('me leyeron la mente'), lo cual es el primer paso para que confíen en tu solución."
                },
                benefits: {
                    label: "3. Beneficios",
                    title: "Oferta Irresistible (Lo que obtienes)",
                    type: 'benefits',
                    items: [
                        { title: "Kit Digital Completo", desc: "Acceso a plantillas de práctica imprimibles y manuales en PDF de alta resolución." },
                        { title: "Certificado Internacional", desc: "Diploma avalado para ejercer tu profesión en cualquier país de habla hispana." },
                        { title: "Comunidad Privada", desc: "Acceso de por vida a nuestro grupo de soporte VIP en Telegram." },
                        { title: "Marketing para Esteticistas", desc: "Módulo exclusivo para conseguir tus primeros 10 clientes en Instagram." }
                    ],
                    strategyText: "No vendemos características, vendemos transformación. Estos beneficios han sido redactados para mostrarle a tu cliente exactamente cómo mejorará su vida tras comprar, eliminando la fricción del precio."
                }
            },
            thankYouPageTabs: {
                header: {
                    label: "1. Confirmación",
                    title: "Mensaje de Éxito",
                    type: 'header',
                    content: {
                        h1: "¡Felicidades! Ya eres parte del programa.",
                        h2: "Tu registro ha sido exitoso. Estás a un paso de acceder a todo el material."
                    },
                    strategyText: "El momento post-compra es crítico. Este mensaje está diseñado para validar la decisión del cliente, reducir el remordimiento del comprador y mantener la dopamina alta."
                },
                action: {
                    label: "2. Siguiente Paso",
                    title: "Redirección a Comunidad",
                    type: 'action',
                    content: {
                        h1: "Únete al Grupo VIP de WhatsApp",
                        h2: "Es obligatorio unirte para recibir las notificaciones de las clases y soporte."
                    },
                    strategyText: "La confusión mata la conversión. Aquí damos una instrucción única y clara. Moverlos a un canal íntimo como WhatsApp aumenta tu tasa de cierre en un 300% comparado con el email."
                },
                magnet: {
                    label: "3. Lead Magnet",
                    title: "Regalo de Bienvenida",
                    type: 'magnet',
                    content: {
                        h1: "Descarga tu Ebook Gratuito",
                        h2: "Como regalo de bienvenida, hemos preparado una guía PDF exclusiva para ti. Encuéntrala en el grupo."
                    },
                    strategyText: "Cumplir la promesa de inmediato genera autoridad. Entregamos el Lead Magnet aquí mismo para activar el principio de reciprocidad: ellos sienten que ya ganaron, por lo que están más abiertos a tu oferta de pago."
                }
            }
        },
        content: [
            {
                id: 1,
                title: "Cómo empezar en microblading aunque no tengas experiencia",
                traffic: 85,
                difficulty: 30,
                keyword: "curso microblading principiantes",
                objective: "Derribar la barrera de entrada.",
                strategy: "Hemos analizado las tendencias y detectamos una oportunidad clara. Crearemos este artículo enfocado en la palabra clave 'curso microblading principiantes' con el objetivo de interceptar a usuarios que buscan una solución rápida, posicionándote como la única opción lógica."
            },
            {
                id: 2,
                title: "Cuánto se puede ganar realmente con microblading hoy",
                traffic: 95,
                difficulty: 60,
                keyword: "cuanto gana microblading",
                objective: "Justificar la inversión (ROI).",
                strategy: "La intención de búsqueda aquí es 'financiera'. Crearemos un artículo lógico y matemático que desglose costos vs ganancias para demostrar que el curso se paga solo con los primeros 3 clientes, eliminando el miedo a perder dinero."
            },
            {
                id: 3,
                title: "Los errores más comunes de las principiantes en microblading",
                traffic: 70,
                difficulty: 45,
                keyword: "errores microblading",
                objective: "Generar autoridad y confianza.",
                strategy: "Este contenido ataca el miedo al fracaso. Listaremos errores técnicos graves y presentaremos tu metodología como el único 'seguro de vida' para evitar desastres estéticos que arruinen la reputación de la alumna."
            },
            {
                id: 4,
                title: "Por qué muchos cursos de estética no funcionan (y este sí)",
                traffic: 60,
                difficulty: 20,
                keyword: "mejores cursos microblading",
                objective: "Diferenciación de competencia.",
                strategy: "Contenido comparativo tipo 'Us vs Them'. Atacaremos la debilidad de la competencia (falta de práctica) y resaltaremos tu acompañamiento y kit incluido como la ventaja injusta."
            },
            {
                id: 5,
                title: "Cómo conseguir tus primeras clientas sin tener reputación previa",
                traffic: 90,
                difficulty: 50,
                keyword: "marketing para esteticistas",
                objective: "Resolver el miedo a no vender.",
                strategy: "Aportaremos valor masivo enseñando una estrategia orgánica rápida. Al darles una 'victoria rápida' gratis, activamos la reciprocidad y demostramos que tu curso no solo enseña técnica, sino también negocio."
            }
        ],
        emails: {
            nurture: [
                {
                    id: 1,
                    day: "Día 0",
                    subject: "Acceso Liberado: Tu Guía Maestra de Microblading Rentable 🎁",
                    type: "Entrega de Valor",
                    objective: "El objetivo principal de este correo es cumplir inmediatamente con la promesa que hicimos en el anuncio (el Lead Magnet). Al entregar valor sin pedir nada a cambio en el primer segundo, activamos el gatillo mental de la reciprocidad y establecemos tu autoridad, diferenciándote de la competencia que solo intenta vender desde el primer momento.",
                    bodyPreview: "Hola [Nombre], felicidades por dar el primer paso. Aquí tienes tu guía gratuita. Sé que puede ser abrumador empezar, pero esta hoja de ruta te dará claridad absoluta sobre los pasos que debes seguir para convertirte en una profesional del microblading. No olvides unirte al grupo de WhatsApp para soporte..."
                },
                {
                    id: 2,
                    day: "Día 1",
                    subject: "Por qué el 90% de las esteticistas fallan (y cómo tú no lo harás)",
                    type: "Adoctrinamiento",
                    objective: "Este correo tiene la misión de atacar directamente las creencias limitantes del prospecto sobre el precio. Explicamos lógicamente por qué cobrar barato es un camino hacia el fracaso, elevando así el nivel de consciencia del cliente para que valore la calidad sobre el costo, preparándolo para aceptar una oferta High Ticket.",
                    bodyPreview: "Muchos esteticistas creen que deben cobrar $5 para tener clientes. Hoy te voy a demostrar matemáticamente por qué eso te llevará a la quiebra. Si compites por precio, atraes clientes que solo buscan lo barato, no la calidad. Tu arte merece ser valorado..."
                },
                {
                    id: 3,
                    day: "Día 2",
                    subject: "El método exacto para cobrar $150 USD por hora (Sin ser experta)",
                    type: "Problema/Agitación",
                    objective: "Aquí buscamos agitar el dolor actual del cliente haciéndolo consciente de su estancamiento. No es crueldad, es empatía estratégica: al describir su problema mejor que ellos mismos, asumen automáticamente que tú tienes la solución. Posicionamos tu método como el único vehículo capaz de sacarlos de esa situación.",
                    bodyPreview: "Llevas meses estancada en el mismo nivel de ingresos. ¿Sabes por qué? No es por falta de talento, es por falta de estrategia. Estás atrapada en la operación diaria y olvidando la parte más importante: el sistema de atracción de clientes cualificados..."
                },
                {
                    id: 4,
                    day: "Día 3",
                    subject: "⚠️ Cierre Inminente: Tu oportunidad de libertad financiera expira",
                    type: "Venta / Urgencia",
                    objective: "En este punto, la lógica ya fue establecida. Ahora activamos la emoción mediante la escasez y la urgencia. El objetivo es empujar a aquellos que están en la cerca ('procrastinadores') a tomar una decisión hoy mismo para no perder los beneficios exclusivos que expiran.",
                    bodyPreview: "Las inscripciones cierran hoy a medianoche. Si quieres dominar el Microblading este mes, esta es tu última oportunidad. Mañana el precio subirá y perderás los bonos de acción rápida que incluyen el kit de marketing para redes sociales..."
                },
                {
                    id: 5,
                    day: "Día 4",
                    subject: "¿Sigues ahí? Mira lo que dicen tus futuras colegas...",
                    type: "Recordatorio Final",
                    objective: "Este es el último esfuerzo para rescatar la venta. Usamos la prueba social no solo para mostrar éxito, sino para generar miedo a perderse algo (FOMO). Hacemos que el prospecto visualice el costo de la inacción: ¿qué pasará si no hacen nada hoy? La respuesta suele ser 'nada cambiará', lo cual es doloroso.",
                    bodyPreview: "Veo que aún no has tomado acción. Quiero preguntarte algo honestamente: ¿Dónde estarás en 6 meses si no cambias nada hoy? La definición de locura es hacer lo mismo y esperar resultados diferentes. Es hora de tomar el control..."
                },
                {
                    id: 6,
                    day: "Día 5",
                    subject: "Una historia de éxito real: De 0 a $2k en 30 días",
                    type: "Prueba Social",
                    objective: "El objetivo es derribar la objeción de 'esto no funcionará para mí'. Al mostrar un caso de éxito de alguien con circunstancias similares o peores que el prospecto (sin experiencia, sin dinero), eliminamos las excusas y demostramos que el sistema es replicable para cualquiera que siga los pasos.",
                    bodyPreview: "Conoce a María. Ella empezó sin saber nada y hoy tiene su propio estudio. Mira cómo lo hizo siguiendo exactamente los pasos que te enseñamos en el módulo 3. Ella no tenía experiencia previa ni capital, solo las ganas de salir adelante..."
                },
                {
                    id: 7,
                    day: "Día 6",
                    subject: "ÚLTIMA LLAMADA: No dejes pasar el tren de la belleza",
                    type: "Oportunidad Extra",
                    objective: "Esta es una técnica de 'Over-delivery'. Reabrimos la oportunidad brevemente para capturar a los rezagados, pero lo justificamos con una razón lógica (cupos extra, error en sistema, etc.).",
                    bodyPreview: "He notado que intentaste ingresar pero no completaste el registro. Hemos abierto 2 cupos extra por un error en el sistema. Tómalo ahora o piérdelo para siempre."
                }
            ],
            evergreen: [
                {
                    id: 1,
                    day: "Día 10",
                    subject: "Tip de Experto: Cuidado con esto",
                    type: "Educativo",
                    objective: "Mantener la relación.",
                    bodyPreview: "Solo pasaba para dejarte un consejo rápido..."
                },
                {
                    id: 2,
                    day: "Día 20",
                    subject: "Caso de Estudio: Resultados",
                    type: "Prueba Social",
                    objective: "Mostrar autoridad.",
                    bodyPreview: "Mira lo que lograron nuestros alumnos este mes..."
                },
                {
                    id: 3,
                    day: "Día 30",
                    subject: "¿Sigues interesado?",
                    type: "Reacticavación",
                    objective: "Recuperar leads fríos.",
                    bodyPreview: "Ha pasado un mes y quería saber cómo vas..."
                }
            ]
        },
        whatsapp: [
            {
                id: 1,
                title: "Etapa 1: Saludo y Cualificación",
                objective: "El objetivo es filtrar curiosos de compradores reales. No damos el precio de inmediato, primero hacemos preguntas para entender su situación y elevar su nivel de consciencia sobre el problema.",
                messages: [
                    { role: 'user', text: "Hola, quiero información del curso." },
                    { role: 'bot', text: "¡Hola! Claro que sí. Para poder ayudarte mejor, cuéntame: ¿Ya tienes experiencia en belleza o estás empezando desde cero?" },
                    { role: 'user', text: "Empiezo desde cero." },
                    { role: 'bot', text: "Perfecto. Este programa es ideal para principiantes porque te llevamos paso a paso. ¿Tu objetivo es emprender tu propio negocio o solo aprender por hobby?" }
                ]
            },
            {
                id: 2,
                title: "Etapa 2: Presentación de la Oferta",
                objective: "Aquí presentamos la solución como el vehículo único para lograr sus deseos. Usamos anclaje de precios para que el costo parezca pequeño en comparación con el valor recibido.",
                messages: [
                    { role: 'bot', text: "Entiendo. Mira, el programa 'Microblading Pro' incluye todo lo que necesitas: Certificación Internacional, Kit de Plantillas y Acceso de por vida." },
                    { role: 'bot', type: 'image', text: "Imagen del Certificado" },
                    { role: 'bot', text: "Normalmente esto costaría $500 USD por separado, pero hoy tenemos una oferta especial para nuevos alumnos." }
                ]
            }
        ]
    }
};

export const MOCK_PROJECTS: Project[] = [
    {
        id: "mock-proj-1",
        name: "Masterclass Microblading Pro",
        niche: "Belleza y Estética",
        description: "Estrategia completa para vender curso de microblading.",
        targetAudience: "Mujeres de 25-40 años interesadas en belleza.",
        brandTone: "Profesional, Empático",
        productName: "Curso Microblading",
        mainGoal: "Venta Directa",
        painPoints: ["Bajos ingresos", "Falta de tiempo", "Miedo a empezar"],
        keyBenefits: ["Certificación Internacional", "Técnica avanzada", "Comunidad VIP"],
        affiliateLinks: [],
        createdAt: new Date("2023-10-14"),
        strategy_json: MOCK_MASTER_STRATEGY
    }
];

export const MOCK_PAGES: LandingPage[] = [
    {
        id: "mock-page-1",
        name: "Landing Ventas Microblading",
        niche: "Belleza",
        goal: "Venta",
        isPublished: true,
        subdomain: "microblading-pro",
        content: {
            palette: 'elegant-purple',
            structure: 'classic-sales',
            destination: { type: 'whatsapp', whatsappPhone: '573001234567' },
            hero: {
                headline: "Domina el <b>Microblading</b> y Triplica tus Ingresos",
                subheadline: "Aprende la técnica que está revolucionando la industria de la belleza.",
                ctaText: "Quiero Aprender Más",
                heroImage: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                videoTitle: "Clase Gratuita",
                videoDuration: "15 min",
                spotsLeft: "¡Últimos 3 cupos!",
                socialProofCount: "+1200 Alumnos"
            },
            intro: {
                title: "¿Por qué este curso?",
                description: "Un entrenamiento intensivo diseñado para llevarte de cero a experta en 30 días.",
                imageCardText: "Método Comprobado",
                items: [
                    { title: "Práctica Real", description: "Ejercicios en látex y modelos reales." },
                    { title: "Soporte VIP", description: "Acceso directo a la profesora." }
                ]
            },
            benefits: {
                title: "Lo que obtendrás",
                subtitle: "Herramientas profesionales para tu éxito",
                items: [
                    { title: "Certificado", description: "Avalado internacionalmente.", icon: "Award", color: "yellow" },
                    { title: "Comunidad", description: "Grupo de apoyo exclusivo.", icon: "Users", color: "blue" }
                ]
            },
            whatYouWillLearn: {
                title: "Temario del Curso",
                icon: "BookOpen",
                items: ["Fundamentos de la piel", "Visajismo y Diseño", "Colorimetría Avanzada", "Práctica en Modelos"]
            },
            testimonials: [
                { name: "Sofia G.", text: "El mejor curso que he tomado.", rating: 5, location: "México" },
                { name: "Carla M.", text: "Recuperé mi inversión en 1 semana.", rating: 5, location: "Colombia" }
            ],
            faq: [
                { question: "¿Necesito experiencia?", answer: "No, empezamos desde cero." },
                { question: "¿Entregan certificado?", answer: "Sí, al finalizar el curso." }
            ],
            instructor: {
                name: "Ana experta",
                bio: "Master en Microblading con 10 años de experiencia.",
                title: "Tu Instructora",
                badgeText: "Master",
                badgeSubtext: "Certificada",
                statsStudents: "+5k Alumnos",
                statsRating: "4.9/5"
            },
            footer: {
                copyright: "© 2024 Microblading Pro",
                contact: "soporte@microbladingpro.com",
                socials: { facebook: "#", instagram: "#" }
            },
            thankYouMessage: "¡Gracias por registrarte!",
            redirectUrl: "",
            thankYouPage: {
                showSocials: true,
                ctaLink: "https://wa.me/...",
                headline: "¡FELICIDADES! ESTÁS DENTRO",
                subheadline: "Sigue los pasos para acceder al material.",
                step1Title: "Revisa tu Correo",
                step1Desc: "Te hemos enviado los datos de acceso.",
                step2Title: "Únete al Grupo",
                step2Desc: "Recibe soporte y novedades.",
                offerHeadline: "Oferta Especial",
                offerDescription: "Solo por hoy, obtén este bonus extra."
            }
        },
        createdAt: new Date(),
        visits: 1250,
        conversions: 85,
        projectId: "mock-proj-1",
        customDomain: "cursos-belleza.com"
    }
];

export const MOCK_ARTICLES: Article[] = [
    {
        id: "mock-art-1",
        title: "5 Errores al iniciar en Microblading",
        slug: "errores-microblading",
        description: "Descubre los fallos que cometen el 90% de las principiantes y cómo evitarlos para tener éxito rápido.",
        contentHtml: "<h2>Introducción</h2><p>El microblading es una carrera lucrativa, pero muchos cometen errores al inicio...</p><h2>Error 1: Profundidad incorrecta</h2><p>Uno de los errores más comunes es...</p>",
        keyword: "microblading errores",
        seoScore: 92,
        status: 'published',
        publishedAt: new Date(),
        createdAt: new Date(),
        pageId: "mock-page-1",
        featuredImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

export const MOCK_LEADS: Lead[] = [
    {
        id: "lead-1",
        name: "Sofía Martínez",
        email: "sofia@test.com",
        sourcePage: "Landing Ventas Microblading",
        date: "2023-10-20",
        synced: false
    },
    {
        id: "lead-2",
        name: "Camila Torres",
        email: "camila@test.com",
        sourcePage: "Landing Ventas Microblading",
        date: "2023-10-21",
        synced: true
    }
];

export const MOCK_COURSES: Course[] = [
    {
        id: "course-1",
        title: "Entrenamiento para Afiliados",
        subtitle: "Configura tu Negocio Digital",
        slug: "entrenamiento-afiliados",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Un curso paso a paso para aprender a utilizar esta plataforma y lanzar tu primer embudo de ventas en menos de 24 horas.",
        badge_text: "Oficial",
        order_index: 1,
        is_active: true,
        modules: [
            {
                id: "mod-1",
                title: "Módulo 1: Bienvenida y Configuración",
                order_index: 1,
                lessons: [
                    {
                        id: "les-1",
                        title: "Cómo funciona el sistema",
                        duration: "5:00",
                        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        description: "<p>En esta lección aprenderás los conceptos básicos de la plataforma y cómo navegar por el panel de control.</p>",
                        learning_points: ["Navegación del Dashboard", "Configuración de Perfil", "Tu primer proyecto"],
                        order_index: 1,
                        is_published: true
                    },
                    {
                        id: "les-2",
                        title: "Creando tu primera Landing Page",
                        duration: "12:00",
                        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        description: "<p>Aprende a utilizar el generador IA para crear páginas de alta conversión.</p>",
                        learning_points: ["Uso del Editor", "Publicación", "Dominios"],
                        order_index: 2,
                        is_published: true
                    }
                ]
            }
        ],
        createdAt: new Date()
    }
];

export const MOCK_COMMENTS: Comment[] = [
    {
        id: "c-1",
        lessonId: "les-1",
        lessonTitle: "Cómo funciona el sistema",
        courseTitle: "Entrenamiento para Afiliados",
        user: "Carlos R.",
        userId: "user-test",
        date: new Date().toISOString(),
        text: "¡Excelente explicación! Me quedó muy claro cómo empezar.",
        isApproved: true,
        likes: 5,
        replies: []
    }
];