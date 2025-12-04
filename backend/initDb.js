const pool = require('./db');

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
                    // Check if exists
                    const [exists] = await connection.query(`SHOW TABLES LIKE 'articles'`);
                    if (exists.length > 0) {
                        try {
                            await connection.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS page_id INT NULL`);
                            await connection.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug VARCHAR(255)`);
                            await connection.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image VARCHAR(500)`);
                            await connection.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255)`);
                            await connection.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description TEXT`);
                            await connection.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published'`);
                            await connection.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
                            // Intentar añadir FK si no existe (esto puede fallar si ya existe, ignoramos error)
                            try {
                                await connection.query(`ALTER TABLE articles ADD CONSTRAINT fk_articles_page FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE SET NULL`);
                            } catch (e) {}
                            console.log('✅ [DB Init] Tabla articles actualizada con nuevas columnas.');
                        } catch (e) {
                            console.log('⚠️ [DB Init] No se pudieron añadir columnas a articles (quizás ya existen).');
                        }
                    } else {
                        await connection.query(table.query);
                        console.log(`✅ [DB Init] Tabla creada: ${table.name}`);
                    }
                } else {
                    await connection.query(table.query);
                    console.log(`✅ [DB Init] Tabla verificada/creada: ${table.name}`);
                }
            } catch (err) {
                console.error(`❌ [DB Init] Error en tabla ${table.name}:`, err.message);
                throw err;
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