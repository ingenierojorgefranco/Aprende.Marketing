
const pool = require('./db');

/**
 * Helper para añadir columnas de forma segura en MySQL (idempotente)
 */
const addColumnSafe = async (connection, tableName, columnDef) => {
    try {
        await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnDef}`);
        console.log(`[DB] Columna añadida a ${tableName}: ${columnDef.split(' ')[0]}`);
    } catch (err) {
        // Ignorar errores de columna duplicada (ER_DUP_FIELDNAME)
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
        await connection.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            is_active BOOLEAN DEFAULT TRUE,
            public_subdomain VARCHAR(255) UNIQUE,
            plan_limits JSON NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login_at DATETIME,
            stripe_customer_id VARCHAR(255),
            subscription_id VARCHAR(255),
            subscription_status VARCHAR(50)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 2. DETECCIÓN DINÁMICA DEL TIPO DE ID DE USUARIO
        let userIdType = 'INT';
        try {
            const [cols] = await connection.query("SHOW COLUMNS FROM users LIKE 'id'");
            if (cols.length > 0) {
                const rawType = cols[0].Type.toLowerCase();
                const isBigInt = rawType.includes('bigint');
                const isUnsigned = rawType.includes('unsigned');
                userIdType = isBigInt ? 'BIGINT' : 'INT';
                if (isUnsigned) userIdType += ' UNSIGNED';
            }
        } catch (e) {
            console.warn("[DB Init] Error detectando tipo ID user:", e.message);
        }

        // --- TABLAS DEL SISTEMA DE CURSOS (LMS) ---
        await connection.query(`CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            badge_text VARCHAR(100) DEFAULT 'Certificado',
            description TEXT,
            slug VARCHAR(255) UNIQUE NOT NULL,
            thumbnail VARCHAR(500),
            order_index INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await connection.query(`CREATE TABLE IF NOT EXISTS course_modules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            order_index INT DEFAULT 0,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await connection.query(`CREATE TABLE IF NOT EXISTS course_lessons (
            id INT AUTO_INCREMENT PRIMARY KEY,
            module_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            duration VARCHAR(50),
            video_url VARCHAR(500),
            description TEXT,
            learning_points JSON,
            order_index INT DEFAULT 0,
            is_published BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // --- TABLAS DE PROYECTOS Y ESTRATEGIA ---
        await connection.query(`CREATE TABLE IF NOT EXISTS projects (
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
            strategy_json LONGTEXT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // MIGRACIÓN MANUAL PARA TABLAS EXISTENTES
        await addColumnSafe(connection, 'projects', "strategy_json LONGTEXT NULL");

        // --- TABLAS DE LANDING PAGES ---
        await connection.query(`CREATE TABLE IF NOT EXISTS landing_pages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            project_id INT NULL,
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
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // Reactivar checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✨ [DB Init] Base de datos sincronizada correctamente.');

    } catch (error) {
        console.error('❌ [DB Init] Error durante la inicialización:', error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = initDb;
