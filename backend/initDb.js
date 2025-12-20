


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

        // Tablas existentes del sistema (Projects, Pages, etc.)
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
            await connection.query(table.query);
        }

        // Migraciones adicionales
        await addColumnSafe(connection, 'projects', "strategy_json LONGTEXT");
        await addColumnSafe(connection, 'articles', "slug VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "featured_image VARCHAR(500)");
        await addColumnSafe(connection, 'articles', "meta_title VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "meta_description TEXT");
        await addColumnSafe(connection, 'articles', "status VARCHAR(50) DEFAULT 'published'");
        await addColumnSafe(connection, 'articles', "published_at DATETIME DEFAULT CURRENT_TIMESTAMP");
        await addColumnSafe(connection, 'articles', "page_id INT NULL");
        await addColumnSafe(connection, 'users', "role VARCHAR(50) DEFAULT 'user'");
        await addColumnSafe(connection, 'users', "plan_limits JSON NULL");
        await addColumnSafe(connection, 'users', "avatar_url VARCHAR(500)");
        await addColumnSafe(connection, 'users', "birth_date DATE");
        await addColumnSafe(connection, 'users', "custom_redirect_url VARCHAR(500)");
        
        await addColumnSafe(connection, 'users', "stripe_customer_id VARCHAR(255)");
        await addColumnSafe(connection, 'users', "subscription_id VARCHAR(255)");
        await addColumnSafe(connection, 'users', "subscription_status VARCHAR(50)");
        
        await addColumnSafe(connection, 'plans', "stripe_price_id VARCHAR(255)");
        
        await addColumnSafe(connection, 'lesson_comments', "is_approved BOOLEAN DEFAULT TRUE");
        await addColumnSafe(connection, 'courses', "badge_text VARCHAR(100) DEFAULT 'Certificado'");
        await addColumnSafe(connection, 'courses', "order_index INT DEFAULT 0");
        await addColumnSafe(connection, 'courses', "is_active BOOLEAN DEFAULT TRUE");

        // NEW: THANK YOU PAGE JSON COLUMN
        await addColumnSafe(connection, 'landing_pages', "thankyoupage_json JSON");

        // NEW: PROJECT ID IN LANDING PAGES
        await addColumnSafe(connection, 'landing_pages', "project_id INT NULL");
        try {
            // Attempt to add FK. If it fails (exists), ignore.
            await connection.query(`ALTER TABLE landing_pages ADD CONSTRAINT fk_landing_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL`);
        } catch (e) {
            // Ignore constraint already exists or similar safe errors
        }

        // --- SEED SYSTEM SETTINGS ---
        await connection.query(`
            INSERT IGNORE INTO system_settings (setting_key, setting_value) 
            VALUES ('after_login_url', '/dashboard/training/bienvenida')
        `);

        // --- SEED PLANS ---
        const [existingPlans] = await connection.query("SELECT id FROM plans LIMIT 1");
        if (existingPlans.length === 0) {
            console.log('[DB Init] 🌱 Insertando planes por defecto...');
            const plans = [
                {
                    name: 'Starter',
                    slug: 'starter',
                    description: 'Ideal para empezar sin riesgo.',
                    price: 0,
                    stripeId: '',
                    limits: JSON.stringify({
                        planName: 'starter',
                        maxProjects: 1,
                        maxLandings: 2, 
                        maxArticles: 2, 
                        features: { 
                            whatsappBot: false, 
                            blogGenerator: false, 
                            emailMarketing: false, 
                            removeBranding: false,
                            emailStrategy: false,
                            evergreenStrategy: false
                        }
                    }),
                    features: JSON.stringify(['1 Proyecto / Mes', '2 Landing Pages / Mes', '2 Artículos / Mes', 'IA Básica', 'Marca de Agua']),
                    is_rec: false
                },
                {
                    name: 'Pro',
                    slug: 'pro',
                    description: 'Para Productores y Afiliados serios.',
                    price: 19.99,
                    stripeId: 'price_1SdFBGRJVKdziYWKjz1MXdy1', 
                    limits: JSON.stringify({
                        planName: 'pro',
                        maxProjects: 5,
                        maxLandings: 20,
                        maxArticles: 20,
                        features: { 
                            whatsappBot: true, 
                            blogGenerator: true, 
                            emailMarketing: true, 
                            removeBranding: true,
                            emailStrategy: true, // Only 7-day enabled
                            evergreenStrategy: false
                        }
                    }),
                    features: JSON.stringify(['5 Proyectos / Mes', '20 Landings / Mes', '20 Artículos / Mes', 'Bot WhatsApp', 'IA Avanzada', 'Sin Marca de Agua', 'Estrategia Email (7 Días)']),
                    is_rec: true
                },
                {
                    name: 'Max',
                    slug: 'max',
                    description: 'Agencias y Escala masiva.',
                    price: 49.99,
                    stripeId: 'price_1SdGwIRJVKdziYWKRDtjacOl', 
                    limits: JSON.stringify({
                        planName: 'max',
                        maxProjects: 100,
                        maxLandings: 500,
                        maxArticles: 500,
                        features: { 
                            whatsappBot: true, 
                            blogGenerator: true, 
                            emailMarketing: true, 
                            removeBranding: true,
                            emailStrategy: true,
                            evergreenStrategy: true // Both enabled
                        }
                    }),
                    features: JSON.stringify(['Ilimitado', 'Soporte Prioritario', 'API Access', 'Todo Incluido', 'Estrategia Email Completa (30 Días)']),
                    is_rec: false
                }
            ];

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

            const pointsM2 = JSON.stringify(['Estructura de curso', 'Grabación básica', 'Materiales PDF']);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m2.insertId, 'Estructura de un Curso Ganador', '20:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Diseña tu temario.', pointsM2, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m2.insertId, 'Grabación y Edición Básica', '18:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Herramientas low-cost.', pointsM2, 2]);

            const pointsM3 = JSON.stringify(['Hotmart setup', 'Subida de archivos', 'Checkout']);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m3.insertId, 'Registro y Configuración de Cuenta', '08:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Primeros pasos en la plataforma.', pointsM3, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m3.insertId, 'Subiendo tu Producto Paso a Paso', '25:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Configuración técnica.', pointsM3, 2]);


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

        // Reactivar checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✨ [DB Init] Base de datos sincronizada y semilla insertada.');

    } catch (error) {
        console.error('❌ [DB Init] Error durante la inicialización:', error);
    } finally {
        connection.release();
    }
};

module.exports = initDb;