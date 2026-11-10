import assert from 'node:assert/strict';
import test from 'node:test';

import express from 'express';
import request from 'supertest';

import { originGuard } from './originGuard.js';

const appWithGuard = () => {
  const app = express();
  app.use(originGuard('https://almkhlafi.carpetbazar.org'));
  app.get('/resource', (_req, res) => res.json({ ok: true }));
  app.post('/resource', (_req, res) => res.json({ ok: true }));
  return app;
};

test('allows public read requests regardless of Origin', async () => {
  const response = await request(appWithGuard())
    .get('/resource')
    .set('Origin', 'https://unrelated.example');
  assert.equal(response.status, 200);
});

test('rejects mutation requests from a different or missing Origin', async () => {
  const wrong = await request(appWithGuard())
    .post('/resource')
    .set('Origin', 'https://unrelated.example');
  const missing = await request(appWithGuard()).post('/resource');
  assert.equal(wrong.status, 403);
  assert.equal(missing.status, 403);
  assert.deepEqual(wrong.body, { error: 'ORIGIN_FORBIDDEN' });
});

test('allows mutation requests only from the configured public origin', async () => {
  const response = await request(appWithGuard())
    .post('/resource')
    .set('Origin', 'https://almkhlafi.carpetbazar.org');
  assert.equal(response.status, 200);
});
