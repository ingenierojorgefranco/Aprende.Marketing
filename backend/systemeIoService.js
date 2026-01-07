
////////// Creación de servicio para integración con Systeme.io - 07/06/2025 19:30 //////////
const https = require('https');

/**
 * Registra un nuevo contacto en Systeme.io
 * @param {string} apiKey - API Key del usuario en Systeme.io
 * @param {string} email - Email del lead
 * @param {string} firstName - Nombre del lead
 */
const addContact = async (apiKey, email, firstName) => {
    ////////// Actualización: Se cambia 'name' por 'slug' para corregir error 422 de Systeme.io (This value should not be blank) - 07/06/2025 20:30 //////////
    const data = JSON.stringify({
        email: email,
        fields: [
            { slug: 'first_name', value: firstName }
        ]
    });
    ////////// Fin de actualización - 07/06/2025 20:30 //////////

    const options = {
        hostname: 'api.systeme.io',
        port: 443,
        path: '/api/contacts',
        method: 'POST',
        headers: {
            ////////// Actualización: Se corrige Content-Length a bytes y se añade charset=utf-8 para evitar error 400 Syntax error con tildes - 07/06/2025 20:45 //////////
            'Content-Type': 'application/json; charset=utf-8',
            'X-Api-Key': apiKey,
            'Content-Length': Buffer.byteLength(data)
            ////////// Fin de actualización - 07/06/2025 20:45 //////////
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(resBody));
                    } catch (e) {
                        resolve({ success: true, message: 'Contact processed' });
                    }
                } else {
                    reject(new Error(`Systeme.io Error: ${res.statusCode} - ${resBody}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

////////// Actualización: Funciones para obtener campañas y suscribir contactos a campañas - 15/06/2025 18:45 //////////
/**
 * Obtiene el listado de campañas de Systeme.io
 * @param {string} apiKey 
 */
const getCampaigns = async (apiKey) => {
    const options = {
        hostname: 'api.systeme.io',
        port: 443,
        path: '/api/campaigns',
        method: 'GET',
        headers: {
            ////////// Actualización: Se añade Accept y User-Agent para evitar error 404 (Symfony Routing) y se normaliza a X-API-Key - 15/06/2025 19:20 //////////
            'X-API-Key': apiKey,
            'Accept': 'application/json',
            'User-Agent': 'PlataformaDeVenta-App/2.9'
            ////////// Fin de actualización - 15/06/2025 19:20 //////////
        }
    };

    ////////// Actualización: Log de diagnóstico de petición saliente - 15/06/2025 19:20 //////////
    console.log(`[Systeme.io Outgoing Request]: GET https://${options.hostname}${options.path}`);
    ////////// Fin de actualización - 15/06/2025 19:20 //////////

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(resBody);
                        resolve(parsed.items || []);
                    } catch (e) {
                        resolve([]);
                    }
                } else {
                    ////////// Actualización: Captura del cuerpo de respuesta en error para diagnóstico de campañas - 15/06/2025 19:10 //////////
                    reject(new Error(`Systeme.io Campaigns Error: ${res.statusCode} - ${resBody}`));
                    ////////// Fin de actualización - 15/06/2025 19:10 //////////
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
};

/**
 * Suscribe un contacto a una campaña específica en Systeme.io
 * @param {string} apiKey 
 * @param {number} contactId 
 * @param {number} campaignId 
 */
const subscribeToCampaign = async (apiKey, contactId, campaignId) => {
    const data = JSON.stringify({ contactId });
    const options = {
        hostname: 'api.systeme.io',
        port: 443,
        path: `/api/campaigns/${campaignId}/subscriptions`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ////////// Actualización: Normalización de cabecera a X-API-Key - 15/06/2025 19:20 //////////
            'X-API-Key': apiKey,
            ////////// Fin de actualización - 15/06/2025 19:20 //////////
            'Content-Length': Buffer.byteLength(data)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true });
                } else {
                    reject(new Error(`Systeme.io Subscription Error: ${res.statusCode} - ${resBody}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

module.exports = { addContact, getCampaigns, subscribeToCampaign };
////////// Fin de actualización - 15/06/2025 18:45 //////////
