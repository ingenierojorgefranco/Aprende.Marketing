/**
 * Configuración global para la generación de mensajes de WhatsApp.
 * Define el tono, estilo y restricciones que deben aplicarse a toda la secuencia.
 */
export const GLOBAL_CONFIG = {
    tone: "Cercano, entusiasta, persuasivo y ESTRICTAMENTE ENFOCADO EN EL GRUPO DE WHATSAPP. Dirigirse siempre a la comunidad/tribu del producto en plural (ej: '¡Hola a todos!', 'equipo', 'comunidad', 'chicas/chicos', 'para ustedes'). NUNCA hablar en singular de 'tú a tú' ni sonar como un mensaje privado o chat individual.",
    formatting: "Párrafos de máximo 1 a 2 líneas para lectura fluida en móviles. Uso estratégico de *negritas* para resaltar promesas y beneficios clave. Estructura visual con emojis como viñetas y saltos de línea limpios.",
    avoid: "Redacción en singular o de chat privado 'tú a tú' (evitar: 'te escribo por interno', 'espero que estés bien', 'para ti', 'te quiero contar'), bloques de texto densos, lenguaje corporativo frío, sonar como un bot de spam, incluir firmas genéricas o placeholders de nombre al final."
};

/**
 * Blueprints estratégicos para la generación de mensajes de WhatsApp persuasivos.
 * Cada momento tiene su propio objetivo psicológico, estructura y reglas de copywriting enfocadas al grupo.
 */
export const WHATSAPP_BLUEPRINTS = {
    'Bienvenida y Valor': {
        goal: "Confirmar que el grupo de WhatsApp está en el lugar correcto, dar la bienvenida a la tribu específica del producto digital, fijar la fecha/hora en la mente de todos y generar el primer micro-compromiso con reacciones de emojis.",
        structure: "1. Gancho de bienvenida entusiasta a la tribu del nicho/producto\n2. Confirmación de ingreso al grupo de WhatsApp y visión de la transformación que lograrán juntos\n3. Entrega de valor inicial o expectativa del evento\n4. Cuadro destacado con FECHA y HORA del evento para todos\n5. Llamado a micro-interacción con reacción de emoji (ej: 'Reaccionen con 🔥 si ya agendaron')",
        copywritingTips: "Define a la comunidad con el nombre de su nicho/producto (ej: 'Líderes', 'Emprendedores', 'Reposteras', 'Atletas', 'Creadores'). Habla siempre en plural. Pide una reacción con emoji para activar el grupo.",
        example: `¡BIENVENIDOS A LA TRIBU DE [Nombre del Producto/Nicho]! 🔥👋
Qué emoción ver a tantos [Tribu/Nicho] reunidos en este grupo oficial.

Acaban de dar el paso decisivo para [Transformación del Producto]. 🚀

📌 *NUESTRA CITA EN VIVO:*
📅 Fecha: [FECHA_CLASE]
⏰ Hora: [HORA_EVENTO]

*Agéndenlo ahora mismo equipo.* Reaccionen con un 🔥 aquí abajo si ya tienen la fecha guardada en su calendario.`
    },
    'Autoridad y Conexión': {
        goal: "Humanizar al experto ante todo el grupo, generar conexión emocional colectiva y autoridad mediante el origen o historia detrás del método único del producto digital.",
        structure: "1. Gancho con confesión o historia de quiebre impactante para la comunidad\n2. Breve historia del mayor dolor del avatar y cómo afectaba al experto/método\n3. El descubrimiento del mecanismo único del producto digital\n4. Invitación a la sesión grupal para revelar la solución\n5. Llamado a micro-interacción de empatía con emojis",
        copywritingTips: "Sé vulnerable pero mantén la autoridad. Adapta la historia a la problemática real del producto. Cierra pidiendo a la comunidad que reaccione si se identifican.",
        example: `CONFESIÓN PARA TODO EL GRUPO... 💔
Hubo un tiempo en el que yo sufría exactamente el mismo problema que muchos de ustedes: [Dolor principal del Avatar].

Intenté de todo hasta que descubrí [Mecanismo Único de este Producto]. Eso lo cambió absolutamente todo en mi [Nicho]. 🚀

Este *[FECHA_CLASE]* a las *[HORA_EVENTO]*, les revelaré a toda la comunidad cómo aplicar esta misma estrategia paso a paso.

¿Cuántos de ustedes han sentido esta misma frustración equipo? Reaccionen con un 🙋‍♂️/🙋‍♀️ los que estén listos para superar este obstáculo.`
    },
    'Curiosidad y Deseo': {
        goal: "Generar una intriga irresistible en el grupo sobre lo que aprenderán en la sesión en vivo y derribar un mito o error común del nicho.",
        structure: "1. Pregunta o estadística provocadora relevante para el producto/nicho\n2. Revelación del mito o trampa común que frena a la mayoría\n3. Promesa de la técnica/mecanismo específico que verán en vivo\n4. Recordatorio de la cita grupal\n5. Micro-interacción pidiendo reacción con emoji",
        copywritingTips: "Alinea la curiosidad directamente con el beneficio central del producto digital. Usa preguntas disruptivas para que las lean desde la notificación del móvil.",
        example: `¿SABÍAN QUE EL 90% DE LOS [Nicho] COMETEN ESTE ERROR? 😱
Creen que para lograr [Deseo del Avatar] necesitan [Mito del Nicho], pero la realidad es totalmente opuesta...

En nuestra clase del *[FECHA_CLASE]*, les mostraré en vivo el método exacto con [Nombre del Producto] para lograr [Transformación] sin caer en esa trampa. 💡

¿Están listos/as para descubrirlo equipo? Reaccionen con un 💡 si quieren que profundice en esto.`
    },
    'Conciencia del Problema': {
        goal: "Diagnosticar los mayores obstáculos del grupo y posicionar la clase en vivo y el método del producto como la solución colectiva definitiva.",
        structure: "1. Gancho de alerta sobre el costo de no solucionar el problema del nicho\n2. Diagnóstico claro de los 3 errores de estancamiento del avatar\n3. La solución estratégica que verán juntos en la sesión\n4. Confirmación de fecha y hora\n5. Llamado a micro-interacción de compromiso",
        copywritingTips: "Sé empático pero firme. Muestra el costo real de seguir estancado en el nicho. Pide un emoji 👍 para confirmar asistencia.",
        example: `ESTE OBSTÁCULO LES ESTÁ COSTANDO TIEMPO Y DINERO... ⚠️
Veo a muchos [Tribu/Nicho] cometiendo este error fatal: *[Error/Práctica obsoleta del nicho]*.

Si siguen por ese camino, solo conseguirán [Resultado negativo]. ❌

Por eso, en nuestra sesión del *[FECHA_CLASE]* a las *[HORA_EVENTO]* les mostraré la ruta probada para erradicar este problema con [Mecanismo del Producto].

Déjenme un 👍 los que no se van a perder esta solución por nada del mundo equipo.`
    },
    'Recordatorio y Logística': {
        goal: "Asegurar que el evento sea la prioridad número uno del día para todo el grupo de WhatsApp, confirmando horarios internacionales y dinámicas.",
        structure: "1. Gancho '¡LLEGÓ EL DÍA!' con máxima energía grupal\n2. Expectativa del impacto directo en el [Nicho/Producto]\n3. Cuadro organizado con horarios clave por país\n4. Instrucción de estar atentos al link exclusivo que se enviará al grupo\n5. Micro-interacción pidiendo reacción con alarma ⏰",
        copywritingTips: "Eleva el entusiasmo colectivo. Dirígete a la tribu del producto. Haz que pongan la alarma en sus teléfonos.",
        example: `¡LLEGÓ EL GRAN DÍA COMUNIDAD DE [Nicho]! 🎉🔥
Hoy revelamos la hoja de ruta definitiva para [Transformación del Producto].

⏰ *HORARIOS CONFIRMADOS POR PAÍS:*
🇲🇽 07:00 PM | 🇨🇴 08:00 PM | 🇦🇷 10:00 PM

📌 Enviaré el link exclusivo aquí al grupo 15 minutos antes de arrancar.

Pongan su alarma ya mismo. Reaccionen con ⏰ los que ya tienen todo listo equipo.`
    },
    'Preparación y Compromiso': {
        goal: "Elevar el nivel de urgencia y compromiso del grupo minutos/horas antes de empezar, garantizando que estén listos con lápiz y papel.",
        structure: "1. Cuenta regresiva motivadora (ej: Faltan 2 horas)\n2. Lista de preparación en 3 pasos para el asistente\n3. Anuncio de un incentivo o bono exclusivo para quienes asistan en vivo\n4. Micro-interacción con emoji de cohete 🚀",
        copywritingTips: "Construye ambiente de expectativa masiva en el grupo. Ofrece un regalo o recurso a los que se conecten puntuales.",
        example: `⏳ *FALTAN SOLO 2 HORAS EQUIPO* ⏳
La sala de transmisión está casi lista para recibir a toda nuestra comunidad de [Nicho].

📝 *CHECKLIST DE PREPARACIÓN:*
✅ Libreta y pluma a la mano.
✅ Espacio tranquilo y libre de distracciones.
✅ Tu bebida preferida. ☕

🎁 *INCENTIVO EN VIVO:* Regalaremos un recurso exclusivo solo a los que se conecten puntuales.

¿Listos para transformar su [Nicho]? Reaccionen con un 🚀 a este mensaje si ya están en posición.`
    },
    'Acceso al Evento': {
        goal: "Proporcionar el enlace de transmisión en vivo al grupo de WhatsApp y generar una entrada masiva e inmediata.",
        structure: "1. Gancho de alerta con sala abierta en vivo\n2. Enlace de acceso destacado para el grupo [LINK]\n3. Instrucción directa de ingresar de inmediato por cupos de sala",
        copywritingTips: "Usa emojis de alerta roja. Haz que el enlace resalte visualmente. Genera sentido de prisa colectiva.",
        example: `🔴 *¡ESTAMOS EN VIVO COMUNIDAD!* 🔴
Acabamos de abrir las puertas de la sala. ¡Entren todos ahora mismo antes de que alcancemos el límite de la plataforma!

👉 [LINK]
👉 [LINK]

Estamos comenzando directamente con la primera revelación sobre [Beneficio Principal del Producto]. ¡Los veo dentro a todos! 🚀`
    },
    'Presentación de Oferta': {
        goal: "Presentar la oferta oficial post-clase con claridad, destacando la propuesta de valor, beneficios del producto digital y link de compra para el grupo.",
        structure: "1. Celebración y agradecimiento post-clase a la tribu\n2. Apertura oficial de inscripciones para [Nombre del Producto]\n3. Desglose con viñetas de los principales beneficios y la transformación garantizada\n4. Enlace directo de compra/checkout [LINK]\n5. Mensaje de bienvenida a los primeros compradores",
        copywritingTips: "Conecta la oferta directamente con la solución vista en la clase. Enfatiza la transformación del producto digital.",
        example: `¡INSCRIPCIONES OFICIALMENTE ABIERTAS! 🎉🚀
Qué energía tan increíble tuvimos en la clase equipo. Tal como lo prometimos, abrimos cupos oficiales para *[Nombre del Producto]*.

🎯 *LO QUE CONSEGUIRÁN AL SUMARSE HOY:*
✅ [Beneficio 1 / Mecanismo Principal]
✅ [Beneficio 2 / Módulos de aceleración]
✅ [Transformación total en su Nicho]

👉 Aseguren su cupo de inmediato aquí: [LINK]

¡Bienvenidos/as a todos los que ya están dando el salto a la familia! 💖`
    },
    'Bonos y Objeciones': {
        goal: "Acelerar las ventas derribando la objeción principal del avatar e introduciendo bonos de acción rápida por tiempo limitado para el grupo.",
        structure: "1. Reporte del entusiasmo de la comunidad y alerta de cupos con bonos\n2. Desglose de los Bonos de Acción Rápida de tiempo limitado\n3. Respuesta directa a la objeción más común del avatar (tiempo, dinero, conocimientos)\n4. Enlace directo de compra [LINK]\n5. Micro-interacción",
        copywritingTips: "Crea urgencia genuina con los bonos de regalo. Muestra cómo el producto contrarresta el temor principal del avatar.",
        example: `¡MENSAJE URGENTE PARA TODO EL GRUPO! 😱⏳
La respuesta de la comunidad está siendo brutal, pero recuerden que los *Bonos de Acción Rápida* son para los primeros en ingresar.

🎁 *SI INGRESAN HOY RECIBEN GRATIS:*
• [Bono 1 / Plantilla o Acompañamiento]
• [Bono 2 / Módulo Acelerador]

Si la duda en su mente es [Objeción principal del Avatar], recuerden que [Nombre del Producto] fue diseñado justamente para guiarte desde cero sin complicaciones.

👉 Reclamar bonos e inscribirse aquí: [LINK]`
    },
    'Prueba Social y Validación': {
        goal: "Generar confianza total en el grupo mostrando testimonios, casos de éxito o transformación real de alumnos con el producto digital.",
        structure: "1. Compartir una historia o testimonio real de un alumno/usuario del producto\n2. Resaltar la diferencia entre seguir solo o aplicar el método de [Nombre del Producto]\n3. 'Si ellos pudieron, toda nuestra comunidad también puede'\n4. Enlace directo de compra [LINK]\n5. Micro-interacción con emoji 💯",
        copywritingTips: "Inspira al grupo con resultados palpables. Muestra la prueba social como el camino natural a seguir.",
        example: `MIREN LO QUE ESTÁ LOGRANDO NUESTRA COMUNIDAD... 🏆✨
"[Testimonio o resultado real de un cliente/alumno con el producto]".

Esto es lo que pasa cuando se aplica el método paso a paso de *[Nombre del Producto]*. Sin perder tiempo inventando la rueda.

Ustedes también están a un solo clic de transformar su [Nicho] equipo.

👉 Unirse al programa hoy mismo: [LINK]
Reaccionen con un 💯 los que están listos para ser la próxima historia de éxito.`
    },
    'Garantía y Seguridad': {
        goal: "Eliminar el riesgo financiero de la mente del comprador resaltando la garantía incondicional del producto digital.",
        structure: "1. Empatía con el temor normal a hacer una inversión\n2. Presentación incondicional de la Garantía de Satisfacción (7, 15 o 30 días)\n3. Demostración de que el riesgo es 100% del creador, no del cliente\n4. Enlace directo de compra sin riesgo [LINK]\n5. Micro-interacción o reaseguro final",
        copywritingTips: "Transmite paz mental y confianza absoluta. Elimina cualquier fricción de riesgo en la compra.",
        example: `¿DUDAS SOBRE DAR EL PASO EQUIPO? 🤔
Es 100% normal sentir cautela antes de tomar una decisión. Por eso quitamos todo el riesgo de sus hombros.

🛡️ *GARANTÍA INCONDICIONAL DE SATISFACCIÓN:*
Tienen días completos para probar *[Nombre del Producto]*, revisar los materiales y aplicar el método. Si sienten que no cumple con sus expectativas, les devolvemos el 100% de su inversión. Sin preguntas.

El riesgo es nuestro. La transformación es de ustedes.

👉 Inscribirse con total seguridad aquí: [LINK]`
    },
    'Urgencia y Cierre': {
        goal: "Forzar la decisión final del grupo advirtiendo el cierre definitivo de inscripciones y la pérdida de bonos y precios de lanzamiento.",
        structure: "1. Alerta de cierre definitivo en pocas horas para todo el grupo\n2. Consecuencias de no ingresar hoy (subida de precio, cierre de cupos, eliminación de bonos)\n3. Despedida motivadora llamando a la acción decisiva a la comunidad\n4. Enlace final de compra [LINK]",
        copywritingTips: "Último llamado enérgico y firme. Crea urgencia de verdad. Transmite que es la oportunidad final del grupo.",
        example: `⚠️ *ÚLTIMA LLAMADA PARA TODO EL GRUPO* ⚠️
En pocas horas cerramos definitivamente las puertas de *[Nombre del Producto]*.

🚨 *A PARTIR DE HOY A LA MEDIANOCHE:*
❌ Las inscripciones quedan cerradas.
❌ Los bonos de regalo desaparecen.
❌ El precio de acceso subirá en la siguiente edición.

No dejen pasar la oportunidad de dar este gran salto junto a toda nuestra comunidad de [Nicho].

👉 ÚLTIMO ACCESO DISPONIBLE: [LINK]
¡Los espero dentro a todos los que dieron el paso definitivo! 🚀`
    }
};

