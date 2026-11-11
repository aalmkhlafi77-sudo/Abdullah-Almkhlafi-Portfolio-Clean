import assert from 'node:assert/strict';
import test from 'node:test';

import { Router } from 'express';
import multer from 'multer';
import request from 'supertest';

import { createApp } from './app.js';

const router = (path: string, body: unknown) => {
  const value = Router();
  value.get(path, (_req, res) => res.json(body));
  return value;
};

const makeApp = (overrides: Partial<Parameters<typeof createApp>[0]> = {}) => createApp({
  publicOrigin: 'https://almkhlafi.carpetbazar.org',
  uploadRoot: '/tmp/portfolio-app-test-media',
  distDir: '/tmp/portfolio-app-test-dist',
  trustProxy: 1,
  checkHealth: async () => ({ ok: true, missingTables: [], mainSitePresent: true }),
  authRouter: router('/ping', { auth: true }),
  publicRouter: router('/content', { published: true }),
  adminRouter: router('/ping', { admin: true }),
  mediaRouter: Router(),
  ...overrides,
});

test('health endpoint returns 503 when MySQL health fails without leaking details', async () => {
  const response = await request(makeApp({
    checkHealth: async () => ({
      ok: false, missingTables: [], mainSitePresent: false, error: 'DATABASE_UNAVAILABLE',
    }),
  })).get('/api/health');

  assert.equal(response.status, 503);
  assert.deepEqual(response.body, { ok: false, database: 'unavailable' });
});

test('public content remains readable through the public API namespace', async () => {
  const response = await request(makeApp()).get('/api/public/content');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { published: true });
});

test('browser policy permits trusted video embeds and HTTPS media without opening script sources', async () => {
  const response = await request(makeApp()).get('/api/health');
  const policy = response.headers['content-security-policy'] as string;
  assert.match(policy, /frame-src[^;]*https:\/\/www\.youtube-nocookie\.com[^;]*https:\/\/player\.vimeo\.com/);
  assert.match(policy, /media-src[^;]*https:/);
  assert.match(policy, /connect-src 'self'/);
  assert.doesNotMatch(policy, /script-src[^;]*'unsafe-eval'/);
});

test('rejects JSON bodies larger than 25 MiB', async () => {
  const response = await request(makeApp())
    .post('/api/auth/ping')
    .set('Origin', 'https://almkhlafi.carpetbazar.org')
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({ payload: 'x'.repeat(25 * 1024 * 1024) }));

  assert.equal(response.status, 413);
  assert.deepEqual(response.body, { error: 'PAYLOAD_TOO_LARGE' });
});

test('unexpected server errors never return a stack trace', async () => {
  const broken = Router();
  broken.get('/boom', () => { throw new Error('mysql password=secret stack marker'); });
  const response = await request(makeApp({ publicRouter: broken })).get('/api/public/boom');

  assert.equal(response.status, 500);
  assert.deepEqual(response.body, { error: 'INTERNAL_ERROR' });
  assert.equal(response.text.includes('stack marker'), false);
  assert.equal(response.text.includes('password=secret'), false);
});

test('oversized video receives 413 rather than an unexplained server error', async () => {
  const oversized = Router();
  oversized.post('/videos', (_req, _res, next) => next(new multer.MulterError('LIMIT_FILE_SIZE')));
  const response = await request(makeApp({ adminRouter: oversized })).post('/api/admin/videos')
    .set('Origin', 'https://almkhlafi.carpetbazar.org');
  assert.equal(response.status, 413);
  assert.deepEqual(response.body, { error: 'UPLOAD_TOO_LARGE' });
});
