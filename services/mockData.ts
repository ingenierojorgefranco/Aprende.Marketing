
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
      features: {
          whatsappBot: true,
          blogGenerator: true,
          emailMarketing: true,
          removeBranding: true
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
                    objective: "Esta es una técnica de 'Over-delivery'. Reabrimos la oportunidad brevemente para capturar a los rezagados, pero lo justificamos con una razón lógica (cupos extra, error técnico). El objetivo es exprimir las últimas ventas posibles de la lista caliente antes de pasarlos a la secuencia de nutrición a largo plazo.",
                    bodyPreview: "Hemos decidido abrir 3 cupos extra debido a la alta demanda. Pero solo estarán disponibles por 24 horas. Esta es realmente tu última oportunidad antes de que cerremos las puertas indefinidamente. No dejes pasar este tren..."
                }
            ],
            evergreen: [
                {
                    id: 8,
                    day: "Día 8",
                    subject: "¿Piel Grasa? El secreto para que el pigmento fije perfecto",
                    type: "Educativo",
                    objective: "Este correo busca posicionarte como una autoridad técnica absoluta. Al resolver un problema común y frustrante (piel grasa) de forma gratuita, generas confianza. El objetivo secundario es sutilmente recordar que este tipo de secretos avanzados son solo una pequeña parte de lo que aprenderían dentro del curso completo, incentivando la curiosidad.",
                    bodyPreview: "Hola [Nombre], ¿sabías que el verdadero dinero en el microblading no está en la primera cita, sino en la fidelización? El retoque anual es tu seguro de ingresos recurrentes. Hoy te explico cómo estructurar tu oferta para asegurar que vuelvan..."
                },
                {
                    id: 9,
                    day: "Día 9",
                    subject: "5 Herramientas económicas que necesitas para empezar hoy",
                    type: "Recurso Útil",
                    objective: "Derribar la barrera de entrada económica. Muchos prospectos no compran porque creen que necesitan un equipo de miles de dólares. Al mostrarles que pueden empezar con herramientas accesibles, eliminamos esa excusa y acercamos la posibilidad de compra, haciendo que el sueño de emprender se vea alcanzable hoy mismo.",
                    bodyPreview: "Quiero presentarte a Sofía. Hace 3 meses estaba exactamente donde tú estás hoy. Tenía miedo de invertir en el curso. Mira los resultados que obtuvo en su primer mes aplicando el módulo 4..."
                },
                {
                    id: 10,
                    day: "Día 10",
                    subject: "Cómo perdí el miedo a mi primera cliente (Historia Real)",
                    type: "Empatía",
                    objective: "Conectar emocionalmente a través de la vulnerabilidad. Compartir una historia de superación de miedos crea un vínculo humano. El objetivo es que el lector piense 'si ella pudo a pesar del miedo, yo también puedo'. Esto reduce la ansiedad asociada a la nueva habilidad y prepara el terreno para la venta desde la inspiración.",
                    bodyPreview: "Es normal pensar que 'ya hay muchas haciendo cejas'. Pero la realidad es que hay muchas haciéndolo MAL. Tú no vas a competir por precio, vas a competir por calidad y experiencia. Así es como te diferencias..."
                },
                {
                    id: 29,
                    day: "Día 29",
                    subject: "Tendencias 2025: ¿Sigue vivo el Microblading o mueren las cejas?",
                    type: "Actualidad",
                    objective: "Reactivar a los leads fríos utilizando la novedad y el miedo a quedar obsoleto. Al hablar de tendencias futuras, te posicionas como líder de opinión. El objetivo es despertar a quienes han perdido el interés mostrándoles que el mercado sigue vivo y evolucionando, y que necesitan actualizarse para no perder oportunidades de negocio.",
                    bodyPreview: "Ha pasado casi un mes. Si hubieras empezado cuando nos conocimos, hoy ya tendrías tu primera práctica terminada. No dejes pasar otro mes. Aquí tienes el plan exacto para recuperar el tiempo perdido..."
                },
                {
                    id: 30,
                    day: "Día 30",
                    subject: "Tu Plan de Acción para el próximo mes: De práctica a realidad",
                    type: "Motivación",
                    objective: "Cerrar el ciclo mensual con un llamado a la acción claro y directo. Este correo busca hacer un 'reseteo' mental en el prospecto: el mes pasó y no tomaron acción. Usamos un tono de coach motivacional para empujarlos a dejar la procrastinación y comprometerse con sus metas financieras para el siguiente mes, ofreciendo el curso como la herramienta para lograrlo.",
                    bodyPreview: "Cerramos el mes y con él se van los bonos especiales de marketing. Si te inscribes hoy, aún puedes reclamar el pack de plantillas de Instagram. Mañana será tarde. ¿Estás dentro o fuera?"
                }
            ]
        },
        whatsapp: [
            {
                id: 1,
                title: "👋 Apertura & Cualificación",
                objective: "Filtrar curiosos de clientes potenciales.",
                messages: [
                    { role: "agent", text: "Hola Laura, vi que descargaste la guía de cejas. ¿Eres principiante o ya tienes experiencia?" },
                    { role: "user", text: "Hola, soy principiante. Quiero aprender." },
                    { role: "agent", text: "Genial. Justo abrimos un grupo para principiantes. ¿Te gustaría ver el temario?" }
                ]
            },
            {
                id: 2,
                title: "🔥 Presentación de Oferta",
                objective: "Presentar el valor antes del precio.",
                messages: [
                    { role: "user", text: "Sí, envíame la info por favor." },
                    { role: "agent", text: "Claro. El programa incluye certificación, kit digital y 3 meses de soporte. Mira los resultados de alumnas aquí 👇" },
                    { role: "agent", text: "[Foto de Antes/Después]", type: "image" }
                ]
            },
            {
                id: 3,
                title: "💰 Cierre & Objeciones",
                objective: "Manejar la objeción de precio/tiempo.",
                messages: [
                    { role: "user", text: "Me gusta pero no tengo dinero ahora." },
                    { role: "agent", text: "Te entiendo. Justo por eso habilitamos pagos a cuotas. Puedes empezar con $20 hoy. ¿Te sirve esa opción?" },
                    { role: "agent", text: "👉 [Link de Pago a Cuotas]", type: "link" }
                ]
            },
            {
                id: 4,
                title: "📢 Seguimiento Post-Venta",
                objective: "Asegurar que el cliente ingrese al curso.",
                messages: [
                    { role: "agent", text: "¡Bienvenida Laura! Ya vi tu inscripción. ¿Pudiste acceder a la plataforma?" },
                    { role: "user", text: "Sí, ya estoy dentro. ¡Gracias!" }
                ]
            }
        ]
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
    createdAt: new Date("2024-01-15"),
    strategy_json: MOCK_MASTER_STRATEGY // Use the mock object here
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
  redirectUrl: "https://www.google.com",
  
  // NEW: THANK YOU PAGE MOCK CONTENT
  thankYouPage: {
      showSocials: true,
      ctaLink: "https://chat.whatsapp.com/sample-group-link",
      
      // Hero
      progressBarText: "¡ESPERA! SÓLO TE FALTA UN ÚLTIMO PASO PARA TERMINAR.",
      greenBadgeText: "RECIBE NUESTRO LIBRO DIGITAL 100% GRATIS",
      headline: "PERFECTO, YA TIENES EL ACCESO A LA CLASE DE MICROBLADING DE CEJAS",
      subheadline: "Sigue estos 2 pasos sencillos para asegurar tu cupo y recibir tu material de preparación gratuito.",
      
      // Steps
      step1Title: "Revisa tu Correo",
      step1Desc: "Acabamos de enviar el acceso a tu email.",
      step1Warning: "Importante: Verifica tu bandeja de SPAM o Promociones.",
      step1Subject: "Busca el asunto: \"Acceso a tu Clase...\"",
      
      step2Title: "Grupo VIP + Regalo",
      step2Desc: "Únete al grupo de WhatsApp para recibir la mentoría y tu regalo de bienvenida.",
      step2Badge: "¡Acción Requerida!",
      step2BonusTitle: "Libro Digital GRATIS",
      step2BonusValue: "Valor $19 USD",
      
      // Offer
      offerTopTitle: "UNETE A NUESTRO GRUPO Y DESCARGA EL LIBRO GRATUITO",
      offerHeadline: "Descarga: \"5 Errores Comunes que <span class=\"text-red-500 underline decoration-4 decoration-red-200\">Arruinan</span> el Microblading\"",
      offerDescription: "Esta guía nace de la experiencia de profesionales del sector. Te compartimos los fallos más frecuentes y cómo prevenirlos paso a paso para resultados perfectos.",
      bookTitle: "5 Errores",
      bookSubtitle: "MICROBLADING PRO",
      bookFooter: "GUÍA EXCLUSIVA 2025",
      offerPriceRegular: "Precio Regular: $19 USD",
      offerPriceFree: "HOY: $0.00 GRATIS",
      offerBadge: "¡OFERTA FLASH!",
      offerBullets: [
          "Asimetrías y diseño incorrecto.",
          "Tonos rojizos o grises (Colorimetría).",
          "Mala cicatrización del pigmento.",
          "Elección incorrecta de aguja."
      ],
      ctaButtonText: "UNIRME AL GRUPO Y DESCARGAR",
      
      // Extra
      learningTitle: "Lo que aprenderás con esta Guía",
      learningSubtitle: "Hemos acompañado a +2.500 personas a entender el proceso y preparar sus cejas para un resultado natural.",
      learningItems: [
          { title: "Errores #1-#5", description: "Causas y consecuencias de los fallos más comunes." },
          { title: "Diseño Perfecto", description: "Reglas simples de simetría para rostros naturales." },
          { title: "Colorimetría", description: "Evita tonos rojizos o grises con nuestra guía de pigmentos." },
          { title: "Cuidados Post", description: "Cómo acelerar la cicatrización para retener el color." },
          { title: "Elegir Profesional", description: "7 señales de alerta para identificar un buen técnico." },
          { title: "Checklist", description: "Lista imprimible con todo lo que necesitas." }
      ],
      socialTitle: "Lo que dicen quienes ya leyeron",
      socialSubtitle: "Consejos de profesionales del sector aplicados a la realidad.",
      socialCountText: "Más de 1.240 descargas este mes",
      socialItems: [
          { name: "Paula G.", location: "Valencia", text: "Información clara, sin tecnicismos. Vale oro si es tu primera vez con el microblading." },
          { name: "Laura M.", location: "Sevilla", text: "Por fin entendí por qué mis cejas quedaban grises. Con el eBook pude hablar con mi artista y corregimos el pigmento." },
          { name: "Marta M.", location: "Málaga", text: "El checklist pre y post me salvó. Esta vez la cicatrización fue rapidísima." },
          { name: "Ana R.", location: "Madrid", text: "Me ayudó a elegir profesional con criterio. Evité un sitio que no hacía pruebas de color." }
      ],
      faqTitle: "Preguntas Frecuentes",
      faqItems: [
          { question: "¿De verdad es gratis?", answer: "Sí, es un regalo de bienvenida para los nuevos miembros de nuestra comunidad de WhatsApp." },
          { question: "¿Sirve si es mi primera vez?", answer: "Absolutamente. Está diseñado para principiantes que quieren entender el proceso antes de realizarlo." },
          { question: "¿Incluye imágenes?", answer: "Sí, contiene guías visuales de simetría y ejemplos de resultados." },
          { question: "¿Cómo recibo el eBook?", answer: "Al hacer clic en el botón verde, se abrirá WhatsApp. Una vez dentro del grupo, encontrarás el link de descarga en la descripción o mensajes fijados." }
      ]
  }
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