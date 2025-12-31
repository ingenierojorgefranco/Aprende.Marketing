const mysql = require('mysql2/promise');

// Configuración de la conexión basada en variables de entorno
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000 // Aumentado a 30 segundos para mayor estabilidad
};

// Detección de entorno
if (process.env.INSTANCE_CONNECTION_NAME) {
    // Conexión vía Unix Socket para Google Cloud SQL
    console.log(`[DB Config] Usando Cloud SQL Socket: /cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`);
    dbConfig.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
    // Conexión TCP estándar para desarrollo local
    console.log(`[DB Config] Usando TCP: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    dbConfig.host = process.env.DB_HOST || 'localhost';
    dbConfig.port = process.env.DB_PORT || 3306;
}

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

// Verificar conexión inicial para diagnóstico
pool.getConnection()
    .then(connection => {
        console.log(`✅ [DB] Conexión EXITOSA a la base de datos '${process.env.DB_NAME}'`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ [DB] ERROR FATAL DE CONEXIÓN:');
        console.error(`   Código: ${err.code}`);
        console.error(`   Mensaje: ${err.message}`);
        console.error(`   Host/Socket: ${dbConfig.socketPath || dbConfig.host}`);
        console.error(`   Usuario: ${dbConfig.user}`);
        console.error('   -> Verifica que las variables de entorno DB_USER, DB_PASSWORD y DB_NAME sean correctas en Cloud Run.');
    });

module.exports = pool;