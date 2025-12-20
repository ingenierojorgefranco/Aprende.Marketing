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
        // 3. Courses
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

        // 4. Course Modules
        await connection.query(`CREATE TABLE IF NOT EXISTS course_modules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            order_index INT DEFAULT 0,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 5. Course Lessons
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

        // 6. Lesson Comments
        await connection.query(`CREATE TABLE IF NOT EXISTS lesson_comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            lesson_id INT NOT NULL,
            user_id ${userIdType} NOT NULL,
            parent_id INT NULL,
            content TEXT NOT NULL,
            likes INT DEFAULT 0,
            is_approved BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES lesson_comments(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 7. PLANS TABLE
        await connection.query(`CREATE TABLE IF NOT EXISTS plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            slug VARCHAR(50) UNIQUE NOT NULL,
            description TEXT,
            price_monthly DECIMAL(10, 2) DEFAULT 0,
            currency VARCHAR(10) DEFAULT 'EUR',
            stripe_price_id VARCHAR(255),
            hotmart_url TEXT,
            hotmart_id VARCHAR(255),
            limits_config JSON,
            ui_features JSON,
            is_active BOOLEAN DEFAULT TRUE,
            is_recommended BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 8. SYSTEM SETTINGS TABLE
        await connection.query(`CREATE TABLE IF NOT EXISTS system_settings (
            setting_key VARCHAR(50) PRIMARY KEY,
            setting_value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 9. USAGE LOGS TABLE
        await connection.query(`CREATE TABLE IF NOT EXISTS usage_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            resource_type VARCHAR(50) NOT NULL, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 10. SYSTEM ACTIVITY LOGS
        await connection.query(`CREATE TABLE IF NOT EXISTS system_activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NULL, 
            user_name VARCHAR(255), 
            action_type VARCHAR(50) NOT NULL, 
            entity_type VARCHAR(50), 
            entity_id VARCHAR(255),
            details TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 11. USER PAYMENTS TABLE
        await connection.query(`CREATE TABLE IF NOT EXISTS user_payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            stripe_id VARCHAR(255),
            amount DECIMAL(10, 2),
            currency VARCHAR(10),
            status VARCHAR(50),
            payment_method VARCHAR(50),
            receipt_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 12. CRM TABLES
        await connection.query(`CREATE TABLE IF NOT EXISTS crm_contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL, 
            page_id INT NULL, 
            name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(50),
            country VARCHAR(100),
            address TEXT,
            source VARCHAR(255), 
            status VARCHAR(50) DEFAULT 'new', 
            interest_level VARCHAR(50) DEFAULT 'cold', 
            last_contacted_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await connection.query(`CREATE TABLE IF NOT EXISTS crm_activities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contact_id INT NOT NULL,
            type VARCHAR(50), 
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES crm_contacts(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // Migraciones adicionales
        await addColumnSafe(connection, 'plans', "hotmart_url TEXT");
        await addColumnSafe(connection, 'plans', "hotmart_id VARCHAR(255)");
        await addColumnSafe(connection, 'users', "role VARCHAR(50) DEFAULT 'user'");
        await addColumnSafe(connection, 'users', "plan_limits JSON NULL");
        await addColumnSafe(connection, 'users', "avatar_url VARCHAR(500)");
        await addColumnSafe(connection, 'users', "birth_date DATE");
        await addColumnSafe(connection, 'users', "custom_redirect_url VARCHAR(500)");
        await addColumnSafe(connection, 'users', "stripe_customer_id VARCHAR(255)");
        await addColumnSafe(connection, 'users', "subscription_id VARCHAR(255)");
        await addColumnSafe(connection, 'users', "subscription_status VARCHAR(50)");
        await addColumnSafe(connection, 'plans', "stripe_price_id VARCHAR(255)");
        await addColumnSafe(connection, 'landing_pages', "thankyoupage_json JSON");
        await addColumnSafe(connection, 'landing_pages', "project_id INT NULL");

        // --- SEED SYSTEM SETTINGS ---
        await connection.query(`INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES ('after_login_url', '/dashboard/training/bienvenida')`);
        await connection.query(`INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES ('payment_provider', 'stripe')`);

        // Reactivar checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✨ [DB Init] Base de datos sincronizada y migrada.');

    } catch (error) {
        console.error('❌ [DB Init] Error durante la inicialización:', error);
    } finally {
        connection.release();
    }
};

module.exports = initDb;
