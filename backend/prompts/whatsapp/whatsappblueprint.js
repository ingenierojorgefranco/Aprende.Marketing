/**
 * Configuración global para la generación de mensajes de WhatsApp.
 * Define el tono, estilo y restricciones que deben aplicarse a toda la secuencia.
 */
export const GLOBAL_CONFIG = {
    tone: "Cercano, entusiasta y persuasivo. Uso estratégico de emojis para generar cercanía y resaltar puntos clave.",
    formatting: "Párrafos cortos para lectura rápida en móviles. Uso de *negritas* para resaltar conceptos importantes. Estructura visual limpia con espacios en blanco.",
    avoid: "Bloques de texto densos, lenguaje corporativo frío, sonar como un bot de spam."
};

/**
 * Blueprints estratégicos para la generación de mensajes de WhatsApp persuasivos.
 * Cada momento tiene su propio objetivo psicológico, estructura y reglas de copywriting.
 */
export const WHATSAPP_BLUEPRINTS = {
    'Bienvenida y Valor': {
        goal: "Confirmar que el usuario está en el lugar correcto, dar las gracias y fijar la fecha/hora del evento en su calendario mental.",
        structure: "1. Saludo entusiasta\n2. Confirmación de ingreso al grupo\n3. Entrega de valor inmediato (si aplica)\n4. Recordatorio de FECHA y HORA del evento\n5. Llamado a la acción (agendar la fecha)",
        copywritingTips: "Usa un tono de bienvenida cálido. Haz que el usuario se sienta parte de algo exclusivo.",
        example: `¡Hola! 👋 Qué alegría tenerte por aquí.

Acabas de dar el primer paso para [Resultado deseado]. 🚀

Este grupo es el lugar donde compartiré toda la información exclusiva para nuestro evento:

📌 *[Nombre del Evento]*
📅 Fecha: [FECHA_CLASE]
⏰ Hora: [HORA_EVENTO]

Mi consejo: *Agéndalo ahora mismo.* No querrás perderte lo que tengo preparado para ti.

¡Nos vemos pronto!`
    },
    'Autoridad y Conexión': {
        goal: "Humanizar al experto, generar conexión emocional y autoridad a través del storytelling.",
        structure: "1. Gancho emocional\n2. Breve historia de superación o desafío\n3. El 'momento de quiebre'\n4. Cómo el método cambió todo\n5. Transición al evento",
        copywritingTips: "Sé vulnerable pero mantén la autoridad. Enfócate en la transformación.",
        example: `Hace unos años, yo estaba exactamente donde tú estás ahora... 😔

[Breve historia de dolor/desafío].

Sentía que nada funcionaba, hasta que descubrí [El Método/Secreto]. 💡

Ese cambio no solo mejoró mis resultados, sino que cambió mi vida por completo.

Y eso es exactamente lo que te voy a mostrar el próximo [FECHA_CLASE].

No es magia, es un sistema. Y tú también puedes aprenderlo.

¡Seguimos con todo! 🔥`
    },
    'Curiosidad y Deseo': {
        goal: "Generar intriga sobre lo que se enseñará en el evento y elevar el valor percibido.",
        structure: "1. Pregunta provocadora o dato curioso\n2. Revelación parcial de lo que viene\n3. Promesa de un 'secreto' o técnica específica\n4. Recordatorio de la cita",
        copywritingTips: "Usa el misterio para mantener el interés. No reveles todo, deja que quieran más.",
        example: `¿Sabías que el [X]% de las personas fallan en [Nicho] por una sola razón? 😱

Y no es lo que piensas...

En la clase del [FECHA_CLASE], voy a revelarte el *[Nombre de la Técnica/Secreto]*.

Es lo que me permitió pasar de [Estado A] a [Estado B] en tiempo récord. ⏳

¿Estás lista para descubrirlo?

Faltan solo unos días. ¡Prepárate! 🚀`
    },
    'Conciencia del Problema': {
        goal: "Identificar los errores comunes del avatar y posicionar el evento como la solución necesaria.",
        structure: "1. Identificación de un error común\n2. Explicación de por qué ese error duele\n3. Agitación del problema\n4. El evento como la solución definitiva",
        copywritingTips: "Sé directo pero empático. Haz que el usuario se identifique con el error.",
        example: `Veo a muchas personas cometiendo este error fatal en [Nicho]:

❌ [Error común 1]
❌ [Error común 2]

Si sigues haciendo esto, solo vas a conseguir [Resultado negativo]. 😔

Lo sé porque yo también estuve ahí.

Por eso, en nuestro evento vamos a 'limpiar la pizarra' y enseñarte el camino correcto.

No dejes que estos errores te sigan frenando. Nos vemos el [FECHA_CLASE]. 📅`
    },
    'Recordatorio y Logística': {
        goal: "Asegurar que el evento sea la prioridad del día y confirmar detalles de acceso.",
        structure: "1. ¡Llegó el día!\n2. Confirmación de horarios por países\n3. Instrucciones básicas de acceso\n4. Llamado a la acción (poner alarma)",
        copywritingTips: "Genera urgencia y entusiasmo. Usa listas para los horarios.",
        example: `¡LLEGÓ EL DÍA! 🎉 Hoy es el gran momento.

Estamos a solo unas horas de empezar nuestro evento: *[Nombre del Evento]* 🚀

Revisa tu horario local:
🇲🇽 07:00 PM
🇨🇴 08:00 PM
🇦🇷 10:00 PM
🇪🇸 02:00 AM (Mañana)

📌 El link de acceso lo enviaré por aquí 15 minutos antes de empezar.

¡Pon tu alarma ya! No quiero que te quedes fuera. 🔥`
    },
    'Preparación y Compromiso': {
        goal: "Elevar el nivel de compromiso minutos antes de empezar y preparar el entorno de aprendizaje.",
        structure: "1. Cuenta regresiva (ej: Faltan 2 horas)\n2. Instrucciones de preparación (libreta, café, sin distracciones)\n3. Recordatorio del valor de estar en vivo",
        copywritingTips: "Crea un ritual. Haz que el evento se sienta como una cita importante.",
        example: `⏳ *FALTAN SOLO 2 HORAS* ⏳

¿Ya tienes todo listo?

Para aprovechar al máximo la clase de hoy, te recomiendo:
✅ Tener libreta y pluma a la mano (vas a querer anotar todo).
✅ Buscar un lugar tranquilo y sin distracciones.
✅ Preparar tu bebida favorita. ☕

Estar en vivo tiene un valor especial... voy a revelar algo que no quedará grabado. 😉

¡Nos vemos en un ratito! 🚀`
    },
    'Acceso al Evento': {
        goal: "Proporcionar el enlace directo y generar una entrada masiva inmediata.",
        structure: "1. ¡ESTAMOS EN VIVO!\n2. Enlace de acceso destacado\n3. Invitación a entrar YA",
        copywritingTips: "Usa emojis de alerta. Sé muy directo. El enlace debe ser lo más visible.",
        example: `🔴 *¡ESTAMOS EN VIVO!* 🔴

Acabamos de abrir la sala. ¡Entra ahora mismo antes de que se llene!

👉 [LINK]

Corre, que ya estamos empezando con la primera gran revelación. 🚀

¡Te veo dentro!`
    },
    'Presentación de Oferta': {
        goal: "Presentar la oferta post-clase con claridad, beneficios y enlace de compra.",
        structure: "1. Resumen de la clase\n2. Apertura oficial de inscripciones\n3. Beneficios principales del programa\n4. Enlace de inscripción",
        copywritingTips: "Enfócate en la transformación. Usa una lista de beneficios clara.",
        example: `¡Qué clase la de hoy! 🤯 Gracias a todos los que estuvieron presentes.

Como prometí, *LAS INSCRIPCIONES YA ESTÁN ABIERTAS* para [Nombre del Programa]. 🎉

Si estás lista para [Resultado principal], esto es para ti:

✅ [Beneficio 1]
✅ [Beneficio 2]
✅ [Beneficio 3]

👉 Inscríbete aquí con el precio especial: [LINK]

¡Bienvenida a la familia! 💖`
    },
    'Bonos y Objeciones': {
        goal: "Derribar barreras mentales y técnicas introduciendo bonos de acción rápida.",
        structure: "1. Recordatorio de la apertura\n2. Introducción de bonos exclusivos por tiempo limitado\n3. Resolución de una duda común\n4. Enlace de compra",
        copywritingTips: "Usa la escasez de los bonos para acelerar la decisión.",
        example: `¡La respuesta ha sido increíble! 😱 Muchas ya están dentro.

Pero ojo... los *Bonos de Acción Rápida* están volando. ⏳

Si te inscribes en las próximas 2 horas, te llevas:
🎁 [Bono Especial 1]
🎁 [Bono Especial 2]

¿Tienes dudas sobre el pago o el acceso? Respóndeme a este mensaje y te ayudo personalmente. 🤝

👉 No pierdas tus bonos: [LINK]`
    },
    'Prueba Social y Validación': {
        goal: "Generar confianza a través de resultados de otros y activar el deseo de pertenencia.",
        structure: "1. Historias cortas de éxito o capturas\n2. El sentimiento de comunidad\n3. 'Si ellas pudieron, tú también'\n4. Enlace de inscripción",
        copywritingTips: "Sé muy humano. Muestra resultados reales y variados.",
        example: `Mira lo que está pasando dentro de la comunidad... 😍

"[Testimonio corto de alumna]".

Historias como la de [Nombre Alumna] son las que me motivan a seguir. Ella empezó sin saber nada y hoy ya [Logro].

Tú también puedes ser nuestra próxima historia de éxito. 🌟

El camino ya está trazado, solo falta que tú lo camines.

👉 Únete aquí: [LINK]`
    },
    'Garantía y Seguridad': {
        goal: "Eliminar el riesgo financiero de la mente del comprador enfatizando la garantía.",
        structure: "1. Reconocimiento del miedo a invertir\n2. Explicación de la garantía de satisfacción\n3. El riesgo es mío, no tuyo\n4. Enlace de inscripción",
        copywritingTips: "Transmite seguridad total. Haz que la decisión parezca obvia y segura.",
        example: `Sé que invertir en una misma a veces da un poco de miedo... ¿y si no es para mí? 🤔

Por eso quiero que estés 100% tranquila.

Tienes mi *Garantía de Satisfacción de [X] días*. 🛡️

Entra, mira las clases, aplica el método... y si sientes que no es lo que buscabas, te devuelvo cada centavo. Sin preguntas.

El riesgo está de mi lado. Tú solo tienes que ganar.

👉 Inscríbete con total seguridad: [LINK]`
    },
    'Urgencia y Cierre': {
        goal: "Activar la urgencia real por cierre de inscripciones y forzar la decisión final.",
        structure: "1. ¡ÚLTIMAS HORAS!\n2. Qué se pierde el usuario si no entra hoy\n3. Despedida y cierre definitivo\n4. Enlace final",
        copywritingTips: "Usa un tono de 'última oportunidad'. Sé firme pero amable.",
        example: `⚠️ *ÚLTIMA LLAMADA* ⚠️

En solo unas horas cerramos las inscripciones para [Nombre del Programa].

A partir de mañana:
❌ El precio subirá.
❌ Los bonos desaparecerán.
❌ El acceso se cerrará.

No dejes que el miedo o la procrastinación te roben esta oportunidad de [Resultado deseado].

Es ahora o nunca. ⏳

👉 Acceso final aquí: [LINK]

¡Te espero dentro!`
    }
};
