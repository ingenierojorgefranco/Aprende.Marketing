import { BookOpen, Sparkles, Users, MessageCircle, Target } from 'lucide-react';

// --- INTERFAZ MAESTRA ---
export interface ProjectMasterStrategy {
    meta: {
        projectName: string;
        createdAt: string;
        niche: string;
        productType: string;
        objective: string;
        price: number; // Nuevo field
        commissionRate: number; // Nuevo field (ej: 0.65 para 65%)
        projection: number[]; // Nuevo field (12 meses)
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
        motivations: { dinero: number; tiempo: number; estatus: number; seguridad: number };
    }>;
    psychology: {
        pains: string[];
        solutions: string[];
        powerWords: string[];
    };
    modules: {
        web: {
            landingPageTabs: any; // LP_TABS_DATA
            thankYouPageTabs: any; // TY_TABS_DATA
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
            nurture: Array<any>; // 7 days
            evergreen: Array<any>; // 30 days
        };
        whatsapp: Array<any>;
    };
}

// --- PLANTILLA POR DEFECTO (MOLDE) ---
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
        powerWords: []
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

// --- DATOS MOCK CENTRALIZADOS ---
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
                    { label: "Producto", value: "Curso de Microblading Profesional para Principiantes", icon: BookOpen, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
                    { label: "Nicho", value: "Belleza y estética", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                    { label: "Público Objetivo", value: "Mujeres entre 22 y 45 años", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { label: "Estrategia", value: "Contenido educativo + cierre por WhatsApp", icon: MessageCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                    { label: "Objetivo del Sistema", value: "Generar leads cualificados y convertirlos en ventas de forma conversacional", icon: Target, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-400/20" }
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