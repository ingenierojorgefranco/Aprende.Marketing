import pool from './backend/db.js';

async function checkSchema() {
  try {
    const [cols] = await pool.query("SHOW COLUMNS FROM projects");
    console.log("PROJECTS COLUMNS:", cols.map(c => c.Field));
    process.exit(0);
  } catch (err) {
    console.error("ERROR CHECKING SCHEMA:", err);
    process.exit(1);
  }
}

checkSchema();
