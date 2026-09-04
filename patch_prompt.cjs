const fs = require('fs');
const file = 'backend/geminiService.js';
let content = fs.readFileSync(file, 'utf8');

const t = `REGLA CRÍTICA DE CANTIDAD (OBLIGATORIA): El array de soluciones ("solutions") de la sección "psychology" debe tener EXACTAMENTE 9 objetos (ni uno más, ni uno menos: 3 objetos para avatarId 1, 3 objetos para avatarId 2, y 3 objetos para avatarId 3).
        
        Está TERMINANTEMENTE PROHIBIDO resumir, truncar o enviar un número menor de dolores o soluciones. El orden debe ser estrictamente secuencial y correlacionado con el avatar correspondiente. No dejes campos con puntos suspensivos ("..."), genera contenido real de alto impacto persuasivo para cada uno.`;

const r = `REGLA CRÍTICA DE CANTIDAD (OBLIGATORIA): El array de soluciones ("solutions") de la sección "psychology" debe tener EXACTAMENTE 9 objetos (ni uno más, ni uno menos: 3 objetos para avatarId 1, 3 objetos para avatarId 2, y 3 objetos para avatarId 3).
        REGLA CRÍTICA DE CANTIDAD PARA AVATARES (OBLIGATORIA): Para CADA avatar, los campos "hidden_pains" (miedos), "hidden_desires" (anhelos) y "behaviors_list" (comportamientos) DEBEN contener EXACTAMENTE 6 elementos cada uno. NO abrevies, NO uses "...", y NO devuelvas menos de 6. Genera contenido real, diferente y detallado para los 6 ítems de cada categoría.
        
        Está TERMINANTEMENTE PROHIBIDO resumir, truncar o enviar un número menor de dolores o soluciones. El orden debe ser estrictamente secuencial y correlacionado con el avatar correspondiente. No dejes campos con puntos suspensivos ("..."), genera contenido real de alto impacto persuasivo para cada uno.`;

content = content.replace(t, r);
fs.writeFileSync(file, content, 'utf8');
