import 'dotenv/config';
import pool from './backend/db.js';

async function run() {
  try {
    const [pRows] = await pool.query('SELECT id, name, niche, master_parent_id, is_master FROM projects WHERE id = 61');
    console.log('Project 61 Info:', pRows[0]);
    if (pRows[0] && pRows[0].master_parent_id) {
      const [mRows] = await pool.query('SELECT id, name, niche, is_master FROM projects WHERE id = ?', [pRows[0].master_parent_id]);
      console.log('Master Parent Info:', mRows[0]);
    }

    const [userHooks] = await pool.query('SELECT id, project_id, title, is_generated, master_hook_id FROM project_hooks WHERE project_id = 61');
    console.log('User Hooks for 61:', userHooks);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
run();
