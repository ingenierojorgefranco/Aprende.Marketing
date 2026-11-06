
////////// Actualización: Implementación de verificación de firma HMAC SHA256 para Webhooks - 27/06/2025 11:45 //////////
import https from 'https';
import crypto from 'crypto';
import pool from './db.js';

/**
 * Verifica la autenticidad de la firma enviada por Systeme.io
 * @param {string} rawBody - El cuerpo crudo de la petición (string)
 * @param {string} signature - La firma recibida en el header X-Webhook-Signature
 * @param {string} secret - El secreto de webhook configurado en Systeme.io
 */
export const verifyWebhookSignature = (rawBody, signature, secret) => {
    if (!signature || !secret) return false;
    
    const hmac = crypto.createHmac('sha256', secret);
    const expectedSignature = hmac.update(rawBody).digest('hex');
    
    // Comparación segura contra ataques de tiempo
    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'utf8'),
            Buffer.from(expectedSignature, 'utf8')
        );
    } catch (e) {
        return false;
    }
};
////////// Fin de actualización - 27/06/2025 11:45 //////////

/**
 * Registra un nuevo contacto en Systeme.io
 * @param {string} apiKey - API Key del usuario en Systeme.io
 * @param {string} email - Email del lead
 * @param {string} firstName - Nombre del lead
 */
export const addContact = async (apiKey, email, firstName) => {
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
export const getTags = async (apiKey) => {
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

////////// Actualización: Nuevas funciones para búsqueda de contactos y creación de etiquetas alineadas con la documentación PHP - 27/06/2025 12:30 //////////

/**
 * Busca un contacto por su dirección de email
 * @param {string} apiKey 
 * @param {string} email 
 */
export const getContactByEmail = async (apiKey, email) => {
    const options = {
        hostname: 'api.systeme.io',
        port: 443,
        path: `/api/contacts?email=${encodeURIComponent(email)}`,
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey,
            'Accept': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(resBody);
                        // Systeme.io puede devolver items, data o un array directo
                        const items = parsed.items || parsed.data || (Array.isArray(parsed) ? parsed : []);
                        resolve(items.length > 0 ? items[0] : null);
                    } catch (e) {
                        resolve(null);
                    }
                } else {
                    reject(new Error(`Systeme.io Search Error: ${res.statusCode} - ${resBody}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
};

/**
 * Crea una nueva etiqueta (Tag) en Systeme.io
 * @param {string} apiKey 
 * @param {string} tagName 
 */
export const createTag = async (apiKey, tagName) => {
    const data = JSON.stringify({ name: tagName });
    const options = {
        hostname: 'api.systeme.io',
        port: 443,
        path: '/api/tags',
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
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
                        reject(new Error("Invalid response from Systeme.io when creating tag"));
                    }
                } else {
                    reject(new Error(`Systeme.io Create Tag Error: ${res.statusCode} - ${resBody}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

////////// Actualización: Corrección de endpoint para asignación de etiquetas según documentación técnica (POST contacts/{id}/tags) - 27/06/2025 12:30 //////////
/**
 * Asigna una etiqueta a un contacto específico en Systeme.io
 * @param {string} apiKey 
 * @param {number|string} contactId 
 * @param {number|string} tagId 
 */
export const addTagToContact = async (apiKey, contactId, tagId) => {
    const cleanContactId = Number(contactId);
    const cleanTagId = Number(tagId);

    if (isNaN(cleanContactId) || cleanContactId <= 0 || isNaN(cleanTagId) || cleanTagId <= 0) {
        console.error(`[Systeme.io Validation Error] IDs inválidos - Contact: ${contactId}, Tag: ${tagId}`);
        throw new Error("El ID de contacto o de etiqueta no son válidos para la operación.");
    }

    console.log(`[Systeme.io Debug] Inicia vinculación corregida. Contact: ${cleanContactId}, Tag: ${cleanTagId}`);

    const data = JSON.stringify({ tagId: cleanTagId });
    const options = {
        hostname: 'api.systeme.io',
        port: 443,
        path: `/api/contacts/${cleanContactId}/tags`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Api-Key': apiKey,
            'Content-Length': Buffer.byteLength(data)
        }
    };

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
        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

/**
 * Sincroniza un usuario con la cuenta global de Systeme.io asignándole la etiqueta por defecto
 * (Usado unificadamente tanto para registro automático como para sincronización manual desde el admin)
 * @param {number|string} userId 
 * @param {string} email 
 * @param {string} name 
 */
export const syncUserToGlobalSystemeIo = async (userId, email, name) => {
    try {
        const [settingsRows] = await pool.query(
            "SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('global_systemeio_key', 'global_systemeio_default_tag_id', 'global_systemeio_enabled')"
        );
        const sysMap = {};
        settingsRows.forEach(r => sysMap[r.setting_key] = r.setting_value);

        const globalKey = sysMap.global_systemeio_key;
        const defaultTagId = sysMap.global_systemeio_default_tag_id;
        const isEnabled = sysMap.global_systemeio_enabled !== 'false';

        if (!globalKey || !defaultTagId) {
            console.log(`[Systeme.io Global Sync] Omitido: API Key o Default Tag ID no configurados.`);
            return { success: false, error: 'API Key o Tag ID no configurados' };
        }

        if (!isEnabled) {
            console.log(`[Systeme.io Global Sync] Omitido: Integración desactivada en configuración.`);
            return { success: false, error: 'Sincronización global desactivada' };
        }

        console.log(`[Systeme.io Global Sync] Procesando usuario ID ${userId} (${email})...`);

        let contactId = null;

        // 1. Intentar crear el contacto directamente
        try {
            const contactRes = await addContact(globalKey, email, name || 'Usuario');
            contactId = contactRes?.contact?.id || contactRes?.contact?.contact?.id || contactRes?.id;
        } catch (addErr) {
            console.warn(`[Systeme.io Global Sync] Aviso al crear contacto (${email}): ${addErr.message}`);
        }

        // 2. Si no se obtuvo ID directamente (ej: contacto ya existía en Systeme.io), buscar por email
        if (!contactId) {
            try {
                const existingContact = await getContactByEmail(globalKey, email);
                if (existingContact && existingContact.id) {
                    contactId = existingContact.id;
                }
            } catch (searchErr) {
                console.error(`[Systeme.io Global Sync] Error buscando contacto (${email}): ${searchErr.message}`);
            }
        }

        // 3. Asignar etiqueta si tenemos el contactId y marcar usuario como registrado
        if (contactId) {
            await addTagToContact(globalKey, contactId, defaultTagId);
            await pool.query('UPDATE users SET systemio_registrado = 1 WHERE id = ?', [userId]);
            console.log(`✅ [Systeme.io Global Sync] Usuario ${email} (ID ${userId}) etiquetado exitosamente con Tag ${defaultTagId}`);
            return { success: true, contactId };
        } else {
            console.error(`❌ [Systeme.io Global Sync] No se pudo obtener ID de contacto en Systeme.io para ${email}`);
            return { success: false, error: 'No se pudo obtener ID de contacto en Systeme.io' };
        }
    } catch (err) {
        console.error(`❌ [Systeme.io Global Sync Error] User ID ${userId} (${email}):`, err.message);
        return { success: false, error: err.message };
    }
};
