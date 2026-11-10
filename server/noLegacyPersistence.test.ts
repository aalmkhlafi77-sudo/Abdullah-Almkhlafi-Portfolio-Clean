import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const sourceFiles = async (root: string): Promise<string[]> => {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    if (!/\.(ts|tsx)$/.test(entry.name) || entry.name.endsWith('.test.ts')) return [];
    return [target];
  }));
  return nested.flat();
};

test('production sources contain no Firebase client or locally persisted admin credentials', async () => {
  const files = [
    ...await sourceFiles(path.resolve('src')),
    ...await sourceFiles(path.resolve('server')),
  ];
  const violations: string[] = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    if (/from\s+['"]firebase(?:\/[^'"]*)?['"]/.test(content)) violations.push(`${file}: firebase import`);
    if (/\bsafeSetDoc\b/.test(content)) violations.push(`${file}: safeSetDoc`);
    if (/STORAGE_KEYS\.ADMIN_CREDS/.test(content)) violations.push(`${file}: local admin credentials`);
  }

  assert.deepEqual(violations, []);
});
