const fs = require('fs');
const file = 'components/dashboard/tools/ProjectWizard.tsx';
let content = fs.readFileSync(file, 'utf8');

// The error says "error TS1005: ',' expected." on lines 146, 155, 164, 172, 222, 230, 239, 247, 297, 305, 314, 322
content = content.replace(/\} \n\s*\{ title: "DESGASTE FÍSICO"/g, '},\n      { title: "DESGASTE FÍSICO"');
content = content.replace(/\} \n\s*\{ title: "LIBERTAD CREATIVA"/g, '},\n      { title: "LIBERTAD CREATIVA"');
content = content.replace(/"\n\s*"Guarda referencias de diseños/g, '",\n      "Guarda referencias de diseños');

content = content.replace(/\} \n\s*\{ title: "PREOCUPACIÓN FUTURA"/g, '},\n      { title: "PREOCUPACIÓN FUTURA"');
content = content.replace(/\} \n\s*\{ title: "CRECIMIENTO ACELERADO"/g, '},\n      { title: "CRECIMIENTO ACELERADO"');
content = content.replace(/"\n\s*"Utiliza WhatsApp para interactuar/g, '",\n      "Utiliza WhatsApp para interactuar');

fs.writeFileSync(file, content, 'utf8');
console.log("Success syntax patch");
