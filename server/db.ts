import mysql, { type Pool } from 'mysql2/promise';

import type { AppConfig } from './config.js';

export const REQUIRED_TABLES = [
  'admins',
  'admin_sessions',
  'audit_logs',
  'content_versions',
  'media_files',
  'site_documents',
] as const;

export interface QueryablePool {
  query(sql: string, values?: unknown[]): Promise<[unknown[], unknown]>;
}

export interface DatabaseHealth {
  ok: boolean;
  missingTables: string[];
  mainSitePresent: boolean;
  error?: 'DATABASE_UNAVAILABLE';
}

export const createDbPool = (config: AppConfig): Pool => mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  connectionLimit: config.db.connectionLimit,
  waitForConnections: true,
  enableKeepAlive: true,
  charset: 'utf8mb4',
  timezone: 'Z',
  decimalNumbers: true,
});

export const checkDatabase = async (pool: QueryablePool): Promise<DatabaseHealth> => {
  try {
    await pool.query('SELECT 1 AS ok');
    const [tableRows] = await pool.query(
      `SELECT table_name AS tableName
       FROM information_schema.tables
       WHERE table_schema = DATABASE()
         AND table_name IN (?, ?, ?, ?, ?, ?)`,
      [...REQUIRED_TABLES],
    );
    const present = new Set(
      (tableRows as Array<{ tableName: string }>).map((row) => row.tableName),
    );
    const missingTables = REQUIRED_TABLES.filter((table) => !present.has(table));

    const [documentRows] = await pool.query(
      `SELECT document_key AS documentKey
       FROM site_documents
       WHERE document_key = 'main_site'
       LIMIT 1`,
    );
    const mainSitePresent = (documentRows as Array<{ documentKey: string }>).length === 1;

    return { ok: missingTables.length === 0 && mainSitePresent, missingTables, mainSitePresent };
  } catch {
    return {
      ok: false,
      missingTables: [],
      mainSitePresent: false,
      error: 'DATABASE_UNAVAILABLE',
    };
  }
};
