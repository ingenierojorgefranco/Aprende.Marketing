import 'dotenv/config';
import pool from './backend/db.js';

async function run() {
  const [plans] = await pool.query('SELECT slug, name, limits_config FROM plans');
  console.log('--- PLANS ---');
  console.log(JSON.stringify(plans, null, 2));

  const [users] = await pool.query('SELECT id, name, email, plan_limits, max_hooks FROM users WHERE email = ?', ['jackfort@gmail.com']);
  console.log('--- USER ---');
  console.log(JSON.stringify(users, null, 2));

  process.exit(0);
}
run();
