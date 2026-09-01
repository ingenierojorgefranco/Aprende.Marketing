import 'dotenv/config';
import pool from './backend/db.js';

async function run() {
  const [rows] = await pool.query('SELECT strategy_json FROM projects WHERE is_master = 1 LIMIT 1');
  console.log(rows[0].strategy_json);
  process.exit(0);
}
run();
