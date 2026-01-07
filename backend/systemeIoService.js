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

////////// Actualización: Reemplazo de campañas por etiquetas (Tags) para vinculación de contactos - 17/06/2025 11:30 //////////
/**
 * Obtiene el listado de etiquetas (Tags) de Systeme.io
 * @param {string} apiKey 
 */
const getTags = async (apiKey) => {
    const options = {
        hostname: 'api.systeme.io',
        port: 443,
        path: '/api/tags',
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    console.log(`[Systeme.io Debug] Requesting Tags: GET https://${options.hostname}${options.path}`);

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
                    reject(new Error(`Systeme.io Tags Error: ${res.statusCode} - ${resBody}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
};

////////// Actualización: Asegurar tipos numéricos y logs de depuración para asignación de etiquetas - 17/06/2025 14:30 //////////
/**
 * Asigna una etiqueta a un contacto específico en Systeme.io
 * @param {string} apiKey 
 * @param {number|string} contactId 
 * @param {number|string} tagId 
 */
const addTagToContact = async (apiKey, contactId, tagId) => {
    ////////// Actualización: Validación estricta de IDs numéricos mayores a cero para evitar peticiones 404 a la API de etiquetas - 25/06/2025 11:30 //////////
    const cleanContactId = Number(contactId);
    const cleanTagId = Number(tagId);

    if (isNaN(cleanContactId) || cleanContactId <= 0 || isNaN(cleanTagId) || cleanTagId <= 0) {
        console.error(`[Systeme.io Validation Error] IDs inválidos o insuficientes - Contact: ${contactId}, Tag: ${tagId}`);
        throw new Error("El ID de contacto o de etiqueta no son válidos o son inexistentes para la operación en Systeme.io.");
    }
    ////////// Fin de actualización - 25/06/2025 11:30 //////////

    ////////// Actualización: Auditoría detallada de la URL y los IDs antes del envío para depuración de errores 404 - 25/06/2025 15:50 //////////
    console.log(`[Systeme.io AUDIT] URL Destino: https://api.systeme.io/api/tags/${cleanTagId}/contacts`);
    console.log(`[Systeme.io AUDIT] Payload Contact ID: ${cleanContactId}`);
    ////////// Fin de actualización - 25/06/2025 15:50 //////////

    console.log(`[Systeme.io Debug] Inicia addTagToContact. Contact: ${cleanContactId}, Tag: ${cleanTagId}`);

    const data = JSON.stringify({ contactId: cleanContactId });
    const options = {
        hostname: 'api.systeme.io',
        port: 443,
        path: `/api/tags/${cleanTagId}/contacts`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Api-Key': apiKey,
            'Content-Length': Buffer.byteLength(data)
        }
    };

    console.log(`[Systeme.io Debug] Requesting Tag Add: POST https://${options.hostname}${options.path}`);

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => {
                console.log(`[Systeme.io Debug] Response Status: ${res.statusCode}. Body: ${resBody}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true });
                } else {
                    reject(new Error(`Systeme.io Tag Assignment Error: ${res.statusCode} - ${resBody}`));
                }
            });
        });
        req.on('error', (e) => {
            console.error(`[Systeme.io Debug] Request Error:`, e.message);
            reject(e);
        });
        req.write(data);
        req.end();
    });
};
////////// Fin de actualización - 17/06/2025 14:30 //////////

module.exports = { addContact, getTags, addTagToContact };