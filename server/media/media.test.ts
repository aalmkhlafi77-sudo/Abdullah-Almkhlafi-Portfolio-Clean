import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import express from 'express';
import request from 'supertest';

import type { PortfolioSnapshotV1 } from '../content/schema.js';
import type { MediaRecord, MediaRepository } from './repository.js';
import { createMediaRouter, deleteMediaAsset, isMediaReferenced } from './routes.js';
import { detectImageType, detectVideoType, resolveMediaPath, storeImage, storeVideo } from './storage.js';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z7S8AAAAASUVORK5CYII=',
  'base64',
);
const MP4 = Buffer.from('000000186674797069736f6d0000000069736f6d6d703431', 'hex');

const emptySnapshot = (): PortfolioSnapshotV1 => ({
  schemaVersion: 1,
  profile: {} as PortfolioSnapshotV1['profile'],
  metrics: [], services: [], solutions: [], projects: [], articles: [], mediaList: [], pages: [], showcaseApps: [],
  showcaseBarConfig: {} as PortfolioSnapshotV1['showcaseBarConfig'],
  cvResumeData: {} as PortfolioSnapshotV1['cvResumeData'],
  heroConfig: {} as PortfolioSnapshotV1['heroConfig'],
  brandVideoUrl: '', savedAt: '2026-10-04T00:00:00.000Z',
});

test('detects the real image signature and rejects a declared type mismatch', async () => {
  assert.deepEqual(await detectImageType(PNG), { ext: 'png', mime: 'image/png' });
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-media-'));
  try {
    await assert.rejects(
      () => storeImage(Buffer.from('not an image'), { ext: 'png', mime: 'image/png' }, root),
      /signature/i,
    );
    assert.deepEqual(await readdir(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('stores accepted images under random names and returns a permanent media URL', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-media-'));
  try {
    const stored = await storeImage(PNG, { ext: 'png', mime: 'image/png' }, root);
    assert.match(stored.storageName, /^[a-f0-9-]{36}\.png$/);
    assert.equal(stored.publicUrl, `/media/${stored.storageName}`);
    assert.deepEqual(await readdir(root), [stored.storageName]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('accepts an MP4 signature and stores bytes under the persistent upload root (not a codec/playback test)', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-video-'));
  try {
    assert.deepEqual(await detectVideoType(MP4), { ext: 'mp4', mime: 'video/mp4' });
    const stored = await storeVideo(MP4, root);
    assert.match(stored.storageName, /^[a-f0-9-]{36}\.mp4$/);
    assert.equal(stored.publicUrl, `/media/${stored.storageName}`);
    assert.deepEqual(await readFile(stored.absolutePath), MP4);
    await assert.rejects(() => storeVideo(Buffer.from('not a video'), root), /video|signature/i);
    assert.deepEqual(await readdir(root), [stored.storageName]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('authenticated video upload confirms a durable URL only after storage and database registration', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-video-'));
  const records: MediaRecord[] = [];
  const repository: MediaRepository = {
    async insert(record) { records.push(record); return record; },
    async findById() { return null; },
    async delete() {},
  };
  const app = express();
  app.use((req, _res, next) => { req.admin = { id: 1, username: 'admin' }; next(); });
  app.use(createMediaRouter({ repository, uploadRoot: root,
    getDraft: async () => ({ snapshot: emptySnapshot() }),
    getPublished: async () => ({ snapshot: emptySnapshot() }),
  }));
  try {
    const response = await request(app).post('/videos').attach('file', MP4, 'clip.mp4');
    assert.equal(response.status, 201);
    assert.match(response.body.publicUrl, /^\/media\/[a-f0-9-]{36}\.mp4$/);
    assert.equal(records[0].mimeType, 'video/mp4');
    assert.deepEqual(await readFile(path.join(root, records[0].storageName)), MP4);
    const invalid = await request(app).post('/videos').attach('file', PNG, 'clip.mp4');
    assert.equal(invalid.status, 400);
    assert.equal(records.length, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('video upload failure removes its staged file and does not report success', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-video-'));
  const repository: MediaRepository = {
    async insert() { throw new Error('database unavailable'); },
    async findById() { return null; }, async delete() {},
  };
  const app = express();
  app.use((req, _res, next) => { req.admin = { id: 1, username: 'admin' }; next(); });
  app.use(createMediaRouter({ repository, uploadRoot: root,
    getDraft: async () => ({ snapshot: emptySnapshot() }),
    getPublished: async () => ({ snapshot: emptySnapshot() }),
  }));
  try {
    const response = await request(app).post('/videos').attach('file', MP4, 'clip.mp4');
    assert.equal(response.status, 500);
    assert.deepEqual(await readdir(root), []);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('rejects manipulated media paths outside the upload root', () => {
  assert.throws(() => resolveMediaPath('/srv/portfolio-media', '../outside.png'), /path/i);
  assert.throws(() => resolveMediaPath('/srv/portfolio-media', '/absolute.png'), /path/i);
});

test('detects exact media URL references anywhere in a snapshot', () => {
  const value = emptySnapshot();
  value.profile = { avatarUrl: '/media/used.png' } as PortfolioSnapshotV1['profile'];
  assert.equal(isMediaReferenced(value, '/media/used.png'), true);
  assert.equal(isMediaReferenced(value, '/media/not-used.png'), false);
});

test('refuses deletion when a media URL is used by draft or published content', async () => {
  const record: MediaRecord = {
    id: 'media-1', storageName: 'used.png', originalName: 'used.png', mimeType: 'image/png',
    sizeBytes: PNG.length, publicUrl: '/media/used.png', createdBy: 1,
  };
  let removed = false;
  const repository: MediaRepository = {
    async insert(value) { return value; },
    async findById() { return record; },
    async delete() { removed = true; },
  };
  const draft = emptySnapshot();
  draft.profile = { avatarUrl: record.publicUrl } as PortfolioSnapshotV1['profile'];

  await assert.rejects(
    () => deleteMediaAsset(record.id, { repository, uploadRoot: os.tmpdir(), draft, published: emptySnapshot() }),
    /referenced/i,
  );
  assert.equal(removed, false);
});

test('keeps the stored image when deleting its database record fails', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-media-'));
  try {
    const stored = await storeImage(PNG, { ext: 'png', mime: 'image/png' }, root);
    const record: MediaRecord = {
      id: 'media-1', storageName: stored.storageName, originalName: 'image.png',
      mimeType: 'image/png', sizeBytes: PNG.length, publicUrl: stored.publicUrl, createdBy: 1,
    };
    const repository: MediaRepository = {
      async insert(value) { return value; },
      async findById() { return record; },
      async delete() { throw new Error('database unavailable'); },
    };
    await assert.rejects(
      () => deleteMediaAsset(record.id, { repository, uploadRoot: root, draft: emptySnapshot(), published: null }),
      /database unavailable/,
    );
    assert.deepEqual(await readFile(stored.absolutePath), PNG);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('does not delete media when the published-content lookup fails', async () => {
  const record: MediaRecord = {
    id: 'media-1', storageName: 'image.png', originalName: 'image.png',
    mimeType: 'image/png', sizeBytes: PNG.length, publicUrl: '/media/image.png', createdBy: 1,
  };
  let deleted = false;
  const repository: MediaRepository = {
    async insert(value) { return value; },
    async findById() { return record; },
    async delete() { deleted = true; },
  };
  const app = express();
  app.use((req, _res, next) => { req.admin = { id: 1, username: 'admin' }; next(); });
  app.use(createMediaRouter({
    repository, uploadRoot: os.tmpdir(),
    getDraft: async () => ({ snapshot: emptySnapshot() }),
    getPublished: async () => { throw new Error('database unavailable'); },
  }));

  const response = await request(app).delete('/media/media-1');
  assert.equal(response.status, 500);
  assert.equal(deleted, false);
});

test('an image upload reports a server failure when database registration fails', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-media-'));
  try {
    const repository: MediaRepository = {
      async insert() { throw new Error('database unavailable'); },
      async findById() { return null; },
      async delete() {},
    };
    const app = express();
    app.use((req, _res, next) => { req.admin = { id: 1, username: 'admin' }; next(); });
    app.use(createMediaRouter({
      repository, uploadRoot: root,
      getDraft: async () => ({ snapshot: emptySnapshot() }),
      getPublished: async () => ({ snapshot: emptySnapshot() }),
    }));

    const response = await request(app).post('/media').attach('file', PNG, 'image.png');
    assert.equal(response.status, 500);
    assert.deepEqual(await readdir(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
