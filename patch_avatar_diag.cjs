const fs = require('fs');
const file = 'components/dashboard/tools/ProjectStrategy/ProjectStrategy_AvatarDiagnosis.tsx';
let content = fs.readFileSync(file, 'utf8');

const t1 = `let dolores_ocultos = hasSavedAvatars ? [] : defaultAv.dolores_ocultos;
    if (realAv.dolores_ocultos && Array.isArray(realAv.dolores_ocultos)) {
      dolores_ocultos = realAv.dolores_ocultos;
    } else if (realAv.pains_hidden && Array.isArray(realAv.pains_hidden)) {
      dolores_ocultos = realAv.pains_hidden;
    }`;
const r1 = `let dolores_ocultos = hasSavedAvatars ? [] : defaultAv.dolores_ocultos;
    if (realAv.hidden_pains && Array.isArray(realAv.hidden_pains)) {
      dolores_ocultos = realAv.hidden_pains;
    } else if (realAv.dolores_ocultos && Array.isArray(realAv.dolores_ocultos)) {
      dolores_ocultos = realAv.dolores_ocultos;
    } else if (realAv.pains_hidden && Array.isArray(realAv.pains_hidden)) {
      dolores_ocultos = realAv.pains_hidden;
    }`;

const t2 = `let deseos_motivaciones = hasSavedAvatars ? [] : defaultAv.deseos_motivaciones;
    if (realAv.deseos_motivaciones && Array.isArray(realAv.deseos_motivaciones)) {
      deseos_motivaciones = realAv.deseos_motivaciones;
    } else if (realAv.motivations_detail && Array.isArray(realAv.motivations_detail)) {
      deseos_motivaciones = realAv.motivations_detail;
    }`;
const r2 = `let deseos_motivaciones = hasSavedAvatars ? [] : defaultAv.deseos_motivaciones;
    if (realAv.hidden_desires && Array.isArray(realAv.hidden_desires)) {
      deseos_motivaciones = realAv.hidden_desires;
    } else if (realAv.deseos_motivaciones && Array.isArray(realAv.deseos_motivaciones)) {
      deseos_motivaciones = realAv.deseos_motivaciones;
    } else if (realAv.motivations_detail && Array.isArray(realAv.motivations_detail)) {
      deseos_motivaciones = realAv.motivations_detail;
    }`;

const t3 = `let comportamientos = hasSavedAvatars ? [] : defaultAv.comportamientos;
    if (realAv.comportamientos && Array.isArray(realAv.comportamientos)) {
      comportamientos = realAv.comportamientos;
    } else if (realAv.behaviors && Array.isArray(realAv.behaviors)) {
      comportamientos = realAv.behaviors;
    }`;
const r3 = `let comportamientos = hasSavedAvatars ? [] : defaultAv.comportamientos;
    if (realAv.behaviors_list && Array.isArray(realAv.behaviors_list)) {
      comportamientos = realAv.behaviors_list;
    } else if (realAv.comportamientos && Array.isArray(realAv.comportamientos)) {
      comportamientos = realAv.comportamientos;
    } else if (realAv.behaviors && Array.isArray(realAv.behaviors)) {
      comportamientos = realAv.behaviors;
    }`;

let newC = content.replace(t1, r1).replace(t2, r2).replace(t3, r3);
fs.writeFileSync(file, newC, 'utf8');
console.log("Success strategy mapping patch");
