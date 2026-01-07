
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
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey,
            'Content-Length': data.length
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

module.exports = { addContact };
////////// Fin de actualización - 07/06/2025 19:30 //////////
