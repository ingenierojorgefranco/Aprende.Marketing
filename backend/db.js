const mysql = require('mysql2/promise');

// Configuración de la conexión basada en variables de entorno
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000 // 5 segundos máximo para intentar conectar
};

if (process.env.INSTANCE_CONNECTION_NAME) {
    // Conexión vía Unix Socket para Google Cloud SQL
    dbConfig.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
    // Conexión TCP estándar para desarrollo local
    dbConfig.host = process.env.DB_HOST || 'localhost';
    dbConfig.port = process.env.DB_PORT || 3306;
}

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

// Verificar conexión inicial (opcional, solo para log)
pool.getConnection()
    .then(connection => {
        console.log(`✅ [DB] Conectado exitosamente a la base de datos (${process.env.INSTANCE_CONNECTION_NAME ? 'Cloud SQL' : 'TCP Local'})`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ [DB] Error fatal al conectar a la base de datos:', err.message);
        console.error('   -> El sistema funcionará en modo OFFLINE si el frontend no recibe respuesta.');
    });

module.exports = pool;