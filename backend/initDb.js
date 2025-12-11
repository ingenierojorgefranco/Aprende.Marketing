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
            last_login_at DATETIME
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

        for (const table of tables) {
            await connection.query(table.query);
        }

        // Migraciones adicionales
        await addColumnSafe(connection, 'articles', "slug VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "featured_image VARCHAR(500)");
        await addColumnSafe(connection, 'articles', "meta_title VARCHAR(255)");
        await addColumnSafe(connection, 'articles', "meta_description TEXT");
        await addColumnSafe(connection, 'articles', "status VARCHAR(50) DEFAULT 'published'");
        await addColumnSafe(connection, 'articles', "published_at DATETIME DEFAULT CURRENT_TIMESTAMP");
        await addColumnSafe(connection, 'articles', "page_id INT NULL");
        await addColumnSafe(connection, 'users', "role VARCHAR(50) DEFAULT 'user'");
        await addColumnSafe(connection, 'users', "plan_limits JSON NULL");
        // NEW MIGRATIONS FOR USER PROFILE
        await addColumnSafe(connection, 'users', "avatar_url VARCHAR(500)");
        await addColumnSafe(connection, 'users', "birth_date DATE");
        // NEW MIGRATION FOR CUSTOM REDIRECT
        await addColumnSafe(connection, 'users', "custom_redirect_url VARCHAR(500)");
        
        // Nuevas migraciones para Cursos y Comentarios
        await addColumnSafe(connection, 'lesson_comments', "is_approved BOOLEAN DEFAULT TRUE");
        await addColumnSafe(connection, 'courses', "badge_text VARCHAR(100) DEFAULT 'Certificado'");
        await addColumnSafe(connection, 'courses', "order_index INT DEFAULT 0");

        // --- SEED SYSTEM SETTINGS ---
        // Insert default redirect if not exists
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
                    limits: JSON.stringify({
                        planName: 'starter',
                        maxProjects: 1,
                        maxLandings: 3,
                        features: { whatsappBot: false, blogGenerator: false, emailMarketing: false, removeBranding: false }
                    }),
                    features: JSON.stringify(['1 Proyecto / Nicho', '3 Landing Pages', 'IA Básica', 'Marca de Agua']),
                    is_rec: false
                },
                {
                    name: 'Pro',
                    slug: 'pro',
                    description: 'Para Productores y Afiliados serios.',
                    price: 19.99,
                    limits: JSON.stringify({
                        planName: 'pro',
                        maxProjects: 5,
                        maxLandings: 20,
                        features: { whatsappBot: true, blogGenerator: true, emailMarketing: true, removeBranding: true }
                    }),
                    features: JSON.stringify(['5 Proyectos', '20 Landing Pages', 'Bot WhatsApp', 'IA Avanzada', 'Sin Marca de Agua']),
                    is_rec: true
                },
                {
                    name: 'Max',
                    slug: 'max',
                    description: 'Agencias y Escala masiva.',
                    price: 49.99,
                    limits: JSON.stringify({
                        planName: 'max',
                        maxProjects: 100,
                        maxLandings: 500,
                        features: { whatsappBot: true, blogGenerator: true, emailMarketing: true, removeBranding: true }
                    }),
                    features: JSON.stringify(['Proyectos Ilimitados', 'Soporte Prioritario', 'API Access', 'Todo Incluido']),
                    is_rec: false
                }
            ];

            for (const p of plans) {
                await connection.query(
                    `INSERT INTO plans (name, slug, description, price_monthly, limits_config, ui_features, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [p.name, p.slug, p.description, p.price, p.limits, p.features, p.is_rec]
                );
            }
        }

        // --- DATOS SEMILLA (SEED DATA) ---
        // Insertar cursos por defecto si no existen
        const [existingCourses] = await connection.query("SELECT id FROM courses LIMIT 1");
        if (existingCourses.length === 0) {
            console.log('[DB Init] 🌱 Insertando datos semilla de cursos...');
            
            // CURSO 1: PRODUCTOS DIGITALES
            const [c1] = await connection.query(`INSERT INTO courses (title, subtitle, description, slug, badge_text, order_index) VALUES (?, ?, ?, ?, ?, 1)`, [
                'Productos Digitales', 
                'Curso Intensivo', 
                'Aprende a crear, validar y vender tu primer infoproducto desde cero. Descubre las estrategias que usan los grandes productores para facturar miles de dólares en Hotmart.',
                'digital-products',
                'Certificado Oficial'
            ]);
            const c1Id = c1.insertId;

            // Módulos Curso 1
            const [m1] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [c1Id, 'Módulo 1: Fundamentos y Mentalidad', 1]);
            const [m2] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [c1Id, 'Módulo 2: Creación del Producto', 2]);
            const [m3] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [c1Id, 'Módulo 3: Configuración en Hotmart', 3]);

            // Lecciones Módulo 1
            const pointsM1 = JSON.stringify(['Mentalidad de éxito', 'Nichos de mercado', 'Validación']);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m1.insertId, 'Bienvenida al Curso', '5:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Introducción al mundo de los infoproductos.', pointsM1, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m1.insertId, 'Mentalidad de Productor vs Afiliado', '12:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Cómo pensar para ganar.', pointsM1, 2]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m1.insertId, 'El Mapa del Tesoro: Nichos Rentables', '15:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Encuentra tu océano azul.', pointsM1, 3]);

            // Lecciones Módulo 2
            const pointsM2 = JSON.stringify(['Estructura de curso', 'Grabación básica', 'Materiales PDF']);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m2.insertId, 'Estructura de un Curso Ganador', '20:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Diseña tu temario.', pointsM2, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m2.insertId, 'Grabación y Edición Básica', '18:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Herramientas low-cost.', pointsM2, 2]);

            // Lecciones Módulo 3
            const pointsM3 = JSON.stringify(['Hotmart setup', 'Subida de archivos', 'Checkout']);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m3.insertId, 'Registro y Configuración de Cuenta', '08:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Primeros pasos en la plataforma.', pointsM3, 1]);
            await connection.query(`INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [m3.insertId, 'Subiendo tu Producto Paso a Paso', '25:00', 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1', 'Configuración técnica.', pointsM3, 2]);


            // CURSO 2: INTELIGENCIA ARTIFICIAL
            const [c2] = await connection.query(`INSERT INTO courses (title, subtitle, description, slug, badge_text, order_index) VALUES (?, ?, ?, ?, ?, 2)`, [
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