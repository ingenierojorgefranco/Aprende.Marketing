import { api } from "../api";

/**
 * Invoca al backend para generar un mensaje de WhatsApp basado en un momento específico
 * y el contexto del proyecto (Blueprints estratégicos).
 */
export const generateWhatsAppMessage = async (projectId: string, momentId: string): Promise<{ message: string; strategicPurpose: string }> => {
    const baseUrl = api.getBaseUrl();
    const token = localStorage.getItem('plataformadeventacom_token');
    
    const response = await fetch(`${baseUrl}/whatsapp-launch/launches/generate-message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ projectId, momentId })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al generar mensaje con IA");
    }
    return {
        message: data.message,
        strategicPurpose: data.strategicPurpose
    };
};

/**
 * Invoca al backend para generar la secuencia completa de 12 mensajes de WhatsApp
 */
export const generateFullWhatsAppSequence = async (projectId: string): Promise<{ messages: any[]; launchId: string }> => {
    const baseUrl = api.getBaseUrl();
    const token = localStorage.getItem('plataformadeventacom_token');
    
    const response = await fetch(`${baseUrl}/whatsapp-launch/launches/generate-full-sequence`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ projectId })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Error al generar secuencia completa");
    }
    return {
        messages: data.messages,
        launchId: data.launchId
    };
};
