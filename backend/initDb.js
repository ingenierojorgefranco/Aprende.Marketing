
import pool from './db.js';

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
 * Helper para eliminar columnas de forma segura en MySQL (idempotente)
 */
const dropColumnSafe = async (connection, tableName, columnName) => {
    try {
        await connection.query(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
        console.log(`[DB] Columna eliminada de ${tableName}: ${columnName}`);
    } catch (err) {
        // Ignorar si la columna no existe (ER_CANT_DROP_FIELD_OR_KEY)
        if (err.code !== 'ER_CANT_DROP_FIELD_OR_KEY' && err.errno !== 1091) {
            console.warn(`[DB] Nota al eliminar columna ${columnName} en ${tableName}: ${err.message}`);
        }
    }
};

/**
 * Helper para añadir índices de forma segura en MySQL (idempotente)
 */
const addIndexSafe = async (connection, tableName, indexName, column) => {
    try {
        await connection.query(`CREATE INDEX ${indexName} ON ${tableName}(${column})`);
        console.log(`[DB] Índice creado: ${indexName} en ${tableName}(${column})`);
    } catch (err) {
        // Ignorar si el índice ya existe
        if (err.code === 'ER_DUP_KEYNAME') {
            console.log(`[DB] Índice ya existe: ${indexName} en ${tableName}`);
        } else {
            console.warn(`[DB] Error creando índice ${indexName}: ${err.message}`);
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
            survey_json JSON,
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
            hotmart_id VARCHAR(255),
            limits_config JSON,
            ui_features JSON,
            is_active BOOLEAN DEFAULT TRUE,
            is_recommended BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 8. SYSTEM SETTINGS TABLE (NEW)
        await connection.query(`CREATE TABLE IF NOT EXISTS system_settings (
            setting_key VARCHAR(50) PRIMARY KEY,
            setting_value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 9. USAGE LOGS TABLE (NEW - For Monthly Quotas)
        await connection.query(`CREATE TABLE IF NOT EXISTS usage_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            resource_type VARCHAR(50) NOT NULL, -- 'project', 'landing', 'article'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 10. SYSTEM ACTIVITY LOGS (NEW - For Admin Audit)
        await connection.query(`CREATE TABLE IF NOT EXISTS system_activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NULL, -- NULL if user deleted
            user_name VARCHAR(255), -- Snapshot of name
            action_type VARCHAR(50) NOT NULL, -- LOGIN, REGISTER, CREATE_PAGE, DELETE_PROJECT, etc.
            entity_type VARCHAR(50), -- page, article, user
            entity_id VARCHAR(255),
            details TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        // 11. USER PAYMENTS TABLE (NEW)
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

        // 12. CRM TABLES (NEW)
        await connection.query(`CREATE TABLE IF NOT EXISTS user_subscriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            plan_slug VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            hotmart_purchase_id VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await connection.query(`CREATE TABLE IF NOT EXISTS crm_contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL, -- Owner (Producer)
            page_id INT NULL, -- Source Landing Page
            name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(50),
            country VARCHAR(100),
            address TEXT,
            source VARCHAR(255), -- 'Landing Page: X' or 'Manual'
            status VARCHAR(50) DEFAULT 'new', -- new, contacted, interested, closed, lost
            interest_level VARCHAR(50) DEFAULT 'cold', -- cold, warm, hot
            last_contacted_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await connection.query(`CREATE TABLE IF NOT EXISTS crm_activities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contact_id INT NOT NULL,
            type VARCHAR(50), -- note, status_change, system, lead_submission
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES crm_contacts(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        ////////// Actualización: Creación de tabla novedadestips para el sistema de noticias - 07/06/2025 10:00 //////////
        await connection.query(`CREATE TABLE IF NOT EXISTS novedadestips (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            icon_type VARCHAR(50) DEFAULT 'update', -- update, tip, ia
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        ////////// Fin de actualización - 07/06/2025 10:00 //////////

        /* */ /* Actualización: Creación de tablas email_sequences y email_messages para persistencia de secuencias - 24/06/2024 16:20 */
        await connection.query(`CREATE TABLE IF NOT EXISTS email_sequences (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            project_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'borrador',
            tag_name VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

        await connection.query(`CREATE TABLE IF NOT EXISTS email_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sequence_id INT NOT NULL,
            day_index INT NOT NULL,
            subject VARCHAR(255),
            pilar_type VARCHAR(100),
            purpose TEXT,
            content_html LONGTEXT,
            is_generated BOOLEAN DEFAULT FALSE,
            type VARCHAR(50) DEFAULT 'conversion',
            redirect_type VARCHAR(50),
            redirect_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (sequence_id) REFERENCES email_sequences(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        /* Fin de actualización - 24/06/2024 16:20 */

        ////////// Actualización: Tabla única whatsapp_lanzamientos con columna JSON - 10/06/2025 11:15 //////////
        await connection.query(`CREATE TABLE IF NOT EXISTS whatsapp_lanzamientos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            project_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'borrador',
            data_json LONGTEXT, -- Almacena el array de los 14 momentos inmersos
            launch_date DATE, -- Añadido: Fecha de lanzamiento persistente
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        ////////// Fin de actualización - 10/06/2025 11:15 //////////

        ////////// Actualización: Tabla para seguimiento de Proyectos Maestros desbloqueados - 05/03/2025 10:00 //////////
        await connection.query(`CREATE TABLE IF NOT EXISTS unlocked_projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            project_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY user_project (user_id, project_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        ////////// Fin de actualización - 05/03/2025 10:00 //////////

        ////////// Actualización: Tabla para Tickets de Soporte - 12/06/2025 //////////
        await connection.query(`CREATE TABLE IF NOT EXISTS support_tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id ${userIdType} NOT NULL,
            user_name VARCHAR(255),
            user_email VARCHAR(255),
            item_name VARCHAR(255),
            reason TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        ////////// Fin de actualización //////////

        ////////// Actualización: Tabla unificada para el sistema dinámico de Hooks de Atracción - 01/01/2026 //////////
        await connection.query(`CREATE TABLE IF NOT EXISTS project_hooks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            project_id INT NOT NULL,
            master_hook_id INT NULL,
            title VARCHAR(255) NOT NULL,
            psychological_strategy TEXT,
            landing_page_url VARCHAR(255),
            content_json JSON,
            is_generated BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        ////////// Fin de actualización - 01/01/2026 //////////

        // Tablas existentes del sistema (Projects, Pages, etc.)
        await addColumnSafe(connection, 'projects', "plan_id INT NULL");
        await addColumnSafe(connection, 'projects', "plan_slug VARCHAR(50) NULL");

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
                    strategy_json LONGTEXT,
                    project_strategy_json LONGTEXT,
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
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                name: 'articles',
                query: `CREATE TABLE IF NOT EXISTS articles (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id ${userIdType} NOT NULL,
                    project_id INT NULL,
                    master_article_id INT NULL,
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
                    email_subject VARCHAR(255),
                    email_body LONGTEXT,
                    psychological_strategy JSON NULL,
                    status VARCHAR(50) DEFAULT 'published',
                    is_active BOOLEAN DEFAULT TRUE,
                    is_generated BOOLEAN DEFAULT FALSE,
                    unlocked_at DATETIME NULL,
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
            await connection.query(table.query);
        }

        // Migraciones adicionales
        await addColumnSafe(connection, 'projects', "strategy_json LONGTEXT");
        await addColumnSafe(connection, 'projects', "project_strategy_json LONGTEXT");
        await addColumnSafe(connection, 'projects', "full_price DECIMAL(10,2) DEFAULT 0");
        await addColumnSafe(connection, 'projects', "commission_rate DECIMAL(5,4) DEFAULT 0");
        await addColumnSafe(connection, 'projects', "lead_magnet_type VARCHAR(100)");
        await addColumnSafe(connection, 'projects', "sales_page_url VARCHAR(500)");
        await addColumnSafe(connection, 'projects', "lead_magnet_url VARCHAR(500)");
        await addColumnSafe(connection, 'projects', "multimedia_json JSON");
        ////////// Actualización: Columna para marcar proyectos maestros - 05/03/2025 10:00 //////////
        await addColumnSafe(connection, 'projects', "is_master BOOLEAN DEFAULT FALSE");
        await addColumnSafe(connection, 'projects', "is_active BOOLEAN DEFAULT TRUE");
        ////////// Fin de actualización - 05/03/2025 10:00 //////////
        ////////// Actualización: Columna para identificar el origen de un proyecto clonado - 05/03/2025 10:00 //////////
        await addColumnSafe(connection, 'projects', "master_parent_id INT NULL");
        ////////// Fin de actualización - 05/03/2025 10:00 //////////
        await addColumnSafe(connection, 'projects', "digital_product_url VARCHAR(500)");
        
        /* */ /* Actualización: Eliminación de la creación de la columna redundante short_description en la tabla projects, centralizando su almacenamiento dentro de strategy_json - 25/06/2024 11:30 */
        // await addColumnSafe(connection, 'projects', "short_description VARCHAR(255)");
        /* Fin de actualización - 25/06/2024 11:30 */

        await addColumnSafe(connection, 'articles', "email_subject VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "email_body LONGTEXT");
        await addColumnSafe(connection, 'articles', "slug VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "featured_image VARCHAR(500)");
        await addColumnSafe(connection, 'articles', "meta_title VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "meta_description TEXT");
        await addColumnSafe(connection, 'articles', "status VARCHAR(50) DEFAULT 'published'");
        await addColumnSafe(connection, 'articles', "is_active BOOLEAN DEFAULT TRUE");
        await addColumnSafe(connection, 'articles', "published_at DATETIME DEFAULT CURRENT_TIMESTAMP");
        await addColumnSafe(connection, 'articles', "page_id INT NULL");
        await addColumnSafe(connection, 'articles', "project_id INT NULL");
        await addColumnSafe(connection, 'articles', "master_article_id INT NULL");
        await addColumnSafe(connection, 'articles', "is_generated BOOLEAN DEFAULT FALSE");
        await addColumnSafe(connection, 'articles', "unlocked_at DATETIME NULL");
        await addColumnSafe(connection, 'articles', "psychological_strategy JSON NULL");
        await addColumnSafe(connection, 'users', "role VARCHAR(50) DEFAULT 'user'");
        await addColumnSafe(connection, 'users', "plan_limits JSON NULL");
        await addColumnSafe(connection, 'users', "avatar_url VARCHAR(500)");
        await addColumnSafe(connection, 'users', "birth_date DATE");
        await addColumnSafe(connection, 'users', "custom_redirect_url VARCHAR(500)");
        await addColumnSafe(connection, 'users', "max_hooks INT NULL");
        
        // --- Migraciones para Hotmart (Enfoque Híbrido) ---
        await addColumnSafe(connection, 'users', "phone VARCHAR(50)");
        await addColumnSafe(connection, 'users', "country VARCHAR(100)");
        await addColumnSafe(connection, 'users', "hotmart_metadata JSON");
        
        await addColumnSafe(connection, 'user_subscriptions', "subscriber_code VARCHAR(255)");
        await addColumnSafe(connection, 'user_subscriptions', "offer_code VARCHAR(255)");
        await addColumnSafe(connection, 'user_subscriptions', "expires_at DATETIME NULL");
        
        await addColumnSafe(connection, 'user_payments', "transaction_id VARCHAR(255)");
        // --------------------------------------------------
        
        await addColumnSafe(connection, 'users', "stripe_customer_id VARCHAR(255)");
        await addColumnSafe(connection, 'users', "subscription_id VARCHAR(255)");
        await addColumnSafe(connection, 'users', "subscription_status VARCHAR(50)");
        
        await addColumnSafe(connection, 'plans', "stripe_price_id VARCHAR(255)");
        ////////// Se asegura columna hotmart_id en la tabla plans - 24/05/2025 10:30 //////////
        await addColumnSafe(connection, 'plans', "hotmart_id VARCHAR(255)");
        ////////// Fin de actualización - 24/05/2025 10:30 //////////
        ////////// Se añade columna hotmart_offer para soportar códigos de oferta específicos - 25/05/2025 15:30 //////////
        await addColumnSafe(connection, 'plans', "hotmart_offer VARCHAR(255)");
        ////////// Fin de actualización - 25/05/2025 15:30 //////////
        ////////// Se añade columna hotmart_checkout_mode para soportar modos de checkout personalizados - 25/05/2025 18:45 //////////
        await addColumnSafe(connection, 'plans', "hotmart_checkout_mode VARCHAR(50)");
        ////////// Fin de actualización - 25/05/2025 18:45 //////////
        
        await addColumnSafe(connection, 'lesson_comments', "is_approved BOOLEAN DEFAULT TRUE");
        await addColumnSafe(connection, 'courses', "badge_text VARCHAR(100) DEFAULT 'Certificado'");
        await addColumnSafe(connection, 'courses', "order_index INT DEFAULT 0");
        await addColumnSafe(connection, 'courses', "is_active BOOLEAN DEFAULT TRUE");

        ////////// Actualización: Asegurar existencia de columna synced en tabla leads para integración Systeme.io - 15/06/2025 16:30 //////////
        await addColumnSafe(connection, 'leads', "synced BOOLEAN DEFAULT FALSE");
        ////////// Fin de actualización - 15/06/2025 16:30 //////////

        // NEW: THANK YOU PAGE JSON COLUMN
        await addColumnSafe(connection, 'landing_pages', "thankyoupage_json JSON");

        // NEW: PROJECT ID IN LANDING PAGES
        await addColumnSafe(connection, 'landing_pages', "project_id INT NULL");

        ////////// Migración para WhatsApp Lanzamientos: Fecha de inicio persistente //////////
        await addColumnSafe(connection, 'whatsapp_lanzamientos', "launch_date DATE");
        ////////// Fin de migración //////////

        ////////// Migración para Hooks de Atracción //////////
        await addColumnSafe(connection, 'project_hooks', "title VARCHAR(255) NOT NULL");
        await addColumnSafe(connection, 'project_hooks', "psychological_strategy TEXT");
        await addColumnSafe(connection, 'project_hooks', "content_json JSON");
        
        /* Actualización: Adición de columna is_generated a project_hooks para gestión */
        await addColumnSafe(connection, 'project_hooks', "is_generated BOOLEAN DEFAULT FALSE");

        /* Actualización: Adición de columna landing_page_url a project_hooks para evitar errores de persistencia */
        await addColumnSafe(connection, 'project_hooks', "landing_page_url VARCHAR(255)");

        /* Actualización: Adición de columna is_active a project_hooks para control de visibilidad */
        await addColumnSafe(connection, 'project_hooks', "is_active BOOLEAN DEFAULT TRUE");

        /* Actualización: Columnas para separación de secuencias de email y persistencia de redirección - 21/03/2026 */
        await dropColumnSafe(connection, 'email_sequences', "type");
        await addColumnSafe(connection, 'email_messages', "type VARCHAR(50) DEFAULT 'conversion'");
        await addColumnSafe(connection, 'email_messages', "redirect_type VARCHAR(50)");
        await addColumnSafe(connection, 'email_messages', "redirect_url TEXT");
        
        try {
            await connection.query(`ALTER TABLE email_messages ADD UNIQUE INDEX idx_seq_day (sequence_id, day_index)`);
        } catch (e) {
            // Ignore if index already exists
        }
        ////////// Fin de migración //////////

        ////////// LIMPIEZA DE COLUMNAS OBSOLETAS (DATOS BASURA) //////////
        await dropColumnSafe(connection, 'projects', 'short_description');
        await dropColumnSafe(connection, 'projects', 'strategy');
        ////////// FIN DE LIMPIEZA //////////

        try {
            // Attempt to add FK. If it fails (exists), ignore.
            await connection.query(`ALTER TABLE landing_pages ADD CONSTRAINT fk_landing_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL`);
        } catch (e) {
            // Ignore constraint already exists or similar safe errors
        }

        try {
            await connection.query(`ALTER TABLE articles ADD CONSTRAINT fk_articles_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL`);
        } catch (e) {
            // Ignore
        }

        // --- OPTIMIZACIÓN: CREACIÓN DE ÍNDICES PARA ELIMINAR "Out of sort memory" ---
        console.log('[DB Init] 404 Creando índices de optimización...');
        await addIndexSafe(connection, 'landing_pages', 'idx_lp_created_at', 'created_at');
        await addIndexSafe(connection, 'projects', 'idx_proj_created_at', 'created_at');
        await addIndexSafe(connection, 'articles', 'idx_art_created_at', 'created_at');

        // --- SEED SYSTEM SETTINGS ---
        await connection.query(`
            INSERT IGNORE INTO system_settings (setting_key, setting_value) 
            VALUES ('after_login_url', '/dashboard/training/bienvenida')
        `);

        ////////// Inicialización de método de pago activo predeterminado - 24/05/2025 10:30 //////////
        await connection.query(`
            INSERT IGNORE INTO system_settings (setting_key, setting_value) 
            VALUES ('active_payment_method', 'stripe')
        `);
        ////////// Fin de actualización - 24/05/2025 10:30 //////////

        ////////// Inicialización de modo del sistema (Producción por defecto) - 08/06/2025 //////////
        await connection.query(`
            INSERT IGNORE INTO system_settings (setting_key, setting_value) 
            VALUES ('system_mode', 'production')
        `);
        ////////// Fin de actualización //////////

        // --- SEED PLANS ---
        const [existingPlans] = await connection.query("SELECT id FROM plans LIMIT 1");
        if (existingPlans.length === 0) {
            console.log('[DB Init] 🌱 Insertando planes por defecto...');
            const plans = [
                {
                    name: 'Plan 1 (Starter)',
                    slug: 'starter',
                    description: 'Plan base para todos los proyectos.',
                    price: 0,
                    stripeId: '',
                    limits: JSON.stringify({
                        planName: 'starter',
                        maxProjects: 1,
                        maxLandings: 1, 
                        maxArticles: 2, 
                        maxDomains: 1, 
                        maxEmailSequences: 1,
                        maxWhatsAppLaunches: 1,
                        maxHooks: 10,
                        features: { 
                            whatsappBot: false, 
                            blogGenerator: false, 
                            emailMarketing: false, 
                            removeBranding: false,
                            emailStrategy: false,
                            evergreenStrategy: false
                        }
                    }),
                    features: JSON.stringify(['1 Proyecto Activo', 'Contenidos Limitados', 'Sin Dominio Propio', 'Marca de Agua']),
                    is_rec: false
                }
            ];

            // Añadir planes del 1 al 10 (Niveles 2 al 11)
            for (let i = 1; i <= 10; i++) {
                plans.push({
                    name: `Plan Max ${i}`,
                    slug: `plan-max-${i}`,
                    description: `Desbloquea el proyecto ${i+1} con todas las funciones profesionales.`,
                    price: 19.99,
                    stripeId: '', 
                    limits: JSON.stringify({
                        planName: `plan-max-${i}`,
                        maxProjects: 1,
                        maxLandings: 20,
                        maxArticles: 20,
                        maxDomains: 3, 
                        maxEmailSequences: 5,
                        maxWhatsAppLaunches: 5,
                        maxHooks: 50,
                        features: { 
                            whatsappBot: true, 
                            blogGenerator: true, 
                            emailMarketing: true, 
                            removeBranding: true,
                            emailStrategy: true,
                            evergreenStrategy: true
                        }
                    }),
                    features: JSON.stringify([`Proyecto ${i+1} Desbloqueado`, 'Dominios Personalizados', 'Sin Marca de Agua', 'IA Avanzada']),
                    is_rec: i === 1 // Plan Max 1 es el recomendado por defecto
                });
            }

            for (const p of plans) {
                await connection.query(
                    `INSERT INTO plans (name, slug, description, price_monthly, stripe_price_id, limits_config, ui_features, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [p.name, p.slug, p.description, p.price, p.stripeId, p.limits, p.features, p.is_rec]
                );
            }
        } else {
            await connection.query(`UPDATE plans SET stripe_price_id = 'price_1SdGwIRJVKdziYWKRDtjacOl' WHERE slug = 'max' AND (stripe_price_id IS NULL OR stripe_price_id = '')`);
        }

        // --- DATOS SEMILLA (SEED DATA) ---
        const [existingCourses] = await connection.query("SELECT id FROM courses LIMIT 1");
        if (existingCourses.length === 0) {
            console.log('[DB Init] 🌱 Insertando datos semilla de cursos...');
            
            // CURSO 1: PRODUCTOS DIGITALES
            const [c1] = await connection.query(`INSERT INTO courses (title, subtitle, description, slug, badge_text, order_index, is_active) VALUES (?, ?, ?, ?, ?, 1, 1)`, [
                'Productos Digitales', 
                'Curso Intensivo', 
                'Aprende a crear, validar y vender tu primer infoproducto desde cero. Descubre las estrategias que usan los grandes productores para facturar miles de dólares en Hotmart.',
                'digital-products',
                'Certificado Oficial'
            ]);
            const c1Id = c1.insertId;

            const [m1] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [c1Id, 'Módulo 1: Fundamentos y Mentalidad', 1]);
            const [m2] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [c1Id, 'Módulo 2: Creación del Producto', 2]);
            const [m3] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [c1Id, 'Módulo 3: Configuración en Hotmart', 3]);

            const pointsM1 = JSON.stringify(['Mentalidad de éxito', 'Nichos de mercado', 'Validación']);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m1.insertId, 'Bienvenida al Curso', '5:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Introducción al mundo de los infoproductos.', pointsM1, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m1.insertId, 'Mentalidad de Productor vs Afiliado', '12:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Cómo pensar para ganar.', pointsM1, 2]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m1.insertId, 'El Mapa del Tesoro: Nichos Rentables', '15:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Encuentra tu océano azul.', pointsM1, 3]);

            const pointsM2 = JSON.stringify(['Estructura de un curso', 'Grabación básica', 'Materiales PDF']);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m2.insertId, 'Estructura de un Curso Ganador', '20:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Diseña tu temario.', pointsM2, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m2.insertId, 'Grabación y Edición Básica', '18:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Herramientas low-cost.', pointsM2, 2]);

            const pointsM3 = JSON.stringify(['Hotmart setup', 'Subida de archivos', 'Checkout']);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m3.insertId, 'Registro y Configuración de Cuenta', '08:00', 'https://www.youtube.com/embed/dQw4w9XcQ?rel=0&autoplay=1', 'Primeros pasos en la plataforma.', pointsM3, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m3.insertId, 'Subiendo tu Producto Paso a Paso', '25:00', 'https://www.youtube.com/embed/dQw4w9XcQ?rel=0&autoplay=1', 'Configuración técnica.', pointsM3, 2]);


            // CURSO 2: INTELIGENCIA ARTIFICIAL
            const [c2] = await connection.query(`INSERT INTO courses (title, subtitle, description, slug, badge_text, order_index, is_active) VALUES (?, ?, ?, ?, ?, 2, 1)`, [
                'Inteligencia Artificial', 
                'Masterclass', 
                'Domina las herramientas de IA que están revolucionando el marketing. Aprende a usar ChatGPT y Gemini para automatizar la creación de contenido y soporte.',
                'ai',
                'IA Expert'
            ]);
            const c2Id = c2.insertId;
            
            const [aim1] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [c2Id, 'Introducción a la IA Generativa', 1]);
            const pointsAi = JSON.stringify(['Prompt Engineering', 'Gemini vs GPT', 'Casos de uso']);
            
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [aim1.insertId, 'Qué es Gemini y ChatGPT', '10:00', 'https://www.youtube.com/embed/SChXl9k5r6E?rel=0&autoplay=1', 'Fundamentos de LLMs.', pointsAi, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [aim1.insertId, 'Ingeniería de Prompts Básica', '15:00', 'https://www.youtube.com/embed/SChXl9k5r6E?rel=0&autoplay=1', 'Cómo hablar con la máquina.', pointsAi, 2]);
        }

        ////////// Actualización: Inserción de datos semilla para novedadestips - 07/06/2025 10:00 //////////
        const [existingNews] = await connection.query("SELECT id FROM novedadestips LIMIT 1");
        if (existingNews.length === 0) {
            console.log('[DB Init] 🌱 Insertando datos semilla de novedades...');
            const seedNews = [
                {
                    title: 'Nueva Estructura VSL Optimizada',
                    content: 'Hemos actualizado el motor de IA para generar guiones de video más persuasivos basados en la estructura de Jim Edwards.',
                    icon_type: 'update'
                },
                {
                    title: 'Tip de la IA: Tasa de Rebote',
                    content: 'Tu landing de "Uñas Pro" tiene una carga lenta. Optimiza las imágenes para mejorar el posicionamiento SEO.',
                    icon_type: 'ia'
                },
                {
                    title: 'Masterclass: Cierre por WhatsApp',
                    content: 'Ya disponible en la Academia la nueva lección sobre cómo usar el CRM para recuperar carritos abandonados.',
                    icon_type: 'tip'
                }
            ];
            for (const news of seedNews) {
                await connection.query(
                    'INSERT INTO novedadestips (title, content, icon_type, created_at) VALUES (?, ?, ?, NOW())',
                    [news.title, news.content, news.icon_type]
                );
            }
        }
        ////////// Fin de actualización - 07/06/2025 10:00 //////////

        // Reactivar checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✨ [DB Init] Base de datos sincronizada y semilla insertada.');

    } catch (error) {
        console.error('❌ [DB Init] Error durante la inicialización:', error);
    } finally {
        connection.release();
    }
};

export default initDb;
