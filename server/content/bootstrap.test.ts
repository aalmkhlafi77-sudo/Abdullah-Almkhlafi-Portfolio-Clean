import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { createDefaultSnapshot } from '../../src/lib/defaultSnapshot.js';
import { ensureDefaultSiteDocument } from './bootstrap.js';

type Row = { draft: unknown; draftVersion: number; published: unknown; publishedVersion: number };

const fakePool = (initial: Row | null) => {
  let row = initial;
  let writes = 0;
  let versions = 0;
  return {
    get row() { return row; },
    get writes() { return writes; },
    get versions() { return versions; },
    async getConnection() {
      let staged = structuredClone(row);
      let stagedWrites = writes;
      let stagedVersions = versions;
      return {
        async beginTransaction() {},
        async execute(sql: string, values: unknown[] = []) {
          let changed = 0;
          if (sql.startsWith('INSERT IGNORE INTO site_documents')) {
            if (!staged) {
              staged = { draft: JSON.parse(values[0] as string), draftVersion: 1, published: JSON.parse(values[1] as string), publishedVersion: 1 };
              stagedWrites += 1; changed = 1;
            }
          } else if (sql.startsWith('UPDATE site_documents')) {
            if (staged && Object.keys(staged.draft as object).length === 0 && staged.draftVersion === 0 && staged.published === null && staged.publishedVersion === 0) {
              staged.draft = JSON.parse(values[0] as string);
              staged.published = JSON.parse(values[1] as string);
              staged.draftVersion = 1;
              staged.publishedVersion = 1;
              stagedWrites += 1; changed = 1;
            }
          } else if (sql.startsWith('INSERT INTO content_versions')) {
            stagedVersions += 1; changed = 1;
          } else throw new Error('Unexpected SQL');
          return [{ affectedRows: changed }, []] as const;
        },
        async commit() { row = staged; writes = stagedWrites; versions = stagedVersions; },
        async rollback() {},
        release() {},
      };
    },
  };
};

test('new database gets the complete GitHub default snapshot only once', async () => {
  const pool = fakePool(null);
  await ensureDefaultSiteDocument(pool);
  assert.equal((pool.row?.draft as { pages: unknown[] }).pages.length, 7);
  assert.equal((pool.row?.draft as { pages: Array<{ elements: unknown[] }> }).pages.reduce((n, p) => n + p.elements.length, 0), 30);
  assert.equal((pool.row?.draft as { projects: unknown[] }).projects.length, 7);
  assert.equal((pool.row?.published as { pages: unknown[] } | null)?.pages.length, 7);
  assert.equal(pool.row?.publishedVersion, 1);
  await ensureDefaultSiteDocument(pool);
  assert.equal(pool.writes, 1);
  assert.equal(pool.versions, 1);
});

test('untouched schema sentinel is initialized, but a saved empty draft is respected', async () => {
  const sentinel = fakePool({ draft: {}, draftVersion: 0, published: null, publishedVersion: 0 });
  await ensureDefaultSiteDocument(sentinel);
  assert.equal((sentinel.row?.draft as { pages: unknown[] }).pages.length, 7);

  const deliberate = fakePool({ draft: { ...createDefaultSnapshot(), pages: [], projects: [] }, draftVersion: 3, published: null, publishedVersion: 0 });
  await ensureDefaultSiteDocument(deliberate);
  assert.equal((deliberate.row?.draft as { pages: unknown[] }).pages.length, 0);
  assert.equal(deliberate.writes, 0);
});

test('existing trial draft and publication are never overwritten on restart', async () => {
  const pool = fakePool({ draft: { ...createDefaultSnapshot(), pages: [], mediaList: [{ id: 'trial' }] }, draftVersion: 5, published: { pages: [] }, publishedVersion: 5 });
  await ensureDefaultSiteDocument(pool);
  assert.equal(pool.writes, 0);
  assert.equal((pool.row?.draft as { mediaList: unknown[] }).mediaList.length, 1);
});

test('database bootstrap failure stops startup rather than returning a healthy empty site', async () => {
  await assert.rejects(() => ensureDefaultSiteDocument({ getConnection: async () => { throw new Error('database unavailable'); } }), /database unavailable/);
  const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
  assert.doesNotMatch(schema, /VALUES\s*\('main_site',\s*JSON_OBJECT\(\)\)/i);
});
