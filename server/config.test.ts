import assert from 'node:assert/strict';
import test from 'node:test';

import { loadConfig } from './config.js';
import { checkDatabase, type QueryablePool } from './db.js';

const validEnv = (): NodeJS.ProcessEnv => ({
  NODE_ENV: 'production',
  PORT: '3000',
  DB_HOST: '127.0.0.1',
  DB_PORT: '3306',
  DB_NAME: 'u820178529_portfolio',
  DB_USER: 'u820178529_portfolioapp',
  DB_PASSWORD: 'not-a-real-secret',
  PUBLIC_ORIGIN: 'https://almkhlafi.carpetbazar.org',
  UPLOAD_ROOT: '/tmp/portfolio-media',
  TRUST_PROXY: '1',
});

test('rejects missing DB_PASSWORD', () => {
  const env = validEnv();
  delete env.DB_PASSWORD;

  assert.throws(() => loadConfig(env), /DB_PASSWORD/);
});

test('rejects missing PUBLIC_ORIGIN', () => {
  const env = validEnv();
  delete env.PUBLIC_ORIGIN;

  assert.throws(() => loadConfig(env), /PUBLIC_ORIGIN/);
});

test('accepts Hostinger loopback MySQL settings without logging the password', () => {
  const originalLog = console.log;
  const messages: unknown[][] = [];
  console.log = (...args: unknown[]) => messages.push(args);
  try {
    const config = loadConfig(validEnv());
    assert.equal(config.db.host, '127.0.0.1');
    assert.equal(config.db.port, 3306);
    assert.equal(config.db.password, 'not-a-real-secret');
    assert.deepEqual(messages, []);
  } finally {
    console.log = originalLog;
  }
});

test('rejects invalid ports and non-http public origins', () => {
  assert.throws(() => loadConfig({ ...validEnv(), DB_PORT: 'not-a-port' }), /DB_PORT/);
  assert.throws(() => loadConfig({ ...validEnv(), PUBLIC_ORIGIN: 'javascript:alert(1)' }), /PUBLIC_ORIGIN/);
});

test('parses the Hostinger reverse-proxy hop count explicitly', () => {
  assert.equal(loadConfig(validEnv()).trustProxy, 1);
  assert.throws(() => loadConfig({ ...validEnv(), TRUST_PROXY: 'all' }), /TRUST_PROXY/);
});

test('database health checks all six tables and main_site without mutation queries', async () => {
  const statements: string[] = [];
  const pool: QueryablePool = {
    async query(sql: string) {
      statements.push(sql);
      if (sql.includes('information_schema.tables')) {
        return [[
          { tableName: 'admins' },
          { tableName: 'admin_sessions' },
          { tableName: 'audit_logs' },
          { tableName: 'content_versions' },
          { tableName: 'media_files' },
          { tableName: 'site_documents' },
        ], []] as never;
      }
      if (sql.includes('site_documents')) return [[{ documentKey: 'main_site' }], []] as never;
      return [[{ ok: 1 }], []] as never;
    },
  };

  const health = await checkDatabase(pool);

  assert.deepEqual(health, { ok: true, missingTables: [], mainSitePresent: true });
  assert.equal(statements.length, 3);
  assert.equal(statements.every((sql) => /^\s*(SELECT|SHOW)\b/i.test(sql)), true);
});

test('database health reports unavailable without leaking the driver error', async () => {
  const pool: QueryablePool = {
    async query() {
      throw new Error('password=should-never-leak');
    },
  };

  assert.deepEqual(await checkDatabase(pool), {
    ok: false,
    missingTables: [],
    mainSitePresent: false,
    error: 'DATABASE_UNAVAILABLE',
  });
});
