import 'dotenv/config';

import { MySqlAuthRepository } from '../auth/mysqlRepository.js';
import { hashPassword } from '../auth/password.js';
import { loadConfig } from '../config.js';
import { createDbPool } from '../db.js';

const username = process.env.INITIAL_ADMIN_USERNAME?.trim();
const password = process.env.INITIAL_ADMIN_PASSWORD;
if (!username) throw new Error('INITIAL_ADMIN_USERNAME is required');
if (!password || password.length < 12) throw new Error('INITIAL_ADMIN_PASSWORD must contain at least 12 characters');

const pool = createDbPool(loadConfig());
try {
  const repository = new MySqlAuthRepository(pool);
  if (await repository.findAdminByUsername(username)) {
    throw new Error('Admin already exists; no changes were made');
  }
  await repository.createAdmin({
    username,
    passwordHash: await hashPassword(password),
    isActive: true,
  });
  process.stdout.write(`Admin created: ${username}\n`);
} finally {
  await pool.end();
}
