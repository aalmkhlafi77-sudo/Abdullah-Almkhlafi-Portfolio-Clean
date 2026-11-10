import 'dotenv/config';

import { loadConfig } from '../config.js';
import { checkDatabase, createDbPool } from '../db.js';

const config = loadConfig();
const pool = createDbPool(config);

try {
  const health = await checkDatabase(pool);
  process.stdout.write(`${JSON.stringify(health)}\n`);
  if (!health.ok) process.exitCode = 1;
} finally {
  await pool.end();
}
