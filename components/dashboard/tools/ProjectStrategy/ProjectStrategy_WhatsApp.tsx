import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Sparkles, Check, MessageSquare, Brain, PlayCircle, Rocket, Calendar, Copy, ChevronRight, X, Image as ImageIcon, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatSimulator: React.FC<{ messages: any[] }> = ({ messages }) => {
    const renderWhatsAppText = (text: string) => {
        if (!text) return null;
        // Divide el texto por fragmentos encerrados en asteriscos: *texto*
        const parts = text.split(/(\*[^\*]+\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                return <span key={i} className="font-bold">{part.slice(1, -1)}</span>;
            }
            return part;
        });
    };

    return (
        <div id="psd-chat-simulator-container" className="bg-[#0b141a] rounded-xl overflow-hidden border border-gray-800 flex flex-col h-auto font-sans text-sm shadow-xl transition-all duration-500 ease-in-out">
            <div id="psd-chat-header" className="bg-[#202c33] p-3 flex items-center gap-3 border-b border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
                    A
                </div>
                <div>
                    <p className="text-white font-bold text-lg">Ariana Zamora</p>
                    <p className="text-sm text-gray-400">en línea</p>
                </div>
            </div>
            <div id="psd-chat-body" className="p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 bg-repeat">
                {messages.map((msg, i) => (
                    <div key={i} id={`psd-chat-message-${i}`} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 fade-in duration-300`} style={{animationDelay: `${i * 150}ms`}}>
                        <div className={`max-w-[85%] p-2.5 rounded-lg shadow-sm text-lg whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#202c33] text-white rounded-tl-none' : 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'}`}>
                            {msg.type === 'link' ? (
                                <span className="text-blue-300 underline cursor-pointer hover:text-blue-200">{msg.text}</span>
                            ) : msg.type === 'image' ? (
                                <div className="flex flex-col gap-1">
                                    <div className="h-24 w-40 bg-gray-700 rounded animate-pulse flex items-center justify-center text-gray-500 text-[10px]">IMAGEN</div>
                                    <span>{msg.text}</span>
                                </div>
                            ) : (
                                renderWhatsAppText(msg.text)
                            )}
                            <span className="block text-[9px] text-right opacity-60 mt-1">10:0{i} AM</span>
                        </div>
                    </div>
                ))}
            </div>
            <div id="psd-chat-footer" className="p-3 bg-[#202c33] border-t border-gray-700 flex gap-2">
                <div className="flex-1 bg-[#2a3942] rounded-lg h-8"></div>
                <div className="w-8 h-8 bg-[#00a884] rounded-full"></div>
            </div>
        </div>
    );
};

interface ProjectStrategy_WhatsAppProps {
    whatsappLaunch?: any[];
    activeWaScript: number;
    setActiveWaScript: (idx: number) => void;
    onUpgrade: () => void;
}

export const ProjectStrategy_WhatsApp: React.FC<ProjectStrategy_WhatsAppProps> = ({
    whatsappLaunch = [], activeWaScript, setActiveWaScript, onUpgrade
}) => {
    const [launchDate, setLaunchDate] = useState<string>('');
    const [sentMessages, setSentMessages] = useState<Set<number>>(new Set());
    const [imageUrls, setImageUrls] = useState<Record<number, string>>({
        0: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80'
    });
    const dateInputRef = useRef<HTMLInputElement>(null);

    const detailedObjectives: Record<number, string> = {
        0: "Confirmación de Fecha: Romper el hielo con el lead, confirmar la fecha del evento y asegurar que lo agenden en su calendario para maximizar la asistencia.",
        1: "Historia de Autoridad: Conectar emocionalmente mediante el storytelling, mostrando el camino del experto para generar confianza y deseo por el método.",
        2: "Temario y Promesa: Elevar el valor percibido detallando los puntos exactos que se aprenderán, creando anticipación sobre la transformación que viene.",
        3: "Adelanto (3 Errores): Aportar valor real antes de la clase identificando errores comunes, posicionando la clase como la solución para evitarlos.",
        4: "Recordatorio Matutino: Generar urgencia y entusiasmo desde temprano, asegurando que el lead sepa que 'hoy es el día' y prepare su entorno.",
        5: "Cuenta Regresiva Final: Incrementar la dopamina y la urgencia faltando pocas horas, dando instrucciones finales para la conexión.",
        6: "Acceso al En Vivo: Facilitar la entrada inmediata a la transmisión, eliminando cualquier fricción técnica con un link directo y claro.",
        7: "Apertura de Inscripciones: Presentar la oferta irresistible con el descuento máximo (Beca) para capturar a los 'early birds' y compradores impulsivos.",
        8: "Bonos de Acción Rápida: Presionar éticamente mediante la pérdida inminente de regalos exclusivos, forzando una decisión de compra rápida.",
        9: "Tutorial de Pago: Eliminar barreras técnicas de compra mostrando lo sencillo que es el proceso de checkout en Hotmart.",
        10: "Seguridad y Aval: Neutralizar el miedo al riesgo financiero resaltando la garantía de satisfacción y la certificación profesional.",
        11: "Últimos Cupos: Notificar la escasez real de plazas para movilizar a los indecisos que necesitan un último empujón antes del cierre.",
        12: "Cierre de Carrito: Mantener la integridad de la oferta informando que las inscripciones terminaron, generando deseo para la próxima edición.",
        13: "Onboarding: Dar la bienvenida oficial a los nuevos alumnos, reduciendo el remordimiento de compra y guiándolos al primer paso del curso."
    };

    const arianaMessages: Record<number, string> = {
        1: `*📣 Hola, un placer presentarme con ustedes 🙋‍♀️✨*
Mi nombre es _*Ariana Zamora*_ , micropigmentadora, cosmetóloga y especialista en cejas. 
* Llevo más de 10 años trabajando en la estética. Un camino que empezó con muchas dudas, miedos y sacrificios… pero también con un sueño: vivir de lo que amo y tener la libertad de crear mi propio futuro.
* Todo lo que logré fue gracias al microblading, y ahora quiero compartir contigo lo que aprendí en el camino. 💕
Este viernes *26 de Septiembre de 2025* te voy a entregar mucho más que teoría:
✨ Te enseñaré nuevas técnicas que te abrirán los ojos sobre lo que realmente es el microblading.
✨ Te contaré los secretos y tips que descubrí con la experiencia (los mismos que me ayudaron a crecer).
Quiero que sepas que voy a darlo todo para guiarte, porque mi objetivo es que tú también descubras el potencial que tienes en este mundo.
Estoy feliz de acompañarte y quiero que seas la próxima historia de éxito.`,
        2: `*El microblading de cejas no es solo una técnica de belleza… es una habilidad capaz de transformar vidas.*
✨ Imagina poder ayudar a una persona a mirarse al espejo y recuperar la seguridad en sí misma. 💕
✨ Imagina que además de eso, sea tu camino para generar ingresos, libertad y reconocimiento.
✨ Este viernes tendrás la oportunidad de descubrir cómo empezar desde cero. Y créeme, no puedes perderte esta clase por nada.
*👉 Esto es lo que te espera en la clase en vivo:*
✅ Aprenderás el primer paso real para iniciar in el microblading, aunque nunca hayas tocado una ceja.
✅ Descubrirás los diferentes pigmentos y materiales profesionales que se usan, entendiendo para qué sirve cada uno y cómo elegirlos correctamente.
✅ Tendrás acceso a una sesión práctica en vivo, donde te mostraremos el proceso paso a paso para que veas cómo funciona en la realidad.
✅ Conocerás errores comunes que detienen a muchas… y cómo evitarlos desde el inicio.
✅ Entenderás por qué esta técnica puede convertirse en un negocio rentable y estable, incluso si empiezas sin experiencia.
✅ Te llevarás claridad y motivación para decidir si el microblading puede ser tu futuro.
*🌟 Este viernes a las 8:00 p.m. (hora Colombia/México – 10:00 p.m. Argentina/Chile).*
💖 Aparta tu lugar desde ya, porque lo que verás puede ser el inicio de un cambio real en tu vida.`,
        3: `*📣 Hola chicas, ya estamos a un solo día de nuestra clase gratuita de microblading 🙋‍♀️✨*
Antes de vernos mañana, quiero regalarles un pequeño adelanto de lo que vamos a trabajar juntas. 💖
Hoy les voy a contar los _3 errores más comunes que cometen las personas_ cuando empiezan en microblading (y cómo tú los puedes evitar):
❌ Pensar que solo se necesita buen pulso y práctica.
❌ Usar cualquier pigmento o material sin entender su calidad ni compatibilidad.
❌ Creer que con videos sueltos de internet se puede aprender toda la técnica.
Mañana te voy a mostrar cómo evitar cada uno de estos errores y, además, te enseñaré en vivo el proceso completo, los pigmentos y materiales profesionales que usamos, y te compartiré tips que aprendí en mis más de 10 años de experiencia.
• Estoy preparando algo muy especial para ti, así que no te lo puedes perder por nada. 🌟
• Nos vemos mañana viernes a las 8:00 p.m. (hora Colombia/México) – 10:00 p.m. (hora Argentina/Chile).
• Te espero con toda mi energía y ganas de compartir lo mejor que tengo contigo.
💖 Ariana Zamora ✨`,
        4: `*📣🎺 HOY CLASE DE MICROBLADING DE CEJAS 🎺📣*
¡GRANDIOSA comunidad! ✨ _Llegó el día que estábamos esperando_ 🙌.
HOY iniciamos nuestra capacitación completa para convertirte en una *especialista de Microblading de Cejas* . 💖
*❗ ¡PRESTAME ATENCIÓN! ❗*
✅ Durante el día voy a estar enviando recordatorios para que no se te olvide la hora.
🕗 La clase es hoy a las 8:00 p.m. (hora Colombia/México) – 10:00 p.m. (hora Argentina/Chile).
✅ 5 minutos antes de iniciar la clase te compartiré aquí mismo el enlace de acceso a la clase
*Estoy muy emocionada y feliz de compartir este momento contigo ✨.*
Prepárate porque lo que vas a vivir hoy puede ser el inicio de una gran transformación en tu vida. 🌟
— Ariana Zamora 💕`,
        5: `*⏳ Faltan 4 horas ⏳*
• 🔔 Recuerda tener todo preparado para la clase de hoy.
• 🕒 Separa 1 hora para ver nuestra clase en vivo de Microblading de Cejas.
• 🪑 Destina un lugar cómodo donde te puedas concentrar.
• 💻 Ten preparado el computador, televisor o móvil para ver la clase.
• 📝 Ten a la mano dónde tomar notas y aleja todo tipo de distracciones.
Estoy muy emocionada porque en pocas horas empezaremos juntas esta experiencia única.
*Prepárate, porque lo que aprenderás hoy puede ser el inicio de un cambio en tu vida. 💕*
— Ariana Zamora 🌟`,
        6: `*🌙 Buenas noches, Futura Especialista en Microblading de Cejas 🌙*
💖 ¡Preparados y listos! Estamos a solo…
⏰ 1 hora de comenzar nuestra primera capacitación de Especialista en Microblading de Cejas 2.0 ✨
• Atentas ✋ porque 5 minutos antes estaré enviando por aquí mismo el enlace de la clase para que puedan conectarse en vivo. 🎥
*Estoy muy feliz de compartir este momento contigo, ¡nos vemos en nada! 🙌💎*
— Ariana Zamora 🌟`,
        7: `*🚀 Iniciamos en 20 minutos 🚀*
• La clase será transmitida a través de YouTube 🎥.
• En unos minutos les compartiré aquí mismo el enlace de acceso.
*Recuerda:*
👉 Estar muy bien enfocada y centrada.
👉 Alejar todas tus distracciones.
*Porque en solo 20 minutos empezamos juntas esta gran experiencia. 🌟*
¿Listas? 🙌💖`,
        8: `*🔴🔴 YA ESTAMOS EN VIVO 🔴🔴*
• 🎥 Haremos la transmisión vía YouTube.
*LINK DE ACCESO:*
👉 https://hotm.art/microblading-clase-online
*⚡ YA PUEDEN IR INGRESANDO A LA CLASE HACIENDO CLIC EN EL ENLACE ⚡*`,
        9: `*✨ ¡Gracias hermosas por estar en la clase de hoy! 🙋‍♀️💕*
De corazón espero que hayas disfrutado, aprendido y descubierto lo maravilloso que puede ser el mundo del microblading.
📹 Quiero contarte que la grabación de la clase la vamos a compartir en este mismo grupo, para que puedas repasarla las veces que quieras.
*Y ahora quiero darte una noticia especial:*
👉 Las inscripciones al curso completo de Especialista en Microblading de Cejas 2.0 ya están abiertas.
Su valor normal es de *200 Dólares* , pero por lanzamiento exclusivo para quienes participaron hoy, *queda en solo 47 Dólares* . 🎉
_*En este curso vas a tener acceso a:*_
• 💎 Las técnicas paso a paso explicadas en detalle.
• 🎥 Clases grabadas + prácticas para que avances a tu ritmo.
• 🎁 Bonos exclusivos (guía de pigmentos, plantillas de práctica y acceso a comunidad privada).
Esta es tu oportunidad de dar el siguiente paso y empezar a transformar tu futuro con una habilidad rentable y apasionante.
*Aquí puedes ver todos los detalles del programa con el descuento del 75%*
👉 https://hotm.art/microblading-web-beca
De nuevo, gracias por confiar en mí.
Estoy muy feliz de acompañarte en este camino. 💖
— Ariana Zamora ✨`,
        10: `*🎁✨ BONOS ESPECIALES DE LANZAMIENTO ✨🎁*
_¡Atención comunidad! 🚨_
Las primeras 50 personas que se inscriban hoy en el curso completo de Microblading de Cejas 2.0 recibirán de regalo un pack increíble de BONOS exclusivos:
• 🎁 BONO 1: Cuadernillo de ejercicios “Nueva Guía Práctica del Microblading” (diseños, trazos y práctica profesional).
• 🎁 BONO 2: Checklist completo de materiales para empezar sin excusas.
• 🎁 BONO 3: Entrenamiento en diseño y construcción de cejas según morfología.
• 🎁 BONO 4: Acceso al canal privado “Artistas en Cejas” para preguntas y soporte.
• 🎁 BONO 5: Documentación indispensable lista para usar con clientas.
• 🎁 BONO 6: Agenda + 20 diseños listos para organizar tu negocio.
• 🎁 BONO 7: Entrenamiento “Comenzando mi propio emprendimiento”.
• 🎁 BONO 8: Pack de 5 libros de belleza en PDF para potenciar tus conocimientos.
*Todo esto es tuyo GRATIS si aseguras tu cupo hoy al precio especial de 47 USD (antes 200 USD).*
*Inscríbete aquí y reclama tus bonos ahora mismo:*
👉 https://hotm.art/microblading-web-beca
_Recuerda: solo aplica para las primeras 50 inscripciones._
¡No te quedes fuera!`,
        11: `*✅ Había olvidado decirte: GARANTÍA TOTAL ✅*
Queremos que te sientas tranquila al dar este paso 🙌.
*_Por eso, el curso Especialista en Microblading de Cejas 2.0 tiene una garantía de 7 días._*
• Esto significa que puedes ingresar, probar el contenido, ver las clases y comenzar tu proceso.
• Si en esos 7 días consideras que el curso no cumple con tus expectativas, se te devuelve el 100% de tu dinero. 💵
*✨ Aunque estamos seguros de que eso no pasará…*
• Porque este es el mejor curso de microblading online, probado y diseñado para que realmente logres resultados.
• Hoy tienes la oportunidad de empezar con total seguridad y sin riesgos. 🌟
*Aquí tienes el link directo para inscribirte al programa:*
*👉 https://hotm.art/microblading-beca-70*`,
        12: `*🚨 INSCRIPCIONES CERRADAS 🚨*
*El precio especial de lanzamiento (200 USD → 47 USD) ya ha finalizado. ❌*
• Oficialmente, esta oportunidad no está disponible más…
• Sabemos que muchas personas querían entrar, pero el tiempo y los cupos se agotaron.
• Si no alcanzaste, puedes escribirme por interno y veremos si es posible habilitarte un cupo extra con el descuento.
⚠ ️ Eso sí, no puedo garantizar porque los cupos estaban limitados.
Hoy cerramos esta etapa con un grupo maravilloso de nuevas futuras especialistas en microblading que ya están dentro.
*Si te quedaste por fuera, recuerda: las oportunidades no esperan. 💎*`,
        13: `*🎉 ¡FELICIDADES NUEVAS ESPECIALISTAS! 🎉*
Queremos felicitar a todas las personas que aprovecharon la oportunidad y ya se inscribieron en el curso Especialista en Microblading de Cejas 2.0. 💖
• Hoy damos inicio a una nueva comunidad de mujeres valientes que decidieron apostar por ellas mismas, aprender una profesión con futuro y transformar su vida con el microblading. 🌟
• 🥂 Bienvenidas a este camino, ¡ya son parte de nuestra familia de especialistas!
• Gracias a todas las que participaron en la clase, estuvieron atentas y llenaron este grupo de energía positiva. 🙌
*👉 Y si te quedaste por fuera, no te preocupes…*
• Estate atenta a nuestras próximas oportunidades, porque lo mejor apenas está comenzando. 😉`
    };

    const formatLongDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T12:00:00'); 
        const formatter = new Intl.DateTimeFormat('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        const formatted = formatter.format(date);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

    const getCalculatedDate = (baseDateStr: string, index: number) => {
        if (!baseDateStr) return '';
        const baseDate = new Date(baseDateStr + 'T12:00:00');
        const offsets = [0, 2, 4, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
        const offset = offsets[index] !== undefined ? offsets[index] : 7;
        const calculatedDate = new Date(baseDate);
        calculatedDate.setDate(baseDate.getDate() + offset);
        return formatLongDate(calculatedDate.toISOString().split('T')[0]);
    };

    const getTimeForMessage = (index: number) => {
        if (index === 4) return '10:00 AM';
        if (index === 5 || index === 6) return '04:00 PM';
        return '';
    };

    const getCustomMessage1Text = (baseDateStr: string) => {
        const classDate = getCalculatedDate(baseDateStr, 4);
        return `*📣 ¡Hola querida comunidad! 🙋‍♀️✨*

¡Ya tenemos la fecha confirmada! 🎉
Nuestra clase gratuita será el próximo:

*${classDate || '[Selecciona una fecha]'}*
*8:00 p.m. (hora Colombia / México)*

Y déjame decirte algo importante: esta no será una clase cualquiera.

Será un encuentro donde descubrirás cómo el microblading puede convertirse en mucho más que una técnica de belleza:

✨ Una habilidad que te dará seguridad y confianza.
✨ Una profesión con la que podrás generar ingresos.

Prepárate, porque lo que vas a descubrir puede ser el inicio de un camino nuevo para ti

Un futuro donde tú decidas, donde trabajes en lo que amas y donde ayudes a otras personas a sentirse más bellas y seguras. 🌟

*💖 Nos vemos in la clase, y créeme… no querrás faltar.*`;
    };

    const currentData = whatsappLaunch;
    const rawActiveItem = currentData[activeWaScript] || currentData[0];

    const activeItem = activeWaScript === 0 ? {
        ...rawActiveItem,
        messages: [{
            role: 'agent',
            text: getCustomMessage1Text(launchDate)
        }]
    } : (arianaMessages[activeWaScript] ? {
        ...rawActiveItem,
        messages: [{
            role: 'agent',
            text: arianaMessages[activeWaScript]
        }]
    } : rawActiveItem);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Mensaje copiado para WhatsApp");
    };

    const handleImageUrlChange = (val: string) => {
        setImageUrls(prev => ({ ...prev, [activeWaScript]: val }));
    };

    const toggleSent = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        const newSent = new Set(sentMessages);
        if (newSent.has(idx)) newSent.delete(idx);
        else newSent.add(idx);
        setSentMessages(newSent);
    };

    const getMessageDisplayName = (idx: number, originalName: string) => {
        if (idx === 5) return "Cuenta Regresiva";
        if (idx === 7) return "Oferta Abierta";
        if (idx === 11) return "Últimos Cupos";
        if (idx === 13) return "Cierre de Lanzamiento";
        return originalName;
    };

    const handleContainerClick = () => {
        if (dateInputRef.current) {
            try {
                dateInputRef.current.showPicker();
            } catch (e) {
                dateInputRef.current.focus();
                dateInputRef.current.click();
            }
        }
    };

    return (
        <div id="psd-whatsapp-section" className="pt-8">
            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    transform: scale(2.2);
                    filter: invert(1);
                    margin-left: 10px;
                }
                input[type="date"] {
                    font-size: 1.5rem;
                    padding: 1rem;
                }
            `}</style>
            <div id="psd-whatsapp-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-green-500/5">
                    <MessageCircle className="w-5 h-5" /> Resumen estratégico de tu Proyecto
                </div>
                <h3 id="psd-whatsapp-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Secuencia de Lanzamiento <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"><b>Lanzamiento vía WhatsApp</b></span>
                </h3>
                <div className="grid md:grid-cols-2 gap-10 text-white text-xl leading-relaxed font-light">
                    <p className="border-l-4 border-green-500 pl-8 py-2">
                        Esta secuencia está diseñada para generar un pico de ventas masivo en tu grupo de WhatsApp, guiando a los prospectos desde la expectativa hasta la apertura de inscripciones.
                    </p>
                    <p className="border-l-4 border-emerald-500 pl-8 py-2">
                        Utiliza cada mensaje en el momento indicado para activar los gatillos mentales de comunidad, anticipación y escasez en tu audiencia.
                    </p>
                </div>
            </div>

            <div id="psd-whatsapp-video-block" className="max-w-[70em] mx-auto px-4 md:px-0 mb-12">
                <div className="bg-gray-900/40 p-4 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-indigo-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30"></div>
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-inner bg-black relative">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" 
                            title="Estrategia de Cierre por WhatsApp" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity group-hover:opacity-0">
                            <PlayCircle className="w-5 h-5 text-indigo-400" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Video Explicativo de Cierre</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selector Global de Fecha */}
            <div className="max-w-[70em] mx-auto px-4 md:px-0 mb-12">
                <div 
                    className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-in slide-in-from-top-2 duration-500 cursor-pointer hover:bg-white/10 transition-all"
                    onClick={handleContainerClick}
                >
                    <label className="block text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-3 cursor-pointer">
                        <Calendar className="w-8 h-8" /> Define la Fecha de Inicio del Lanzamiento
                    </label>
                    <input 
                        ref={dateInputRef}
                        type="date" 
                        value={launchDate}
                        onChange={(e) => setLaunchDate(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition-all font-bold cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
            </div>

            <div id="psd-whatsapp-grid" className="grid lg:grid-cols-12 gap-8">
                <div id="psd-whatsapp-list-col" className="lg:col-span-4 bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-900/30 rounded-lg text-green-400 border border-green-900/50">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Lanzamiento vía WhatsApp</h3>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[1000px]">
                        {currentData.map((script: any, idx: number) => (
                            <div 
                                key={script.id} 
                                id={`psd-whatsapp-script-${idx}`}
                                onClick={() => setActiveWaScript(idx)}
                                className={`relative pl-6 pr-6 py-5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-4 ${sentMessages.has(idx) ? 'bg-green-900/10 border-green-500/30' : (activeWaScript === idx ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-gray-800 hover:bg-gray-800')}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${sentMessages.has(idx) ? 'bg-green-500 text-black' : (activeWaScript === idx ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400')}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-xl font-black uppercase tracking-widest block mb-1 ${sentMessages.has(idx) ? 'text-green-500' : 'text-blue-500'}`}>Mensaje {idx + 1}</span>
                                        <h4 className={`text-lg font-bold leading-tight truncate ${sentMessages.has(idx) ? 'text-green-200' : (activeWaScript === idx ? 'text-blue-200' : 'text-gray-300')}`}>{getMessageDisplayName(idx, script.name || script.title)}</h4>
                                        <div className="text-base text-gray-500 mt-0.5" style={{ fontSize: '1rem' }}>
                                            {launchDate ? (
                                                <>
                                                    <p>{getCalculatedDate(launchDate, idx)}</p>
                                                    {getTimeForMessage(idx) && <p className="font-bold text-gray-400">{getTimeForMessage(idx)}</p>}
                                                </>
                                            ) : ''}
                                        </div>
                                    </div>
                                </div>
                                
                                <div 
                                    onClick={(e) => toggleSent(e, idx)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${sentMessages.has(idx) ? 'border-green-500 bg-green-500' : 'border-gray-600 hover:border-gray-400'}`}
                                >
                                    {sentMessages.has(idx) && <Check className="w-4 h-4 text-black font-black" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div id="psd-whatsapp-simulator-col" className="lg:col-span-8 bg-black/40 border border-gray-800 rounded-2xl p-6 flex flex-col relative overflow-hidden h-full">
                    <div className="relative z-10 flex flex-col h-full gap-6">
                        {/* Cabecera de Identificación del Mensaje en el Simulador */}
                        <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-lg shadow-blue-500/20">
                                {activeWaScript + 1}
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 block mb-1">Mensaje {activeWaScript + 1}</span>
                                <h4 className="text-xl font-bold text-white leading-tight">{getMessageDisplayName(activeWaScript, rawActiveItem.name || rawActiveItem.title)}</h4>
                            </div>
                        </div>

                        <div className="bg-green-900/10 border border-green-500/20 p-6 rounded-xl space-y-6">
                            <div>
                                <h5 className="text-green-400 font-bold text-2xl uppercase tracking-wider mb-2 flex items-center gap-3">
                                    <Brain className="w-6 h-6" /> ¿Cuál es el objetivo del mensaje?
                                </h5>
                                <p className="text-gray-300 text-xl leading-relaxed">
                                    {detailedObjectives[activeWaScript] || activeItem?.objective}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> URL de Imagen Adjunta (Opcional)
                                </label>
                                <input 
                                    type="text" 
                                    value={imageUrls[activeWaScript] || ''}
                                    onChange={(e) => handleImageUrlChange(e.target.value)}
                                    placeholder="Pega la URL de la imagen que enviarás con este mensaje..."
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {imageUrls[activeWaScript] && (
                                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                                    <div className="relative aspect-video max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                        <img src={imageUrls[activeWaScript]} alt="Adjunto" className="w-full h-full object-cover" />
                                    </div>
                                    <button 
                                        onClick={() => window.open(imageUrls[activeWaScript], '_blank')}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10 transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Descargar Imagen Adjunta
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                                <ChatSimulator messages={activeItem?.messages || []} />
                            </div>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => handleCopy(activeItem?.messages[0]?.text || '')}
                                    className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black text-lg shadow-lg shadow-orange-900/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                                >
                                    <Copy className="w-5 h-5" /> Copiar para WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};