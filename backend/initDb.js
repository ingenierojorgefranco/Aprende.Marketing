const pool = require('./db');

/**
 * Helper para añadir columnas de forma segura en MySQL (idempotente)
 * Ignora el error 1060 (Duplicate column name)
 */
const addColumnSafe = async (connection, tableName, columnDef) => {
    try {
        await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnDef}`);
        console.log(`[DB] Columna añadida a ${tableName}: ${columnDef.split(' ')[0]}`);
    } catch (err) {
        // Error 1060: Duplicate column name
        if (err.code === 'ER_DUP_FIELDNAME' || err.errno === 1060) {
            // Ignorar, ya existe
        } else {
            console.warn(`[DB] Error no crítico añadiendo columna a ${tableName}:`, err.message);
        }
    }
};

/**
 * Helper para añadir Constraints de forma segura
 */
const addConstraintSafe = async (connection, tableName, constraintName, constraintDef) => {
    try {
        await connection.query(`ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} ${constraintDef}`);
        console.log(`[DB] Constraint ${constraintName} añadida a ${tableName}`);
    } catch (err) {
        // Ignorar si ya existe (código varía, solemos atrapar todos los no críticos)
        if (err.message.includes('Duplicate') || err.errno === 1061 || err.code === 'ER_DUP_KEY') {
             // Ignorar
        } else {
             console.warn(`[DB] Error no crítico añadiendo constraint ${constraintName}:`, err.message);
        }
    }
};

/**
 * Función dedicada para verificar y crear las tablas necesarias en la base de datos.
 * Se ejecuta automáticamente al iniciar el servidor.
 */
const initDb = async () => {
    console.log('[DB Init] 🛠️  Iniciando verificación de estructura de base de datos...');
    const connection = await pool.getConnection();
    
    try {
        // Desactivar checks de llaves foráneas temporalmente para evitar errores de orden
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const tables = [
            {
                name: 'users',
                query: `CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(50) DEFAULT 'user',
                    is_active BOOLEAN DEFAULT TRUE,
                    public_subdomain VARCHAR(255) UNIQUE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login_at DATETIME
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                name: 'projects',
                query: `CREATE TABLE IF NOT EXISTS projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
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
                    user_id INT NOT NULL,
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
                    user_id INT NOT NULL,
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

        for (const table of tables) {
            try {
                // Para 'articles', intentamos añadir columnas si ya existe la tabla pero es vieja
                if (table.name === 'articles') {
                    // Ver si existe
                    const [exists] = await connection.query(`SHOW TABLES LIKE 'articles'`);
                    if (exists.length > 0) {
                        // Tabla existe, intentamos añadir columnas una por una de forma segura
                        await addColumnSafe(connection, 'articles', "page_id INT NULL");
                        await addColumnSafe(connection, 'articles', "slug VARCHAR(255)");
                        await addColumnSafe(connection, 'articles', "featured_image VARCHAR(500)");
                        await addColumnSafe(connection, 'articles', "meta_title VARCHAR(255)");
                        await addColumnSafe(connection, 'articles', "meta_description TEXT");
                        await addColumnSafe(connection, 'articles', "status VARCHAR(50) DEFAULT 'published'");
                        await addColumnSafe(connection, 'articles', "published_at DATETIME DEFAULT CURRENT_TIMESTAMP");
                        
                        await addConstraintSafe(connection, 'articles', 'fk_articles_page', 'FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE SET NULL');
                        
                        console.log('✅ [DB Init] Tabla articles verificada y actualizada.');
                    } else {
                        // Tabla no existe, crearla normal
                        await connection.query(table.query);
                        console.log(`✅ [DB Init] Tabla creada: ${table.name}`);
                    }
                } else {
                    await connection.query(table.query);
                    console.log(`✅ [DB Init] Tabla verificada/creada: ${table.name}`);
                }
            } catch (err) {
                console.error(`❌ [DB Init] Error en tabla ${table.name}:`, err.message);
                // No relanzamos el error para permitir que siga con las otras tablas
            }
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✨ [DB Init] Inicialización completa. Base de datos lista.');

    } catch (error) {
        console.error('❌ [DB Init] Error CRÍTICO General:', error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = initDb;
