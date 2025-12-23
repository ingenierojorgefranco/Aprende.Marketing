import { ProjectMasterStrategy } from "../types";

// Espejo del enum de Gemini para uso en frontend/backend
export const SchemaType = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT'
};

/**
 * STRATEGY_SCHEMA
 * Este es el "Plano Maestro" que se le entrega a Gemini.
 * Define exactamente cómo debe responder la IA para que el sistema sea estable.
 */
export const STRATEGY_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    meta: {
      type: SchemaType.OBJECT,
      properties: {
        projectName: { type: SchemaType.STRING },
        niche: { type: SchemaType.STRING },
        productType: { type: SchemaType.STRING },
        objective: { type: SchemaType.STRING },
        insights: {
          type: SchemaType.OBJECT,
          properties: {
            overview: {
               type: SchemaType.OBJECT,
               properties: {
                 title: { type: SchemaType.STRING },
                 items: {
                   type: SchemaType.ARRAY,
                   items: {
                     type: SchemaType.OBJECT,
                     properties: {
                        label: { type: SchemaType.STRING },
                        value: { type: SchemaType.STRING },
                        icon: { type: SchemaType.STRING, description: "Icon name from Lucide (e.g. Users, Zap, Target)" },
                        color: { type: SchemaType.STRING },
                        bg: { type: SchemaType.STRING },
                        border: { type: SchemaType.STRING }
                     }
                   }
                 }
               }
            },
            niche: {
               type: SchemaType.OBJECT,
               properties: { title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING } }
            },
            product: {
               type: SchemaType.OBJECT,
               properties: { title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING } }
            },
            objective: {
               type: SchemaType.OBJECT,
               properties: { title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING } }
            }
          }
        }
      }
    },
    avatars: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.NUMBER },
          name: { type: SchemaType.STRING },
          archetype: { type: SchemaType.STRING },
          age: { type: SchemaType.STRING },
          quote: { type: SchemaType.STRING },
          pain: { type: SchemaType.STRING },
          desire: { type: SchemaType.STRING },
          objection: { type: SchemaType.STRING },
          motivations: {
            type: SchemaType.OBJECT,
            properties: {
              dinero: { type: SchemaType.NUMBER },
              tiempo: { type: SchemaType.NUMBER },
              estatus: { type: SchemaType.NUMBER },
              seguridad: { type: SchemaType.NUMBER }
            }
          }
        }
      }
    },
    psychology: {
      type: SchemaType.OBJECT,
      properties: {
        pains: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        solutions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        powerWords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
      }
    },
    modules: {
      type: SchemaType.OBJECT,
      properties: {
        web: {
          type: SchemaType.OBJECT,
          properties: {
            landingPageTabs: { type: SchemaType.OBJECT },
            thankYouPageTabs: { type: SchemaType.OBJECT }
          }
        },
        content: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.NUMBER },
              title: { type: SchemaType.STRING },
              traffic: { type: SchemaType.NUMBER },
              difficulty: { type: SchemaType.NUMBER },
              keyword: { type: SchemaType.STRING },
              objective: { type: SchemaType.STRING },
              strategy: { type: SchemaType.STRING }
            }
          }
        },
        emails: {
          type: SchemaType.OBJECT,
          properties: {
            nurture: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT } },
            evergreen: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT } }
          }
        },
        whatsapp: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.OBJECT }
        }
      }
    }
  }
};
