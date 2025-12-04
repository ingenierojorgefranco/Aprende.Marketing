const pool = require('./db');

/**
 * Función dedicada para verificar y crear las tablas necesarias en la base de datos.
 * Se ejecuta al inicio del servidor.
 */
const initDb = async () => {
    console.log('[DB Init] 🛠️  Iniciando verificación de estructura de base de datos...');
    const connection = await pool.getConnection();
    
    try {
        // Desactivar checks de llaves foráneas temporalmente para permitir creación en cualquier orden si es necesario,
        // aunque el script está ordenado lógicamente.
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const tableCreationQueries = [
            // 1. Users
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                is_active BOOLEAN DEFAULT TRUE,
                public_subdomain VARCHAR(255) UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login_at DATETIME
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

            // 2. Landing Pages
            `CREATE TABLE IF NOT EXISTS landing_pages (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

            // 3. Daily Analytics
            `CREATE TABLE IF NOT EXISTS daily_analytics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                page_id INT NOT NULL,
                date DATE NOT NULL,
                visits INT DEFAULT 0,
                conversions INT DEFAULT 0,
                UNIQUE KEY unique_page_date (page_id, date),
                FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

            // 4. Projects (LA TABLA QUE FALTABA)
            `CREATE TABLE IF NOT EXISTS projects (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

            // 5. Articles
            `CREATE TABLE IF NOT EXISTS articles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255),
                description TEXT,
                content_html LONGTEXT,
                keyword VARCHAR(255),
                seo_score INT DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

            // 6. Leads
            `CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                page_id INT NOT NULL,
                name VARCHAR(255),
                email VARCHAR(255),
                captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                synced BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
        ];

        // Ejecutar cada consulta secuencialmente
        for (const query of tableCreationQueries) {
            await connection.query(query);
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ [DB Init] Estructura de tablas verificada correctamente.');
    } catch (error) {
        console.error('❌ [DB Init] Error CRÍTICO creando tablas:', error);
        throw error; // Relanzar para que el servidor no inicie si falla la BD
    } finally {
        connection.release();
    }
};

module.exports = initDb;