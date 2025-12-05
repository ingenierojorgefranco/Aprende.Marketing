const pool = require('./db');

/**
 * Helper para añadir columnas de forma segura en MySQL (idempotente)
 */
const addColumnSafe = async (connection, tableName, columnDef) => {
    try {
        await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnDef}`);
        console.log(`[DB] Columna añadida a ${tableName}: ${columnDef.split(' ')[0]}`);
    } catch (err) {
        // Ignorar errores de columna duplicada
        if (err.code !== 'ER_DUP_FIELDNAME' && err.errno !== 1060) {
            console.warn(`[DB] Nota sobre ${tableName}: ${err.message}`);
        }
    }
};

/**
 * Función principal de inicialización
 */
const initDb = async () => {
    console.log('[DB Init] 🛠️  Iniciando verificación y migración de base de datos...');
    const connection = await pool.getConnection();
    
    try {
        // Desactivar checks de FK para evitar errores de orden durante creación
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // 1. TABLA USERS (Principal)
        // Usamos INT por defecto, pero si ya existe no se modificará.
        await connection.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            is_active BOOLEAN DEFAULT TRUE,
            public_subdomain VARCHAR(255) UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login_at DATETIME
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 2. DETECCIÓN DINÁMICA DEL TIPO DE ID DE USUARIO
        // Esto soluciona el error 3780 si users.id es INT UNSIGNED o BIGINT
        let userIdType = 'INT';
        try {
            const [cols] = await connection.query("SHOW COLUMNS FROM users LIKE 'id'");
            if (cols.length > 0) {
                const rawType = cols[0].Type.toLowerCase(); // Ej: "int(10) unsigned" o "bigint(20)"
                
                // Construcción canónica del tipo para evitar errores de sintaxis o incompatibilidad
                const isBigInt = rawType.includes('bigint');
                const isUnsigned = rawType.includes('unsigned');
                
                userIdType = isBigInt ? 'BIGINT' : 'INT';
                if (isUnsigned) {
                    userIdType += ' UNSIGNED';
                }

                console.log(`[DB Init] Detectado tipo de ID de usuario: ${userIdType} (Raw: ${rawType})`);
            }
        } catch (e) {
            console.warn("[DB Init] No se pudo detectar tipo de ID, usando por defecto: INT. Error:", e.message);
        }

        // Definimos las tablas dependientes usando el tipo detectado
        const tables = [
            {
                name: 'projects',
                query: `CREATE TABLE IF NOT EXISTS projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id ${userIdType} NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    niche VARCHAR(255),
                    description TEXT,
                    target_audience TEXT,
                    brand_tone VARCHAR(100),
                    product_name VARCHAR(255),
                    main_goal VARCHAR(255),
                    pain_points LONGTEXT,
                    key_benefits LONGTEXT,
                    affiliate_links LONGTEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                name: 'landing_pages',
                query: `CREATE TABLE IF NOT EXISTS landing_pages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id ${userIdType} NOT NULL,
                    name VARCHAR(255),
                    niche VARCHAR(255),
                    goal VARCHAR(255),
                    subdomain VARCHAR(255),
                    custom_domain VARCHAR(255),
                    content LONGTEXT,
                    is_published BOOLEAN DEFAULT FALSE,
                    visits INT DEFAULT 0,
                    conversions INT DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                name: 'articles',
                query: `CREATE TABLE IF NOT EXISTS articles (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id ${userIdType} NOT NULL,
                    page_id INT NULL,
                    title VARCHAR(255),
                    slug VARCHAR(255),
                    description TEXT,
                    content_html LONGTEXT,
                    featured_image VARCHAR(500),
                    keyword VARCHAR(255),
                    seo_score INT DEFAULT 0,
                    meta_title VARCHAR(255),
                    meta_description TEXT,
                    status VARCHAR(50) DEFAULT 'published',
                    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                name: 'leads',
                query: `CREATE TABLE IF NOT EXISTS leads (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    page_id INT NOT NULL,
                    name VARCHAR(255),
                    email VARCHAR(255),
                    captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    synced BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                name: 'daily_analytics',
                query: `CREATE TABLE IF NOT EXISTS daily_analytics (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    page_id INT NOT NULL,
                    date DATE NOT NULL,
                    visits INT DEFAULT 0,
                    conversions INT DEFAULT 0,
                    UNIQUE KEY unique_page_date (page_id, date),
                    FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            }
        ];

        // Ejecutar creación de tablas
        for (const table of tables) {
            try {
                await connection.query(table.query);
                console.log(`✅ [DB Init] Tabla verificada: ${table.name}`);
            } catch (err) {
                console.error(`❌ [DB Init] Falló creación de tabla ${table.name}:`, err.message);
                throw err; // Re-lanzar para que el catch principal lo registre
            }
        }

        // MIGRACIONES DE COLUMNAS (Para tablas existentes)
        await addColumnSafe(connection, 'articles', "slug VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "featured_image VARCHAR(500)");
        await addColumnSafe(connection, 'articles', "meta_title VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "meta_description TEXT");
        await addColumnSafe(connection, 'articles', "status VARCHAR(50) DEFAULT 'published'");
        await addColumnSafe(connection, 'articles', "published_at DATETIME DEFAULT CURRENT_TIMESTAMP");
        // Migración crítica solicitada: Agregar page_id si falta
        await addColumnSafe(connection, 'articles', "page_id INT NULL");
        // Asegurar que content_html exista (algunas versiones previas usaban 'content')
        await addColumnSafe(connection, 'articles', "content_html LONGTEXT");
        
        // Reactivar checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✨ [DB Init] Base de datos sincronizada correctamente.');

    } catch (error) {
        console.error('❌ [DB Init] Error durante la inicialización:', error);
    } finally {
        connection.release();
    }
};

module.exports = initDb;