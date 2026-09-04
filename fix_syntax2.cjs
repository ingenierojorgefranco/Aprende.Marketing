const fs = require('fs');
const file = 'components/dashboard/tools/ProjectWizard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\} \n\s*\{ title/g, '},\n      { title');
content = content.replace(/"\n\s*"Utiliza WhatsApp/g, '",\n      "Utiliza WhatsApp');
content = content.replace(/"\n\s*"Guarda referencias/g, '",\n      "Guarda referencias');
content = content.replace(/\}   \n\s*\{ title/g, '},\n      { title');

fs.writeFileSync(file, content, 'utf8');
