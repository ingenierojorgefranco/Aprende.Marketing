
// Refactorización: Creación de servicio para estrategias de proyectos - 22/05/2024 14:30
import { callGeminiBackend, Type } from "./base";

export interface ProjectStrategyIdeas {
    targetAudience: string;
    painPoints: string[];
    keyBenefits: string[];
}

export const generateProjectStrategy = async (
    name: string,
    niche: string,
    productName: string,
    description: string
): Promise<ProjectStrategyIdeas> => {
    const prompt = `Actúa como un estratega de marketing digital experto.
    Tengo un nuevo proyecto con los siguientes datos:
    - Nombre del Proyecto: "${name}"
    - Nicho: "${niche}"
    - Producto/Servicio: "${productName}"
    - Descripción: "${description}"

    Necesito que generes una estrategia base en formato JSON.
    1. Define una "targetAudience" (Audiencia Objetivo/Avatar) detallada en 1 párrafo.
    2. Genera 5 "painPoints" (Puntos de Dolor) profundos y emocionales que tenga este avatar.
    3. Genera 5 "keyBenefits" (Beneficios Clave) persuasivos que resuelvan esos dolores.

    Responde SOLO en JSON válido.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            targetAudience: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyBenefits: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["targetAudience", "painPoints", "keyBenefits"]
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        if (response.text) {
            return JSON.parse(response.text) as ProjectStrategyIdeas;
        }
        return { targetAudience: '', painPoints: [], keyBenefits: [] };
    } catch (error) {
        console.error("Strategy Generation Error", error);
        throw new Error("Failed to generate strategy");
    }
};
