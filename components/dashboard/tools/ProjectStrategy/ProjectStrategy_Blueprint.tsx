import React, { useState } from 'react';
import { Layers, ArrowRight, ArrowDown, PlayCircle, Clapperboard, Globe, CheckCircle2, Users, MessageCircle, FileText, MonitorPlay, ShoppingCart, Zap, RefreshCw, Sparkles, Rocket, X, AlertTriangle, BarChart3, ListChecks, Brain, Target, Lightbulb, TrendingUp, ShieldCheck, Mail, BookOpen } from 'lucide-react';

const ACQUISITION_STEPS = [
    { 
        icon: Clapperboard, 
        title: "1. Atracción de Audiencia", 
        subtitle: "Canales: Reels, anuncios en Instagram, Facebook o Google", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Captar la atención de desconocidos y dirigirlos hacia el inicio de tu embudo de ventas.</p>
                </div>
            </div>
        ),
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
            checklist: ["Publicar entre 2 y 4 Reels diarios con ganchos directos.", "Montar campañas de tráfico directo a la Landing Page.", "Responder los primeros 50 comentarios para activar el algoritmo."]
        }
    },
    { 
        icon: Globe, 
        title: "2. Landing Page", 
        subtitle: "Visitante deja sus datos para recibir el contenido gratuito.", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Convertir el tráfico frío en contactos calificados capturando sus datos de contacto.</p>
                </div>
            </div>
        ),
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
            checklist: ["Verificar que el formulario konekte con el CRM.", "Optimizar el peso de las imágenes para carga rápida.", "Realizar una prueba de registro desde un teléfono Android e iPhone."]
        }
    },
    { 
        icon: CheckCircle2, 
        title: "3. Página de Gracias", 
        subtitle: "Instrucciones inmediatas tras el registro.", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Confirmar el registro exitoso y guiar al lead inmediatamente hacia el canal de entrega o comunidad.</p>
                </div>
            </div>
        ),
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
            checklist: ["Incluir un botón gigante que diga 'HAGA CLIC AQUÍ PARA ACCEDER'.", "Añadir un aviso de revisar la carpeta de SPAM.", "Configurar el píxel para marcar la conversión final de registro."]
        }
    },
    { 
        icon: Users, 
        title: "4. Comunidad", 
        subtitle: "Grupo de WhatsApp", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Nutrir a los prospectos en un entorno controlado para generar confianza y prueba social colectiva.</p>
                </div>
            </div>
        ),
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
            checklist: ["Cerrar el grupo para que solo administradores envíen mensajes.", "Publicar un mensaje de bienvenida fijo en la descripción.", "Programar 3 contenidos de valor semanales (Tips, Historias, Resultados)."]
        }
    },
    { 
        icon: MessageCircle, 
        title: "5. Message Directo", 
        subtitle: "Conversación 1 a 1", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Resolver dudas específicas de forma personalizada para eliminar barreras finales de compra.</p>
                </div>
            </div>
        ),
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
                    content: "Nada genera más confianza que escuchar una voz real. El sistema te sugiere cuándo enviar un audio para humanizar el proceso. La voz transmite seguridad y profesionalismo, algo que el texto plano a veces no logra."
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
            checklist: ["Configurar respuestas rápidas en WhatsApp Business.", "Tener el enlace de pago siempre copiado en el portapapeles.", "Usar notas de voz de máximo 30 segundos para resolver dudas."]
        }
    },
    { 
        icon: FileText, 
        title: "6. Lead Magnet", 
        subtitle: "Contenido gratuito (PDF o Clase)", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Entregar valor masivo de forma gratuita para activar la reciprocidad y demostrar autoridad técnica.</p>
                </div>
            </div>
        ),
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
            checklist: ["Crear un título magnético que prometa un resultado rápido.", "Añadir enlaces de WhatsApp al final del documento.", "Asegurar que el diseño sea limpio y fácil de leer en móviles."]
        }
    },
    { 
        icon: Mail, 
        title: "7. Email Marketing", 
        subtitle: "Secuencia de nutrición y venta por correo.", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Recuperar la atención de los leads y educarlos mediante una secuencia lógica de persuasión.</p>
                </div>
            </div>
        ),
        masterclass: {
            importance: "El email marketing es el canal con mayor retorno de inversión. Te permite estar presente en la bandeja de entrada de tu cliente de forma personal y profesional.",
            question: "¿Por qué el Email Marketing es clave?",
            article: [
                {
                    title: "El Activo Más Valioso: Tu Lista",
                    content: "A diferencia de las redes sociales, tu lista de correos te pertenece. El email marketing te permite automatizar la educación de tu prospecto sin depender de algoritmos externos cambiantes."
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
            benefits: ["Automatización total de la relación con el cliente.", "Costo de envío prácticamente nulo.", "Alta tasa de conversión en cierres masivos."],
            checklist: ["Configurar la secuencia de bienvenida (Día 0).", "Asegurar que el link de desuscripción sea visible.", "Realizar una prueba de envío para verificar formato."]
        }
    },
    { 
        icon: BookOpen, 
        title: "8. Artículos de Blog", 
        subtitle: "Contenido educativo para generar autoridad.", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Generar tráfico orgánico recurrente y posicionar tu marca como referente inagotable de conocimiento.</p>
                </div>
            </div>
        ),
        masterclass: {
            importance: "El contenido es la base de la autoridad. Un blog activo le dice a Google y a tus clientes que eres un referente serio en tu industria.",
            question: "¿Cómo ayudan los artículos de blog a vender?",
            article: [
                {
                    title: "Educación Pre-Venta",
                    content: "Un cliente educado es un cliente más fácil de cerrar. Los artículos resuelven dudas lógicas, permitiendo que el prospecto llegue a la fase de compra con mucha más confianza."
                },
                {
                    title: "SEO y Tráfico Gratis",
                    content: "Al escribir sobre temas que la gente ya está buscando, atraes visitas cualificadas sin gastar un dólar en anuncios. El sistema optimiza estos textos para ser encontrados."
                }
            ],
            metricsExplanation: "Debes mirar qué temas generan más interés para escalar tu estrategia.",
            metrics: [
                { name: "Tiempo en Página", why: "Indica si el contenido es realmente valioso y se consume." },
                { name: "Sesiones Orgánicas", why: "Mide el flujo de personas nuevas que te descubren." }
            ],
            mistakes: ["Escribir contenido irrelevante para el avatar.", "No poner llamados a la acción claros.", "Textos difíciles de leer en dispositivos móviles."],
            benefits: ["Construcción de marca a largo plazo.", "Generación de tráfico recurrente y gratuito.", "Eliminación de objeciones mediante la educación."],
            checklist: ["Publicar 1 artículo semanal sobre un dolor del avatar.", "Insertar botones de registro en medio del texto.", "Compartir el artículo en grupos y redes sociales."]
        }
    },
    { 
        icon: RefreshCw, 
        title: "9. Lanzamiento por Whatsapp", 
        subtitle: "Estrategia de cierre masivo en grupos.", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Concentrar la demanda y generar una explosión de ventas mediante la escasez y urgencia grupal.</p>
                </div>
            </div>
        ),
        masterclass: {
            importance: "El lanzamiento por WhatsApp es la forma más rápida y efectiva de generar ingresos significativos concentrados en pocos días aprovechando la urgencia.",
            question: "¿Cómo funciona un Lanzamiento por WhatsApp?",
            article: [
                {
                    title: "El Poder de la Anticipación",
                    content: "Un lanzamiento no es un evento aislado; es una construcción de deseo. Mediante una secuencia probada, el sistema prepara la mente del lead para el momento exacto de la apertura de inscripciones."
                },
                {
                    title: "Disparadores Mentales de Grupo",
                    content: "Ver a otros interesados activa la prueba social. El sistema te ayuda a moderar y guiar la conversación para que el deseo de uno se convierta en la compra de muchos."
                }
            ],
            metricsExplanation: "El éxito se mide por el volumen de ventas en relación al número de personas en el grupo.",
            metrics: [
                { name: "Tasa de Cierre Grupal", why: "Porcentaje de miembros del grupo que compran la oferta." },
                { name: "Velocidad de Venta", why: "Indica qué tan fuerte fue la urgencia generada." }
            ],
            mistakes: ["No calentar el grupo antes de abrir carrito.", "Ser demasiado robótico o frío en las respuestas.", "No hacer seguimiento a quienes no compraron al final."],
            benefits: ["Alta rentabilidad en periodos cortos.", "Feedback directo y masivo de tu mercado.", "Aumento exponencial de la autoridad de marca."],
            checklist: ["Revisar los 14 mensajes del asistente de lanzamientos.", "Configurar el cronómetro de urgencia en la página.", "Tener el enlace de checkout listo y verificado."]
        }
    },
    { 
        icon: MonitorPlay, 
        title: "10. Página de Venta", 
        subtitle: "Carta de ventas (VSL o texto)", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Presentar la oferta de forma irresistible y facilitar la transición hacia el pago final.</p>
                </div>
            </div>
        ),
        masterclass: {
            importance: "Es el clímax del embudo. Aquí se justifica racionalmente el deseo emocional. Debe ser impecable, clara y eliminar cualquier riesgo percibido.",
            question: "¿Qué es una Carta de Ventas (VSL)?",
            article: [
                {
                    title: "El Argumento Final",
                    content: "La página de ventas es donde ocurre la magia. Aquí no explicamos 'qué' es el producto, sino 'cómo' va a cambiar la vida del usuario. Usamos copywriting agresivo pero ético para mostrar que el costo de no comprar es mayor que el precio del curso."
                },
                {
                    title: "Bonus y Escasez",
                    content: "Un producto digital se percibe como más valioso cuando se acompaña de bonos que resuelven problemas futuros. El sistema genera estos bonos por ti para aumentar el valor percibido sin que tengas que trabajar más."
                },
                {
                    title: "Eliminación Total del Riesgo",
                    content: "La garantía es el elemento más ignorado y más importante. Debemos prometer que si no hay resultados, no hay costo. Esto transfiere el riesgo de los hombros del cliente a los tuyos, facilitando el 'sí'."
                }
            ],
            metricsExplanation: "Esta página es tu examen final. Si el tráfico llega aquí pero no hay clics en el botón de pago, tu oferta no es lo suficientemente irresistible o el precio no está justificado.",
            metrics: [
                { name: "Click to Payment", why: "Porcentaje de personas que inician el checkout." },
                { name: "Average Session Duration", why: "Mide si el usuario leyó todos tus argumentos." }
            ],
            mistakes: ["Esconder el precio hasta el final del todo.", "No incluir una sección de preguntas frecuentes.", "No mostrar testimonios de alumnos reales."],
            benefits: ["Automatización total del proceso de cierre de ventas.", "Escalabilidad ilimitada de tu negocio digital.", "Estandarización de tu mensaje de ventas perfecto."],
            checklist: ["Incluir un sección de 'Bonos de Acción Rápida'.", "Mostrar sellos de garantía de 7 o 15 días claramente.", "Verificar que el botón de pago funcione en todas las divisas."]
        }
    },
    { 
        icon: ShoppingCart, 
        title: "11. Checkout", 
        subtitle: "Pasarela de Pago", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xl uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-white text-xl leading-relaxed">Finalizar la transacción económica de forma segura, rápida y sin fricciones técnicas.</p>
                </div>
            </div>
        ),
        masterclass: {
            importance: "Es el punto más crítico. Cualquier duda técnica aquí se traduce en dinero perdido. Debe ser rápido, intuitivo y dar seguridad absoluta.",
            question: "¿Cómo funciona un Checkout de alta conversión?",
            article: [
                {
                    title: "La Barrera Final",
                    content: "El checkout es el momento de mayor tensión psicológica. El usuario está a punto de desprenderse de su dinero. Por eso, el diseño debe ser profesional, intuitivo y seguro."
                },
                {
                    title: "Ventas Adicionales (Order Bumps)",
                    content: "El momento en que alguien saca la tarjeta es el mejor momento para ofrecer algo más. Un Order Bump es una oferta pequeña complementaria que se añade con un solo clic. Puede aumentar tus ganancias por cliente hasta en un 30% instantáneamente."
                },
                {
                    title: "Recuperación de Carritos",
                    content: "Mucha gente llega al checkout pero no termina el pago por falta de saldo, duda final o distracción. Un sistema de recuperación automático enviará un recordatorio para 'salvar' esa venta que ya estaba casi ganada."
                }
            ],
            metricsExplanation: "Esta es la métrica de la verdad. Si tienes muchos carritos iniciados pero pocos pagos, tu checkout tiene errores, el precio es confuso o faltan métodos de pago locales.",
            metrics: [
                { name: "Abandonment Rate", why: "Porcentaje de personas que se van sin pagar." },
                { name: "Tasa de Apertura", why: "Mide si las pasarelas de pago están funcionando bien." }
            ],
            mistakes: ["Pedir demasiados datos personales innecesarios.", "No ofrecer pagos en cuotas o tarjetas locales.", "No tener soporte por chat en vivo en la página de pago."],
            benefits: ["Cierre de ventas sin intervención humana directa.", "Incremento del ticket promedio mediante ofertas extra.", "Gestión profesional de facturación y acceso al curso."],
            checklist: ["Asegurar que el botón de soporte sea visible en el checkout.", "Configurar el Order Bump con un producto de bajo costo.", "Verificar que el email de bienvenida llegue en menos de 1 minuto."]
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
            <div className="relative w-full max-w-5xl bg-gray-900 border border-emerald-500/30 rounded-[3rem] shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-500">
                {/* Header Neon Emerald */}
                <div className="p-8 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-emerald-950/30 to-black shrink-0">
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            {React.createElement(step.icon, { className: "w-8 h-8" })}
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight">{step.title}</h3>
                            <p className="text-emerald-400 text-sm font-black uppercase tracking-[0.15em] mt-1 opacity-90">{step.masterclass.importance}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-10 space-y-16 custom-scrollbar bg-[#050505]/50">
                    
                    {/* Articulo Educativo */}
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-sm border-l-4 border-emerald-500/30 pl-4 py-1">
                                <Brain className="w-5 h-5" /> Fundamento Estratégico
                            </h4>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{step.masterclass.question}</h2>
                        </div>
                        
                        <div className="grid gap-12 max-w-4xl">
                            {step.masterclass.article.map((block: any, i: number) => (
                                <div key={i} className="space-y-4">
                                    <h5 className="text-2xl font-black text-emerald-300/90 tracking-tight">{block.title}</h5>
                                    <p className="text-gray-300 text-xl leading-relaxed font-light font-sans">
                                        {block.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Métricas Explicadas */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                         <div className="space-y-2">
                            <h4 className="flex items-center gap-3 text-blue-400 font-black uppercase tracking-widest text-sm">
                                <BarChart3 className="w-5 h-5" /> Métricas de Éxito & Control
                            </h4>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                                {step.masterclass.metricsExplanation}
                            </p>
                         </div>
                         <div className="grid md:grid-cols-2 gap-6">
                            {step.masterclass.metrics.map((m: any, i: number) => (
                                <div key={i} className="p-6 bg-black/40 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="w-4 h-4 text-blue-500" />
                                        <p className="text-white font-black text-base">{m.name}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">{m.why}</p>
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Errores Fatales */}
                        <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 space-y-8">
                            <h4 className="flex items-center gap-3 text-red-400 font-black uppercase tracking-widest text-sm">
                                <AlertTriangle className="w-5 h-5" /> Errores Fatales a Evitar
                            </h4>
                            <ul className="space-y-6">
                                {step.masterclass.mistakes.map((m: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-gray-300 text-lg leading-snug group">
                                        <div className="w-6 h-6 rounded-full bg-red-900/30 text-red-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <X className="w-4 h-4" /> 
                                        </div>
                                        {m}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Beneficios y Éxito */}
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-10 space-y-8">
                            <h4 className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-sm">
                                <ShieldCheck className="w-5 h-5" /> Beneficios y Éxito
                            </h4>
                            <ul className="space-y-6">
                                {step.masterclass.benefits.map((b: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-gray-300 text-lg leading-snug group">
                                        <div className="w-6 h-6 rounded-full bg-emerald-900/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="w-4 h-4" /> 
                                        </div>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Checklist de Implementación */}
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ListChecks className="w-40 h-40 text-white" />
                        </div>
                        <h4 className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm relative z-10">
                            <ListChecks className="w-5 h-5 text-emerald-400" /> Checklist de Implementación Inmediata
                        </h4>
                        <div className="grid md:grid-cols-1 gap-4 relative z-10">
                            {step.masterclass.checklist.map((c: string, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-5 bg-black/60 rounded-2xl border border-white/5 group hover:border-emerald-500/40 transition-all">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-lg shadow-emerald-900/10">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-gray-200 text-xl font-medium tracking-tight">{c}</span>
                                </div>
                            ))}
                        </div>
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
    description: React.ReactNode;
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
                <p className="text-[11px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-8 bg-emerald-500/10 px-5 py-2 rounded-full leading-tight border border-emerald-500/20 w-full">
                    {subtitle}
                </p>
                
                <div className="text-left w-full flex-1">
                    {description}
                </div>

                <button 
                    id={`psd-flow-card-${step}-tactical-btn`}
                    onClick={(e) => { e.stopPropagation(); onOpenMasterclass(stepData); }}
                    className="mt-10 w-full flex items-center justify-center gap-2 text-lg font-black text-white transition-all z-20 relative px-6 py-4 rounded-xl bg-[#FF5A1F] border border-[#FF5A1F] hover:bg-[#D94A1E] shadow-lg shadow-[#FF5A1F]/20"
                >
                    <Sparkles className="w-4 h-4" /> Más Detalles
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
    onOpenVideo: () => void;
}

export const ProjectStrategy_Blueprint: React.FC<ProjectStrategy_BlueprintProps> = ({ onOpenVideo }) => {
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
                <div className="grid md:grid-cols-2 gap-10 text-white text-xl leading-relaxed font-light"><p className="border-l-4 border-emerald-500 pl-8 py-2">No vendemos al azar ni dependemos de la suerte. Tu sistema está diseñado para acompañar al cliente paso a paso, desde que descubre el problema hasta que toma la decisión de compra con confianza.</p><p className="border-l-4 border-teal-500 pl-8 py-2">A continuación, puedes ver el recorrido completo que seguirá cada persona interesada en tu producto. Todas estas piezas son creadas automáticamente por el sistema.</p></div>
            </div>

            {/* BLOQUE DE VIDEO: SOPORTE VISUAL ESTRATÉGICO */}
            <div id="psd-blueprint-video-block" className="max-w-[70em] mx-auto px-4 md:px-0 mb-12">
                <div className="bg-gray-900/40 p-4 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-indigo-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30"></div>
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-inner bg-black relative">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" 
                            title="Explicación del Mapa de Ruta" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity group-hover:opacity-0">
                            <PlayCircle className="w-5 h-5 text-indigo-400" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Video Explicativo de Estrategia</span>
                        </div>
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
                                <h4 className="text-3xl font-black text-white leading-tight">Tu Ecosistema de Ventas 24/7</h4>
                                <p className="text-gray-300 text-xl font-light leading-relaxed">
                                    Este sistema no depende de una sola acción ni de un solo canal. Funciona como un <span className="text-emerald-400 font-bold">ecosistema completo</span> que trabaja por ti todos los días. Tú no necesitas dominar marketing, copywriting o automatizaciones. El sistema se encarga de la estructura. <span className="text-white font-bold">Tú decides cuánto quieres crecer.</span>
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