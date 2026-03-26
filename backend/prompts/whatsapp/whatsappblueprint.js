/**
 * Configuración global para la generación de mensajes de WhatsApp.
 * Define el tono, estilo y restricciones que deben aplicarse a toda la secuencia.
 */
export const GLOBAL_CONFIG = {
    tone: "Cercano, entusiasta y persuasivo. Uso estratégico de emojis para generar cercanía y resaltar puntos clave.",
    formatting: "Párrafos de máximo 2 líneas para lectura rápida en móviles. Uso de *negritas* para resaltar conceptos importantes. Estructura visual limpia con espacios en blanco.",
    avoid: "Bloques de texto densos, lenguaje corporativo frío, sonar como un bot de spam, incluir firmas genéricas o placeholders al final."
};

/**
 * Blueprints estratégicos para la generación de mensajes de WhatsApp persuasivos.
 * Cada momento tiene su propio objetivo psicológico, estructura y reglas de copywriting.
 */
export const WHATSAPP_BLUEPRINTS = {
    'Bienvenida y Valor': {
        goal: "Confirmar que el usuario está en el lugar correcto, dar las gracias y fijar la fecha/hora del evento en su calendario mental.",
        structure: "1. Saludo entusiasta\n2. Confirmación de ingreso al grupo\n3. Entrega de valor inmediato (si aplica)\n4. Recordatorio de FECHA y HORA del evento\n5. Llamado a la acción (agendar la fecha)",
        copywritingTips: "Usa un tono de bienvenida cálido. Sé extremadamente conciso. Haz que el usuario se sienta parte de algo exclusivo.",
        example: `¡Hola! 👋 Qué alegría tenerte por aquí.
Acabas de dar el primer paso para [Resultado deseado]. 🚀

📌 *[Nombre del Evento]*
📅 Fecha: [FECHA_CLASE]
⏰ Hora: [HORA_EVENTO]

*Agéndalo ahora mismo.* ¡Nos vemos pronto!`
    },
    'Autoridad y Conexión': {
        goal: "Humanizar al experto, generar conexión emocional y autoridad a través del storytelling.",
        structure: "1. Gancho emocional\n2. Breve historia de superación o desafío\n3. El 'momento de quiebre'\n4. Cómo el método cambió todo\n5. Transición al evento",
        copywritingTips: "Sé vulnerable pero mantén la autoridad. Sé extremadamente conciso. Enfócate en la transformación.",
        example: `Te confieso algo: hace unos años, yo estaba donde tú estás ahora... 😔
[Breve historia de dolor]. Mi quiebre fue [Momento de quiebre]. 💔

Ahí descubrí [El Método] que cambió todo. Tripliqué mis resultados en tiempo récord. 🚀

Hoy quiero enseñarte cómo lograrlo este **[FECHA_CLASE]** a las **[HORA_EVENTO]**. ¡Prepárate! 🔥`
    },
    'Curiosidad y Deseo': {
        goal: "Generar intriga sobre lo que se enseñará en el evento y elevar el valor percibido.",
        structure: "1. Pregunta provocadora o dato curioso\n2. Revelación parcial de lo que viene\n3. Promesa de un 'secreto' o técnica específica\n4. Recordatorio de la cita",
        copywritingTips: "Usa el misterio para mantener el interés. Sé extremadamente conciso. No reveles todo.",
        example: `¿Sabías que el [X]% falla en [Nicho] por una sola razón? 😱
Y no es lo que piensas...

En la clase del [FECHA_CLASE], revelaré el *[Nombre de la Técnica]*. 💡
Es lo que me permitió pasar de [Estado A] a [Estado B] en tiempo récord.

¿Lista para descubrirlo? ¡Faltan solo unos días! 🚀`
    },
    'Conciencia del Problema': {
        goal: "Identificar los errores comunes del avatar y posicionar el evento como la solución necesaria.",
        structure: "1. Identificación de un error común\n2. Explicación de por qué ese error duele\n3. Agitación del problema\n4. El evento como la solución definitiva",
        copywritingTips: "Sé directo pero empático. Sé extremadamente conciso. Haz que se identifiquen con el error.",
        example: `Veo a muchas cometiendo este error fatal en [Nicho]: ❌ [Error común].
Si sigues así, solo conseguirás [Resultado negativo]. 😔

Lo sé porque yo también estuve ahí. Por eso, en nuestro evento vamos a 'limpiar la pizarra'.

No dejes que esto te frene. Nos vemos el [FECHA_CLASE]. 📅`
    },
    'Recordatorio y Logística': {
        goal: "Asegurar que el evento sea la prioridad del día y confirmar detalles de acceso.",
        structure: "1. ¡Llegó el día!\n2. Confirmación de horarios por países\n3. Instrucciones básicas de acceso\n4. Llamado a la acción (poner alarma)",
        copywritingTips: "Genera urgencia y entusiasmo. Sé extremadamente conciso. Usa listas cortas.",
        example: `¡LLEGÓ EL DÍA! 🎉 Hoy es el gran momento.
Estamos a horas de empezar: *[Nombre del Evento]* 🚀

Revisa tu horario:
🇲🇽 07:00 PM | 🇨🇴 08:00 PM | 🇦🇷 10:00 PM

📌 Enviaré el link 15 minutos antes. ¡Pon tu alarma ya! 🔥`
    },
    'Preparación y Compromiso': {
        goal: "Elevar el nivel de compromiso minutos antes de empezar y preparar el entorno de aprendizaje.",
        structure: "1. Cuenta regresiva (ej: Faltan 2 horas)\n2. Instrucciones de preparación (libreta, café, sin distracciones)\n3. Recordatorio del valor de estar en vivo",
        copywritingTips: "Crea un ritual. Sé extremadamente conciso. Haz que se sienta importante.",
        example: `⏳ *FALTAN SOLO 2 HORAS* ⏳
¿Ya tienes todo listo?

✅ Libreta y pluma a la mano.
✅ Lugar tranquilo sin distracciones.
✅ Tu bebida favorita. ☕

¡Estar en vivo tiene premio! Nos vemos en un ratito. 🚀`
    },
    'Acceso al Evento': {
        goal: "Proporcionar el enlace directo y generar una entrada masiva inmediata.",
        structure: "1. ¡ESTAMOS EN VIVO!\n2. Enlace de acceso destacado\n3. Invitación a entrar YA",
        copywritingTips: "Usa emojis de alerta. Sé extremadamente conciso. El enlace debe ser lo más visible.",
        example: `🔴 *¡ESTAMOS EN VIVO!* 🔴
Acabamos de abrir la sala. ¡Entra antes de que se llene!

👉 [LINK]

Corre, ya empezamos con la primera gran revelación. 🚀 ¡Te veo dentro!`
    },
    'Presentación de Oferta': {
        goal: "Presentar la oferta post-clase con claridad, beneficios y enlace de compra.",
        structure: "1. Resumen de la clase\n2. Apertura oficial de inscripciones\n3. Beneficios principales del programa\n4. Enlace de inscripción",
        copywritingTips: "Enfócate en la transformación. Sé extremadamente conciso. Lista clara.",
        example: `¡Qué clase la de hoy! 🤯 Gracias por estar.
*INSCRIPCIONES ABIERTAS* para [Nombre del Programa]. 🎉

Si estás lista para [Resultado], esto es para ti:
✅ [Beneficio 1] | ✅ [Beneficio 2]

👉 Inscríbete aquí: [LINK]
¡Bienvenida a la familia! 💖`
    },
    'Bonos y Objeciones': {
        goal: "Derribar barreras mentales y técnicas introduciendo bonos de acción rápida.",
        structure: "1. Recordatorio de la apertura\n2. Introducción de bonos exclusivos por tiempo limitado\n3. Resolución de una duda común\n4. Enlace de compra",
        copywritingTips: "Usa la escasez. Sé extremadamente conciso. Acelera la decisión.",
        example: `¡Respuesta increíble! 😱 Muchas ya están dentro.
Pero ojo... los *Bonos de Acción Rápida* están volando. ⏳

Si entras en las próximas 2 horas, te llevas:
🎁 [Bono 1] | 🎁 [Bono 2]

👉 No pierdas tus bonos: [LINK]`
    },
    'Prueba Social y Validación': {
        goal: "Generar confianza a través de resultados de otros y activar el deseo de pertenencia.",
        structure: "1. Historias cortas de éxito o capturas\n2. El sentimiento de comunidad\n3. 'Si ellas pudieron, tú también'\n4. Enlace de inscripción",
        copywritingTips: "Sé muy humano. Sé extremadamente conciso. Muestra resultados reales.",
        example: `Mira lo que pasa dentro de la comunidad... 😍
"[Testimonio corto]".

Historias como la de [Nombre] me motivan. Ella empezó de cero y hoy ya [Logro]. 🌟
Tú también puedes ser nuestra próxima historia de éxito.

👉 Únete aquí: [LINK]`
    },
    'Garantía y Seguridad': {
        goal: "Eliminar el riesgo financiero de la mente del comprador enfatizando la garantía.",
        structure: "1. Reconocimiento del miedo a invertir\n2. Explicación de la garantía de satisfacción\n3. El riesgo es mío, no tuyo\n4. Enlace de inscripción",
        copywritingTips: "Transmite seguridad total. Sé extremadamente conciso. Decisión obvia.",
        example: `¿Miedo a invertir? 🤔 Es normal.
Por eso tienes mi *Garantía de [X] días*. 🛡️

Entra, aplica el método... y si no es para ti, te devuelvo todo. Sin preguntas.
El riesgo es mío. Tú solo ganas.

👉 Inscríbete con seguridad: [LINK]`
    },
    'Urgencia y Cierre': {
        goal: "Activar la urgencia real por cierre de inscripciones y forzar la decisión final.",
        structure: "1. ¡ÚLTIMAS HORAS!\n2. Qué se pierde el usuario si no entra hoy\n3. Despedida y cierre definitivo\n4. Enlace final",
        copywritingTips: "Usa tono de 'última oportunidad'. Sé extremadamente conciso. Firme pero amable.",
        example: `⚠️ *ÚLTIMA LLAMADA* ⚠️
En horas cerramos inscripciones para [Nombre del Programa].

A partir de mañana:
❌ Precio sube | ❌ Bonos desaparecen | ❌ Acceso cerrado

Es ahora o nunca. ⏳
👉 Acceso final: [LINK] ¡Te espero!`
    }
};
