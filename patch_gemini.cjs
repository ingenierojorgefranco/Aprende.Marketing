const fs = require('fs');
const file = 'backend/geminiService.js';
let content = fs.readFileSync(file, 'utf8');

const target1 = `"objection": "Miedo principal al éxito o al fallo",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",`;
const rep1 = `"objection": "Miedo principal al éxito o al fallo",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "hidden_pains": [{"title": "TÍTULO DEL MIEDO 1", "text": "Descripción detallada del miedo u objeción (1 de 6)"}, {"title": "TÍTULO DEL MIEDO 2", "text": "Descripción (2 de 6)"}, {"title": "TÍTULO DEL MIEDO 3", "text": "Descripción (3 de 6)"}, {"title": "TÍTULO DEL MIEDO 4", "text": "Descripción (4 de 6)"}, {"title": "TÍTULO DEL MIEDO 5", "text": "Descripción (5 de 6)"}, {"title": "TÍTULO DEL MIEDO 6", "text": "Descripción (6 de 6)"}],
              "hidden_desires": [{"title": "TÍTULO DEL DESEO 1", "text": "Descripción detallada del deseo o aspiración (1 de 6)"}, {"title": "TÍTULO DEL DESEO 2", "text": "Descripción (2 de 6)"}, {"title": "TÍTULO DEL DESEO 3", "text": "Descripción (3 de 6)"}, {"title": "TÍTULO DEL DESEO 4", "text": "Descripción (4 de 6)"}, {"title": "TÍTULO DEL DESEO 5", "text": "Descripción (5 de 6)"}, {"title": "TÍTULO DEL DESEO 6", "text": "Descripción (6 de 6)"}],
              "behaviors_list": ["Comportamiento o hábito de consumo digital (1 de 6)", "Hábito 2 de 6", "Hábito 3 de 6", "Hábito 4 de 6", "Hábito 5 de 6", "Hábito 6 de 6"],`;

const target2 = `"objection": "Miedo al fraude o mala inversión",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",`;
const rep2 = `"objection": "Miedo al fraude o mala inversión",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "hidden_pains": [{"title": "TÍTULO DEL MIEDO 1", "text": "Descripción detallada del miedo u objeción (1 de 6)"}, {"title": "TÍTULO DEL MIEDO 2", "text": "Descripción (2 de 6)"}, {"title": "TÍTULO DEL MIEDO 3", "text": "Descripción (3 de 6)"}, {"title": "TÍTULO DEL MIEDO 4", "text": "Descripción (4 de 6)"}, {"title": "TÍTULO DEL MIEDO 5", "text": "Descripción (5 de 6)"}, {"title": "TÍTULO DEL MIEDO 6", "text": "Descripción (6 de 6)"}],
              "hidden_desires": [{"title": "TÍTULO DEL DESEO 1", "text": "Descripción detallada del deseo o aspiración (1 de 6)"}, {"title": "TÍTULO DEL DESEO 2", "text": "Descripción (2 de 6)"}, {"title": "TÍTULO DEL DESEO 3", "text": "Descripción (3 de 6)"}, {"title": "TÍTULO DEL DESEO 4", "text": "Descripción (4 de 6)"}, {"title": "TÍTULO DEL DESEO 5", "text": "Descripción (5 de 6)"}, {"title": "TÍTULO DEL DESEO 6", "text": "Descripción (6 de 6)"}],
              "behaviors_list": ["Comportamiento o hábito de consumo digital (1 de 6)", "Hábito 2 de 6", "Hábito 3 de 6", "Hábito 4 de 6", "Hábito 5 de 6", "Hábito 6 de 6"],`;

const target3 = `"objection": "Miedo a empezar de cero",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",`;
const rep3 = `"objection": "Miedo a empezar de cero",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "hidden_pains": [{"title": "TÍTULO DEL MIEDO 1", "text": "Descripción detallada del miedo u objeción (1 de 6)"}, {"title": "TÍTULO DEL MIEDO 2", "text": "Descripción (2 de 6)"}, {"title": "TÍTULO DEL MIEDO 3", "text": "Descripción (3 de 6)"}, {"title": "TÍTULO DEL MIEDO 4", "text": "Descripción (4 de 6)"}, {"title": "TÍTULO DEL MIEDO 5", "text": "Descripción (5 de 6)"}, {"title": "TÍTULO DEL MIEDO 6", "text": "Descripción (6 de 6)"}],
              "hidden_desires": [{"title": "TÍTULO DEL DESEO 1", "text": "Descripción detallada del deseo o aspiración (1 de 6)"}, {"title": "TÍTULO DEL DESEO 2", "text": "Descripción (2 de 6)"}, {"title": "TÍTULO DEL DESEO 3", "text": "Descripción (3 de 6)"}, {"title": "TÍTULO DEL DESEO 4", "text": "Descripción (4 de 6)"}, {"title": "TÍTULO DEL DESEO 5", "text": "Descripción (5 de 6)"}, {"title": "TÍTULO DEL DESEO 6", "text": "Descripción (6 de 6)"}],
              "behaviors_list": ["Comportamiento o hábito de consumo digital (1 de 6)", "Hábito 2 de 6", "Hábito 3 de 6", "Hábito 4 de 6", "Hábito 5 de 6", "Hábito 6 de 6"],`;

if (content.includes(target1) && content.includes(target2) && content.includes(target3)) {
    content = content.replace(target1, rep1);
    content = content.replace(target2, rep2);
    content = content.replace(target3, rep3);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Success backend patch");
} else {
    console.log("Targets not found");
}
