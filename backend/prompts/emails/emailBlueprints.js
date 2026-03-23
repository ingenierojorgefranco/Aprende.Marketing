/**
 * Configuración global para la generación de correos electrónicos.
 * Define el tono, estilo y restricciones que deben aplicarse a toda la secuencia.
 */
export const GLOBAL_CONFIG = {
    tone: "Cercano y natural (como una persona real), claro, sin tecnicismos, empático con el usuario, profesional pero no robótico.",
    formatting: "Párrafos cortos y bien estructurados para facilitar la lectura profesional.",
    avoid: "Promesas exageradas, lenguaje demasiado técnico, textos largos sin ritmo."
};

/**
 * Blueprints estratégicos para la generación de correos electrónicos persuasivos.
 * Cada pilar tiene su propio objetivo psicológico, estructura y reglas de copywriting.
 */
export const EMAIL_BLUEPRINTS = {
    'Bienvenida + Valor': {
        goal: "Dar la bienvenida al usuario, entregar el recurso prometido (lead magnet) y preparar el terreno para los siguientes correos.",
        structure: "1. Asunto llamativo y natural (no spam)\n2. Preheader corto complementario\n3. Saludo cercano usando [Nombre]\n4. Bienvenida emocional (reconocer la decisión del usuario)\n5. Entrega del recurso con llamada a la acción (ej: acceder a guía, clase, etc.)\n6. Mini insight: explicar por qué la mayoría falla (sin atacar, pero generando conciencia)\n7. Introducción sutil a lo que vendrá en la secuencia (crear expectativa)\n8. Cierre cercano y humano",
        copywritingTips: "Usa un tono entusiasta y profesional. Haz que el usuario se sienta inteligente por haber tomado la decisión de descargar el material.",
        example: `Asunto: Aquí tienes lo prometido + algo importante que debes saber

Hola [Nombre],

Primero que nada, quiero darte la bienvenida.

Acabas de dar un paso que muchas personas llevan tiempo posponiendo: empezar a hacer algo diferente para mejorar sus ingresos.

Y eso ya dice mucho de ti.

Tal como te prometí, aquí tienes tu acceso a [recurso / guía / clase gratuita]:

👉 [Acceder ahora]

Pero antes de que entres, hay algo importante que debes entender.

La mayoría de personas falla no porque el método no funcione…
sino porque no tienen una guía clara paso a paso.

Saltar de video en video, probar cosas sin dirección o depender de “trucos rápidos” solo genera frustración.

Por eso, en los próximos días te voy a mostrar algo diferente.

No solo teoría…
sino una forma real de empezar, incluso si sientes que no tienes experiencia o no sabes por dónde comenzar.

Mi objetivo es simple:

👉 ayudarte a que entiendas cómo convertir esto en una oportunidad real.

Por ahora, empieza por aquí:

👉 [Acceder al contenido]

Nos vemos mañana, porque lo que viene puede cambiar completamente tu forma de ver esto.

Un abrazo,

[Nombre del Profesor]
[Cargo del Profesor]

Pdata: Piensa que hoy es el gran cambio que has esperado en tu vida, hoy tienes en tus manos la posibilidad de lograr lo que siempre has imaginado.`
    },
    'Romper Creencias': {
        goal: "Romper creencias limitantes del usuario sobre empezar desde cero.",
        structure: "1. Asunto atractivo (curiosidad o ruptura de creencia)\n2. Preheader breve\n3. Introducción directa que confronte una creencia común\n4. Explicación simple desmontando esa creencia\n5. Reencuadre positivo (sí es posible)\n6. Lista breve (3 puntos máximo) reforzando la idea\n7. Cierre abierto que genere curiosidad para el siguiente email",
        copywritingTips: "Escribe en tono cercano, humano y fácil de entender. No uses lenguaje técnico ni complejo. Usa frases cortas y claras. Mantén un enfoque emocional + lógico.",
        constraints: "No vender directamente, no mencionar precios, no ser agresivo, mantener tono de acompañamiento. Longitud: Entre 150 y 250 palabras. Creencias a atacar: 'No tengo experiencia', 'Esto es difícil', 'No es para mí'.",
        example: `Asunto: Lo que nadie te dice sobre empezar desde cero
Preheader: Esto puede cambiar cómo ves tu futuro hoy

Hola [Nombre],

Déjame decirte algo directo:

No necesitas experiencia para empezar.

Lo que necesitas es un sistema claro.

La mayoría de personas cree que para ganar dinero en estética necesitas:

Años de práctica
Talento natural
O contactos

Y eso no es verdad.

👉 La realidad es mucho más simple:

Las personas que hoy están ganando dinero con microblading empezaron igual que tú…
Con dudas, miedo… y cero experiencia.

La única diferencia es que tuvieron una guía paso a paso.

Porque cuando tienes:
✔️ Un método claro
✔️ Prácticas guiadas
✔️ Y un camino definido

El proceso deja de ser confuso… y se vuelve ejecutable.

Y ahí es donde todo cambia.

Porque pasas de pensar:

“Esto no es para mí”

A darte cuenta de:

“Esto sí es posible… si alguien me guía.”

Mañana te voy a contar algo importante…

👉 La historia real de alguien que empezó desde cero
y logró cambiar completamente su situación.

Atenta.

Un abrazo,
Tu Equipo`
    },
    'Historia / Conexión': {
        goal: "Generar conexión emocional profunda a través de una historia realista de identificación.",
        structure: "1. Asunto emocional (curiosidad o identificación)\n2. Preheader corto\n3. Introducción con situación común (dolor del usuario)\n4. Desarrollo de la historia (miedo, dudas, estancamiento)\n5. Punto de decisión (cuando la persona decide cambiar)\n6. Proceso (aprende, falla, avanza)\n7. Resultado (mejora su vida)\n8. Cierre con pregunta que involucre al lector\n9. Transición al siguiente email",
        copywritingTips: "Usa storytelling (historia realista, no exagerada). Tono cercano, humano, emocional. Lenguaje simple, sin tecnicismos. Frases cortas. Vende la IDENTIDAD, no el curso. Haz que el lector piense 'Eso podría ser yo'.",
        constraints: "No vender directamente, no usar cifras irreales, no exagerar resultados, mantener realismo. Longitud: 200–300 palabras.",
        example: `Asunto: Ella también pensaba que no podía
Preheader: Hasta que decidió intentarlo…

Hola [Nombre],

Quiero contarte algo que probablemente te suene familiar…

Hace no mucho, una chica estaba exactamente donde tú estás ahora.

Trabajando muchas horas…
Ganando menos de lo que merecía…
Y sintiendo que su vida no avanzaba.

Tenía miedo.

Miedo a equivocarse.
Miedo a invertir en algo que no funcionara.
Miedo a no ser capaz.

Y lo más duro…

👉 Sentía que otras personas avanzaban…
mientras ella seguía en el mismo lugar.

Un día tomó una decisión simple:

“No voy a quedarme con la duda.”

Empezó desde cero.
Sin experiencia.
Sin saber si lo lograría.

Pero con algo claro:
quería cambiar su situación.

Paso a paso fue aprendiendo, practicando…
equivocándose también.

Pero avanzando.

Hoy…

Tiene sus propias clientas.
Cobra por su trabajo.
Y lo más importante:
depende de ella, no de un jefe.

Y no…
no es alguien especial.

Es alguien que decidió empezar.

Ahora te hago una pregunta:

👉 ¿Y si dentro de unos meses eres tú la que cuenta esta historia?

Mañana voy a enseñarte algo clave:

Cómo funciona realmente este proceso por dentro
(y por qué sí puedes lograrlo).

Nos vemos mañana.

Un abrazo,
Tu Equipo`
    },
    'Educación + Autoridad': {
        goal: "Educar al usuario y posicionar autoridad explicando el proceso de forma clara y simple para reducir la incertidumbre.",
        structure: "1. Asunto claro y educativo\n2. Preheader breve\n3. Introducción planteando la duda: '¿Cómo funciona esto?'\n4. Explicación en 3 pasos o fases\n5. Cada paso debe ser breve y claro\n6. Reforzar que es un proceso guiado\n7. Eliminar sensación de complejidad\n8. Cierre que anticipe objeciones del siguiente email",
        copywritingTips: "Lenguaje simple, fácil de entender. Tono cercano y explicativo. Evitar tecnicismos. Generar sensación de claridad. Enfócate en la simplicidad (qué va a hacer, cómo y en qué orden).",
        constraints: "No vender directamente, no mencionar precios, no saturar con información técnica, enfocarse en simplicidad y claridad. Longitud: 180–250 palabras.",
        example: `Asunto: Así funciona realmente este proceso (sin complicaciones)
Preheader: Te lo explico paso a paso

Hola [Nombre],

Hasta ahora hemos hablado de algo importante:

👉 Que sí es posible empezar desde cero
👉 Que otras personas ya lo han logrado

Pero ahora viene la pregunta lógica:

¿Cómo funciona realmente esto?

Te lo explico de forma simple.

Este proceso tiene 3 fases:

1. Aprender la base correcta

Aquí entiendes lo esencial:

Cómo diseñar cejas correctamente
Qué herramientas usar
Y cómo evitar errores comunes

(Sin esto, todo lo demás falla)

2. Practicar sin riesgo

No empiezas con personas reales.

Primero practicas con técnicas seguras
que te permiten ganar confianza paso a paso.

Aquí es donde la mayoría falla…
porque nadie se lo explica bien.

3. Conseguir tus primeras clientas

Este es el punto clave.

No basta con saber la técnica.
👉 Necesitas saber cómo atraer personas.

Por eso se trabaja:

Cómo mostrar tu trabajo
Cómo generar confianza
Y cómo conseguir tus primeras citas

Cuando entiendes estas 3 fases…

Todo deja de ser confuso.

Y pasa a ser un proceso claro.

👉 Sabes qué hacer
👉 En qué orden
👉 Y por qué funciona

Mañana vamos a hablar de algo muy importante:

Las dudas reales que frenan a la mayoría
(y cómo resolverlas antes de empezar)

Porque sí… es normal tenerlas.

Nos vemos mañana.

Un abrazo,
Tu Equipo`
    },
    'Objeciones': {
        goal: "Eliminar las dudas más comunes (tiempo, dinero, capacidad) validando la emoción del usuario para reducir el riesgo percibido.",
        structure: "1. Asunto que conecte con pensamientos internos\n2. Preheader breve\n3. Introducción validando dudas\n4. Lista de objeciones comunes\n5. Respuestas claras a cada objeción\n6. Reencuadre positivo (sí es posible)\n7. Pregunta poderosa que genere reflexión\n8. Transición al siguiente email",
        copywritingTips: "Tono empático, cercano y humano. Validar las dudas del usuario (no atacarlas). Responder objeciones con lógica simple. Usar contraste (no es X, es Y). Generar Seguridad, Claridad y Control.",
        constraints: "No vender agresivamente, no minimizar al usuario, no prometer resultados irreales. Longitud: 200–300 palabras. Objeciones a tratar: Falta de tiempo, Falta de experiencia, Miedo a fallar, Duda sobre inversión.",
        example: `Asunto: Sé lo que estás pensando…
Preheader: Y es totalmente normal

Hola [Nombre],

Si has llegado hasta aquí…
seguramente hay algo que te interesa.

Pero también sé lo que puede estar pasando por tu cabeza ahora mismo:

👉 “No sé si esto es para mí”
👉 “¿Y si no soy capaz?”
👉 “No tengo tiempo suficiente”
👉 “¿Y si invierto y no funciona?”

Déjame decirte algo importante:

Es completamente normal pensar así.

De hecho, todas las personas que hoy han avanzado…
pasaron exactamente por esas mismas dudas.

Pero aquí está la diferencia:

❌ No se trata de tener más tiempo
Se trata de usar bien el tiempo que tienes.

Este tipo de formación está pensada para avanzar paso a paso,
sin necesidad de dedicar horas interminables.

❌ No se trata de ser perfecta desde el inicio
Se trata de aprender correctamente.

Nadie empieza sabiendo.
Todo se construye con práctica guiada.

❌ No se trata de “probar suerte”
Se trata de seguir un método.

Cuando hay un sistema claro,
el camino deja de ser incierto.

Y quizás la más importante…

👉 No estás sola en el proceso

El acompañamiento marca la diferencia entre rendirse…
o avanzar hasta lograrlo.

Así que la verdadera pregunta no es:

“¿Y si no funciona?”

Es esta:

👉 “¿Qué pasa si sí funciona… y nunca lo intentaste?”

Mañana te voy a mostrar algo clave:

Un caso real que demuestra lo que pasa
cuando alguien decide dar el paso.

Nos vemos mañana.

Un abrazo,
Tu Equipo`
    },
    'Caso de éxito': {
        goal: "Mostrar un caso de éxito realista para generar prueba social y confianza. Demostrar que sí funciona en la vida real, reducir el miedo final y activar el pensamiento: 'si ella pudo, yo también'.",
        structure: "1. Asunto basado en resultado o historia\n2. Preheader breve\n3. Introducción directa (esto es real)\n4. Presentación del caso (persona común)\n5. Inicio con dudas/miedos\n6. Proceso paso a paso (aprendizaje, práctica)\n7. Primeros resultados (pequeños logros)\n8. Resultado actual (mejora real)\n9. Reflexión final\n10. Pregunta al lector\n11. Transición al cierre (día siguiente)",
        copywritingTips: "Usa storytelling realista (sin exagerar). Tono cercano, humano. Evitar promesas irreales. Mostrar progreso gradual (no éxito instantáneo). Enfócate en que el resultado viene de seguir un sistema.",
        constraints: "No exagerar ingresos, no usar lenguaje agresivo, mantener credibilidad. Longitud: 200–300 palabras.",
        example: `Asunto: Esto fue lo que pasó cuando decidió empezar
Preheader: No fue magia… fue decisión

Hola [Nombre],

Quiero mostrarte algo real.

No teoría.
No promesas.
👉 Un resultado.

Hace unos meses, una alumna tomó una decisión:

Empezar.

No tenía experiencia.
No tenía clientas.
Y tampoco tenía claro si iba a funcionar.

Pero sí tenía algo:

👉 La decisión de intentarlo en serio.

Empezó paso a paso.

Aprendiendo la base.
Practicando sin presión.
Siguiendo el proceso sin saltarse nada.

Al principio dudaba.
Como todo el mundo.

Pero poco a poco…

Algo cambió.

Empezó a ganar confianza.
A entender lo que hacía.
Y a ver resultados.

Su primera clienta no fue perfecta.
Pero fue el inicio.

Luego vino la segunda.
Después la tercera.

Y hoy…

👉 Tiene ingresos propios
👉 Agenda citas por su cuenta
👉 Y ya no depende de un trabajo que no le gustaba

¿Fue fácil?

No.

¿Fue posible?

Sí.

Porque no improvisó.

👉 Siguió un sistema.

Y eso es lo que marca la diferencia.

Ahora te pregunto algo:

👉 ¿Quieres seguir dudando… o empezar a construir tu propio resultado?

Mañana es importante.

Te voy a mostrar exactamente cómo dar el siguiente paso.

Nos vemos ahí.

Un abrazo,
Tu Equipo`
    },
    'Cierre / Oferta': {
        goal: "Cerrar la venta de forma clara, sin presión agresiva. Convertir sin fricción, dar claridad total del siguiente paso y activar la decisión (no presión).",
        structure: "1. Asunto directo (decisión)\n2. Preheader breve\n3. Recapitulación breve de lo aprendido\n4. Planteamiento de decisión (seguir igual vs avanzar)\n5. Reforzar que nunca hay momento perfecto\n6. Presentación de la oferta (sin exagerar)\n7. Lista de beneficios claros (3-5 puntos)\n8. CTA claro (acceder ahora)\n9. Cierre con pregunta reflexiva",
        copywritingTips: "Tono firme pero cercano. Enfocado en decisión, no en presión. Lenguaje simple. Generar claridad. No es 'vender', es recoger la decisión que ya se viene formando.",
        constraints: "No usar urgencia falsa, no presionar agresivamente, no prometer resultados irreales, enfocarse en decisión personal. Longitud: 180–250 palabras.",
        example: `Asunto: Es tu momento de decidir
Preheader: Puedes seguir igual… o empezar hoy

Hola [Nombre],

Hemos llegado al punto más importante.

Durante estos días viste que:

👉 Es posible empezar desde cero
👉 No necesitas experiencia previa
👉 Hay un proceso claro
👉 Y otras personas ya lo han logrado

Ahora solo queda una cosa:

Tu decisión.

Puedes seguir como hasta ahora…
Pensándolo, dudando, esperando el momento perfecto.

O puedes hacer algo diferente:

👉 Dar el primer paso.

Porque la realidad es esta:

Nunca vas a sentirte 100% lista.
Nunca va a existir el momento perfecto.

Pero sí existe algo que marca la diferencia:

👉 Empezar.

Hoy tienes la oportunidad de acceder a una formación diseñada para:

✔️ Llevarte desde cero
✔️ Enseñarte paso a paso
✔️ Y ayudarte a generar tus primeros ingresos

Sin teoría innecesaria.
Sin complicaciones.
Sin perder tiempo.

Y lo más importante:

👉 Con un sistema que ya ha funcionado para otras personas.

Si decides avanzar, aquí puedes hacerlo:

👉 [Acceder ahora]

No es una decisión pequeña.

Pero tampoco lo es quedarte donde estás.

La pregunta es simple:

👉 ¿Dónde quieres estar dentro de unos meses?

La decisión es tuya.

Un abrazo,
Tu Equipo`
    },
    'default': {
        goal: "Aportar valor y mantener el interés del prospecto en el producto.",
        structure: "Gancho de interés -> Contenido útil -> Relación con el producto -> CTA.",
        copywritingTips: "Mantén el tono de la marca y asegúrate de que cada correo tenga un único llamado a la acción claro."
    }
};
