import React, { useState } from 'react';
import { Layers, ArrowRight, ArrowDown, Clapperboard, Globe, CheckCircle2, Users, MessageCircle, FileText, MonitorPlay, ShoppingCart, Zap, RefreshCw, Sparkles, Rocket, X, AlertTriangle, BarChart3, ListChecks, Brain, Target, Lightbulb, TrendingUp, ShieldCheck, Mail, BookOpen } from 'lucide-react';

const ACQUISITION_STEPS = [
    { 
        icon: Clapperboard, 
        title: "1. Atracción de Audiencia", 
        subtitle: "Canales: Reels, anuncios en Instagram, Facebook o Google", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Captar la atención de desconocidos y dirigirlos hacia el inicio de tu embudo de ventas.",
        masterclass: {
            importance: "La visibilidad es la gasolina de tu negocio; sin ojos en tu oferta, no hay crecimiento posible.",
            question: "¿Qué es la atracción de audiencia?",
            article: [
                {
                    title: "El Primer Eslabón de la Cadena de Ventas",
                    content: "Atraer audiencia es el arte de capturar la atención de desconocidos para convertirlos en interesados. En el marketing digital moderno, no se trata solo de 'postear', sino de interrumpir el patrón de consumo del usuario. Tu contenido debe ser tan relevante que el usuario decida sacrificar su tiempo para escucharte."
                },
                {
                    title: "La Psicología del Gancho (Hook)",
                    content: "Un buen gancho ataca un dolor específico en los primeros 3 segundos. Si vendes pérdida de peso, no hables de 'dietas', habla de 'por qué tu ropa ya no te queda'. La relevancia emocional es lo que genera el clic inicial."
                },
                {
                    title: "Algoritmos y Alcance",
                    content: "Plataformas como Instagram o Google premian la retención. El sistema te ayuda a crear guiones que mantienen a la gente mirando, lo que le indica al algoritmo que tu contenido es valioso, bajando tus costos de publicidad y aumentando tu alcance orgánico."
                }
            ],
            metricsExplanation: "Las métricas aquí te dicen si tu mensaje está conectando. Si el CTR es bajo, tu título es aburrido. Si el alcance es alto pero no hay clics, tu oferta no se entiende.",
            metrics: [
                { name: "CTR (Click Through Rate)", why: "Mide qué tan atractivo es tu anuncio o miniatura." },
                { name: "Costo por Clic (CPC)", why: "Determina cuánto estás pagando por cada interesado real." }
            ],
            mistakes: ["Intentar vender directamente en el anuncio.", "No usar subtítulos en los videos.", "Usar ganchos que no conectan con el dolor."],
            benefits: ["Aumento inmediato en el flujo de visitas.", "Reducción drástica en el costo de adquisición.", "Posicionamiento de autoridad desde el primer segundo."],
            articleChecklist: ["Publicar entre 2 y 4 Reels diarios con ganchos directos.", "Montar campañas de tráfico directo a la Landing Page.", "Responder los primeros 50 comentarios para activar el algoritmo."]
        }
    },
    { 
        icon: Globe, 
        title: "2. Página de Captura (Landing Page)", 
        subtitle: "El Visitante ingresa a tu página de captura y se registra dejando sus datos para recibir el contenido gratuito (LeadMagnet).", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Convertir el tráfico frío en contactos calificados capturando sus datos de contacto.",
        masterclass: {
            importance: "Tu local comercial abierto 24/7; la primera impresión que define si el cliente se queda o se va.",
            question: "¿Qué es una Landing Page?",
            article: [
                {
                    title: "Tu Vendedor Incansable",
                    content: "Una Landing Page es una página web diseñada con un único objetivo: la conversión. A diferencia de una web normal, aquí no hay menús que distraigan. Solo hay una promesa, un beneficio y un botón. Es el lugar donde el anonimato se convierte en una relación de datos."
                },
                {
                    title: "La Estructura de la Persuasión",
                    content: "Una landing efectiva sigue la jerarquía AIDA: Atención (Hero), Interés (Beneficios), Deseo (Prueba Social) y Acción (Botón). El sistema redacta estos bloques basándose en lo que tu cliente realmente quiere resolver."
                },
                {
                    title: "El Poder de la Promesa",
                    content: "El título de tu landing debe prometer una transformación. No vendemos características, vendemos el 'puente' hacia una situación mejor. Si la promesa es débil, el usuario cerrará la pestaña en menos de 5 segundos."
                }
            ],
            metricsExplanation: "La tasa de conversión es la brújula de tu negocio. Si entran 100 personas y se registran 20, tienes un 20%. Menos de eso indica que tu página no es convincente.",
            metrics: [
                { name: "Tasa de Conversión (CR)", why: "Indica la eficiencia de tu copy y diseño para captar datos." },
                { name: "Tiempo de Carga", why: "Crucial para evitar que el usuario se vaya por impaciencia." }
            ],
            mistakes: ["Poner demasiados campos en el formulario.", "Usar imágenes que no guardan relación con la oferta.", "No optimizar para dispositivos móviles."],
            benefits: ["Captación de clientes incluso mientras duermes.", "Filtrado automático de curiosos vs interesados.", "Construcción de una base de datos propia y valiosa."],
            articleChecklist: ["Verificar que el formulario konekte con el CRM.", "Optimizar el peso de las imágenes para carga rápida.", "Realizar una prueba de registro desde un teléfono Android e iPhone."]
        }
    },
    { 
        icon: CheckCircle2, 
        title: "3. Página de Gracias", 
        subtitle: "Agradecimiento e instrucciones al Grupo de Whatsapp", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Confirmar el registro exitoso y posteriormente guiar al lead hacia tu comunidad privada.",
        masterclass: {
            importance: "El momento de mayor atención de un lead es justo después de registrarse. Si no le das una instrucción clara, lo pierdes para siempre.",
            question: "¿Por qué es vital la Página de Gracias?",
            article: [
                {
                    title: "Cerrando el Ciclo de Registro",
                    content: "Muchos emprendedores cometen el error de ignorar esta página. La página de gracias cumple dos misiones: dar tranquilidad al usuario de que su registro fue exitoso y dirigirlo al 'siguiente gran paso'. Es el fin de la duda y el inicio del compromiso."
                },
                {
                    title: "Direccionamiento Estratégico",
                    content: "Aquí es donde mueves al usuario de un canal pasivo (web) a uno activo (WhatsApp o Telegram). Un lead que sigue una instrucción en la página de gracias tiene un 300% más de probabilidades de comprar que uno que no lo hace."
                },
                {
                    title: "Venta de Bajada (Opcional)",
                    content: "En estrategias avanzadas, esta página puede usarse para ofrecer un producto de bajo costo (Tripwire) que autofinancie tu publicidad. El sistema te prepara para que esta transición sea natural."
                }
            ],
            metricsExplanation: "Necesitamos saber cuánta gente 'obedece' a tu página. Si todos se registran pero nadie llega al WhatsApp, el botón de la página de gracias es invisible.",
            metrics: [
                { name: "Click Through Rate al CTA", why: "Mide el nivel de compromiso del nuevo lead." },
                { name: "Tasa de Abandono", why: "Si es muy alta, el mensaje de gracias no es claro." }
            ],
            mistakes: ["No dar una instrucción clara de qué hacer.", "Página aburrida que parece un error del sistema.", "Tener enlaces externos que sacan al usuario del flujo."],
            benefits: ["Aumento de la retención del lead en los primeros minutos.", "Migración del usuario a canales de comunicación directa.", "Generación de micro-compromisos que facilitan la venta."],
            articleChecklist: ["Incluir un botón gigante que diga 'HAGA CLIC AQUÍ PARA ACCEDER'.", "Añadir un aviso de revisar la carpeta de SPAM.", "Configurar el píxel para marcar la conversión final de registro."]
        }
    },
    { 
        icon: Users, 
        title: "4. Comunidad", 
        subtitle: "Grupo de WhatsApp", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Nutrir a los prospectos en un entorno controlado para generar confianza y prueba social colectiva.",
        masterclass: {
            importance: "La venta es un proceso de confianza. El grupo de WhatsApp humaniza tu oferta y crea un sentido de pertenencia y prueba social inmediata.",
            question: "¿Qué es una Comunidad en WhatsApp?",
            article: [
                {
                    title: "El Poder de la Tribu",
                    content: "WhatsApp no es solo una app de chat; es el lugar donde la gente se siente segura. Tener una comunidad te permite 'calentar' a cientos de leads al mismo tiempo enviando una sola pieza de contenido. Es economía de escala aplicada a la persuasión."
                },
                {
                    title: "Prueba Social Colectiva",
                    content: "Cuando una persona ve que otros 200 están interesados en lo mismo, su cerebro activa el sesgo de aprobación social. 'Si tantos están aquí, debe ser bueno'. Esto reduce la barrera del miedo a la compra significativamente."
                },
                {
                    title: "Liderazgo y Autoridad",
                    content: "En el grupo tú eres el guía. Aportar valor constante sin pedir nada a cambio te posiciones como el experto de referencia. Cuando abras las inscripciones, no tendrás que vender; simplemente te pedirán el enlace."
                }
            ],
            metricsExplanation: "El grupo debe estar vivo. Si la gente se sale en masa, tu contenido es irrelevante o estás siendo muy agresivo con las ventas.",
            metrics: [
                { name: "Tasa de Retención", why: "Porcentaje de personas que se quedan en el grupo tras entrar." },
                { name: "Interacción de Mensajes", why: "Mide cuántas personas reaccionan o ven lo que envías." }
            ],
            mistakes: ["Dejar el grupo abierto a spam externo.", "No interactuar ni dar la bienvenida.", "Publicar solo enlaces de venta sin valor previo."],
            benefits: ["Control total de la atención de tus prospectos.", "Generación masiva de prueba social automática.", "Reducción del costo de seguimiento manual."],
            articleChecklist: ["Cerrar el grupo para que solo administradores envíen mensajes.", "Publicar un mensaje de bienvenida fijo en la descripción.", "Programar 3 contenidos de valor semanales (Tips, Historias, Resultados)."]
        }
    },
    { 
        icon: MessageCircle, 
        title: "5. Message Directo", 
        subtitle: "Conversación 1 a 1", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Resolver dudas específicas de forma personalizada para eliminar barreras finales de compra.",
        masterclass: {
            importance: "Para productos de ticket medio/alto, el humano compra a humano. Resolver una duda específica por chat puede salvar el 50% de tus ventas caídas.",
            question: "¿Cómo cerrar ventas por Message Directo?",
            article: [
                {
                    title: "La Venta Consultiva",
                    content: "El mensaje directo (DM) es la fase de cierre. Aquí no hablamos de 'vender', sino de 'ayudar'. Un lead que te escribe por privado tiene una duda específica que le impide comprar. Tu trabajo es identificar esa barrera y destruirla con honestidad."
                },
                {
                    title: "El Poder de la Nota de Voz",
                    content: "Nada genera más confianza que escuchar una voz real. El sistema te sugiere cuándo enviar un audio para humanizar el proceso. La voz transmite seguridad y profesionalismo, algo que el profesional a veces no logra."
                },
                {
                    title: "Manejo Proactivo de Objeciones",
                    content: "No esperes a que el cliente diga 'está caro'. Anticípate explicando el valor y el retorno de inversión. El sistema te entrega guiones para que sepas exactamente qué decir cuando pregunten por el precio o la garantía."
                }
            ],
            metricsExplanation: "Debes medir tu efectividad como cerrador. Si hablas con 10 personas y ninguna compra, el problema es tu guion o tu velocidad de respuesta.",
            metrics: [
                { name: "Tiempo de Respuesta", why: "Crucial: un lead se enfría en 15 minutos." },
                { name: "Tasa de Cierre por Chat", why: "Cuántos chats se convierten en ventas reales." }
            ],
            mistakes: ["Tardar más de 4 horas en responder.", "Hablar como un bot sin empatía.", "No preguntar por el problema real del cliente."],
            benefits: ["Aumento radical en el porcentaje de cierre final.", "Creación de relaciones de largo plazo con los clientes.", "Detección de problemas en el embudo gracias al feedback directo."],
            articleChecklist: ["Configurar respuestas rápidas en WhatsApp Business.", "Tener el enlace de pago siempre copiado en el portapapeles.", "Usar notas de voz de máximo 30 segundos para resolver dudas."]
        }
    },
    { 
        icon: FileText, 
        title: "6. Lead Magnet", 
        subtitle: "Contenido gratuito (PDF o Clase)", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Entregar valor masivo de forma gratuita para activar la reciprocidad y demostrar autoridad técnica.",
        masterclass: {
            importance: "El sesgo de reciprocidad dicta que cuando das algo valioso gratis, la persona se siente inclinada a devolver el favor (comprando).",
            question: "¿Qué es un Lead Magnet?",
            article: [
                {
                    title: "El Soborno Ético",
                    content: "Un Lead Magnet es un regalo de alto valor que entregas a cambio del permiso para comunicarte con el prospecto. Debe ser algo 'pequeño' pero que resuelva un problema real e inmediato. Es la muestra gratis que abre la puerta a la gran oferta."
                },
                {
                    title: "Demostración de Capacidad",
                    content: "Si tu regalo gratuito es bueno, el cliente asumirá que tu producto de pago es increíble. Es tu oportunidad de demostrar que sabes de lo que hablas. El sistema te ayuda a estructurarlo para que sea educativo y vendedor a la vez."
                },
                {
                    title: "Creando el Deseo de Más",
                    content: "Un buen Lead Magnet leaves al usuario 'con hambre'. Resuelve el 'qué' pero deja espacio para el 'cómo' (que es tu producto de pago). Debe actuar como el capítulo 1 de una novela que no puedes dejar de leer."
                }
            ],
            metricsExplanation: "Si nadie descarga tu regalo, el título es aburrido. Si lo descargan pero nadie compra después, el contenido no está alineado con lo que vendes.",
            metrics: [
                { name: "Tasa de Consumo", why: "Cuántas personas realmente abren y leen el material." },
                { name: "Tasa de Conversión Post-Regalo", why: "Ventas generadas directamente tras el regalo." }
            ],
            mistakes: ["Entregar contenido mediocre solo por cumplir.", "Hacer un PDF demasiado largo que nadie lee.", "No poner enlaces de compra dentro del regalo."],
            benefits: ["Posicionamiento instantáneo como experto en la materia.", "Filtrado de leads cualificados por interés temático.", "Activación automática del gatillo mental de reciprocidad."],
            articleChecklist: ["Crear un título magnético que prometa un resultado rápido.", "Añadir enlaces de WhatsApp al final del documento.", "Asegurar que el diseño sea limpio y fácil de leer en móviles."]
        }
    },
    { 
        icon: Mail, 
        title: "7. Email Marketing", 
        subtitle: "Secuencia de nutrición y venta por correo.", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Recuperar the atención de los leads y educarlos mediante una secuencia lógica de persuasión.",
        masterclass: {
            importance: "El email marketing es the canal con mayor retorno de inversión. Te permite estar presente en la bandeja de entrada de tu cliente de forma personal y profesional.",
            question: "¿Por qué el Email Marketing es clave?",
            article: [
                {
                    title: "El Activo Más Valioso: Tu Lista",
                    content: "A diferencia de las redes sociales, tu lista de correos te pertenece. El email marketing te permite automatizar the educación de tu prospecto sin depender de algoritmos externos cambiantes."
                },
                {
                    title: "Secuencias de Adoctrinamiento",
                    content: "El sistema diseña correos que no solo venden, sino que educan. Cada correo es una oportunidad para demostrar tu expertise y derribar una barrera mental del cliente antes de que llegue a la página de venta."
                }
            ],
            metricsExplanation: "Mide cuántas personas abren tus correos y cuántas hacen clic en tus enlaces para ajustar la persuasión.",
            metrics: [
                { name: "Open Rate", why: "Indica si tus asuntos son atractivos y generan curiosidad." },
                { name: "CTR en Email", why: "Mide el interés real en la propuesta de valor enviada." }
            ],
            mistakes: ["Enviar solo ofertas agresivas.", "No personalizar el nombre del lead.", "Tener un diseño demasiado cargado que va a spam."],
            benefits: ["Automatización total de the relación con el cliente.", "Costo de envío prácticamente nulo.", "Alta tasa de conversión en cierres masivos."],
            articleChecklist: ["Configurar the secuencia de bienvenida (Día 0).", "Asegurar que el link de desuscripción sea visible.", "Realizar una prueba de envío para verificar formato."]
        }
    },
    { 
        icon: BookOpen, 
        title: "8. Artículos de Blog", 
        subtitle: "Contenido educativo para generar autoridad.", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Generar tráfico orgánico recurrente y posicionar tu marca como referente inagotable de conocimiento.",
        masterclass: {
            importance: "El contenido es the base de the autoridad. Un blog activo le dice a Google y a tus clientes que eres un referente serio en tu industria.",
            question: "¿Cómo ayudan los artículos de blog a vender?",
            article: [
                {
                    title: "Educación Pre-Venta",
                    content: "Un cliente educado es un cliente más fácil de cerrar. Los artículos resuelven dudas lógicas, permitiendo que el prospecto llegue a the fase de compra con mucha más confianza."
                },
                {
                    title: "SEO y Tráfico Gratis",
                    content: "Al escribir sobre temas que the gente ya está buscando, atraes visitas cualificadas sin gastar un dólar en anuncios. El sistema optimiza estos textos para ser encontrados."
                }
            ],
            metricsExplanation: "Debes mirar qué temas generan más interés para escalar tu estrategia.",
            metrics: [
                { name: "Tiempo en Página", why: "Indica si el contenido es realmente valioso y se consume." },
                { name: "Sesiones Orgánicas", why: "Mide el flujo de personas nuevas que te descubren." }
            ],
            mistakes: ["Escribir contenido irrelevante para el avatar.", "No poner llamados a the acción claros.", "Textos difíciles de leer en dispositivos móviles."],
            benefits: ["Construcción de marca a largo plazo.", "Generación de tráfico recurrente y gratuito.", "Eliminación de objeciones mediante the educación."],
            articleChecklist: ["Publicar 1 artículo semanal sobre un dolor del avatar.", "Insertar botones de registro en medio del texto.", "Compartir el artículo en grupos y redes sociales."]
        }
    },
    { 
        icon: RefreshCw, 
        title: "9. Lanzamiento por Whatsapp", 
        subtitle: "Estrategia de cierre masivo en grupos.", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Concentrar the demanda y generar una explosión de ventas mediante the escasez y urgencia grupal.",
        masterclass: {
            importance: "El lanzamiento por WhatsApp es the forma más rápida y efectiva de generar ingresos significativos concentrados en pocos días aprovechando the urgencia.",
            question: "¿Cómo funciona un Lanzamiento por WhatsApp?",
            article: [
                {
                    title: "El Poder de the Anticipación",
                    content: "Un lanzamiento no es un evento aislado; es una construcción de deseo. Mediante una secuencia probada, el sistema prepara the mente del lead para el momento exacto de the apertura de inscripciones."
                },
                {
                    title: "Disparadores Mentales de Grupo",
                    content: "Ver a otros interesados activa the prueba social. El sistema te ayuda a moderar y guiar the conversación para que el deseo de uno se convierta en the compra de muchos."
                }
            ],
            metricsExplanation: "El éxito se mide por el volumen de ventas en relación al número de personas en el grupo.",
            metrics: [
                { name: "Tasa de Cierre Grupal", why: "Porcentaje de miembros del grupo que compran the oferta." },
                { name: "Velocidad de Venta", why: "Indica qué tan fuerte fue the urgencia generada." }
            ],
            mistakes: ["No calentar el grupo antes de abrir carrito.", "Ser demasiado robótico o frío en the respuestas.", "No hacer seguimiento a quienes no compraron al final."],
            benefits: ["Alta rentabilidad en periodos cortos.", "Feedback directo y masivo de tu mercado.", "Aumento exponencial de the autoridad de marca."],
            articleChecklist: ["Revisar los 14 mensajes del asistente de lanzamientos.", "Configurar el cronómetro de urgencia en the página.", "Tener el enlace de checkout listo y verificado."]
        }
    },
    { 
        icon: MonitorPlay, 
        title: "10. Página de Venta", 
        subtitle: "Carta de ventas (VSL o texto)", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Presentar the oferta de forma irresistible y facilitar the transición hacia el pago final.",
        masterclass: {
            importance: "Es el clímax del embudo. Aquí se justifica racionalmente el deseo emocional. Debe ser impecable, clara y eliminar cualquier riesgo percibido.",
            question: "¿Qué es una Carta de Ventas (VSL)?",
            article: [
                {
                    title: "El Argumento Final",
                    content: "The página de ventas es donde ocurre the magia. Aquí no explicamos 'qué' es el producto, sino 'cómo' va a cambiar the vida del usuario. Usamos copywriting agresivo pero ético para mostrar que el costo de no comprar es mayor que el precio del curso."
                },
                {
                    title: "Bonus y Escasez",
                    content: "Un producto digital se percibe como más valioso cuando se acompaña de bonos que resuelven problemas futuros. El sistema genera estos bonos por ti para aumentar el valor percibido sin que tengas que trabajar más."
                },
                {
                    title: "Eliminación Total del Riesgo",
                    content: "The garantía es el elemento más ignorado y más importante. Debemos prometer que si no hay resultados, no hay costo. Esto transfiere el riesgo de los hombros del cliente a los tuyos, facilitando el 'sí'."
                }
            ],
            metricsExplanation: "Esta página es tu examen final. Si el tráfico llega aquí pero no hay clics en el botón de pago, tu oferta no es lo suficientemente irresistible o el precio no está justificado.",
            metrics: [
                { name: "Click to Payment", why: "Porcentaje de personas que inician el checkout." },
                { name: "Average Session Duration", why: "Mide si el usuario leyó todos tus argumentos." }
            ],
            mistakes: ["Esconder el precio hasta el final del todo.", "No incluir una sección de preguntas frecuentes.", "No mostrar testimonios de alumnos reales."],
            benefits: ["Automatización total del proceso de cierre de ventas.", "Escalabilidad ilimitada de tu negocio digital.", "Estandarización de tu mensaje de ventas perfecto."],
            articleChecklist: ["Incluir un sección de 'Bonos de Acción Rápida'.", "Mostrar sellos de garantía de 7 o 15 días claramente.", "Verificar que el botón de pago funcione en todas the divisas."]
        }
    },
    { 
        icon: ShoppingCart, 
        title: "11. Checkout", 
        subtitle: "Pasarela de Pago", 
        videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
        description: "Finalizar the transacción económica de forma segura, rápida y sin fricciones técnicas.",
        masterclass: {
            importance: "Es el punto más crítico. Cualquier duda técnica aquí se traduce en dinero perdido. Debe ser rápido, intuitivo y dar seguridad absoluta.",
            question: "¿Cómo funciona un Checkout de alta conversión?",
            article: [
                {
                    title: "The Barrera Final",
                    content: "El checkout es el momento de mayor tensión psicológica. El usuario está a punto de desprenderse de su dinero. Por eso, el diseño debe ser profesional, intuitivo y seguro."
                },
                {
                    title: "Ventas Adicionales (Order Bumps)",
                    content: "El momento en que alguien saca the tarjeta es el mejor momento para ofrecer algo más. Un Order Bump es una oferta pequeña complementaria que se añade con un solo clic. Puede aumentar tus ganancias por cliente hasta en un 30% instantáneamente."
                },
                {
                    title: "Recuperación de Carritos",
                    content: "Mucha gente llega al checkout pero no termina el pago por falta de saldo, duda final o distracción. Un sistema de recuperación automático enviará un recordatorio para 'salvar' esa venta que ya estaba casi ganada."
                }
            ],
            metricsExplanation: "Esta es the métrica de the verdad. Si tienes muchos carritos iniciados pero pocos pagos, tu checkout tiene errores, el precio es confuso o faltan métodos de pago locales.",
            metrics: [
                { name: "Abandonment Rate", why: "Porcentaje de personas que se van sin pagar." },
                { name: "Tasa de Apertura", why: "Mide si the pasarelas de pago están funcionando bien." }
            ],
            mistakes: ["Pedir demasiados datos personales innecesarios.", "No ofrecer pagos en cuotas o tarjetas locales.", "No tener soporte por chat en vivo en the página de pago."],
            benefits: ["Cierre de ventas sin intervención humana directa.", "Incremento del ticket promedio mediante ofertas extra.", "Gestión profesional de facturación y acceso al curso."],
            articleChecklist: ["Asegurar que el botón de soporte sea visible en el checkout.", "Configurar el Order Bump con un producto de bajo costo.", "Verificar que el email de bienvenida llegue en menos de 1 minuto."]
        }
    }
];

interface TacticalModalProps {
    step: any;
    onClose: () => void;
}

const TacticalModal: React.FC<TacticalModalProps> = ({ step, onClose }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
            <div className="relative w-full max-w-5xl bg-[#0b0b0b] border border-emerald-500/30 rounded-[3rem] shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-500">
                {/* Header Neon Emerald */}
                <div className="p-8 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-emerald-950/30 to-black shrink-0">
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            {React.createElement(step.icon, { className: "w-8 h-8" })}
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight">{step.title}</h3>
                            <p className="text-emerald-400 text-sm font-black uppercase tracking-[0.15em] mt-1 opacity-90">{step.description}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Area Rediseñada con Video */}
                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[#050505]/50">
                    {/* Reproductor de Video */}
                    <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black relative group">
                        <iframe 
                            src={`${step.videoUrl}?rel=0&modestbranding=1&controls=1&showinfo=0`} 
                            className="w-full h-full" 
                            title={step.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                        />
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="p-8 border-t border-white/10 bg-gray-900/50 flex justify-end shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Entendido, Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

interface FlowCardProps {
    icon: any;
    title: string;
    subtitle: string;
    description: string;
    step: number;
    onOpenMasterclass: (stepData: any) => void;
    stepData: any;
}

const FlowCard: React.FC<FlowCardProps> = ({ icon: Icon, title, subtitle, description, step, onOpenMasterclass, stepData }) => {
    const isLastInRow = step % 2 === 0;
    const isLastItem = step === 11;
    const isEndOfRowDesktop = step % 2 === 0;

    return (
        <div id={`psd-flow-card-${step}-container`} className="group relative flex flex-col h-full">
            <div 
                id={`psd-flow-card-${step}-content`}
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center relative z-10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)] h-full min-h-[380px] max-w-[95%] mx-auto"
            >
                {/* Step Number Badge */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-black rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-2xl z-20 group-hover:rotate-12 transition-transform">
                    {step}
                </div>

                <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors shadow-inner relative shrink-0">
                    <Icon className="w-10 h-10 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>

                <h4 className="text-white font-black text-2xl mb-6 tracking-tight">{title}</h4>
                <p className="text-xl leading-relaxed text-emerald-400 font-bold mb-8 w-full">
                    {subtitle}
                </p>
                
                <div className="text-left w-full flex-1">
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">{description}</p>
                </div>

                <button 
                    id={`psd-flow-card-${step}-tactical-btn`}
                    onClick={(e) => { e.stopPropagation(); onOpenMasterclass(stepData); }}
                    className="mt-10 w-full flex items-center justify-center gap-2 text-lg font-black text-white transition-all z-20 relative px-6 py-4 rounded-xl bg-[#FF5A1F] border border-[#FF5A1F] hover:bg-[#D94A1E] shadow-lg shadow-[#FF5A1F]/20"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" /> Más Información
                        </span>
                    </span>
                </button>
            </div>

            {!isLastItem && (
                <>
                    {!isLastInRow && (
                        <div id={`psd-flow-card-${step}-arrow-right`} className="hidden lg:flex absolute top-1/2 -right-12 w-12 items-center justify-center z-0 text-[#FF5A1F] animate-pulse">
                            <ArrowRight className="w-10 h-10" strokeWidth={3} />
                        </div>
                    )}
                    {isEndOfRowDesktop && (
                        <div id={`psd-flow-card-${step}-arrow-snake`} className="hidden lg:block absolute top-full right-1/2 w-[calc(100%+4rem)] h-32 pointer-events-none z-0">
                           <div className="absolute right-[-1px] top-0 h-16 w-0.5 bg-gradient-to-b from-[#FF5A1F]/50 to-[#FF5A1F]/10 animate-pulse"></div>
                           <div className="absolute right-0 top-16 left-0 h-0.5 bg-gradient-to-r from-[#FF5A1F]/10 via-[#FF5A1F]/50 to-[#FF5A1F]/10"></div>
                           <div className="absolute left-[-1px] top-16 h-16 w-0.5 bg-gradient-to-b from-[#FF5A1F]/10 to-[#FF5A1F]/50 animate-pulse"></div>
                            <div className="absolute left-[-0.65rem] bottom-[-0.6rem] text-[#FF5A1F]">
                                <ArrowDown className="w-6 h-6" strokeWidth={3} />
                            </div>
                        </div>
                    )}
                    <div id={`psd-flow-card-${step}-arrow-down`} className="lg:hidden flex justify-center py-6 text-[#FF5A1F] animate-pulse">
                        <ArrowDown className="w-10 h-10" strokeWidth={3} />
                    </div>
                </>
            )}
        </div>
    );
};

interface ProjectStrategy_BlueprintProps {
    handleTooltipHover: (e: React.MouseEvent, content: string[]) => void;
    handleTooltipLeave: () => void;
}

export const ProjectStrategy_Blueprint: React.FC<ProjectStrategy_BlueprintProps> = () => {
    const [selectedMasterclass, setSelectedMasterclass] = useState<any | null>(null);

    return (
        <div id="psd-blueprint-container" className="space-y-12">
            <div id="psd-blueprint-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                    <Zap className="w-5 h-5 fill-current" /> ¿Cómo será mi estrategia?
                </div>
                <h3 id="psd-blueprint-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    ¿Cómo funcionará tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">estrategia de ventas?</span>
                </h3>
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-emerald-500 pl-8 py-2">Nuestro sistema de ventas no depende de la suerte. Nuestra estrategia está diseñada para atraer clientes interesados en tu producto digital y llevarlos paso a paso hasta que tomen the decisión de compra con confianza.</p>
                    <div className="hidden md:block w-px h-24 bg-teal-500/30"></div>
                    <div 
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                    >
                        <iframe 
                            className="w-full h-full rounded-2xl"
                            src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                            title="Video Tutorial" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
            
            <div id="psd-blueprint-grid-wrapper" className="w-full border border-gray-800 rounded-[3.5rem] relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] bg-[#050505]">
                {/* Enhanced Animated Grid Background */}
                <div className="absolute inset-0 z-0">
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent"></div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20 relative z-10">
                    <h4 className="text-center text-white font-black text-2xl uppercase tracking-[0.2em] mb-24 opacity-80">
                        El recorrido completo de tu cliente (de principio a fin)
                    </h4>
                    
                    <div id="psd-blueprint-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-16 gap-y-[12rem]">
                        {ACQUISITION_STEPS.map((step, index) => (
                            <FlowCard 
                                key={index} 
                                icon={step.icon} 
                                title={step.title.split('. ')[1] || step.title} 
                                subtitle={step.subtitle} 
                                description={step.description}
                                step={index + 1}
                                onOpenMasterclass={setSelectedMasterclass}
                                stepData={step}
                            />
                        ))}
                    </div>

                    {/* --- STRATEGIC CLOSURE SECTION --- */}
                    <div id="psd-blueprint-closure" className="mt-32 max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl backdrop-blur-sm">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Sparkles className="w-32 h-32 text-emerald-400" />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                                    <Rocket className="w-8 h-8" />
                                </div>
                                <h4 className="text-3xl font-black text-white leading-tight">Tu Estrategia de Marketing Digital 24/7</h4>
                                <p className="text-gray-300 text-xl font-light leading-relaxed">
                                    Nuestro sistema no depende de una sola acción ni de un solo canal. Funciona como un ecosistema completo que trabaja por ti todos los días. Tú no necesitas dominar marketing, copywriting o automatizaciones. Nuestro sistema se encargará de que cuentes con todas the herramientas necesarias para obtener grandes resultados en menos tiempo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Animated Scan Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-scan-line pointer-events-none"></div>
            </div>

            {selectedMasterclass && (
                <TacticalModal 
                    step={selectedMasterclass} 
                    onClose={() => setSelectedMasterclass(null)} 
                />
            )}
        </div>
    );
};
