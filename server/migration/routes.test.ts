import assert from 'node:assert/strict';
import test from 'node:test';

import express from 'express';
import request from 'supertest';

import { ContentConflictError } from '../content/service.js';
import { SnapshotValidationError } from '../content/schema.js';
import { createImportRouter } from './routes.js';

const appFor = (importContent: () => Promise<never>) => {
  const app = express();
  app.use(express.json());
  app.use((_req, _res, next) => { _req.admin = { id: 1, username: 'test' }; next(); });
  app.use('/api/admin', createImportRouter(async () => importContent()));
  return app;
};

test('import route reports current draft version on conflict', async () => {
  const response = await request(appFor(async () => { throw new ContentConflictError(8); }))
    .post('/api/admin/content/import').send({ snapshot: {}, expectedDraftVersion: 7 });
  assert.equal(response.status, 409);
  assert.deepEqual(response.body, { error: 'CONTENT_CONFLICT', currentVersion: 8 });
});

test('import route distinguishes malformed backup from database failure', async () => {
  const bad = await request(appFor(async () => { throw new SnapshotValidationError('MISSING_FIELD', 'Missing pages'); }))
    .post('/api/admin/content/import').send({ snapshot: {}, expectedDraftVersion: 0 });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error, 'MISSING_FIELD');
  const broken = await request(appFor(async () => { throw new Error('private database details'); }))
    .post('/api/admin/content/import').send({ snapshot: {}, expectedDraftVersion: 0 });
  assert.equal(broken.status, 500);
  assert.equal(broken.body.error, 'IMPORT_STORAGE_FAILED');
  assert.doesNotMatch(JSON.stringify(broken.body), /private database details/);
});
