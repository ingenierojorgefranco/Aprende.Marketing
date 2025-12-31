
// Refactorización: Creación de lógica base para servicios de Gemini - 22/05/2024 14:30
import { api } from "../api";

export const PREDEFINED_LOGOS = [
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" /><stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" /></linearGradient></defs><rect x="12" y="12" width="40" height="40" rx="8" fill="url(#g1)"/><path d="M22 32h20M32 22v20" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#ec4899" opacity="0.2"/><circle cx="32" cy="32" r="20" fill="#ec4899"/><path d="M25 32l5 5 10-10" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4L10 16v32l22 12 22-12V16L32 4z" fill="#3b82f6"/><path d="M32 12l14 8v16l-14 8-14-8V20l14-8z" fill="white" opacity="0.3"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" /><stop offset="100%" style="stop-color:#ef4444;stop-opacity:1" /></linearGradient></defs><path d="M32 8l24 40H8L32 8z" fill="url(#g2)"/><circle cx="32" cy="35" r="5" fill="white"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="20" height="20" rx="4" fill="#8b5cf6"/><rect x="34" y="10" width="20" height="20" rx="4" fill="#6366f1" opacity="0.7"/><rect x="10" y="34" width="20" height="20" rx="4" fill="#3b82f6" opacity="0.5"/><rect x="34" y="34" width="20" height="20" rx="4" fill="#06b6d4" opacity="0.3"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 2C15.4 2 2 15.4 2 32s13.4 30 30 30 30-13.4 30-30S48.6 2 32 2zm0 54c-13.3 0-24-10.7-24-24S18.7 8 32 8s24 10.7 24 24-10.7 24-24 24z" fill="#10b981"/><path d="M32 16v32M16 32h32" stroke="#10b981" stroke-width="4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4s-18 12-18 28 18 28 18 28 18-12 18-28S32 4 32 4z" fill="#6366f1"/><circle cx="32" cy="28" r="8" fill="white" opacity="0.3"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M48 16L16 48M16 16l32 32" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/><circle cx="32" cy="32" r="10" fill="white" stroke="#ef4444" stroke-width="2"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 2L2 32l30 30 30-30L32 2z" fill="#f97316"/><path d="M32 15l17 17-17 17-17-17 17-17z" fill="white" opacity="0.4"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="40" height="40" rx="20" fill="none" stroke="#06b6d4" stroke-width="4"/><path d="M32 20v24M20 32h24" stroke="#06b6d4" stroke-width="4" stroke-linecap="round"/></svg>`
];

export const Type = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT'
};

export const callGeminiBackend = async (prompt: string, responseSchema?: any) => {
    try {
        const baseUrl = api.getBaseUrl();
        const response = await fetch(`${baseUrl}/gemini`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    responseMimeType: responseSchema ? "application/json" : "text/plain",
                    responseSchema: responseSchema
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Backend Error: ${response.statusText}`);
        }

        const data = await response.json();
        return { text: data.text };

    } catch (error) {
        console.error("Gemini Backend Call Failed:", error);
        throw error;
    }
};
