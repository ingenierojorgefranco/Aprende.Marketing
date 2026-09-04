const fs = require('fs');
const file = 'components/dashboard/tools/ProjectWizard.tsx';
let content = fs.readFileSync(file, 'utf8');

const emptyDolores = `    dolores_ocultos: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" }
    ],`;
const repEmptyDolores = `    dolores_ocultos: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" }
    ],`;

const emptyDeseos = `    deseos_motivaciones: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" }
    ],`;
const repEmptyDeseos = `    deseos_motivaciones: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" }
    ],`;

const emptyComp = `    comportamientos: ["", "", "", ""],`;
const repEmptyComp = `    comportamientos: ["", "", "", "", "", ""],`;
const emptyBeh = `    behaviors: ["", "", "", ""],`;
const repEmptyBeh = `    behaviors: ["", "", "", "", "", ""],`;

content = content.replace(emptyDolores, repEmptyDolores).replace(emptyDeseos, repEmptyDeseos).replace(emptyComp, repEmptyComp).replace(emptyBeh, repEmptyBeh);

// Also need to add 2 empty strings/objects to the other 3 default avatars
const patternAv1Dol = `    dolores_ocultos: [
      { title: "CLIENTELA INESTABLE", text: "No tiene suficientes clientes estables, lo que le genera una alta incertidumbre mensual sobre la facturación de su negocio." },
      { title: "TRABAJO DESVALORADO", text: "Siente que su trabajo no es valorado como debería y que las clientas siempre buscan la opción más barata regateando precios." },
      { title: "MARKETING INVISIBLE", text: "Le cuesta diferenciarse en un mercado saturado de profesionales independientes ofreciendo lo mismo a precios muy bajos." },
      { title: "INVERSIÓN SIN RETORNO", text: "Miedo a invertir en formación y no ver resultados, perdiendo sus recursos en teoría aburrida que no puede aplicar en la práctica real." }
    ],`;
const repAv1Dol = patternAv1Dol.replace('    ],', `      { title: "DESGASTE FÍSICO", text: "Siente que trabaja demasiadas horas al día arriesgando su salud por un margen de ganancia muy pequeño." },
      { title: "MIEDO A LA COMPETENCIA", text: "Teme que centros de belleza más grandes o con mayor presupuesto la desplacen de su nicho de mercado." }
    ],`);

const patternAv1Des = `    deseos_motivaciones: [
      { title: "AGENDA LLENA", text: "Tener más clientes y la agenda completamente llena con meses de anticipación sin tener que regatear tarifas." },
      { title: "EXPERTA RECONOCIDA", text: "Ser reconocida formalmente como una de las mejores expertas referentes en su área y ciudad." },
      { title: "INDEPENDENCIA FINANCIERA", text: "Lograr verdadera estabilidad e independencia económica para tomar decisiones con libertad." },
      { title: "FLEXIBILIDAD ABSOLUTA", text: "Tener control total de sus propios horarios de atención y la flexibilidad de tiempo y ubicación que siempre soñó." }
    ],`;
const repAv1Des = patternAv1Des.replace('    ],', `      { title: "LIBERTAD CREATIVA", text: "Poder elegir con qué clientes trabajar y enfocarse en técnicas que realmente disfruta realizar." },
      { title: "LEGADO FAMILIAR", text: "Construir un negocio tan sólido que pueda heredar a sus hijos o que le permita pagar su educación." }
    ],`);

const patternAv1Comp = `    comportamientos: [
      "Sigue activamente cuentas de gurús de belleza y marketing estético en Instagram y TikTok.",
      "Paga pequeños talleres o webinars rápidos de $20 a $50 USD buscando secretos aplicables.",
      "Pregunta constantemente en grupos de Facebook qué marcas de pigmentos o inductores son mejores.",
      "Consume video tutoriales rápidos por las noches antes de dormir buscando perfeccionar trazo de cejas."
    ],`;
const repAv1Comp = patternAv1Comp.replace('    ],', `      "Guarda referencias de diseños y técnicas en tableros organizados de Pinterest.",
      "Participa en ferias o congresos locales de belleza para conocer proveedores."
    ],`);

const patternAv1Beh = `    behaviors: [
      "Sigue activamente cuentas de gurús de belleza y marketing estético en Instagram y TikTok.",
      "Paga pequeños talleres o webinars rápidos de $20 a $50 USD buscando secretos aplicables.",
      "Pregunta constantemente en grupos de Facebook qué marcas de pigmentos o inductores son mejores.",
      "Consume video tutoriales rápidos por las noches antes de dormir buscando perfeccionar trazo de cejas."
    ],`;
const repAv1Beh = patternAv1Beh.replace('    ],', `      "Guarda referencias de diseños y técnicas en tableros organizados de Pinterest.",
      "Participa en ferias o congresos locales de belleza para conocer proveedores."
    ],`);

content = content.replace(patternAv1Dol, repAv1Dol).replace(patternAv1Des, repAv1Des).replace(patternAv1Comp, repAv1Comp).replace(patternAv1Beh, repAv1Beh);

// Repeat similar simple replacements for Av2 and Av3 by just appending two dummy items to existing arrays where length is 4

content = content.replace(
    /dolores_ocultos: \[\s*\{[^\}]+\},\s*\{[^\}]+\},\s*\{[^\}]+\}\s*\]/g,
    (match) => match.replace('    ]', '      { title: "PREOCUPACIÓN FUTURA", text: "Siente estrés ante la incertidumbre económica y busca opciones seguras." },\n      { title: "FALTA DE CONFIANZA", text: "Teme fracasar si lo intenta porque no confía plenamente en sus habilidades actuales." }\n    ]')
);
content = content.replace(
    /deseos_motivaciones: \[\s*\{[^\}]+\},\s*\{[^\}]+\},\s*\{[^\}]+\}\s*\]/g,
    (match) => match.replace('    ]', '      { title: "CRECIMIENTO ACELERADO", text: "Desea ver resultados tangibles y rápidos tras implementar el programa." },\n      { title: "COMUNIDAD Y SOPORTE", text: "Ansía pertenecer a una comunidad donde reciba retroalimentación constante." }\n    ]')
);
content = content.replace(
    /comportamientos: \[\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+"\s*\]/g,
    (match) => match.replace('    ]', '      "Utiliza WhatsApp para interactuar y cerrar ventas con prospectos.",\n      "Busca tutoriales paso a paso en YouTube antes de realizar compras grandes."\n    ]')
);
content = content.replace(
    /behaviors: \[\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+"\s*\]/g,
    (match) => match.replace('    ]', '      "Utiliza WhatsApp para interactuar y cerrar ventas con prospectos.",\n      "Busca tutoriales paso a paso en YouTube antes de realizar compras grandes."\n    ]')
);

fs.writeFileSync(file, content, 'utf8');
console.log("Success defaults patch");
