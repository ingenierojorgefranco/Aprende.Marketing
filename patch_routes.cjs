const fs = require('fs');
const file = 'backend/routes/projectRoutes.js';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                strategyJson.avatars[0] = {
                    ...strategyJson.avatars[0],
                    education: masterAvatar.education || masterAvatar.studies,
                    studies: masterAvatar.studies || masterAvatar.education,
                    archetype: masterAvatar.archetype || masterAvatar.occupation,
                    occupation: masterAvatar.occupation || masterAvatar.archetype,
                    incomeRange: masterAvatar.incomeRange || masterAvatar.income,
                    income: masterAvatar.income || masterAvatar.incomeRange,
                    location: masterAvatar.location || masterAvatar.geographic,
                    geographic: masterAvatar.geographic || masterAvatar.location,
                    civilStatus: masterAvatar.civilStatus || masterAvatar.marital_status,
                    marital_status: masterAvatar.marital_status || masterAvatar.civilStatus,
                    devices: masterAvatar.devices
                };`;

const replacement = `                strategyJson.avatars[0] = {
                    ...strategyJson.avatars[0],
                    education: masterAvatar.education || masterAvatar.studies || strategyJson.avatars[0].education,
                    studies: masterAvatar.studies || masterAvatar.education || strategyJson.avatars[0].studies,
                    archetype: masterAvatar.archetype || masterAvatar.occupation || strategyJson.avatars[0].archetype,
                    occupation: masterAvatar.occupation || masterAvatar.archetype || strategyJson.avatars[0].occupation,
                    incomeRange: masterAvatar.incomeRange || masterAvatar.income || strategyJson.avatars[0].incomeRange || strategyJson.avatars[0].income,
                    income: masterAvatar.income || masterAvatar.incomeRange || strategyJson.avatars[0].income || strategyJson.avatars[0].incomeRange,
                    location: masterAvatar.location || masterAvatar.geographic || strategyJson.avatars[0].location || strategyJson.avatars[0].geographic,
                    geographic: masterAvatar.geographic || masterAvatar.location || strategyJson.avatars[0].geographic || strategyJson.avatars[0].location,
                    civilStatus: masterAvatar.civilStatus || masterAvatar.marital_status || strategyJson.avatars[0].civilStatus || strategyJson.avatars[0].marital_status || strategyJson.avatars[0].civil_status,
                    marital_status: masterAvatar.marital_status || masterAvatar.civilStatus || strategyJson.avatars[0].marital_status || strategyJson.avatars[0].civilStatus || strategyJson.avatars[0].civil_status,
                    civil_status: masterAvatar.civil_status || strategyJson.avatars[0].civil_status || masterAvatar.civilStatus || masterAvatar.marital_status,
                    devices: masterAvatar.devices || strategyJson.avatars[0].devices
                };`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Success");
} else {
    console.log("Target string not found");
}
