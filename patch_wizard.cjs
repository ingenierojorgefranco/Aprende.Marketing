const fs = require('fs');
const file = 'components/dashboard/tools/ProjectWizard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `dolores_ocultos: masterAv.dolores_ocultos || [...defAv.dolores_ocultos],
                        deseos_motivaciones: masterAv.deseos_motivaciones || [...defAv.deseos_motivaciones],
                        comportamientos: masterAv.comportamientos || [...defAv.comportamientos],`;
const rep1 = `dolores_ocultos: masterAv.hidden_pains || masterAv.dolores_ocultos || [...defAv.dolores_ocultos],
                        deseos_motivaciones: masterAv.hidden_desires || masterAv.deseos_motivaciones || [...defAv.deseos_motivaciones],
                        comportamientos: masterAv.behaviors_list || masterAv.comportamientos || [...defAv.comportamientos],`;

const target2 = `dolores_ocultos: masterAv.dolores_ocultos || [...defAv.dolores_ocultos],
                                                deseos_motivaciones: masterAv.deseos_motivaciones || [...defAv.deseos_motivaciones],
                                                comportamientos: masterAv.comportamientos || [...defAv.comportamientos],`;
const rep2 = `dolores_ocultos: masterAv.hidden_pains || masterAv.dolores_ocultos || [...defAv.dolores_ocultos],
                                                deseos_motivaciones: masterAv.hidden_desires || masterAv.deseos_motivaciones || [...defAv.deseos_motivaciones],
                                                comportamientos: masterAv.behaviors_list || masterAv.comportamientos || [...defAv.comportamientos],`;

// In ProjectWizard.tsx, change Array.from({ length: 4 }) to Array.from({ length: 6 }) inside dolores and deseos inputs.
let newContent = content.replaceAll('Array.from({ length: 4 }).map((_, di) => {', 'Array.from({ length: 6 }).map((_, di) => {');

newContent = newContent.replace(target1, rep1).replace(target2, rep2);

if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log("Success wizard patch");
} else {
    console.log("Targets not found or no changes");
}
