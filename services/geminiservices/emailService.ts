
import { callGeminiBackend, Type } from "./base";

export interface GeneratedEmail {
    dayIndex: number;
    subject: string;
    contentHtml: string;
    pilarType: string;
    purpose: string;
}

export const generateFullEmailSequence = async (
    projectName: string,
    productName: string,
    description: string,
    targetAudience: string,
    painPoints: string[],
    keyBenefits: string[],
    sequenceStructure: any[]
): Promise<GeneratedEmail[]> => {
    const prompt = `Actúa como un experto en Email Marketing y Copywriting persuasivo.
    Tu objetivo es redactar una secuencia COMPLETA de 7 correos electrónicos para un embudo de ventas.
    
    DATOS DEL PROYECTO:
    - Proyecto: "${projectName}"
    - Producto: "${productName}"
    - Descripción: "${description}"
    - Audiencia Objetivo: "${targetAudience}"
    - Puntos de Dolor: ${painPoints.join(", ")}
    - Beneficios Clave: ${keyBenefits.join(", ")}

    ESTRUCTURA DE LA SECUENCIA (7 DÍAS):
    ${sequenceStructure.map((s, i) => `Día ${i + 1}: ${s.subject} (${s.type}) - Objetivo: ${s.objective}`).join("\n")}

    REQUISITOS DE REDACCIÓN:
    1. Mantén una narrativa coherente a lo largo de los 7 días.
    2. Usa un tono cercano, profesional y altamente persuasivo.
    3. Cada correo debe tener un "Asunto" (Subject) llamativo y un "Cuerpo" (Content) en formato HTML (usa etiquetas <p>, <br>, <strong>, <ul>, <li>).
    4. Incluye un llamado a la acción (CTA) claro en cada correo. Usa el placeholder [LINK_DESTINO] para los enlaces.
    5. No uses placeholders genéricos como [Nombre], asume que el sistema los reemplazará, pero puedes usar {name} si lo deseas.
    6. Asegúrate de que el contenido sea extenso y de alto valor (mínimo 200 palabras por correo).

    Responde ÚNICAMENTE en formato JSON con un array de 7 objetos, cada uno con:
    - dayIndex: (0 a 6)
    - subject: (string)
    - contentHtml: (string con el HTML del cuerpo)
    - pilarType: (string con el tipo de correo)
    - purpose: (string con el objetivo del correo)

    JSON SCHEMA:
    {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "dayIndex": { "type": "number" },
          "subject": { "type": "string" },
          "contentHtml": { "type": "string" },
          "pilarType": { "type": "string" },
          "purpose": { "type": "string" }
        },
        "required": ["dayIndex", "subject", "contentHtml", "pilarType", "purpose"]
      }
    }`;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                dayIndex: { type: Type.NUMBER },
                subject: { type: Type.STRING },
                contentHtml: { type: Type.STRING },
                pilarType: { type: Type.STRING },
                purpose: { type: Type.STRING }
            },
            required: ["dayIndex", "subject", "contentHtml", "pilarType", "purpose"]
        }
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        if (response.text) {
            return JSON.parse(response.text) as GeneratedEmail[];
        }
        throw new Error("No content generated");
    } catch (error) {
        console.error("Full Email Sequence Generation Error", error);
        throw new Error("Failed to generate full email sequence");
    }
};
