
// Refactorización: Implementación de carga dinámica bajo demanda (Lazy Loading) - 22/05/2024 15:45
// Objetivo: Centralizar la entrada pero cargar la lógica pesada de IA solo cuando se requiere por el usuario.

// 1. Exportaciones directas de utilidades base y constantes (bajo peso)
export { PREDEFINED_LOGOS, Type, callGeminiBackend } from "./geminiservices/base";

// 2. Re-exportación de interfaces de tipos para mantener compatibilidad con el resto de la app
export type { ProjectStrategyIdeas } from "./geminiservices/projectService";
export type { ArticleTitleIdea } from "./geminiservices/articleService";

/**
 * 3. Wrappers asíncronos con importación dinámica (Lazy Loading).
 * Cada función solo cargará su respectivo archivo .ts cuando sea invocada en tiempo de ejecución.
 */

export const generateProjectStrategy = async (...args: any[]) => {
    const { generateProjectStrategy: func } = await import("./geminiservices/projectService");
    return (func as any)(...args);
};

export const generateLandingPageContent = async (...args: any[]) => {
    const { generateLandingPageContent: func } = await import("./geminiservices/landingService");
    return (func as any)(...args);
};

export const generateArticleTitles = async (...args: any[]) => {
    const { generateArticleTitles: func } = await import("./geminiservices/articleService");
    return (func as any)(...args);
};

export const generateArticleOutline = async (...args: any[]) => {
    const { generateArticleOutline: func } = await import("./geminiservices/articleService");
    return (func as any)(...args);
};

export const generateFullArticle = async (...args: any[]) => {
    const { generateFullArticle: func } = await import("./geminiservices/articleService");
    return (func as any)(...args);
};

export const generateBotReply = async (...args: any[]) => {
    const { generateBotReply: func } = await import("./geminiservices/chatService");
    return (func as any)(...args);
};

export const generateFullEmailSequence = async (...args: any[]) => {
    const { generateFullEmailSequence: func } = await import("./geminiservices/emailService");
    return (func as any)(...args);
};
