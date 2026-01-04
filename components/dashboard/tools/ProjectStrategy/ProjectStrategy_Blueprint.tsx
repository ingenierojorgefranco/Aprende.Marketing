import React, { useState } from 'react';
import { Layers, ArrowRight, ArrowDown, PlayCircle, Clapperboard, Globe, CheckCircle2, Users, MessageCircle, FileText, MonitorPlay, ShoppingCart, Zap, RefreshCw, Sparkles, Rocket, X, AlertTriangle, BarChart3, ListChecks, Brain, Target, Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';

////////// Actualización: Sistema Educativo Profundo "Más Detalles" - 01/01/2026 12:45 //////////
const ACQUISITION_STEPS = [
    { 
        icon: Clapperboard, 
        title: "1. Atracción de Audiencia", 
        subtitle: "Canales: Reels, anuncios en Instagram, Facebook o Google", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué hace el sistema:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Define los mensajes clave y sugiere ideas de contenido.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Llamar la atención de personas interesadas y llevarlas a tu página.</p>
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
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Título principal</li>
                        <li>Dolores y beneficios</li>
                        <li>Llamado a la acción</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Convertir visitas en contactos reales (leads).</p>
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
            checklist: ["Verificar que el formulario conecte con el CRM.", "Optimizar el peso de las imágenes para carga rápida.", "Realizar una prueba de registro desde un teléfono Android e iPhone."]
        }
    },
    { 
        icon: CheckCircle2, 
        title: "3. Página de Gracias", 
        subtitle: "Instrucciones inmediatas tras el registro.", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Confirmamos el registro y guiamos al usuario al siguiente paso.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Mensaje de confirmación</li>
                        <li>Instrucciones claras</li>
                        <li>Enlace a WhatsApp o contenido</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Evitar que el lead se enfríe.</p>
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
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">El lead entra a un entorno más cercano y controlado.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Mensaje de bienvenida</li>
                        <li>Reglas del grupo</li>
                        <li>Mensajes de valor</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Generar confianza y cercanía.</p>
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
                    content: "En el grupo tú eres el guía. Aportar valor constante sin pedir nada a cambio te posiciona como el experto de referencia. Cuando abras las inscripciones, no tendrás que vender; simplemente te pedirán el enlace."
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
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Se resuelven dudas personales antes de la compra.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Mensajes base</li>
                        <li>Respuestas a objeciones</li>
                        <li>Guiones de cierre</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Acompañar la decisión sin presión.</p>
                </div>
            </div>
        ),
        masterclass: {
            importance: "Para productos de ticket medio/alto, el humano compra a humano. Resolver una duda específica por chat puede salvar el 50% de tus ventas caídas.",
            question: "¿Cómo cerrar ventas por Mensaje Directo?",
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
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Estructura del contenido</li>
                        <li>Mensaje de entrega</li>
                        <li>Secuencia de introducción</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Demostrar valor real antes de vender.</p>
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
                    content: "Un buen Lead Magnet deja al usuario 'con hambre'. Resuelve el 'qué' pero deja espacio para el 'cómo' (que es tu producto de pago). Debe actuar como el capítulo 1 de una novela que no puedes dejar de leer."
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
        icon: MonitorPlay, 
        title: "7. Página de Venta", 
        subtitle: "Carta de ventas (VSL o texto)", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Se presenta la oferta completa al prospecto.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Argumentos de venta</li>
                        <li>Beneficios y Bonus</li>
                        <li>Llamados a la acción</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Convertir interés en compra final.</p>
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
            checklist: ["Incluir una sección de 'Bonos de Acción Rápida'.", "Mostrar sellos de garantía de 7 o 15 días claramente.", "Verificar que el botón de pago funcione en todas las divisas."]
        }
    },
    { 
        icon: RefreshCw, 
        title: "8. Nutrición de Prospectos", 
        subtitle: "Email, Blog y WhatsApp", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Correos automáticos</li>
                        <li>Artículos educativos</li>
                        <li>Mensajes de seguimiento</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Vender incluso si no compró al inicio.</p>
                </div>
            </div>
        ),
        masterclass: {
            importance: "La mayoría de la gente no compra al primer impacto. El 80% de las ventas ocurren entre el 5º y el 12º contacto con la marca.",
            question: "¿Qué es la Nutrición de Prospectos?",
            article: [
                {
                    title: "La Siembra de la Venta",
                    content: "Nutrir prospectos (Nurturing) es el proceso de educar al lead a lo largo del tiempo. No todo el mundo está listo para comprar hoy, pero si te mantienes en su mente con valor, cuando estén listos, te elegirán a ti. Es una maratón, no un sprint."
                },
                {
                    title: "El Sistema 'Evergreen'",
                    content: "Mediante emails y artículos automáticos, el sistema mantiene el interés vivo. Cada mensaje debe derribar una pequeña objeción diferente: falta de dinero, falta de tiempo, miedo al fracaso. Día a día, vas minando sus dudas."
                },
                {
                    title: "Omnicanalidad Estratégica",
                    content: "No te limites al email. El sistema te propone publicar en tu blog y enviar recordatorios por WhatsApp. Estar presente en múltiples canales aumenta la confianza y la autoridad de tu marca exponencialmente."
                }
            ],
            metricsExplanation: "Si tus correos no se abren, tus asuntos son aburridos. Si se abren pero no hay clics, el contenido no genera suficiente curiosidad o deseo.",
            metrics: [
                { name: "Open Rate (Tasa de Apertura)", why: "Mide la efectividad de tus títulos y asuntos de correo." },
                { name: "Click Rate (CTR)", why: "Mide el interés real en lo que estás proponiendo." }
            ],
            mistakes: ["Enviar correos solo de venta sin dar nada de valor.", "No automatizar; intentar hacerlo todo manual.", "Usar un tono demasiado comercial o agresivo."],
            benefits: ["Generación de ventas constantes a largo plazo.", "Aumento del valor del tiempo de vida del cliente (LTV).", "Creación de una comunidad de seguidores fieles."],
            checklist: ["Programar una secuencia de 7 días de emails educativos.", "Publicar 1 artículo de blog semanal sobre un dolor del cliente.", "Hacer seguimiento manual a los carritos abandonados cada 24h."]
        }
    },
    { 
        icon: ShoppingCart, 
        title: "9. Checkout", 
        subtitle: "Pasarela de Pago", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">El cliente realiza el pago de forma segura.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Cerrar la venta sin fricciones técnicas.</p>
                </div>
            </div>
        ),
        masterclass: {
            importance: "Es el punto más crítico. Cualquier duda técnica aquí se traduce en dinero perdido. Debe ser rápido, intuitivo y dar seguridad absoluta.",
            question: "¿Cómo funciona un Checkout de alta conversión?",
            article: [
                {
                    title: "La Barrera Final",
                    content: "El checkout es el momento de mayor tensión psicológica. El usuario está a punto de desprenderse de su dinero. Por eso, el diseño debe ser minimalista, sin distracciones, y lleno de insignias de seguridad que calmen el instinto de protección del lead."
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
////////// Fin de actualización - 01/01/2026 12:45 //////////

interface FlowCardProps {
    icon: any;
    title: string;
    subtitle: string;
    description: React.ReactNode;
    step: number;
    ////////// Actualización: Soporte para apertura de detalles educativos - 01/01/2026 12:45 //////////
    onOpenMasterclass: (stepData: any) => void;
    stepData: any;
    ////////// Fin de actualización - 01/01/2026 12:45 //////////
}

const FlowCard: React.FC<FlowCardProps> = ({ icon: Icon, title, subtitle, description, step, onOpenMasterclass, stepData }) => {
    const isLastInRow = step % 3 === 0;
    const isLastItem = step === 9;
    const isEndOfRowDesktop = (step === 3 || step === 6);

    return (
        <div id={`psd-flow-card-${step}-container`} className="group relative flex flex-col h-full">
            <div 
                id={`psd-flow-card-${step}-content`}
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center relative z-10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)] h-full"
            >
                {/* Step Number Badge */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-black rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-2xl z-20 group-hover:rotate-12 transition-transform">
                    {step}
                </div>

                <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors shadow-inner relative shrink-0">
                    <Icon className="w-10 h-10 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>

                <h4 className="text-white font-black text-2xl mb-1 tracking-tight">{title}</h4>
                <p className="text-[11px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-8 bg-emerald-500/10 px-5 py-2 rounded-full leading-tight border border-emerald-500/20 w-full">
                    {subtitle}
                </p>
                
                <div className="text-left w-full flex-1">
                    {description}
                </div>

                {/* ////////// Actualización: Botón "Más Detalles" - 01/01/2026 12:45 ////////// */}
                <button 
                    id={`psd-flow-card-${step}-tactical-btn`}
                    onClick={(e) => { e.stopPropagation(); onOpenMasterclass(stepData); }}
                    className="mt-10 w-full flex items-center justify-center gap-2 text-xs font-black text-white transition-all z-20 relative px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-400 shadow-lg"
                >
                    <Sparkles className="w-4 h-4" /> Más Detalles
                </button>
                {/* ////////// Fin de actualización - 01/01/2026 12:45 ////////// */}
            </div>

            {!isLastItem && (
                <>
                    {!isLastInRow && (
                        <div id={`psd-flow-card-${step}-arrow-right`} className="hidden lg:flex absolute top-1/2 -right-12 w-12 items-center justify-center z-0 text-emerald-500/30 animate-pulse">
                            <ArrowRight className="w-10 h-10" />
                        </div>
                    )}
                    {isEndOfRowDesktop && (
                        <div id={`psd-flow-card-${step}-arrow-snake`} className="hidden lg:block absolute top-full right-1/2 w-[calc(200%+6rem)] h-32 pointer-events-none z-0">
                           <div className="absolute right-[-1px] top-0 h-16 w-0.5 bg-gradient-to-b from-emerald-500/30 to-emerald-500/10 animate-pulse"></div>
                           <div className="absolute right-0 top-16 left-0 h-0.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/30 to-emerald-500/10"></div>
                           <div className="absolute left-[-1px] top-16 h-16 w-0.5 bg-gradient-to-b from-emerald-500/10 to-emerald-500/30 animate-pulse"></div>
                            <div className="absolute left-[-0.65rem] bottom-[-0.6rem] text-emerald-500/40">
                                <ArrowDown className="w-6 h-6" />
                            </div>
                        </div>
                    )}
                    <div id={`psd-flow-card-${step}-arrow-down`} className="lg:hidden flex justify-center py-6 text-emerald-500/30 animate-pulse">
                        <ArrowDown className="w-10 h-10" />
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
    ////////// Actualización: Estado para manejar el modal educativo - 01/01/2026 12:45 //////////
    const [selectedMasterclass, setSelectedMasterclass] = useState<any | null>(null);
    ////////// Fin de actualización - 01/01/2026 12:45 //////////

    return (
        <div id="psd-blueprint-container" className="space-y-12">
            <div id="psd-blueprint-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                    <Zap className="w-5 h-5 fill-current" /> ¿Cómo será mi estrategia?
                </div>
                <h3 id="psd-blueprint-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    ¿Cómo funcionará tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">estrategia de ventas?</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                    <p className="border-l-4 border-emerald-500/30 pl-8 py-2">
                        No vendemos al azar ni dependemos de la suerte. Tu sistema está diseñado para acompañar al cliente paso a paso, desde que descubre el problema hasta que toma la decisión de compra con confianza.
                    </p>
                    <p className="border-l-4 border-teal-500/30 pl-8 py-2">
                        A continuación, puedes ver el recorrido completo que seguirá cada persona interesada en tu producto. Todas estas piezas son creadas automáticamente por el sistema.
                    </p>
                </div>
            </div>
            
            {/* ////////// Actualización: Expansión a ancho completo (Breakout) - 25/05/2025 22:50 ////////// */}
            <div id="psd-blueprint-grid-wrapper" className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] border-y border-gray-800 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] bg-[#050505]">
                {/* Enhanced Animated Grid Background */}
                <div className="absolute inset-0 z-0">
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent"></div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20 relative z-10">
                    <h4 className="text-center text-white font-black text-2xl uppercase tracking-[0.2em] mb-24 opacity-80">
                        El recorrido completo de tu cliente (de principio a fin)
                    </h4>
                    
                    <div id="psd-blueprint-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-[12rem]">
                        {ACQUISITION_STEPS.map((step, index) => (
                            <FlowCard 
                                key={index} 
                                icon={step.icon} 
                                title={step.title.split('. ')[1] || step.title} 
                                subtitle={step.subtitle} 
                                description={step.description}
                                step={index + 1}
                                ////////// Actualización: Inyección de datos para modal educativo - 01/01/2026 12:45 //////////
                                onOpenMasterclass={setSelectedMasterclass}
                                stepData={step}
                                ////////// Fin de actualización - 01/01/2026 12:45 //////////
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
            {/* ////////// Fin de actualización - 25/05/2025 22:50 ////////// */}

            {/* ////////// Actualización: Renderizado condicional del Modal de Detalles Educativos - 01/01/2026 12:45 ////////// */}
            {selectedMasterclass && (
                <TacticalModal 
                    step={selectedMasterclass} 
                    onClose={() => setSelectedMasterclass(null)} 
                />
            )}
            {/* ////////// Fin de actualización - 01/01/2026 12:45 ////////// */}
        </div>
    );
};