
import pool from './db.js';

async function checkPlans() {
    try {
        const [rows] = await pool.query("SELECT id, name, slug, hotmart_id FROM plans");
        console.log("Plans in DB:");
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error("Error checking plans:", error);
        process.exit(1);
    }
}

checkPlans();
