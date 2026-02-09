
import { api } from "../api";

/**
 * Invoca al backend para generar un mensaje de WhatsApp basado en un momento específico
 * y el contexto del proyecto (Blueprints estratégicos).
 */
export const generateWhatsAppMessage = async (projectId: string, momentId: string): Promise<string> => {
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
    return data.text;
};
