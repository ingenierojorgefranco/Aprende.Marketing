
// Centralización de esquemas para Gemini - 01/01/2026 14:10
import { Type } from "./base";

export const LANDING_PAGE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
    brandName: { type: Type.STRING },
    topTagline: { type: Type.STRING },
    navCta: { type: Type.STRING },
    navLinks: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                label: { type: Type.STRING },
                href: { type: Type.STRING }
            }
        }
    },
    testimonialTitle: { type: Type.STRING },
    hero: {
        type: Type.OBJECT,
        properties: {
        headline: { type: Type.STRING },
        subheadline: { type: Type.STRING },
        ctaText: { type: Type.STRING },
        },
        required: ["headline", "subheadline", "ctaText"],
    },
    testimonials: {
        type: Type.ARRAY,
        items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            text: { type: Type.STRING },
            rating: { type: Type.NUMBER },
        },
        },
    },
    intro: {
        type: Type.OBJECT,
        properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                }
            }
        }
        },
        required: ["title", "description"],
    },
    benefits: {
        type: Type.OBJECT,
        properties: {
        title: { type: Type.STRING },
        items: {
            type: Type.ARRAY,
            items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
            },
            },
        },
        },
    },
    whatYouWillLearn: {
        type: Type.OBJECT,
        properties: {
        title: { type: Type.STRING },
        items: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        },
    },
    faq: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
            }
        }
    },
    instructor: {
        type: Type.OBJECT,
        properties: {
        name: { type: Type.STRING },
        bio: { type: Type.STRING },
        },
    },
    footer: {
        type: Type.OBJECT,
        properties: {
        copyright: { type: Type.STRING },
        contact: { type: Type.STRING },
        },
    },
    thankYouMessage: { type: Type.STRING },
    redirectUrl: { type: Type.STRING },
    },
    required: ["hero", "testimonials", "intro", "benefits", "whatYouWillLearn", "instructor", "footer", "thankYouMessage", "redirectUrl"],
};
