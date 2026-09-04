const fs = require('fs');
const file = 'components/dashboard/wizard/OnboardingWizard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                      {av.comportamientos.map((item: string, dIdx: number) => (`;
const rep = `<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                                                      {av.comportamientos.map((item: string, dIdx: number) => (`;

if (content.includes(target)) {
    content = content.replace(target, rep);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Success Onboarding patch");
} else {
    console.log("Target not found in Onboarding");
}
