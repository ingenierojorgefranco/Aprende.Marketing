import { Project, LandingPage, GeneratedPageContent } from "../../types";
import { ProjectMasterStrategy } from "../strategySchema";
import { BookOpen, Sparkles, Users, MessageCircle, Target } from 'lucide-react';

/* */ /* Actualización: Centralización de MOCK_MASTER_STRATEGY desde strategySchema.ts - 01/01/2026 11:00 */
// --- DATOS MOCK DE ESTRATEGIA MAESTRA ---
export const MOCK_MASTER_STRATEGY: ProjectMasterStrategy = {
    meta: {
        projectName: "Masterclass Microblading Pro",
        createdAt: "14 Oct, 2023",
        niche: "Belleza y Estética",
        productType: "Curso Online (High Ticket)",
        objective: "Venta Directa (Crash Strategy)",
        price: 200,
        commissionRate: 0.65,
        projection: [0, 0, 116.81, 233.62, 467.24, 700.86, 934.48, 1284.91, 1635.34, 1985.77, 2336.20, 2803.44],
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
                    h2: "La oportunidad perfecta para emprendedoras del sector belleza que buscan independencia financiera sin trucos ni promesas vacías."
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
                    ]
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
                    ]
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
                    }
                },
                action: {
                    label: "2. Siguiente Paso",
                    title: "Redirección a Comunidad",
                    type: 'action',
                    content: {
                        h1: "Conéctate a nuestro WhatsApp Estratégico",
                        h2: "Es el canal principal donde resolveremos tus dudas y entregaremos el material de estudio."
                    }
                },
                magnet: {
                    label: "3. Lead Magnet",
                    title: "Guía de Inicio Rápido",
                    type: 'magnet',
                    content: {
                        h1: "Descarga tu Plan de Negocios en Estética",
                        h2: "El primer paso práctico para empezar a ofrecer servicios de alto valor."
                    }
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
                strategy: "Abordamos los retos and cuidados necesarios con honestidad. El objetivo es filtrar a alumnos comprometidos and demostrar que la formación adecuada elimina la mayoría de estos riesgos."
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
            }
        ],
        emails: {
            nurture: [
                {
                    id: 1,
                    day: "Día 0",
                    subject: "🎁 Tu regalo: Guía de Inicio Rápido en Microblading",
                    type: "Entrega de Valor",
                    objective: "Establecer reciprocidad y cumplir la promesa inmediata entregando el Lead Magnet."
                },
                {
                    id: 2,
                    day: "Día 1",
                    subject: "😫 ¿Cansada de trabajar 10h y no ver frutos reales?",
                    type: "Agitación del Dolor",
                    objective: "Conectar emocionalmente con el cansancio sistémico del avatar."
                },
                {
                    id: 2,
                    day: "Día 2",
                    subject: "📈 Cómo Maria pasó de 0 a $2,000/mes con cejas",
                    type: "Prueba Social",
                    objective: "Demostrar factibilidad mediante un caso de éxito real."
                },
                {
                    id: 3,
                    day: "Día 3",
                    subject: "💎 La verdad sobre el Microblading (y por qué otros fallan)",
                    type: "Mecanismo Único",
                    objective: "Explicar la diferenciación del Método Brows360."
                },
                {
                    id: 4,
                    day: "Día 4",
                    subject: "🚀 ¡INSCRIPCIONES ABIERTAS! Domina la Certificación Pro",
                    type: "Lanzamiento / Oferta",
                    objective: "Presentar oficialmente el programa completo con todos los beneficios."
                },
                {
                    id: 5,
                    day: "Día 5",
                    subject: "⏳ Tus 3 Bonos Exclusivos expiran en pocas horas...",
                    type: "Escasez / Valor",
                    objective: "Añadir presión positiva mediante la pérdida de bonos adicionales."
                },
                {
                    id: 6,
                    day: "Día 6",
                    subject: "⚠️ ÚLTIMA LLAMADA: Tu futuro profesional empieza hoy",
                    type: "Cierre / Urgencia",
                    objective: "Llamada final a la acción antes del cierre de inscripciones."
                }
            ],
            evergreen: [
                {
                    id: 8,
                    day: "Día 8",
                    subject: "¿Cansada de las promesas vacías en cursos online?",
                    type: "Educativo",
                    objective: "Empatizar con el miedo del cliente y posicionar el curso como la solución real."
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
        ],
        whatsappLaunch: [
            {
                id: "wl1",
                name: "Confirmación de Fecha",
                moment: "Día -7",
                objective: "Confirmación de Fecha: Romper el hielo con el lead, confirmar la fecha del evento y asegurar que lo agenden en su calendario para maximizar la asistencia.",
                messages: [{ role: 'agent', text: "*📣 ¡Hola querida comunidad! 🙋‍♀️✨*\n\n¡Ya tenemos la fecha confirmada! 🎉\nNuestra clase gratuita será el próximo:\n\n*[FECHA_CLASE]*\n*8:00 p.m. (hora Colombia / México)*\n\nY déjame decirte algo importante: esta no será una clase cualquiera.\n\nSerá un encuentro donde descubrirás cómo el microblading puede convertirse en mucho más que una técnica de belleza:\n\n✨ Una habilidad que te dará seguridad y confianza.\n✨ Una profesión con la que podrás generar ingresos.\n\nPrepárate, porque lo que vas a descubrir puede ser el inicio de un camino nuevo para ti\n\nUn futuro donde tú decidas, donde trabajes en lo que amas y donde ayudes a otras personas a sentirse más bellas y seguras. 🌟\n\n*💖 Nos vemos in la clase, y créeme… no querrás faltar.*" }]
            },
            {
                id: "wl2",
                name: "Historia de Autoridad",
                moment: "Día -5",
                objective: "Historia de Autoridad: Conectar emocionalmente mediante el storytelling, mostrando el camino del experto para generar confianza y deseo por el método.",
                messages: [{ role: 'agent', text: "*📣 Hola, un placer presentarme con ustedes 🙋‍♀️✨*\nMi nombre es _*Ariana Zamora*_ , micropigmentadora, cosmetóloga y especialista en cejas. \n* Livel más de 10 años trabajando en la estética. Un camino que empezó con muchas dudas, miedos y sacrificios… pero también con un sueño: vivir de lo que amo y tener la libertad de crear mi propio futuro.\n* Todo lo que logré fue gracias al microblading, y ahora quiero compartir contigo lo que aprendí en el camino. 💕\nEste viernes *26 de Septiembre de 2025* te voy a entregar mucho más que teoría:\n✨ Te enseñaré nuevas técnicas que te abrirán los ojos sobre lo que realmente es el microblading.\n✨ Te contaré los secretos y tips que descubrí con la experiencia (los mismos que me ayudaron a crecer).\nQuiero que sepas que voy a darlo todo para guiarte, porque mi objetivo es que tú también descubras el potencial que tienes en este mundo.\nEstoy feliz de acompañarte y quiero que seas la próxima historia de éxito." }]
            },
            {
                id: "wl3",
                name: "Temario y Promesa",
                moment: "Día -3",
                objective: "Temario y Promesa: Elevar el valor percibido detallando los puntos exactos que se aprenderán, creando anticipación sobre la transformación que viene.",
                messages: [{ role: 'agent', text: "*El microblading de cejas no es solo una técnica de belleza… es una habilidad capaz de transformar vidas.*\n✨ Imagina poder ayudar a una persona a mirarse al espejo y recuperar la seguridad en sí misma. 💕\n✨ Imagina que además de eso, sea tu camino para generar ingresos, libertad y reconocimiento.\n✨ Este viernes tendrás la oportunidad de descubrir cómo empezar desde cero. Y créeme, no puedes perderte esta clase por nada.\n*👉 Esto es lo que te espera en la clase en vivo:*\n✅ Aprenderás el primer paso real para iniciar in el microblading, aunque nunca hayas tocado una ceja.\n✅ Descubrirás los diferentes pigmentos y materiales profesionales que se usan, entendiendo para qué sirve cada uno y cómo elegirlos correctamente.\n✅ Tendrás acceso a una sesión práctica en vivo, donde te mostraremos el proceso paso a paso para que veas cómo funciona en la realidad.\n✅ Conocerás errores comunes que detienen a muchas… y cómo evitarlos desde el inicio.\n✅ Entenderás por qué esta técnica puede convertirse en un negocio rentable y estable, incluso si empiezas sin experiencia.\n✅ Te llevarás claridad y motivación para decidir si el microblading puede ser tu futuro.\n*🌟 Este viernes a las 8:00 p.m. (hora Colombia/México – 10:00 p.m. Argentina/Chile).*\n💖 Aparta tu lugar desde ya, porque lo que verás puede ser el inicio de un cambio real en tu vida." }]
            },
            {
                id: "wl4",
                name: "Adelanto (3 Errores)",
                moment: "Día -1",
                objective: "Adelanto (3 Errores): Aportar valor real antes de la clase identificando errores comunes, posicionando la clase como la solución para evitarlos.",
                messages: [{ role: 'agent', text: "*📣 Hola chicas, ya estamos a un solo día de nuestra clase gratuita de microblading 🙋‍♀️✨*\nAntes de vernos mañana, quiero regalarles un pequeño adelanto de lo que vamos a trabajar juntas. 💖\nHoy les voy a contar los _3 errores más comunes que cometen las personas_ cuando empiezan en microblading (y cómo tú los puedes evitar):\n❌ Pensar que solo se necesita buen pulso y práctica.\n❌ Usar cualquier pigmento o material sin entender su calidad ni compatibilidad.\n❌ Creer que con videos sueltos de internet se puede aprender toda la técnica.\nMañana te voy a mostrar cómo evitar cada uno de estos errores y, además, te enseñará en vivo el proceso completo, los pigmentos y materiales profesionales que usamos, y te compartiré tips que aprendí en mis más de 10 años de experiencia.\n• Estoy preparando algo muy especial para ti, así que no te lo puedes perder por nada. 🌟\n• Nos vemos mañana viernes a las 8:00 p.m. (hora Colombia/México) – 10:00 p.m. (hora Argentina/Chile).\n• Te espero con toda mi energía y ganas de compartir lo mejor que tengo contigo.\n💖 Ariana Zamora ✨" }]
            },
            {
                id: "wl5",
                name: "¡Hoy es el gran día!",
                moment: "Día Clase (AM)",
                objective: "Recordatorio Matutino: Generar urgencia y entusiasmo desde temprano, asegurando que el lead sepa que 'hoy es el día' y prepare su entorno.",
                messages: [{ role: 'agent', text: "*📣🎺 HOY CLASE DE MICROBLADING DE CEJAS 🎺📣*\n¡GRANDIOSA comunidad! ✨ _Llegó el día que estábamos esperando_ 🙌.\nHOY iniciamos nuestra capacitación completa para convertirte en una *especialista de Microblading de Cejas* . 💖\n*❗ ¡PRESTAME ATENCIÓN! ❗*\n✅ Durante el día voy a estar enviando recordatorios para que no se te olvide la hora.\n🕗 La clase es hoy a las 8:00 p.m. (hora Colombia/México) – 10:00 p.m. (hora Argentina/Chile).\n✅ 5 minutos antes de iniciar la clase te compartiré aquí mismo el enlace de acceso a la clase\n*Estoy muy emocionada y feliz de compartir este momento contigo ✨.*\nPrepárate porque lo que vas a vivir hoy puede ser el inicio de una gran transformación en tu vida. 🌟\n— Ariana Zamora 💕" }]
            },
            {
                id: "wl6",
                name: "Cuenta Regresiva (T-4h)",
                moment: "Día Clase (PM)",
                objective: "Cuenta Regresiva Final: Incrementar la dopamina y la urgencia faltando pocas horas, dando instrucciones finales para la conexión.",
                messages: [{ role: 'agent', text: "*⏳ Faltan 4 horas ⏳*\n• 🔔 Recuerda tener todo preparado para la clase de hoy.\n• 🕒 Separa 1 hora para ver nuestra clase en vivo de Microblading de Cejas.\n• 🪑 Destina un lugar cómodo donde te puedas concentrar.\n• 💻 Ten preparado el computador, televisor o móvil para ver la clase.\n• 📝 Ten a la mano dónde tomar notas y aleja todo tipo de distracciones.\nEstoy muy emocionada porque en pocas horas empezaremos juntas esta experiencia única.\n*Prepárate, porque lo que aprenderás hoy puede ser el inicio de un cambio en tu vida. 💕*\n— Ariana Zamora 🌟" }]
            },
            {
                id: "wl7",
                name: "¡Estamos en Vivo!",
                moment: "Día Clase (Link)",
                objective: "Acceso al En Vivo: Facilitar la entrada inmediata a la transmisión, eliminando cualquier fricción técnica con un link directo y claro.",
                messages: [{ role: 'agent', text: "*🚀 Iniciamos en 20 minutos 🚀*\n• La clase será transmitida a través de YouTube 🎥.\n• En unos minutos les compartiré aquí mismo el enlace de acceso.\n*Recuerda:*\n👉 Estar muy bien enfocada y centrada.\n👉 Alejar todas tus distracciones.\n*Porque en solo 20 minutos empezamos juntas esta gran experiencia. 🌟*\n¿Listas? 🙌💖" }]
            },
            {
                id: "wl8",
                name: "Oferta Abierta (Beca 75%)",
                moment: "Post-Clase",
                objective: "Apertura de Inscripciones: Presentar la oferta irresistible con el descuento máximo (Beca) para capturar a los 'early birds' y compradores impulsivos.",
                messages: [{ role: 'agent', text: "*🔴🔴 YA ESTAMOS EN VIVO 🔴🔴*\n• 🎥 Haremos la transmisión vía YouTube.\n*LINK DE ACCESO:*\n👉 https://hotm.art/microblading-clase-online\n*⚡ YA PUEDEN IR INGRESANDO A LA CLASE HACIENDO CLIC EN EL ENLACE ⚡*" }]
            },
            {
                id: "wl9",
                name: "Bonos de Acción Rápida",
                moment: "Urgencia 1",
                objective: "Bonos de Acción Rápida: Presionar éticamente mediante la pérdida inminente de los regalos exclusivos, forzando una decisión de compra rápida.",
                messages: [{ role: 'agent', text: "*✨ ¡Gracias hermosas por estar en la clase de hoy! 🙋‍♀️💕*\nDe corazón espero que hayas disfrutado, aprendido y descubierto lo maravilloso que puede ser el mundo del microblading.\n📹 Quiero contarte que la grabación de la clase la vamos a compartir en este mismo grupo, para que puedas repasarla las veces que quieras.\n*Y ahora quiero darte una noticia especial:*\n👉 Las inscripciones al curso completo de Especialista en Microblading de Cejas 2.0 ya están abiertas.\nSu valor normal es de *200 Dólares* , pero por lanzamiento exclusivo para quienes participaron hoy, *queda en solo 47 Dólares* . 🎉\n_*En este curso vas a tener acceso a:*_\n• 💎 Las técnicas paso a paso explicadas en detalle.\n• 🎥 Clases grabadas + prácticas para que avances a tu ritmo.\n• 🎁 Bonos exclusivos (guía de pigmentos, plantillas de práctica y acceso a comunidad privada).\nEsta es tu oportunidad de dar el siguiente paso y empezar a transformar tu futuro con una habilidad rentable y apasionante.\n*Aquí puedes ver todos los detalles del programa con el descuento del 75%*\n👉 https://hotm.art/microblading-web-beca\nDe nuevo, gracias por confiar en mí.\nEstoy muy feliz de acompañarte en este camino. 💖\n— Ariana Zamora ✨" }]
            },
            {
                id: "wl10",
                name: "Tutorial de Pago",
                moment: "Soporte",
                objective: "Tutorial de Pago: Eliminar barreras técnicas de compra mostrando lo sencillo que es el proceso de checkout en Hotmart.",
                messages: [{ role: 'agent', text: "*🎁✨ BONOS ESPECIALES DE LANZAMIENTO ✨🎁*\n_¡Atención comunidad! 🚨_\nLas primeras 50 personas que se inscriban hoy en el curso completo de Microblading de Cejas 2.0 recibirán de regalo un pack increíble de BONOS exclusivos:\n• 🎁 BONO 1: Cuadernillo de ejercicios “Nueva Guía Práctica del Microblading” (diseños, trazos y práctica profesional).\n• 🎁 BONO 2: Checklist completo de materiales para empezar sin excusas.\n• 🎁 BONO 3: Entrenamiento en diseño y construcción de cejas según morfología.\n• 🎁 BONO 4: Acceso al canal privado “Artistas en Cejas” para preguntas y soporte.\n• 🎁 BONO 5: Documentación indispensable lista para usar con clientas.\n• 🎁 BONO 6: Agenda + 20 diseños listos para organizar tu negocio.\n• 🎁 BONO 7: Entrenamiento “Comenzando mi propio emprendimiento”.\n• 🎁 BONO 8: Pack de 5 libros de belleza en PDF para potenciar tus conocimientos.\n*Todo esto es tuyo GRATIS si aseguras tu cupo hoy al precio especial de 47 USD (antes 200 USD).*\n*Inscríbete aquí y reclama tus bonos ahora mismo:*\n👉 https://hotm.art/microblading-web-beca\n_Recuerda: solo aplica para las primeras 50 inscripciones._\n¡No te quedes fuera!" }]
            },
            {
                id: "wl11",
                name: "Certificado y Garantía",
                moment: "Garantía",
                objective: "Seguridad y Aval: Neutralizar el miedo al riesgo financiero resaltando la garantía de satisfacción y la certificación profesional.",
                messages: [{ role: 'agent', text: "*✅ Había olvidado decirte: GARANTÍA TOTAL ✅*\nQueremos que te sientas tranquila al dar este paso 🙌.\n*_Por eso, el curso Especialista en Microblading de Cejas 2.0 tiene una garantía de 7 días._*\n• Esto significa que puedes ingresar, probar el contenido, ver las clases y comenzar tu proceso.\n• Si en esos 7 días consideras que el curso no cumple con tus expectativas, se te devuelve el 100% de tu dinero. 💵\n*✨ Aunque estamos seguros de que eso no pasará…*\n• Porque este es el mejor curso de microblading online, probado y diseñado para que realmente logres resultados.\n• Hoy tienes la oportunidad de empezar con total seguridad y sin riesgos. 🌟\n*Aquí tienes el link directo para inscribirte al programa:*\n*👉 https://hotm.art/microblading-beca-70*" }]
            },
            {
                id: "wl12",
                name: "Últimos Cupos / Apertura Grupo",
                moment: "Cierre",
                objective: "Últimos Cupos: Notificar la escasez real de plazas para movilizar a los indicisos que necesitan un último empujón antes del cierre.",
                messages: [{ role: 'agent', text: "*🚨 INSCRIPCIONES CERRADAS 🚨*\n*El precio especial de lanzamiento (200 USD → 47 USD) ya ha finalizado. ❌*\n• Oficialmente, esta oportunidad no está disponible más…\n• Sabemos que muchas personas querían entrar, pero el tiempo y los cupos se agotaron.\n• Si no alcanzaste, puedes escribirme por interno y veremos si es posible habilitarte un cupo extra con el descuento.\n⚠ ️ Eso sí, no puedo garantizar porque los cupos estaban limitados.\nHoy cerramos esta etapa con un grupo maravilloso de nuevas futuras especialistas en microblading que ya están dentro.\n*Si te quedaste por fuera, recuerda: las oportunidades no esperan. 💎*" }]
            },
            {
                id: "wl13",
                name: "Inscripciones Cerradas",
                moment: "Final",
                objective: "Cierre de Carrito: Mantener la integridad de la oferta informar que las inscripciones terminaron, generando deseo para la próxima edición.",
                messages: [{ role: 'agent', text: "*🎉 ¡FELICIDADES NUEVAS ESPECIALISTAS! 🎉*\nQueremos felicitar a todas las personas que aprovecharon la oportunidad y ya se inscribieron en el curso Especialista en Microblading de Cejas 2.0. 💖\n• Hoy damos inicio a una nueva comunidad de mujeres valientes que decidieron apostar por ellas mismas, aprender una profesión con futuro y transformar su vida con el microblading. 🌟\n• 🥂 Bienvenidas a este camino, ¡ya son parte de nuestra familia de especialistas!\n• Gracias a todas las que participaron en la clase, estuvieron atentas y llenaron este grupo de energía positiva. 🙌\n*👉 Y si te quedaste por fuera, no te preocupes…*\n• Estate atenta a nuestras próximas oportunidades, porque lo mejor apenas está comenzando. 😉" }]
            },
            {
                id: "wl14",
                name: "Bienvenida y Próximos Pasos",
                moment: "Bienvenida",
                objective: "Onboarding: Dar la bienvenida oficial a los nuevos alumnos, reduciendo el remordimiento de compra y guiándolos al primer paso del curso.",
                messages: [{ role: 'agent', text: "¡Bienvenida al equipo! 🎉 Revisa tu correo para el acceso al área de miembros. Mañana iniciamos el Módulo 1." }]
            }
        ],
        ////////// Actualización: Testimonios Mock para validar la interfaz - 08/01/2026 //////////
        testimonials: [
            { 
              name: "Maria G.", 
              text: "¡Chicos! No puedo creerlo. Lancé mi primera landing page con la IA ayer y ya tengo 15 registros. El copywriting es brutal, parece escrito por un experto de años."
            },
            { 
              name: "Juan P.", 
              text: "Por fin una herramienta que entiende lo que necesitamos. He generado mi web de ventas en segundos y los textos son mejores que los que yo hacía en horas."
            },
            { 
              name: "Ana S.", 
              text: "Increíble cómo optimizó mis artículos para SEO. Estoy empezando a recibir tráfico orgánico desde Google sin gastar ni un dólar en anuncios."
            }
        ]
        ////////// Fin de actualización //////////
    }
};

// Actualización: Mapeo exacto de beneficios desde la estrategia maestra - 24/10/2023 14:15
export const MICROBLADING_CONTENT: GeneratedPageContent = {
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
  testimonialTitle: "Ellas ya cambiaron su historia:",
  testimonialSubtitle: "Resultados reales de alumnas que empezaron desde cero.",
  logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#d946ef;stop-opacity:1" /><stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" /></linearGradient></defs><path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2zm0 56C17.664 58 6 46.336 6 32S17.664 6 32 6s26 11.664 26 26-11.664 26-26 26z" fill="url(#grad1)"/><path d="M42.5 24.5c-4.1-3.5-9.2-4.5-14.5-2.8-5.3 1.7-9.3 6.1-10.8 11.5-.3 1.1-.5 2.2-.5 3.3 0 1.9 1.6 3.5 3.5 3.5h.5c1.8-.2 3.2-1.6 3.4-3.4.1-.7.2-1.3.4-2 1-3.6 3.7-6.5 7.2-7.6 3.5-1.1 6.9-.5 9.6 1.8 1.4 1.2 3.5 1 4.7-.4 1.2-1.4 1-3.5-.4-4.7z" fill="#fff"/></svg>`,
  hero: {
    headline: "Domina el Arte del <b>Microblading 3D</b> y Triplica tus Ingresos en 30 Días",
    subheadline: "Descubre el método exacto para escalar tus ventas y automatizar tu negocio en tiempo récord sin complicaciones técnicas.",
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
    subtitle: "Sincronizado con la Estrategia Maestra del Proyecto.",
    items: MOCK_MASTER_STRATEGY.modules.web.landingPageTabs.benefits.items.map((b: any) => ({
        title: b.title,
        description: b.desc || b.description || "", 
        icon: b.icon || "Sparkles",
        color: b.color || "purple"
    }))
  },
  // Actualización 31/12/2025 18:30 - Se reemplaza definitivamente el temario por identificación de dolores
  whatYouWillLearn: {
    title: "¿Te sientes identificada con alguna de estas situaciones?",
    icon: "AlertTriangle",
    items: [
      "Trabajas jornadas agotadoras de más de 10 horas, pero al final del mes tu cuenta bancaria no refleja tu enorme esfuerzo.",
      "Sientes un nudo en el estómago por el miedo a cometer un error en el rostro de una clienta y arruinar tu reputación.",
      "Has gastado dinero en cursos que solo te dieron teoría aburrida, pero te dejaron sola a la hora de practicar.",
      "Estás cansada de trabajar para otros y deseas fervientemente generar tus propios ingresos premium."
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